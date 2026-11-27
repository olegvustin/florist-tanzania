#!/usr/bin/env python3
"""Tighten the silk sleeve silhouette without shifting or resizing the flowers."""
from pathlib import Path

p = Path('index.html')
s = p.read_text('utf-8')
if 'Цветы Африки v0.15.217</title>' in s:
    raise SystemExit(0)

def once(old, new):
    global s
    assert s.count(old) == 1, old[:100]
    s = s.replace(old, new, 1)

# Scale both material layers around the same y-axis anchor. Bring up the
# knot more than the upper rim so the bouquet keeps a natural seating depth.
once('transform:translateY(20px) scaleX(.82) scaleY(.69)!important;transform-origin:50% 76%!important',
     'transform:translateY(14px) scaleX(.74) scaleY(.61)!important;transform-origin:50% 76%!important')
once('.ftz214-plant-bed[data-sleeve="velvet"],\n.ftz214-plant-bed[data-sleeve="signature"] {',
     '.ftz214-plant-bed[data-sleeve="velvet"] {')
once('</head>','''<style id="ftz-compact-silk-v217">
/* Keep natural leaves inside the narrowed silk folds, but leave the crown
   and upper leaves clear. This is also applied to deliveries and the album. */
.ftz214-plant-bed[data-sleeve="signature"] {
  --ftz214-plant-cut:polygon(-45% -65%,145% -65%,145% 34%,85% 40%,77% 48%,72% 56%,64% 64%,55% 72%,45% 72%,36% 64%,28% 56%,23% 48%,15% 40%,-45% 34%);
}
</style>
</head>''')
once('Цветы Африки v0.15.216</title>','Цветы Африки v0.15.217</title>')
p.write_text(s, 'utf-8')
