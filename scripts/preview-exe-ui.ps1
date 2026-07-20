<#
.SYNOPSIS
    Serves the labelled VideoPlayTool UI MOCK in a local browser (read-only, no video, no network I/O).
.DESCRIPTION
    Starts Python's built-in static file server bound to loopback only and opens the mock UI.
    This does NOT run VideoPlayToolSetup.exe and does NOT touch docs-recources.
    The served page is a hand-built HTML approximation for redesign reference only.
.NOTES
    Safe: no elevation, no install, loopback-only bind (127.0.0.1).
    Stop with Ctrl+C.
#>
[CmdletBinding()]
param(
    [int]$Port = 8090,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "..\exe-work\05-browser-preview"
$root = (Resolve-Path $root).Path

if (-not (Test-Path (Join-Path $root "index.html"))) {
    Write-Error "Mock UI not found at $root (expected index.html)."
    exit 1
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
if (-not $python) {
    Write-Error "Python not found on PATH. Install Python 3 (winget install Python.Python.3.12) or open $root\index.html directly in a browser."
    exit 1
}

Write-Host "=== VideoPlayTool UI MOCK preview (reference only) ===" -ForegroundColor Cyan
Write-Host "Serving : $root" -ForegroundColor Gray
Write-Host "URL     : http://127.0.0.1:$Port/index.html" -ForegroundColor Green
Write-Host "Bind    : 127.0.0.1 (loopback only)" -ForegroundColor Gray
Write-Host "NOTE    : This is NOT the real player. No video/network/device I/O." -ForegroundColor Yellow
Write-Host "Stop    : Ctrl+C" -ForegroundColor Gray

if (-not $NoBrowser) {
    Start-Process "http://127.0.0.1:$Port/index.html"
}

Push-Location $root
try {
    & $python.Source -m http.server $Port --bind 127.0.0.1
}
finally {
    Pop-Location
}
