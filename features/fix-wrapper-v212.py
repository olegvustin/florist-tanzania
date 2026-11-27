#!/usr/bin/env python3
"""v0.15.212 — clean embedded approved wrapping art and keep lower stems behind real front flap."""
from pathlib import Path
import re, base64, io
from PIL import Image, ImageDraw, ImageFilter, ImageChops
p=Path('index.html')
s=p.read_text('utf-8')
marker='<!-- FTZ v0.15.212 CLEAN WRAPPER SOURCES -->'
if marker in s:
    print('Already integrated');raise SystemExit
a=s.index('const TZ_APPROVED_PACK_IMAGES=')
b=s.index('};',a)+2
part=s[a:b]
names=('savanna','baobab','kilimanjaro','zanzibar')
count=0
for name in names:
    m=re.search(r'(?P<head>(?:\\b)?'+name+r':")(data:image/(?:png|webp);base64,[A-Za-z0-9+/=]+)(?P<tail>")',part)
    if m is None:raise RuntimeError('Missing approved wrap image '+name)
    uri=m.group(2)
    pic=Image.open(io.BytesIO(base64.b64decode(uri.split('base64,',1)[1]))).convert('RGBA')
    w,h=pic.size
    # The previous source assets contain semi-visible rectangular matte at the
    # bottom/sides; removing it from the actual PNG avoids ghost rectangles in
    # thumbnails, the empty constructor, and finished bouquets.
    existing=pic.getchannel('A')
    silhouette=Image.new('L',(w,h),0)
    draw=ImageDraw.Draw(silhouette)
    # Loose tapered silhouette: open side wings, narrow lower knot.
    pts=[(.5,.018),(.91,.075),(.98,.23),(.98,.44),(.90,.55),
         (.79,.64),(.68,.76),(.64,.94),(.59,.995),(.41,.995),
         (.36,.94),(.32,.76),(.21,.64),(.10,.55),(.02,.44),
         (.02,.23),(.09,.075)]
    draw.polygon([(int(x*w),int(y*h)) for x,y in pts],fill=255)
    silhouette=silhouette.filter(ImageFilter.GaussianBlur(2.2))
    alpha=ImageChops.multiply(existing,silhouette)
    # Faint, translucent background fragments should be entirely absent.
    alpha=alpha.point(lambda x:0 if x<48 else x)
    pic.putalpha(alpha)
    out=io.BytesIO()
    pic.save(out,format='PNG',optimize=True,compress_level=8)
    newuri='data:image/png;base64,'+base64.b64encode(out.getvalue()).decode('ascii')
    part=part[:m.start(2)]+newuri+part[m.end(2):]
    count+=1
assert count==4
s=s[:a]+part+s[b:]

# Explicit semantic classes for every approved African design; legacy
# ftz-test-pack-front is absent on some production wrappers.
old='const classicClass=["kraft","linen","velvet","signature"].includes(approvedWrap)?" classic-material-wrap classic-material-"+approvedWrap:(FTZ_TEST_WRAP_NAMES[approvedWrap]?" ftz-test-pack-front":"");'
assert s.count(old)==1, 'Missing approved wrapper class generator'
s=s.replace(old,old+'\\n  const africanClass=["savanna","baobab","kilimanjaro","zanzibar"].includes(approvedWrap)?" ftz212-african-front":"";',1)
old='approved-african-pack-overlay${classicClass}'
assert s.count(old)==1
s=s.replace(old,'approved-african-pack-overlay${classicClass}${africanClass}',1)
old='approved-african-pack${FTZ_TEST_WRAP_NAMES[approvedWrap]?\' ftz-test-pack-back\':\'\'}'
assert s.count(old)==1,'Missing approved back class'
s=s.replace(old,'approved-african-pack${FTZ_TEST_WRAP_NAMES[approvedWrap]?\' ftz-test-pack-back\':\'\'}${africanClass?\' ftz212-african-back\':\'\'}',1)

assert s.count('</head>')==1
s=s.replace('</head>','<link rel="stylesheet" href="features/african-front-v212.css">\n</head>',1)
assert s.count('</body>')==1
s=s.replace('</body>',marker+'\n</body>',1)
p.write_text(s,encoding='utf-8')
print('Cleaned',count,'approved image assets; size=',p.stat().st_size)
