<#
.SYNOPSIS
    Re-verifies that the two original source files are byte-for-byte unchanged
    and that the workspace structure is intact. READ-ONLY: changes nothing.
.DESCRIPTION
    Recomputes SHA-256 for both files in docs-recources and compares them to the
    integrity baseline recorded in reports/source-hashes.txt (Phase 1).
    Also checks that the expected workspace folders and read-only copies exist.
.NOTES
    Safe: no elevation, no execution of the sources, no writes to docs-recources.
    Exit code 0 = all good; 1 = a mismatch or missing item was found.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

# Baseline (from reports/source-hashes.txt — Phase 1)
$expected = @(
    [pscustomobject]@{
        Name = "VideoPlayToolSetup.exe"
        Path = Join-Path $root "docs-recources\VideoPlayToolSetup.exe"
        Sha  = "ADE9CA40BD24D5C69A96D3FC5EE4058A5A1A9E90AF2EACFA2B8712861A09F06A"
        Size = 47064869
    },
    [pscustomobject]@{
        Name = "000699N5.1IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.zip"
        Path = Join-Path $root "docs-recources\000699N5.1IPC_GK7205V300_G5F.Nat.dss.OnvifS.HIK_V5.00.R02.zip"
        Sha  = "FF5DC0D2D6E7CEFD82854367FC5E581A947157A6E07FDE59D845971A4B66EC59"
        Size = 7380645
    }
)

$fail = $false
Write-Host "=== Source integrity check (READ-ONLY) ===" -ForegroundColor Cyan

foreach ($f in $expected) {
    if (-not (Test-Path -LiteralPath $f.Path)) {
        Write-Host "[MISSING] $($f.Name)" -ForegroundColor Red; $fail = $true; continue
    }
    $item = Get-Item -LiteralPath $f.Path
    $got  = (Get-FileHash -LiteralPath $f.Path -Algorithm SHA256).Hash
    $okHash = ($got -eq $f.Sha)
    $okSize = ($item.Length -eq $f.Size)
    $ro   = [bool]($item.Attributes -band [IO.FileAttributes]::ReadOnly)

    Write-Host ""
    Write-Host $f.Name -ForegroundColor White
    Write-Host ("  SHA-256 : {0}" -f $(if ($okHash) { "MATCH" } else { "*** MISMATCH ***" })) -ForegroundColor $(if ($okHash) { "Green" } else { "Red" })
    Write-Host ("  Size    : {0} ({1} bytes)" -f $(if ($okSize) { "MATCH" } else { "*** MISMATCH ***" }), $item.Length) -ForegroundColor $(if ($okSize) { "Green" } else { "Red" })
    Write-Host ("  ReadOnly: {0}" -f $(if ($ro) { "yes" } else { "NO (advisory - recommend setting read-only)" })) -ForegroundColor $(if ($ro) { "Green" } else { "Yellow" })
    if (-not ($okHash -and $okSize)) { $fail = $true }
}

# Structure check
$dirs = @("exe-work","firmware-work","shared-tools","docs","scripts","reports",
          "exe-work\00-original-copy","firmware-work\00-original-copy",
          "firmware-work\05-web-ui-development","exe-work\05-browser-preview")
Write-Host "`n=== Structure check ===" -ForegroundColor Cyan
foreach ($d in $dirs) {
    $p = Join-Path $root $d
    if (Test-Path -LiteralPath $p) { Write-Host "  [ok]   $d" -ForegroundColor Green }
    else { Write-Host "  [MISS] $d" -ForegroundColor Red; $fail = $true }
}

Write-Host ""
if ($fail) {
    Write-Host "RESULT: PROBLEM DETECTED - see red lines above." -ForegroundColor Red
    exit 1
} else {
    Write-Host "RESULT: OK - sources unchanged, structure intact." -ForegroundColor Green
    exit 0
}
