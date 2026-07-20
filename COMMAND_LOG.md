# COMMAND LOG — Video Player UI Lab

Chronological log of every meaningful command/action taken during setup.
Read-only inspection unless explicitly noted. **Neither source file was
executed, flashed, modified, renamed, repacked, or patched.**

Legend: `SAFE` = non-destructive / read-only · `WRITE` = writes only into
project workspace (never into `docs-recources`) · `BLOCKED` = requires approval.

---

## Phase 1 — Verify workspace & baseline integrity

| # | Action | Type | Result |
|---|--------|------|--------|
| 1 | `pwd`, `ls docs-recources` | SAFE | Confirmed CWD + both source files present |
| 2 | `Get-FileHash -Algorithm SHA256` on both source files; captured size/dates | SAFE | Hashes recorded in `reports/source-hashes.txt` |
| 3 | Created project directory structure (24 dirs) | WRITE | exe-work / firmware-work / docs / scripts / reports / shared-tools |
| 4 | `Copy-Item` EXE → `exe-work/00-original-copy/`, ZIP → `firmware-work/00-original-copy/` | WRITE | Copies hash-verified MATCH vs originals |
| 5 | `Set-ItemProperty IsReadOnly $true` on both copies | WRITE | Copies marked read-only evidence |
| 6 | Wrote `.gitignore`, `reports/source-hashes.txt`, `COMMAND_LOG.md` | WRITE | — |

**Source SHA-256 baseline**
- EXE `VideoPlayToolSetup.exe` = `ADE9CA40BD24D5C69A96D3FC5EE4058A5A1A9E90AF2EACFA2B8712861A09F06A`
- ZIP `000699N5...HIK_V5.00.R02.zip` = `FF5DC0D2D6E7CEFD82854367FC5E581A947157A6E07FDE59D845971A4B66EC59`

---

## Phase 2 — Tool audit
_(entries appended below as work proceeds)_

---

## Phase 3 — EXE static analysis
_(pending)_

---

## Phase 6 — Firmware extraction
_(pending)_

---

## Approval checkpoints reached
_(none yet — will be listed here when blocked)_
