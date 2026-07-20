# UI Editability Matrix — VideoPlayTool (Web V5.0.5.2)

**Source:** static extraction of the COPY `exe-work\00-original-copy\VideoPlayToolSetup.exe`
(NSIS-3 Unicode, LZMA) → `exe-work\02-extracted-original\` (469 files, 161,919,965 bytes).
Full hashes: `reports\extracted-manifest.txt`. **Nothing was executed.**

## Architecture (verified)
`Bin\VideoPlayTool.exe` is a **thin Qt5 Widgets shell** (`QApplication` confirmed) that hosts a
**web UI** (`Web\html\...`) plus a native video surface (rendered via `VideoPlugin_x64.exe`,
FFmpeg `avcodec/avformat/avfilter.dll`, and the camera SDK `XNetSDK.dll`).
**Most of what the user sees is web content → fully frontend-editable as loose files.**

> ⚠️ Remote-fetch caveat: `VideoPlayTool.exe` contains strings `https://ocx.jftechws.com:443/web/`
> and `https://app.jftechws.com/apps/latest/` — a probable update / remote-web path. We must verify in
> the VM that the app uses the **local** `Web\` folder, and keep it offline (or block those hosts) so our
> local edits are not overwritten by an update.

---

## ✅ GREEN — frontend-only, safe (edit COPIES; zero binary change)
| Asset | Path (relative) | Controls | Edit method |
|------|------|------|------|
| Web master stylesheet | `Web\images_general\skin.css` (68,153 b) | Colours, fonts, spacing, most web-UI look | Edit CSS |
| Web page markup | `Web\html\*.html` (login, live, playback, config, alarm, client, forgetpwd, timesection) | Structure, static text, element classes | Edit HTML |
| Web images/icons | `Web\images_general\*.png` (60 files) | Logos, icons, backgrounds | Replace PNG (keep dimensions/format) |
| Web sub-assets | `Web\html\cfg\` (148 files) | Config-panel pages/assets | Edit as HTML/CSS/JS/img |
| Web UI text (i18n) | `Web\lg\*.xml` (30 languages) | Visible labels/strings per language | Edit XML text nodes |
| Native shell QSS | `Bin\style.ss` (1,572 b, Qt QSS) | Native widgets (sliders, labels) colours/shape | Edit QSS |
| Web plugin assets | `Web\plugin\` (9) | Plugin-side presentation (case by case) | Inspect, then edit non-code only |

## 🟡 AMBER — behaviour, edit with care (JS = logic)
| Asset | Path | Note |
|------|------|------|
| Web page scripts | `Web\html\*.js` (`live.js` 70 KB, `playback.js` 48 KB, `config.js`, `login.js`, `timeline.js`, `alarm.js`, `client.js`, `forgetpwd.js`) | For a *look* reskin, prefer CSS/HTML. Touch JS only for presentational hooks (class/id, labels), never protocol/auth/stream logic. |
| Crypto helper | `Web\crypt-js\` (1) | Do **not** alter — part of login/auth flow. |

## ⛔ RED — backend, must stay byte-identical (NEVER edit)
| Group | Files |
|------|------|
| Camera SDK | `Bin\XNetSDK.dll` (29 MB) |
| Video codecs | `Bin\avcodec.dll`, `avformat.dll`, `avfilter.dll` |
| Qt runtime | `Bin\Qt5Core/Qt5Gui/Qt5Widgets.dll`, `opengl32sw.dll`, `libGLESv2.dll`, `D3Dcompiler_47.dll` |
| Crypto/TLS | `Bin\libcrypto-1_1-x64.dll` |
| Executables | `Bin\VideoPlayTool.exe`, `VideoPlugin_x64.exe`, `mksquashfs.exe`, `compress\unsquashfs.exe`, `CStreamDetectionTool.exe`, `Browse.exe`, `uninst.exe` |
| Stock Qt i18n | `Bin\translations\qt_*.qm` (24) — framework strings, leave as-is |
| Installer internals | `$PLUGINSDIR\*` |
| All remaining `.dll` (165 total) and non-language `.xml`/`.ini` config | — |

---

## Verdict: **GO for frontend-only reskin**
- The redesignable surface is **web files + `skin.css` + 60 PNGs + `style.ss` + language XMLs** — all plain, loose, editable, with **no binary modification** and therefore **no backend/functionality change**.
- **Hard ceiling:** the native shell *window structure/layout* is compiled into `VideoPlayTool.exe`; it can be **restyled** (via `style.ss`) but not **restructured** without source. Since it's a thin host, the impact is minimal — the real UI lives in the web layer.
- Backend-unchanged is provable later by hash-diffing every RED/AMBER-non-edited file vs `extracted-manifest.txt`.

## New option unlocked by extraction
Because the main UI is web content, the **real web UI can be previewed locally in a browser right now**
(open the extracted `Web\html\login.html` / `live.html` with the real `skin.css` + real PNGs) — **no VM
required** to see it. VirtualBox is still needed to see the **native shell chrome + live video** and to
validate the rebuilt installer end-to-end.
