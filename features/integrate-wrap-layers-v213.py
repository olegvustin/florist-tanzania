#!/usr/bin/env python3
"""Integrate the source-aligned classic wrap layers into the standalone build."""
from pathlib import Path

p = Path('index.html')
s = p.read_text('utf-8')
marker = '<style id="ftz-wrap-layers-v213">'
if marker in s:
    print('Already integrated')
    raise SystemExit(0)
def once(old, new):
    global s
    if s.count(old) != 1:
        raise ValueError('Expected exactly one integration point: ' + old[:90])
    s = s.replace(old, new, 1)

once('  const africanClass=["savanna","baobab","kilimanjaro","zanzibar"].includes(approvedWrap)?" ftz212-african-front":"";', '''  const africanClass=["savanna","baobab","kilimanjaro","zanzibar"].includes(approvedWrap)?" ftz212-african-front":"";
  const physicalClassic=approvedWrap==="kraft"||approvedWrap==="linen";
  const frontArt=physicalClassic
    ? `<svg class="ftz213-front-raster" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image class="ftz213-front-image" href="${image}" x="0" y="0" width="100" height="100"/></svg>`
    : markup;''')
once('${classicClass}${africanClass}">${markup}</div>${decorOverlay}${noteOverlay}', '${classicClass}${africanClass}${physicalClassic?\' ftz213-classic-front\':\'\'}">${frontArt}</div>${decorOverlay}${noteOverlay}')
once("const useSplit=['kraft','linen','velvet','signature'].includes(activeWrap);",
     "const useSplit=['velvet','signature'].includes(activeWrap);")
# Leave the other wrappers and the single-file export intact.
once('</head>', marker+'\n'+Path('features/wrap-layers-v213.css').read_text('utf-8')+'</style>\n</head>')
# Keep the on-page build label synchronized with the release.
once('v0.15.211</', 'v0.15.213</') if s.count('v0.15.211</') == 1 else None
p.write_text(s, 'utf-8')
