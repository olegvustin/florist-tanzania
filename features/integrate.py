#!/usr/bin/env python3
"""Idempotently integrate plantation with the canonical 23 MB game HTML."""
from pathlib import Path
p=Path("index.html")
s=p.read_text(encoding="utf-8")
stamp="<!-- FTZ PLANTATION v0.15.207 -->"
if stamp in s:
    print("Already integrated")
    raise SystemExit(0)
def replace_once(old,new):
    global s
    n=s.count(old)
    if n != 1: raise RuntimeError(f"Expected exactly one occurrence, found {n}: {old[:100]!r}")
    s=s.replace(old,new,1)

# Add rare cultivars to the canonical flower catalogue before initial stock setup.
anchor='types.push({id:"watsonia",name:"Ватсония",trait:"нежность рассвета",price:9,buy:5,rarity:"common",tags:["hope","joy"]});'
extra='''
// v0.15.207 — rare plantation cultivars, never sold at market.
types.push(
  {id:"rare-protea-royal",name:"Королевская протея",trait:"эксклюзив плантации",price:16,buy:0,rarity:"premium",tags:["care","hope"],plantationOnly:true},
  {id:"rare-strelitzia-gold",name:"Золотая стрелиция",trait:"эксклюзив плантации",price:17,buy:0,rarity:"premium",tags:["joy","hope"],plantationOnly:true},
  {id:"rare-gloriosa-flame",name:"Огненная глориоза",trait:"эксклюзив плантации",price:18,buy:0,rarity:"premium",tags:["passion","love"],plantationOnly:true}
);
'''
replace_once(anchor,anchor+"\n"+extra)
# Existing nursery discount is replaced, not combined, with the new plantation.
replace_once("desc:'Собственные посадки позволяют закупать цветы на рынке дешевле.',bonus:'−1 монета за каждый цветок на рынке'",
             "desc:'Выращивайте три сорта, которых нет на рынке: королевскую протею, золотую стрелицию и огненную глориозу.',bonus:'3 грядки · 3 эксклюзивных цветка'")
replace_once('return Math.max(1,base-(state.upgrades.nursery?1:0));','return Math.max(1,base);')
# Only regular flowers appear on the marketplace, including in the sale restriction.
replace_once("$('marketGrid').innerHTML=types.map(f=>{",
             "$('marketGrid').innerHTML=types.filter(f=>!f.plantationOnly).map(f=>{")
replace_once("if(!flower||!state.availability[id]){marketMessage('Сегодня этот цветок на рынке недоступен.');return;}",
             "if(!flower||flower.plantationOnly||!state.availability[id]){marketMessage('Сегодня этот цветок на рынке недоступен.');return;}")
# Give newly grown cultivars fallback colors for any vector rendering path.
replace_once('function petalRing(',
'''Object.assign(palettes,{
  "rare-protea-royal":["#ad5276","#f8bbc5","#6d355c"],
  "rare-strelitzia-gold":["#efb834","#fff0a3","#b87c20"],
  "rare-gloriosa-flame":["#e94a34","#ffd76e","#ac3128"]
});
function petalRing(''')
# External files share the main game's existing stock state and save format.
css=stamp+'''
<style id="ftz-rare-plantation-css">
.ftz-rare-plantation{margin:22px 0;padding:20px;border-radius:20px;border:1px solid #dacda4;background:linear-gradient(145deg,#fffdf2,#edf4e5);color:#30513b}
.ftz-rare-heading{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center}
.ftz-rare-heading h3{font:600 24px Georgia,serif;margin:0 0 6px}
.ftz-rare-heading p{font-size:13px;line-height:1.5;margin:0;max-width:560px}
.ftz-rare-status{font-size:12px;font-weight:700;color:#57704d}
.ftz-rare-plots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
.ftz-rare-plot{display:flex;flex-direction:column;gap:10px;min-height:155px;padding:14px;border:1px solid #d9e0ca;background:#fffef9;border-radius:15px}
.ftz-rare-plot b{font-size:12px;color:#749078}.ftz-rare-plot strong{font-size:15px}
.ftz-rare-plot small{font-size:12px;color:#617761}
.ftz-rare-plot select{width:100%;min-width:0;padding:9px;border:1px solid #c9d6c4;border-radius:8px;background:white}
.ftz-rare-plot button{margin-top:auto;padding:10px;border:0;border-radius:10px;background:#35684b;color:white;font-weight:700;cursor:pointer}
.ftz-rare-plot button:disabled{opacity:.46;cursor:not-allowed}
.ftz-rare-inventory{font-size:12px;line-height:1.6;margin:15px 0 0;color:#506b4f}
.ftz-rare-message{font-size:13px;margin:5px 0 0}
@media(max-width:760px){.ftz-rare-plantation{padding:14px;margin:14px 0}.ftz-rare-plots{grid-template-columns:1fr}.ftz-rare-heading h3{font-size:21px}}
</style>
<script src="features/rare-plantation.js"></script>
<script src="features/rare-plantation-ui.js"></script>
'''
if '</body>' not in s: raise RuntimeError('Missing HTML body end tag')
s=s.replace('</body>',css+'</body>',1)
# Static sanity before replacing original.
for token in ('"rare-protea-royal"','"rare-strelitzia-gold"','"rare-gloriosa-flame"',
              'types.filter(f=>!f.plantationOnly).map','features/rare-plantation-ui.js'):
    assert token in s, token
p.write_text(s,encoding="utf-8")
print(f"Updated index.html: {len(s):,} characters")
