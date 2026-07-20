<#
    run-mock-camera.ps1 — Run ONLY the mock camera/player services (no auto-browser).

    Starts:
      * mock camera device backend + web UI   http://127.0.0.1:<UiPort>/
      * mock local player bridge              http://127.0.0.1:<BridgePort>/  (Cmd-WebLocalCtrl)

    This is the "mock service" entry point. All responses are canned fakes:
    no real camera, no real player, no real auth, no firmware emulation.

    Usage:
      ./scripts/run-mock-camera.ps1
      ./scripts/run-mock-camera.ps1 -BridgeOnly     # only the player bridge on 54455
#>
[CmdletBinding()]
param(
    [int]$UiPort = 8088,
    [int]$BridgePort = 54455,
    [switch]$BridgeOnly
)
$ErrorActionPreference = 'Stop'
$root   = Split-Path -Parent $PSScriptRoot
$server = Join-Path $root 'firmware-work\07-mock-camera-api\mock_camera_api.py'
if (-not (Test-Path $server)) { throw "Mock server not found: $server" }
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) { $py = Get-Command py -ErrorAction SilentlyContinue }
if (-not $py) { throw "Python not found on PATH. Install Python 3 (see reports/tool-audit.md)." }

$argsList = @($server, '--ui-port', $UiPort, '--bridge-port', $BridgePort)
if ($BridgeOnly) { $argsList += '--bridge-only' }

Write-Host "Starting mock camera/player services (safe, canned data)..." -ForegroundColor Green
& $py.Source @argsList
