import os, re, sys, io, json

WEB = r"exe-work/04-ui-development/Web"
LG = os.path.join(WEB, "lg")

def parse_lang(path):
    d = {}
    if not os.path.exists(path):
        return d
    t = open(path, encoding='utf-8', errors='ignore').read()
    for m in re.finditer(r'<string\s+id="([^"]+)"\s*>(.*?)</string>', t, re.S):
        d[m.group(1)] = m.group(2)
    return d

en = parse_lang(os.path.join(LG, "English.xml"))
cn_files = ["SimpChinese.xml", "TradChinese.xml"]
cjk = re.compile(r'[㐀-鿿]')

# build chinese_text -> english_text using shared IDS keys
cn2en = {}
conflicts = 0
for cf in cn_files:
    cn = parse_lang(os.path.join(LG, cf))
    for k, cval in cn.items():
        cval = cval.strip()
        if not cval or not cjk.search(cval):
            continue
        eval_ = en.get(k, "").strip()
        if not eval_:
            continue
        if eval_ and not cjk.search(eval_):
            if cval in cn2en and cn2en[cval] != eval_:
                conflicts += 1
                # keep the shorter/first; prefer existing
                continue
            cn2en[cval] = eval_

# sort by length desc so longer phrases replaced first
pairs = sorted(cn2en.items(), key=lambda kv: -len(kv[0]))

# scan UI files, compute coverage
skip_ext = {'.png','.gif','.jpg','.jpeg','.ico','.bin','.woff','.ttf','.eot','.xml'}
covered_total = 0
uncovered_samples = []
files_touch = {}
for dp, dn, fn in os.walk(WEB):
    if os.path.sep+'lg' in dp or dp.endswith('lg'):
        continue
    for f in fn:
        ext = os.path.splitext(f)[1].lower()
        if ext in skip_ext:
            continue
        p = os.path.join(dp, f)
        try:
            t = open(p, encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        if not cjk.search(t):
            continue
        orig = t
        n = 0
        for c, e in pairs:
            if c in t:
                cnt = t.count(c)
                t = t.replace(c, e)
                n += cnt
        rel = os.path.relpath(p, WEB).replace(os.sep, '/')
        # remaining CJK after replacement
        remain = len(cjk.findall(t))
        files_touch[rel] = {'replaced': n, 'remaining_cjk_chars': remain}
        covered_total += n

out = {
    'map_size': len(cn2en),
    'conflicts_skipped': conflicts,
    'files': files_touch,
}
io.open(r"preview-real-ui/_cn2en_report.json", "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1))

# also dump the map for review
with io.open(r"preview-real-ui/_cn2en_map.tsv", "w", encoding="utf-8") as fo:
    for c, e in pairs:
        fo.write(c + "\t" + e + "\n")

# console-safe summary
print("cn->en map entries:", len(cn2en), "| conflicts skipped:", conflicts)
print("files that would change:", len(files_touch))
tot_remain = sum(v['remaining_cjk_chars'] for v in files_touch.values())
print("total literal replacements:", covered_total, "| residual CJK chars after map:", tot_remain)
print()
print("Per-file (replaced / residual-CJK-chars):")
for k in sorted(files_touch, key=lambda x: -files_touch[x]['remaining_cjk_chars']):
    v = files_touch[k]
    print(f"  {v['replaced']:5d} repl  {v['remaining_cjk_chars']:5d} residual  {k}")
