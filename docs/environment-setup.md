# Environment Setup

How this local development environment is laid out and how to drive it. Nothing here
touches the original files in `docs-recources/` (read-only evidence).

## Host
- **OS:** Windows 11 Home Single Language 10.0.26200
- **Primary shell:** PowerShell
- **Secondary:** Bash tool (POSIX/MSYS) for firmware scripts
- **Runtime dependency:** Python 3.12 (all preview servers + mocks run on it)

## Workspace map
```
Video Player/
├─ docs-recources/            READ-ONLY source evidence (never modified)
│    ├─ VideoPlayToolSetup.exe
│    └─ 000699N5.1IPC_GK7205V300_G5F...R02.zip
├─ exe-work/                  Windows player workspace
│    ├─ 00-original-copy/         verified copy of the .exe (read-only)
│    ├─ 01-static-analysis/       headers, strings, signature, version info
│    ├─ 02-extracted-original/    (pending 7-Zip approval) NSIS payload
│    ├─ 03-ui-assets-original/    (pending) icons / Qt resources / dialogs
│    ├─ 05-browser-preview/       labelled EXE UI MOCK (index.html/css/js)
│    └─ 06-sandbox-testing/       Windows Sandbox prep (.wsb) — approval only
├─ firmware-work/             Camera firmware workspace
│    ├─ 00-original-copy/         verified copy of the .zip (read-only)
│    ├─ 03-filesystems-original/  extracted cramfs/squashfs (READ-ONLY originals)
│    ├─ 04-web-ui-original/       pristine copy of the web UI + _custom-reference
│    ├─ 05-web-ui-development/    EDITABLE copy for the future redesign
│    └─ 06-browser-preview/       Python server + adapter + banner
├─ shared-tools/             (empty) place for approved local tools
├─ docs/                     this documentation
├─ scripts/                  PowerShell launchers + verifier
├─ reports/                  analysis + audit + final report
└─ COMMAND_LOG.md            full command log
```

## Scripts (all PowerShell, all safe)
| Script | Does | Safe? |
|--------|------|-------|
| `scripts/verify-environment.ps1` | Re-checks both source hashes + folder structure. Read-only. | ✔ no writes to sources |
| `scripts/preview-firmware-ui.ps1` | Serves the firmware web UI (dev copy) + mock banner in a browser. | ✔ loopback only |
| `scripts/preview-exe-ui.ps1` | Serves the labelled EXE UI **mock**. | ✔ loopback only |
| `scripts/run-mock-camera.ps1` | Starts the mock camera CGI/API so the web UI has something to talk to. | ✔ loopback only |
| `scripts/start-here.ps1` | Interactive menu that wraps the above. | ✔ |

## Quick start
```powershell
# 1) Confirm the originals are untouched
powershell -ExecutionPolicy Bypass -File .\scripts\verify-environment.ps1

# 2) Preview the firmware web UI (starts mock camera automatically if you use start-here)
powershell -ExecutionPolicy Bypass -File .\scripts\preview-firmware-ui.ps1
#    -> http://127.0.0.1:8080/index.htm

# 3) Preview the EXE UI mock
powershell -ExecutionPolicy Bypass -File .\scripts\preview-exe-ui.ps1
#    -> http://127.0.0.1:8090/index.html

# Or just run the menu:
powershell -ExecutionPolicy Bypass -File .\scripts\start-here.ps1
```

## Networking note (important)
The Windows/Hyper-V/WSL reserved TCP range **54455–54465** is blocked for user binds
on this host (discovered during mock-service setup). All local services therefore use
ports **outside** that range: firmware UI **8080**, EXE mock **8090**, mock camera
**5000**, player bridge **5455**. Check `netsh interface ipv4 show excludedportrange protocol=tcp`
before picking new ports.
