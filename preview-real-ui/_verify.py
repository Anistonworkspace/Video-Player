import os, re, io
WEB=r"exe-work/04-ui-development/Web"
cjk=re.compile(r'[㐀-鿿]')
def strip_comments(src):
    src=re.sub(r'/\*.*?\*/','',src,flags=re.S)
    return "\n".join(re.sub(r'//.*$','',ln) for ln in src.splitlines())
skip={'.png','.gif','.jpg','.jpeg','.ico','.bin','.woff','.ttf','.eot','.xml','.py','.txt'}
code_cjk=0; com_cjk=0; lines=[]
for dp,dn,fn in os.walk(WEB):
    if dp.replace('\\','/').rstrip('/').endswith('/lg'): continue
    for f in fn:
        if os.path.splitext(f)[1].lower() in skip: continue
        p=os.path.join(dp,f); rel=os.path.relpath(p,WEB).replace(os.sep,'/')
        t=open(p,encoding='utf-8',errors='ignore').read()
        if not cjk.search(t): continue
        code=strip_comments(t)
        cc=len(cjk.findall(code)); code_cjk+=cc; com_cjk+=len(cjk.findall(t))-cc
        for i,ln in enumerate(code.splitlines(),1):
            if cjk.search(ln): lines.append(f"{rel}:{i}: {ln.strip()[:150]}")
io.open("preview-real-ui/_verify_out.txt","w",encoding="utf-8").write("\n".join(lines))
print("CURRENT post-apply state of Web UI (excluding lg/ packs):")
print("  rendering/code CJK chars :", code_cjk)
print("  comment CJK chars        :", com_cjk)
print("  code CJK lines           :", len(lines), "-> preview-real-ui/_verify_out.txt")
# also confirm no Chinese language packs remain & no Chinese in language list
print("  lg/*.xml remaining       :", sorted(os.listdir(os.path.join(WEB,'lg'))) )
