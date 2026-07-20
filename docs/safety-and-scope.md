# Safety & Scope

This project is a **safe inspection / preview lab**. It is not a modding, cracking,
flashing, or reverse-engineering-for-bypass project. This page records the rules that
were followed and how each was honoured.

## Rules honoured during setup
| # | Rule | How it was honoured |
|---|------|--------------------|
| 1 | Never delete/rename/overwrite/modify/execute/install/flash/repack the originals | Only `Copy-Item` + `Get-FileHash` + read-only parsing were used on `docs-recources`. |
| 2 | Treat `docs-recources` as read-only evidence | Recommend `attrib +R`; all work happens on copies. |
| 3 | Record SHA-256 before anything | `reports/source-hashes.txt`; re-check with `scripts/verify-environment.ps1`. |
| 4 | Don't run the unsigned installer on the host | Never executed. Static analysis only. Sandbox is prep-only. |
| 5 | Don't flash firmware | Firmware only parsed/extracted from a copy; nothing written to any device. |
| 6 | Don't modify firmware backend/native/CGI/protocol/auth/net/codec/boot/kernel | Only static, read-only extraction of web assets; no binary edited. |
| 7 | Don't patch EXE/DLL instructions | No binary patching performed. |
| 8 | Don't bypass signatures/licensing/auth/protections | Nothing bypassed; we *report* that the EXE is unsigned, we don't sign or defeat anything. |
| 9 | Only inspect + extract assets safely | Web UI assets copied; native binaries left untouched. |
| 10 | UI edits only in copied dev files | Editable copy is `firmware-work/05-web-ui-development/`; originals untouched. |
| 11 | Don't claim emulation works unless verified | See `docs/firmware-emulation-research.md` — full emulation is **not** verified/claimed. |
| 12 | Never run unknown ARM binaries on Windows | None executed; ARM binaries identified but not run. |
| 13 | No admin without justification | No elevation used. Elevation items are listed, not performed. |
| 14 | Stop-and-ask for elevation/restart/virtualization/features/risk | All such actions are deferred to explicit approval. |
| 15 | Keep a full command log + report | `COMMAND_LOG.md` + `reports/`. |
| 16 | No UI redesign during setup | Only a **labelled mock** + an **editable copy** were created; no redesign done. |
| 17 | No changes outside this workspace except approved free tools | Nothing installed; all files under the workspace. |
| 18 | PowerShell on Windows; Linux firmware cmds via WSL2/isolated only | PowerShell used; no Ubuntu present, so no host-level Linux firmware exec. |

## Actions that are DEFERRED (need your explicit approval)
- Installing **7-Zip** (to extract real EXE UI assets) — per-user winget, low risk.
- Installing **WSL2 Ubuntu** (optional native firmware tooling).
- **Executing** the installer — only ever inside a disposable VM/sandbox, never on the host.
- Enabling **Windows Sandbox / optional features** (needs elevation; not available on Home anyway).
- Any **BIOS/UEFI virtualization** change.

## Hard "do NOT edit" list (originals)
- Everything in `docs-recources/`.
- Everything in `exe-work/00-original-copy/`, `firmware-work/00-original-copy/`.
- Extracted originals in `firmware-work/03-filesystems-original/` and
  `firmware-work/04-web-ui-original/`.
- All native binaries, `*.custom`, `ProductDefinition`, `.bin`, `.squashfs`, `.cramfs`.

## "OK to edit later" list (for the UI-only redesign)
- `firmware-work/05-web-ui-development/` (HTML/CSS/JS copy of the web UI).
- `exe-work/05-browser-preview/` (the labelled EXE UI mock — a design surface, not the real player).
