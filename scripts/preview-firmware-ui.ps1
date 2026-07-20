<#
    preview-firmware-ui.ps1 — Launch the SAFE local preview of the camera firmware web UI.

    Serves firmware-work/05-web-ui-development/ via the pure-Python mock server
    (mock camera backend + mock player bridge). No camera, no real player, no
    downloads, no admin. Nothing in docs-recources is touched.

    Usage:
      ./scripts/preview-firmware-ui.ps1                 # UI on 8088, bridge on 54455
      ./scripts/preview-firmware-ui.ps1 -UiPort 8090
      ./scripts/preview-firmware-ui.ps1 -NoInject       # raw shipped UI, no banner/adapter
#>
[CmdletBinding()]
param(
    [int]$UiPort = 8088,
    [int]$BridgePort = 54455,
    [switch]$NoInject,
    [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$root   = Split-Path -Parent $PSScriptRoot
$server = Join-Path $root 'firmware-work\07-mock-camera-api\mock_camera_api.py'

if (-not (Test-Path $server)) { throw "Mock server not found: $server" }
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) { $py = Get-Command py -ErrorAction SilentlyContinue }
if (-not $py) { throw "Python not found on PATH. Install Python 3 (see reports/tool-audit.md)." }

$argsList = @($server, '--ui-port', $UiPort, '--bridge-port', $BridgePort)
if ($NoInject) { $argsList += '--no-inject' }

Write-Host "Starting SAFE firmware UI preview -> http://127.0.0.1:$UiPort/" -ForegroundColor Green
Write-Host "Mock player bridge               -> http://127.0.0.1:$BridgePort/  (mock VideoPlayTool)" -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray

if (-not $NoBrowser) {
    Start-Job -ScriptBlock { param($u) Start-Sleep 2; Start-Process $u } -ArgumentList "http://127.0.0.1:$UiPort/" | Out-Null
}
& $py.Source @argsList
