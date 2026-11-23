#!/usr/bin/env python3
"""v0.15.211: normalize the *actual* in-game bouquet geometry for all seven wrappers."""
from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf8')
tag='<!-- FTZ v0.15.211 NORMALIZED SEVEN WRAPPERS -->'
if tag in s:
    print('Bouquet v211 already integrated')
    raise SystemExit(0)

def one(old,new):
    global s
    count=s.count(old)
    if count!=1:
        raise RuntimeError(f'Expected unique game source marker, found {count}: {old[:115]}')
    s=s.replace(old,new,1)

# A classic wrapper and an African wrapper must use the exact same floral slots.
old='''function tzAfricanBloomPosition(i,total){
 if(ftzIsBasket())return state.positions[i]||ftzBasketPosition(i,total);
 const wrap=$('wrap')?.value||'';
 if(!Object.prototype.hasOwnProperty.call(TZ_APPROVED_PACK_IMAGES,wrap))
   return state.positions[i]||bouquetPosFor(i,total);
 if(state.positions[i])return state.positions[i];
 return tzFloristTypedPositions(total)[i]||bouquetPosFor(i,total);
}'''
new='''function tzAfricanBloomPosition(i,total){
 // v0.15.211: only wrapping changes, not the flower arrangement.
 // Manual drags and all three florist layouts still take priority.
 if(ftzIsBasket())return state.positions[i]||ftzBasketPosition(i,total);
 if(state.positions[i])return state.positions[i];
 return tzFloristTypedPositions(total)[i]||bouquetPosFor(i,total);
}'''
one(old,new)

begin=s.index('function renderBouquet(){')
end=s.index('function renderMarket(){',begin)
part=s[begin:end]
start=part.index(" const activeWrap=$('wrap')?.value||'';")
finish=part.index(" const pocket=(greenType!=='none'?",start)
replace=""" const activeWrap=$('wrap')?.value||'kraft';
 // v0.15.211: a single floral geometry and focal scale for every sleeve.
 // Only the packaging image/material changes; flowers, depth and center stay fixed.
 const densityFactor=total<=3?1.035:total<=5?1:total<=7?.97:.94;
 const bloomBoost=1.065*densityFactor;
 const blossoms=state.chosen.map((id,i)=>{
   const pos=tzAfricanBloomPosition(i,total);
   const profile=bouquetFlowerProfile(id);
   const flower=types.find(x=>x.id===id)||{name:id};
   const cls=profile.cls?` ${profile.cls}`:'';
   const depth=Math.min(25,Math.max(15,15+Math.round(pos.y/9)));
   const tallBloom=['calla','watsonia','iris','lily','lav','tulip','bird','strelitzia'].includes(id);
   const largeBloom=['peony','sun','hydra','rose','ranunc','protea','dahlia','gerbera'].includes(id);
   const splitEdge=tallBloom?'59%':largeBloom?'54%':['agapanthusWhite','white','hydra'].includes(id)?'58%':'56%';
   const top=pos.y+profile.dy-(total>=8?5:0)-8;
   const offsetX=state.positions[i]?pos.x:(total>=7?pos.x*.88:pos.x);
   const bloomScale=(pos.scale*profile.scale*bloomBoost).toFixed(3);
   // Two image segments are needed only for textile sleeves; the photograph
   // itself and all placement values are the same in the African variants.
   const useSplit=['kraft','linen','velvet','signature'].includes(activeWrap);
   const art=ftzFlowerSource(id);
   const flowerArt=useSplit
      ? `<img class="ftz191-stem-bottom" src="${art}" alt="" aria-hidden="true" draggable="false"><img class="ftz191-flower-top" src="${art}" alt="${flower.name}" draggable="false">`
      : `<img src="${art}" alt="${flower.name}" draggable="false">`;
   return `<span class="blossom movable flower-head${cls}${useSplit?' ftz191-split':''} ftz211-unified-bloom"
     data-i="${i}" style="--fw:${profile.w}px;--fh:${profile.h}px;--ftz-head-edge:${splitEdge};left:calc(50% + ${offsetX}px);top:${top}px;transform:translateX(-50%) rotate(${pos.r}deg) scale(${bloomScale});z-index:${depth}"
     title="Перетащи цветок">${flowerArt}</span>`;
 }).join('');
"""
part=part[:start]+replace+part[finish:]
s=s[:begin]+part+s[end:]

# Ensure all seven wrappers have an opaque lower front panel, keeping original artwork.
# Preserve front/back images and the existing shape-specific clip polygons.
# Mark images with wrapper semantic types, without modifying the actual PNG/WEBP assets.
one('''const classicClass=["kraft","linen","velvet","signature"].includes(approvedWrap)?" classic-material-wrap classic-material-"+approvedWrap:(FTZ_TEST_WRAP_NAMES[approvedWrap]?" ftz-test-pack-front":"");''',
'''const classicClass=["kraft","linen","velvet","signature"].includes(approvedWrap)?" classic-material-wrap classic-material-"+approvedWrap:(FTZ_TEST_WRAP_NAMES[approvedWrap]?" ftz-test-pack-front":"");''')
# No need to touch the game save structure, prices, basket rendering or player controls.

one('</head>','<link rel="stylesheet" href="features/bouquet-realism-v211.css">\n</head>')
one('</body>',tag+'\n</body>')
p.write_text(s,encoding='utf8')
print('Integrated bouquet v211; bytes:',p.stat().st_size)
