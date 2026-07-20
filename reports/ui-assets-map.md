# UI Assets Map — Editable vs. Off-Limits

This is the master index for the **later UI-only redesign**. It records, per asset,
where it came from, whether it is UI, and whether it may be edited (only in the
**development copies**, never in extracted originals or in `docs-recources`).

Legend: ✅ editable (UI, in a dev copy) · 🟡 branding/text (edit with care) · ⛔ must NOT edit (backend/binary/original).

---

## A. Firmware WEB UI  (source partition: `web-x.cramfs`)

Pristine reference: `firmware-work/04-web-ui-original/` (do **not** edit)
Editable copy:      `firmware-work/05-web-ui-development/`  ← **edit here later**

| Asset | Type | Purpose | Editable? |
|-------|------|---------|-----------|
| `index.htm` | HTML | Single-page shell + login gate | ✅ |
| `css/main.css` | CSS | All layout, colors, typography | ✅ |
| `css/close.png` | PNG | Close/X icon | ✅ |
| `css/ocxTip.png` | PNG | "Install plugin" tooltip graphic | ✅ |
| `js/main.js` | JS | UI logic **+ localhost player bridge (`127.0.0.1:54455-54465`, `VideoPlayTool://`, `Cmd-WebLocalCtrl`)** | ✅ *(UI parts only; keep bridge contract)* |
| `js/jquery-3.5.0.min.js` | JS (vendor) | jQuery 3.5.0 | 🟡 keep version; don't hand-edit |
| `pluginVersion.js` | JS | Declares required native-plugin version | 🟡 |
| `Fonts/Font.bin` | Font | Icon glyphs | 🟡 |
| `xm_version/buildtime` | text | `20250312184106` provenance marker | ⛔ keep as provenance |

### Branding / localization (source partition: `custom-x.cramfs`)
Reference copy: `firmware-work/04-web-ui-original/_custom-reference/`

| Asset | Type | Purpose | Editable? |
|-------|------|---------|-----------|
| `_custom-reference/CustomConfig/AppDowloadLink.custom` | INI | Player download URL in install prompt | 🟡 branding |
| `_custom-reference/CustomConfig/OEMcfg.custom` | INI | OEM/branding toggles | 🟡 |
| `_custom-reference/CustomConfig/*.custom` (Camera/NetWork/AVEnc/Detect/Ability/ExtDevIDConfig) | INI | Feature flags read by UI+backend | 🟡 flags only |
| `_custom-reference/Strings/English` (+39 languages) | text | UI localization tables | 🟡 text only |
| `_custom-reference/ProductDefinition`, `FirmwareInfo` | text | Product identity | ⛔ provenance |

### Firmware backend — ⛔ OFF-LIMITS (never edited, in `03-filesystems-original/` rootfs)
`cgi-bin/*` (incl. `login.cgi`), native ARM daemons, `/bin`, kernel (`uImage`), `u-boot`, camera protocol/auth/streaming/codec logic, device config, upgrade verification.

---

## B. Windows PLAYER UI  (source: `VideoPlayToolSetup.exe`)

| Asset | Type | Status | Editable? |
|-------|------|--------|-----------|
| Player Qt UI resources (`.rcc`/`.ui`/QSS/images/icons) | binary payload | **Not extracted** — needs approved 7-Zip | ⛔ until extracted; then edit **copies** only |
| `VideoPlayToolSetup.exe` / installed DLLs / EXE | PE binary | Original evidence | ⛔ never patch/execute |
| `exe-work/05-browser-preview/` player **mock** | HTML/CSS/JS | Labelled placeholder (NOT the real player) | ✅ mock only |

> When 7-Zip is approved, extracted assets land in `exe-work/02-extracted-original/` (⛔ treat as read-only originals) and are cataloged; editable duplicates go to `exe-work/04-ui-development/`.

---

## C. Hard rules for the later redesign

1. **Edit only** `firmware-work/05-web-ui-development/` and `exe-work/04-ui-development/` (and the mocks). 
2. **Never** edit `docs-recources/`, any `*-original/` folder, or any extracted binary.
3. Keep the **player-bridge contract** intact in `main.js` (ports `54455-54465`, `Cmd-WebLocalCtrl`, `VideoPlayTool://`) unless deliberately redesigning that flow.
4. No binary/CGI/protocol edits — those are ⛔ regardless of copy.
