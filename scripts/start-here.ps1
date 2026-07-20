<#
.SYNOPSIS
    Interactive menu for the Video Player UI lab. Wraps the safe launchers.
.DESCRIPTION
    Nothing here executes the installer, flashes firmware, or edits originals.
    Every option is loopback-only and read-only w.r.t. docs-recources.
.NOTES
    Run: powershell -ExecutionPolicy Bypass -File .\scripts\start-here.ps1
#>
[CmdletBinding()]
param()
$ErrorActionPreference = "Stop"
$scripts = $PSScriptRoot

function Show-Menu {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  Video Player UI Lab  -  safe local environment" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  Originals in docs-recources are READ-ONLY. Nothing"
    Write-Host "  below runs the installer or flashes firmware."
    Write-Host ""
    Write-Host "  1) Verify source integrity (hashes + structure)"
    Write-Host "  2) Preview FIRMWARE web UI      -> http://127.0.0.1:8088/index.htm"
    Write-Host "  3) Start MOCK camera API        -> UI :8088  + player bridge :54455"
    Write-Host "  4) Preview EXE UI MOCK          -> http://127.0.0.1:8090/index.html"
    Write-Host "  5) Open reports\final-setup-report.md"
    Write-Host "  6) Open docs\ folder"
    Write-Host "  Q) Quit"
    Write-Host ""
}

function Invoke-Script([string]$name) {
    $p = Join-Path $scripts $name
    if (-not (Test-Path $p)) { Write-Host "Not found: $name" -ForegroundColor Red; return }
    & powershell -ExecutionPolicy Bypass -File $p
}

do {
    Show-Menu
    $choice = Read-Host "Choose"
    switch ($choice.ToUpper()) {
        "1" { Invoke-Script "verify-environment.ps1" }
        "2" { Write-Host "Tip: start the mock camera (option 3) in another window first." -ForegroundColor Yellow
              Invoke-Script "preview-firmware-ui.ps1" }
        "3" { Invoke-Script "run-mock-camera.ps1" }
        "4" { Invoke-Script "preview-exe-ui.ps1" }
        "5" { $r = Join-Path $scripts "..\reports\final-setup-report.md"
              if (Test-Path $r) { Start-Process (Resolve-Path $r).Path } else { Write-Host "Report not generated yet." -ForegroundColor Yellow } }
        "6" { Start-Process (Resolve-Path (Join-Path $scripts "..\docs")).Path }
        "Q" { break }
        default { Write-Host "Unknown choice." -ForegroundColor Yellow }
    }
} while ($choice.ToUpper() -ne "Q")

Write-Host "Bye." -ForegroundColor Gray
