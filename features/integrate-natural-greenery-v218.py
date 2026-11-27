#!/usr/bin/env python3
from pathlib import Path

p = Path('index.html')
s = p.read_text('utf-8')
if 'ftz218GreenCache' in s:
    raise SystemExit(0)
a = s.index('function greenerySvgMarkup(green,preview=false){')
b = s.index('function renderGreenerySVG(){', a)
s = s[:a] + Path('features/natural-greenery-v218.js').read_text('utf-8') + s[b:]

def once(old, new):
    global s
    assert s.count(old) == 1, old[:100]
    s = s.replace(old, new, 1)

# One deliberate addition above the basket's fixed base, not two copies of the
# same plant on either side of the flowers. Remove classic's redundant layer too.
once('${plants}${ftz173SelectedGreenAccents(greenType)}${ftz168RimFoliage()}', '${plants}${ftz168RimFoliage()}')
a = s.index('function ftz173SelectedGreenAccents(greenType){')
b = s.index('function renderBouquet(){', a)
s = s[:a]+s[b:]
once(" const pocket=(greenType!=='none'?renderGreenerySVG():'');\n", '')
once(' const pocketLayers=(!testPack&&pocket)?`<div class="ftz-pocket-layers ftz-wrap-pocket">${pocket}</div>`:\'\';\n', '')
assert s.count('${pocketLayers}${accent}${blossoms}') == 2
s = s.replace('${pocketLayers}${accent}${blossoms}','${accent}${blossoms}')
once('</head>', '''<style id="ftz-natural-greenery-v218">
:is(#stage-1 .bouquet,.bouquet,.handoff-bouquet,.snapshot-bouquet) .ftz-paper-selected-green:has(> .ftz218-green-art) {
  transform:none!important;
  opacity:1!important;
}
:is(#stage-1 .bouquet,.bouquet,.handoff-bouquet,.snapshot-bouquet) .ftz-paper-selected-green > .ftz218-green-art {
  transform:none!important;
  opacity:1!important;
  filter:drop-shadow(0 1px 1px #2c422331)!important;
}
:is(#stage-1 .bouquet,.bouquet,.handoff-bouquet,.snapshot-bouquet) > .ftz167-selected-green:has(> .ftz218-green-art) {
  z-index:19!important;
  clip-path:polygon(13% 15%,87% 15%,89% 48%,78% 64%,66% 75%,34% 75%,22% 64%,11% 48%)!important;
}
:is(#stage-1 .bouquet,.bouquet,.handoff-bouquet,.snapshot-bouquet) > .ftz167-selected-green > .ftz218-green-art {
  transform:translateY(10px) scale(.91)!important;
  transform-origin:50% 62%!important;
  opacity:1!important;
  filter:drop-shadow(0 1px 1px #2c422331)!important;
}
</style>
</head>''')
once('Цветы Африки v0.15.217</title>','Цветы Африки v0.15.218</title>')
p.write_text(s, 'utf-8')
