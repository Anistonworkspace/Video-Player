# Video Player — Safe UI Inspection Lab

A **read-only inspection, extraction, preview, and documentation** environment for two
UIs, built so a UI-only redesign can happen **later** without ever risking the originals:

1. **Windows `VideoPlayTool` player** (from `VideoPlayToolSetup.exe`)
2. **Camera firmware web interface** (from the `GK7205V300` firmware `.zip`)

> ⚠️ **No redesign has been done.** This repo is the *environment* only:
> safe extraction, analysis, previews, mocks, docs, and editable dev copies.

## Golden rules (enforced throughout)
- `docs-recources/` is **READ-ONLY source evidence** — never modified, executed, flashed, or repacked.
- SHA-256 baselines recorded in `reports/source-hashes.txt`; re-check anytime with
  `scripts/verify-environment.ps1`.
- The unsigned installer is **never executed on the host**; firmware is **never flashed**.
- No binary patching, no signature/auth/protection bypass.
- UI edits (later) happen only in the **development copies**, never in extracted originals.

## Layout
| Folder | What |
|--------|------|
| `docs-recources/` | Original `.exe` + firmware `.zip` (read-only). |
| `exe-work/` | Windows player: copy, static analysis, EXE UI **mock**, sandbox prep. |
| `firmware-work/` | Firmware: extracted filesystems, pristine web UI, **editable** web UI copy, browser preview. |
| `scripts/` | PowerShell launchers + integrity verifier (all safe, loopback-only). |
| `docs/` | Environment, safety/scope, emulation research, redesign prep. |
| `reports/` | Static analyses, tool audit, hashes, final setup report. |
| `shared-tools/` | Empty; reserved for approved local tools. |
| `COMMAND_LOG.md` | Full command log. |

## Start here
```powershell
# Interactive menu (recommended)
powershell -ExecutionPolicy Bypass -File .\scripts\start-here.ps1
```
Or individually:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-environment.ps1     # integrity check
powershell -ExecutionPolicy Bypass -File .\scripts\run-mock-camera.ps1         # mock backend  :8088 + bridge :54455
powershell -ExecutionPolicy Bypass -File .\scripts\preview-firmware-ui.ps1     # firmware UI   :8088
powershell -ExecutionPolicy Bypass -File .\scripts\preview-exe-ui.ps1          # EXE UI mock   :8090
```

## Preview URLs
| UI | URL | Notes |
|----|-----|-------|
| Firmware web UI | http://127.0.0.1:8088/index.htm | Real extracted HTML/CSS/JS + in-page mock backend. Video pane needs the legacy ActiveX plugin (won't load in modern browsers) — navigation/layout preview only. |
| EXE player | http://127.0.0.1:8090/index.html | **Labelled mock**, not the real player. Real assets need 7-Zip approval. |

> **Ports:** firmware UI = `8088`; mock player bridge = `54455`. On this host `54455–54465` is inside a
> Windows/Hyper-V *excluded* range and can't be bound — the server detects this and the browser-side adapter
> mocks the bridge **in-page**, so the preview still works. Override with `-UiPort` / `-BridgePort` if needed.

## Status at a glance
- **Setup:** ✅ complete for everything non-destructive.
- **Waiting on you (approvals):** install **7-Zip** (real EXE UI assets); optional **WSL2 Ubuntu**;
  any installer execution / sandbox / virtualization.
- **Full firmware emulation:** ❌ not verified, not claimed — see `docs/firmware-emulation-research.md`.

## Key docs
- `reports/final-setup-report.md` — the consolidated report + next steps.
- `docs/safety-and-scope.md` — rule-by-rule compliance and do/don't-edit lists.
- `docs/ui-redesign-prep.md` — exactly where a future redesign happens.
- `reports/exe-static-analysis.md`, `reports/firmware-static-analysis.md`, `reports/ui-assets-map.md`.
