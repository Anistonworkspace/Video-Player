# Tool Audit (Phase 2)

Snapshot of tools relevant to this project: what is installed, what is missing,
and which missing tools require your approval to install. No tools were installed
during setup — only detected.

Host: **Windows 11 Home Single Language 10.0.26200** · Primary shell: PowerShell ·
Secondary: Bash tool (git-bash/MSYS-style POSIX environment).

> Two environments see PATH differently. "Windows PATH" = what a clean PowerShell
> session sees. "Bash tool" = the POSIX shell used for scripts; it bundles some
> tools (its own `git`, `unzip`, `file`) that are **not** necessarily on the
> Windows PATH. Both are noted where it matters.

## Installed / available
| Tool | Where | Used for | Notes |
|------|-------|----------|-------|
| Python 3.12 | `...\Programs\Python\Python312\python.exe` | Local static preview servers, mock camera API, firmware unpacker | Windows-native. Core dependency — everything runs on this. |
| Node.js + npm | `D:\node`, `D:\npm` | Available for future JS tooling | Not required by current setup. |
| Java (Adoptium JDK 17) | `...\Eclipse Adoptium\jdk-17...` | Prerequisite for Ghidra *if* ever installed | Present; Ghidra itself is not. |
| `unzip`, `file` | Bash tool `/usr/bin` | Firmware ZIP handling, magic-byte ID | POSIX side only. |
| Git | Bash tool `/mingw64/bin/git` | n/a | Bundled with Bash tool; **workspace is not a git repo** and git is not confirmed on the Windows PATH. |
| PowerShell 5.1+ | built-in | Hashing, file ops, launchers | `Get-FileHash`, `Get-AuthenticodeSignature`, etc. |

## Missing — matters for this project
| Tool | Needed for | Blocking? | Action |
|------|-----------|-----------|--------|
| **7-Zip** | Extracting the NSIS payload from `VideoPlayToolSetup.exe` (EXE UI assets: icons, Qt resources, real dialogs) | Blocks EXE **original-asset** extraction only. Static analysis + EXE UI mock done without it. | **Approval to install** — `winget install 7zip.7zip` (per-user, no elevation). |
| **binwalk** | Convenience firmware carving | No — firmware already extracted with a custom Python parser (cramfs/squashfs/uImage). | Optional. Best via WSL2 Ubuntu (not installed). |

## Missing — not needed for a UI-only redesign
| Tool | Would be for | Verdict |
|------|-------------|---------|
| Ghidra / IDA | Deep native RE of ARM binaries / the EXE | **Out of scope.** UI redesign does not require disassembly. Java is present if you ever add Ghidra. |
| CMake, Ninja | Rebuilding native C/C++ | Out of scope — no native rebuild planned. |
| WSL2 **Ubuntu** | Native firmware tooling (binwalk, mount cramfs) | Only `docker-desktop` WSL distro exists; no Ubuntu. Firmware was extracted without it. Installing a distro = **approval** item. |
| Windows Sandbox | Isolated EXE execution | **Not available on Windows Home.** See `exe-work/06-sandbox-testing/README-sandbox.md`. |

## Approvals summary (nothing below was done)
1. **Install 7-Zip** (per-user winget) — to extract real EXE UI assets. *Recommended, low risk.*
2. **Install WSL2 Ubuntu** — only if you want native firmware tooling. *Optional.*
3. **Run/execute the installer or sandbox** — separate, higher-risk approval; not required for UI redesign.

See `reports/final-setup-report.md` for the consolidated approval list and next steps.
