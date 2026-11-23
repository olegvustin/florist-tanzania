# Forecast source review

## function renderForecast() count=1
POSITION 16462471
вства","hint":"Спрос на нежность без лишней драматичности.","tags":[]},{"weather":"🍂 Мягкое солнце","event":"Праздник урожая","signal":"Благодарность и забота","hint":"Тёплые композиции и естественная зелень сегодня особенно актуальны.","tags":[]}];
function renderForecast(){const box=$('cityForecast');if(!box)return; const f=cityForecasts[state.day]; box.innerHTML=`<div class="forecast-title"><h3>Утренний прогноз спроса в Танзании</h3><span class="forecast-signal">День ${state.day+1} · ${currentSeason().name}</span></div><div class="forecast-cards"><div class="forecast-card"><div class="symbol">${floristUiIcon('weather')}</div><b>Погода</b><p>${f.weather}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('event')}</div><b>Событие в городе</b><p>${f.event}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('demand')}</div><b>Ожидаемый спрос</b><p>${f.signal}. ${f.hint}</p></div>${seasonRewardMarketHtml()}${seasonIndex()<2?`<p class="season-goal-hint">${floristUiIcon('target')} <b>Цель сезона:</b> ${seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':'средняя оценка от 65% — +5 к репутации в сезон урожая; от 80% — +10.'} Сейчас: ${seasonResults(seasonIndex()).rows.length?seasonResults(seasonIndex()).avg+'%':'ещё нет оценок'}.</p>`:''}<p class="forecast-disclaimer">Прогноз — ориентир. Краткая заявка известна до закупки, полная история клиента — на этапе создания букета. Вернуться на рынок сегодня нельзя.</p>`;}
const flowSteps=[
 {name:'1. Закупка цветов',short:'Рынок'},
 {name:'2. Создание букета',short:'Букет'},
 {name:'3. Вручение и результаты',short:'Итог'}
];
let flowStep=0;
let flowMax=0;

/* v0.15.136 · Compact automatic local save / resume.
   Images and HTML bouquet snapshots are NOT stored: the saved flower recipes
   reconstruct portraits/bouquets from artwork built into this HTML. */
const FTZ_SAVE_KEY='ftz-tanzania-save-v1';
const FTZ_SAVE_VERSION=1;
const FTZ_SAVE_EXTRAS=['wrap','note','greenery','decor','decor2','decor3','plushGift','arrangementType','basketPalette'];
let ftzRestorePayload=null;
let ftzSaveTimer=null;
let ftzSaveBlocked=false;
let ftzSuppressSave=false;
function ftzCaptureBouquetSpec(){
 const extras={};
 FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);extras[key]=el?el.value:undefined;});
 return {chosen:state.chosen.slice(),positions:state.positions.map(p=>p?{...p}:null),accessoryPositions:JSON.parse(JSON.stringify(state.accessoryPositions||{})),extras};
}
function ftzStoredExtras(){
 const extras={};
 FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);if(el)extras[key]=el.value;});
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
  state.accessoryPositions=originalAccessories;
  ftzRestoreExtras(originalExtras);
  if(temporaryHistoryOption)temporaryHistoryOption.remove();
 }
 return markup;
}
function ftzRestoreResultPanel(){
 const h=state.history[state.history.length-1],box=$('feedback');
 if(!h||!box)return;
 const c=typeof current==='function'?current():null;
 const n=Number(h.repDelta)||0;
 box.innerHTML=`<section class="delivery-result-screen ftz-restored-result">
  <div class="delivery-score-wrap">
   <h2>Букет для ${h.name} вручён!</h2>
   <p>${h.reaction||'Спасибо за вашу цветочную историю!'}</p>
   ${h.bouquetMarkup?`<div class="ftz-restored-bouquet"><div class="bouquet snapshot-bouquet">${h.bouquetMarkup}</div></div>`:''}
   <div class="results"><span>Совпадение: <b>${h.score}%</b></span><span>Доход: <b>+${h.payment} монет</b></span><span>Прибыль: <b>${h.profit} монет</b></span><span>Репутация: <b>${n>=0?'+':''}${n}</b></span></div>
   <div class="delivery-continue"><p>Прогресс восстановлен. Можешь продолжить с того же места.</p>
   <button type="button" class="primary" onclick="next()">${state.day%7===6?'Итоги сезона →':'Следующий посетитель →'}</button></div>
  </div></section>`;
 box.classList.remove('hidden');
}
function ftzRestoreVisibleGame(){
 if(!ftzRestorePayload)return;
 for(const h of state.history){if(h.bouquetSpec)h.bouquetMarkup=ftzRebuildBouquet(h.bouquetSpec);}
 const last=state.history[state.history.length-1];
 if(state.last&&last)state.snapshotBouquetMarkup=last.bouquetMarkup||'';
 ftzRestoreExtras(ftzRestorePayload.extras);
 if(state.finished){end();return;}
 render();
 if(state.seasonReportVisible){showSeasonReport(true);}
 else if(state.last){flowDelivered();ftzRestoreResultPanel();}
 else{renderFlow();if(state.day>0)showEcho();}
}
function ftzStartNewGame(complete=false){
 if(!complete&&!window.confirm('Начать новую игру? Предыдущее сохранение будет удалено.'))return;
 ftzSuppressSave=true;
 if(ftzSaveTimer)clearTimeout(ftzSaveTimer);
 try{localStorage.removeItem(FTZ_SAVE_KEY);}catch(e){}
 window.location.reload();
}
function ftzShowSavedStart(){
 if(!ftzRestorePayload)return;
 const btn=document.querySelector('#startScreen .tz-reboot-play');
 if(!btn)return;
 btn.textContent=state.finished?'Посмотреть результаты':'Продолжить игру';
 const holder=document.querySelector('#startScreen .tz-reboot-buttons');
 if(holder&&!document.getElementById('ftzNewGameButton')){
  const newBtn=document.createElement('button');
  newBtn.id='ftzNewGameButton';newBtn.type='button';newBtn.className='tz-reboot-newgame';
  newBtn.textContent='Новая игра';newBtn.onclick=()=>ftzStartNewGame(false);
  holder.insertBefore(newBtn,holder.querySelector('.tz-reboot-help'));
 }
 const invite=document.getElementById('tzRebootInvite');
 if(invite&&!document.getElementById('ftzSaveNotice')){
  const p=document.createElement('p');p.id='ftzSaveNotice';p.className='ftz-save-notice';
  p.textContent=`✓ Сохранено: день ${state.day+1} из ${CAMPAIGN_DAYS} · ${state.money} монет`;
  holder.insertAdjacentElement('afterend',p);
 }
}
// Interaction handlers update the state synchronously; postpone the save until
// after the click/change has been processed (and catch accidental tab close).
document.addEventListener('click',ftzQueueSave,{passive:true});
document.addEventListener('change',ftzQueueSave,{passive:true});
document.addEventListener('pointerup',ftzQueueSave,{passive:true});
window.addEventListener('pagehide',ftzSaveNow);
document.addEventListener('visibilitychange',()=>{if(document.hidden)ftzSaveNow();});

function scrollToStageTop(){
 // New steps always open from the top, including on phones.
 window.scrollTo(0,0);
 if(document.scrollingElement)document.scrollingElement.scrollTop=0;
}

/* v0.15.136: the real flower selector belongs immediately below the live basket on phones. */
function ftzSyncMobileFlowerPalette(){
 const flowers=document.getElementById('flowers');
 const basket=document.getElementById('bouquet');
 if(!flowers||!basket)return;
 const palette=flowers.closest('section.panel');
 const composer=basket.closest('section.panel');
 const client=document.getElementById('customerName')?.closest('section.panel');
 if(!palette||!composer||!client)return;
 const mobile=window.matchMedia('(max-width: 760px)').matches;
 if(mobile){
  const preview=composer.querySelector('.previewnote')||composer.querySelector('.assembly');
  if(preview && (palette.parentElement!==composer||preview.nextElementSibling!==palette))preview.after(palette);
  palette.classList.add('ftz-inline-basket-palette');
  const h=palette.querySelector('.titleline h3'); if(h)h.textContent=ftzIsBasket()?'Выберите цветы для корзины':'Выберите цветы для букета';
  const hint=palette.querySelector('.titleline small');if(hint)hint.innerHTML='Нажимайте на цветы ниже — они сразу появятся в композиции · до <b id="bouquetCapacityHint">'+maxFlowers()+'</b>';
 } else {
  if(palette.parentElement!==client.parentElement||client.nextElementSi

## const cityForecasts= count=1
POSITION 16459108
c" aria-label="Миниатюра букета дня ${h.day}">${bouquetSnapshotThumb(h.bouquetMarkup,'small')}<span>Букет дня</span></div>`:''}
  </div>`).join(''):'<p class="subtitle" style="margin-top:25px">Здесь появятся истории после первого букета.</p>';
 }
}

const cityForecasts=[{"weather":"🌤️ Солнечное утро","event":"Рынок ремёсел масаев","signal":"Тёплые семейные встречи","hint":"Гости ищут душевные композиции без излишней театральности.","tags":[]},{"weather":"🌥️ Облачно","event":"Вечер на набережной","signal":"Тихие признания","hint":"Нежные букеты и искренние детали сегодня особенно к месту.","tags":[]},{"weather":"🌦️ После дождя","event":"Открытие новой кофейни","signal":"Поддержка мечты","hint":"Спрос смещается к радостным композициям с ноткой надежды.","tags":[]},{"weather":"🌧️ Дождь","event":"День заботы о близких","signal":"Тихая поддержка","hint":"Лучше работают сдержанные и спокойные букеты.","tags":[]},{"weather":"🌥️ Пасмурно","event":"Семейный день","signal":"Искренние жесты","hint":"Покупатели ищут цветы, которые помогут выразить важные слова.","tags":[]},{"weather":"☀️ Солнце","event":"Праздник достижений","signal":"Большие победы","hint":"Яркие цветы и торжественные детали особенно уместны.","tags":[]},{"weather":"🌅 Тёплый вечер","event":"Вечер для себя","signal":"Маленькие радости","hint":"Любят мягкие оттенки и лаконичную упаковку.","tags":[]},{"weather":"🌞 Солнечное утро","event":"Свадебный ужин","signal":"Радостные встречи","hint":"Праздничные композиции сегодня в цене.","tags":[]},{"weather":"☀️ Яркое солнце","event":"Музыкальная сцена","signal":"Гордость и аплодисменты","hint":"Солнечные цветы могут стать отличным выбором.","tags":[]},{"weather":"🌦️ Небольшой дождь","event":"День благодарности","signal":"Тёплая забота","hint":"Покупатели ищут сдержанные букеты с ощущением внимания.","tags":[]},{"weather":"🌞 Жарко","event":"Возвращение путешественников","signal":"Встречи после разлуки","hint":"Смелые композиции для радостных встреч будут особенно востребованы.","tags":[]},{"weather":"🌤️ Лёгкий ветер","event":"Ужин соседей","signal":"Дружеские встречи","hint":"Простые живые цветы могут оказаться лучшим решением.","tags":[]},{"weather":"🌇 Закат","event":"Вечер годовщин","signal":"Глубокие чувства","hint":"Спрос на тёплые и личные букеты остаётся высоким.","tags":[]},{"weather":"🌦️ Тёплый дождь","event":"Вечер наставников","signal":"Спасибо учителям","hint":"В моде искренние и не слишком вычурные композиции.","tags":[]},{"weather":"🍁 Золотой закат саванны","event":"Праздник семейных традиций","signal":"Долгая любовь","hint":"Тёплые благородные оттенки помогут выразить верность и заботу.","tags":[]},{"weather":"🌧️ Дождь на побережье","event":"Неделя чтения","signal":"Тихая благодарность","hint":"Сегодня ценят спокойные, не слишком пышные букеты.","tags":[]},{"weather":"🍂 Тёплое солнце","event":"Ночь галерей","signal":"Творческие открытия","hint":"Смелые акценты и яркий декор пригодятся как никогда.","tags":[]},{"weather":"🌫️ Туман","event":"Встреча выпускников","signal":"Старые друзья","hint":"Честные и сдержанные букеты особенно уместны.","tags":[]},{"weather":"🍁 Золотые травы саванны","event":"День новых дорог","signal":"Прощания с надеждой","hint":"Востребованы подарки на удачу и новые начинания.","tags":[]},{"weather":"🌧️ Тихий дождь","event":"Вечер искренних признаний","signal":"Давние чувства","hint":"Спрос на нежность без лишней драматичности.","tags":[]},{"weather":"🍂 Мягкое солнце","event":"Праздник урожая","signal":"Благодарность и забота","hint":"Тёплые композиции и естественная зелень сегодня особенно актуальны.","tags":[]}];
function renderForecast(){const box=$('cityForecast');if(!box)return; const f=cityForecasts[state.day]; box.innerHTML=`<div class="forecast-title"><h3>Утренний прогноз спроса в Танзании</h3><span class="forecast-signal">День ${state.day+1} · ${currentSeason().name}</span></div><div class="forecast-cards"><div class="forecast-card"><div class="symbol">${floristUiIcon('weather')}</div><b>Погода</b><p>${f.weather}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('event')}</div><b>Событие в городе</b><p>${f.event}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('demand')}</div><b>Ожидаемый спрос</b><p>${f.signal}. ${f.hint}</p></div>${seasonRewardMarketHtml()}${seasonIndex()<2?`<p class="season-goal-hint">${floristUiIcon('target')} <b>Цель сезона:</b> ${seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':'средняя оценка от 65% — +5 к репутации в сезон урожая; от 80% — +10.'} Сейчас: ${seasonResults(seasonIndex()).rows.length?seasonResults(seasonIndex()).avg+'%':'ещё нет оценок'}.</p>`:''}<p class="forecast-disclaimer">Прогноз — ориентир. Краткая заявка известна до закупки, полная история клиента — на этапе создания букета. Вернуться на рынок сегодня нельзя.</p>`;}
const flowSteps=[
 {name:'1. Закупка цветов',short:'Рынок'},
 {name:'2. Создание букета',short:'Букет'},
 {name:'3. Вручение и результаты',short:'Итог'}
];
let flowStep=0;
let flowMax=0;

/* v0.15.136 · Compact automatic local save / resume.
   Images and HTML bouquet snapshots are NOT stored: the saved flower recipes
   reconstruct portraits/bouquets from artwork built into this HTML. */
const FTZ_SAVE_KEY='ftz-tanzania-save-v1';
const FTZ_SAVE_VERSION=1;
const FTZ_SAVE_EXTRAS=['wrap','note','greenery','decor','decor2','decor3','plushGift','arrangementType','basketPalette'];
let ftzRestorePayload=null;
let ftzSaveTimer=null;
let ftzSaveBlocked=false;
let ftzSuppressSave=false;
function ftzCaptureBouquetSpec(){
 const extras={};
 FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);extras[key]=el?el.value:undefined;});
 return {chosen:state.chosen.slice(),positions:state.positions.map(p=>p?{...p}:null),accessoryPositions:JSON.parse(JSON.stringify(state.accessoryPositions||{})),extras};
}
function ftzStoredExtras(){
 const extras={};
 FTZ_SAVE_EXTRAS.forEach(key=>{const el=$(key);if(el)extras[key]=el.value;});
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
  state.accessoryPositions=originalAccessories;
  ftzRestoreExtras(originalExtras);
  if(temporaryHistoryOption)temporaryHistoryOption.remove();
 }
 return markup;
}
function ftzRestoreResultPanel(){
 const h=state.history[state.history.length-1],box=$('feedback');
 if(!h||!box)return;
 const c=typeof current==='function'?current():null;
 const n=Number(h.repDelta)||0;
 box.innerHTML=`<section class="delivery-result-screen ftz-restored-result">
  <div class="delivery-score-wrap">
   <h2>Букет для ${h.name} вручён!</h2>
   <p>${h.reaction||'Спасибо за вашу цветочную историю!'}</p>
   ${h.bouquetMarkup?`<div class="ftz-restored-bouquet"><div class="bouquet snapshot-bouquet">${h.bouquetMarkup}</div></div>`:''}
   <div class="results"><span>Совпадение: <b>${h.score}%</b></span><span>Доход: <b>+${h.payment} монет</b></span><span>Прибыль: <b>${h.profit} монет</b></span><span>Репутация: <b>${n>=0?'+':''}${n}</b></span></div>
   <div class="delivery-continue"><p>Прогресс восстановлен. Можешь продолжить с того же места.</p>
   <button type="button" class="primary" onclick="next()">${state.day%7===6?'Итоги сезона →':'Следующий посетитель →'}</button></div>
  </div></section>`;
 box.classList.remove('hidden');
}
function ftzRestoreVisibleGame(){
 if(!ftzRestorePayload)return;
 for(const h of state.history){if(h.bouquetSpec)h.bouquetMarkup=ftzRebuildBouquet(h.bouquetSpec);}
 const last=state.history[state.history.length-1];
 if(state.last&&last)state.snapshotBouquetMarkup=last.bouquetMarkup||'';
 ftzRestoreExtras(ftzRestorePayload.extras);
 if(state.finished){end();return;}
 rende

## function generateDeals( count=1
POSITION 12364371
value==='none'||FTZ_ACTIVE_DECOR_IDS.has(opt.value))&&(!meta.season||meta.season===seasonKey)&&(!meta.vip||!!current().vip);
   opt.hidden=!active;
   opt.disabled=!active;
   if(opt.value===select.value && !active) select.value='none';
  });
 });
}
function generateDeals(){const season=currentSeason(); types.forEach(t=>{let mult=0.88+Math.random()*0.24; if(season.featured.includes(t.id))mult-=0.13; if(season.pricey.includes(t.id))mult+=0.18; if(state.upgrades.assistant)mult-=0.05; state.availability[t.id]=!season.unavailable.includes(t.id); state.deals[t.id]=Math.max(1,Math.round(t.buy*mult));}); state.assortment=Object.values(state.availability).filter(Boolean).length;}
function buyStem(id,qty){
 if(state.last||(typeof flowMax!=='undefined'&&flowMax>=1)||!Number.isInteger(qty)||qty<1)return;
 const flower=types.find(t=>t.id===id);
 if(!flower||flower.plantationOnly||!state.availability[id]){marketMessage('Сегодня этот цветок на рынке недоступен.');return;}
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
  marketMessage('Нельзя добавить '+flower.name+': бюджет клиента '+budgetLimit()+' монет. Осталось '+Math.max(0,budgetLimit()-price())+' '+coinWordCount(Math.max(0,budgetLimit()-price()))+'.');
  return;
}
state.chosen.push(id); state.positions.push(null); state.harmonyVariant=-1; tzNewBloomIndex=state.chosen.length-1; render();}
function remove(id){if(state.last)return; const i=state.chosen.lastIndexOf(id); if(i>=0){state.chosen.splice(i,1);state.positions.splice(i,1);state.harmonyVariant=-1;} render();}
function clearBouquet(){if(state.last)return; state.chosen=[]; state.positions=[]; state.accessoryPositions={basket:{},bouquet:{}}; state.harmonyVariant=-1; render();}
/* v0.15.171 — three cyclic florist arrangements, never altering inventory or price.
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
 const next=(i+1)%3;
 button.textContent=i<0?'✿ Собрать гармонично':`✿ Собрать гармонично · ${i+1}/3`;
 button.title=`Следующий вариант ${next+1}/3 — ${FTZ_HARMONY_NAMES[next]}`;
 button.setAttribute('aria-label',`Собрать гармонично. Следующий вариант: ${next+1} из 3, ${FTZ_HARMONY_NAMES[next]}`);
 button.disabled=!state.chosen.length||!!state.last||!!state.finished;
 const status=document.getElementById('ftzHarmonyStatus');
 if(status)status.textContent=i<0?'Три варианта: классика, диагональ, каскад':`Вариант ${i+1}/3 — ${FTZ_HARMONY_NAMES[i]}`;
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

const bouquetHeadImages={"calla":"[IMAGE]

## function currentBuyPrice( count=1
POSITION 11235659
urn Object.values(state.stock).reduce((a,b)=>a+b,0);}
function stockCount(id){return state.stock[id]||0;}
function reservedCount(id){return state.chosen.filter(x=>x===id).length;}
function availableCount(id){return stockCount(id)-reservedCount(id);}
function currentBuyPrice(id){const base=state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base);}
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
 return 

## function ftzRemainingDays( count=1
POSITION 11228233
a:4,carnation:3,ranunc:4,watsonia:2
};
function ftzBaseLife(id){return FTZ_FLOWER_BASE_LIFE[id]||3;}
function ftzShopLifeBonus(){return shopLevel().id==='shop'?0:1;}
function ftzLifeBonus(){return Number(!!state.upgrades.fridge)+ftzShopLifeBonus();}
function ftzRemainingDays(lot,id,onDay=state.day){
 return Math.max(0,ftzBaseLife(id)+ftzLifeBonus()-(onDay-lot.boughtDay));
}
function ftzDayWord(n){const v=Math.abs(n)%100,d=v%10;return n+' '+(v>=11&&v<=14?'дней':d===1?'день':d>=2&&d<=4?'дня':'дней');}
function ftzFlowerWord(n){const v=Math.abs(n)%100,d=v%10;return n+' '+(v>=11&&v<=14?'цветов':d===1?'цветок':d>=2&&d<=4?'цветка':'цветов');}
function ftzEnsureFlowerLots(){
 if(!state.stock||typeof state.stock!=='object')state.stock={};
 if(!state.stockCosts||typeof state.stockCosts!=='object')state.stockCosts={};
 if(!state.flowerLots||typeof state.flowerLots!=='object')state.flowerLots={};
 if(!Array.isArray(state.spoilageLog))state.spoilageLog=[];
 if(!state.lastSpoilage||typeof state.lastSpoilage!=='object')state.lastSpoilage=null;
 types.forEach(t=>{
  const id=t.id;
  const count=Math.max(0,Math.min(9999,Math.floor(Number(state.stock[id])||0)));
  const previous=Array.isArray(state.stockCosts[id])?state.stockCosts[id]:[];
  let lots=state.flowerLots[id];
  const valid=Array.isArray(lots)&&lots.length===count&&lots.every(v=>v&&Number.isInteger(v.boughtDay)&&v.boughtDay>=0&&v.boughtDay<=state.day&&Number.isFinite(v.cost)&&v.cost>=0);
  if(!valid){
   // A legacy save has quantities and purchase costs but no age. Avoid an unfair
   // instant loss: existing flowers begin their new freshness cycle on migration.
   lots=Array.from({length:count},(_,i)=>({boughtDay:state.day,cost:Number.isFinite(Number(previous[i]))?Math.max(0,Number(previous[i])):t.bu

## function stockCount( count=1
POSITION 11235463
(x.name)} × ${x.count}`).join(', ')}</span></div>`).join(''):'<p>Потерь от увядания пока не было.</p>';
 }
}

function maxFlowers(){return state.upgrades.assistant?10:8;}
function totalStock(){return Object.values(state.stock).reduce((a,b)=>a+b,0);}
function stockCount(id){return state.stock[id]||0;}
function reservedCount(id){return state.chosen.filter(x=>x===id).length;}
function availableCount(id){return stockCount(id)-reservedCount(id);}
function currentBuyPrice(id){const base=state.deals[id]||types.find(t=>t.id===id).buy;return Math.max(1,base);}
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
  return `<div class="season-reward-banner"><span aria-hidden="true">${floristUiIcon('medal')}</span><div><b>Награда сезона со

## function renderMarket() count=1
POSITION 14058458
aper-selected-green${testPack?' ftz-paper-green-tidy':''}" aria-hidden="true" data-greenery="${greenType}">${greenerySvgMarkup(greenType,false)}</div>`:'';
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

## forecast-impact count=6
POSITION 761238
t, client card, upgrades and seasonal screens. */
.content .hint,
.content .flowtip,
.content .previewnote,
.content .mini,
.content .note,
.content .subtitle,
.content .marketnote,
.content .forecast-disclaimer,
.content .forecast-copy p,
.content .forecast-impact,
.content .forecast-card p,
.content .client-mini-hint,
.content .client-mini-summary,
.content .season-goal-hint,
.content .season-reward-banner p,
.content .marketitem .seasonhint,
.content .marketitem .stockline,
.content .flower .trait,
.content .upgradecard p,
.content .upgradecard .mini,
.content .shop-unlock-copy span,
.content .upgrade-card-benefit span,
.content .upgrade-empty,
.content .quality-award small,
.content .quality-tracker-header small,
.content .quality-tracker-line,
.content .sr-accounting,
.content .sr-details p,
.content .sr-next p,
.content .sr-best small,
.content .sr-reward small,
.content .sr-reward p,
.content .preview-name,
.content .label-head,
.content .controls label,
.content .titleline small,
.content .budget-insights p,
.content .budget-insights-grid span,
.content .client-special-wish small,
.content .client-special-wish .special-wish-top span,
.content .results .mini,
.content .bouquet-gallery p,
.content .hint small {
  color: var(--tz-readable-hint) !important;
  text-shadow: none !important;
}
/* Several items had 10-11px light gray descriptions. Use legible body sizes. */
.content .hint,
.content .previewnote,
.content .note,
.content .mini,
.content .forecast-disclaimer,
.content .marketitem .seasonhint,
.content .upgradecard .mini,
.content .client-mini-hint,
.content .client-mini-summary,
.content .quality-award small,
.content .preview-name,
.content .label-head,
.content .controls label,
.content .titleline small {
  font-size: 
POSITION 16489081
08);
  border:1px solid #e6eadf;
}
.forecast-art svg{width:66px;height:66px;display:block}
.forecast-copy b{display:block;font-size:14px;margin-bottom:6px;color:#2e4a37}
.forecast-copy p{font-size:13px;color:#617669;line-height:1.55;margin:0 0 8px}
.forecast-impact{font-size:12px;line-height:1.45;color:#7d5f51;background:#fbf4ee;border:1px solid #f0e1d3;padding:7px 9px;border-radius:12px}
.forecast-impact strong{color:#6d4f42}
@media(max-width:760px){
  .forecast-card{grid-template-columns:72px 1fr;min-height:auto;padding:14px}
  .forecast-art{width:62px;height:62px;border-radius:18px}
  .forecast-art svg{width:54px;height:54px}
}

/* Africa theme v0.14.0 */
body{background:linear-gradient(180deg,#f5e8c9 0%,#f0dfb8 42%,#ead4a0 100%)}
.top,.panel,.soft,.shop-scene,.bouquet-gallery-item,.journal-item{box-shadow:0 14px 32px rgba(88,57,28,.09)}
button,.tinybtn,.secondary{border-radius:16px}
button{background:#264653;color:#fff8e8} button:hover{filter:brightness(1.03)}
.secondary{background:#f2e7ce;color:#264653;border-color:#d8bf92}
.tag,.vipchip,.rarity.rare{background:#264653;color:#fff3d6;border-color:#264653}
.marketitem,.upgradecard,.flower{background:#fff9ee;border-color:#ead7b4}
.marketitem:hover,.flower:hover,.upgradecard:hover{border-color:#d59a42;box-shadow:0 8px 18px rgba(172,116,41,.14)}
.hero-highlights .chip,.chip{background:#f2e7ce;color:#6e4928;border:1px solid #e0c286}
.titleline h3,.shop-level-label,h1,h2,h3{color:#264653}
.quote{border-left:4px solid #d68f3d;background:#fff6e7}
.shop-visual{background:linear-gradient(180deg,#f7dfb4 0%,#f2ca84 58%,#d5ab6b 58%,#c39157 100%);border-color:#c79357}
.shop-visual.is-salon{background:linear-gradient(180deg,#f6e2bd 0%,#edc77f 58%,#cb9b62 58%,#b7834f 100%);border-color:#b6834d}
.s
POSITION 16489224
-bottom:6px;color:#2e4a37}
.forecast-copy p{font-size:13px;color:#617669;line-height:1.55;margin:0 0 8px}
.forecast-impact{font-size:12px;line-height:1.45;color:#7d5f51;background:#fbf4ee;border:1px solid #f0e1d3;padding:7px 9px;border-radius:12px}
.forecast-impact strong{color:#6d4f42}
@media(max-width:760px){
  .forecast-card{grid-template-columns:72px 1fr;min-height:auto;padding:14px}
  .forecast-art{width:62px;height:62px;border-radius:18px}
  .forecast-art svg{width:54px;height:54px}
}

/* Africa theme v0.14.0 */
body{background:linear-gradient(180deg,#f5e8c9 0%,#f0dfb8 42%,#ead4a0 100%)}
.top,.panel,.soft,.shop-scene,.bouquet-gallery-item,.journal-item{box-shadow:0 14px 32px rgba(88,57,28,.09)}
button,.tinybtn,.secondary{border-radius:16px}
button{background:#264653;color:#fff8e8} button:hover{filter:brightness(1.03)}
.secondary{background:#f2e7ce;color:#264653;border-color:#d8bf92}
.tag,.vipchip,.rarity.rare{background:#264653;color:#fff3d6;border-color:#264653}
.marketitem,.upgradecard,.flower{background:#fff9ee;border-color:#ead7b4}
.marketitem:hover,.flower:hover,.upgradecard:hover{border-color:#d59a42;box-shadow:0 8px 18px rgba(172,116,41,.14)}
.hero-highlights .chip,.chip{background:#f2e7ce;color:#6e4928;border:1px solid #e0c286}
.titleline h3,.shop-level-label,h1,h2,h3{color:#264653}
.quote{border-left:4px solid #d68f3d;background:#fff6e7}
.shop-visual{background:linear-gradient(180deg,#f7dfb4 0%,#f2ca84 58%,#d5ab6b 58%,#c39157 100%);border-color:#c79357}
.shop-visual.is-salon{background:linear-gradient(180deg,#f6e2bd 0%,#edc77f 58%,#cb9b62 58%,#b7834f 100%);border-color:#b6834d}
.shop-visual.is-studio{background:linear-gradient(180deg,#fae8c7 0%,#efce8f 58%,#c7895e 58%,#aa6b42 100%);border-color:#a96c40}
.money-monitor,.b
POSITION 16500431
delta>0.01)return 'Риск увядания чуть выше.';
 if(delta<=-0.03)return 'Риск увядания ниже обычного.';
 if(delta<0)return 'Склад хранится немного легче.';
 return 'Риск увядания обычный.';
}
function forecastImpactHtml(text,extra){return `<div class="forecast-impact"><strong>Влияние:</strong> ${text}${extra?` <span>· ${extra}</span>`:''}</div>`;}
function forecastIcon(kind){
 if(kind==='weather') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="36" width="46" height="14" rx="7" fill="#C68D6D"/><rect x="18" y="20" width="28" height="18" rx="9" fill="#E9F4FA" stroke="#C6DDE7"/><circle cx="20" cy="17" r="7" fill="#F3D16B"/><path d="M22 40c2.2 0 4 1.8 4 4v6h-4v-6Zm9-2c2.2 0 4 1.8 4 4v8h-4v-8Zm9 1c2.2 0 4 1.8 4 4v7h-4v-7Z" fill="#7EC2C6"/><path d="M28 17c1.3-4 5-6.5 9-6.5 4.9 0 8.8 3.5 9.5 8.2 3.1.5 5.5 3.2 5.5 6.5 0 3.7-3 6.8-6.8 6.8H25.8c-4.3 0-7.8-3.5-7.8-7.8 0-4 3-7.2 6.9-7.7A9.9 9.9 0 0 1 28 17Z" fill="#FDFDFD" stroke="#D6E2EA"/></svg></div>`;
 if(kind==='event') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="40" width="46" height="12" rx="6" fill="#C8906A"/><rect x="14" y="17" width="36" height="25" rx="8" fill="#FFF9F0" stroke="#E4D6C9"/><path d="M18 24h28" stroke="#D7B095" stroke-width="2" stroke-linecap="round"/><path d="M18 30h18" stroke="#E1C7B5" stroke-width="2" stroke-linecap="round"/><rect x="37" y="27" width="9" height="7" rx="2" fill="#E2F0E6" stroke="#B6D0BF"/><path d="M18 13l5 5 5-5 5 5 5-5 5 5 5-5" stroke="#D89CB0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
 return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="54" rx=
POSITION 16522453
over,.marketitem:hover,.flower:hover,.upgradecard:hover{border-color:#c59649!important;
 box-shadow:0 13px 28px rgba(85,59,30,.13)!important}
.forecast-art{background:linear-gradient(160deg,#e6e9d9,#fff1d0)!important;border-color:#dcc8a2!important}
.forecast-impact,.season-goal-hint,.hint,.quote{background:#f8edd6!important;border-color:#e1cb9f!important;color:#6f5c43}
.quote{border-left:4px solid #c88d39!important}
.forecast-copy b,.quality-tracker-header strong{color:#244331}
.forecast-copy p,.forecast-impact,.upgradecard p{color:#736b5c}
button.primary,.stage-actions button.primary,.start-actions .primary{
 background:linear-gradient(125deg,#e7b85b,#c99232)!important;
 border:1px solid #b67d2e!important;color:#263a24!important;
 box-shadow:0 6px 15px rgba(157,102,32,.16)!important;
}
button.primary:hover,.start-actions .primary:hover{filter:brightness(1.07)}
button.secondary,.secondary,.tinybtn{background:#fbf1df!important;border-color:#d6b985!important;color:#27503b!important}
button.secondary:hover,.secondary:hover,.tinybtn:hover{background:#f3e1bc!important}
.daystep.active,.tab.active,.segmented.active{background:linear-gradient(115deg,#225a3c,#153e2c)!important;
 border-color:#285b3d!important;color:#fff4d7!important}
.daystep.done{background:#e4eddc!important;border-color:#abc38e!important;color:#244b32!important}
.flower.selected{background:linear-gradient(180deg,#f2f4dc,#e4edd8)!important;
 border:2px solid #71964f!important}
.marketmeta .metric strong,.shop-progress strong,.metric strong{color:#244d31!important}
.upgradecard .status.on{background:#e5ead5!important;color:#295034!important}
.upgradecard .status.off{background:#f5e5c7!important;color:#785a29!important}
.rarity.rare,.vipchip{background:#214834!important;color:#
POSITION 16522704
orecast-impact,.season-goal-hint,.hint,.quote{background:#f8edd6!important;border-color:#e1cb9f!important;color:#6f5c43}
.quote{border-left:4px solid #c88d39!important}
.forecast-copy b,.quality-tracker-header strong{color:#244331}
.forecast-copy p,.forecast-impact,.upgradecard p{color:#736b5c}
button.primary,.stage-actions button.primary,.start-actions .primary{
 background:linear-gradient(125deg,#e7b85b,#c99232)!important;
 border:1px solid #b67d2e!important;color:#263a24!important;
 box-shadow:0 6px 15px rgba(157,102,32,.16)!important;
}
button.primary:hover,.start-actions .primary:hover{filter:brightness(1.07)}
button.secondary,.secondary,.tinybtn{background:#fbf1df!important;border-color:#d6b985!important;color:#27503b!important}
button.secondary:hover,.secondary:hover,.tinybtn:hover{background:#f3e1bc!important}
.daystep.active,.tab.active,.segmented.active{background:linear-gradient(115deg,#225a3c,#153e2c)!important;
 border-color:#285b3d!important;color:#fff4d7!important}
.daystep.done{background:#e4eddc!important;border-color:#abc38e!important;color:#244b32!important}
.flower.selected{background:linear-gradient(180deg,#f2f4dc,#e4edd8)!important;
 border:2px solid #71964f!important}
.marketmeta .metric strong,.shop-progress strong,.metric strong{color:#244d31!important}
.upgradecard .status.on{background:#e5ead5!important;color:#295034!important}
.upgradecard .status.off{background:#f5e5c7!important;color:#785a29!important}
.rarity.rare,.vipchip{background:#214834!important;color:#fff5df!important}
.status{border-color:#dfc58f}
.start-screen,body.africa-safari .start-screen{background:radial-gradient(circle at 50% 35%,rgba(209,153,60,.31),transparent 54%),
 linear-gradient(135deg,#152f22ed,#6e4624ef)!important}
.start-card{back

## Влияние: count=1
POSITION 16500456
вядания чуть выше.';
 if(delta<=-0.03)return 'Риск увядания ниже обычного.';
 if(delta<0)return 'Склад хранится немного легче.';
 return 'Риск увядания обычный.';
}
function forecastImpactHtml(text,extra){return `<div class="forecast-impact"><strong>Влияние:</strong> ${text}${extra?` <span>· ${extra}</span>`:''}</div>`;}
function forecastIcon(kind){
 if(kind==='weather') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="36" width="46" height="14" rx="7" fill="#C68D6D"/><rect x="18" y="20" width="28" height="18" rx="9" fill="#E9F4FA" stroke="#C6DDE7"/><circle cx="20" cy="17" r="7" fill="#F3D16B"/><path d="M22 40c2.2 0 4 1.8 4 4v6h-4v-6Zm9-2c2.2 0 4 1.8 4 4v8h-4v-8Zm9 1c2.2 0 4 1.8 4 4v7h-4v-7Z" fill="#7EC2C6"/><path d="M28 17c1.3-4 5-6.5 9-6.5 4.9 0 8.8 3.5 9.5 8.2 3.1.5 5.5 3.2 5.5 6.5 0 3.7-3 6.8-6.8 6.8H25.8c-4.3 0-7.8-3.5-7.8-7.8 0-4 3-7.2 6.9-7.7A9.9 9.9 0 0 1 28 17Z" fill="#FDFDFD" stroke="#D6E2EA"/></svg></div>`;
 if(kind==='event') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="40" width="46" height="12" rx="6" fill="#C8906A"/><rect x="14" y="17" width="36" height="25" rx="8" fill="#FFF9F0" stroke="#E4D6C9"/><path d="M18 24h28" stroke="#D7B095" stroke-width="2" stroke-linecap="round"/><path d="M18 30h18" stroke="#E1C7B5" stroke-width="2" stroke-linecap="round"/><rect x="37" y="27" width="9" height="7" rx="2" fill="#E2F0E6" stroke="#B6D0BF"/><path d="M18 13l5 5 5-5 5 5 5-5 5 5 5-5" stroke="#D89CB0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
 return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="54" rx="18" ry="4" fill="

## Дешевле: count=0

## Сроки хранения count=0

## forecast-cards count=5
POSITION 48706
inear-gradient(130deg,#f3f8eb,#fff8ed);box-shadow:0 10px 28px #294a3510}.forecast-title{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.forecast-title h3{font:600 26px Georgia,serif;margin:0}.forecast-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 1
POSITION 49402
}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side .brand{font-size:20px;flex:1 1 100%;margin-bottom:3px}.side small,.side .bottom{display:none}.side button{flex:1 1 30%;justify-content:center;text-align:center;padding:12px 7px;font-size:12px}.content{padding:20px 16px 42px}.hero{margin-top:16px}.top h1{font-size:clamp(29px,6vw,45px)}.topright{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}.pill{min-width:0;padding:11px;font-size:11px}.pill b{font-size:16px}.marketmeta{grid-template-columns:repeat(2,minmax(0,1fr))}.marketgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.upgradegrid{grid-template-columns:repeat(2,minmax(0,1fr))}.da
POSITION 16462761
ityForecast');if(!box)return; const f=cityForecasts[state.day]; box.innerHTML=`<div class="forecast-title"><h3>Утренний прогноз спроса в Танзании</h3><span class="forecast-signal">День ${state.day+1} · ${currentSeason().name}</span></div><div class="forecast-cards"><div class="forecast-card"><div class="symbol">${floristUiIcon('weather')}</div><b>Погода</b><p>${f.weather}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('event')}</div><b>Событие в городе</b><p>${f.event}</p></div><div class="forecast-card"><div class="symbol">${floristUiIcon('demand')}</div><b>Ожидаемый спрос</b><p>${f.signal}. ${f.hint}</p></div>${seasonRewardMarketHtml()}${seasonIndex()<2?`<p class="season-goal-hint">${floristUiIcon('target')} <b>Цель сезона:</b> ${seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':'средняя оценка от 65% — +5 к репутации в сезон урожая; от 80% — +10.'} Сейчас: ${seasonResults(seasonIndex()).rows.length?seasonResults(seasonIndex()).avg+'%':'ещё нет оценок'}.</p>`:''}<p class="forecast-disclaimer">Прогноз — ориентир. Краткая заявка известна до закупки, полная история клиента — на этапе создания букета. Вернуться на рынок сегодня нельзя.</p>`;}
const flowSteps=[
 {name:'1. Закупка цветов',short:'Рынок'},
 {name:'2. Создание букета',short:'Букет'},
 {name:'3. Вручение и результаты',short:'Итог'}
];
let flowStep=0;
let flowMax=0;

/* v0.15.136 · Compact automatic local save / resume.
   Images and HTML bouquet snapshots are NOT stored: the saved flower recipes
   reconstruct portraits/bouquets from artwork built into this HTML. */
const FTZ_SAVE_KEY='ftz-tanzania-save-v1';
const FTZ_SAVE_VERSION=1;
const FTZ_SAVE_EXTRAS=['wrap','note','greene
POSITION 16488341
tons();
 }catch(err){
  // Playback can fail when interrupted by a user clicking "off" quickly.
  if(africaMusicStarting)africaMusicError(err);
 }finally{africaMusicStarting=false;}
}
document.body.classList.add('africa-safari');

</script>
<style>
.forecast-cards{align-items:stretch}
.forecast-card{
  position:relative;
  display:grid;
  grid-template-columns:88px 1fr;
  gap:14px;
  align-items:center;
  min-height:132px;
  background:linear-gradient(180deg,#fffdfa,#fffef9);
}
.forecast-card .symbol{margin:0}
.forecast-art{
  width:76px;height:76px;display:grid;place-items:center;
  border-radius:24px;
  background:linear-gradient(180deg,#f4f7ec,#fff4eb);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 10px 22px rgba(56,91,67,.08);
  border:1px solid #e6eadf;
}
.forecast-art svg{width:66px;height:66px;display:block}
.forecast-copy b{display:block;font-size:14px;margin-bottom:6px;color:#2e4a37}
.forecast-copy p{font-size:13px;color:#617669;line-height:1.55;margin:0 0 8px}
.forecast-impact{font-size:12px;line-height:1.45;color:#7d5f51;background:#fbf4ee;border:1px solid #f0e1d3;padding:7px 9px;border-radius:12px}
.forecast-impact strong{color:#6d4f42}
@media(max-width:760px){
  .forecast-card{grid-template-columns:72px 1fr;min-height:auto;padding:14px}
  .forecast-art{width:62px;height:62px;border-radius:18px}
  .forecast-art svg{width:54px;height:54px}
}

/* Africa theme v0.14.0 */
body{background:linear-gradient(180deg,#f5e8c9 0%,#f0dfb8 42%,#ead4a0 100%)}
.top,.panel,.soft,.shop-scene,.bouquet-gallery-item,.journal-item{box-shadow:0 14px 32px rgba(88,57,28,.09)}
button,.tinybtn,.secondary{border-radius:16px}
button{background:#264653;color:#fff8e8} button:hover{filter:brightness(1.03)}
.secondary{background:#f2e7ce;color:#264653;b
POSITION 16503005
 const rule=forecastRule();
 const daySignal=`День ${state.day+1} · ${currentSeason().name}`;
 box.innerHTML=`<div class="forecast-title"><h3>Утренний прогноз спроса в Танзании</h3><span class="forecast-signal">${daySignal}</span></div>
 <div class="forecast-cards">
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('weather')}</div><div class="forecast-copy"><b>Погода</b><p>${f.weather.replace(/^[^а-яёa-z]+/i,'').trim()}</p>${forecastImpactHtml(rule.weatherEffectText,`${describeMarketDelta(rule.marketDelta)} · сроки хранения зависят от вида цветка и оборудования`)}</div></div>
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('event')}</div><div class="forecast-copy"><b>Событие в городе</b><p>${f.event}</p>${forecastImpactHtml(rule.eventEffectText,rule.orderBudgetDelta>0?`бюджет некоторых заказов увеличен на ${rule.orderBudgetDelta} ${coinWord(rule.orderBudgetDelta)}`:'влияет на эмоциональный запрос клиента')}</div></div>
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('demand')}</div><div class="forecast-copy"><b>Ожидаемый спрос</b><p>${f.signal}. ${f.hint}</p>${forecastImpactHtml(rule.signalEffectText,`особенно важны чувства: ${uniqueKeepOrder([...(rule.eventBoostTags||[]),...(rule.signalBoostTags||[])]).map(tag=>({love:'любовь',sincere:'искренность',hope:'надежда',joy:'радость',care:'забота',calm:'спокойствие',passion:'страсть'}[tag]||tag)).join(', ')}`)}</div></div>
 </div>${seasonRewardMarketHtml()}${seasonIndex()<2?`<p class="season-goal-hint">${floristUiIcon('target')} <b>Цель сезона:</b> ${seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':

## forecast-card count=39
POSITION 48706
inear-gradient(130deg,#f3f8eb,#fff8ed);box-shadow:0 10px 28px #294a3510}.forecast-title{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.forecast-title h3{font:600 26px Georgia,serif;margin:0}.forecast-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 
POSITION 48790
tle{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.forecast-title h3{font:600 26px Georgia,serif;margin:0}.forecast-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side
POSITION 48881
argin-bottom:14px}.forecast-title h3{font:600 26px Georgia,serif;margin:0}.forecast-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side .brand{font-size:20px;flex:1 1 100%;margin-bottom:3px}.side small,.side .bottom{display:no
POSITION 48937
ia,serif;margin:0}.forecast-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side .brand{font-size:20px;flex:1 1 100%;margin-bottom:3px}.side small,.side .bottom{display:none}.side button{flex:1 1 30%;justify-content:center;text
POSITION 49001
umns:repeat(3,minmax(0,1fr));gap:12px}.forecast-card{padding:16px;background:#fffdfa;border:1px solid #e5ebdd;border-radius:16px}.forecast-card .symbol{font-size:27px;margin-bottom:8px}.forecast-card b{display:block;font-size:14px;margin-bottom:6px}.forecast-card p{font-size:12px;color:#64786c;line-height:1.6;margin:0}.forecast-disclaimer{font-size:12px;color:#718375;line-height:1.5;margin:14px 0 0}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side .brand{font-size:20px;flex:1 1 100%;margin-bottom:3px}.side small,.side .bottom{display:none}.side button{flex:1 1 30%;justify-content:center;text-align:center;padding:12px 7px;font-size:12px}.content{padding:2
POSITION 49402
}.forecast-signal{padding:8px 12px;border-radius:24px;background:#e5efdf;color:#365942;font-weight:750;font-size:11px}.forecast-lock{font-size:12px;color:#975e47;margin:12px 0 0}.daystep.locked{opacity:.45;cursor:not-allowed}@media(max-width:760px){.forecast-cards{grid-template-columns:1fr}}

/* Mobile layout refinements v0.7.3 */
html{overflow-x:clip}body{overflow-x:clip}.app,.content,.panel,.flowstage{min-width:0}.content{overflow-wrap:anywhere}.marketitem,.upgradecard,.metric,.flower{min-width:0}.marketitem strong,.upgradecard h4{overflow-wrap:break-word}
.dayflow{position:sticky;top:0;z-index:35;padding:9px 0;background:rgba(250,248,239,.98);backdrop-filter:blur(12px);border-bottom:1px solid #e7e9dd;scroll-margin-top:10px}
.daystep{font-size:12px;line-height:1.3;min-height:52px}.flowstage{scroll-margin-top:90px}
.bouquet{max-width:100%}.assembly{padding:8px;isolation:isolate}.blossom{touch-action:none}.flower,.tinybtn,.upgradecard button,.stage-actions button{touch-action:manipulation}
@media(max-width:980px){.app{display:block}.side{padding:14px 16px;display:flex;flex-direction:row;align-items:center;gap:8px;flex-wrap:wrap}.side .brand{font-size:20px;flex:1 1 100%;margin-bottom:3px}.side small,.side .bottom{display:none}.side button{flex:1 1 30%;justify-content:center;text-align:center;padding:12px 7px;font-size:12px}.content{padding:20px 16px 42px}.hero{margin-top:16px}.top h1{font-size:clamp(29px,6vw,45px)}.topright{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}.pill{min-width:0;padding:11px;font-size:11px}.pill b{font-size:16px}.marketmeta{grid-template-columns:repeat(2,minmax(0,1fr))}.marketgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.upgradegrid{grid-template-columns:repeat(2,minmax(0,1fr))}.d

## function renderFlow() count=1
POSITION 16481393
erFlow();marketMessage('Не хватает цветов для первого букета. Выбери позицию на рынке и нажми «Купить»; после этого можно завершить закупку.');scrollToStageTop();return;}
 flowStep=n;flowMax=Math.max(flowMax,n);
 renderFlow();
 scrollToStageTop();
}
function renderFlow(){
 const nav=$('dayflow');if(!nav)return;
 const hero=$('gameHero');if(hero)hero.classList.add('hidden');
 renderForecast();
 nav.innerHTML=flowSteps.map((x,i)=>`<button class="daystep ${i===flowStep?'active':i<flowStep?'done':''}" onclick="gotoStage(${i})" ${i>flowMax||state.last||(i===0&&flowMax>=1)?'disabled':''}>${x.name}</button>`).join('');
 const marketHint=$('marketMoneyMonitor'),bouquetHint=$('bouquetBudgetMonitor'),hintSlot=$('flowHintSlot');
 if(marketHint)marketHint.classList.toggle('hidden',flowStep!==0);
 if(bouquetHint)bouquetHint.classList.toggle('hidden',flowStep!==1);
 if(hintSlot)hintSlot.classList.toggle('hidden',flowStep===2||state.seasonReportVisible||state.finished);
 flowSteps.forEach((x,i)=>$('stage-'+i).classList.toggle('hidden',i!==flowStep));
 ftzSimplifyDelivery();
}
/* v0.15.202: focused screens, no economic-rule changes. */
function ftzRefreshWrapDisclosure(){
 const detail=$('ftzWrapDisclosure');if(!detail)return;
 const inBasket=ftzIsBasket();detail.hidden=inBasket;
 const item=FTZ_UNIQUE_WRAPS.find(x=>x.id===$('wrap')?.value);
 const label=$('ftzWrapSelectedName');if(label)label.textContent=item?.name||'Крафт';
}
function ftzRefreshOrderBrief(){
 const root=$('ftzOrderBrief');if(!root||typeof current!=='function')return;
 const order=current();
 const name=$('ftzBriefName'),occasion=$('ftzBriefOccasion'),budget=$('ftzBriefBudget');
 if(name)name.textContent='Клиент: '+order.name+(order.vip?' · VIP':'');
 if(occasion)occasion.textContent='Пово