#!/usr/bin/env python3
"""Keep the same plant-layer clipping in the constructor and saved bouquets."""
from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
marker = '<style id="ftz-plant-silhouette-v214">'
if marker in s:
    raise SystemExit(0)

def once(old, new):
    global s
    assert s.count(old) == 1, old[:100]
    s = s.replace(old, new, 1)

once(' return `${wrap.back}${pocketLayers}${accent}${blossoms}${wrap.front}${renderPlushGift()}`;',
     ''' // The plant bed is shared by the constructor, handoff, journal and restored saves.
 const sleeved=['kraft','linen','velvet','signature','savanna','baobab','kilimanjaro','zanzibar'].includes(activeWrap);
 const plants=sleeved?`<div class="ftz214-plant-bed" data-sleeve="${activeWrap}">${pocketLayers}${accent}${blossoms}</div>`:
   `${pocketLayers}${accent}${blossoms}`;
 return `${wrap.back}${plants}${wrap.front}${renderPlushGift()}`;''')
# Retain the existing styling for player-added foliage within the plant bed.
s = s.replace('>.ftz-paper-selected-green', ' .ftz-paper-selected-green')
s = s.replace('> .ftz-paper-selected-green', ' .ftz-paper-selected-green')
once('</head>', marker+'\n'+Path('features/plant-silhouette-v214.css').read_text(encoding='utf-8')+'</style>\n</head>')
if s.count('v0.15.213</') == 1:
    once('v0.15.213</', 'v0.15.214</')
p.write_text(s, encoding='utf-8')
