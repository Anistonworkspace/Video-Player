# Firmware Web UI — Safe Local Browser Preview

This folder is the **preview layer** for the camera's firmware web UI. It does
**not** contain a copy of the UI — the UI is served live from
`firmware-work/05-web-ui-development/` (the editable copy) by the mock server in
`firmware-work/07-mock-camera-api/mock_camera_api.py`.

## What you get

- The **real, shipped** firmware web UI (`index.htm` + `main.js` + `main.css`)
  rendered in an ordinary browser (Chrome/Edge/Firefox).
- A **mock camera backend** answering `/cgi-bin/*` (e.g. `GetPreLoginInfo`).
- A **mock player bridge** on `127.0.0.1:54455` — the same port range
  (`54455`–`54465`) that `main.js` scans for the installed `VideoPlayTool`
  player — so the "please install the plugin" nag is satisfied by a fake.
- A safety **banner** + a labelled **MOCK VIDEO** placeholder over the native
  video region. The `VideoPlayTool://` launch is **blocked** in the browser.

## What it is NOT

- No real video decoding, no camera contact, no real authentication, no
  firmware emulation. Every backend/bridge response is a canned fake.
- The on-disk UI files are **never modified** — the preview adapter/banner is
  injected only in the HTTP response stream.

## Run it

From `firmware-work/07-mock-camera-api/`:

```powershell
python mock_camera_api.py
# then open http://127.0.0.1:8088/
```

Or use the launcher (from the project root):

```powershell
./scripts/preview-firmware-ui.ps1
```

Options: `--ui-port 8088`, `--bridge-port 54455`, `--no-inject` (serve the raw
shipped UI with no banner/adapter), `--bridge-only`.

## Files

| File | Purpose |
|------|---------|
| `assets/preview-adapter.js` | Browser-side safety shim (blocks player launch, banner, mock video overlay). Injected at serve time. |
| `assets/preview.css` | Banner + mock-video styling. |

## Honesty note (verification status)

The **login screen and shell render** and the plugin-detection path resolves
against the mock bridge. Deep live-view interactivity depends on obfuscated
`main.js` logic and device responses that are only partially mocked — anything
beyond "the UI renders and is navigable" is **best-effort and not fully
verified**. See `reports/final-setup-report.md` for the exact verified state.
