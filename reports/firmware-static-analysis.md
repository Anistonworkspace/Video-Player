# Firmware Static Analysis — Non-Destructive

**Source (read-only):** `docs-recources/000699N5.1IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.zip`
**SHA-256:** `FF5DC0D2D6E7CEFD82854367FC5E581A947157A6E07FDE59D845971A4B66EC59`
**Method:** read-only unzip of a working copy + binary carving of the update image. The original ZIP was never modified, flashed, or repacked. All work happened in `firmware-work/`.

> ⚠️ This is **static, offline** analysis of files. **Nothing here was flashed, booted, or executed.** No camera hardware was contacted.

---

## 1. Package layout

The `.zip` is a **vendor OTA update package**, not a raw flash dump. Unzipped into
`firmware-work/01-unpacked-package/000699N5.1IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02/`:

| Item | Role |
|------|------|
| `InstallDesc` | Plain-text manifest: hardware IDs, target flash map, upgrade command list |
| `General_IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.20250312.bin` | `NET_UPGRADE_FILE` — network-upgrade image (multi-partition container) |
| `upall_General_IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK.20250312.bin` | `BURN_FILE` — full factory burn image |

The `.bin` files are **concatenated partition containers** (uImage/U-Boot legacy headers + CRAMFS/SquashFS blobs), each preceded by a small vendor header. Partitions were carved out **read-only** into `firmware-work/02-partitions-original/` and the mountable filesystems expanded into `firmware-work/03-filesystems-original/`.

---

## 2. Hardware / platform identity (from `InstallDesc`, verbatim)

| Key | Value | Meaning |
|-----|-------|---------|
| `CHIP_ID` | `GK7205V300` | Goke/HiSilicon GK7205V300 SoC — **ARM** (Cortex-A7 class), IP-camera SoC |
| `ISP` | `X23_General` | Image sensor pipeline profile |
| `DEVICE_ID` | `G5F` | Board/model variant |
| `FLASH_TYPE` | `NOR` | NOR SPI flash |
| `FLASH_SIZE` | `16M` | 16 MB flash — tiny; explains CRAMFS/SquashFS usage |
| `DDR_TYPE` / `DDR_SIZE` / `DDR_FREQ` | `DDR3` / `128M` / `1800` | RAM config |
| `PACK_SIZE` | `6144` | Packing block size |
| `SDK_VERSION` | `1.0.3.0` | Vendor SDK build |
| `NET_PROTOCOL` | `NetIP,HIK,SimpOnvif` | Control planes: **NetIP/DVRIP (XiongMai, TCP 34567)**, Hikvision-style, Simplified ONVIF |
| `EXTENFUNC` | `EXE,DSS,RPS,RPS_VIDEO,CloudStorage,IA_FAD,IA_TD` | Optional features (P2P/cloud/analytics) |
| `UPGRADE_VERIFY` | `General` | Vendor upgrade verification profile |
| Build time (`xm_version/buildtime`) | `20250312184106` | 2025-03-12 |

**Conclusion:** This is a **XiongMai (XM) platform** OEM IP-camera firmware. The "HIK/ONVIF" tokens are *protocol-compatibility* labels, not Hikvision firmware. This matches the web UI's XiongMai signatures (see §4).

---

## 3. Partition / filesystem map

Carved into `firmware-work/02-partitions-original/`, expanded into `03-filesystems-original/`:

| Partition | Format (magic) | Contents | UI-relevant? |
|-----------|----------------|----------|--------------|
| `u-boot`  | U-Boot / legacy uImage header (`0x27051956`) | Bootloader | ❌ out of scope |
| `uImage`  | uImage legacy header | Linux kernel (ARM) | ❌ out of scope |
| `rootfs`  | SquashFS (`sqsh`/`hsqs` magic) | Root filesystem: `/bin`, native ARM daemons, `cgi-bin` | ⚠️ backend only |
| **`web-x`**   | **CRAMFS (`0x28cd3d45`)** | **The browser Web UI (HTML/CSS/JS)** | ✅ **primary UI target** |
| `custom-x`| CRAMFS | OEM branding, `CustomConfig/*.custom`, per-language `Strings/`, `ProductDefinition`, `FirmwareInfo`, fonts | ✅ branding/strings |

> The **root filesystem SquashFS** (native ARM binaries, `cgi-bin`, daemons) was **not fully expanded** — that requires `unsquashfs` under WSL2 Ubuntu, which is a **pending approval** item and is **not needed for UI work**. Only the CRAMFS web/custom partitions (mountable/extractable with pure-Python tooling already available) were expanded.

---

## 4. Web UI partition (`web-x.cramfs`) — the editable surface

Extracted tree (see also `reports/ui-assets-map.md`):

```
web-x.cramfs/
├── index.htm                     ← single-page shell / login gate
├── css/
│   ├── main.css                  ← all styling
│   ├── close.png  ocxTip.png     ← UI images (plugin-install tooltip)
├── js/
│   ├── main.js                   ← all UI logic + local-player bridge
│   └── jquery-3.5.0.min.js       ← vendored jQuery 3.5.0
├── pluginVersion.js              ← declares required native-plugin version
├── Fonts/Font.bin                ← icon/glyph font
└── xm_version/buildtime          ← 20250312184106  (XiongMai marker)
```

These are **plain, uncompiled, human-editable text assets** — this is exactly why UI-only redesign is feasible **without** the EXE's source code.

### 4.1 Browser ⇄ local player integration (the key architecture)

The web page **does not decode video itself**. It hands streaming off to the **installed Windows `VideoPlayTool` player** via two mechanisms (all strings confirmed in `js/main.js` + `index.htm`):

1. **Localhost HTTP bridge** — the page probes `http://127.0.0.1:<port>/Cmd-WebLocalCtrl`, scanning a **port range `54455`–`54465`** (`g_PluginPort=54455`, `detectPort(54455, 54465, …)`), sending JSON control commands (`WebLocalCtrl` appears 11×).
2. **Custom URL protocol** — `VideoPlayTool://1` launches / focuses the installed player when the bridge is not found; if the player is missing, the page shows an "install plugin" prompt and offers the download link from `custom-x` → `CustomConfig/AppDowloadLink.custom`.
3. **Login flow** — `GetPreLoginInfo` then `POST /cgi-bin/login.cgi` (device-side CGI, backend — **out of scope**).

```
 Browser (index.htm + main.js)
   │  (1) http://127.0.0.1:54455..54465/Cmd-WebLocalCtrl  [JSON]  ┐
   │  (2) VideoPlayTool://1  (custom protocol launch)             ├── installed native player = the EXE
   │  (3) POST /cgi-bin/login.cgi , GetPreLoginInfo               ┘   (VideoPlayToolSetup.exe payload)
   ▼
 Camera device (34567 NetIP · 80 HTTP · 554 RTSP · ONVIF)
```

**This directly links the two source files:** the EXE installs the local player that this firmware web UI drives. That linkage is reproduced *safely* by the mock in `firmware-work/07-mock-camera-api/` (a fake bridge + fake CGI), so the UI can be previewed with **no camera and no real player**.

---

## 5. Custom / branding partition (`custom-x.cramfs`)

`CustomConfig/*.custom` (INI-style text), `ProductDefinition`, `FirmwareInfo`, `data/Strings/<40 languages>`, `data/Fonts/`. Notable:

- `AppDowloadLink.custom` — download URL(s) shown in the "install VideoPlayTool" prompt.
- `OEMcfg.custom`, `Camera.custom`, `NetWork.custom`, `AVEnc.custom`, `Detect.custom`, `Ability.custom`, `ExtDevIDConfig.custom` — feature toggles/branding read by the UI + backend.
- `data/Strings/English` (+ 39 others) — localization tables. UI language strings for the preview are sourced from here.

A read-only reference copy is preserved under `firmware-work/04-web-ui-original/_custom-reference/`.

---

## 6. What is explicitly OUT OF SCOPE (not touched)

Native ARM binaries, `cgi-bin` backend, camera protocols (NetIP/ONVIF/HIK), auth, networking, streaming, codecs, bootloader, kernel, device config, and upgrade verification — **none were modified, patched, emulated as "working", or executed.** SquashFS backend was intentionally left unexpanded pending approval.

---

## 7. Verified facts vs. inferences

| Claim | Basis | Confidence |
|-------|-------|-----------|
| GK7205V300 ARM XiongMai IPC | `InstallDesc` + buildtime + XM web markers | **High (verified in files)** |
| Web UI is plain editable HTML/CSS/JS | Direct file inspection | **High** |
| Browser offloads video to native player via `127.0.0.1:54455-54465` + `VideoPlayTool://` | Strings in `main.js`/`index.htm` | **High** |
| Full boot/firmware emulation works | — | **NOT claimed / NOT verified** (see `emulation-notes.md`) |
