#!/usr/bin/env python3
"""Integrate tested florist tournament into the canonical single-page game."""
from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='<!-- FTZ FLOWER FESTIVAL COMPETITIONS 0.15.208 -->'
if marker in s:
    print('Competition already installed')
    raise SystemExit(0)
def once(a,b):
    global s
    n=s.count(a)
    if n!=1: raise RuntimeError('Expected unique anchor ('+str(n)+'): '+repr(a[:120]))
    s=s.replace(a,b,1)
# Add competition results to the existing automatic game save structure; old saves migrate via default.
once("seasonRewards:{spring:null,summer:null},snapshotBouquetMarkup:''",
     "seasonRewards:{spring:null,summer:null},competitions:{},snapshotBouquetMarkup:''")
# The original 21st-day special client order should not misleadingly duplicate the NEW contest.
once("title:'Финальный конкурс флористов',budget:70,bonus:45,rep:5,required:80,detail:'Последнее испытание мастерства — финал конкурса.'",
     "title:'Заключительный заказ фестиваля',budget:70,bonus:45,rep:5,required:80,detail:'Праздничное оформление финального заказа кампании.'")
once('</head>','<link rel="stylesheet" href="features/florist-competitions.css">\n</head>')
once('</body>',marker+'''
<script src="features/florist-competitions.js"></script>
<script src="features/florist-competitions-ui.js"></script>
</body>''')
p.write_text(s,encoding='utf-8')
assert s.count(marker)==1
assert 'competitions:{}' in s
print('Integrated florist festival, bytes',p.stat().st_size)
