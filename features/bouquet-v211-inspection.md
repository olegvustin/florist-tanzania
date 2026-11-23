# Bouquet v0.15.211 source inspection
size 22854435

## function renderBouquet(){ Count 1
AT 14053386
s="ftz173-selected-green-accents" data-greenery="${greenType}" aria-hidden="true">${greenerySvgMarkup(greenType,false)}</div>`;
}
function renderBouquet(){
 const wrap=renderHandoffWrapLayers();
 const isBasket=ftzIsBasket();
 if(!state.chosen.length) return wrap.back+'<span class="empty">Выбери первый цветок…</span>'+wrap.front;
 const total=state.chosen.length;
 const greenType=$('greenery')?.value||'none';
 if(isBasket){
   // New basket-only stack: back wicker -> transparent botanical base -> purchased flowers
   // -> chosen greenery -> front wicker and clean handle hardware.
   const plants=state.chosen.map((id,i)=>ftz167BasketFlower(id,i,total)).join('');
   return `${wrap.back}${ftz167BasketFiller(total)}${ftz167BasketSelectedGreen(greenType)}${plants}${ftz173SelectedGreenAccents(greenType)}${ftz168RimFoliage()}${ftzBasketHandleOverlay()}${wrap.front}${renderPlushGift()}`;
 }
 const activeWrap=$('wrap')?.value||'';
 // Classical material wraps need a denser, slightly lifted flower cluster so the
 // bouquet reads as flowers first, packaging second.
 // v0.15.189: подгоняем пропорции не только для бархата, но и для крафта/льна.
 const wrapBalance={
  kraft:{scale:1.18,lift:13,spread:.95,settleTall:13,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  linen:{scale:1.19,lift:12,spread:.97,settleTall:12,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  velvet:{scale:1.16,lift:2,spread:1.05,settleTall:11,settleLarge:18,settleRegular:15,nudge:[-3,1,3,-1]},
  signature:{scale:1.13,lift:12,spread:.96,settleTall:10,settleLarge:16,settleRegular:14,nudge:[-3,0,2,3]}
 };
 const balance=wrapBalance[activeWrap]||{scale:1,lift:0,spread:1,settleTall:0,settleLarge:0,settleRegular:0,nudge:[0,0,0,0]};
 // Небольшие букеты требуют более заметных головок, большие — меньше увеличения.
 const densityFactor=total<=3?1.035:total<=5?1:total<=7?.97:.94;
 const classicScaleBoost=balance.scale*densityFactor;
 const classicLift=balance.lift;
 const classicNarrow=balance.spread;
 const blossoms=state.chosen.map((id,i)=>{
  const pos=tzAfricanBloomPosition(i,total);
  const profile=bouquetFlowerProfile(id);
  const f=types.find(x=>x.id===id)||{name:id};
  const cls=profile.cls?` ${profile.cls}`:'';
  const depth=Math.min(25,Math.max(15,15+Math.round(pos.y/9)));
  // v189: лёгкая плотная шапка из уже имеющихся фотографических цветков.
  // Делаем общую систему для бархата, крафта и льна: высокие акценты — позади,
  // крупные круглые головки — чуть ниже и ближе к центру.
  const classic4=!!wrapBalance[activeWrap]&&total===4;
  const tallBloom=['calla','watsonia','iris','lily','lav','tulip','bird','strelitzia'].includes(id);
  const largeBloom=['peony','sun','hydra','rose','ranunc','protea','dahlia','gerbera'].includes(id);
  const settleByWrap=wrapBalance[activeWrap]
    ? (classic4
        ? (tallBloom?balance.settleTall:largeBloom?balance.settleLarge:balance.settleRegular)
        : (activeWrap==='velvet'?(total<=3?12:14):(total<=3?10:total<=5?8:6)))
    : 0;
  const whiteCluster=['agapanthusWhite','calla'].includes(id) ? (classic4?5:2) : 0;
  const seatDrop=['kraft','linen','velvet'].includes(activeWrap)?(total<=5?10:7):0;
  const top=pos.y+profile.dy-(total>=8?5:0)-14-classicLift+settleByWrap+whiteCluster+seatDrop;
  const baseOffsetX=total>=7?pos.x*.88:pos.x;
  const separateLeftCluster=classic4&&i<2&&baseOffsetX<0?-5:0;
  const offsetX=classic4?baseOffsetX*classicNarrow+(balance.nudge?.[i]||0)+separateLeftCluster:baseOffsetX*classicNarrow;
  const bloomScale=(pos.scale*profile.scale*classicScaleBoost*(classic4?(largeBloom?1.03:1.01):1)).toFixed(3);
  const useSplit=!!wrapBalance[activeWrap];
  // Относительная граница верхней цветочной части учитывает форму вида.
  const splitEdge=tallBloom?'59%':largeBloom?'54%':['agapanthusWhite','white','hydra'].includes(id)?'58%':'56%';
  const art=ftzFlowerSource(id);
  const flowerArt=useSplit
    ? `<img class="ftz191-stem-bottom" src="${art}" alt="" aria-hidden="true" draggable="false"><img class="ftz191-flower-top" src="${art}" alt="${f.name}" draggable="false">`
    : `<img src="${art}" alt="${f.name}" draggable="false">`;
  return `<span class="blossom movable flower-head${cls}${useSplit?' ftz191-split':''}" data-i="${i}" style="--fw:${profile.w}px;--fh:${profile.h}px;--ftz-head-edge:${splitEdge};left:calc(50% + ${offsetX}px);top:${top}px;transform:translateX(-50%) rotate(${pos.r}deg) scale(${bloomScale});z-index:${depth}" title="Перетащи цветок">${flowerArt}</span>`;
 }).join('');
 const pocket=(greenType!=='none'?renderGreenerySVG():'');
 // New test wraps: one restrained foliage layer only. The legacy double SVG
 // magnified spiky leaves above the bouquet and cluttered the flower faces.
 const testPack=['savanna','zanzibar','baobab','kilimanjaro','savannaClean','zanzibarClean','baobabClean','kilimanjaroClean'].includes(activeWrap);
 const pocketLayers=(!testPack&&pocket)?`<div class="ftz-pocket-layers ftz-wrap-pocket">${pocket}</div>`:'';
 const accent=greenType!=='none'?`<div class="ftz-paper-selected-green${testPack?' ftz-paper-green-tidy':''}" aria-hidden="true" data-greenery="${greenType}">${greenerySvgMarkup(greenType,false)}</div>`:'';
 return `${wrap.back}${pocketLayers}${accent}${blossoms}${wrap.front}${renderPlushGift()}`;
}
function renderMarket(){
 if(!$('marketGrid'))return;
 const season=currentSeason();
 $('marketGrid').innerHTML=types.filter(f=>!f.plantationOnly).map(f=>{
  const stock=stockCount(f.id),deal=currentBuyPrice(f.id),ok=state.availability[f.id];
  const saving=springSavingsPerFlower(f.id),buyOne=purchaseCost(f.id,1),buyThree=purchaseCost(f.id,3);
  const hint=saving?`🎁 Скидка ${saving} за цветок`:season.featured.includes(f.id)?'Сезонный хит':season.pricey.includes(f.id)?'Сегодня дороже':'Обычная цена';
  return `<div class="marketitem ${ok?'':'outseason'}"><div class="mhead"><span class="art">${flowerArt(f)}</span><div><strong>${f.name}</strong><div class="mini">${f.trait}</div><span class="rarity ${f.rarity}">${rarityLabels[f.rarity]}</span></div></div><div class="stockline"><span>Опт: ${saving?`<s class="market-old-price">${deal}</s> `:''}<b>${deal-saving}</b> <span class="coin-icon" role="img" aria-label="монета"></span></span><span>На складе: <b>${stock}</b></span></div><div class="tinyrow"><button class="tinybtn" onclick="buyStem('${f.id}',1)" ${(!ok||state.money<buyOne)?'disabled':''}>Купить 1 · ${buyOne}</button><button class="tinybtn" onclick="buyStem('${f.id}',3)" ${(!ok||state.money<buyThree)?'disabled':''}>Купить 3 · ${buyThree}</button></div><span class="seasonhint">${ok?hint:'Не сезон — сегодня недоступно'}</span></div>`;
 }).join('');
}
const visualAssets={"store":"[IMAGE]

## function renderHandoffWrapLayers(){ Count 1
AT 10909823
es(color))return;
 if(el.value===color)return;
 el.value=color;
 render();
 if(typeof ftzQueueSave==='function')ftzQueueSave();
}
function renderHandoffWrapLayers(){
  if(ftzIsBasket()){
    const decoration=ftzRenderAllDecor('savanna');
    return {
      back:`<div class="ftz-basket-layer ftz-basket-back" aria-hidden="true"><img src="${ftzBasketVariantImage(state.chosen.length?"back":"emptyBack",state.chosen.length?'[IMAGE]

## function ftz167BasketFlower( Count 1
AT 13948049
A9w6MPyZf75scrqV6VSbBYyKxUI9uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" alt=""></div>`;
function ftz167BasketFlower(id,i,total){
  const originalPos=tzAfricanBloomPosition(i,total);
  // The velvet trial uses a shallow dome: rear flowers higher, front flowers
  // seated inside the fabric rather than protruding as one tall straight row.
  // Original positions remain untouched for other wraps and basket mode.
  // v0.15.197: корзина не использует упаковку activeWrap; прежняя ссылка
  // на локальную переменную из режима бархата вызывала ReferenceError.
  const pos=originalPos;
  const profile=bouquetFlowerProfile(id);
  const kind=(TZ_FLORIST_TYPES[id]||{}).role||'round';
  const isFront=kind==='large'||(total<=2&&kind!=='tall');
  const isBack=kind==='tall';
  const yOffset=(isBack?16:(isFront?31:24));
  const speciesY=(id==='calla'?3:id==='agapanthusWhite'?0:id==='peony'?-1:0);
  const y=pos.y+profile.dy+yOffset+speciesY-(ftzUseNewFlowers?6:0);
  const x=pos.x*(total<=2?1.00:1.07);
  // Retain manual per-flower positions while using species-specific natural sizes.
  const size=(pos.scale*profile.scale*(isFront?1.06:(isBack?1.00:1.05))*(total>=8?.98:1.0)*(ftzUseNewFlowers?(total>=7?1.09:1.17):1)).toFixed(3);
  const tilt=pos.r+(isBack?(pos.x<0?-2:2):0);
  const layer=isFront?'front':(isBack?'back':'middle');
  const z=isFront?63:(isBack?21:39);
  const f=types.find(p=>p.id===id)||{name:id};
  const cls=profile.cls?` ${profile.cls}`:'';
  return `<span class="blossom movable flower-head basket-seated ftz167-flower-${layer}${cls}" data-i="${i}" style="--fw:${profile.w}px;--fh:${profile.h}px;left:calc(50% + ${x}px);top:${y}px;transform:translateX(-50%) rotate(${tilt}deg) scale(${size});z-index:${z+i}" title="Перетащи цветок"><img src="${ftzFlowerSource(id)}" alt="${f.name}" draggable="false"></span>`;
}
function ftz167BasketFiller(total){
  // Visible photographed leaves use actual per-pixel transparency, no white matte.
  const transparency='[IMAGE]

## function bouquetPosFor( Count 1
AT 13854642
rge-bloom'}
};
function bouquetFlowerProfile(id){ return bouquetFlowerProfiles[id]||{w:90,h:84,dy:0,stemLift:0,scale:1,cls:''}; }
function bouquetPosFor(i,total){
 // Gradually fuller, layered floristry for compositions of up to ten flowers.
 // Coordinates use the same bouquet canvas during assembly and handoff.
 const compositions={
  1:[[0,26,0,1.1]],
  2:[[-22,42,-10,1.0],[22,40,12,1.0]],
  3:[[0,22,0,1.1],[-32,48,-12,1.0],[32,46,12,1.0]],
  4:[[0,16,0,1.08],[-34,46,-12,1.0],[34,44,12,1.0],[0,68,0,0.98]],
  5:[[0,16,0,1.08],[-36,42,-12,1.0],[36,40,12,1.0],[-16,70,-6,0.96],[18,68,7,0.98]],
  6:[[0,24,0,1.02],[-39,42,-13,0.96],[39,43,13,0.96],[-22,71,-8,0.92],[20,70,8,0.92],[0,83,0,0.92]],
  7:[[0,25,0,0.98],[-45,38,-13,0.94],[45,39,13,0.94],[-63,69,-15,0.88],[-20,69,-7,0.91],[21,70,7,0.91],[63,70,15,0.88]],
  8:[[0,26,0,0.95],[-45,37,-13,0.90],[45,38,13,0.90],[-66,66,-17,0.84],[-22,66,-8,0.88],[23,66,8,0.88],[66,66,17,0.84],[0,91,0,0.87]],
  9:[[0,26,0,0.93],[-46,35,-13,0.89],[46,36,13,0.89],[-67,62,-17,0.83],[-22,62,-8,0.85],[23,62,8,0.85],[67,63,17,0.83],[-26,92,-8,0.82],[27,92,8,0.82]],
  10:[[0,26,0,0.92],[-46,35,-13,0.87],[46,36,13,0.87],[-67,61,-17,0.81],[-22,62,-8,0.83],[23,62,8,0.83],[67,62,17,0.81],[-43,91,-12,0.79],[0,96,0,0.81],[43,91,12,0.79]]
 };
 const preset=compositions[Math.min(total,10)]?.[i];
 if(preset){const [x,y,r,scale]=preset;return {x,y,r,scale};}
 return defaultFlowerPos(i);
}
function renderWrapBackSVG(){
 const wrap=$('wrap')?$('wrap').value:'kraft';
const palette={
  kraft:{paper:'#d7af90',paper2:'#f3decd',edge:'#fbf1e6',inner:'#bd8b6e',band:'#ac7b60',spark:'#e8c8a6'},
  linen:{paper:'#e5d7c4',paper2:'#fcf4e8',edge:'#ffffff',inner:'#ccb89d',band:'#b1987e',spark:'#efe3cc'},
  velvet:{paper:'#b78497',paper2:'#ead9df',edge:'#fff8fb',inner:'#9b6b7d',band:'#86586b',spark:'#d6b4c1'},
  signature:{paper:'#9db2d8',paper2:'#f2f6fe',edge:'#ffffff',inner:'#7a90ba',band:'#5e749f',spark:'#dbe8ff'}
 }[wrap];
 const shape={kraft:{l:'M92 226 L40 100 Q82 74 133 116 L145 224 Z',r:'M198 226 L250 100 Q208 74 157 116 L145 224 Z'},linen:{l:'M97 224 L56 109 Q90 84 129 118 L144 223 Z',r:'M193 224 L234 109 Q200 84 161 118 L146 223 Z'},velvet:{l:'M100 228 L68 92 Q98 78 126 117 L143 225 Z',r:'M190 228 L222 92 Q192 78 164 117 L147 225 Z'},signature:{l:'M88 228 L32 94 Q82 70 136 117 L145 224 Z',r:'M202 228 L258 94 Q208 70 154 117 L145 224 Z'}}[wrap];
 const premium = wrap==='signature';
 return `<div class="pack-back"><svg viewBox="0 0 290 286" aria-hidden="true"><defs><linearGradient id="wrapBackL" x1="0" x2="1"><stop offset="0%" stop-color="${palette.paper2}"/><stop offset="100%" stop-color="${palette.paper}"/></linearGradient><linearGradient id="wrapBackR" x1="1" x2="0"><stop offset="0%" stop-color="${palette.paper2}"/><stop offset="100%" stop-

## function tzAfricanBloomPosition( Count 1
AT 13880023
86" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;z-index:8;pointer-events:none">${leaves}</svg>`;
}
function tzAfricanBloomPosition(i,total){
 if(ftzIsBasket())return state.positions[i]||ftzBasketPosition(i,total);
 const wrap=$('wrap')?.value||'';
 if(!Object.prototype.hasOwnProperty.call(TZ_APPROVED_PACK_IMAGES,wrap))
   return state.positions[i]||bouquetPosFor(i,total);
 if(state.positions[i])return state.positions[i];
 return tzFloristTypedPositions(total)[i]||bouquetPosFor(i,total);
}
function ftzBasketNeutralFoliage(){
 let leaves='';
 const colors=['#3c6942','#5c844d','#416b40','#74935b','#2f5b39'];
 for(let i=0;i<22;i++){
  const x=145+(i%5-2)*7,y=188+(i%4)*2;
  const spread=(i-10.5)*9.7,lift=72+((i*17)%42);
  leaves+=tzGreenLeaf(x,y,spread,-lift,5.7+((i*3)%4),colors[i%colors.length],.95,true);
 }
 return `<svg class="ftz-basket-base-green" viewBox="0 0 290 286" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:9">${leaves}</svg>`;
}
function ftzBasketInnerNest(total){
 // A soft, photographic bed of greenery makes the individual blossoms feel
 // seated in the same shallow florist foam, instead of floating above it.
 const n=Math.max(1,Math.min(10,total));
 const colors=['#406c3c','#6b9556','#789b5a','#416741','#8ca76c'];
 let frame='';
 const flankCount=n<=2?8:12;
 for(let i=0;i<flankCount;i++){
   const left=(i%2===0),level=Math.floor(i/2);
   const rootX=left?100+level*5:190-level*5;
   const shift=(left?-1:1)*(19+(level%3)*9);
   const dy=-19-(level%3)*9;
   frame+=tzGreenLeaf(rootX,164+level*2,shift,dy,8.2+level%2*1.3,colors[i%colors.length],.74,true);
 }
 return `<div class="ftz-basket-foliage-bed" style="position:absolute;inset:0;pointer-events:none;z-index:8">
   <img class="ftz-basket-natural-moss" alt="" src="[IMAGE]

## function tzFloristTypedPositions( Count 1
AT 13876688
,raise:-17,scale:.93},
  lily:{role:'tall',spread:34,raise:-17,scale:.88},
  white:{role:'round',spread:25,raise:-4,scale:.96}
};
function tzFloristTypedPositions(total){
 // v0.15.37: compact, layered floral canopy; every blossom is a purchased flower.
 const count=Math.max(1,Math.min(10,total));
 const slots={
  1:[[0,50,0,1.42]],
  2:[[-24,43,-10,1.28],[25,48,10,1.28]],
  3:[[-31,39,-11,1.23],[31,43,10,1.22],[0,55,0,1.33]],
  4:[[-36,38,-12,1.16],[35,39,12,1.16],[-16,57,-5,1.16],[18,62,7,1.16]],
  5:[[-38,34,-12,1.12],[36,36,12,1.12],[0,47,0,1.21],[-26,66,-7,1.10],[25,67,7,1.10]],
  6:[[-40,31,-12,1.08],[40,33,12,1.08],[0,42,0,1.14],[-36,61,-8,1.04],[36,64,8,1.04],[0,73,0,1.05]],
  7:[[-41,29,-13,1.03],[41,31,13,1.03],[0,39,0,1.09],[-43,58,-9,1.01],[43,61,9,1.01],[-19,75,-5,1.00],[19,75,5,1.00]],
  8:[[-48,25,-12,.99],[48,28,12,.99],[0,32,0,1.04],[-49,56,-8,.98],[49,59,8,.98],[-25,77,-5,.98],[25,78,5,.98],[0,98,0,.99]],
  9:[[-49,23,-12,.97],[49,26,12,.97],[0,32,0,1.01],[-50,55,-8,.96],[50,58,8,.96],[-29,75,-5,.95],[29,77,5,.95],[-15,95,-4,.94],[16,96,4,.94]],
  10:[[-51,21,-12,.95],[51,24,12,.95],[0,31,0,.98],[-52,53,-8,.93],[52,56,8,.93],[-32,75,-5,.93],[32,77,5,.93],[-18,95,-3,.92],[19,96,3,.92],[0,108,0,.91]]
 }[count];
 const plants=Array.from({length:count},(_,idx)=>({idx,id:state.chosen[idx],type:TZ_FLORIST_TYPES[state.chosen[idx]]||{role:'round',spread:28,raise:0,scale:1}}));
 const weight={tall:0,large:1,round:2};
 plants.sort((a,b)=>weight[a.type.role]-weight[b.type.role]||a.idx-b.idx);
 const result=[];
 plants.forEach((plant,rank)=>{
   const [x,y,r,scale]=slots[rank]; const side=Math.sign(x);
   const lift=plant.type.role==='tall'?-15:plant.type.role==='large'?-3:2;
   // Large heads are full-sized, tall flowers are raised and angled to the outside.
   const typeScale=plant.type.role==='large'?1.04:plant.type.role==='tall'?1.02:1;
   // Keep the 8–10 bloom canopy compact while respecting the silhouette of each species.
   // Tall stems sit slightly higher and outside the central focal flowers.
   const isTall=plant.type.role==='tall';
   const dense=count>=8;
   const compactX=x*(dense?1.00:count>=5?.94:1);
   // v0.15.98: preserve distinct species silhouettes in mixed bouquets.
   // Protea anchors the middle, calla rises on the flank, white agapanthus sits in the airy upper tier.
   const focal=plant.id==='peony';
   const callaStem=plant.id==='calla';
   const agapanthus=plant.id==='agapanthusWhite';
   const speciesY=focal?6:callaStem?-7:agapanthus?-6:0;
   const speciesScale=focal?1.08:callaStem?.94:agapanthus?1.04:1;
   const adjustedY=y+lift+(dense&&plant.type.role==='large'?2:0)+speciesY;
   const adjustedScale=scale*typeScale*(dense&&plant.type.role==='large'?.98:1)*speciesScale;
   result[plant.idx]={x:compactX,y:adjustedY,r

## function flowerLayer( Count 0

## function ftzComposeFlower( Count 0

## function flowerHead( Count 0

## function ftzRenderWrapChoices( Count 1
AT 16416086
validateBudgetChoice('wrap'); // Откат выбора, если нарушен бюджет клиента
 if(typeof ftzQueueSave==='function')ftzQueueSave();
}
function ftzRenderWrapChoices(){
 const picker=$('ftzWrapPicker'),host=$('ftzWrapChoices'),el=$('wrap');
 if(!picker||!host||!el)return;
 const canonical=FTZ_WRAP_ALIASES[el.value];
 if(canonical){el.value=canonical;previousExtras.wrap=canonical;}
 if(!ftzActiveWrapCategory)ftzActiveWrapCategory=FTZ_UNIQUE_WRAPS.find(x=>x.id===el.value)?.category||'classic';
 const inBasket=ftzIsBasket();
 picker.hidden=inBasket;
 if(host.dataset.ready!=='yes'){
  host.innerHTML=FTZ_UNIQUE_WRAPS.map(item=>`<button type="button" class="ftz-wrap-choice" data-ftz-wrap="${item.id}" data-wrap-category="${item.category}" onclick="ftzChooseWrap('${item.id}')" aria-pressed="false"><span class="ftz-wrap-photo"><img alt="" loading="lazy" decoding="async" src="${TZ_APPROVED_PACK_IMAGES[item.id]}"></span><span class="ftz-wrap-choice-name">${item.name}</span><span class="ftz-wrap-choice-cost">${item.price?'+'+item.price+' монет':'Бесплатно'}</span></button>`).join('');
  host.dataset.ready='yes';
 }
 for(const category of ['classic','african']){
  const tab=$(category==='classic'?'ftzWrapClassicTab':'ftzWrapAfricanTab');
  if(tab){const selected=ftzActiveWrapCategory===category;tab.classList.toggle('is-active',selected);tab.setAttribute('aria-pressed',String(selected));tab.disabled=!!state.last||!!state.finished;}
 }
 host.querySelectorAll('[data-ftz-wrap]').forEach(btn=>{
  const id=btn.dataset.ftzWrap;
  btn.hidden=btn.dataset.wrapCategory!==ftzActiveWrapCategory;
  const selected=id===el.value;
  btn.classList.toggle('is-selected',selected);
  btn.setAttribute('aria-pressed',String(selected));
  const option=Array.from(el.options).find(opt=>opt.value===id);
  btn.disabled=!!state.last||!!state.finished||!!option?.disabled;
  btn.title=option?.disabled?'Откроется после улучшения магазина':FTZ_UNIQUE_WRAPS.find(x=>x.id===id)?.name||id;
 });
 const current=FTZ_UNIQUE_WRAPS.find(x=>x.id===el.value);
 if($('ftzWrapSelectedLabel'))$('ftzWrapSelectedLabel').textContent=current?`${current.name} · ${current.price?'+'+current.price+' монет':'бесплатно'}`:'Выберите упаковку';
}

 function render(){if(state.finished)return; ftzRefreshOrderBrief(); if($('totalSpeciesChip'))$('totalSpeciesChip').textContent=`${types.length} африканских цветов`; renderForecast(); updateSeasonAppearance(); updateShopVisual(); refreshSelectLocks(); updateOptionPreviews();
 const inBasket=ftzIsBasket();
 ftzRenderWrapChoices();
 ftzRefreshWrapDisclosure();
 ftzHarmonyUpdateButton();
 if($('ftzFormatBouquet')){$('ftzFormatBouquet').classList.toggle('ftz-selected',!inBasket);$('ftzFormatBouquet').setAttribute('aria-pressed',String(!inBasket));$('ftzFormatBouquet').disabled=!!state.last

## function ftzRenderClassic Count 0

## function ftzRenderSelectedGreen( Count 0

## function ftzBasketHandleOverlay( Count 1
AT 10909207
){
 const palette=ftzBasketColor();
 return palette==='savanna'?original:(FTZ_BASKET_COLOR_ASSETS[palette]?.[layer]||original);
}
function ftzBasketHandleOverlay(){
 const color=ftzBasketColor();
 if(color==='savanna')return FTZ_BASKET_HANDLE_PROTECTOR;
 const src=FTZ_BASKET_COLOR_ASSETS[color]?.protector;
 return src?`<div class="ftz-basket-handle-protector" aria-hidden="true"><img src="${src}" alt=""></div>`:FTZ_BASKET_HANDLE_PROTECTOR;
}
function ftzSetBasketPalette(color){
 if(state.last||state.finished)return;
 const el=document.getElementById('basketPalette');
 if(!el||!['savanna','milk','straw'].includes(color))return;
 if(el.value===color)return;
 el.value=color;
 render();
 if(typeof ftzQueueSave==='function')ftzQueueSave();
}
function renderHandoffWrapLayers(){
  if(ftzIsBasket()){
    const decoration=ftzRenderAllDecor('savanna');
    return {
      back:`<div class="ftz-basket-layer ftz-basket-back" aria-hidden="true"><img src="${ftzBasketVariantImage(state.chosen.length?"back":"emptyBack",state.chosen.length?'[IMAGE]

## function ftz173SelectedGreenAccents( Count 1
AT 14053067
div class="ftz167-selected-green" data-greenery="${greenType}" aria-hidden="true">${greenerySvgMarkup(greenType,false)}</div>`;
}
function ftz173SelectedGreenAccents(greenType){
  if(greenType==='none')return '';
  // Visible tips in the basket opening, never covering the main central flower heads.
  return `<div class="ftz173-selected-green-accents" data-greenery="${greenType}" aria-hidden="true">${greenerySvgMarkup(greenType,false)}</div>`;
}
function renderBouquet(){
 const wrap=renderHandoffWrapLayers();
 const isBasket=ftzIsBasket();
 if(!state.chosen.length) return wrap.back+'<span class="empty">Выбери первый цветок…</span>'+wrap.front;
 const total=state.chosen.length;
 const greenType=$('greenery')?.value||'none';
 if(isBasket){
   // New basket-only stack: back wicker -> transparent botanical base -> purchased flowers
   // -> chosen greenery -> front wicker and clean handle hardware.
   const plants=state.chosen.map((id,i)=>ftz167BasketFlower(id,i,total)).join('');
   return `${wrap.back}${ftz167BasketFiller(total)}${ftz167BasketSelectedGreen(greenType)}${plants}${ftz173SelectedGreenAccents(greenType)}${ftz168RimFoliage()}${ftzBasketHandleOverlay()}${wrap.front}${renderPlushGift()}`;
 }
 const activeWrap=$('wrap')?.value||'';
 // Classical material wraps need a denser, slightly lifted flower cluster so the
 // bouquet reads as flowers first, packaging second.
 // v0.15.189: подгоняем пропорции не только для бархата, но и для крафта/льна.
 const wrapBalance={
  kraft:{scale:1.18,lift:13,spread:.95,settleTall:13,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  linen:{scale:1.19,lift:12,spread:.97,settleTall:12,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  velvet:{scale:1.16,lift:2,spread:1.05,settleTall:11,settleLarge:18,settleRegular:15,nudge:[-3,1,3,-1]},
  signature:{scale:1.13,lift:12,spread:.96,settleTall:10,settleLarge:16,settleRegular:14,nudge:[-3,0,2,3]}
 };
 const balance=wrapBalance[activeWrap]||{scale:1,lift:0,spread:1,settleTall:0,settleLarge:0,settleRegular:0,nudge:[0,0,0,0]};
 // Небольшие букеты требуют более заметных головок, большие — меньше увеличения.
 const densityFactor=total<=3?1.035:total<=5?1:total<=7?.97:.94;
 const classicScaleBoost=balance.scale*densityFactor;
 const classicLift=balance.lift;
 const classicNarrow=balance.spread;
 const blossoms=state.chosen.map((id,i)=>{
  const pos=tzAfricanBloomPosition(i,total);
  const profile=bouquetFlowerProfile(id);
  const f=types.find(x=>x.id===id)||{name:id};
  const cls=profile.cls?` ${profile.cls}`:'';
  const depth=Math.min(25,Math.max(15,15+Math.round(pos.y/9)));
  // v189: лёгкая плотная шапка из уже имеющихся фотографических цветков.
  // Делаем общую систему для бархата, крафта и льна: высокие акценты — позади,
  // крупные круглые головки — чуть ниже и б

## function renderPlushGift( Count 1
AT 11681092
e";}
function plushRetail(){return selectedPlush()==="none"?0:8;}
function plushWholesale(){return selectedPlush()==="none"?0:4;}
function renderPlushGift(){
 const key=selectedPlush();
 if(key==='none'||!TZ_PLUSH_ART[key])return '';
 const basket=ftzIsBasket();
 const defaults=basket?{x:31,y:58}:(FTZ_TEST_WRAP_NAMES[$('wrap')?.value]?{x:32,y:76}:{x:18,y:76});
 const basketClass=basket?' basket-plush basket-plush-'+key:'';
 return `<div class="ftz-plush-draggable ftz-draggable-accessory${basketClass}" data-accessory="plush" data-accessory-key="${key}" style="${ftzAccessoryPositionStyle('plush',defaults)}" title="Перетащи игрушку"><img src="${TZ_PLUSH_ART[key]}" alt="Мягкая игрушка в композиции" draggable="false"></div>`;
}

function accessoryWholesale(){return (ftzIsBasket()?4:wrapWholesale[$('wrap').value])+getNote().wholesale+getGreen().wholesale+ftzDecorWholesale()+plushWholesale();}
function price(){return state.chosen.reduce((s,id)=>s+types.find(f=>f.id===id).price,0)+(ftzIsBasket()?7:wrapPrices[$('wrap').value])+getNote().retail+getGreen().retail+ftzDecorPrice()+plushRetail();}
const previousExtras={wrap:'kraft',note:'none',greenery:'none',decor:'none',decor2:'none',decor3:'none',plushGift:'none',arrangementType:'bouquet'};
function budgetLimit(){return current().budget;}
function validateBudgetChoice(key){
  const control=$(key);
  if(price()>budgetLimit()){
    control.value=previousExtras[key];
    marketMessage('Бюджет клиента — '+budgetLimit()+' монет. Такой вариант оформления слишком дорогой.');
  }else previousExtras[key]=control.value;
  render();
}
function syncExtras(){['wrap','note','greenery','decor','decor2','decor3','plushGift','arrangementType','basketPalette'].forEach(key=>previousExtras[key]=$(key).value);}
function decorSvgDataUri(svg){return `data:image/svg+xml;utf8,${encodeURIComponent(String(svg).split('\n').join(' ').trim())}`;}
function richDecorSvg(decor,wrap='kraft'){
 if(decor==='none')return '';
 if(RIBBON_STYLES.includes(decor)){
  const c=ribbonColors(wrap,decor),vip=decor==='ribbonVIP',luxe=decor==='ribbonLuxe',party=decor==='ribbonParty';
  const gold=vip?c.gold:(luxe?c.gold:c.light);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><linearGradient id="rb1" x1="0" x2="1"><stop offset="0%" stop-color="${c.light}"/><stop offset="55%" stop-color="${c.main}"/><stop offset="100%" stop-color="${c.dark}"/></linearGradient><linearGradient id="rb2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${c.main}"/><stop offset="100%" stop-color="${c.dark}"/></linearGradient></defs><ellipse cx="90" cy="103" rx="52" ry="7" fill="rgba(80,55,48,.10)"/><path d="M89 78 C63 48 32 42 18 59 C29 77 53 84 82 84 Z" fill="url(#rb1)" stroke="${c.dark}" stroke-width="2.2"/><path d="M91 78 C117 48 148 42 16

## function ftz167BasketFiller( Count 1
AT 13949794
(${size});z-index:${z+i}" title="Перетащи цветок"><img src="${ftzFlowerSource(id)}" alt="${f.name}" draggable="false"></span>`;
}
function ftz167BasketFiller(total){
  // Visible photographed leaves use actual per-pixel transparency, no white matte.
  const transparency='[IMAGE]

## function ftz184 Count 0

## function renderHandoffBouquet( Count 0

## function renderHandoff Count 1
AT 10909823
es(color))return;
 if(el.value===color)return;
 el.value=color;
 render();
 if(typeof ftzQueueSave==='function')ftzQueueSave();
}
function renderHandoffWrapLayers(){
  if(ftzIsBasket()){
    const decoration=ftzRenderAllDecor('savanna');
    return {
      back:`<div class="ftz-basket-layer ftz-basket-back" aria-hidden="true"><img src="${ftzBasketVariantImage(state.chosen.length?"back":"emptyBack",state.chosen.length?'[IMAGE]

## function renderFlower( Count 0

## const wrapBalance= Count 1
AT 14054410
ouquet reads as flowers first, packaging second.
 // v0.15.189: подгоняем пропорции не только для бархата, но и для крафта/льна.
 const wrapBalance={
  kraft:{scale:1.18,lift:13,spread:.95,settleTall:13,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  linen:{scale:1.19,lift:12,spread:.97,settleTall:12,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},
  velvet:{scale:1.16,lift:2,spread:1.05,settleTall:11,settleLarge:18,settleRegular:15,nudge:[-3,1,3,-1]},
  signature:{scale:1.13,lift:12,spread:.96,settleTall:10,settleLarge:16,settleRegular:14,nudge:[-3,0,2,3]}
 };
 const balance=wrapBalance[activeWrap]||{scale:1,lift:0,spread:1,settleTall:0,settleLarge:0,settleRegular:0,nudge:[0,0,0,0]};
 // Небольшие букеты требуют более заметных головок, большие — меньше увеличения.
 const densityFactor=total<=3?1.035:total<=5?1:total<=7?.97:.94;
 const classicScaleBoost=balance.scale*densityFactor;
 const classicLift=balance.lift;
 const classicNarrow=balance.spread;
 const blossoms=state.chosen.map((id,i)=>{
  const pos=tzAfricanBloomPosition(i,total);
  const profile=bouquetFlowerProfile(id);
  const f=types.find(x=>x.id===id)||{name:id};
  const cls=profile.cls?` ${profile.cls}`:'';
  const depth=Math.min(25,Math.max(15,15+Math.round(pos.y/9)));
  // v189: лёгкая плотная шапка из уже имеющихся фотографических цветков.
  // Делаем общую систему для бархата, крафта и льна: высокие акценты — позади,
  // крупные круглые головки — чуть ниже и ближе к центру.
  const classic4=!!wrapBalance[activeWrap]&&total===4;
  const tallBloom=['calla','watsonia','iris','lily','lav','tulip','bird','strelitzia'].includes(id);
  const largeBloom=['peony','sun','hydra','rose','ranunc','protea','dahlia','gerbera'].includes(id);
  const settleByWrap=wrapBalance[activeWrap]
    ? (classic4
        ? (tallBloom?balance.settleTall:largeBloom?balance.settleLarge:balance.settleRegular)
        : (activeWrap==='velvet'?(total<=3?12:14):(total<=3?10:total<=5?8:6)))
    : 0;
  const whiteCluster=['agapanthusWhite','calla'].includes(id) ? (classic4?5:2) : 0;
  const seatDrop=['kraft','linen','velvet'].includes(activeWrap)?(total<=5?10:7):0;
  const top=pos.y+profile.dy-(total>=8?5:0)-14-classicLift+settleByWrap+whiteCluster+seatDrop;
  const baseOffsetX=total>=7?pos.x*.88:pos.x;
  const separateLeftCluster=classic4&&i<2&&baseOffsetX<0?-5:0;
  const offsetX=classic4?baseOffsetX*classicNarrow+(balance.nudge?.[i]||0)+separateLeftCluster:baseOffsetX*classicNarrow;
  const bloomScale=(pos.scale*profile.scale*classicScaleBoost*(classic4?(largeBloom?1.03:1.01):1)).toFixed(3);
  const useSplit=!!wrapBalance[activeWrap];
  // Относительная граница верхней цветочной части учитывает форму вида.
  const splitEdge=tallBloom?'59%':largeBloom?'54%':['agapanthusWhite','white','hydra'].includes(id)?'58%':

## const TZ_APPROVED_PACK_IMAGES= Count 1
AT 7516533
нее отнестись к настроению и пожеланиям.'};
}
/* Упаковка для финального кадра — сохраняет выбранные бумагу, декор и записку. */

const TZ_APPROVED_PACK_IMAGES={savanna:"[IMAGE]

## const bouquetHeadImages= Count 1
AT 12371605
const next=(previous+1)%3;
 state.positions=ftzHarmonyPositions(next);
 state.harmonyVariant=next;
 render();
 ftzQueueSave();
}

const bouquetHeadImages={"calla":"[IMAGE]

## function ftzIsBasket( Count 1
AT 10190597
ext" aria-hidden="true">${text}</div></div>`;
}

/* v0.15.136 · «Саванна»: real woven basket assembled in two physical layers. */
function ftzIsBasket(){return ($('arrangementType')?.value||'bouquet')==='basket';}
function ftzChooseArrangement(format){
  if(state.last||state.finished)return;
  const el=$('arrangementType');
  if(!el)return;
  const previous=el.value;
  el.value=format==='basket'?'basket':'bouquet';
  if(price()>budgetLimit()){
    el.value=previous;
    marketMessage('Для корзины нужно 7 монет в бюджете клиента. Уменьши состав или выбери букет.');
    render();return;
  }
  if(el.value!==previous){state.positions=[];state.harmonyVariant=-1;ftzQueueSave();}
  render();
}
function ftzBasketPosition(i,total){
  // v0.15.168: true floristry composition, independent of paper-bouquet geometry.
  // [x, y, rotation, scale] grouped in visual depth rows.
  const n=Math.min(10,Math.max(1,total));
  const presets={
    1:[[0,30,0,1.13]],
    2:[[-38,25,-10,1.08],[38,25,10,1.08]],
    3:[[-47,12,-12,1.03],[43,22,11,1.07],[0,43,0,1.12]],
    4:[[-55,8,-12,.99],[49,17,12,1.02],[-36,43,-8,1.08],[36,43,8,1.08]],
    5:[[-55,7,-14,.96],[0,7,-2,1.02],[55,11,13,.97],[-35,42,-8,1.08],[34,44,9,1.08]],
    6:[[-55,7,-13,.94],[0,5,-2,.97],[55,8,13,.94],[-47,38,-8,1.02],[0,45,0,1.04],[47,38,8,1.02]],
    7:[[-59,8,-13,.91],[-20,3,-5,.94],[25,4,6,.94],[59,8,13,.91],[-50,38,-9,.97],[0,45,0,1.00],[50,38,9,.97]],
    8:[[-59,6,-13,.87],[-19,2,-5,.92],[23,3,5,.91],[59,7,13,.87],[-60,34,-10,.93],[-20,45,-5,.96],[21,45,5,.96],[60,34,10,.93]],
    9:[[-62,7,-14,.85],[-26,2,-6,.89],[15,1,3,.90],[60,7,13,.85],[-61,33,-9,.91],[-27,42,-5,.93],[10,46,3,.95],[44,40,8,.92],[64,31,11,.89]],
    10:[[-61,5,-13,.84],[-28,1,-5,.86],[9,1,1,.88],[46,3,9,.86],[64,9,13,.83],[-60,33,-9,.89],[-29,43,-5,.91],[6,46,0,.94],[39,40,7,.90],[63,32,10,.88]]
  }[n];
  const roleOrder={tall:0,round:1,large:2};
  const ordered=Array.from({length:n},(_,idx)=>({idx,role:(TZ_FLORIST_TYPES[state.chosen[idx]]||{}).role||'round'}))
    .sort((a,b)=>(roleOrder[a.role]??1)-(roleOrder[b.role]??1)||a.idx-b.idx);
  const rank=ordered.findIndex(p=>p.idx===i);
  const p=presets[Math.max(0,Math.min(n-1,rank))];
  return {x:p[0],y:p[1],r:p[2],scale:p[3]};
}

/* v0.15.199 · Three wicker colorways with the exact same silhouette and weave. */
const FTZ_BASKET_COLOR_ASSETS={milk:{back:'[IMAGE]

## const FTZ_HARMONY_NAMES= Count 1
AT 12368081
angements, never altering inventory or price.
   Slots are derived from each flower's species-aware placement and actual size. */
const FTZ_HARMONY_NAMES=['Классика','Диагональ','Каскад'];
function ftzHarmonyClamp(value,min,max){return Math.max(min,Math.min(max,value));}
function ftzHarmonyPositions(variant){
 const total=state.chosen.length;
 if(!total)return [];
 const basket=ftzIsBasket();
 const approved=!basket&&Object.prototype.hasOwnProperty.call(TZ_APPROVED_PACK_IMAGES,$('wrap')?.value||'');
 const approvedPositions=approved?tzFloristTypedPositions(total):null;
 const model=state.chosen.map((id,i)=>{
   const preset=basket?ftzBasketPosition(i,total):(approved?(approvedPositions[i]||bouquetPosFor(i,total)):bouquetPosFor(i,total));
   const profile=bouquetFlowerProfile(id);
   const role=(TZ_FLORIST_TYPES[id]||{}).role||'round';
   return {id,preset,profile,role};
 });
 return model.map(({id,preset:p,profile,role},i)=>{
   // Large species occupy slightly more room. Tall blooms keep their shape on the rear tier.
   const sizeFactor=profile.w>=118?.94:profile.w>=105?.975:1;
   const isLarge=role==='large',isTall=role==='tall';
   let x=p.x,y=p.y,r=p.r,scale=p.scale*sizeFactor;
   if(variant===0){
     // 1/3: classic balanced arrangement, with foreground focal flowers.
     x*=basket?.98:.97;
     y+=(isTall?-3:isLarge?2:0);
     r+=(x<0?-1:x>0?1:0);
   }else if(variant===1){
     // 2/3: asymmetric rising diagonal, mirrored to move all species to new positions.
     x=-p.x*(basket?.97:.96)+(total===1?-17:Math.abs(p.x)<8?8:0);
     y=p.y+(p.x<0?11:p.x>0?-13:0)+(isTall?-3:0);
     r=-p.r+(x<0?-6:6);
     scale*=isLarge?1.035:.98;
   }else{
     // 3/3: cascading fan; large heads gather toward the center,
     //      while tall silhouettes open outward to frame the arrangement.
     const side=Math.sign(p.x)||((i%2)?1:-1);
     x=p.x*(isTall?1.06:isLarge?.77:.91)+(isTall?side*5:isLarge?-side*4:side*3);
     if(total===1)x=17;
     y=p.y+(Math.abs(p.x)>35?8:-13)+(isTall?-5:isLarge?4:0);
     r=p.r+side*(isTall?8:5);
     scale*=isLarge?1.06:isTall?.98:1.015;
   }
   // Prevent the different schemes from escaping basket walls / bouquet packaging.
   // Exactly one position per purchased flower, regardless of variant.
   x=ftzHarmonyClamp(x,basket?-72:-70,basket?72:70);
   y=ftzHarmonyClamp(y,basket?-14:-16,basket?83:105);
   r=ftzHarmonyClamp(r,-28,28);
   scale=ftzHarmonyClamp(scale,basket?.60:.72,basket?1.30:1.65);
   return {x:+x.toFixed(2),y:+y.toFixed(2),r:+r.toFixed(2),scale:+scale.toFixed(4)};
 });
}
function ftzHarmonyUpdateButton(){
 const button=document.getElementById('ftzHarmonyButton');
 if(!button)return;
 const i=Number.isInteger(state.harmonyVariant)&&state.harmonyVariant>=0&&state.harmonyVariant<3?state.harmonyVariant:-1;
 const ne

## FTZ193_INSTALLED Count 2
AT 22813183
гивает экономику, сюжет,
   покупки, упаковки и формат сохранения игры. */
(function installFTZ193(){
  'use strict';
  if(window.FTZ193_INSTALLED)return;
  const required=['renderBouquet','render','tzFloristTypedPositions','ftzBasketPosition','ftzHarmonyPositions'];
  if(required.some(x=>typeof window[x]!=='function')){
    console.warn('FTZ193: отсутствует функция конструктора, установка пропущена');return;
  }
  window.FTZ193_INSTALLED=true;
  const $=id=>document.getElementById(id);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const names=['Классика','Диагональ','Каскад'];
  const original={renderBouquet:window.renderBouquet,render:window.render,
    basket:window.ftzBasketPosition,bouquet:window.tzFloristTypedPositions,
    harmony:window.ftzHarmonyPositions,cycle:window.resetBouquetArrangement};
  let enabled=true,solving=false,selected=-1,drag=null,lastSignature='',history=[];
  let legacySnapshot=null,newSnapshot=null;
  const chosen=()=>typeof state!=='undefined'&&Array.isArray(state.chosen)?state.chosen:[];
  const ready=()=>typeof state!=='undefined'&&Array.isArray(state.positions)&&Array.isArray(state.chosen);
  const basket=()=>typeof ftzIsBasket==='function'&&ftzIsBasket();
  const format=()=>basket()?'basket':'bouquet';
  const sig=()=>chosen().join('|')+'::'+format()+'::'+($('wrap')?.value||'');
  const profile=id=>typeof bouquetFlowerProfile==='function'?(bouquetFlowerProfile(id)||{}):{};
  const role=id=>typeof TZ_FLORIST_TYPES!=='undefined'?((TZ_FLORIST_TYPES[id]||{}).role||'round'):'round';
  const currentStyle=()=>Number.isInteger(state.harmonyVariant)&&state.harmonyVariant>=0&&state.harmonyVariant<3?state.harmonyVariant:-1;
  const profileY=id=>Number(profile(id).dy)||0;
  function syncSignature(){
    const s=sig();if(s!==lastSignature){selected=-1;history=[];legacySnapshot=null;newSnapshot=null;lastSignature=s;}
  }
  function baseline(style=-1,fmt=format()){
    const n=chosen().length;if(!n)return [];
    // Берём откалиброванные координаты из реальной v0.15.192,
    // включая индивидуальную посадку 4 цветов и материал упаковки.
    if(style>=0&&typeof original.harmony==='function')return original.harmony(style);
    if(fmt==='basket')return chosen().map((id,i)=>original.basket(i,n));
    const preset=original.bouquet(n);
    return chosen().map((id,i)=>preset[i]||{x:0,y:50,r:0,scale:1});
  }

  function solve(style=currentStyle(),fmt=format()){
    if(!ready()||!chosen().length)return [];
    const n=chosen().length,isb=fmt==='basket';
    if(solving)return [];
    solving=true;
    try{
      const bases=baseline(style,fmt);
      const baseYs=bases.map(p=>Number((p&&p.y))||0);
      const minBaseY=Math.min.apply(null,baseYs);
      const maxBaseY=Math.max.app
AT 22813479
 window[x]!=='function')){
    console.warn('FTZ193: отсутствует функция конструктора, установка пропущена');return;
  }
  window.FTZ193_INSTALLED=true;
  const $=id=>document.getElementById(id);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const clone=v=>JSON.parse(JSON.stringify(v));
  const names=['Классика','Диагональ','Каскад'];
  const original={renderBouquet:window.renderBouquet,render:window.render,
    basket:window.ftzBasketPosition,bouquet:window.tzFloristTypedPositions,
    harmony:window.ftzHarmonyPositions,cycle:window.resetBouquetArrangement};
  let enabled=true,solving=false,selected=-1,drag=null,lastSignature='',history=[];
  let legacySnapshot=null,newSnapshot=null;
  const chosen=()=>typeof state!=='undefined'&&Array.isArray(state.chosen)?state.chosen:[];
  const ready=()=>typeof state!=='undefined'&&Array.isArray(state.positions)&&Array.isArray(state.chosen);
  const basket=()=>typeof ftzIsBasket==='function'&&ftzIsBasket();
  const format=()=>basket()?'basket':'bouquet';
  const sig=()=>chosen().join('|')+'::'+format()+'::'+($('wrap')?.value||'');
  const profile=id=>typeof bouquetFlowerProfile==='function'?(bouquetFlowerProfile(id)||{}):{};
  const role=id=>typeof TZ_FLORIST_TYPES!=='undefined'?((TZ_FLORIST_TYPES[id]||{}).role||'round'):'round';
  const currentStyle=()=>Number.isInteger(state.harmonyVariant)&&state.harmonyVariant>=0&&state.harmonyVariant<3?state.harmonyVariant:-1;
  const profileY=id=>Number(profile(id).dy)||0;
  function syncSignature(){
    const s=sig();if(s!==lastSignature){selected=-1;history=[];legacySnapshot=null;newSnapshot=null;lastSignature=s;}
  }
  function baseline(style=-1,fmt=format()){
    const n=chosen().length;if(!n)return [];
    // Берём откалиброванные координаты из реальной v0.15.192,
    // включая индивидуальную посадку 4 цветов и материал упаковки.
    if(style>=0&&typeof original.harmony==='function')return original.harmony(style);
    if(fmt==='basket')return chosen().map((id,i)=>original.basket(i,n));
    const preset=original.bouquet(n);
    return chosen().map((id,i)=>preset[i]||{x:0,y:50,r:0,scale:1});
  }

  function solve(style=currentStyle(),fmt=format()){
    if(!ready()||!chosen().length)return [];
    const n=chosen().length,isb=fmt==='basket';
    if(solving)return [];
    solving=true;
    try{
      const bases=baseline(style,fmt);
      const baseYs=bases.map(p=>Number((p&&p.y))||0);
      const minBaseY=Math.min.apply(null,baseYs);
      const maxBaseY=Math.max.apply(null,baseYs);
      const span=Math.max(1,maxBaseY-minBaseY);
      const cfg=(function(){
        const common=isb?
          {squeeze:.87,drop:8,edgeDrop:4,frontDrop:7,midDrop:2,backDrop:-2,largeDrop:4,tallDrop:-4,roundDrop:3,frontFloor:24,coreY:30,minScale:.64,maxScale:1.34,limitX:67,limit

## ftz-pocket-layers Count 20
AT 744289
)!important;
}
/* Do not let a double overlay of greenery spike over the flower heads. */
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers{opacity:.52;transform:translateY(8px) scale(.84);transform-origin:50% 70%}
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{opacity:.66;transform:translateY(7px) scale(.85);transform-origin:50% 70%}
</style>
<style id="tz-velvet-floristry-015185">
/* Весь набор передней и задней ткани сокращён совместно; края ниже цветочной шапки. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
 transform:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!important;
  transform-origin:50% 78%!important;
}
.bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay{
  clip-path:polygon(0 74%,1
AT 744937
anslateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
 transform:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!important;
  transform-origin:50% 78%!important;
}
.bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay{
  clip-path:polygon(0 74%,13% 71%,26% 68%,38% 68%,50% 69%,62% 68%,75% 68%,87% 71%,100% 74%,100% 100%,0 100%)!important;
}
.bouquet:has(.classic-material-linen) .approved-african-pack,
.handoff-bouquet:has(.classic-material-linen) .approved-african-pack{
  transform:translateY(18px) scaleX(.82) scaleY(.73)!important;
  transform-origin:50% 77%!important;
}
.bouquet .handoff-paper-front.classic-material-linen.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-linen.approved-african-pack-overlay{
  clip-path:polygon(0 73%,13% 70%,26% 67%,38% 67%,50% 68%,62% 67%,75% 67%,87% 70%,100% 73%,100% 100%,0 100%)!important;
}
.bouquet:has(.class
AT 745004
n:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
 transform:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!important;
  transform-origin:50% 78%!important;
}
.bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay{
  clip-path:polygon(0 74%,13% 71%,26% 68%,38% 68%,50% 69%,62% 68%,75% 68%,87% 71%,100% 74%,100% 100%,0 100%)!important;
}
.bouquet:has(.classic-material-linen) .approved-african-pack,
.handoff-bouquet:has(.classic-material-linen) .approved-african-pack{
  transform:translateY(18px) scaleX(.82) scaleY(.73)!important;
  transform-origin:50% 77%!important;
}
.bouquet .handoff-paper-front.classic-material-linen.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-linen.approved-african-pack-overlay{
  clip-path:polygon(0 73%,13% 70%,26% 67%,38% 67%,50% 68%,62% 67%,75% 67%,87% 70%,100% 73%,100% 100%,0 100%)!important;
}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.c

## approved-african-pack-overlay Count 32
AT 159833
ible;}
.approved-african-pack-art{width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;user-select:none;}
.approved-african-pack-overlay{clip-path:polygon(0 35%,12% 38%,23% 43%,34% 48%,43% 56%,50% 60%,57% 56%,66% 48%,77% 43%,88% 38%,100% 35%,100% 100%,0 100%);}
.approved-pack-mini{width:32px;height:30px;border-radius:5px;background:#f9f2df;overflow:hidden}
.approved-pack-mini img{width:100%;height:100%;object-fit:contain}
.approved-wrap-detail{display:grid;gap:2px;justify-items:center;margin-top:8px;padding:8px;border-radius:12px;background:#fff8ec;border:1px solid #e9d8b9}
.approved-wrap-detail img{width:min(100%,170px);height:132px;object-fit:contain}
.approved-wrap-detail small{font-size:10px;color:#75644a}
/* v0.15.29 — flower head layering, no paper redraw */
.bouquet-florist-foliage{z-index:3!important;opacity:.9!important}
.approved-african-pack-art{object-fit:contain!important}
/* v0.15.31: visible stems only in the open pocket above the paper folds. */
/* Mask is defined in SVG coordinates and applies only to the stems, not to flowers. */
.bouquet .approved-inner-stems{z-index:3!important;opacity:1!important;clip-path:none!important}

/* v0.15.40: consistent branded coin for numeric monetary totals. */
.tz-coin-small{font-size:14px!important;vertical-align:-.19em!important;margin-left:4px!important;flex:none!important}
.budget-insights-grid>div>.coin-icon{display:inline-block!important;margin-top:5px}
.budget-insights-grid>div>strong{display:inline-block;vertical-align:middle}
.bbm-heading .coin-icon{font-size:13px!important;vertical-align:-.19em!important}
.money-monitor .coin-icon{font-size:13px!important;vertical-align:-.19em!important}
@media(max-width:600px){.tz-coin-small{font-size:12px!important}}

/* v0.15.64: accessible flower removal and transparent feedback */
.tz-selected-flower-chips{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0 12px;align-items:center}
.tz-selected-flower-chips[hidden]{display:none!important}
.tz-remove-chip,.tz-clear-chip{border:1px solid #b8c8ab;background:#f7f7ed;color:#244935;border-radius:999px;padding:8px 10px;font-size:13px;line-height:1.3;cursor:pointer;min-height:38px}
.tz-remove-chip{display:inline-flex;gap:9px;align-items:center}
.tz-remove-chip strong{font-size:21px;line-height:1;color:#8b442f}
.tz-clear-chip{background:#fff1e8;border-color:#dec3a9;color:#6b3f2b}
.tz-remove-chip:focus-visible,.tz-clear-chip:focus-visible{outline:3px solid #ce9e42;outline-offset:2px}
.tz-score-explanation{margin:12px 0;padding:12px 14px;border-radius:14px;background:#f5f3e8;border:1px solid #d5cba9;color:#29432d}
.tz-score-explanation summary{font-weight:700;cursor:pointer}
.tz-score-explanation ul{padding-left:21px;margin:8px 0}
.tz-score-explanation li{margin:4px 0}
@media(max-width:430px)
AT 236740
4px}}
</style>
<style>/* v0.15.34: botanical layering. The unmodified approved artwork masks stems and lower petals. */
.bouquet .approved-african-pack-overlay{z-index:33!important}
.bouquet .approved-inner-stems{z-index:4!important;opacity:1!important}
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1!important}
</style><style id="african-pendant-fix-v01539">
/* Independent image layer preserves every pixel of the four approved wrappings. */
.bouquet .african-pendant-layer{position:absolute;left:8%;top:59%;width:19%;height:29%;z-index:45;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 4px rgba(55,31,13,.28));transform:rotate(-8deg)}
.bouquet .african-pendant-layer img{width:100%;height:100%;object-fit:contain;display:block}
</style><style id="tanzania-rich-decor-v015114">
.bouquet .decor-art-layer{position:absolute;z-index:74;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 5px rgba(59,37,18,.26))}
.bouquet .decor-art-layer img{width:100%;height:100%;object-fit:contain;display:block}
.bouquet .decor-art-layer.decor-ribbon,.bouquet .decor-art-layer.decor-ribbonParty,.bouquet .decor-art-layer.decor-ribbonLuxe,.bouquet .decor-art-layer.decor-ribbonVIP{z-index:70}
@media(max-width:600px){.bouquet .decor-art-layer{filter:drop-shadow(0 2px 4px rgba(59,37,18,.24))}}
</style><style id="tanzania-decor-fidelity-v015115">
.bouquet .decor-art-layer{z-index:74!important;overflow:visible!important;filter:drop-shadow(0 3px 3px rgba(53,33,18,.28))}
.bouquet .decor-art-layer img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto;opacity:1}
.bouquet .tz-plush-in-bouquet.with-pendant{z-index:38!important;left:2%!important;bottom:5%!important;width:18%!important;height:23%!important}
.bouquet .decor-art-layer.decor-lace{filter:drop-shadow(0 2px 4px rgba(77,47,22,.46))}
.preview-art.tz-art-preview{background:linear-gradient(145deg,#fcf7eb,#e8deca);border-color:#c8ac78}
@media(max-width:600px){.bouquet .tz-plush-in-bouquet.with-pendant{left:1%!important;width:19%!important;height:22%!important}}
</style><style id="tanzania-upgrade-art-v1541">
.upgrade-visual{background:linear-gradient(130deg,#704b2c,#af7441 52%,#6b4e30)!important;border:2px solid #c3904e!important;box-shadow:inset 0 0 0 2px rgba(255,222,158,.55),0 8px 22px rgba(72,41,19,.16)!important;overflow:hidden!important;padding:4px!important}
.upgrade-visual>img{object-fit:cover!important;width:100%!important;height:100%!important;border-radius:12px!important;filter:none!important}
.upgrade-visual .upgrade-art-haze{display:none!important}
.upgradecard{border-color:#d7b582!important;background:linear-gradient(165deg,#fff9ed,#f5ebd7)!important}
.upgradecard h4{c
AT 236901
-index:33!important}
.bouquet .approved-inner-stems{z-index:4!important;opacity:1!important}
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1!important}
</style><style id="african-pendant-fix-v01539">
/* Independent image layer preserves every pixel of the four approved wrappings. */
.bouquet .african-pendant-layer{position:absolute;left:8%;top:59%;width:19%;height:29%;z-index:45;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 4px rgba(55,31,13,.28));transform:rotate(-8deg)}
.bouquet .african-pendant-layer img{width:100%;height:100%;object-fit:contain;display:block}
</style><style id="tanzania-rich-decor-v015114">
.bouquet .decor-art-layer{position:absolute;z-index:74;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 5px rgba(59,37,18,.26))}
.bouquet .decor-art-layer img{width:100%;height:100%;object-fit:contain;display:block}
.bouquet .decor-art-layer.decor-ribbon,.bouquet .decor-art-layer.decor-ribbonParty,.bouquet .decor-art-layer.decor-ribbonLuxe,.bouquet .decor-art-layer.decor-ribbonVIP{z-index:70}
@media(max-width:600px){.bouquet .decor-art-layer{filter:drop-shadow(0 2px 4px rgba(59,37,18,.24))}}
</style><style id="tanzania-decor-fidelity-v015115">
.bouquet .decor-art-layer{z-index:74!important;overflow:visible!important;filter:drop-shadow(0 3px 3px rgba(53,33,18,.28))}
.bouquet .decor-art-layer img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto;opacity:1}
.bouquet .tz-plush-in-bouquet.with-pendant{z-index:38!important;left:2%!important;bottom:5%!important;width:18%!important;height:23%!important}
.bouquet .decor-art-layer.decor-lace{filter:drop-shadow(0 2px 4px rgba(77,47,22,.46))}
.preview-art.tz-art-preview{background:linear-gradient(145deg,#fcf7eb,#e8deca);border-color:#c8ac78}
@media(max-width:600px){.bouquet .tz-plush-in-bouquet.with-pendant{left:1%!important;width:19%!important;height:22%!important}}
</style><style id="tanzania-upgrade-art-v1541">
.upgrade-visual{background:linear-gradient(130deg,#704b2c,#af7441 52%,#6b4e30)!important;border:2px solid #c3904e!important;box-shadow:inset 0 0 0 2px rgba(255,222,158,.55),0 8px 22px rgba(72,41,19,.16)!important;overflow:hidden!important;padding:4px!important}
.upgrade-visual>img{object-fit:cover!important;width:100%!important;height:100%!important;border-radius:12px!important;filter:none!important}
.upgrade-visual .upgrade-art-haze{display:none!important}
.upgradecard{border-color:#d7b582!important;background:linear-gradient(165deg,#fff9ed,#f5ebd7)!important}
.upgradecard h4{color:#58391e!important}
.upgrade-visual:after{display:none!important}
@media(max-width:680px){.upgrade-visual>img{object-fit:cover!important}}
</style>
<style id

## classic-material-wrap Count 26
AT 740622
15109">
/* Классические упаковки: открываем верхнюю часть букета, не меняя африканские варианты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
  filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet .handoff-paper-back.approved-african-pack,
.handoff-bouquet .handoff-paper-back.approved-african-pack{
  filter:drop-shadow(0 3px 8px rgba(76,53,33,.10));
}
</style>
<style id="tz-classic-wrap-balance-015183">
/* Индивидуальная подгонка силуэта каждой классической упаковки. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{transform:translateY(17px) scale(.78)!important;transform-origin:50% 78%!important}
.bouquet:has(.classic-material-linen) .approved-african-pack,
.handoff-bouquet:has(.classic-material-linen) .approved-african-pack{transform:translateY(14px) scale(.81)!important;transform-origin:50% 77%!important}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{transform:translateY(12px) scale(.83)!important;transform-origin:50% 76%!important}
.bouquet:has(.classic-material-signature) .approved-african-pack,
.handoff-bouquet:has(.classic-material-signature) .approved-african-pack{transform:translateY(11px) scale(.85)!important;transform-origin:50% 76%!important}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 72%,12% 69%,24% 66%,37% 66%,50% 67%,63% 66%,76% 66%,88% 69%,100% 72%,100% 100%,0 100%)!important;
 filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet:has(.classic-material-wrap) .ftz-paper-selected-green,
.handoff-bouq
AT 740713
анты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
  filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet .handoff-paper-back.approved-african-pack,
.handoff-bouquet .handoff-paper-back.approved-african-pack{
  filter:drop-shadow(0 3px 8px rgba(76,53,33,.10));
}
</style>
<style id="tz-classic-wrap-balance-015183">
/* Индивидуальная подгонка силуэта каждой классической упаковки. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{transform:translateY(17px) scale(.78)!important;transform-origin:50% 78%!important}
.bouquet:has(.classic-material-linen) .approved-african-pack,
.handoff-bouquet:has(.classic-material-linen) .approved-african-pack{transform:translateY(14px) scale(.81)!important;transform-origin:50% 77%!important}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{transform:translateY(12px) scale(.83)!important;transform-origin:50% 76%!important}
.bouquet:has(.classic-material-signature) .approved-african-pack,
.handoff-bouquet:has(.classic-material-signature) .approved-african-pack{transform:translateY(11px) scale(.85)!important;transform-origin:50% 76%!important}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 72%,12% 69%,24% 66%,37% 66%,50% 67%,63% 66%,76% 66%,88% 69%,100% 72%,100% 100%,0 100%)!important;
 filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet:has(.classic-material-wrap) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-wrap) .ftz-paper-selected-green{transform:translateY(-4px) scale(
AT 740950
0%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
  filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet .handoff-paper-back.approved-african-pack,
.handoff-bouquet .handoff-paper-back.approved-african-pack{
  filter:drop-shadow(0 3px 8px rgba(76,53,33,.10));
}
</style>
<style id="tz-classic-wrap-balance-015183">
/* Индивидуальная подгонка силуэта каждой классической упаковки. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{transform:translateY(17px) scale(.78)!important;transform-origin:50% 78%!important}
.bouquet:has(.classic-material-linen) .approved-african-pack,
.handoff-bouquet:has(.classic-material-linen) .approved-african-pack{transform:translateY(14px) scale(.81)!important;transform-origin:50% 77%!important}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{transform:translateY(12px) scale(.83)!important;transform-origin:50% 76%!important}
.bouquet:has(.classic-material-signature) .approved-african-pack,
.handoff-bouquet:has(.classic-material-signature) .approved-african-pack{transform:translateY(11px) scale(.85)!important;transform-origin:50% 76%!important}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 72%,12% 69%,24% 66%,37% 66%,50% 67%,63% 66%,76% 66%,88% 69%,100% 72%,100% 100%,0 100%)!important;
 filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet:has(.classic-material-wrap) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-wrap) .ftz-paper-selected-green{transform:translateY(-4px) scale(1.02);transform-origin:50% 60%}
</style>
<style id="tz-velvet-floristry-015184">
/* Velvet test: a shorter, quieter fabric silhouette; the floral dome is the focus. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.hando

## ftz-paper-selected-green Count 31
AT 743253
100% 72%,100% 100%,0 100%)!important;
 filter:drop-shadow(0 -1px 1px rgba(95,70,46,.08));
}
.bouquet:has(.classic-material-wrap) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-wrap) .ftz-paper-selected-green{transform:translateY(-4px) scale(1.02);transform-origin:50% 60%}
</style>
<style id="tz-velvet-floristry-015184">
/* Velvet test: a shorter, quieter fabric silhouette; the floral dome is the focus. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(15px) scaleX(.78) scaleY(.71)!important;
  transform-origin:50% 74%!important;
}
/* Keep the front folds below the main blooms and retain their matching geometry. */
.bouquet .handoff-paper-front.classic-material-velvet.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-velvet.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
}
/* Do not let a double overlay of greenery spike over the flower heads. */
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers{opacity:.52;transform:translateY(8px) scale(.84);transform-origin:50% 70%}
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{opacity:.66;transform:translateY(7px) scale(.85);transform-origin:50% 70%}
</style>
<style id="tz-velvet-floristry-015185">
/* Весь набор передней и задней ткани сокращён совместно; края ниже цветочной шапки. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transp
AT 743325
a(95,70,46,.08));
}
.bouquet:has(.classic-material-wrap) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-wrap) .ftz-paper-selected-green{transform:translateY(-4px) scale(1.02);transform-origin:50% 60%}
</style>
<style id="tz-velvet-floristry-015184">
/* Velvet test: a shorter, quieter fabric silhouette; the floral dome is the focus. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(15px) scaleX(.78) scaleY(.71)!important;
  transform-origin:50% 74%!important;
}
/* Keep the front folds below the main blooms and retain their matching geometry. */
.bouquet .handoff-paper-front.classic-material-velvet.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-velvet.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
}
/* Do not let a double overlay of greenery spike over the flower heads. */
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers{opacity:.52;transform:translateY(8px) scale(.84);transform-origin:50% 70%}
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{opacity:.66;transform:translateY(7px) scale(.85);transform-origin:50% 70%}
</style>
<style id="tz-velvet-floristry-015185">
/* Весь набор передней и задней ткани сокращён совместно; края ниже цветочной шапки. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
}
.bouquet:has(.classic-material-velvet) .approved-african-p
AT 744422
-pocket-layers{opacity:.52;transform:translateY(8px) scale(.84);transform-origin:50% 70%}
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{opacity:.66;transform:translateY(7px) scale(.85);transform-origin:50% 70%}
</style>
<style id="tz-velvet-floristry-015185">
/* Весь набор передней и задней ткани сокращён совместно; края ниже цветочной шапки. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original
   flower illustrations; the heads remain intact and freely draggable. */
.bouquet:has(.classic-material-velvet) .flower-head img,
.handoff-bouquet:has(.classic-material-velvet) .flower-head img{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 53%,rgba(0,0,0,.94) 64%,rgba(0,0,0,.62) 79%,transparent 96%);
}
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-pack{
 transform:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!important;
  transform-origin:50% 78%!important;
}
.bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-kraft.approved-african-pack-overlay{
  clip-path:polygon(0 74%,13% 71%,26% 68%,38% 68%,50% 69%,62% 68%,75% 68%,87% 71%,100% 74%,100% 100%,0 100%)!important;
}
.bouquet:has(.classic-material-linen) 

## bouquet .blossom Count 5
AT 54069
ete botanical assets, no duplicate stems */
.bouquet{width:290px;height:286px;max-width:100%;overflow:visible;isolation:isolate}
.bouquet .blossom{width:86px;height:108px;display:flex;align-items:center;justify-content:center;transform-origin:50% 90%;filter:drop-shadow(0 4px 3px rgba(37,66,40,.10));overflow:visible;touch-action:none}
.bouquet .blossom svg{display:block;width:86px!important;height:108px!important;max-width:none;max-height:none;overflow:visible}
.bouquet-foliage{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible;opacity:.78}
.bouquet .vase-shell{z-index:40;bottom:-12px;pointer-events:none}
@media(max-width:380px){.bouquet{transform:scale(.91);transform-origin:center bottom}}

.bouquet .flower-head{width:87px;height:78px;display:block;overflow:visible;transform-origin:50% 72%;filter:drop-shadow(0 3px 4px rgba(36,60,39,.13))}
.bouquet .flower-head img{width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet-foliage{z-index:2}
.bouquet .vase-shell{z-index:40}

.game-logo-sidebar{display:block;width:100%;max-width:260px;height:auto;object-fit:contain;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18));margin:0 auto}.side .brand.brand-logo-only{display:block;padding:10px 2px 16px;border-bottom:1px solid rgba(225,238,216,.19);text-align:center}.side .brand.brand-logo-only .brandicon,.side .brand.brand-logo-only small{display:none}.approved-logo{mix-blend-mode:normal!important}
@media(max-width:760px){.game-logo-sidebar{max-width:180px}.side .brand.brand-logo-only{padding:6px 0 10px}}

/* Theme polish v0.9.2 — closer to logo palette */
:root{
  --ink:#234538;
  --muted:#7c8b82;
  --cream:#fcf7f0;
  --white:#fffdfa;
  --sage:#e4eddc;
  --sage2:#f1f5ec;
  --edge:#e8e4da;
  --accent:#c9788c;
  --accent2:#efc3b5;
  --gold:#d7b56d;
  --forest:#2d5a45;
  --shadow:0 16px 42px rgba(34,66,51,.09);
}
body{
  background:radial-gradient(circle at top,#fbf2ec 0,#f7f3ea 35%,#edf3e8 100%);
}
body:before{
  background:
    radial-gradient(circle at 12% 10%,rgba(255,255,255,.58),transparent 23%),
    radial-gradient(circle at 86% 9%,rgba(255,241,245,.42),transparent 18%),
    radial-gradient(circle at 50% 100%,rgba(214,230,201,.25),transparent 28%),
    radial-gradient(circle at 75% 45%,rgba(240,197,205,.12),transparent 20%);
}
.app{
  background:linear-gradient(180deg,#fffaf3,#f9f4ec);
  box-shadow:0 0 0 1px rgba(255,255,255,.72),0 30px 80px rgba(53,71,57,.08);
}
.side{
  background:linear-gradient(180deg,#214d3a 0%,#2f6248 100%);
}
.side:before{
  width:220px;height:220px;
  background:radial-gradient(circle,rgba(232,171,184,.24),transparent 68%);
}
.side button:hover{background:rgba(255,243,246,.08)}
.side button.active{
  background:linear-gradient(180deg,#4d7a60,#3d6852
AT 54276
ify-content:center;transform-origin:50% 90%;filter:drop-shadow(0 4px 3px rgba(37,66,40,.10));overflow:visible;touch-action:none}
.bouquet .blossom svg{display:block;width:86px!important;height:108px!important;max-width:none;max-height:none;overflow:visible}
.bouquet-foliage{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible;opacity:.78}
.bouquet .vase-shell{z-index:40;bottom:-12px;pointer-events:none}
@media(max-width:380px){.bouquet{transform:scale(.91);transform-origin:center bottom}}

.bouquet .flower-head{width:87px;height:78px;display:block;overflow:visible;transform-origin:50% 72%;filter:drop-shadow(0 3px 4px rgba(36,60,39,.13))}
.bouquet .flower-head img{width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet-foliage{z-index:2}
.bouquet .vase-shell{z-index:40}

.game-logo-sidebar{display:block;width:100%;max-width:260px;height:auto;object-fit:contain;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18));margin:0 auto}.side .brand.brand-logo-only{display:block;padding:10px 2px 16px;border-bottom:1px solid rgba(225,238,216,.19);text-align:center}.side .brand.brand-logo-only .brandicon,.side .brand.brand-logo-only small{display:none}.approved-logo{mix-blend-mode:normal!important}
@media(max-width:760px){.game-logo-sidebar{max-width:180px}.side .brand.brand-logo-only{padding:6px 0 10px}}

/* Theme polish v0.9.2 — closer to logo palette */
:root{
  --ink:#234538;
  --muted:#7c8b82;
  --cream:#fcf7f0;
  --white:#fffdfa;
  --sage:#e4eddc;
  --sage2:#f1f5ec;
  --edge:#e8e4da;
  --accent:#c9788c;
  --accent2:#efc3b5;
  --gold:#d7b56d;
  --forest:#2d5a45;
  --shadow:0 16px 42px rgba(34,66,51,.09);
}
body{
  background:radial-gradient(circle at top,#fbf2ec 0,#f7f3ea 35%,#edf3e8 100%);
}
body:before{
  background:
    radial-gradient(circle at 12% 10%,rgba(255,255,255,.58),transparent 23%),
    radial-gradient(circle at 86% 9%,rgba(255,241,245,.42),transparent 18%),
    radial-gradient(circle at 50% 100%,rgba(214,230,201,.25),transparent 28%),
    radial-gradient(circle at 75% 45%,rgba(240,197,205,.12),transparent 20%);
}
.app{
  background:linear-gradient(180deg,#fffaf3,#f9f4ec);
  box-shadow:0 0 0 1px rgba(255,255,255,.72),0 30px 80px rgba(53,71,57,.08);
}
.side{
  background:linear-gradient(180deg,#214d3a 0%,#2f6248 100%);
}
.side:before{
  width:220px;height:220px;
  background:radial-gradient(circle,rgba(232,171,184,.24),transparent 68%);
}
.side button:hover{background:rgba(255,243,246,.08)}
.side button.active{
  background:linear-gradient(180deg,#4d7a60,#3d6852);
  box-shadow:inset 0 0 0 1px rgba(255,231,237,.18),0 10px 18px rgba(15,38,28,.16);
}
.side .bottom{
  background:linear-gradient(180deg,rgba(255,247,249,.06),rgba(255,255,255,.03));
  border:1px solid rgb
AT 22835155

  #ftz193Toolbar .ftz193-fine button{min-width:51px}#ftz193Status{margin:8px 0 0;font-size:11px;color:#657d68}
  .ftz193-active .bouquet .blossom.ftz193-selected{outline:1.5px solid rgba(80,151,96,.9);outline-offset:3px;border-radius:50%;filter:drop-shadow(0 0 6px rgba(84,148,88,.5))!important}
  .ftz193-active .bouquet .blossom.ftz193-depth{will-change:transform}
  .ftz193-active #ftz180LayoutToggle{display:none!important}
  @media(max-width:600px){#ftz193Toolbar{padding:10px;border-radius:13px}#ftz193Toolbar button{padding:8px;font-size:11px;min-height:40px}#ftz193Toolbar .ftz193-actions button{flex:1 1 auto}}
  @media(prefers-reduced-motion:reduce){.ftz193-active .bouquet .blossom.ftz193-depth{transition:none!important}}
  `;
  document.head.appendChild(css);
  document.documentElement.classList.add('ftz193-active');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',createToolbar,{once:true});
  else createToolbar();
  window.FTZ193={version:'0.15.193',solve,apply,undo,edit,enabled:()=>enabled,toggle,
    diagnostics:()=>({enabled,flowers:chosen().length,format:format(),style:currentStyle(),selected,undo:history.length}),
    exportLayout:()=>ready()?JSON.stringify({chosen:clone(chosen()),format:format(),positions:clone(state.positions)}):'',
    restoreLayout:data=>{const obj=typeof data==='string'?JSON.parse(data):data;
      if(!ready()||obj.chosen.join('|')!==chosen().join('|')||obj.format!==format())throw Error('Набор цветов или формат композиции отличается');
      pushUndo();state.positions=clone(obj.positions);redraw();save();}};
})();

</script>
<style id="ftz-mobile-final-v015202">
.ftz-wrap-disclosure{margin:10px 0 6px;border:1px solid #e0e7da;border-radius:13px;background:#fafaf3;min-width:0}
.ftz-wrap-disclosure>summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:44px;padding:11px 13px;cursor:pointer;color:#38644a;font-size:12px;font-weight:700}
.ftz-wrap-disclosure>summary::-webkit-details-marker{display:none}
.ftz-wrap-disclosure>summary:after{content:'⌄';font-size:18px;font-weight:400}
.ftz-wrap-disclosure[open]>summary:after{content:'⌃'}
.ftz-wrap-disclosure>summary b{margin-left:auto;color:#244c36}
.ftz-wrap-disclosure>.ftz-wrap-picker{margin:0 8px 9px!important;padding:8px!important}
.ftz-wrap-disclosure[hidden]{display:none!important}
body .topright.florist-status-bar>.pill.stat-pill.stat-pill-season,body .topright.florist-status-bar>.pill.stat-pill.stat-pill-level{display:none!important}
@media(max-width:760px){
 body .content>.top .topright.florist-status-bar{width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr)) 48px!important;gap:5px!important;align-items:stretch!important}
 body .topright.florist-status

## ftz-flower-pos Count 0

## ftzWrapSelectedLabel Count 3
AT 1824449
ftz-wrap-picker" aria-label="Выбор упаковки букета">
    <div class="ftz-wrap-heading"><strong>Упаковка букета</strong><small id="ftzWrapSelectedLabel">8 уникальных вариантов</small></div>
    <div class="ftz-wrap-tabs" role="group" aria-label="Стиль упаковки">
      <button id="ftzWrapClassicTab" type="button" onclick="ftzShowWrapCategory('classic')" aria-pressed="true">Классика · 4</button>
      <button id="ftzWrapAfricanTab" type="button" onclick="ftzShowWrapCategory('african')" aria-pressed="false">Африканский стиль · 4</button>
    </div>
    <div id="ftzWrapChoices" class="ftz-wrap-choices" role="group" aria-label="Восемь уникальных упаковок"></div>
  </div>
  <select id="basketPalette" aria-label="Цвет корзины" tabindex="-1" style="display:none"><option value="savanna">Натуральная</option><option value="milk">Молочная</option><option value="straw">Светлая солома</option></select>
  <div id="ftzBasketPalettePicker" class="ftz-basket-palette-picker" hidden>
    <div class="ftz-basket-palette-heading">Цвет плетёной корзины <small>все варианты · 7 монет</small></div>
    <div class="ftz-basket-palette-buttons" role="group" aria-label="Выберите цвет корзины">
      <button type="button" data-basket-color="savanna" onclick="ftzSetBasketPalette('savanna')" aria-pressed="true"><i class="ftz-basket-color-dot natural" aria-hidden="true"></i><span>Натуральная</span></button>
      <button type="button" data-basket-color="milk" onclick="ftzSetBasketPalette('milk')" aria-pressed="false"><i class="ftz-basket-color-dot milk" aria-hidden="true"></i><span>Молочная</span></button>
      <button type="button" data-basket-color="straw" onclick="ftzSetBasketPalette('straw')" aria-pressed="false"><i class="ftz-basket-color-dot straw" aria-hidden="true"></i><span>Светлая солома</span></button>
    </div>
  </div>
  <div class="ftz-format-caption" id="ftzFormatCaption">Цветы и декор можно свободно комбинировать.</div>
</div><div class="assembly"><div class="ftz-flower-compare-controls" aria-label="Сравнение изображений цветов"><label><input type="checkbox" id="ftzFlowerTestMode" checked onchange="ftzSetFlowerTestMode(this.checked)"> <span id="ftzFlowerModeLabel">Новые изображения</span></label><span class="ftz-flower-compare-hint">Снимите галочку, чтобы увидеть прежние изображения при той же сборке.</span></div><div class="bouquet" id="bouquet"><span class="empty">Выбери первый цветок…</span></div></div><div class="previewnote">Добавляйте цветы из палитры ниже. Перетаскивайте цветы, игрушку, декор и записку прямо в композиции. Размер заказа зависит от бюджета клиента.</div><div class="ftz-accessory-controls" aria-label="Расположение аксессуаров"><span>✦ Украшения и игрушку можно передвигать пальцем или мышью</span><button type="button" onclick="ftzResetAccessories()
AT 16417995
ия магазина':FTZ_UNIQUE_WRAPS.find(x=>x.id===id)?.name||id;
 });
 const current=FTZ_UNIQUE_WRAPS.find(x=>x.id===el.value);
 if($('ftzWrapSelectedLabel'))$('ftzWrapSelectedLabel').textContent=current?`${current.name} · ${current.price?'+'+current.price+' монет':'бесплатно'}`:'Выберите упаковку';
}

 function render(){if(state.finished)return; ftzRefreshOrderBrief(); if($('totalSpeciesChip'))$('totalSpeciesChip').textContent=`${types.length} африканских цветов`; renderForecast(); updateSeasonAppearance(); updateShopVisual(); refreshSelectLocks(); updateOptionPreviews();
 const inBasket=ftzIsBasket();
 ftzRenderWrapChoices();
 ftzRefreshWrapDisclosure();
 ftzHarmonyUpdateButton();
 if($('ftzFormatBouquet')){$('ftzFormatBouquet').classList.toggle('ftz-selected',!inBasket);$('ftzFormatBouquet').setAttribute('aria-pressed',String(!inBasket));$('ftzFormatBouquet').disabled=!!state.last;}
 if($('ftzFormatBasket')){$('ftzFormatBasket').classList.toggle('ftz-selected',inBasket);$('ftzFormatBasket').setAttribute('aria-pressed',String(inBasket));$('ftzFormatBasket').disabled=!!state.last;}
  const basketPalettePicker=$('ftzBasketPalettePicker');
  if(basketPalettePicker){
    basketPalettePicker.hidden=!inBasket;
    const chosenPalette=ftzBasketColor();
    basketPalettePicker.querySelectorAll('[data-basket-color]').forEach(btn=>{
      const selected=btn.dataset.basketColor===chosenPalette;
      btn.setAttribute('aria-pressed',String(selected));
      btn.disabled=!!state.last||!!state.finished;
    });
  }
 if($('ftzWrapControl'))$('ftzWrapControl').classList.toggle('hidden',inBasket);
 if($('ftzFormatCaption'))$('ftzFormatCaption').textContent=inBasket?'Плетёная корзина стоит 7 монет (затраты лавки — 4) в любом цвете. Цветы, зелень и украшения можно выбирать свободно.':'Выберите бумагу или ткань для букета. Цветы и декор доступны в обоих форматах.';
 const s=current(), lvl=shopLevel(), season=currentSeason(); $('day').textContent=state.day+1; $('money').textContent=state.money; $('rep').textContent=state.rep; $('seasonPill').textContent=season.name; $('shopLevelPill').textContent=lvl.short; $('levelName').textContent=lvl.name; $('seasonName').textContent=season.name; $('vipToday').textContent=s.vip?'VIP-заказ':'Обычный заказ'; $('upgradeCount').textContent=`${upgradeCount()} / 8`; $('customerName').innerHTML=s.name + (s.vip?'<span class="vipchip">VIP</span>':''); const clientAvatar=$('avatar'); if(clientAvatar && clientAvatar.dataset.portraitDay!==String(state.day)){clientAvatar.classList.add('has-portrait');clientAvatar.innerHTML='<img src="'+CLIENT_PORTRAITS[state.day]+'" alt="Портрет клиента '+s.name+'" decoding="async">';clientAvatar.dataset.portraitDay=String(state.day);} $('occasion').textContent=s.occasion; $('customerDetail').textContent=s.detail; $
AT 16418021
APS.find(x=>x.id===id)?.name||id;
 });
 const current=FTZ_UNIQUE_WRAPS.find(x=>x.id===el.value);
 if($('ftzWrapSelectedLabel'))$('ftzWrapSelectedLabel').textContent=current?`${current.name} · ${current.price?'+'+current.price+' монет':'бесплатно'}`:'Выберите упаковку';
}

 function render(){if(state.finished)return; ftzRefreshOrderBrief(); if($('totalSpeciesChip'))$('totalSpeciesChip').textContent=`${types.length} африканских цветов`; renderForecast(); updateSeasonAppearance(); updateShopVisual(); refreshSelectLocks(); updateOptionPreviews();
 const inBasket=ftzIsBasket();
 ftzRenderWrapChoices();
 ftzRefreshWrapDisclosure();
 ftzHarmonyUpdateButton();
 if($('ftzFormatBouquet')){$('ftzFormatBouquet').classList.toggle('ftz-selected',!inBasket);$('ftzFormatBouquet').setAttribute('aria-pressed',String(!inBasket));$('ftzFormatBouquet').disabled=!!state.last;}
 if($('ftzFormatBasket')){$('ftzFormatBasket').classList.toggle('ftz-selected',inBasket);$('ftzFormatBasket').setAttribute('aria-pressed',String(inBasket));$('ftzFormatBasket').disabled=!!state.last;}
  const basketPalettePicker=$('ftzBasketPalettePicker');
  if(basketPalettePicker){
    basketPalettePicker.hidden=!inBasket;
    const chosenPalette=ftzBasketColor();
    basketPalettePicker.querySelectorAll('[data-basket-color]').forEach(btn=>{
      const selected=btn.dataset.basketColor===chosenPalette;
      btn.setAttribute('aria-pressed',String(selected));
      btn.disabled=!!state.last||!!state.finished;
    });
  }
 if($('ftzWrapControl'))$('ftzWrapControl').classList.toggle('hidden',inBasket);
 if($('ftzFormatCaption'))$('ftzFormatCaption').textContent=inBasket?'Плетёная корзина стоит 7 монет (затраты лавки — 4) в любом цвете. Цветы, зелень и украшения можно выбирать свободно.':'Выберите бумагу или ткань для букета. Цветы и декор доступны в обоих форматах.';
 const s=current(), lvl=shopLevel(), season=currentSeason(); $('day').textContent=state.day+1; $('money').textContent=state.money; $('rep').textContent=state.rep; $('seasonPill').textContent=season.name; $('shopLevelPill').textContent=lvl.short; $('levelName').textContent=lvl.name; $('seasonName').textContent=season.name; $('vipToday').textContent=s.vip?'VIP-заказ':'Обычный заказ'; $('upgradeCount').textContent=`${upgradeCount()} / 8`; $('customerName').innerHTML=s.name + (s.vip?'<span class="vipchip">VIP</span>':''); const clientAvatar=$('avatar'); if(clientAvatar && clientAvatar.dataset.portraitDay!==String(state.day)){clientAvatar.classList.add('has-portrait');clientAvatar.innerHTML='<img src="'+CLIENT_PORTRAITS[state.day]+'" alt="Портрет клиента '+s.name+'" decoding="async">';clientAvatar.dataset.portraitDay=String(state.day);} $('occasion').textContent=s.occasion; $('customerDetail').textContent=s.detail; $('quote').textContent=s.qu

## ftz-wrap-picker Count 4
AT 839179
-width:0}
.ftz-format-text strong{font-size:16px}
.ftz-format-options button.ftz-selected .ftz-format-symbol{background:#fff3d4}
.ftz-wrap-picker{margin:12px 0 7px;padding:12px;border:1px solid #d8dcbf;border-radius:14px;background:#fffdf6}
.ftz-wrap-heading{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px 12px;color:#2d553c;margin-bottom:11px}
.ftz-wrap-heading strong{font-size:14px}.ftz-wrap-heading small{font-size:11px;color:#79664c}
.ftz-wrap-tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:11px}
.ftz-wrap-tabs button{border:1px solid #d7c7a1;background:#f7f0df;color:#385b43;border-radius:11px;min-height:39px;padding:8px 5px;font-size:13px;font-weight:700;cursor:pointer}
.ftz-wrap-tabs button.is-active{background:#245b40;color:#fff8e7;border-color:#d1ac5c}
.ftz-wrap-tabs button:disabled{cursor:default;opacity:.7}
.ftz-wrap-choices{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
.ftz-wrap-choice{min-width:0;border:2px solid #e1d7bf;border-radius:13px;padding:7px 6px 9px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;color:#2e4937;cursor:pointer;text-align:center}
.ftz-wrap-choice.is-selected{border-color:#ba9046;background:#f1f8ed;box-shadow:0 0 0 1px #c4a06955,0 4px 11px #305e3c1c}
.ftz-wrap-choice:disabled{opacity:.5;cursor:not-allowed}
.ftz-wrap-photo{height:110px;width:100%;display:grid;place-items:center;background:linear-gradient(160deg,#faf7ef,#f0ede4);border-radius:9px;overflow:hidden}
.ftz-wrap-photo img{height:105px;width:100%;object-fit:contain;display:block}
.ftz-wrap-choice-name{font-weight:750;font-size:12px;line-height:1.2;min-height:30px;display:grid;place-items:center;overflow-wrap:normal;word-break:normal}
.ftz-wrap-choice-cost{font-size:11px;color:#856636;font-weight:700}
.ftz-wrap-choice:focus-visible,.ftz-wrap-tabs button:focus-visible,.ftz-format-options button:focus-visible{outline:3px solid #dfab42;outline-offset:2px}
@media(max-width:600px){
 .ftz-format-options button{min-height:74px;gap:5px;padding:7px 5px}
 .ftz-format-symbol{width:39px;height:39px;flex-basis:39px;border-radius:9px}
 .ftz-format-symbol svg{width:36px;height:36px}
 .ftz-format-text strong{font-size:13px}
 .ftz-format-options button small{font-size:10px}
 .ftz-wrap-picker{padding:9px 8px}
 .ftz-wrap-choices{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
 .ftz-wrap-photo{height:112px}
 .ftz-wrap-photo img{height:108px}
 .ftz-wrap-heading strong{font-size:13px}
 .ftz-wrap-tabs button{font-size:11px}
}
</style>
<style id="ftz-focused-stages-v015202">
/* Workbench: no repeating marketing hero or bulky status cards. */
body[data-florist-tab="work"] #gameHero{display:none!important}
.content>.top{align-items:center;gap:8px 16px;margin-bottom:8px}

AT 841347
t-symbol svg{width:36px;height:36px}
 .ftz-format-text strong{font-size:13px}
 .ftz-format-options button small{font-size:10px}
 .ftz-wrap-picker{padding:9px 8px}
 .ftz-wrap-choices{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
 .ftz-wrap-photo{height:112px}
 .ftz-wrap-photo img{height:108px}
 .ftz-wrap-heading strong{font-size:13px}
 .ftz-wrap-tabs button{font-size:11px}
}
</style>
<style id="ftz-focused-stages-v015202">
/* Workbench: no repeating marketing hero or bulky status cards. */
body[data-florist-tab="work"] #gameHero{display:none!important}
.content>.top{align-items:center;gap:8px 16px;margin-bottom:8px}
.content>.top h1,.content>.top .subtitle{display:none!important}
.content>.top .eyebrow{font-size:12px;letter-spacing:1.4px;color:#466c50}
.florist-status-bar .stat-pill-season,.florist-status-bar .stat-pill-level{display:none!important}
.florist-status-bar{gap:8px!important;align-items:center!important}
.florist-status-bar .stat-pill{min-width:0!important;box-shadow:none!important}
.florist-status-bar .stat-pill-day,.florist-status-bar .stat-pill-money,.florist-status-bar .stat-pill-rep{padding:9px 13px!important;min-height:0!important}
.florist-status-bar .stat-pill-music{padding:0!important;border:none!important;background:transparent!important;box-shadow:none!important}
#work .flow-header{margin-top:4px!important;border-top:0!important}
#work .flowstage{min-width:0}
#stage-0 .ftz-step-lead,#stage-1 .ftz-step-lead,#stage-2 .ftz-step-lead{display:flex;flex-direction:column;gap:3px;margin:13px 0;padding:0 2px;color:#375640;line-height:1.45}
.ftz-step-lead strong{font:600 clamp(19px,2vw,23px)/1.15 Georgia,serif}
.ftz-step-lead span{font-size:12px;color:#718274}
.ftz-order-brief{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 15px;margin:0 0 12px;background:linear-gradient(110deg,#f5f7ec,#fffaf3);border:1px solid #e6e5d5;border-radius:15px}
.ftz-order-brief>strong{font-size:13px;color:#365d41;flex:0 0 auto}
.ftz-brief-content{display:flex;align-items:center;gap:7px 14px;flex-wrap:wrap;font-size:12px;color:#4f6654}
.ftz-brief-content>span{padding:4px 0;white-space:normal}
.ftz-brief-content>span:last-child{font-weight:800;color:#2c6444}
.ftz-forecast-details,.ftz-addons,.ftz-finance-details,.ftz-result-memory-details,.ftz-result-score-details{border:1px solid #e0e7da;border-radius:15px;margin:10px 0;background:#fcfbf5;min-width:0}
.ftz-forecast-details>summary,.ftz-addons>summary,.ftz-finance-details>summary,.ftz-result-memory-details>summary,.ftz-result-score-details>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;list-style:none;padding:12px 14px;font-size:13px;font-weight:800;color:#37644b;min-height:44px}
.ftz-forecast-details>summary::-webkit-details-marker,.ftz-
AT 1824319
lay:none"><option value="bouquet">Букет</option><option value="basket">Корзина</option></select>
  <div id="ftzWrapPicker" class="ftz-wrap-picker" aria-label="Выбор упаковки букета">
    <div class="ftz-wrap-heading"><strong>Упаковка букета</strong><small id="ftzWrapSelectedLabel">8 уникальных вариантов</small></div>
    <div class="ftz-wrap-tabs" role="group" aria-label="Стиль упаковки">
      <button id="ftzWrapClassicTab" type="button" onclick="ftzShowWrapCategory('classic')" aria-pressed="true">Классика · 4</button>
      <button id="ftzWrapAfricanTab" type="button" onclick="ftzShowWrapCategory('african')" aria-pressed="false">Африканский стиль · 4</button>
    </div>
    <div id="ftzWrapChoices" class="ftz-wrap-choices" role="group" aria-label="Восемь уникальных упаковок"></div>
  </div>
  <select id="basketPalette" aria-label="Цвет корзины" tabindex="-1" style="display:none"><option value="savanna">Натуральная</option><option value="milk">Молочная</option><option value="straw">Светлая солома</option></select>
  <div id="ftzBasketPalettePicker" class="ftz-basket-palette-picker" hidden>
    <div class="ftz-basket-palette-heading">Цвет плетёной корзины <small>все варианты · 7 монет</small></div>
    <div class="ftz-basket-palette-buttons" role="group" aria-label="Выберите цвет корзины">
      <button type="button" data-basket-color="savanna" onclick="ftzSetBasketPalette('savanna')" aria-pressed="true"><i class="ftz-basket-color-dot natural" aria-hidden="true"></i><span>Натуральная</span></button>
      <button type="button" data-basket-color="milk" onclick="ftzSetBasketPalette('milk')" aria-pressed="false"><i class="ftz-basket-color-dot milk" aria-hidden="true"></i><span>Молочная</span></button>
      <button type="button" data-basket-color="straw" onclick="ftzSetBasketPalette('straw')" aria-pressed="false"><i class="ftz-basket-color-dot straw" aria-hidden="true"></i><span>Светлая солома</span></button>
    </div>
  </div>
  <div class="ftz-format-caption" id="ftzFormatCaption">Цветы и декор можно свободно комбинировать.</div>
</div><div class="assembly"><div class="ftz-flower-compare-controls" aria-label="Сравнение изображений цветов"><label><input type="checkbox" id="ftzFlowerTestMode" checked onchange="ftzSetFlowerTestMode(this.checked)"> <span id="ftzFlowerModeLabel">Новые изображения</span></label><span class="ftz-flower-compare-hint">Снимите галочку, чтобы увидеть прежние изображения при той же сборке.</span></div><div class="bouquet" id="bouquet"><span class="empty">Выбери первый цветок…</span></div></div><div class="previewnote">Добавляйте цветы из палитры ниже. Перетаскивайте цветы, игрушку, декор и записку прямо в композиции. Размер заказа зависит от бюджета клиента.</div><div class="ftz-accessory-controls" aria-label="Расположение аксес