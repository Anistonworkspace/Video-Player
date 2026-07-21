#!/usr/bin/env python3
"""
Real-UI preview server for the extracted VideoPlayTool web front-end.

Serves the *pristine* (or editable) Web/ folder as the web root, injects a
reconstructed native-shell host page (preview-real-ui/host/index.html),
supplies an offline jQuery (preview-real-ui/vendor/), and mocks the device /
plugin CGI endpoints so the real skin + screens render in a plain browser.

Nothing inside the real Web/ tree is ever modified: the host + vendor files
live under preview-real-ui/ and are served on virtual routes
(/  /__harness/*  /vendor/*).  Everything else maps to --web-root.

Usage:
    python serve.py --web-root "<path to Web>" [--host 127.0.0.1] [--port 8899]
"""
import argparse
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

HERE = os.path.dirname(os.path.abspath(__file__))
HOST_ROOT = os.path.join(HERE, "host")
VENDOR_ROOT = os.path.join(HERE, "vendor")
WEB_ROOT = ""  # set in main()

MIME = {
    ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon",
    ".bmp": "image/bmp", ".woff": "font/woff", ".woff2": "font/woff2",
    ".ttf": "font/ttf", ".eot": "application/vnd.ms-fontobject",
}
IMG_EXT = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".bmp")


def mime_for(path):
    _, ext = os.path.splitext(path.lower())
    return MIME.get(ext, "application/octet-stream")


def safe_join(root, urlpath):
    p = os.path.normpath(os.path.join(root, urlpath.lstrip("/")))
    if not p.startswith(os.path.normpath(root)):
        return None
    return p


def mock_response(path, name, data):
    """Canned JSON so the real front-end JS can proceed without a device."""
    if "Cmd-WebLocalCtrl" in path:
        return {"Ret": 100, "AutoPreviewNum": 1, "Version": "4.0.2.2",
                "Name": name or "Cmd-WebLocalCtrl"}
    if name == "GetPreLoginInfo" or "GetPreLoginInfo" in path:
        return {"Name": "GetPreLoginInfo", "Ret": 100, "SessionID": "0x00000001",
                "DataEncryptionType": "None", "EncryptType": "MD5",
                "RandomUser": "preview", "Realm": "preview"}
    return {"Name": name or "Unknown", "Ret": 100, "SessionID": "0x00000001"}


class Handler(BaseHTTPRequestHandler):
    server_version = "RealUIPreview/1.0"

    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            try:
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def _file(self, fullpath):
        try:
            with open(fullpath, "rb") as f:
                data = f.read()
        except OSError:
            return False
        self._send(200, data, mime_for(fullpath))
        return True

    def do_OPTIONS(self):
        self._send(204)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path in ("/", "/index.html"):
            if not self._file(os.path.join(HOST_ROOT, "index.html")):
                self._send(500, "missing host/index.html")
            return
        if path == "/__ping":
            self._send(200, "ok")
            return
        if path.startswith("/__harness/"):
            fp = safe_join(HOST_ROOT, path[len("/__harness"):])
            if not (fp and self._file(fp)):
                self._send(404, "harness 404: " + path)
            return
        if path.startswith("/vendor/"):
            fp = safe_join(VENDOR_ROOT, path[len("/vendor"):])
            if not (fp and self._file(fp)):
                self._send(404, "vendor 404: " + path)
            return
        if path.endswith(".cgi"):
            return self._mock(path, b"")
        # static from the real Web root
        fp = safe_join(WEB_ROOT, path)
        if fp and os.path.isfile(fp):
            self._file(fp)
            return
        # image fallback: bare/relative image names -> images_general (and Live/)
        base = os.path.basename(path)
        if base.lower().endswith(IMG_EXT):
            for alt in (os.path.join(WEB_ROOT, "images_general", base),
                        os.path.join(WEB_ROOT, "images_general", "Live", base)):
                if os.path.isfile(alt):
                    self._file(alt)
                    return
        self._send(404, "404: " + path)

    def do_POST(self):
        path = unquote(urlparse(self.path).path)
        try:
            ln = int(self.headers.get("Content-Length", "0") or 0)
        except ValueError:
            ln = 0
        body = self.rfile.read(ln) if ln else b""
        if path.endswith(".cgi") or "Cmd-WebLocalCtrl" in path or "GetPreLoginInfo" in path:
            return self._mock(path, body)
        self._send(404, "404: " + path)

    def _mock(self, path, body):
        name = ""
        try:
            data = json.loads(body.decode("utf-8", "ignore")) if body else {}
            if isinstance(data, dict):
                name = data.get("Name", "")
        except Exception:
            data = {}
        resp = mock_response(path, name, data)
        sys.stderr.write("  [mock] %s Name=%s\n" % (path, name or "-"))
        self._send(200, json.dumps(resp), "application/json; charset=utf-8")

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s %s\n" % (self.command if hasattr(self, "command") else "", fmt % args))


def main():
    global WEB_ROOT
    ap = argparse.ArgumentParser()
    ap.add_argument("--web-root", required=True)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8899)
    a = ap.parse_args()
    WEB_ROOT = os.path.abspath(a.web_root)
    if not os.path.isdir(WEB_ROOT):
        print("ERROR: --web-root not found:", WEB_ROOT)
        sys.exit(2)
    if not os.path.isfile(os.path.join(HOST_ROOT, "index.html")):
        print("ERROR: host/index.html missing under", HOST_ROOT)
        sys.exit(2)
    httpd = ThreadingHTTPServer((a.host, a.port), Handler)
    print("=" * 66)
    print(" Real-UI preview server")
    print("   web-root : %s" % WEB_ROOT)
    print("   open     : http://%s:%d/" % (a.host, a.port))
    print("=" * 66)
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
