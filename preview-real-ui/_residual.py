import os, re, io, json

WEB = r"exe-work/04-ui-development/Web"
LG = os.path.join(WEB, "lg")
cjk = re.compile(r'[㐀-鿿]')

def parse_lang(path):
    d = {}
    if not os.path.exists(path): return d
    t = open(path, encoding='utf-8', errors='ignore').read()
    for m in re.finditer(r'<string\s+id="([^"]+)"\s*>(.*?)</string>', t, re.S):
        d[m.group(1)] = m.group(2)
    return d

en = parse_lang(os.path.join(LG, "English.xml"))
cn2en = {}
for cf in ("SimpChinese.xml","TradChinese.xml"):
    cn = parse_lang(os.path.join(LG, cf))
    for k,cval in cn.items():
        cval=cval.strip()
        if not cval or not cjk.search(cval): continue
        e=en.get(k,"").strip()
        if e and not cjk.search(e):
            cn2en.setdefault(cval,e)
pairs=sorted(cn2en.items(), key=lambda kv:-len(kv[0]))

def strip_comments(src):
    # remove /* */ blocks
    src=re.sub(r'/\*.*?\*/','',src,flags=re.S)
    out=[]
    for ln in src.splitlines():
        s=re.sub(r'//.*$','',ln)  # line comments (approx; ok for classification)
        out.append(s)
    return "\n".join(out)

skip_ext={'.png','.gif','.jpg','.jpeg','.ico','.bin','.woff','.ttf','.eot','.xml'}
comment_only=0
code_residual_lines=[]
per_file={}
for dp,dn,fn in os.walk(WEB):
    if dp.endswith('lg') or (os.sep+'lg') in dp: continue
    for f in fn:
        if os.path.splitext(f)[1].lower() in skip_ext: continue
        p=os.path.join(dp,f)
        try: t=open(p,encoding='utf-8',errors='ignore').read()
        except: continue
        if not cjk.search(t): continue
        for c,e in pairs:
            if c in t: t=t.replace(c,e)
        rel=os.path.relpath(p,WEB).replace(os.sep,'/')
        code=strip_comments(t)
        code_cjk=len(cjk.findall(code))
        all_cjk=len(cjk.findall(t))
        per_file[rel]={'code_cjk':code_cjk,'comment_cjk':all_cjk-code_cjk}
        # collect actual code lines with residual cjk
        for i,ln in enumerate(code.splitlines(),1):
            if cjk.search(ln):
                code_residual_lines.append(f"{rel}:{i}: {ln.strip()[:140]}")

io.open("preview-real-ui/_residual_code.txt","w",encoding="utf-8").write("\n".join(code_residual_lines))
tot_code=sum(v['code_cjk'] for v in per_file.values())
tot_com=sum(v['comment_cjk'] for v in per_file.values())
print("After vendor cn->en map:")
print("  residual CJK in CODE (renders/logic):",tot_code)
print("  residual CJK in COMMENTS (harmless):",tot_com)
print()
print("Files with residual CODE cjk (sorted):")
for k in sorted(per_file,key=lambda x:-per_file[x]['code_cjk']):
    v=per_file[k]
    if v['code_cjk']:
        print(f"  code={v['code_cjk']:4d}  comment={v['comment_cjk']:4d}  {k}")
print()
print("residual CODE lines written to preview-real-ui/_residual_code.txt (", len(code_residual_lines), "lines )")
