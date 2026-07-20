# Firmware Emulation Research

Honest assessment of whether the camera firmware can be *emulated* on the PC so its
web UI behaves like a real device. **Bottom line: full emulation is NOT verified and
is NOT claimed.** What *is* working is a static preview + a mock backend.

## What the device actually is
- **SoC:** Goke/HiSilicon **GK7205V300** — single-core ARM Cortex-A7, IP-camera class.
- **Flash:** 16 MB **NOR**, DDR3 128 MB, from `ProductDefinition`
  (`CHIP_ID=GK7205V300`, `FLASH_TYPE=NOR`, `FLASH_SIZE=16M`, `DDR_SIZE=128M`, `DEVICE_ID=G5F`).
- **Firmware image:** `General_IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.20250312.bin`
  (XiongMai/XM "General" IPC build).
- **Partitions (from uImage/mtd inspection):** u-boot, kernel (`uImage`, ARM),
  `romfs-x.squashfs` (root), `web-x.cramfs` (web UI), `custom-x.cramfs` (branding/strings/config).
- **Protocols:** `NET_PROTOCOL=NetIP,HIK,SimpOnvif` — NetIP/DVRIP (TCP 34567), ONVIF, RTSP.

## Emulation options, ranked

### 1. Static web UI preview  ✅ WORKING (what we built)
Serve the extracted `web-x.cramfs` HTML/CSS/JS from Python and view in a browser.
- **Pros:** zero risk, instant, perfect for **UI redesign** (which is the goal).
- **Cons:** the video pane needs the device's **ActiveX/OCX browser plugin**
  (`pluginVersion.js` / `CheckPluginVersionEx` / `GetPluginVersion`), which:
  - is a native Win32 control, not shipped in the firmware web assets,
  - only ran in legacy IE, and does **not** load in modern browsers.
  So live video never appears — but every panel, menu, and control does.

### 2. Mock backend (CGI/API)  ✅ WORKING (what we built)
`mock_camera_api.py` answers the login/handshake calls the UI makes on load
(`Login.cgi`, `GetPreLoginInfo`, `GetPluginVersion`) with canned JSON so the UI
proceeds past its splash/login instead of hanging.
- **Pros:** lets you exercise real UI navigation locally; safe; fully in our control.
- **Cons:** it's a **fake**, not the firmware. Behaviour is only as deep as we script.

### 3. Full system emulation (QEMU-arm)  ⚠ NOT DONE / NOT VERIFIED
Boot the actual ARM kernel + squashfs rootfs under `qemu-system-arm`.
- **Reality:** GK7205V300 has **no ready QEMU machine model**; it needs custom device
  trees, and the vendor init depends on proprietary `/dev` nodes, ISP hardware, sensor
  I2C, and hardware crypto that QEMU doesn't provide. The web server (`sonia`/XM app)
  typically **won't come up** without those. Getting even a shell is a research project.
- **Requirements if you ever attempt it (all approval-gated):** WSL2 Ubuntu or Linux VM,
  `qemu-system-arm` + `binwalk`/`sasquatch`, BIOS virtualization. Possibly BIOS/feature
  changes → **stop-and-ask**.
- **Verdict:** **Do not assume it works.** Not needed for a UI-only redesign.

### 4. Real hardware  (reference only)
A physical camera on an isolated VLAN would serve the true UI + video. Out of scope for
this lab and explicitly not required to redesign the UI.

## Do you need emulation for the goal?
**No.** The goal is a **UI-only redesign**. Options 1 + 2 already give you the full HTML
surface plus a cooperative backend to click through. Full firmware emulation (option 3)
would only matter if you needed real device *behaviour/video*, which is out of scope and
unverified.

## If you later want to push further (your call, needs approval)
1. Approve **WSL2 Ubuntu** + `binwalk`/`sasquatch` for cleaner rootfs extraction.
2. Attempt a **chroot/user-mode** run of only the web daemon under `qemu-arm` static —
   expect missing-device failures; treat as experiment, not a deliverable.
3. Keep everything on **loopback/isolated network**; never bridge a mock or emulated
   service to a real camera or the LAN.
