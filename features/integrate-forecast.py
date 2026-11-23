#!/usr/bin/env python3
from pathlib import Path
p=Path('index.html')
s=p.read_text('utf-8')
mark='<!-- FTZ THREE FORECAST CARDS v0.15.209 -->'
if mark in s:
    print('Already installed')
    raise SystemExit(0)
assert s.count('</head>')==1
assert s.count('</body>')==1
assert 'function forecastRule(' in s
assert 'function ftzLifeBonus(' in s
bridge_anchor='window.generateDeals=function(){'
assert s.count(bridge_anchor)==1
s=s.replace(bridge_anchor,'window.FTZForecastBridge={forecastRule:()=>forecastRule()};\\n'+bridge_anchor,1)
s=s.replace('</head>','<link rel="stylesheet" href="features/forecast-three-cards.css">\n</head>',1)
s=s.replace('</body>',mark+'\n<script src="features/forecast-three-cards.js"></script>\n</body>',1)
p.write_text(s,encoding='utf-8')
print('Patched',p.stat().st_size)
