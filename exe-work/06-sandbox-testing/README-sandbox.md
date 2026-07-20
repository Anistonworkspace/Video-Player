# Windows Sandbox inspection — PREP ONLY (approval required)

This folder contains a **prepared** Windows Sandbox configuration for inspecting
`VideoPlayToolSetup.exe` in a disposable, isolated VM. **Nothing here has been run.**
Launching the sandbox and running the installer both require **your explicit approval**.

## Files
| File | Purpose |
|------|---------|
| `VideoPlayTool-sandbox.wsb` | Sandbox config. Maps `docs-recources` **read-only** to `C:\evidence`, maps `scratch\` read-write to `C:\scratch`. Networking, GPU, mic, camera, clipboard, printer all **disabled**. No auto-run command. |
| `scratch\` | Empty read-write scratch area inside the VM. |

## ⛔ BLOCKER on this host
This machine is **Windows 11 Home Single Language (10.0.26200)**.
**Windows Sandbox is NOT available on Home editions** — it ships only with
Windows 10/11 **Pro, Enterprise, or Education**. So this `.wsb` file cannot run here
as-is. Options, in order of safety (all need your approval):

1. **Preferred:** Inspect the EXE statically only (already done — see
   `reports/exe-static-analysis.md`). No execution needed for UI redesign.
2. Run the sandbox on a *different* PC that has Windows Pro/Enterprise/Education.
3. Use a full disposable VM (e.g. free VirtualBox + a throwaway Windows eval image)
   with networking disabled. This needs BIOS/UEFI virtualization + software install
   → **stop-and-ask** items per the project safety rules.

> Upgrading this host's Windows edition to enable Sandbox is a licensing/system change
> and is **out of scope** — do not do it without a separate, explicit decision.

## If/when you approve running it (on a supported edition)
Requires the one-time optional feature (needs elevation — ask first):
```powershell
# ELEVATION REQUIRED — run only after approval, on Pro/Enterprise/Education:
Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
```
Then, **manually**:
1. Double-click `VideoPlayTool-sandbox.wsb` to start the disposable VM.
2. Inside the VM, open `C:\evidence`, copy `VideoPlayToolSetup.exe` to `C:\scratch`.
3. Inspect (Properties / static tools) or, if you approve, run it **inside the VM only**.
4. Close the sandbox window → the VM and everything in it is destroyed.

The installer is **never** executed on the real host, and `docs-recources` is mounted
read-only so the original file cannot be altered.
