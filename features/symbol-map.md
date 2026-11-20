# Symbol map
Total lines: 9147

### (?:const|let|var)\s+(?:FLOWERS|flowers|UPGRADES|upgrades|state|STORAGE_KEY|saveKey|FLOWER_DATA)\b

LINE 4299 CHAR 7496056
ожно купить и сохранить '+upgradeReserve()+' '+coinWord(upgradeReserve())+' на закупку цветов'; } const col={kraft:'#d4a994',linen:'#e7d6bc',velvet:'#a46e7a',signature:'#8ea2c8'}; const state={day:0,money:160,rep:0,chosen:[],history:[],last:null,finished:false,positions:[],accessoryPositions:{basket:{},bouquet:{}},harmonyVariant:-1,stock:{},stockCosts:{},flowerLots:{},spoilageLog:[],lastSpoilage:null,marketSpent:0,spoilage:0,spoilageCost:0,deals:{},availability:{},assortment:0,started:false,upgrades:{fridge:false,showcase:false,premiumPack:false,assistant:false,nursery:false,atelier:false,courier:false,promotion:false},upgradeNote:'Инвестиции требуют накоплений. Для развития магазина сравнивай прибыль заказов и эффективность улучшений. На все восемь апгрейдов за 21 день может не хватить средств.',seasonOpeningCash:[160],seasonOpeningRep:[0],seasonOpeningMarketSpent:[0],seasonClosingCash:[],seasonClosingRep:[],seasonClosingMarketSpent:[],upgradePurchases:[],seasonReportVisible:false,seasonRewards:{spring:null,summer:null},snapshotBouquetMarkup:''}; let newlyInstalledUpgrade=null; let shopBeforeComparison=false; function toggleShopBeforeAfter(){shopBeforeComparison=!shopBeforeComparison;updateShopVisual();} const $=id=>document.getElementById(id); types.forEach(t=>{state.stock[t.id]=0;state.stockCosts[t.id]=[];}); function startGame(){state.started=true;ftzQueueSave();const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('work');window.scrollTo(0,0);} function openRulesFirst(){const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('rules');} function currentSeason(){return seasonPlan[state.day]||seasonPlan[seasonPlan.length-1];} function upgradeCount(){return Object.values(state.upgrades).filter(Boolean).length;} function shopLevel(){  const c=upgradeCount(), invested=state.upgradePurchases.reduce((n,p)=>n+p.cost,0);  // Капитал развития 

LINE 4894 CHAR 11230523
n')){   const section=document.createElement('section');section.id='ftzStockSection';section.className='ftz-stock-section';section.setAttribute('aria-label','Склад и свежесть');   const upgrades=shop.querySelector('.ftz-shop-upgrades');   if(upgrades)upgrades.insertAdjacentElement('beforebegin',section);else shop.insertAdjacentElement('afterbegin',section);  }  const journal=$('journal');  if(journal&&!$('ftzSpoilageHistory')){   const log=document.createElement('details');log.id='ftzSpoilageHistory';log.className='ftz-spoilage-history';   log.innerHTML='<summary>Списания увядших цветов <span id="ftzSpoilageHistoryCount"></span></summary><div id="ftzSpoilageHistoryBody"></div>';   journal.insertAdjacentElement('afterbegin',log);  } } function ftzRenderFreshnessUi(){  const total=totalStock(),urgent=ftzUrgentStock();  const banner=$('ftzFreshnessBanner');  if(banner){   const loss=state.lastSpoilage?.day===state.day+1?state.lastSpoilage:null;   const chips=loss&&loss.total?`<div class="ftz-last-loss" role="status">За ночь увяли ${ftzFlowerWord(loss.total)} · потеря запасов: ${loss.cost} монет. <span>Деньги второй раз не списаны.</span></div>`:'';   banner.innerHTML=`<div class="ftz-freshness-main"><span aria-hidden="true">🌿</span><div class="ftz-freshness-title"><b>Склад: ${total} шт.</b><small class="${urgent?'ftz-warn':''}">${urgent?`Сегодня использовать: ${urgent} шт.`:'Нет цветов с истекающим сроком'}</small></div><button type="button" onclick="ftzOpenStock()">Посмотреть склад</button></div>${chips}`;  }  const section=$('ftzStockSection');  if(section){   const rows=types.map(t=>{    const lots=state.flowerLots[t.id]||[];    if(!lots.length)return null;    const grouped=new Map();    lots.forEach(l=>{const d=ftzRemainingDays(l,t.id);grouped.set(d,(grouped.get(d)||0)+1)});    const min=Math.min(...grouped.keys());    return {t,lots,min,groups:[...grouped.entr

LINE 6680 CHAR 16471500
nt)document.scrollingElement.scrollTop=0; }  /* v0.15.136: the real flower selector belongs immediately below the live basket on phones. */ function ftzSyncMobileFlowerPalette(){  const flowers=document.getElementById('flowers');  const basket=document.getElementById('bouquet');  if(!flowers||!basket)return;  const palette=flowers.closest('section.panel');  const composer=basket.closest('section.panel');  const client=document.getElementById('customerName')?.closest('section.panel');  if(!palette||!composer||!client)return;  const mobile=window.matchMedia('(max-width: 760px)').matches;  if(mobile){   const preview=composer.querySelector('.previewnote')||composer.querySelector('.assembly');   if(preview && (palette.parentElement!==composer||preview.nextElementSibling!==palette))preview.after(palette);   palette.classList.add('ftz-inline-basket-palette');   const h=palette.querySelector('.titleline h3'); if(h)h.textContent=ftzIsBasket()?'Выберите цветы для корзины':'Выберите цветы для букета';   const hint=palette.querySelector('.titleline small');if(hint)hint.innerHTML='Нажимайте на цветы ниже — они сразу появятся в композиции · до <b id="bouquetCapacityHint">'+maxFlowers()+'</b>';  } else {   if(palette.parentElement!==client.parentElement||client.nextElementSibling!==palette)client.after(palette);   palette.classList.remove('ftz-inline-basket-palette');   const h=palette.querySelector('.titleline h3');if(h)h.textContent='Африканская палитра';   const hint=palette.querySelector('.titleline small');if(hint)hint.innerHTML='Нажми, чтобы добавить цветок · до <b id="bouquetCapacityHint">'+maxFlowers()+'</b>';  } } window.addEventListener('resize',ftzSyncMobileFlowerPalette,{passive:true});  function updateMobileCompositionPeek(){  const art=$('peekBouquetArt'),label=$('peekBouquetText');  if(!art||!label)return;  const count=state.chosen.length;  art.innerHTML=count

LINE 6924 CHAR 16485908
ас играет: '+track.title+'. Нажмите на барабан, чтобы выключить музыку.':'Включить музыку: две композиции по очереди';   btn.setAttribute('aria-label',label);   btn.title=label;   const state=btn.querySelector('.sound-state-label');   if(state)state.textContent=africaMusicPlaying?'Музыка включена':'Включить музыку';  });  const statusValue=document.getElementById('musicStatusValue');  const statusCaption=document.getElementById('musicStatusCaption');  if(statusValue)statusValue.textContent=africaMusicPlaying?'Играет':'Выкл.';  if(statusCaption)statusCaption.textContent=africaMusicPlaying?(africaMusicIndex===0?'Цветы Танзании':'Цветы Танзании 2'):'Нажми барабан'; } function africaMusicError(err){  console.warn('Не удалось воспроизвести музыкальную дорожку',err);  africaMusicPlaying=false;  africaMusicStarting=false;  if(africaMusicPlayer)africaMusicPlayer.pause();  africaSoundButtons();  const status=document.getElementById('africaSoundStatus');  if(status)status.textContent='Не удалось воспроизвести музыку в этом браузере.'; } async function toggleAfricaSound(){  if(africaMusicPlaying||africaMusicStarting){   africaMusicPlaying=false;   africaMusicStarting=false;   if(africaMusicPlayer)africaMusicPlayer.pause();   africaSoundButtons();   return;  }  africaMusicStarting=true;  try{   const player=africaSetTrack(africaMusicIndex);   await player.play();   if(!africaMusicStarting){player.pause();return;}   africaMusicPlaying=true;   africaSoundButtons();  }catch(err){   // Playback can fail when interrupted by a user clicking "off" quickly.   if(africaMusicStarting)africaMusicError(err);  }finally{africaMusicStarting=false;} } document.body.classList.add('africa-safari');  </script> <style> .forecast-cards{align-items:stretch} .forecast-card{   position:relative;   display:grid;   grid-template-columns:88px 1fr;   gap:14px;   align-items:center;   min-height:132

### function\s+(?:render|renderShop|renderUpgrade|buyUpgrade|renderMarket|renderBouquet|renderFlowers|addFlower|chooseFlower|price|save|load|ftzQueueSave|buyFlower|plantFlower|nextDay|beginDay)\b

LINE 5019 CHAR 11680954
"></div>`; }  function accessoryWholesale(){return (ftzIsBasket()?4:wrapWholesale[$('wrap').value])+getNote().wholesale+getGreen().wholesale+ftzDecorWholesale()+plushWholesale();} function price(){return state.chosen.reduce((s,id)=>s+types.find(f=>f.id===id).price,0)+(ftzIsBasket()?7:wrapPrices[$('wrap').value])+getNote().retail+getGreen().retail+ftzDecorPrice()+plushRetail();} const previousExtras={wrap:'kraft',note:'none',greenery:'none',decor:'none',decor2:'none',decor3:'none',plushGift:'none',arrangementType:'bouquet'}; function budgetLimit(){return current().budget;} function validateBudgetChoice(key){   const control=$(key);   if(price()>budgetLimit()){     control.value=previousExtras[key];     marketMessage('Бюджет клиента — '+budgetLimit()+' монет. Такой вариант оформления слишком дорогой.');   }else previousExtras[key]=control.value;   render(); } function syncExtras(){['wrap','note','greenery','decor','decor2','decor3','plushGift','arrangementType','basketPalette'].forEach(key=>previousExtras[key]=$(key).value);} function decorSvgDataUri(svg){return `data:image/svg+xml;utf8,${encodeURIComponent(String(svg).split('\n').join(' ').trim())}`;} function richDecorSvg(decor,wrap='kraft'){  if(decor==='none')return '';  if(RIBBON_STYLES.includes(decor)){   const c=ribbonColors(wrap,decor),vip=decor==='ribbonVIP',luxe=decor==='ribbonLuxe',party=decor==='ribbonParty';   const gold=vip?c.gold:(luxe?c.gold:c.light);   return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><linearGradient id="rb1" x1="0" x2="1"><stop offset="0%" stop-color="${c.light}"/><stop offset="55%" stop-color="${c.main}"/><stop offset="100%" stop-color="${c.dark}"/></linearGradient><linearGradient id="rb2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${c.main}"/><stop offset="100%" stop-color="${c.dark}"/></linearGradient></defs><ellipse cx="90" cy="103" rx

LINE 5210 CHAR 12365207
MarketBalancePreview();  marketMessage(`Куплено: ${flower.name} × ${qty}.${saved?' Награда сезона дождей: сэкономлено '+saved+' монет.':''} ${currentSeason().note}`);  render(); } function buyUpgrade(key){if(state.last||(typeof flowMax!=='undefined'&&flowMax>=1))return;const up=upgradeDefs[key]; if(!up)return; if(state.upgrades[key]){setUpgradeNote('Это улучшение уже установлено.'); return;} if(!upgradeIsUnlocked(key)){setUpgradeNote(upgradeEconomyInfo(key));return;} if(state.money<upgradeRequiredCash(key)){setUpgradeNote('Недостаточно монет: после покупки необходимо оставить '+upgradeReserve()+' монет на цветы. '+upgradeEconomyInfo(key)+'.');return;} state.money-=up.cost; state.upgrades[key]=true; newlyInstalledUpgrade=key; state.upgradePurchases.push({day:state.day+1,key,cost:up.cost}); setUpgradeNote(`Установлено улучшение: ${up.name}. ${up.bonus}.`); render();} let tzNewBloomIndex=-1; function choose(id){if(state.last||state.finished||flowStep!==1)return; if(state.chosen.length>=maxFlowers()){marketMessage(`Сейчас можно использовать до ${maxFlowers()} цветов.`); return;} if(availableCount(id)<=0){marketMessage('Свободных цветов этого вида на складе не осталось.'); return;} const flower=types.find(f=>f.id===id); if(price()+flower.price>budgetLimit()){   marketMessage('Нельзя добавить '+flower.name+': бюджет клиента '+budgetLimit()+' монет. Осталось '+Math.max(0,budgetLimit()-price())+' '+coinWordCount(Math.max(0,budgetLimit()-price()))+'.');   return; } state.chosen.push(id); state.positions.push(null); state.harmonyVariant=-1; tzNewBloomIndex=state.chosen.length-1; render();} function remove(id){if(state.last)return; const i=state.chosen.lastIndexOf(id); if(i>=0){state.chosen.splice(i,1);state.positions.splice(i,1);state.harmonyVariant=-1;} render();} function clearBouquet(){if(state.last)return; state.chosen=[]; state.positions=[]; state.accessoryPositions={bask

LINE 5816 CHAR 14052455
the main central flower heads.   return `<div class="ftz173-selected-green-accents" data-greenery="${greenType}" aria-hidden="true">${greenerySvgMarkup(greenType,false)}</div>`; } function renderBouquet(){  const wrap=renderHandoffWrapLayers();  const isBasket=ftzIsBasket();  if(!state.chosen.length) return wrap.back+'<span class="empty">Выбери первый цветок…</span>'+wrap.front;  const total=state.chosen.length;  const greenType=$('greenery')?.value||'none';  if(isBasket){    // New basket-only stack: back wicker -> transparent botanical base -> purchased flowers    // -> chosen greenery -> front wicker and clean handle hardware.    const plants=state.chosen.map((id,i)=>ftz167BasketFlower(id,i,total)).join('');    return `${wrap.back}${ftz167BasketFiller(total)}${ftz167BasketSelectedGreen(greenType)}${plants}${ftz173SelectedGreenAccents(greenType)}${ftz168RimFoliage()}${ftzBasketHandleOverlay()}${wrap.front}${renderPlushGift()}`;  }  const activeWrap=$('wrap')?.value||'';  // Classical material wraps need a denser, slightly lifted flower cluster so the  // bouquet reads as flowers first, packaging second.  // v0.15.189: подгоняем пропорции не только для бархата, но и для крафта/льна.  const wrapBalance={   kraft:{scale:1.18,lift:13,spread:.95,settleTall:13,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},   linen:{scale:1.19,lift:12,spread:.97,settleTall:12,settleLarge:18,settleRegular:16,nudge:[-3,1,2,2]},   velvet:{scale:1.16,lift:2,spread:1.05,settleTall:11,settleLarge:18,settleRegular:15,nudge:[-3,1,3,-1]},   signature:{scale:1.13,lift:12,spread:.96,settleTall:10,settleLarge:16,settleRegular:14,nudge:[-3,0,2,3]}  };  const balance=wrapBalance[activeWrap]||{scale:1,lift:0,spread:1,settleTall:0,settleLarge:0,settleRegular:0,nudge:[0,0,0,0]};  // Небольшие букеты требуют более заметных головок, большие — меньше увеличения.  const densityFactor=total<=3?1.035:total<=

LINE 5885 CHAR 14057592
="true" data-greenery="${greenType}">${greenerySvgMarkup(greenType,false)}</div>`:'';  return `${wrap.back}${pocketLayers}${accent}${blossoms}${wrap.front}${renderPlushGift()}`; } function renderMarket(){  if(!$('marketGrid'))return;  const season=currentSeason();  $('marketGrid').innerHTML=types.map(f=>{   const stock=stockCount(f.id),deal=currentBuyPrice(f.id),ok=state.availability[f.id];   const saving=springSavingsPerFlower(f.id),buyOne=purchaseCost(f.id,1),buyThree=purchaseCost(f.id,3);   const hint=saving?`🎁 Скидка ${saving} за цветок`:season.featured.includes(f.id)?'Сезонный хит':season.pricey.includes(f.id)?'Сегодня дороже':'Обычная цена';   return `<div class="marketitem ${ok?'':'outseason'}"><div class="mhead"><span class="art">${flowerArt(f)}</span><div><strong>${f.name}</strong><div class="mini">${f.trait}</div><span class="rarity ${f.rarity}">${rarityLabels[f.rarity]}</span></div></div><div class="stockline"><span>Опт: ${saving?`<s class="market-old-price">${deal}</s> `:''}<b>${deal-saving}</b> <span class="coin-icon" role="img" aria-label="монета"></span></span><span>На складе: <b>${stock}</b></span></div><div class="tinyrow"><button class="tinybtn" onclick="buyStem('${f.id}',1)" ${(!ok||state.money<buyOne)?'disabled':''}>Купить 1 · ${buyOne}</button><button class="tinybtn" onclick="buyStem('${f.id}',3)" ${(!ok||state.money<buyThree)?'disabled':''}>Купить 3 · ${buyThree}</button></div><span class="seasonhint">${ok?hint:'Не сезон — сегодня недоступно'}</span></div>`;  }).join(''); } const visualAssets={"store":"data:image/webp;base64,UklGRlK/BABXRUJQVlA4IEa/BACwLg6dASp4BaUDPm0skkakIiGhKzX92IANiWJAc6maKzJvqlEX518EH5tUj2a9t0gEfQOq+ww98WdYxFamea90okP60fvDym/Tq/+7/p/SB5b78/sf4j/T/s58xf9/rR94/7nly+wf2vnG/6X7i+8j+lf8P7////9i39E/zn7ae5z/4/u37/P8d/8PVp/af+p+7/us/nJ8EP6x6n39D/6H///5Pbd+jj5vn/1/fD///M5/WP/P+9Ptnf//s9dO78s/kv+N/k/FX8l+pf1n95/zP/b/x/yLfmH/Z/qPDf6n/c/

LINE 6094 CHAR 16417205
);  if($('ftzWrapSelectedLabel'))$('ftzWrapSelectedLabel').textContent=current?`${current.name} · ${current.price?'+'+current.price+' монет':'бесплатно'}`:'Выберите упаковку'; }   function render(){if(state.finished)return; ftzRefreshOrderBrief(); if($('totalSpeciesChip'))$('totalSpeciesChip').textContent=`${types.length} африканских цветов`; renderForecast(); updateSeasonAppearance(); updateShopVisual(); refreshSelectLocks(); updateOptionPreviews();  const inBasket=ftzIsBasket();  ftzRenderWrapChoices();  ftzRefreshWrapDisclosure();  ftzHarmonyUpdateButton();  if($('ftzFormatBouquet')){$('ftzFormatBouquet').classList.toggle('ftz-selected',!inBasket);$('ftzFormatBouquet').setAttribute('aria-pressed',String(!inBasket));$('ftzFormatBouquet').disabled=!!state.last;}  if($('ftzFormatBasket')){$('ftzFormatBasket').classList.toggle('ftz-selected',inBasket);$('ftzFormatBasket').setAttribute('aria-pressed',String(inBasket));$('ftzFormatBasket').disabled=!!state.last;}   const basketPalettePicker=$('ftzBasketPalettePicker');   if(basketPalettePicker){     basketPalettePicker.hidden=!inBasket;     const chosenPalette=ftzBasketColor();     basketPalettePicker.querySelectorAll('[data-basket-color]').forEach(btn=>{       const selected=btn.dataset.basketColor===chosenPalette;       btn.setAttribute('aria-pressed',String(selected));       btn.disabled=!!state.last||!!state.finished;     });   }  if($('ftzWrapControl'))$('ftzWrapControl').classList.toggle('hidden',inBasket);  if($('ftzFormatCaption'))$('ftzFormatCaption').textContent=inBasket?'Плетёная корзина стоит 7 монет (затраты лавки — 4) в любом цвете. Цветы, зелень и украшения можно выбирать свободно.':'Выберите бумагу или ткань для букета. Цветы и декор доступны в обоих форматах.';  const s=current(), lvl=shopLevel(), season=currentSeason(); $('day').textContent=state.day+1; $('money').textContent=state.money; $('rep').

LINE 6522 CHAR 16464013
e.accessoryPositions||{})),extras}; } function ftzStoredExtras(){  const extras={};  FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);if(el)extras[key]=el.value;});  return extras; } function ftzQueueSave(){  if(ftzSuppressSave||!state.started)return;  if(ftzSaveTimer)clearTimeout(ftzSaveTimer);  ftzSaveTimer=setTimeout(ftzSaveNow,180); } function ftzSaveNow(){  if(ftzSaveTimer){clearTimeout(ftzSaveTimer);ftzSaveTimer=null;}  if(ftzSuppressSave||!state.started)return;  try{   // Snapshot markup contains inline artwork and could exceed the browser quota.   const compactHistory=state.history.map(h=>{    const {bouquetMarkup,...small}=h;return small;   });   const compactState={...state,history:compactHistory,snapshotBouquetMarkup:''};   const payload={version:FTZ_SAVE_VERSION,at:Date.now(),state:compactState,     flowStep,flowMax,extras:ftzStoredExtras()};   localStorage.setItem(FTZ_SAVE_KEY,JSON.stringify(payload));   ftzSaveBlocked=false;   const indicator=document.getElementById('ftzSaveNotice');   if(indicator)indicator.textContent='✓ Прогресс сохраняется автоматически';  }catch(err){   ftzSaveBlocked=true;   const indicator=document.getElementById('ftzSaveNotice');   if(indicator)indicator.textContent='Не удалось сохранить прогресс в этом браузере';   console.warn('Флорист Танзания: сохранение недоступно',err);  } } function ftzLoadProgress(){  let p;  try{p=JSON.parse(localStorage.getItem(FTZ_SAVE_KEY)||'null');}  catch(e){ftzSaveBlocked=true;return false;}  if(!p||p.version!==FTZ_SAVE_VERSION||!p.state||!p.state.started)return false;  if(!Number.isInteger(p.state.day)||p.state.day<0||p.state.day>=CAMPAIGN_DAYS)return false;  if(!Array.isArray(p.state.history)||p.state.history.length>CAMPAIGN_DAYS)return false;  try{   // Unknown data properties cannot override code or any of the game's functions.   for(const key of Object.keys(state)){    if(key in p.state&&key!=='s

LINE 8641 CHAR 22819734
tion pushUndo(){     if(!ready())return;     history.push({signature:sig(),positions:clone(state.positions),style:currentStyle()});     if(history.length>30)history.shift();   }   function save(){if(typeof ftzQueueSave==='function')ftzQueueSave();}   function status(message){const node=$('ftz193Status');if(node)node.textContent=message;}   function redraw(){if(typeof window.render==='function')window.render();updateUI();}   function apply(style){     if(!ready()||!chosen().length||state.last||state.finished||!enabled)return;     captureLegacy();pushUndo();     state.harmonyVariant=clamp(style|0,0,2);     const next=solve(state.harmonyVariant);     if(next.length!==chosen().length){history.pop();return;}     state.positions=next;     redraw();save();status('Собрано: '+names[state.harmonyVariant]+'. Цветов: '+chosen().length+'.');   }   function edit(i,change){     if(!enabled||!ready()||state.last||state.finished)return;     const old=item(i);if(!old)return;     captureLegacy();pushUndo();     const v={...old,z:Number.isFinite(old.z)?old.z:clamp((old.y-(basket()?26:54))/46,-1,1)};     v.x=+clamp(v.x+(change.x||0),-69,69).toFixed(2);     v.y=+clamp(v.y+(change.y||0),basket()?-15:-17,basket()?84:108).toFixed(2);     v.r=+clamp((v.r||0)+(change.r||0),-32,32).toFixed(2);     v.z=+clamp((v.z||0)+(change.z||0),-1,1).toFixed(3);     v.scale=+clamp((v.scale||1)+(change.scale||0),.65,1.68).toFixed(4);     state.positions[i]=v;     redraw();save();status('Цветок №'+(i+1)+': угол '+Math.round(v.r)+'°, глубина '+v.z.toFixed(1)+'.');   }   function undo(){     if(!ready()||state.last||state.finished)return;     while(history.length){const previous=history.pop();       if(previous.signature===sig()){         state.positions=clone(previous.positions);state.harmonyVariant=previous.style;         redraw();save();status('Последнее изменение отменено.');return;       }     }     u

### (?:upgrade|nursery|shop|chosen|stock|saveGame)\s*:

LINE 4070 CHAR 2283865
<path d="M26 10c-4 5-10 9-10 17q2 5 10 5q8 0 10-5c0-8-6-12-10-17Z" fill="none" stroke="${light}" stroke-width="1.3"/><path d="M26 19v13" stroke="${cream}" stroke-width="1.4"/>`,   shop:`<path d="M10 23l3-11h26l3 11" fill="${bronze}" stroke="${gold}" stroke-width="1.4"/><path d="M11 22q4 8 9 0q5 8 10 0q5 8 10 0" stroke="${light}" stroke-width="4" fill="none"/><path d="M14 25v16h24V25" fill="${deep}" stroke="${gold}" stroke-width="1.7"/><path d="M19 29h9v8h-9z" fill="${green}" stroke="${light}" stroke-width="1"/><path d="M32 29v12" stroke="${light}" stroke-width="1.8"/><path d="M21 36l3-5 2 5" fill="${coral}"/>`,   book:`<path d="M9 13q9-5 17 2v27q-8-6-17-3V13Zm17 2q8-7 17-2v26q-9-3-17 3V15Z" fill="${bronze}" stroke="${gold}" stroke-width="1.7" stroke-linejoin="round"/><path d="M26 15v27" stroke="${cream}" stroke-width="1.2"/><path d="M15 23l5-1m-5 6 6-1m10-5 6-1m-6 6 6-1" stroke="${light}" stroke-width="1.5" stroke-linecap="round"/><path d="M35 34q-5-7-8 0q4 5 8 0Z" fill="${green}"/>`,   help:`<circle cx="26" cy="26" r="15" fill="${deep}" stroke="${gold}" stroke-width="2"/><path d="M20 21q0-8 8-8q9 1 7 9q-1 4-8 8v3" stroke="${cream}" fill="none" stroke-width="3.4" stroke-linecap="round"/><circle cx="27" cy="39" r="2" fill="${gold}"/>`,   sun:`<circle cx="26" cy="26" r="10" fill="${gold}" stroke="${light}" stroke-width="1.3"/><path d="M26 8v7M26 37v7M8 26h7M37 26h7M13 13l5 5m16 16 5 5m0-26-5 5M18 34l-5 5" stroke="${gold}" stroke-width="2.4" stroke-linecap="round"/><path d="M20 27q6 5 12 0" stroke="${bronze}" stroke-width="1.5" fill="none"/>`,   heart:`<path d="M26 40 12 27C2 17 15 9 23 18l3 4 3-4c8-9 21-1 11 9L26 40Z" fill="${coral}" stroke="${gold}" stroke-width="2"/><path d="M17 22q3-5 7-1" stroke="${cream}" stroke-width="2" stroke-linecap="round"/>`,   leaf:`<path d="M13 40Q7 17 41 10q4 31-28 30Z" fill="${green}" stroke="${gold}" stroke-width="1.7"/><p

LINE 4090 CHAR 2290378
p}" stroke="${gold}" stroke-width="2"/><circle cx="39" cy="38" r="4" fill="${deep}" stroke="${gold}" stroke-width="2"/><path d="M15 19h13" stroke="${cream}" stroke-width="2"/>`,   nursery:`<path d="M14 30h24l-4 13H18Z" fill="${bronze}" stroke="${gold}" stroke-width="1.6"/><path d="M26 30V13q-10-10-15-1q4 9 15 7q10-14 17-5q-3 10-17 11" fill="${green}" stroke="${gold}" stroke-width="1.2"/><path d="M26 30V18" stroke="${cream}" stroke-width="1.5"/>`,   notes:`<rect x="11" y="11" width="29" height="34" rx="2" fill="${cream}" stroke="${gold}" stroke-width="1.8"/><path d="M17 21h17M17 27h17M17 33h10" stroke="${bronze}" stroke-width="1.6"/><path d="m31 37 10-10 2 2-10 10-5 2Z" fill="${gold}" stroke="${bronze}" stroke-width="1"/>`,   poster:`<rect x="9" y="9" width="34" height="35" rx="2" fill="${bronze}" stroke="${gold}" stroke-width="1.6"/><path d="M14 14h24v25H14Z" fill="${deep}" stroke="${cream}" stroke-width="1"/><path d="M26 19c7 7 6 13 0 15c-6-2-7-8 0-15Z" fill="${coral}"/><path d="M20 28q3 1 6 7q3-6 6-7" stroke="${gold}" stroke-width="1.3" fill="none"/>`,   fridge:`<rect x="14" y="8" width="25" height="37" rx="3" fill="${bronze}" stroke="${gold}" stroke-width="2"/><rect x="18" y="13" width="17" height="27" rx="2" fill="${deep}" stroke="${cream}" stroke-width="1"/><path d="M19 28h15" stroke="${gold}" stroke-width="1.4"/><path d="M26 33l-3-8 3-5 3 5-3 8Z" fill="${coral}"/><path d="M20 15v22" stroke="${cream}" stroke-opacity=".45" stroke-width="2"/>`,   display:`<path d="M8 23h36l-4-11H12Z" fill="${bronze}" stroke="${gold}" stroke-width="1.5"/><path d="M9 23q4 7 8 0q4 7 9 0q4 7 9 0q4 7 8 0" stroke="${cream}" stroke-width="3" fill="none"/><rect x="12" y="27" width="28" height="16" rx="2" fill="${deep}" stroke="${gold}" stroke-width="1"/><path d="M18 40V31m8 9V30m8 10V31" stroke="${green}" stroke-width="2"/><circle cx="18" cy="30" r="3" fill="${coral}"/><circle 

LINE 4281 CHAR 7494370
stant:{name:'Флорист из Танзании',cost:285,unlockSeason:1,desc:'Помогает собирать более сложные букеты и слегка экономит закупки.',bonus:'+2 цветка (до 10) и +5 баллов к оценке'}, nursery:{name:'Питомник редких цветов',cost:210,unlockSeason:0,desc:'Собственные посадки позволяют закупать цветы на рынке дешевле.',bonus:'−1 монета за каждый цветок на рынке'}, atelier:{name:'Мастерская записок',cost:145,unlockSeason:1,desc:'Авторские открытки помогают точнее передавать чувства клиентов.',bonus:'+5 баллов к оценке букета с запиской'}, courier:{name:'Сафари-доставка',cost:235,unlockSeason:1,desc:'Аккуратная доставка приносит дополнительные чаевые за удачный заказ.',bonus:'+12 монет при оценке от 65%'}, promotion:{name:'Африканская афиша',cost:225,unlockSeason:1,desc:'Вывеска и реклама помогают привлекать новых клиентов.',bonus:'+2 репутации и +10 монет при оценке от 75%'} }; const UPGRADE_SEASON_LABELS=['Сезон дождей','Сезон солнца','Сезон урожая']; const UPGRADE_WORKING_RESERVE=[48,48,48]; function upgradeReserve(){return UPGRADE_WORKING_RESERVE[seasonIndex()];} function upgradeIsUnlocked(key){return seasonIndex()>=(upgradeDefs[key]?.unlockSeason??0);} function upgradeRequiredCash(key){return upgradeDefs[key].cost+upgradeReserve();} function upgradeEconomyInfo(key){  const item=upgradeDefs[key];  if(!item)return 'Неизвестное улучшение';  if(!upgradeIsUnlocked(key))return 'Откроется в сезоне «'+UPGRADE_SEASON_LABELS[item.unlockSeason]+'» (день '+(item.unlockSeason*7+1)+')';  if(state.money<upgradeRequiredCash(key))return 'Для покупки и резерва на цветы нужно ещё '+(upgradeRequiredCash(key)-state.money)+' '+coinWord(upgradeRequiredCash(key)-state.money);  return 'Можно купить и сохранить '+upgradeReserve()+' '+coinWord(upgradeReserve())+' на закупку цветов'; } const col={kraft:'#d4a994',linen:'#e7d6bc',velvet:'#a46e7a',signature:'#8ea2c8'}; const state={day:0,mon

LINE 4299 CHAR 7496091
serve()+' '+coinWord(upgradeReserve())+' на закупку цветов'; } const col={kraft:'#d4a994',linen:'#e7d6bc',velvet:'#a46e7a',signature:'#8ea2c8'}; const state={day:0,money:160,rep:0,chosen:[],history:[],last:null,finished:false,positions:[],accessoryPositions:{basket:{},bouquet:{}},harmonyVariant:-1,stock:{},stockCosts:{},flowerLots:{},spoilageLog:[],lastSpoilage:null,marketSpent:0,spoilage:0,spoilageCost:0,deals:{},availability:{},assortment:0,started:false,upgrades:{fridge:false,showcase:false,premiumPack:false,assistant:false,nursery:false,atelier:false,courier:false,promotion:false},upgradeNote:'Инвестиции требуют накоплений. Для развития магазина сравнивай прибыль заказов и эффективность улучшений. На все восемь апгрейдов за 21 день может не хватить средств.',seasonOpeningCash:[160],seasonOpeningRep:[0],seasonOpeningMarketSpent:[0],seasonClosingCash:[],seasonClosingRep:[],seasonClosingMarketSpent:[],upgradePurchases:[],seasonReportVisible:false,seasonRewards:{spring:null,summer:null},snapshotBouquetMarkup:''}; let newlyInstalledUpgrade=null; let shopBeforeComparison=false; function toggleShopBeforeAfter(){shopBeforeComparison=!shopBeforeComparison;updateShopVisual();} const $=id=>document.getElementById(id); types.forEach(t=>{state.stock[t.id]=0;state.stockCosts[t.id]=[];}); function startGame(){state.started=true;ftzQueueSave();const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('work');window.scrollTo(0,0);} function openRulesFirst(){const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('rules');} function currentSeason(){return seasonPlan[state.day]||seasonPlan[seasonPlan.length-1];} function upgradeCount(){return Object.values(state.upgrades).filter(Boolean).length;} function shopLevel(){  const c=upgradeCount(), invested=state.upgradePurchases.reduce((n,p)=>n+p.cost,0);  // Капитал развития — вложения в оборудование, а не

LINE 4299 CHAR 7496210
7a',signature:'#8ea2c8'}; const state={day:0,money:160,rep:0,chosen:[],history:[],last:null,finished:false,positions:[],accessoryPositions:{basket:{},bouquet:{}},harmonyVariant:-1,stock:{},stockCosts:{},flowerLots:{},spoilageLog:[],lastSpoilage:null,marketSpent:0,spoilage:0,spoilageCost:0,deals:{},availability:{},assortment:0,started:false,upgrades:{fridge:false,showcase:false,premiumPack:false,assistant:false,nursery:false,atelier:false,courier:false,promotion:false},upgradeNote:'Инвестиции требуют накоплений. Для развития магазина сравнивай прибыль заказов и эффективность улучшений. На все восемь апгрейдов за 21 день может не хватить средств.',seasonOpeningCash:[160],seasonOpeningRep:[0],seasonOpeningMarketSpent:[0],seasonClosingCash:[],seasonClosingRep:[],seasonClosingMarketSpent:[],upgradePurchases:[],seasonReportVisible:false,seasonRewards:{spring:null,summer:null},snapshotBouquetMarkup:''}; let newlyInstalledUpgrade=null; let shopBeforeComparison=false; function toggleShopBeforeAfter(){shopBeforeComparison=!shopBeforeComparison;updateShopVisual();} const $=id=>document.getElementById(id); types.forEach(t=>{state.stock[t.id]=0;state.stockCosts[t.id]=[];}); function startGame(){state.started=true;ftzQueueSave();const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('work');window.scrollTo(0,0);} function openRulesFirst(){const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('rules');} function currentSeason(){return seasonPlan[state.day]||seasonPlan[seasonPlan.length-1];} function upgradeCount(){return Object.values(state.upgrades).filter(Boolean).length;} function shopLevel(){  const c=upgradeCount(), invested=state.upgradePurchases.reduce((n,p)=>n+p.cost,0);  // Капитал развития — вложения в оборудование, а не остаток кассы: купленные активы не обесценивают прогресс.  if(c>=4 && invested>=700 && state.rep>=68)return {id:'stud

LINE 4299 CHAR 7496444
stSpoilage:null,marketSpent:0,spoilage:0,spoilageCost:0,deals:{},availability:{},assortment:0,started:false,upgrades:{fridge:false,showcase:false,premiumPack:false,assistant:false,nursery:false,atelier:false,courier:false,promotion:false},upgradeNote:'Инвестиции требуют накоплений. Для развития магазина сравнивай прибыль заказов и эффективность улучшений. На все восемь апгрейдов за 21 день может не хватить средств.',seasonOpeningCash:[160],seasonOpeningRep:[0],seasonOpeningMarketSpent:[0],seasonClosingCash:[],seasonClosingRep:[],seasonClosingMarketSpent:[],upgradePurchases:[],seasonReportVisible:false,seasonRewards:{spring:null,summer:null},snapshotBouquetMarkup:''}; let newlyInstalledUpgrade=null; let shopBeforeComparison=false; function toggleShopBeforeAfter(){shopBeforeComparison=!shopBeforeComparison;updateShopVisual();} const $=id=>document.getElementById(id); types.forEach(t=>{state.stock[t.id]=0;state.stockCosts[t.id]=[];}); function startGame(){state.started=true;ftzQueueSave();const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('work');window.scrollTo(0,0);} function openRulesFirst(){const s=$('startScreen');if(s)s.classList.add('hidden');switchTab('rules');} function currentSeason(){return seasonPlan[state.day]||seasonPlan[seasonPlan.length-1];} function upgradeCount(){return Object.values(state.upgrades).filter(Boolean).length;} function shopLevel(){  const c=upgradeCount(), invested=state.upgradePurchases.reduce((n,p)=>n+p.cost,0);  // Капитал развития — вложения в оборудование, а не остаток кассы: купленные активы не обесценивают прогресс.  if(c>=4 && invested>=700 && state.rep>=68)return {id:'studio',name:'Студия «Танзания»',short:'Студия'};  if(c>=2 && invested>=300 && state.rep>=30)return {id:'salon',name:'Салон «Танзания»',short:'Салон'};  return {id:'shop',name:'Лавка «Танзания»',short:'Лавка'}; } function isVipDay(){return 

LINE 6515 CHAR 16463708
false; let ftzSuppressSave=false; function ftzCaptureBouquetSpec(){  const extras={};  FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);extras[key]=el?el.value:undefined;});  return {chosen:state.chosen.slice(),positions:state.positions.map(p=>p?{...p}:null),accessoryPositions:JSON.parse(JSON.stringify(state.accessoryPositions||{})),extras}; } function ftzStoredExtras(){  const extras={};  FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);if(el)extras[key]=el.value;});  return extras; } function ftzQueueSave(){  if(ftzSuppressSave||!state.started)return;  if(ftzSaveTimer)clearTimeout(ftzSaveTimer);  ftzSaveTimer=setTimeout(ftzSaveNow,180); } function ftzSaveNow(){  if(ftzSaveTimer){clearTimeout(ftzSaveTimer);ftzSaveTimer=null;}  if(ftzSuppressSave||!state.started)return;  try{   // Snapshot markup contains inline artwork and could exceed the browser quota.   const compactHistory=state.history.map(h=>{    const {bouquetMarkup,...small}=h;return small;   });   const compactState={...state,history:compactHistory,snapshotBouquetMarkup:''};   const payload={version:FTZ_SAVE_VERSION,at:Date.now(),state:compactState,     flowStep,flowMax,extras:ftzStoredExtras()};   localStorage.setItem(FTZ_SAVE_KEY,JSON.stringify(payload));   ftzSaveBlocked=false;   const indicator=document.getElementById('ftzSaveNotice');   if(indicator)indicator.textContent='✓ Прогресс сохраняется автоматически';  }catch(err){   ftzSaveBlocked=true;   const indicator=document.getElementById('ftzSaveNotice');   if(indicator)indicator.textContent='Не удалось сохранить прогресс в этом браузере';   console.warn('Флорист Танзания: сохранение недоступно',err);  } } function ftzLoadProgress(){  let p;  try{p=JSON.parse(localStorage.getItem(FTZ_SAVE_KEY)||'null');}  catch(e){ftzSaveBlocked=true;return false;}  if(!p||p.version!==FTZ_SAVE_VERSION||!p.state||!p.state.started)return false;  if(!Number.isIntege

LINE 8505 CHAR 22813118
lse,selected=-1,drag=null,lastSignature='',history=[];   let legacySnapshot=null,newSnapshot=null;   const chosen=()=>typeof state!=='undefined'&&Array.isArray(state.chosen)?state.chosen:[];   const ready=()=>typeof state!=='undefined'&&Array.isArray(state.positions)&&Array.isArray(state.chosen);   const basket=()=>typeof ftzIsBasket==='function'&&ftzIsBasket();   const format=()=>basket()?'basket':'bouquet';   const sig=()=>chosen().join('|')+'::'+format()+'::'+($('wrap')?.value||'');   const profile=id=>typeof bouquetFlowerProfile==='function'?(bouquetFlowerProfile(id)||{}):{};   const role=id=>typeof TZ_FLORIST_TYPES!=='undefined'?((TZ_FLORIST_TYPES[id]||{}).role||'round'):'round';   const currentStyle=()=>Number.isInteger(state.harmonyVariant)&&state.harmonyVariant>=0&&state.harmonyVariant<3?state.harmonyVariant:-1;   const profileY=id=>Number(profile(id).dy)||0;   function syncSignature(){     const s=sig();if(s!==lastSignature){selected=-1;history=[];legacySnapshot=null;newSnapshot=null;lastSignature=s;}   }   function baseline(style=-1,fmt=format()){     const n=chosen().length;if(!n)return [];     // Берём откалиброванные координаты из реальной v0.15.192,     // включая индивидуальную посадку 4 цветов и материал упаковки.     if(style>=0&&typeof original.harmony==='function')return original.harmony(style);     if(fmt==='basket')return chosen().map((id,i)=>original.basket(i,n));     const preset=original.bouquet(n);     return chosen().map((id,i)=>preset[i]||{x:0,y:50,r:0,scale:1});   }    function solve(style=currentStyle(),fmt=format()){     if(!ready()||!chosen().length)return [];     const n=chosen().length,isb=fmt==='basket';     if(solving)return [];     solving=true;     try{       const bases=baseline(style,fmt);       const baseYs=bases.map(p=>Number((p&&p.y))||0);       const minBaseY=Math.min.apply(null,baseYs);       const maxBaseY=Math

LINE 8888 CHAR 22835226
led,toggle,     diagnostics:()=>({enabled,flowers:chosen().length,format:format(),style:currentStyle(),selected,undo:history.length}),     exportLayout:()=>ready()?JSON.stringify({chosen:clone(chosen()),format:format(),positions:clone(state.positions)}):'',     restoreLayout:data=>{const obj=typeof data==='string'?JSON.parse(data):data;       if(!ready()||obj.chosen.join('|')!==chosen().join('|')||obj.format!==format())throw Error('Набор цветов или формат композиции отличается');       pushUndo();state.positions=clone(obj.positions);redraw();save();}}; })();  </script> <style id="ftz-mobile-final-v015202"> .ftz-wrap-disclosure{margin:10px 0 6px;border:1px solid #e0e7da;border-radius:13px;background:#fafaf3;min-width:0} .ftz-wrap-disclosure>summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:44px;padding:11px 13px;cursor:pointer;color:#38644a;font-size:12px;font-weight:700} .ftz-wrap-disclosure>summary::-webkit-details-marker{display:none} .ftz-wrap-disclosure>summary:after{content:'⌄';font-size:18px;font-weight:400} .ftz-wrap-disclosure[open]>summary:after{content:'⌃'} .ftz-wrap-disclosure>summary b{margin-left:auto;color:#244c36} .ftz-wrap-disclosure>.ftz-wrap-picker{margin:0 8px 9px!important;padding:8px!important} .ftz-wrap-disclosure[hidden]{display:none!important} body .topright.florist-status-bar>.pill.stat-pill.stat-pill-season,body .topright.florist-status-bar>.pill.stat-pill.stat-pill-level{display:none!important} @media(max-width:760px){  body .content>.top .topright.florist-status-bar{width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr)) 48px!important;gap:5px!important;align-items:stretch!important}  body .topright.florist-status-bar>.pill.stat-pill:not(.stat-pill-music){height:62px!important;min-height:62px!important;padding:6px 8px!important;border-radi

### window\.(?:render|state|FLOWERS|ftzQueueSave)\s*=

LINE 8643 CHAR 22819924
ave(){if(typeof ftzQueueSave==='function')ftzQueueSave();}   function status(message){const node=$('ftz193Status');if(node)node.textContent=message;}   function redraw(){if(typeof window.render==='function')window.render();updateUI();}   function apply(style){     if(!ready()||!chosen().length||state.last||state.finished||!enabled)return;     captureLegacy();pushUndo();     state.harmonyVariant=clamp(style|0,0,2);     const next=solve(state.harmonyVariant);     if(next.length!==chosen().length){history.pop();return;}     state.positions=next;     redraw();save();status('Собрано: '+names[state.harmonyVariant]+'. Цветов: '+chosen().length+'.');   }   function edit(i,change){     if(!enabled||!ready()||state.last||state.finished)return;     const old=item(i);if(!old)return;     captureLegacy();pushUndo();     const v={...old,z:Number.isFinite(old.z)?old.z:clamp((old.y-(basket()?26:54))/46,-1,1)};     v.x=+clamp(v.x+(change.x||0),-69,69).toFixed(2);     v.y=+clamp(v.y+(change.y||0),basket()?-15:-17,basket()?84:108).toFixed(2);     v.r=+clamp((v.r||0)+(change.r||0),-32,32).toFixed(2);     v.z=+clamp((v.z||0)+(change.z||0),-1,1).toFixed(3);     v.scale=+clamp((v.scale||1)+(change.scale||0),.65,1.68).toFixed(4);     state.positions[i]=v;     redraw();save();status('Цветок №'+(i+1)+': угол '+Math.round(v.r)+'°, глубина '+v.z.toFixed(1)+'.');   }   function undo(){     if(!ready()||state.last||state.finished)return;     while(history.length){const previous=history.pop();       if(previous.signature===sig()){         state.positions=clone(previous.positions);state.harmonyVariant=previous.style;         redraw();save();status('Последнее изменение отменено.');return;       }     }     updateUI();status('Нет доступных изменений для отмены.');   }   function toggle(){     if(!ready()||state.last||state.finished)return;     if(enabled){       newSnapshot={positions:clone(state

LINE 8775 CHAR 22826684
.disabled=!history.length||!!state.last;     $('ftz193Switch').disabled=!!state.last;     if($('ftz180LayoutToggle'))$('ftz180LayoutToggle').hidden=enabled;     highlight();   }   window.render=function(){     const result=original.render.apply(this,arguments);     updateUI();return result;   };   function pointerDown(e){     if(!enabled||!ready()||state.last||state.finished)return;     const el=e.target.closest('.blossom[data-i]');     if(!el||!$('bouquet').contains(el))return;     const i=Number(el.dataset.i),p=item(i);     if(!Number.isInteger(i)||!p)return;     selected=i;highlight();updateUI();     const stage=$('bouquet'),rect=stage.getBoundingClientRect();     drag={id:e.pointerId,index:i,el,origin:{...p},startX:e.clientX,startY:e.clientY,       fx:290/Math.max(rect.width,1),fy:286/Math.max(rect.height,1),changed:false};     stage.setPointerCapture(e.pointerId);     e.stopImmediatePropagation();e.preventDefault();   }   function pointerMove(e){     if(!drag||drag.id!==e.pointerId)return;     const d=drag,dx=e.clientX-d.startX,dy=e.clientY-d.startY;     if(!d.changed&&Math.hypot(dx,dy)>3){captureLegacy();pushUndo();d.changed=true;}     if(d.changed){       const pos={...d.origin,x:+clamp(d.origin.x+dx*d.fx,-69,69).toFixed(2),         y:+clamp(d.origin.y+dy*d.fy,basket()?-15:-17,basket()?84:108).toFixed(2)};       pos.z=+clamp((Number(d.origin.z)||0)+(pos.y-d.origin.y)/55,-1,1).toFixed(3);       state.positions[d.index]=pos;       d.el.style.translate=dx+'px '+dy+'px';       d.el.style.setProperty('z-index',String(zFor(pos,basket())),'important');     }     e.stopImmediatePropagation();e.preventDefault();   }   function pointerFinish(e){     if(!drag||drag.id!==e.pointerId)return;     const d=drag;drag=null;     if(d.changed){redraw();save();status('Цветок перемещён. Можно изменить поворот, размер и глубину.');}     else updateUI();     e.stopImmediatePropa
\n# Focused API points
\n### const types= count 1
\nLINE 1 ata-florist-icon'));node.removeAttribute('data-florist-icon');});
}


const types=[{"id":"calla","name":"Белая калла","trait":"чистота и нежность","price":9,"buy":5,"rarity":"common","tags":["sincere","calm"]},{"id":"agapanthusWhite","name":"Белый агапантус","trait":"светлая гармония","price":10,"buy":6,"rarity":"rare","tags":["calm","care"]}].concat([{"id":"rose","name":"Протея","trait":"сила саванны","price":11,"buy":7,"rarity":"rare","tags":["hope","care"]},{"id":"tulip","name":"Стрелиция","trait":"свобода","price":10,"buy":6,"rarity":"rare","tags":["hope","joy"]},{"id":"sun","name":"Газания","trait":"солнечная радость","price":8,"buy":5,"rarity":"common","tags":["joy","hope"]},{"id":"daisy","name":"Остеоспермум","trait":"лёгкость","price":7,"buy":4,"rarity":"common","tags":["sincere","joy"]},{"id":"lav","name":"Агапантус","trait":"гармония","price":10,"buy":6,"rarity":"rare","tags":["calm","care"]},{"id":"white","name":"Леукоспермум","trait":"энергия","price":9,"buy":5,"rarity":"rare","tags":["hope","sincere"]},{"id":"peony","name":"Кливия","trait":"тепло","price":12,"buy":7,"rarity":"rare","tags":["love","care"]},{"id":"iris","name":"Нерине","trait":"изящество","price":10,"buy":6,"rarity":"rare","tags":["calm","love"]},{"id":"lily","name":"Глориоза","trait":"страсть","price":13,"buy":8,"rarity":"premium","tags":["passion","love"]},{"id":"hydra","name":"Цветущий алоэ","trait":"стойкость","price":10,"buy":6,"rarity":"rare","tags":["care","hope"]},{"id":"carnation","name":"Амариллис","trait":"торжество","price":11,"buy":7,"rarity":"rare","tags":["passion","joy"]},{"id":"ranunc","name":"Книфофия","trait":"огонь","price":12,"buy":7,"rarity":"premium","tags":["love","joy"]}]);
// v0.15.92: Watsonia, the fifteenth African flower.
types.push({id:"watsonia",name:"Ватсония",trait:"нежность рассвета",price:9,buy:5,rarity:"common",tags:["hope","joy"]});
const palettes={"calla":["#f7f5df","#ffffff","#e0c76a"],"agapanthusWhite":["#fcfcf5","#eef3de","#d7ce9d"],"rose":["#e06f9c","#ffbdce","#833b5c"],"tulip":["#f07d2d","#326baf","#c9a04f"],"sun":["#efa32e","#ffe08a","#8b5531"],"daisy":["#9977c6","#e4ccfa","#d0a04e"],"lav":["#5b99c4","#d3e9f4","#4a6284"],"white":["#eb8042","#ffd0aa","#a44b33"],"peony":["#f58449","#ffcc83","#b55b36"],"iris":["#ef63a6","#ffbddb","#a65482"],"lily":["#e74439","#efc951","#9e4b39"],"hydra":["#f46748","#ffb055","#9a5133"],"carnation":["#e9673b","#ffcb4f","#ad562a"],"ranunc":["#ec7a94","#ffdb91","#c27a6a"]};
function petalRing(count,cx,cy,rx,ry,colors,rot=0,stroke='rgba(120,80,80,.12)'){
 return Array.from({leng
\n### let types= count 0
\n### var types= count 0
\n### function flowerArt( count 1
\nLINE 1 'function')renderMarket();
 if(typeof render==='function')render();
}
function flowerArt(f){
 const flowerAsset=ftzUseNewFlowers?FTZ_NEW_FLOWER_IMAGES[f.id]:approvedFlowerImages[f.id];
 if(flowerAsset) return `<svg class="floral-svg" viewBox="0 0 80 100" width="80" height="100" role="img" aria-label="${f.name}"><image href="${flowerAsset}" x="0" y="0" width="80" height="100" preserveAspectRatio="xMidYMid meet"/></svg>`;
 const c=palettes[f.id];
 const defs = `<defs><radialGradient id="g-${f.id}" cx="50%" cy="38%" r="70%"><stop offset="0%" stop-color="${c[2]||c[1]}"/><stop offset="100%" stop-color="${c[0]}"/></radialGradient></defs>`;
 let body='';
 if(f.id==='lav'){
  body = `${defs}<path d="M40 98Q40 62 40 14" fill="none" stroke="#638a66" stroke-width="3"/><path d="M40 77Q19 59 16 74Q30 83 40 84M40 84Q59 63 64 76Q53 88 40 89" fill="#7aa67d" opacity=".9"/>` +
   Array.from({length:10},(_,i)=>{const y=14+i*5; const left=i%2?33:47; const ang=i%2?-28:28; const fill=i<3?c[2]:i<7?c[1]:c[0]; return `<ellipse cx="${left}" cy="${y}" rx="6" ry="10" transform="rotate(${ang} ${left} ${y})" fill="${fill}" stroke="${c[0]}" stroke-width=".5"/>`;}).join('')+
   `<circle cx="40" cy="10" r="4" fill="${c[1]}"/>`;
 }
 else if(f.id==='sun'){
  body = `${defs}<path d="M40 97Q39 70 40 53" fill="none" stroke="#678f67" stroke-width="3"/><path d="M40 78Q17 53 16 74Q28 84 40 84M40 84Q64 57 66 74Q56 86 41 88" fill="#79a47a"/>` +
  petalRing(18,40,42,8,22,[c[1],c[0],c[2]],0,'rgba(175,130,55,.16)')+`<circle cx="40" cy="43" r="18" fill="#6b4934"/><circle cx="40" cy="43" r="12" fill="#a8793f"/><circle cx="40" cy="43" r="6" fill="#d5ad61"/>`;
 }
 else if(f.id==='tulip'){
  body = `${defs}<path d="M40 98Q39 74 40 59" fill="none" stroke="#648c67" stroke-width="3"/><path d="M40 80Q20 59 18 76Q29 86 40 87M40 86Q59 60 62 76Q53 87 40 89" fill="#7ca77f"/>`+
  `<path d="M22 56Q17 41 22 22L31 33L40 16L49 33L58 22Q63 41 58 56Q50 64 40 66Q30 64 22 56" fill="url(#g-${f.id})" stroke="${c[0]}" stroke-width=".8"/><path d="M26 28Q32 39 40 56Q47 39 54 28Q50 60 40 63Q31 60 26 28" fill="${c[2]}" opacity=".7"/><path d="M31 33Q35 28 40 22Q45 28 49 33" fill="none" stroke="${c[1]}" stroke-width="2" stroke-linecap="round"/>`;
 }
 else if(f.id==='white'){
  body = `${defs}<path d="M40 97Q39 72 40 54" fill="none" stroke="#648b67" stroke-width="3"/>`+
  Array.from({length:8},(_,i)=>{let x=18+(i%3)*18+(i>5?9:0),y=25+Math.floor(i/3)*16; return `<line x1="40" y1="72" x2="${x}" y2="${y}" stroke="#7ba27e" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="8" fill="#ffffff" stroke="#d8cfd
\n### function stockCount( count 1
\nLINE 1 totalStock(){return Object.values(state.stock).reduce((a,b)=>a+b,0);}
function stockCount(id){return state.stock[id]||0;}
function reservedCount(id){return state.chosen.filter(x=>x===id).length;}
function availableCount(id){return stockCount(id)-reservedCount(id);}
function currentBuyPrice(id){const base=state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base-(state.upgrades.nursery?1:0));}
/* Награда сезона дождей: скидка действует в сезоне солнца для ограниченного количества цветов. */
function springSavingsPerFlower(id){
 const reward=state.seasonRewards.spring;
 if(seasonIndex()!==1||!reward||reward.remaining<=0)return 0;
 return Math.min(reward.perFlower,Math.max(0,currentBuyPrice(id)-1));
}
function purchaseCost(id,qty){
 const r=state.seasonRewards.spring;
 const eligible=(seasonIndex()===1&&r)?Math.min(qty,r.remaining):0;
 return currentBuyPrice(id)*qty-eligible*springSavingsPerFlower(id);
}
function seasonRewardMarketHtml(){
 if(seasonIndex()===1&&state.seasonRewards.spring){
  const r=state.seasonRewards.spring;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('gift')}</span><div><b>Награда сезона дождей: скидка в сезон солнца</b><p>−${r.perFlower} ${r.perFlower===1?'монета':'монеты'} за цветок · осталось покупок со скидкой: <strong>${r.remaining} из ${r.limit}</strong>. Сэкономлено: ${r.saved} монет.</p></div></div>`;
 }
 if(seasonIndex()===2&&state.seasonRewards.summer){
  const r=state.seasonRewards.summer;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('medal')}</span><div><b>Награда сезона солнца: добрая репутация</b><p>${r.applied?'Начислено':'Будет начислено'} <strong>+${r.bonus} к репутации</strong> перед первым заказом сезона урожая. Бонус даётся один раз.</p></div></div>`;
 }
 return '';
}
function getNote(){const el=$('note');return noteOptions[el?el.value:'none'];}
function getGreen(){const el=$('greenery');return greeneryOptions[el?el.value:'none'];}
function getDecor(){const el=$('decor');return decorOptions[el?el.value:'none'];}
function ftzDecorKeys(){return ['decor','decor2','decor3'].map(k=>$(k)?.value||'none').filter(k=>k!=='none'&&Object.prototype.hasOwnProperty.call(decorOptions,k));}
function ftzDecorItems(){return ftzDecorKeys().map(k=>decorOptions[k]);}
function ftzDecorPrice(){return ftzDecorItems().reduce((v,item)=>v+item.retail,0);}
function ftzDecorWholesale(){return ftzDecorItems().reduce((v,item)=>v+item.wholesale,0);}
function ftzDecorTags(){return ftzDecorItems().flatMap(item=>item.tags||[]);}
func
\n### function availableCount( count 1
\nLINE 1 tion reservedCount(id){return state.chosen.filter(x=>x===id).length;}
function availableCount(id){return stockCount(id)-reservedCount(id);}
function currentBuyPrice(id){const base=state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base-(state.upgrades.nursery?1:0));}
/* Награда сезона дождей: скидка действует в сезоне солнца для ограниченного количества цветов. */
function springSavingsPerFlower(id){
 const reward=state.seasonRewards.spring;
 if(seasonIndex()!==1||!reward||reward.remaining<=0)return 0;
 return Math.min(reward.perFlower,Math.max(0,currentBuyPrice(id)-1));
}
function purchaseCost(id,qty){
 const r=state.seasonRewards.spring;
 const eligible=(seasonIndex()===1&&r)?Math.min(qty,r.remaining):0;
 return currentBuyPrice(id)*qty-eligible*springSavingsPerFlower(id);
}
function seasonRewardMarketHtml(){
 if(seasonIndex()===1&&state.seasonRewards.spring){
  const r=state.seasonRewards.spring;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('gift')}</span><div><b>Награда сезона дождей: скидка в сезон солнца</b><p>−${r.perFlower} ${r.perFlower===1?'монета':'монеты'} за цветок · осталось покупок со скидкой: <strong>${r.remaining} из ${r.limit}</strong>. Сэкономлено: ${r.saved} монет.</p></div></div>`;
 }
 if(seasonIndex()===2&&state.seasonRewards.summer){
  const r=state.seasonRewards.summer;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('medal')}</span><div><b>Награда сезона солнца: добрая репутация</b><p>${r.applied?'Начислено':'Будет начислено'} <strong>+${r.bonus} к репутации</strong> перед первым заказом сезона урожая. Бонус даётся один раз.</p></div></div>`;
 }
 return '';
}
function getNote(){const el=$('note');return noteOptions[el?el.value:'none'];}
function getGreen(){const el=$('greenery');return greeneryOptions[el?el.value:'none'];}
function getDecor(){const el=$('decor');return decorOptions[el?el.value:'none'];}
function ftzDecorKeys(){return ['decor','decor2','decor3'].map(k=>$(k)?.value||'none').filter(k=>k!=='none'&&Object.prototype.hasOwnProperty.call(decorOptions,k));}
function ftzDecorItems(){return ftzDecorKeys().map(k=>decorOptions[k]);}
function ftzDecorPrice(){return ftzDecorItems().reduce((v,item)=>v+item.retail,0);}
function ftzDecorWholesale(){return ftzDecorItems().reduce((v,item)=>v+item.wholesale,0);}
function ftzDecorTags(){return ftzDecorItems().flatMap(item=>item.tags||[]);}
function ftzDecorHas(key){return ftzDecorKeys().includes(key);}
function ftzSetDecorChoice(id){
 const el=$(id);if(!el)return;
 co
\n### function nextDay( count 0
\n### function completeOrder( count 0
\n### function finishOrder( count 0
\n### function finishDay( count 0
\n### function renderUpgrades( count 1
\nLINE 2 te.finished&&!state.last&&(typeof flowMax==='undefined'||flowMax<1);}
function renderUpgrades(){
 const grid=$('upgradeGrid');if(!grid)return;
 const entries=Object.entries(upgradeDefs);
 const owned=entries.filter(([k])=>state.upgrades[k]).length;
 const notOwned=entries.filter(([k])=>!state.upgrades[k]);
 const canBuyNow=upgradeBuyingAllowed();
 const affordable=notOwned.filter(([key])=>upgradeIsUnlocked(key)&&state.money>=upgradeRequiredCash(key)).length;
 const seasonUnlocked=notOwned.filter(([key])=>upgradeIsUnlocked(key)).length;
 const seasonLocked=notOwned.length-seasonUnlocked;
 const visible=entries.filter(([key])=>upgradeFilter==='all'||(upgradeFilter==='owned'?!!state.upgrades[key]:!state.upgrades[key]));
 grid.innerHTML=visible.map(([key,up])=>{
  const installed=!!state.upgrades[key];
  const unlocked=upgradeIsUnlocked(key);
  const deficit=Math.max(0,upgradeRequiredCash(key)-state.money);
  const buyDisabled=installed||!unlocked||deficit>0||!canBuyNow;
  const cta=installed?'✓ Установлено':!unlocked?'Откроется в день '+(up.unlockSeason*7+1):!canBuyNow?'Доступно утром':deficit>0?`Нужно ещё ${deficit} монет`:`Купить за ${up.cost}`;
  const hint=installed?'Бонус уже действует':upgradeEconomyInfo(key);
  return `<div class="upgradecard ${installed?'upgrade-installed':''} ${!unlocked?'upgrade-season-locked':''} ${!installed&&unlocked&&deficit===0&&canBuyNow?'upgrade-affordable':''}">
   ${upgradeArt(key)}
   <span class="status ${installed?'on':'off'}">${installed?'Установлено':!unlocked?'Позже':deficit===0?'Доступно':'Пока не хватает монет'}</span>
   <span class="upgrade-season-badge">${UPGRADE_SEASON_LABELS[up.unlockSeason]} · с ${up.unlockSeason*7+1}-го дня</span>
   <h4>${up.name}</h4><p>${up.desc}</p>
   <div class="upgrade-card-benefit"><strong>${up.bonus}</strong><span>${hint}</span></div>
   <div class="upgrade-price-row"><span>Стоимость</span><strong>${up.cost} <span class="coin-icon" role="img" aria-label="монета"></span></strong></div>
   <button type="button" onclick="buyUpgrade('${key}')" ${buyDisabled?'disabled':''}>${cta}</button>
  </div>`;
 }).join('')||'<div class="upgrade-empty">Здесь пока нет улучшений. Выбери другой фильтр.</div>';
 const roadmap=$('upgradeRoadmapTrack'),fill=$('upgradeRoadmapFill');
 if(roadmap)roadmap.setAttribute('aria-valuenow',String(owned));
 if(fill)fill.style.width=Math.round(owned/entries.length*100)+'%';
 if($('upgradeRoadmapLabel'))$('upgradeRoadmapLabel').textContent=`${owned} из ${entries.length} улучшений · ${UPGRADE_SEASON_LABELS[seasonIndex()]}`;
 const lvl=sho
\n### function renderShop( count 0
\n### function renderFlowers( count 0
\n### function current( count 1
\nLINE 1 }
};
function specialEvent(){return SPECIAL_EVENTS[state.day]||null;}
function current(){
 const base=stories[state.day]||stories[stories.length-1];
 const s={...base,wants:[...base.wants],avoid:[...base.avoid]};
 if(isVipDay()){
  s.vip=true;s.budget+=18;
  s.detail='Особый заказ · '+base.detail;
  s.occasion='VIP · '+base.occasion;
  s.hint='VIP-клиент особенно ценит точность. '+base.hint;
 }
  const event=specialEvent();
  if(event){s.budget+=event.budget;s.occasion=event.title+' · '+s.occasion;s.detail=event.detail+' '+s.detail;s.hint=event.title+': оценка от '+event.required+'% принесёт дополнительно '+event.bonus+' монет и '+event.rep+' репутации. '+s.hint;if(state.day===18)s.vip=true;}
 return s;
}

function detailText(s){
 const raw=(s&&s.detail?s.detail:'эта история мне очень важна').trim();
 return raw.charAt(0).toLowerCase()+raw.slice(1);
}
const PERSONAL_REACTIONS={ "Амина":{delight:`«Сестра почувствовала в этом букете всю мою надежду на примирение.»`,warm:`«Сестра почувствовала в этом букете всю мою надежду на примирение.»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Джума":{delight:`«Теперь я смогу признаться ей так, как и хотел: искренне.»`,warm:`«Теперь я смогу признаться ей так, как и хотел: искренне.»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Зури":{delight:`«Эти цветы напомнят подруге, что смелость открывает новые двери.»`,warm:`«Эти цветы напомнят подруге, что смелость открывает новые двери.»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Омари":{delight:`«Именно такой букет хочется подарить, когда слова не нужны.»`,warm:`«Именно такой букет хочется подарить, когда слова не нужны.»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Ния":{delight:`«Я смогу спокойно попросить прощения и показать свою любовь.»`,warm:`«Я смогу спокойно попросить прощения и показать свою любовь.»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Барака":{delight:`«Настоящий букет победы — спасибо!»`,warm:`«Настоящий букет победы — спасибо!»`,mixed:`«Спасибо за букет. Он поможет передать мои чувства.»`,low:`«Хотелось бы немного другого настроения, но спасибо за старание.»`},
 "Аша"
\n### function currentBuyPrice( count 1
\nLINE 1 function availableCount(id){return stockCount(id)-reservedCount(id);}
function currentBuyPrice(id){const base=state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base-(state.upgrades.nursery?1:0));}
/* Награда сезона дождей: скидка действует в сезоне солнца для ограниченного количества цветов. */
function springSavingsPerFlower(id){
 const reward=state.seasonRewards.spring;
 if(seasonIndex()!==1||!reward||reward.remaining<=0)return 0;
 return Math.min(reward.perFlower,Math.max(0,currentBuyPrice(id)-1));
}
function purchaseCost(id,qty){
 const r=state.seasonRewards.spring;
 const eligible=(seasonIndex()===1&&r)?Math.min(qty,r.remaining):0;
 return currentBuyPrice(id)*qty-eligible*springSavingsPerFlower(id);
}
function seasonRewardMarketHtml(){
 if(seasonIndex()===1&&state.seasonRewards.spring){
  const r=state.seasonRewards.spring;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('gift')}</span><div><b>Награда сезона дождей: скидка в сезон солнца</b><p>−${r.perFlower} ${r.perFlower===1?'монета':'монеты'} за цветок · осталось покупок со скидкой: <strong>${r.remaining} из ${r.limit}</strong>. Сэкономлено: ${r.saved} монет.</p></div></div>`;
 }
 if(seasonIndex()===2&&state.seasonRewards.summer){
  const r=state.seasonRewards.summer;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('medal')}</span><div><b>Награда сезона солнца: добрая репутация</b><p>${r.applied?'Начислено':'Будет начислено'} <strong>+${r.bonus} к репутации</strong> перед первым заказом сезона урожая. Бонус даётся один раз.</p></div></div>`;
 }
 return '';
}
function getNote(){const el=$('note');return noteOptions[el?el.value:'none'];}
function getGreen(){const el=$('greenery');return greeneryOptions[el?el.value:'none'];}
function getDecor(){const el=$('decor');return decorOptions[el?el.value:'none'];}
function ftzDecorKeys(){return ['decor','decor2','decor3'].map(k=>$(k)?.value||'none').filter(k=>k!=='none'&&Object.prototype.hasOwnProperty.call(decorOptions,k));}
function ftzDecorItems(){return ftzDecorKeys().map(k=>decorOptions[k]);}
function ftzDecorPrice(){return ftzDecorItems().reduce((v,item)=>v+item.retail,0);}
function ftzDecorWholesale(){return ftzDecorItems().reduce((v,item)=>v+item.wholesale,0);}
function ftzDecorTags(){return ftzDecorItems().flatMap(item=>item.tags||[]);}
function ftzDecorHas(key){return ftzDecorKeys().includes(key);}
function ftzSetDecorChoice(id){
 const el=$(id);if(!el)return;
 const key=el.value;
 if(key!=='none'&&['decor','decor2','decor3'].some(o
\n### function buyStem( count 1
\nLINE 2 assortment=Object.values(state.availability).filter(Boolean).length;}
function buyStem(id,qty){
 if(state.last||(typeof flowMax!=='undefined'&&flowMax>=1)||!Number.isInteger(qty)||qty<1)return;
 const flower=types.find(t=>t.id===id);
 if(!flower||!state.availability[id]){marketMessage('Сегодня этот цветок на рынке недоступен.');return;}
 const cost=purchaseCost(id,qty);
 if(state.money<cost){marketMessage('Недостаточно монет для этой закупки.');return;}
 const spring=state.seasonRewards.spring;
 const discountPerFlower=springSavingsPerFlower(id);
 const discounted=seasonIndex()===1&&spring?Math.min(qty,spring.remaining):0;
 const saved=discounted*discountPerFlower;
 const unitCost=currentBuyPrice(id);
 if(!state.stockCosts[id])state.stockCosts[id]=[];
 if(!state.flowerLots[id])state.flowerLots[id]=[];
 for(let i=0;i<qty;i++){
  const paid=unitCost-(i<discounted?discountPerFlower:0);
  state.stockCosts[id].push(paid);
  state.flowerLots[id].push({boughtDay:state.day,cost:paid});
 }
 state.money-=cost;
 state.stock[id]+=qty;
 state.marketSpent+=cost;
 if(discounted){spring.remaining-=discounted;spring.saved+=saved;}
 clearMarketBalancePreview();
 marketMessage(`Куплено: ${flower.name} × ${qty}.${saved?' Награда сезона дождей: сэкономлено '+saved+' монет.':''} ${currentSeason().note}`);
 render();
}
function buyUpgrade(key){if(state.last||(typeof flowMax!=='undefined'&&flowMax>=1))return;const up=upgradeDefs[key]; if(!up)return; if(state.upgrades[key]){setUpgradeNote('Это улучшение уже установлено.'); return;} if(!upgradeIsUnlocked(key)){setUpgradeNote(upgradeEconomyInfo(key));return;} if(state.money<upgradeRequiredCash(key)){setUpgradeNote('Недостаточно монет: после покупки необходимо оставить '+upgradeReserve()+' монет на цветы. '+upgradeEconomyInfo(key)+'.');return;} state.money-=up.cost; state.upgrades[key]=true; newlyInstalledUpgrade=key; state.upgradePurchases.push({day:state.day+1,key,cost:up.cost}); setUpgradeNote(`Установлено улучшение: ${up.name}. ${up.bonus}.`); render();}
let tzNewBloomIndex=-1;
function choose(id){if(state.last||state.finished||flowStep!==1)return; if(state.chosen.length>=maxFlowers()){marketMessage(`Сейчас можно использовать до ${maxFlowers()} цветов.`); return;} if(availableCount(id)<=0){marketMessage('Свободных цветов этого вида на складе не осталось.'); return;} const flower=types.find(f=>f.id===id);
if(price()+flower.price>budgetLimit()){
  marketMessage('Нельзя добавить '+flower.name+': бюджет клиента '+budgetLimit()+' монет. Осталось '+Math.max(0,budgetLimit()-price())+' '+coinWordCount(Math
\n### function consume count 0
\n### function updateShopVisual( count 1
\nLINE 2 и цветы: здесь появится прогноз прибыли без чаевых и VIP-бонусов.';
}
function updateShopVisual(){
 const level=shopLevel();
 const before=shopBeforeComparison;
 for(const id of ['shopVisual','shopVisualLarge']){
  const el=$(id);if(!el)continue;
  const previewBefore=before&&id==='shopVisualLarge';
  if(!el.dataset.artReady){
   el.querySelectorAll('.js-shop-asset').forEach(img=>{const src=visualAssets[img.dataset.art];if(src)img.src=src;});
   el.dataset.artReady='yes';
  }
  // The comparison is only visual; money, real upgrades, bonuses and current level stay untouched.
  for(const key of ['fridge','showcase','premiumPack','assistant','nursery','atelier','courier','promotion']){
   el.classList.toggle('has-'+key,!previewBefore&&!!state.upgrades[key]);
   el.classList.remove('just-installed-'+key);
  }
  el.classList.toggle('is-salon',!previewBefore&&level.id==='salon');
  el.classList.toggle('is-studio',!previewBefore&&level.id==='studio');
  el.classList.toggle('is-comparing-before',previewBefore);
  if(!previewBefore&&newlyInstalledUpgrade){
    el.classList.add('just-installed-'+newlyInstalledUpgrade);
  }
  const previousLevel=el.dataset.displayLevel;
  const displayedLevel=previewBefore?'shop':level.id;
  if(previousLevel&&previousLevel!==displayedLevel&&!previewBefore){
    el.classList.remove('shop-level-reveal');
    void el.offsetWidth;
    el.classList.add('shop-level-reveal');
  }
  el.dataset.displayLevel=displayedLevel;
  const installedNames=Object.keys(upgradeDefs).filter(key=>state.upgrades[key]).map(key=>upgradeDefs[key].name);
  const ariaDetail=installedNames.length?' Установлены: '+installedNames.join(', ')+'.':' Улучшения пока не установлены.';
  el.setAttribute('aria-label',previewBefore?'Исходный вид лавки до улучшений.':level.name+'. '+upgradeCount()+' из 8 улучшений.'+ariaDetail);
 }
 newlyInstalledUpgrade=null;
 if($('shopVisualLevel'))$('shopVisualLevel').textContent=level.name;
 if($('shopVisualLevelLarge'))$('shopVisualLevelLarge').textContent=before?'До улучшений':level.name;
 if($('shopPageLevel'))$('shopPageLevel').textContent=level.name;
 if($('shopPageUpgrades'))$('shopPageUpgrades').textContent=upgradeCount()+' из 8';
 if($('shopPageRep'))$('shopPageRep').textContent=state.rep;
 const compareBtn=$('shopCompareButton');
 if(compareBtn){compareBtn.textContent=before?'Показать «после»':'Показать «до»';compareBtn.setAttribute('aria-pressed',String(before));}
 if($('shopUnlockList'))$('shopUnlockList').innerHTML=Object.entries(upgradeDefs).map(([key,up])=>`<div class="shop-unlock ${state.upg
\n### function ftzLoadProgress( count 1
\nLINE 2 ;
  console.warn('Флорист Танзания: сохранение недоступно',err);
 }
}
function ftzLoadProgress(){
 let p;
 try{p=JSON.parse(localStorage.getItem(FTZ_SAVE_KEY)||'null');}
 catch(e){ftzSaveBlocked=true;return false;}
 if(!p||p.version!==FTZ_SAVE_VERSION||!p.state||!p.state.started)return false;
 if(!Number.isInteger(p.state.day)||p.state.day<0||p.state.day>=CAMPAIGN_DAYS)return false;
 if(!Array.isArray(p.state.history)||p.state.history.length>CAMPAIGN_DAYS)return false;
 try{
  // Unknown data properties cannot override code or any of the game's functions.
  for(const key of Object.keys(state)){
   if(key in p.state&&key!=='snapshotBouquetMarkup')state[key]=p.state[key];
  }
  state.snapshotBouquetMarkup='';
  flowStep=Math.max(0,Math.min(2,Number(p.flowStep)||0));
  flowMax=Math.max(flowStep,Math.max(0,Math.min(2,Number(p.flowMax)||0)));
  ftzRestorePayload=p;
  return true;
 }catch(e){console.warn('Некорректное сохранение',e);return false;}
}
function ftzRestoreExtras(extras){
 if(!extras)return;
 for(const key of FTZ_SAVE_EXTRAS){
  const el=$(key),value=extras[key];
  if(!el)continue;
  if(typeof value!=='string'){if(key==='decor2'||key==='decor3')el.value='none';continue;}
  if(Array.from(el.options).some(o=>o.value===value))el.value=value;
  else if(key==='decor'||key==='decor2'||key==='decor3')el.value='none';
 }
 syncExtras();
}
function ftzRebuildBouquet(spec){
 if(!spec||!Array.isArray(spec.chosen))return '';
 const originalChosen=state.chosen,originalPositions=state.positions,originalAccessories=state.accessoryPositions,originalExtras=ftzStoredExtras();
 const oldDecor=spec.extras?.decor;
 const decorSelect=$('decor');
 let temporaryHistoryOption=null;
 if(decorSelect&&oldDecor&&decorOptions[oldDecor]&&!Array.from(decorSelect.options).some(o=>o.value===oldDecor)){
  temporaryHistoryOption=document.createElement('option');
  temporaryHistoryOption.value=oldDecor;
  temporaryHistoryOption.textContent=decorOptions[oldDecor].name;
  temporaryHistoryOption.hidden=true;
  temporaryHistoryOption.disabled=true;
  decorSelect.appendChild(temporaryHistoryOption);
 }
 let markup='';
 try{
  state.chosen=spec.chosen.slice();
  state.positions=Array.isArray(spec.positions)?spec.positions.map(p=>p?{...p}:null):[];
  state.accessoryPositions=spec.accessoryPositions||{basket:{},bouquet:{}};
  ftzRestoreExtras(spec.extras);
  markup=renderBouquet();
 }catch(e){console.warn('Не удалось восстановить изображение букета',e);}
 finally{
  state.chosen=originalChosen;
  state.positions=originalPositions;
  state.accessoryPositions=origin
\n### function ftzSaveNow( count 1
\nLINE 2 earTimeout(ftzSaveTimer);
 ftzSaveTimer=setTimeout(ftzSaveNow,180);
}
function ftzSaveNow(){
 if(ftzSaveTimer){clearTimeout(ftzSaveTimer);ftzSaveTimer=null;}
 if(ftzSuppressSave||!state.started)return;
 try{
  // Snapshot markup contains inline artwork and could exceed the browser quota.
  const compactHistory=state.history.map(h=>{
   const {bouquetMarkup,...small}=h;return small;
  });
  const compactState={...state,history:compactHistory,snapshotBouquetMarkup:''};
  const payload={version:FTZ_SAVE_VERSION,at:Date.now(),state:compactState,
    flowStep,flowMax,extras:ftzStoredExtras()};
  localStorage.setItem(FTZ_SAVE_KEY,JSON.stringify(payload));
  ftzSaveBlocked=false;
  const indicator=document.getElementById('ftzSaveNotice');
  if(indicator)indicator.textContent='✓ Прогресс сохраняется автоматически';
 }catch(err){
  ftzSaveBlocked=true;
  const indicator=document.getElementById('ftzSaveNotice');
  if(indicator)indicator.textContent='Не удалось сохранить прогресс в этом браузере';
  console.warn('Флорист Танзания: сохранение недоступно',err);
 }
}
function ftzLoadProgress(){
 let p;
 try{p=JSON.parse(localStorage.getItem(FTZ_SAVE_KEY)||'null');}
 catch(e){ftzSaveBlocked=true;return false;}
 if(!p||p.version!==FTZ_SAVE_VERSION||!p.state||!p.state.started)return false;
 if(!Number.isInteger(p.state.day)||p.state.day<0||p.state.day>=CAMPAIGN_DAYS)return false;
 if(!Array.isArray(p.state.history)||p.state.history.length>CAMPAIGN_DAYS)return false;
 try{
  // Unknown data properties cannot override code or any of the game's functions.
  for(const key of Object.keys(state)){
   if(key in p.state&&key!=='snapshotBouquetMarkup')state[key]=p.state[key];
  }
  state.snapshotBouquetMarkup='';
  flowStep=Math.max(0,Math.min(2,Number(p.flowStep)||0));
  flowMax=Math.max(flowStep,Math.max(0,Math.min(2,Number(p.flowMax)||0)));
  ftzRestorePayload=p;
  return true;
 }catch(e){console.warn('Некорректное сохранение',e);return false;}
}
function ftzRestoreExtras(extras){
 if(!extras)return;
 for(const key of FTZ_SAVE_EXTRAS){
  const el=$(key),value=extras[key];
  if(!el)continue;
  if(typeof value!=='string'){if(key==='decor2'||key==='decor3')el.value='none';continue;}
  if(Array.from(el.options).some(o=>o.value===value))el.value=value;
  else if(key==='decor'||key==='decor2'||key==='decor3')el.value='none';
 }
 syncExtras();
}
function ftzRebuildBouquet(spec){
 if(!spec||!Array.isArray(spec.chosen))return '';
 const originalChosen=state.chosen,originalPositions=state.positions,originalAccessories=state.accessoryPositions,originalExtras
\n### function render(){ count 1
\nLINE 2 ice?'+'+current.price+' монет':'бесплатно'}`:'Выберите упаковку';
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
\n### function reset count 2
\nLINE 2 а, диагональ, каскад':`Вариант ${i+1}/3 — ${FTZ_HARMONY_NAMES[i]}`;
}
function resetBouquetArrangement(){
 if(state.last||state.finished||!state.chosen.length)return;
 const previous=Number.isInteger(state.harmonyVariant)?state.harmonyVariant:-1;
 const next=(previous+1)%3;
 state.positions=ftzHarmonyPositions(next);
 state.harmonyVariant=next;
 render();
 ftzQueueSave();
}

const bouquetHeadImages={"calla":"data:image/webp;base64,UklGRrj2AABXRUJQVlA4WAoAAAAQAAAAzwIADAIAQUxQSAp1AAABFIZt24ax//96WBLZ6AERocBtG6Wj4xvcfUKPk3eS/CDtQdYbipybaC4HKU9RbcCC4r0fKo3hBodIu8iLK2XYDb6c6UEFqMH8GTDYnBP8/TrBZXL02/svfZsspHN4fDaibIJdCOkR/FoycrF5LuiNoRJrwCWDRdknB02YfA+PeMu+I9lWbdu2rY16oCpbkK3D/mU+IAszqcHMzOfMMUarKfdu1mrOKaeccqnj8JkRAQuSZCHN5D1A1GTv3t4T0Zh82+P/T5Ge5jczexd3wy2QQHAIwaFYsRaX4l6stBCghSruFHeXFHcNbsFdk0IgkBC3hzy3o7u/12t3dnZ278nehb8ighVt21CuJ8+QpKdkqu+f+N/OXz/6z4/+86P//IgwP/mT/5fz9v9+vvbHCF/G+bHCO//oP9AKOyjJ16/GHGu/Erv877cNQinLKisFlHSF4kOu+99sOwhlgZ9cM0a6wOPgjql81RJbooLAo5CSZGvZfh3yC1h6ADpwpQ13PPDUy26++4GHHvzfLRf9add1BtsOTSuZd9n81GT6t8sXo67nxK9BTwvCGE0P0HvUXuc99Nak+SJCl1Iz3rphn6UBaI0CKfNRQK3SkX2wdO89YOk1tthpt733O+DQo4//00knHvmH3XbYcvTqyw/qU3ecfFCrJSnN1n9+1XFJ9+u/+Uk3vDGrgRgrJTjniXsYJvsJIWPkX12xbfc0OC0u4FZ9hmXjC/oP33TvE8659p4nXv5g8qyOzkajEXJptJaisWjhvLkzp3z62qN3XPHv43+33rDuzC5ySfmjv+LArtwM2Pq0hz5biIhGhg0upFLaqZTkArHzxZNWS0tGkF/VzsaUxMeSVGXiG7L2Toefed34TyfPVphRsTHpSUhpFVMhpdKO5w+fNfH9x6742wEbL0XsoIz+KrO/9dK59C6Xf9RARM25kK74jNHGUrb0C4X4wy07D7OSG1BHNTtJAbWeBCT7JFhls33H3jj+4+l2+YmMSotMkm6lMydhMsVTKStcmiihY7TUgs+euuAP6w8GsB9Cv7KEZwC1kcfd8plEVJzLnGdBxsXFaCXCCMVnNx4woqdnmezWb/jWe5921f1v/NiQ1lNAS2EXTEfqo0S5TkTnpEWnBUpIg4hm/rv3nLTFoMxj69cSL5LWI/oe8PR0xFiEQub42cqDtHUk9fP4iw7fccMVhvTv26//oCFLLbfSyA12PvrfNzz03k/zQys+paRw1pWMCy7yKlv2rpJzoRGx48PrDlm3T+Ywv4bU1gFg1GkfxIkLl2kR0VZRsdwLkBWcW7fuzhmTPv3g3fc+/PTzL7+a9P1MbldptF2lUY7HSm6ptHQB5NSq0rMzM96/5bjNhljVeErAbnD5lSIEQJ/dH5iJqGRG3vMl2Qd5r6XK3ZAYx+kTQ0q/Auh0dfGRMy1+yDwhVIyIjc/uPGg4saplNMWvFNyKf3lXYyxVIsiFJN9PwrWjQpIpVJmqjH/6PUtMlKv8E5qeXYQYT3vwBKsaHwTMCvCrQzxL/fsHRCW0U7qjwpLvmyxX0uzER77PAidfHpxp0lIhYsfnNx24AgCp1WhCvy6EWOrYLzAW0i2tJipUUEqCMX6JjEpD5IOc81JCKET55RU7pg2IteBXA5AkxDKnfxwjVz7yXKSgFOaiKEfoPVPWBOQmynpZkIj8oyt2tgax0HZGuFoo0rfPEz6Po1A6pTUNZ0z5iAqpQkkrkmz7SVAElpJcIYrPLtu5f/qEW7IPbsvdwOPfi0wotHahUHFx3/aLamO6AKIoF56kjRSpw8f/Wp9a7eFL9lzPIz9GTLhsMCeMRQU2ZaCYLiNN7jP0gXHBatdRqcPshw9e0ToSWWJ/++z++5dSztVT6CoBxg9R5H5iFESazOwpZBBFTYF/uo1zYyvJDUaTbt57mDX0ZckbSYhu+78oUShHD412CNJ3QlGiHgO1UsaFAkkJWh1tXKG+SColov7/Ndt2Szt4CFmiRgC9Dn49RiUdr5Ge0iy0lst50iXVhlpQBpIMzuC8u1EaMXz5xOFp3jICSwReZDHpt9niDUQhjCkfgObkIlGBa7eCMbPz7lo
\nLINE 2 et tzTraining={counts:[0,0,0,0],wrap:null,decor:null,complete:false};
function resetTzTraining(){tzTraining={counts:[0,0,0,0],wrap:null,decor:null,complete:false};renderTzTraining();}
function tzPracticeAdjust(i,d){tzTraining.counts[i]=Math.max(0,Math.min(8,tzTraining.counts[i]+d));renderTzTraining();}
function tzPracticeChoose(type,value){tzTraining[type]=value;renderTzTraining();}
function renderTzTraining(){
 const host=document.getElementById('tzPractice');if(!host)return;
 const n=tzTraining.counts.reduce((a,b)=>a+b,0),types=tzTraining.counts.filter(x=>x>0).length;
 const flowersCost=tzTraining.counts.reduce((sum,num,i)=>sum+num*tzTrainingFlowers[i].price,0);
 const wrapCost=tzTraining.wrap==='savanna'?5:tzTraining.wrap==='zanzibar'?7:0;
 const decorCost=tzTraining.decor==='card'?3:tzTraining.decor==='ribbon'?4:0;
 const total=flowersCost+wrapCost+decorCost,over=total>62;
 const completed=n>=4&&types>=2&&!!tzTraining.wrap&&!!tzTraining.decor&&!over;
 tzTraining.complete=completed;
 let message=over?'Бюджет превышен: убери цветок или выбери более доступное оформление.':n<4?'Добавь не менее четырёх цветов.':types<2?'Добавь цветок другого вида для разнообразия.':!tzTraining.wrap?'Выбери африканскую упаковку.':!tzTraining.decor?'Добавь украшение.':'Отлично! Букет готов, пожелания выполнены, бюджет соблюдён.';
 const buttons=tzTrainingFlowers.map((f,i)=>'<div class="tz-practice-flower"><div class="tz-practice-name"><img class="tz-practice-thumb" src="'+approvedFlowerImages[f.id]+'" alt=""> <b>'+f.name+'</b><small>'+f.price+' монет/шт.</small></div><div class="tz-practice-adjust"><button type="button" aria-label="Убрать '+f.name+'" onclick="tzPracticeAdjust('+i+',-1)">−</button><span>'+tzTraining.counts[i]+'</span><button type="button" aria-label="Добавить '+f.name+'" onclick="tzPracticeAdjust('+i+',1)">+</button></div></div>').join('');
 const opt=(kind,value,label)=>'<button type="button" class="'+(tzTraining[kind]===value?'chosen':'')+'" aria-pressed="'+(tzTraining[kind]===value)+'" onclick="tzPracticeChoose(&quot;'+kind+'&quot;,&quot;'+value+'&quot;)">'+label+'</button>';
 const selected=tzTrainingFlowers.flatMap((f,i)=>Array(tzTraining.counts[i]).fill(f));
 const positions=[[50,20,-3],[36,28,-12],[64,28,12],[46,37,-5],[57,38,9],[29,40,-15],[71,40,15],[49,12,0],[37,16,-9],[62,17,10],[24,30,-18],[76,30,18]];
 const stems=selected.map((f,i)=>{const [x,y]=positions[i%positions.length];return '<path d="M '+x+' '+(y+12)+' Q 50 66 50 86" stroke="#547944" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".8"/>';}).j
\n### state.upgrades.nursery count 1
\nLINE 1 state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base-(state.upgrades.nursery?1:0));}
/* Награда сезона дождей: скидка действует в сезоне солнца для ограниченного количества цветов. */
function springSavingsPerFlower(id){
 const reward=state.seasonRewards.spring;
 if(seasonIndex()!==1||!reward||reward.remaining<=0)return 0;
 return Math.min(reward.perFlower,Math.max(0,currentBuyPrice(id)-1));
}
function purchaseCost(id,qty){
 const r=state.seasonRewards.spring;
 const eligible=(seasonIndex()===1&&r)?Math.min(qty,r.remaining):0;
 return currentBuyPrice(id)*qty-eligible*springSavingsPerFlower(id);
}
function seasonRewardMarketHtml(){
 if(seasonIndex()===1&&state.seasonRewards.spring){
  const r=state.seasonRewards.spring;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('gift')}</span><div><b>Награда сезона дождей: скидка в сезон солнца</b><p>−${r.perFlower} ${r.perFlower===1?'монета':'монеты'} за цветок · осталось покупок со скидкой: <strong>${r.remaining} из ${r.limit}</strong>. Сэкономлено: ${r.saved} монет.</p></div></div>`;
 }
 if(seasonIndex()===2&&state.seasonRewards.summer){
  const r=state.seasonRewards.summer;
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('medal')}</span><div><b>Награда сезона солнца: добрая репутация</b><p>${r.applied?'Начислено':'Будет начислено'} <strong>+${r.bonus} к репутации</strong> перед первым заказом сезона урожая. Бонус даётся один раз.</p></div></div>`;
 }
 return '';
}
function getNote(){const el=$('note');return noteOptions[el?el.value:'none'];}
function getGreen(){const el=$('greenery');return greeneryOptions[el?el.value:'none'];}
function getDecor(){const el=$('decor');return decorOptions[el?el.value:'none'];}
function ftzDecorKeys(){return ['decor','decor2','decor3'].map(k=>$(k)?.value||'none').filter(k=>k!=='none'&&Object.prototype.hasOwnProperty.call(decorOptions,k));}
function ftzDecorItems(){return ftzDecorKeys().map(k=>decorOptions[k]);}
function ftzDecorPrice(){return ftzDecorItems().reduce((v,item)=>v+item.retail,0);}
function ftzDecorWholesale(){return ftzDecorItems().reduce((v,item)=>v+item.wholesale,0);}
function ftzDecorTags(){return ftzDecorItems().flatMap(item=>item.tags||[]);}
function ftzDecorHas(key){return ftzDecorKeys().includes(key);}
function ftzSetDecorChoice(id){
 const el=$(id);if(!el)return;
 const key=el.value;
 if(key!=='none'&&['decor','decor2','decor3'].some(other=>other!==id&&$(other)?.value===key)){
   el.value=previousExtras[id]||'none';
   marketMessage('Это украш
\n### const upgradeDefs= count 1
\nLINE 1 ика v0.15.15: 3 улучшения сезона дождей / 3 — солнца / 2 — урожая. */
const upgradeDefs={
fridge:{name:'Охлаждаемый павильон',cost:165,unlockSeason:0,desc:'Продлевает срок хранения каждой партии цветов на один игровой день, включая уже купленные.',bonus:'Свежесть +1 день'},
showcase:{name:'Этно-витрина',cost:195,unlockSeason:0,desc:'Привлекает больше внимания к магазину «Танзания» и повышает шанс VIP-заказа.',bonus:'VIP-поток + репутация'},
premiumPack:{name:'Африканская упаковка',cost:215,unlockSeason:1,desc:'Открывает эксклюзивные материалы, традиционные орнаменты и роскошное оформление букетов. Повышает впечатление от дорогих заказов.',bonus:'Открывает шёлковую упаковку'},
assistant:{name:'Флорист из Танзании',cost:285,unlockSeason:1,desc:'Помогает собирать более сложные букеты и слегка экономит закупки.',bonus:'+2 цветка (до 10) и +5 баллов к оценке'},
nursery:{name:'Питомник редких цветов',cost:210,unlockSeason:0,desc:'Собственные посадки позволяют закупать цветы на рынке дешевле.',bonus:'−1 монета за каждый цветок на рынке'},
atelier:{name:'Мастерская записок',cost:145,unlockSeason:1,desc:'Авторские открытки помогают точнее передавать чувства клиентов.',bonus:'+5 баллов к оценке букета с запиской'},
courier:{name:'Сафари-доставка',cost:235,unlockSeason:1,desc:'Аккуратная доставка приносит дополнительные чаевые за удачный заказ.',bonus:'+12 монет при оценке от 65%'},
promotion:{name:'Африканская афиша',cost:225,unlockSeason:1,desc:'Вывеска и реклама помогают привлекать новых клиентов.',bonus:'+2 репутации и +10 монет при оценке от 75%'}
};
const UPGRADE_SEASON_LABELS=['Сезон дождей','Сезон солнца','Сезон урожая'];
const UPGRADE_WORKING_RESERVE=[48,48,48];
function upgradeReserve(){return UPGRADE_WORKING_RESERVE[seasonIndex()];}
function upgradeIsUnlocked(key){return seasonIndex()>=(upgradeDefs[key]?.unlockSeason??0);}
function upgradeRequiredCash(key){return upgradeDefs[key].cost+upgradeReserve();}
function upgradeEconomyInfo(key){
 const item=upgradeDefs[key];
 if(!item)return 'Неизвестное улучшение';
 if(!upgradeIsUnlocked(key))return 'Откроется в сезоне «'+UPGRADE_SEASON_LABELS[item.unlockSeason]+'» (день '+(item.unlockSeason*7+1)+')';
 if(state.money<upgradeRequiredCash(key))return 'Для покупки и резерва на цветы нужно ещё '+(upgradeRequiredCash(key)-state.money)+' '+coinWord(upgradeRequiredCash(key)-state.money);
 return 'Можно купить и сохранить '+upgradeReserve()+' '+coinWord(upgradeReserve())+' на закупку цветов';
}
const col={kraft:'#d4a994',linen:'#e7d6bc',velvet:'#a46e7a',signature:'#8ea2c8'};
const state={da
\n### function ftzQueueSave( count 1
\nLINE 2 ey=>{const el=$(key);if(el)extras[key]=el.value;});
 return extras;
}
function ftzQueueSave(){
 if(ftzSuppressSave||!state.started)return;
 if(ftzSaveTimer)clearTimeout(ftzSaveTimer);
 ftzSaveTimer=setTimeout(ftzSaveNow,180);
}
function ftzSaveNow(){
 if(ftzSaveTimer){clearTimeout(ftzSaveTimer);ftzSaveTimer=null;}
 if(ftzSuppressSave||!state.started)return;
 try{
  // Snapshot markup contains inline artwork and could exceed the browser quota.
  const compactHistory=state.history.map(h=>{
   const {bouquetMarkup,...small}=h;return small;
  });
  const compactState={...state,history:compactHistory,snapshotBouquetMarkup:''};
  const payload={version:FTZ_SAVE_VERSION,at:Date.now(),state:compactState,
    flowStep,flowMax,extras:ftzStoredExtras()};
  localStorage.setItem(FTZ_SAVE_KEY,JSON.stringify(payload));
  ftzSaveBlocked=false;
  const indicator=document.getElementById('ftzSaveNotice');
  if(indicator)indicator.textContent='✓ Прогресс сохраняется автоматически';
 }catch(err){
  ftzSaveBlocked=true;
  const indicator=document.getElementById('ftzSaveNotice');
  if(indicator)indicator.textContent='Не удалось сохранить прогресс в этом браузере';
  console.warn('Флорист Танзания: сохранение недоступно',err);
 }
}
function ftzLoadProgress(){
 let p;
 try{p=JSON.parse(localStorage.getItem(FTZ_SAVE_KEY)||'null');}
 catch(e){ftzSaveBlocked=true;return false;}
 if(!p||p.version!==FTZ_SAVE_VERSION||!p.state||!p.state.started)return false;
 if(!Number.isInteger(p.state.day)||p.state.day<0||p.state.day>=CAMPAIGN_DAYS)return false;
 if(!Array.isArray(p.state.history)||p.state.history.length>CAMPAIGN_DAYS)return false;
 try{
  // Unknown data properties cannot override code or any of the game's functions.
  for(const key of Object.keys(state)){
   if(key in p.state&&key!=='snapshotBouquetMarkup')state[key]=p.state[key];
  }
  state.snapshotBouquetMarkup='';
  flowStep=Math.max(0,Math.min(2,Number(p.flowStep)||0));
  flowMax=Math.max(flowStep,Math.max(0,Math.min(2,Number(p.flowMax)||0)));
  ftzRestorePayload=p;
  return true;
 }catch(e){console.warn('Некорректное сохранение',e);return false;}
}
function ftzRestoreExtras(extras){
 if(!extras)return;
 for(const key of FTZ_SAVE_EXTRAS){
  const el=$(key),value=extras[key];
  if(!el)continue;
  if(typeof value!=='string'){if(key==='decor2'||key==='decor3')el.value='none';continue;}
  if(Array.from(el.options).some(o=>o.value===value))el.value=value;
  else if(key==='decor'||key==='decor2'||key==='decor3')el.value='none';
 }
 syncExtras();
}
function ftzRebuildBouquet(spec){
 if(!spec||!Array.is
\n### function chosen count 0
\n### function flowerSvg( count 0
\n### function flowerHead( count 0
\n### function renderFlower count 0
\n### function submit count 0
\n### function handoff count 0
\n### function complete count 0
\n### function serve count 0
\n### function endDay( count 0