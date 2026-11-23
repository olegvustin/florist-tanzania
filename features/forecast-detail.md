# Forecast details
tText:'Соседский фестиваль делает дружелюбные букеты особенно уместными.',signalEffectText:'Чем теплее и проще композиция, тем легче получить хороший отклик.'},
 {marketDelta:{rose:-1,peony:-1,white:-1},spoilageDelta:0.02,eventBoostTags:['love'],signalBoostTags:['care'],orderBudgetDelta:2,weatherEffectText:'К вечеру возрастает спрос на нежные сочетания.',eventEffectText:'Семейные истории усиливают ценность зрелых и душевных букетов.',signalEffectText:'Любовь и забота особенно важны в композициях для годовщин.'},
 {marketDelta:{hydra:-1,daisy:-1,lily:-1},spoilageDelta:-0.01,eventBoostTags:['sincere'],signalBoostTags:['care'],orderBudgetDelta:1,weatherEffectText:'Тёплый дождь сопровождается выгодными ценами на некоторые цветы.',eventEffectText:'Открытая сцена усиливает спрос на букеты благодарности и уважения.',signalEffectText:'Искренние и благодарные композиции легче достигают высокого балла.'},
 {marketDelta:{peony:-1,lily:-1,carnation:-1},spoilageDelta:-0.02,eventBoostTags:['care'],signalBoostTags:['love'],orderBudgetDelta:1,weatherEffectText:'Прохладный вечер располагает к спокойным, уютным букетам.',eventEffectText:'Семейные традиции повышают ценность тёплых и благородных букетов.',signalEffectText:'Глубокие чувства и семейное тепло заметно важнее обычного.'},
 {marketDelta:{lav:-1,white:-1,iris:-1},spoilageDelta:-0.04,eventBoostTags:['calm'],signalBoostTags:['sincere'],orderBudgetDelta:0,weatherEffectText:'Дождь на побережье задаёт спокойное настроение дня.',eventEffectText:'Книжная неделя поддерживает тихие, интеллигентные композиции.',signalEffectText:'Спокойствие и деликатность работают лучше пышности.'},
 {marketDelta:{iris:-1,lily:-1,ranunc:-1},spoilageDelta:-0.01,eventBoostTags:['hope'],signalBoostTags:['joy'],orderBudgetDelta:2,weatherEffectText:'Тёплое солнце благоприятно для сложных акцентных цветов.',eventEffectText:'Ночь галерей усиливает интерес к выразительным и художественным букетам.',signalEffectText:'Смелые акценты и творческое настроение дают больше очков.'},
 {marketDelta:{daisy:-1,carnation:-1,lav:-1},spoilageDelta:-0.03,eventBoostTags:['sincere'],signalBoostTags:['calm'],orderBudgetDelta:0,weatherEffectText:'Туман создаёт спокойную атмосферу дня.',eventEffectText:'Вечер выпускников повышает спрос на сдержанные букеты памяти и дружбы.',signalEffectText:'Честные и спокойные композиции оцениваются выше.'},
 {marketDelta:{tulip:-1,hydra:-1,sun:-1},spoilageDelta:-0.01,eventBoostTags:['hope'],signalBoostTags:['care'],orderBudgetDelta:1,weatherEffectText:'Золотистые травы саванны вдохновляют на букеты надежды и поддержки.',eventEffectText:'День первых шагов делает уместными подарки на удачу.',signalEffectText:'Надежда и забота влияют на итог сильнее обычного.'},
 {marketDelta:{rose:-1,white:-1,lav:-1},spoilageDelta:-0.03,eventBoostTags:['love'],signalBoostTags:['sincere'],orderBudgetDelta:1,weatherEffectText:'Тихий дождь подсказывает мягкие, деликатные сочетания.',eventEffectText:'Осенние признания повышают спрос на деликатную романтику.',signalEffectText:'Нежность и искренность становятся главными критериями отклика.'},
 {marketDelta:{sun:-1,carnation:-1,hydra:-1},spoilageDelta:-0.02,eventBoostTags:['care'],signalBoostTags:['joy'],orderBudgetDelta:1,weatherEffectText:'В мягкую погоду тёплые оттенки особенно востребованы.',eventEffectText:'Праздник урожая делает естественные и тёплые композиции особенно уместными.',signalEffectText:'Благодарность, забота и спокойная радость помогают получить высокую оценку.'}
];
function forecastRule(day=state.day){return FORECAST_RULES[day]||FORECAST_RULES[FORECAST_RULES.length-1];}
function uniqueKeepOrder(items){const seen=new Set();return items.filter(x=>x&&!seen.has(x)&&(seen.add(x),true));}
function flowerName(id){return (types.find(t=>t.id===id)||{}).name||id;}
function describeMarketDelta(map){
 const cheaper=Object.entries(map||{}).filter(([,v])=>v<0).map(([id])=>flowerName(id));
 const pricier=Object.entries(map||{}).filter(([,v])=>v>0).map(([id])=>flowerName(id));
 let parts=[];
 if(cheaper.length)parts.push('дешевле: '+cheaper.join(', '));
 if(pricier.length)parts.push('дороже: '+pricier.join(', '));
 return parts.length?parts.join(' · '):'цены близки к сезонной норме';
}
function forecastSpoilageNote(delta){
 if(delta>=0.05)return 'Риск увядания заметно выше.';
 if(delta>0.01)return 'Риск увядания чуть выше.';
 if(delta<=-0.03)return 'Риск увядания ниже обычного.';
 if(delta<0)return 'Склад хранится немного легче.';
 return 'Риск увядания обычный.';
}
function forecastImpactHtml(text,extra){return `<div class="forecast-impact"><strong>Влияние:</strong> ${text}${extra?` <span>· ${extra}</span>`:''}</div>`;}
function forecastIcon(kind){
 if(kind==='weather') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="36" width="46" height="14" rx="7" fill="#C68D6D"/><rect x="18" y="20" width="28" height="18" rx="9" fill="#E9F4FA" stroke="#C6DDE7"/><circle cx="20" cy="17" r="7" fill="#F3D16B"/><path d="M22 40c2.2 0 4 1.8 4 4v6h-4v-6Zm9-2c2.2 0 4 1.8 4 4v8h-4v-8Zm9 1c2.2 0 4 1.8 4 4v7h-4v-7Z" fill="#7EC2C6"/><path d="M28 17c1.3-4 5-6.5 9-6.5 4.9 0 8.8 3.5 9.5 8.2 3.1.5 5.5 3.2 5.5 6.5 0 3.7-3 6.8-6.8 6.8H25.8c-4.3 0-7.8-3.5-7.8-7.8 0-4 3-7.2 6.9-7.7A9.9 9.9 0 0 1 28 17Z" fill="#FDFDFD" stroke="#D6E2EA"/></svg></div>`;
 if(kind==='event') return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="40" width="46" height="12" rx="6" fill="#C8906A"/><rect x="14" y="17" width="36" height="25" rx="8" fill="#FFF9F0" stroke="#E4D6C9"/><path d="M18 24h28" stroke="#D7B095" stroke-width="2" stroke-linecap="round"/><path d="M18 30h18" stroke="#E1C7B5" stroke-width="2" stroke-linecap="round"/><rect x="37" y="27" width="9" height="7" rx="2" fill="#E2F0E6" stroke="#B6D0BF"/><path d="M18 13l5 5 5-5 5 5 5-5 5 5 5-5" stroke="#D89CB0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
 return `<div class="forecast-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="54" rx="18" ry="4" fill="#E6E2D8"/><path d="M18 27 10 40c7 2 12 4 22 4s15-2 22-4l-8-13c-4 2-9 3-14 3s-10-1-14-3Z" fill="#E8C7B4"/><path d="M22 40c3 2 6 3 10 3s7-1 10-3" stroke="#F7EFE8" stroke-width="2" stroke-linecap="round"/><path d="M23 49c3-5 15-5 18 0" stroke="#A8716D" stroke-width="2.2" stroke-linecap="round"/><circle cx="23" cy="50" r="3.5" fill="#C88E8D"/><circle cx="41" cy="50" r="3.5" fill="#C88E8D"/><circle cx="32" cy="18" r="8" fill="#F5A6BD"/><circle cx="22" cy="24" r="6" fill="#8D7BE0"/><circle cx="42" cy="24" r="5" fill="#F6D77A"/><path d="M32 25v12M22 29v8M42 29v8" stroke="#83A96B" stroke-width="2" stroke-linecap="round"/></svg></div>`;
}
window.renderForecast=function(){
 const box=$('cityForecast');if(!box)return;
 const f=cityForecasts[state.day]||cityForecasts[cityForecasts.length-1];
 const rule=forecastRule();
 const daySignal=`День ${state.day+1} · ${currentSeason().name}`;
 box.innerHTML=`<div class="forecast-title"><h3>Утренний прогноз спроса в Танзании</h3><span class="forecast-signal">${daySignal}</span></div>
 <div class="forecast-cards">
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('weather')}</div><div class="forecast-copy"><b>Погода</b><p>${f.weather.replace(/^[^а-яёa-z]+/i,'').trim()}</p>${forecastImpactHtml(rule.weatherEffectText,`${describeMarketDelta(rule.marketDelta)} · сроки хранения зависят от вида цветка и оборудования`)}</div></div>
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('event')}</div><div class="forecast-copy"><b>Событие в городе</b><p>${f.event}</p>${forecastImpactHtml(rule.eventEffectText,rule.orderBudgetDelta>0?`бюджет некоторых заказов увеличен на ${rule.orderBudgetDelta} ${coinWord(rule.orderBudgetDelta)}`:'влияет на эмоциональный запрос клиента')}</div></div>
   <div class="forecast-card"><div class="symbol">${(window.forecastIcon||forecastIcon)('demand')}</div><div class="forecast-copy"><b>Ожидаемый спрос</b><p>${f.signal}. ${f.hint}</p>${forecastImpactHtml(rule.signalEffectText,`особенно важны чувства: ${uniqueKeepOrder([...(rule.eventBoostTags||[]),...(rule.signalBoostTags||[])]).map(tag=>({love:'любовь',sincere:'искренность',hope:'надежда',joy:'радость',care:'забота',calm:'спокойствие',passion:'страсть'}[tag]||tag)).join(', ')}`)}</div></div>
 </div>${seasonRewardMarketHtml()}${seasonIndex()<2?`<p class="season-goal-hint">${floristUiIcon('target')} <b>Цель сезона:</b> ${seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':'средняя оценка от 65% — +5 к репутации в сезон урожая; от 80% — +10.'} Сейчас: ${seasonResults(seasonIndex()).rows.length?seasonResults(seasonIndex()).avg+'%':'ещё нет оценок'}.</p>`:''}<p class="forecast-disclaimer">Теперь прогноз не просто информирует: он влияет на цены рынка, пожелания клиентов и на то, какие эмоции легче раскрыть в букете. Срок свежести цветов фиксирован игровыми правилами.</p>`;
};
window.current=function(){
 const base=stories[state.day]||stories[stories.length-1];
 const s={...base,wants:[...base.wants],avoid:[...base.avoid]};
 const rule=forecastRule();
 s.budget+=rule.orderBudgetDelta||0;
 s.wants=uniqueKeepOrder([...s.wants,...(rule.eventBoostTags||[]).slice(0,1),...(rule.signalBoostTags||[]).slice(0,1)]);
 s.hint=`${base.hint} Прогноз дня: ${rule.signalEffectText.toLowerCase()}`;
 if(isVipDay()){
  s.vip=true;s.budget+=18;
  s.detail='Особый заказ · '+base.detail;
  s.occasion='VIP · '+base.occasion;
  s.hint='VIP-клиент особенно ценит точность. '+s.hint;
 }
 // v0.15.194: special events must be applied AFTER the forecast / VIP extensions.
 // v0.15.193's forecast override accidentally dropped these budget and VIP rules.
 const event=specialEvent();
 if(event){
  s.budget+=event.budget;
  s.occasion=event.title+' · '+s.occasion;
  s.detail=event.detail+' '+s.detail;
  s.hint=event.title+': оценка от '+event.required+'% принесёт дополнительно '+event.bonus+' монет и '+event.rep+' репутации. '+s.hint;
  if(state.day===18)s.vip=true;
 }
 return s;
};
window.generateDeals=function(){
 const season=currentSeason();
 const rule=forecastRule();
 types.forEach(t=>{
   let mult=0.88+Math.random()*0.24;
   if(season.featured.includes(t.id))mult-=0.13;
   if(season.pricey.includes(t.id))mult+=0.18;
   if(state.upgrades.assistant)mult-=0.05;
   state.availability[t.id]=!season.unavailable.includes(t.id);
   const dailyShift=(rule.marketDelta&&rule.marketDelta[t.id])?rule.marketDelta[t.id]:0;
   state.deals[t.id]=Math.max(1,Math.round(t.buy*mult)+dailyShift);
 });
 state.assortment=Object.values(state.availability).filter(Boolean).length;
};
/* Увядание теперь рассчитывается по сроку каждой партии, а не по погодному шансу. */
generateDeals();
render();
})();
</script>

<script>
(function(){
function eventArtWrap(inner){
  return `<div class="forecast-art art-event" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="10" y="12" width="44" height="40" rx="14" fill="#FFF9F3" stroke="#E8DACE"/>${inner}</svg></div>`;
}
function eventIconSvg(name){
  switch(name){
    case 'День старых друзей':
      return eventArtWrap(`<circle cx="25" cy="27" r="7" fill="#F4C6A5"/><circle cx="39" cy="27" r="7" fill="#E8B1A0"/><path d="M20 39c2-5 8-7 12-7s10 2 12 7" stroke="#88A96B" stroke-width="3" stroke-linecap="round"/><path d="M27 30l5 4 5-4" stroke="#D88FA0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`);
    case 'Фестиваль писем':
      return eventArtWrap(`<rect x="18" y="22" width="28" height="18" rx="5" fill="#FFF" stroke="#DDBEA8"/><path d="M19 24l13 10 13-10" stroke="#D89CB0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 19l2-3 3 2M39 19l-2-3-3 2" stroke="#85B48B" stroke-width="2" stroke-linecap="round"/>`);
    case 'Ярмарка новых идей':
      return eventArtWrap(`<circle cx="31" cy="27" r="10" fill="#F5D97D"/><path d="M31 18v6M23 27h6M31 36v-6M39 27h-6" stroke="#8B6A4F" stroke-width="2.3" stroke-linecap="round"/><path d="M28 40h6" stroke="#8EC0B5" stroke-width="3" stroke-linecap="round"/><path d="M25 43h12" stroke="#8EC0B5" stroke-width="3" stroke-linecap="round"/>`);
    case 'Неделя добрых дел':
      return eventArtWrap(`<path d="M24 29c-4-7 6-13 10-5 4-8 14-2 10 5-5 8-10 11-10 11s-5-3-10-11Z" fill="#F4A8B6"/><path d="M21 42c3-4 7-6 13-6s10 2 13 6" stroke="#86AA74" stroke-width="3" stroke-linecap="round"/>`);
    case 'День добрых слов':
      return eventArtWrap(`<path d="M18 22h28a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H34l-8 6v-6H18a6 6 0 0 1-6-6v-8a6 6 0 0 1 6-6Z" fill="#FFF" stroke="#DDBEA8"/><path d="M22 30h19M22 35h13" stroke="#D89CB0" stroke-width="2.4" stroke-linecap="round"/>`);
    case 'Городской день достижений':
      return eventArtWrap(`<circle cx="32" cy="27" r="9" fill="#F2D06B"/><path d="M28 27l3 3 5-6" stroke="#8B6A4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 36l-3 8 6-3 3 5 3-5 6 3-3-8" fill="#D89CB0"/>`);
    case 'Праздник маленьких радостей':
      return eventArtWrap(`<circle cx="23" cy="29" r="5" fill="#F4B1C0"/><circle cx="32" cy="24" r="6" fill="#F2D06B"/><circle cx="41" cy="29" r="5" fill="#B8A2E0"/><path d="M23 34v8M32 30v12M41 34v8" stroke="#86AA74" stroke-width="2.4" stroke-linecap="round"/>`);
    case 'День семейных торжеств':
      return eventArtWrap(`<path d="M17 30h30" stroke="#DDBEA8" stroke-width="3" stroke-linecap="round"/><path d="M21 30v-7c0-3 3-5 6-5s5 2 5 5v7" stroke="#E4A8B4" stroke-width="3" stroke-linecap="round"/><path d="M32 30v-9c0-3 2-5 5-5s6 2 6 5v9" stroke="#F2D06B" stroke-width="3" stroke-linecap="round"/><circle cx="27" cy="18" r="3" fill="#86AA74"/><circle cx="41" cy="16" r="3" fill="#86AA74"/>`);
    case 'Музыкальная сцена на побережье':
      return eventArtWrap(`<path d="M25 21v16a4 4 0 1 1-3-3.9V24l18-4v13a4 4 0 1 1-3-3.9V17l-12 3Z" fill="#B18FDF" stroke="#876FBA" stroke-width="1.3"/>`);
    case 'День благодарности':
      return eventArtWrap(`<path d="M20 40c2-7 8-11 12-11s10 4 12 11" stroke="#86AA74" stroke-width="3" stroke-linecap="round"/><path d="M24 30c-2-7 5-12 8-5 3-7 10-2 8 5-4 7-8 9-8 9s-4-2-8-9Z" fill="#F2D06B"/>`);
    case 'Фестиваль путешествий':
      return eventArtWrap(`<path d="M18 38h28" stroke="#DDBEA8" stroke-width="3" stroke-linecap="round"/><path d="M22 38c1-9 6-16 10-16s9 7 10 16" stroke="#86AA74" stroke-width="3" stroke-linecap="round"/><path d="M31 16l6 4-6 4v-8Z" fill="#E4A8B4"/>`);
    case 'Соседский фестиваль':
      return eventArtWrap(`<rect x="18" y="28" width="11" height="12" rx="3" fill="#F6E7D7" stroke="#DDBEA8"/><rect x="35" y="25" width="11" height="15" rx="3" fill="#F6E7D7" stroke="#DDBEA8"/><path d="M15 28l8-7 8 7M32 25l8-7 8 7" stroke="#D89CB0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 34h8" stroke="#86AA74" stroke-width="2.4" stroke-linecap="round"/>`);
    case 'Вечер семейных историй':
      return eventArtWrap(`<rect x="17" y="20" width="30" height="22" rx="4" fill="#FFF" stroke="#DDBEA8"/><path d="M24 20v22" stroke="#E7D5C6"/><path d="M27 26h14M27 31h14M27 36h10" stroke="#C89BAE" stroke-width="2.2" stroke-linecap="round"/><path d="M21 24c1-2 3-3 5-3" stroke="#86AA74" stroke-width="2" stroke-linecap="round"/>`);
    case 'Открытая сцена':
      return eventArtWrap(`<path d="M19 37h26" stroke="#DDBEA8" stroke-width="3.4" stroke-linecap="round"/><path d="M32 20c5 0 8 4 8 8 0 7-8 12-8 12s-8-5-8-12c0-4 3-8 8-8Z" fill="#F4B1C0"/><circle cx="32" cy="28" r="3" fill="#FFF6F8"/>`);
    case 'Праздник семейных традиций':
      return eventArtWrap(`<circle cx="22" cy="25" r="5" fill="#E5B4A8"/><circle cx="32" cy="22" r="6" fill="#F0C1AE"/><circle cx="43" cy="25" r="5" fill="#E2A69F"/><path d="M17 39c2-5 7-7 10-7M27 38c2-6 8-8 13-8M38 39c2-5 7-7 9-7" stroke="#86AA74" stroke-width="2.8" stroke-linecap="round"/>`);
    case 'Книжная неделя':
      return eventArtWrap(`<rect x="19" y="19" width="12" height="24" rx="3" fill="#F6E7D7" stroke="#DDBEA8"/><rect x="33" y="19" width="12" height="24" rx="3" fill="#FFF" stroke="#DDBEA8"/><path d="M31 21v20" stroke="#D89CB0" stroke-width="2"/><path d="M23 25h4M36 25h4M23 30h4M36 30h4" stroke="#86AA74" stroke-width="2" stroke-linecap="round"/>`);
    case 'Ночь открытых галерей':
      return eventArtWrap(`<rect x="17" y="18" width="30" height="24" rx="4" fill="#FFF" stroke="#DDBEA8"/><path d="M22 35l6-7 5 5 5-8 4 10" stroke="#86AA74" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27" cy="25" r="2.5" fill="#F2D06B"/><path d="M22 16l2-3M42 16l-2-3" stroke="#D89CB0" stroke-width="2" stroke-linecap="round"/>`);
    case 'Вечер выпускников':
      return eventArtWrap(`<path d="M20 24l12-6 12 6-12 6-12-6Z" fill="#B39BDF"/><path d="M24 28v7c0 4 16 4 16 0v-7" stroke="#876FBA" stroke-width="2.3" stroke-linecap="round"/><path d="M44 24v10" stroke="#876FBA" stroke-width="2.3" stroke-linecap="round"/><circle cx="44" cy="36" r="2" fill="#F2D06B"/>`);
    case 'День первых шагов':
      return eventArtWrap(`<path d="M24 23c3 0 5 3 5 6s-2 5-5 5-5-2-5-5 2-6 5-6Zm15 0c3 0 5 3 5 6s-2 5-5 5-5-2-5-5 2-6 5-6Z" fill="#F2D06B"/><path d="M24 34v7M39 34v7" stroke="#86AA74" stroke-width="2.5" stroke-linecap="round"/><path d="M20 44c4-3 8-3 12 0M32 44c4-3 8-3 12 0" stroke="#D89CB0" stroke-width="2.3" stroke-linecap="round"/>`);
    case 'Вечер искренних признаний':
      return eventArtWrap(`<path d="M32 41 20 30c-4-4-3-10 1-13 3-2 7-2 11 2 4-4 8-4 11-2 4 3 5 9 1 13L32 41Z" fill="#F4A8B6"/><path d="M22 41h20" stroke="#C59C79" stroke-width="2.4" stroke-linecap="round"/>`);
    case 'Праздник урожая':
      return eventArtWrap(`<path d="M20 39c7-8 17-8 24 0" stroke="#C59C79" stroke-width="3" stroke-linecap="round"/><path d="M24 38V24M31 38V21M38 38V24" stroke="#D6B157" stroke-width="2.6" stroke-linecap="round"/><path d="M24 24c-3-2-3-5 0-7M31 21c-3-2-3-5 0-7M38 24c-3-2-3-5 0-7" stroke="#86AA74" stroke-width="2" stroke-linecap="round"/>`);
    default:
      return eventArtWrap(`<rect x="18" y="20" width="28" height="20" rx="6" fill="#FFF" stroke="#DDBEA8"/><path d="M23 27h18M23 33h13" stroke="#D89CB0" stroke-width="2.3" stroke-linecap="round"/><circle cx="42" cy="24" r="3" fill="#86AA74"/>`);
  }
}

/* v0.13.20: погодные состояния в одной пастельной иллюстративной манере. */
function forecastWeatherIllustration(weather){
 const w=(weather||'').toLowerCase();
 const sun=`<g class="icon-sun-disc"><circle cx="23" cy="22" r="10" fill="#F4D27B" stroke="#E0BC68" stroke-width="1.2"/><path d="M23 6v5M23 33v5M7 22h5M34 22h5M12 11l4 4m14 14 4 4m0-22-4 4" stroke="#E3C17A" stroke-width="2" stroke-linecap="round"/></g>`;
 const cloud=`<g class="icon-cloud"><path d="M18 37c-5 0-9-3.2-9-8 0-4 3-7 7-8 1.4-5 5-8 10-8 6 0 10 4 11 9 5-1 10 2 10 8 0 4-3 7-7 7Z" fill="#FFFFFF" stroke="#C9DAD9" stroke-width="1.6"/><path d="M17 32h21" stroke="#E8EFEB" stroke-width="2" stroke-linecap="round"/></g>`;
 let inner='';
 if(/туман/.test(w)) inner=`<path d="M12 17h32M9 25h37M15 34h28" stroke="#C3D5CD" stroke-width="5" stroke-linecap="round"/><path d="M14 19h24M17 27h28" stroke="#EDF4ED" stroke-width="2.2" stroke-linecap="round"/>`;
 else if(/листопад|золотая осень/.test(w))inner=`${sun}<g class="icon-leaf"><path d="M35 25c10 1 13 9 3 14-5 2-12-2-13-7 2-4 5-7 10-7Z" fill="#D8A36F" stroke="#B77C4C" stroke-width="1.1"/><path d="M28 32l10 4" stroke="#F8DCAC" stroke-width="1.6"/></g>`;
 else if(/дожд/.test(w)) inner=`${cloud}<g class="icon-raindrops"><path d="M19 41l-3 7m12-7-3 7m12-7-3 7" stroke="#82BFC5" stroke-width="3.5" stroke-linecap="round"/></g>`;
 else if(/ветер/.test(w)) inner=`${sun}<g class="icon-wind"><path d="M10 38h24q7 0 7-6M10 44h30q7 0 7-5" fill="none" stroke="#A6C3AD" stroke-width="2.8" stroke-linecap="round"/></g>`;
 else if(/облач|пасмур/.test(w))inner=`<g class="icon-sun-disc" opacity=".65">${sun}</g>${cloud}`;
 else if(/жарк/.test(w))inner=`<g class="icon-sun-disc">${sun}</g><path d="M16 41h18" stroke="#EAB57D" stroke-width="3" stroke-linecap="round"/><path d="M18 47h14" stroke="#EAB57D" stroke-width="2.2" stroke-linecap="round"/>`;
 else if(/вечер|закат/.test(w))inner=`<path d="M9 40h39" stroke="#D6AC93" stroke-width="2.6" stroke-linecap="round"/>${sun}<path d="M12 40c12-8 25-8 34 0" stroke="#E7BFA7" stroke-width="2" stroke-linecap="round"/>`;
 else inner=`${sun}<path d="M15 40c9-4 20-4 30 0" fill="none" stroke="#B0CAB3" stroke-width="2.6" stroke-linecap="round"/>`;
 return `<div class="forecast-art art-weather" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="54" rx="21" ry="3" fill="#AABBA8" opacity=".14"/>${inner}</svg></div>`;
}
function forecastDemandIllustration(){
 return `<div class="forecast-art art-demand" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="55" rx="19" ry="3.5" fill="#A9B9A6" opacity=".13"/><path d="M16 29 12 43 32 52 52 43 48 29Q32 37 16 29Z" fill="#F0CCBB" stroke="#D1A99A" stroke-width="1.2"/><path d="M22 39Q32 45 42 39" stroke="#FFF7F0" stroke-width="2.4" stroke-linecap="round"/><path d="M32 44V27M24 36V23M40 36V24" stroke="#88AC82" stroke-width="2.6" stroke-linecap="round"/><g class="icon-bloom"><circle cx="32" cy="19" r="8.5" fill="#F0A7C0"/><circle cx="23" cy="27" r="6.8" fill="#BBA5DA"/><circle cx="42" cy="26" r="6.8" fill="#F4D37B"/><circle cx="32" cy="19" r="2.6" fill="#FFE6A5"/></g></svg></div>`;
}
window.forecastIcon=function(kind){
 let ico=kind==='weather'?'weather':kind==='event'?'event':'demand';
 if(kind==='weather'){
  const name=String((cityForecasts[state.day]&&cityForecasts[state.day].weather)||'').toLowerCase();
  if(name.includes('солнечно')||name.includes('ясно'))ico='sun';
 }
 if(kind==='event'){
  const ev=String((cityForecasts[state.day]&&cityForecasts[state.day].event)||'').toLowerCase();
  if(ev.includes('письм')||ev.includes('поэт')||ev.includes('истор'))ico='notes';
  if(ev.includes('друз')||ev.includes('семь')||ev.includes('влюбл'))ico='heart';
  if(ev.includes('ярмарк')||ev.includes('фестивал')||ev.includes('праздник'))ico='event';
 }
 return `<div class="forecast-art art-${kind} brand-forecast-art" aria-hidden="true">${floristUiIcon(ico)}</div>`;
};
if(typeof render==='function') render();
})();
</script>
<script>
// Preserve a single embedded PNG logo for an offline standalone HTML file.
(function(){const approved=document.querySelector('.approved-logo');const side=document.querySelector('.game-logo-sidebar');if(approved&&side){side.src=approved.src;}})();
</script>
<style id="tanzania-single-brand-v0155">
/* Флорист. Танзания — одна фирменная палитра из утверждённого логотипа. */
:root{
 --ink:#244739;--forest:#123c2b;--muted:#746c5b;--cream:#fff8e8;
 --gold:#d5a54c;--accent:#c97338;--edge:#dec99e;
 --white:#fffaf0;--shadow:0 13px 34px rgba(65,44,19,.10);
}
body,body.africa-safari,body.theme-spring,body.theme-summer,body.theme-autumn{
 background:radial-gradient(circle at 12% 0%,rgba(247,202,106,.19),transparent 45%),
            radial-gradient(circle at 93% 30%,rgba(30,80,49,.13),transparent 45%),
            linear-gradient(180deg,#fbf2d9 0%,#f0dbb4 100%)!important;
 color:var(--ink);
}
body:before{background:radial-gradient(circle at 80% 0%,rgba(238,174,74,.16),transparent 38%),
                         radial-gradient(circle at 5% 80%,rgba(38,83,54,.085),transparent 42%)}
.app{background:linear-gradient(180deg,#fff9ed 0%,#f5ecd9 100%);box-shadow:0 15px 60px rgba(61,41,17,.13)}
.s