# EXE Static Analysis — Non-Destructive

**Source (read-only):** `docs-recources/VideoPlayToolSetup.exe`
**SHA-256:** `ADE9CA40BD24D5C69A96D3FC5EE4058A5A1A9E90AF2EACFA2B8712861A09F06A`
**Size:** 47,064,869 bytes (≈ 44.885 MB)
**Method:** header/byte inspection + signature check on a **read-only copy** (`exe-work/00-original-copy/`). The installer was **never executed or installed**.

> ⚠️ **The installer was NOT run.** No files were written to Windows, no registry keys set, no services/protocols registered. Everything below comes from reading bytes, not from execution.

---

## 1. File identity

| Property | Value | How determined |
|----------|-------|----------------|
| Type | `PE32 executable (GUI), Intel 80386 (x86, 32-bit), MS Windows` | DOS/`MZ` + PE header (`OptionalHeader` magic `0x10B`) |
| Installer framework | **Nullsoft Scriptable Install System (NSIS)** | `NullsoftInst` / NSIS markers + `INSTALLER/FRAMEWORK MARKERS` scan |
| Compression of payload | Deflate/LZMA solid archive (NSIS body) | NSIS container inspection |
| Bundled runtime | **Qt** GUI application (the actual player) | Qt symbol/resource strings in body |
| Product family | **VideoPlayTool** local player + browser plugin/bridge | Version-info + string scan |

### 1.1 Authenticode signature — **UNSIGNED**

`Get-AuthenticodeSignature` →

```
Status            : NotSigned
SignatureType     : None
SignerCertificate : (none)
```

**The installer is not digitally signed.** Its authenticity/integrity cannot be cryptographically verified, and SmartScreen/UAC will warn on execution. This is the central reason it must **not** be run directly on the main host (Safety Rule 4). Version-info fields (`ProductName`, `FileVersion`, `CompanyName`, `OriginalFilename`, `LegalCopyright`, etc.) were queried via `(Get-Item …).VersionInfo` and recorded by `exe-work/scripts/analyze-exe.ps1`; because the binary is unsigned, those strings are **not trustworthy** and are treated as informational only.

---

## 2. What this installer contains / does (inferred, not executed)

Based on NSIS + Qt + the firmware web UI's expectations (§4 of `firmware-static-analysis.md`), the payload is a **native Windows video player** that:

1. Installs a Qt-based `VideoPlayTool` player executable + DLLs.
2. Registers a **`VideoPlayTool://` custom URL protocol** handler.
3. Runs a **localhost control bridge** listening on a port in **`54455`–`54465`**, answering `/Cmd-WebLocalCtrl` JSON commands from the camera's web page.
4. Renders RTSP/NetIP camera video that the browser cannot decode natively.

This is the classic "browser plugin replaced by a localhost helper app + custom protocol" pattern used by XiongMai/HiSilicon IP-camera web UIs.

---

## 3. Payload extraction status — **BLOCKED (needs approval)**

To enumerate the player's **own UI assets** (Qt `.rcc` resources, `.ui`, images, icons, DLL names) **without installing**, the NSIS archive must be unpacked with a static extractor:

- Preferred: **7-Zip** (`7z x`) — reads NSIS archives **without executing** them. *Not yet installed → pending approval (free, offline).*
- Alternative: `7z`-portable or `innoextract` (Inno only; not applicable here since this is NSIS).

**Nothing was extracted yet** because no approved extractor is installed. Once approved, extraction writes to `exe-work/02-extracted-original/` (read-only source stays untouched), and UI assets are cataloged into `exe-work/03-ui-assets-original/`.

> Until then, the EXE player's internal UI is represented by a **clearly-labelled mock** in `exe-work/05-browser-preview/` so design work can begin conceptually — the mock is **not** the real player and is marked as such.

---

## 4. Can the real EXE UI be safely redesigned **without source code**?

**Partially, and only within strict limits — full "recompile the EXE" redesign is NOT possible without source.**

| Approach | Feasible without source? | Safety |
|----------|--------------------------|--------|
| Re-skin the **web-served** UI the player displays (if it loads HTML/Qt-WebEngine assets) | ✅ if such assets exist in the payload | Safe — asset-only edits in a **copy** |
| Replace Qt `.rcc`/image/QSS style resources in a **rebuilt copy** | ⚠️ possibly, if resources are external/replaceable | Medium — never patch the original binary |
| Patch compiled EXE/DLL instructions | ❌ **Forbidden** (Safety Rule 7) | — |
| Fully redesign the native player UI | ❌ Needs original Qt/C++ source | — |

**Verdict:** A true UI redesign of the native player generally **requires the original source project**. What *can* be done safely is (a) redesign the **firmware web UI** (fully editable — see firmware report), and (b) prototype a **new player UI as a mock/HTML reference** for a future source-based rebuild. No binary patching. This is captured in the final report.

---

## 5. Not done (by policy)

No execution, no install, no protocol/registry registration, no DLL patching, no signature bypass, no unpacking until an extractor is approved. The main host was never exposed to the unsigned binary.
