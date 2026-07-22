import os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

WEB = r"exe-work/04-ui-development/Web"
LG  = os.path.join(WEB, "lg")
cjk = re.compile(r'[㐀-鿿]')

# ---------- build verified cn->en map (same rules as dry-run) ----------
def parse_lang(path):
    d={}
    if not os.path.exists(path): return d
    t=open(path,encoding='utf-8',errors='ignore').read()
    for m in re.finditer(r'<string\s+id="([^"]+)"\s*>(.*?)</string>', t, re.S):
        d[m.group(1)]=m.group(2)
    return d

en=parse_lang(os.path.join(LG,"English.xml"))
raw={}          # cn -> set of en
for cf in ("SimpChinese.xml","TradChinese.xml"):
    for k,cval in parse_lang(os.path.join(LG,cf)).items():
        cval=cval.strip()
        if not cval or not cjk.search(cval): continue
        e=en.get(k,"").strip()
        if e and not cjk.search(e):
            raw.setdefault(cval,set()).add(e)
cn2en={c:list(s)[0] for c,s in raw.items() if len(s)==1}   # skip conflicts
pairs=sorted(cn2en.items(), key=lambda kv:-len(kv[0]))
print("map entries:",len(pairs),"| conflicts skipped:",sum(1 for s in raw.values() if len(s)>1))

def apply_map(t):
    n=0
    for c,e in pairs:
        if c in t:
            n+=t.count(c); t=t.replace(c,e)
    return t,n

# ---------- per-file specific fixes (applied on RAW text, before map) ----------
specific={
 "html/live.html":            [("增加预置点","Add Preset")],
 "html/playback.html":        [("回放方式","Playback Mode")],
 "html/cfg/Advance_ImportEx.html":[("全选","Select All")],
 "html/cfg/System_Display.js":[('px 宋体','px SimSun'), ('"宋体"','"SimSun"')],
 "plugin/RSUI.js":            [('["日","一","二","三","四","五","六"]','["Su","Mo","Tu","We","Th","Fr","Sa"]')],
 "plugin/common.js":[
     ('\t["Japanese", "日本語"],\n','\t["Japanese", "Japanese"],\n'),
     ('\t["SimpChinese", "简体中文"],\n',''),
     ('\t["TradChinese","繁體中文"],\n',''),
     (' SimpChinese',''),
     (' TradChinese',''),
 ],
}

skip_ext={'.png','.gif','.jpg','.jpeg','.ico','.bin','.woff','.ttf','.eot','.xml','.py','.txt'}
changed=0; total_repl=0; spec_hits=0
for dp,dn,fn in os.walk(WEB):
    if dp.replace('\\','/').endswith('/lg') or '/lg/' in (dp.replace('\\','/')+'/'): continue
    for f in fn:
        if os.path.splitext(f)[1].lower() in skip_ext: continue
        p=os.path.join(dp,f); rel=os.path.relpath(p,WEB).replace(os.sep,'/')
        try: t=orig=open(p,encoding='utf-8',errors='ignore').read()
        except: continue
        for a,b in specific.get(rel,[]):
            if a in t: t=t.replace(a,b); spec_hits+=1
            else: print("  !! specific NOT FOUND in",rel,": (ascii-hidden idx",specific[rel].index((a,b)),")")
        t,n=apply_map(t); total_repl+=n
        if t!=orig:
            open(p,'w',encoding='utf-8',newline='').write(t); changed+=1

print("files changed:",changed,"| map replacements:",total_repl,"| specific fixes:",spec_hits)

# ---------- delete Chinese language packs ----------
for x in ("SimpChinese.xml","TradChinese.xml"):
    fp=os.path.join(LG,x)
    if os.path.exists(fp): os.remove(fp); print("deleted",x)
