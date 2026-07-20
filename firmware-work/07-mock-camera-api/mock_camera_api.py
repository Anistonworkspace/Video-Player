#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
mock_camera_api.py  —  SAFE local mock for the XiongMai/GK7205V300 camera web UI.

WHAT THIS IS
    A stand-in for (a) the camera device backend and (b) the installed Windows
    "VideoPlayTool" local player bridge, so the firmware web UI can be previewed
    in a normal browser with NO camera hardware and NO real player installed.

WHAT THIS IS NOT
    * It does NOT emulate real firmware, real ARM binaries, real codecs, real
      streaming, or real authentication. All responses are canned fakes.
    * It never touches docs-recources/ and never modifies the extracted UI.

It binds TWO local ports (mirrors the real split: device origin vs. plugin origin):
    --ui-port     (default 8088)  -> serves the web UI + mock /cgi-bin/* device API
    --bridge-port (default 54455) -> mock local-player bridge (/Cmd-WebLocalCtrl),
                                     the same port range (54455-54465) main.js scans.

Everything is served from 127.0.0.1 only. Read-only to the source tree: the UI
files are streamed as-is; the preview adapter is *injected at serve time* and the
on-disk dev files are never modified.

Usage:
    python mock_camera_api.py [--ui-port 8088] [--bridge-port 54455]
                              [--web-root ../05-web-ui-development]
                              [--preview-assets ../06-browser-preview/assets]
                              [--no-inject]   # serve raw UI without preview banner/adapter
"""
import argparse
import json
import os
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_WEB_ROOT = os.path.normpath(os.path.join(HERE, "..", "05-web-ui-development"))
DEFAULT_ASSETS = os.path.normpath(os.path.join(HERE, "..", "06-browser-preview", "assets"))

MIME = {
    ".htm": "text/html; charset=utf-8", ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8",
    ".bin": "application/octet-stream", ".ico": "image/x-icon",
}

# A labelled placeholder "video frame" (SVG) — proves the region renders, decodes nothing.
PLACEHOLDER_SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">'
    '<rect width="100%" height="100%" fill="#101418"/>'
    '<rect x="1" y="1" width="638" height="358" fill="none" stroke="#2b3440"/>'
    '<text x="320" y="168" fill="#5cff9d" font-family="monospace" font-size="22" '
    'text-anchor="middle">MOCK VIDEO — no camera</text>'
    '<text x="320" y="200" fill="#8aa0b2" font-family="monospace" font-size="13" '
    'text-anchor="middle">GK7205V300 web UI preview (safe local mock)</text>'
    '</svg>'
)


def cors(h):
    h.send_header("Access-Control-Allow-Origin", "*")
    h.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    h.send_header("Access-Control-Allow-Headers", "*")


def read_json_body(handler):
    try:
        n = int(handler.headers.get("Content-Length", 0))
        raw = handler.rfile.read(n) if n else b""
        return json.loads(raw.decode("utf-8", "replace")) if raw else {}
    except Exception:
        return {}


class BaseHandler(BaseHTTPRequestHandler):
    server_version = "MockCameraLab/1.0"

    def log_message(self, fmt, *args):
        sys.stdout.write("  [%s:%s] %s\n" % (self.tag, self.server.server_address[1], fmt % args))

    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        cors(self)
        for k, v in (extra or {}):
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, b"")


# ---------------------------------------------------------------------------
# UI + device-CGI server (default 8088)
# ---------------------------------------------------------------------------
class UIHandler(BaseHandler):
    tag = "UI"
    web_root = DEFAULT_WEB_ROOT
    assets_dir = DEFAULT_ASSETS
    inject = True

    INJECT_HTML = (
        '\n<link rel="stylesheet" href="/__preview/preview.css">'
        '\n<script>window.__PREVIEW__=true;</script>'
        '\n<script src="/__preview/preview-adapter.js"></script>\n'
    )

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        if path.startswith("/__preview/"):
            return self._serve_asset(path[len("/__preview/"):])
        if path == "/__mock/frame.svg":
            return self._send(200, PLACEHOLDER_SVG, "image/svg+xml")

        if path in ("/", "/index.htm", "/index.html"):
            return self._serve_index()

        return self._serve_static(path)

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path.startswith("/cgi-bin/") or path.endswith(".cgi"):
            return self._device_cgi(path)
        # Unknown POST -> generic OK envelope
        return self._send(200, json.dumps({"Ret": 100, "mock": True}),
                          "application/json; charset=utf-8")

    # --- helpers ---
    def _safe(self, rel):
        rel = rel.lstrip("/").replace("\\", "/")
        full = os.path.normpath(os.path.join(self.web_root, rel))
        return full if full.startswith(os.path.normpath(self.web_root)) else None

    def _serve_index(self):
        f = os.path.join(self.web_root, "index.htm")
        if not os.path.isfile(f):
            return self._send(404, "index.htm not found in web root")
        data = open(f, "rb").read()
        if self.inject:
            low = data.lower()
            i = low.rfind(b"</body>")
            if i == -1:
                i = low.rfind(b"</html>")
            inj = self.INJECT_HTML.encode("utf-8")
            data = data[:i] + inj + data[i:] if i != -1 else data + inj
        self._send(200, data, "text/html; charset=utf-8")

    def _serve_static(self, path):
        full = self._safe(path)
        if not full or not os.path.isfile(full):
            return self._send(404, "not found: %s" % path)
        ext = os.path.splitext(full)[1].lower()
        self._send(200, open(full, "rb").read(), MIME.get(ext, "application/octet-stream"))

    def _serve_asset(self, rel):
        full = os.path.normpath(os.path.join(self.assets_dir, rel.replace("\\", "/")))
        if not full.startswith(os.path.normpath(self.assets_dir)) or not os.path.isfile(full):
            return self._send(404, "preview asset not found: %s" % rel)
        ext = os.path.splitext(full)[1].lower()
        self._send(200, open(full, "rb").read(), MIME.get(ext, "text/plain; charset=utf-8"))

    def _device_cgi(self, path):
        body = read_json_body(self)
        name = (body or {}).get("Name", "")
        # GetPreLoginInfo: real firmware returns a random challenge for hashed auth.
        if name == "GetPreLoginInfo":
            resp = {"Ret": 100, "Name": "GetPreLoginInfo",
                    "GetPreLoginInfo": {"Random": "MOCK0000", "PreLoginCount": 0,
                                        "EncryptType": "MD5", "ChallengeCode": "MOCKCHALLENGE"},
                    "SessionID": "0x00000001", "mock": True}
        elif name in ("Login", "login"):
            resp = {"Ret": 100, "Name": "Login", "SessionID": "0x00000001",
                    "mock": True, "note": "mock accept — no real auth performed"}
        else:
            resp = {"Ret": 100, "Name": name or "Unknown", "SessionID": "0x00000001", "mock": True}
        self._send(200, json.dumps(resp), "application/json; charset=utf-8")


# ---------------------------------------------------------------------------
# Local-player bridge server (default 54455) — mocks the installed VideoPlayTool
# ---------------------------------------------------------------------------
class BridgeHandler(BaseHandler):
    tag = "BRIDGE"
    plugin_version = "2.0.0.0"

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        # main.js fetches plugin JS/HTML via $.get / $.getScript from this origin.
        if path.endswith(".js") or "WebStyle" in path:
            js = 'window.__MOCK_PLUGIN__=true; version_plugin="%s";' % self.plugin_version
            return self._send(200, js, "application/javascript; charset=utf-8")
        if path in ("/frame", "/frame.svg"):
            return self._send(200, PLACEHOLDER_SVG, "image/svg+xml")
        # Any GET -> advertise a present, compatible mock plugin.
        return self._send(200, json.dumps(self._plugin_info()),
                          "application/json; charset=utf-8")

    def do_POST(self):
        # /Cmd-WebLocalCtrl and any command -> success envelope with a good version.
        _ = read_json_body(self)
        self._send(200, json.dumps(self._plugin_info()),
                   "application/json; charset=utf-8")

    def _plugin_info(self):
        return {"Ret": 100, "Result": 0, "Version": self.plugin_version,
                "PluginVersion": self.plugin_version, "SetupName": "VideoPlayTool",
                "mock": True, "note": "mock local player bridge (no real decoding)"}


def serve(handler_cls, port, name):
    try:
        httpd = ThreadingHTTPServer(("127.0.0.1", port), handler_cls)
    except OSError as e:
        print("  [!] could not bind %s on 127.0.0.1:%d -> %s" % (name, port, e))
        return None
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    print("  [+] %-20s http://127.0.0.1:%d" % (name, port))
    return httpd


def serve_range(handler_cls, first, count, name):
    """Try to bind the first available port in [first, first+count).
    On Windows, 54455-54465 is often inside a reserved 'excluded port range'
    (WSL2/Hyper-V), so binding is best-effort and non-fatal."""
    for p in range(first, first + count):
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", p), handler_cls)
        except OSError:
            continue
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        print("  [+] %-20s http://127.0.0.1:%d" % (name, p))
        return httpd, p
    print("  [~] %s: ports %d-%d are not bindable on this host" % (name, first, first + count - 1))
    print("      (Windows excluded/reserved range - WSL2/Hyper-V). The browser-side")
    print("      preview adapter mocks the bridge in-page, so the preview still works.")
    return None, None


def main():
    ap = argparse.ArgumentParser(description="SAFE mock camera/player for firmware web UI preview")
    ap.add_argument("--ui-port", type=int, default=8088)
    ap.add_argument("--bridge-port", type=int, default=54455)
    ap.add_argument("--web-root", default=DEFAULT_WEB_ROOT)
    ap.add_argument("--preview-assets", default=DEFAULT_ASSETS)
    ap.add_argument("--no-inject", action="store_true", help="serve raw UI without preview adapter")
    ap.add_argument("--bridge-only", action="store_true", help="run only the player-bridge mock")
    args = ap.parse_args()

    UIHandler.web_root = os.path.abspath(args.web_root)
    UIHandler.assets_dir = os.path.abspath(args.preview_assets)
    UIHandler.inject = not args.no_inject

    print("=" * 68)
    print(" SAFE MOCK CAMERA / PLAYER  (no hardware, no real player, canned data)")
    print(" web root : %s" % UIHandler.web_root)
    print("=" * 68)

    servers = []
    if not args.bridge_only:
        servers.append(serve(UIHandler, args.ui_port, "Firmware web UI"))
        print("      -> open  http://127.0.0.1:%d/  in your browser" % args.ui_port)
    # Bridge: try the real scan range 54455-54465 first; fall back gracefully.
    bhttpd, bport = serve_range(BridgeHandler, args.bridge_port, 11, "Player bridge (mock)")
    servers.append(bhttpd)
    if bport is None and not args.bridge_only:
        print("      -> preview still works: the in-page adapter mocks the bridge.")
    print("=" * 68)
    print(" Press Ctrl+C to stop.")

    if not any(servers):
        sys.exit(1)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        print("\n  [x] stopped.")


if __name__ == "__main__":
    main()
