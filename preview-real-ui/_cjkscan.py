import os, re, sys

root = sys.argv[1] if len(sys.argv) > 1 else r"exe-work/04-ui-development/Web"
cjk = re.compile(r'[㐀-鿿]')
skip_ext = {'.png', '.gif', '.jpg', '.jpeg', '.ico', '.bin', '.woff', '.ttf', '.eot'}
hits = {}
samples = {}
for dp, dn, fn in os.walk(root):
    for f in fn:
        p = os.path.join(dp, f)
        ext = os.path.splitext(f)[1].lower()
        if ext in skip_ext:
            continue
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        lines = t.splitlines()
        cnt = 0
        samp = []
        for i, ln in enumerate(lines, 1):
            if cjk.search(ln):
                cnt += 1
                if len(samp) < 3:
                    s = ln.strip()
                    samp.append(f"    L{i}: {s[:90]}")
        if cnt:
            rel = os.path.relpath(p, root).replace(os.sep, '/')
            hits[rel] = cnt
            samples[rel] = samp

langxml = [k for k in hits if k.startswith('lg/')]
nonlang = [k for k in hits if not k.startswith('lg/')]

print("=== ALL files with CJK ===")
for k in sorted(hits, key=lambda x: -hits[x]):
    print(f"{hits[k]:5d}  {k}")
print()
print(f"Total files: {len(hits)} | lg/ xml packs: {len(langxml)} | non-lang UI files: {len(nonlang)}")
print()
print("=== Non-language UI files (English-replacement targets) with samples ===")
for k in sorted(nonlang, key=lambda x: -hits[x]):
    print(f"\n[{hits[k]}] {k}")
    for s in samples[k]:
        print(s)
