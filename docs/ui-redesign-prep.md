# UI Redesign — Preparation (NO redesign yet)

This documents *where* and *how* a future UI-only redesign would happen. Per the task,
**no redesign is performed now.** This is groundwork only.

## Two independent UI surfaces

### A. Camera firmware web UI  — real, editable copy
- **Edit here:** `firmware-work/05-web-ui-development/`
- **Never edit:** `firmware-work/04-web-ui-original/` and `03-filesystems-original/`
- **Real files** (extracted from `web-x.cramfs`):
  - `index.htm` — shell/login page
  - `css/main.css` — styling
  - `js/main.js` — UI logic, CGI calls, plugin bootstrap
  - `js/jquery-3.5.0.min.js` — vendored jQuery 3.5.0
  - `pluginVersion.js` — native video-plugin version gate
  - branding/strings live in `custom-x.cramfs` (`_custom-reference/`): `ProductDefinition`,
    `data/Strings/<language>`, `CustomConfig/*.custom`
- **Redesign implication:** this is genuinely re-skinnable. You can restyle layout,
  colors, typography, and replace the login/splash. The **video pane** depends on the
  legacy ActiveX/OCX plugin — for a modern redesign you'd replace it with a placeholder
  or a standards-based player (WebRTC/HLS) *if/when* a real stream source exists. That's
  a redesign decision for later, not now.

### B. Windows VideoPlayTool player  — MOCK only (so far)
- **Design surface:** `exe-work/05-browser-preview/` (labelled HTML mock).
- **The real native UI assets** (icons, Qt/Win32 resources, real dialog layouts) are
  **inside the NSIS installer** and require **7-Zip approval** to extract into
  `exe-work/02-extracted-original/` → `03-ui-assets-original/`.
- **Can the real EXE UI be changed without source code?** Only *cosmetically and with
  real risk*: resource-level edits (icons/bitmaps/strings/RC dialogs) via a resource
  editor are possible but are **binary edits** — out of the safe scope here, and they
  can break signing/integrity. A clean redesign of the native player realistically wants
  the **original source project**. See `reports/exe-static-analysis.md`.

## Recommended redesign approach (later)
1. Do the **firmware web UI** first — it's web tech, fully editable, lowest risk.
2. Prototype the **player** redesign in the HTML mock (`05-browser-preview/`) as a
   design spec, since it's cheap to iterate.
3. Only touch real EXE binaries/resources if you accept binary-editing risk **or**
   obtain source code; decide then, with approval.

## What's needed to go further
| Want | Needs | Approval? |
|------|-------|-----------|
| Real EXE UI assets to reference | Install 7-Zip, extract NSIS payload | Yes (low risk) |
| Native player redesign that ships | Original EXE **source project** | Provide source |
| Live video in web UI preview | Real stream + modern player, or device hardware | Design decision |

## Guardrails for the redesign phase
- Edit only the two development surfaces above.
- Keep `verify-environment.ps1` green (originals never change).
- No binary patching, no signature/protection bypass — same rules as setup.
