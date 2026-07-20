# Final Setup Report — Video Player UI Lab

**Task:** safe, non-destructive environment to inspect, preview, and later redesign
**only the UI** of (1) the Windows `VideoPlayTool` player and (2) the camera firmware
web interface. **No UI redesign performed** — environment only.

**Generated:** end of setup task · **Host:** Windows 11 Home SL 10.0.26200 · PowerShell 5.1 · Python 3.12

---

## 1. Setup status: **PARTIAL** (complete for everything non-destructive; blocked only on your approvals)

Everything that can be done safely and autonomously is done and **validated**. The only
remaining items require your explicit approval (tool install / elevation / sandbox) — see §4.

---

## 2. What was created
```
Video Player/
├─ docs-recources/              READ-ONLY originals (untouched, hashes verified)
├─ exe-work/
│  ├─ 00-original-copy/         working copy of the .exe (for analysis only)
│  ├─ 01-static-analysis/       PE/NSIS/Qt findings
│  ├─ 02-extracted-original/    (awaiting 7-Zip approval — empty)
│  ├─ 03-ui-assets-original/    (populated after extraction)
│  ├─ 04-ui-assets-dev/         (editable copies, later)
│  ├─ 05-browser-preview/       labelled EXE UI MOCK (index.html) ✅ serves
│  └─ 06-sandbox/               Windows Sandbox .wsb prep (NOT executed)
├─ firmware-work/
│  ├─ 00-original-copy/         working copy of the firmware .zip
│  ├─ 01-unpacked-package/      outer package contents
│  ├─ 02-extracted/            partitions carved from the uImage
│  ├─ 03-filesystems-original/  cramfs/squashfs rootfs + web root
│  ├─ 04-web-ui-original/       pristine extracted web UI (index.htm) — reference
│  ├─ 05-web-ui-development/    EDITABLE copy of the web UI (future redesign target) ✅ serves
│  └─ 07-mock-camera-api/       mock_camera_api.py (camera + player-bridge mock) ✅ runs
├─ shared-tools/                reserved for approved local tools (empty)
├─ scripts/                     5 PowerShell launchers (all parse-clean on PS 5.1) ✅
├─ docs/                        environment, safety/scope, emulation research, redesign prep
├─ reports/                     this report + static analyses + hashes + tool audit
├─ README.md                    entry point
└─ COMMAND_LOG.md               full command log
```

### Integrity baseline (recorded + re-verified this session)
| File | SHA-256 | Size | Status |
|------|---------|------|--------|
| `VideoPlayToolSetup.exe` | `ADE9CA40BD24D5C69A96D3FC5EE4058A5A1A9E90AF2EACFA2B8712861A09F06A` | 47,064,869 | ✅ MATCH |
| `000699N5.1IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.zip` | `FF5DC0D2D6E7CEFD82854367FC5E581A947157A6E07FDE59D845971A4B66EC59` | 7,380,645 | ✅ MATCH |

Re-check anytime: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-environment.ps1`

---

## 3. What was installed
- **Nothing new was installed.** Only pre-existing tools were used: **Python 3.12** (already on PATH)
  for the loopback preview/mock servers, and built-in PowerShell 5.1.
- The unsigned `VideoPlayToolSetup.exe` was **never executed**. Firmware was **never flashed**.

---

## 4. What requires your approval (nothing below was done)
| # | Action | Why | Risk |
|---|--------|-----|------|
| 1 | Install **7-Zip** (`winget install 7zip.7zip`) | Extract the NSIS payload → real EXE UI assets (icons, Qt resources) | Low (adds a tool) |
| 2 | Install **WSL2 Ubuntu** (optional) | Nicer firmware tooling (`binwalk`, `unsquashfs`) — current extraction already worked without it | Medium (Windows feature + restart) |
| 3 | Run installer inside **Windows Sandbox** (`.wsb` is staged, not run) | Observe real player UI in a throwaway VM | Medium (enable Sandbox feature; still isolated) |
| 4 | Any elevation / BIOS virtualization / Windows optional features | Only if you choose #2 or #3 | Per action |

**I will not execute the installer, flash firmware, enable Windows features, or elevate without your go-ahead.**

---

## 5. EXE UI preview — command + URL
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\preview-exe-ui.ps1
```
→ **http://127.0.0.1:8090/index.html**  ✅ serves (verified)
This is a **clearly-labelled MOCK** approximation for redesign reference — **not** the real player
(the real Qt/EXE assets require 7-Zip approval, item #1).

## 6. Firmware UI preview — command + URL
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\preview-firmware-ui.ps1
```
→ **http://127.0.0.1:8088/index.htm**  ✅ serves HTTP 200 (verified this session)
Real extracted HTML/CSS/JS with the in-page mock adapter injected. The live video pane relies on a
legacy ActiveX/NPAPI plugin that modern browsers won't load — so this is **layout/navigation** preview.

## 7. Mock service — command
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-mock-camera.ps1
```
Serves the camera web UI on `:8088` and a mock **VideoPlayTool player bridge** on `:54455`
(`Cmd-WebLocalCtrl` / `GetPreLoginInfo`). All responses are canned — no camera, no real player,
no auth, no network egress.
> On this host `54455–54465` is a **Windows/Hyper-V excluded** range and cannot be bound; the server
> detects this and the browser-side adapter mocks the bridge **in-page**, so preview still works. Verified.

---

## 8. Is full firmware emulation possible? **Not verified — and not claimed.**
The rootfs holds native **ARM (GK7205V300)** binaries and CGI. Real emulation would need
QEMU-arm + a matching kernel/devicetree and heavy stubbing of camera/ISP hardware — out of scope and
unproven here. What works today is the **web-UI-only** preview backed by mocks. Never run the ARM
binaries on Windows. Details: `docs/firmware-emulation-research.md`.

## 9. Can the real EXE UI be safely changed without source code? **Partially — and not yet.**
- The player is a compiled **Qt/NSIS** Windows app. Without source you **cannot** cleanly restyle it
  without binary patching / resource editing — which the safety rules **forbid**.
- Safe path: extract read-only UI **assets** (after 7-Zip approval), redesign them as a **separate
  web/mock front-end** in `exe-work/04-ui-assets-dev/` and `05-browser-preview/`. The shipped `.exe`
  stays untouched.
- The **firmware web UI**, by contrast, is plain HTML/CSS/JS and **can** be safely redesigned in
  `firmware-work/05-web-ui-development/`.

---

## 10. Validation performed this session
- ✅ Both source hashes re-verified **MATCH** (byte-for-byte unchanged); structure intact.
- ✅ Fixed real bugs found in validation: PS7-only `? :` ternary and `??` null-coalescing operators,
  and UTF-8 em-dashes that broke string parsing under PowerShell 5.1 — **all 5 scripts now parse clean**.
- ✅ `mock_camera_api.py` byte-compiles and runs; firmware UI returns **HTTP 200**; preview adapter serves.
- ✅ Reconciled documented ports to the real working values (`8088` / `54455` / `8090`).

## 11. Exact next step
**Approve item #4-1: install 7-Zip** (`winget install 7zip.7zip`). That unlocks read-only extraction of
the real EXE UI assets into `exe-work/03-ui-assets-original/`, after which I can map them (still
non-destructively) and you can decide what to redesign. Until then, explore both previews via
`scripts\start-here.ps1`.

*No UI redesign has been done. This environment is ready for a later, UI-only redesign phase.*
