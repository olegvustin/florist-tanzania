#!/usr/bin/env python3
"""Make silk selectable from day one, preserving the premium upgrade's scoring bonus."""
from pathlib import Path

p = Path('index.html')
s = p.read_text('utf-8')
if 'Цветы Африки v0.15.216</title>' in s:
    raise SystemExit(0)

def once(old, new):
    global s
    assert s.count(old) == 1, old
    s = s.replace(old, new, 1)

once(""" const premiumOpt=document.querySelector('#wrap option[value="signature"]');
 if(premiumOpt) premiumOpt.disabled=!state.upgrades.premiumPack;
 if(!state.upgrades.premiumPack && $('wrap').value==='signature') $('wrap').value='velvet';
""", '')
once("desc:'Открывает эксклюзивные материалы, традиционные орнаменты и роскошное оформление букетов. Повышает впечатление от дорогих заказов.',bonus:'Открывает шёлковую упаковку'",
     "desc:'Добавляет профессиональную отделку букетам в упаковке «Премиум-шёлк». Сама упаковка доступна с первого заказа.',bonus:'До +6 к оценке за премиум-шёлк'")
once("if(!option||option.disabled){marketMessage('Премиум-шёлк открывается после улучшения «Премиум-упаковка».');return;}",
     "if(!option||option.disabled)return;")
once('Цветы Африки v0.15.215</title>','Цветы Африки v0.15.216</title>')
p.write_text(s, 'utf-8')
