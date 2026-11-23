/* Флорист. Танзания — 0.15.209. Три понятные карточки прогноза.
   Market deltas and storage life are read from authoritative game rules. */
(function(){
  'use strict';
  function safe(text){return String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
  const feelings={love:'любовь',sincere:'искренность',hope:'надежда',joy:'радость',care:'забота',calm:'спокойствие',passion:'страсть'};
  function marketGroups(rule,allTypes){
    const items=Object.entries(rule.marketDelta||{}).filter(([,value])=>Number(value)!==0);
    const byDirection=sign=>items.filter(([,change])=>sign*change>0).map(([id,change])=>{
      const f=allTypes.find(f=>f.id===id&&!f.plantationOnly);
      return f?{name:f.name,delta:change}:null;
    }).filter(Boolean);
    return {cheaper:byDirection(-1),pricier:byDirection(1)};
  }
  // Единая фирменная серия: золотой медальон, тёмно-зелёный контур, африканский узор.
  function forecastMedallion(kind){
    const shapes={
      weather:'<circle cx="32" cy="32" r="10" fill="#EAC06D" stroke="#244D37" stroke-width="2.5"/><path d="M32 13v6M32 45v6M13 32h6M45 32h6M19 19l4.2 4.2M40.8 40.8l4.2 4.2M45 19l-4.2 4.2M23.2 40.8L19 45" stroke="#28543C" stroke-width="3" stroke-linecap="round"/>',
      market:'<path d="M18 46V21h28v25Z" fill="#F8EAC2" stroke="#28543C" stroke-width="2.4" stroke-linejoin="round"/><path d="M23 40v-7h5v7m5 0V27h5v13m4 0v-11" fill="none" stroke="#28543C" stroke-width="3" stroke-linecap="round"/><path d="M22 24l9-7 7 4 7-9" stroke="#B98237" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
      fresh:'<path d="M19 49c13-11 18-22 27-32" stroke="#28543C" stroke-width="3" stroke-linecap="round"/><path d="M31 33C16 31 14 22 16 17c12 0 18 6 15 16Z" fill="#8AB27B" stroke="#28543C" stroke-width="2"/><path d="M35 29c-1-12 6-17 14-17 1 10-4 17-14 17Z" fill="#C6D5A1" stroke="#28543C" stroke-width="2"/><path d="M25 42c-10-2-13-8-12-13 10 0 14 5 12 13Z" fill="#B6CC91" stroke="#28543C" stroke-width="2"/>'
    };
    return '<span class="ftz-forecast-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false" xmlns="http://www.w3.org/2000/svg">'+
      '<path d="M32 3 42 8 53 8 56 19 61 32 56 45 53 56 42 56 32 61 22 56 11 56 8 45 3 32 8 19 11 8 22 8Z" fill="#234B35" stroke="#D9AB55" stroke-width="2.5"/>'+
      '<path d="M32 8 42 13 50 13 53 22 56 32 53 42 50 51 42 51 32 56 22 51 14 51 11 42 8 32 11 22 14 13 22 13Z" fill="#F7E8BF" stroke="#D6A74F" stroke-width="1.4"/>'+
      '<path d="M17 14 21 18M47 14l-4 4M17 50l4-4M47 50l-4-4" stroke="#B78439" stroke-width="2" stroke-linecap="round"/>'+
      shapes[kind]+'</svg></span>';
  }
  function init(){
    if(typeof window.FTZForecastBridge?.forecastRule!=='function'||typeof renderForecast!=='function'||
       typeof currentSeason!=='function'||typeof state==='undefined')return;
    window.renderForecast=function(){
      const box=document.getElementById('cityForecast');if(!box)return;
      const f=cityForecasts[state.day]||cityForecasts[cityForecasts.length-1];
      const rule=window.FTZForecastBridge.forecastRule();
      const groups=marketGroups(rule,types);
      const weather=String(f.weather||'').replace(/^[^а-яёa-z]+/i,'').trim();
      const marketText=groups.cheaper.length||groups.pricier.length?
        '<div class="ftz-market-lines">'+
        (groups.cheaper.length?'<p><strong>↓ Снижение:</strong> '+groups.cheaper.map(x=>safe(x.name)).join(', ')+'</p>':'')+
        (groups.pricier.length?'<p><strong>↑ Повышение:</strong> '+groups.pricier.map(x=>safe(x.name)).join(', ')+'</p>':'')+
        '</div>':'<p>Сегодня нет дополнительных ценовых изменений.</p>';
      const lifeBonus=(typeof ftzLifeBonus==='function')?ftzLifeBonus():0;
      const chilled=!!state.upgrades.fridge;
      const shopBonus=(typeof ftzShopLifeBonus==='function')?ftzShopLifeBonus():0;
      const freshness='Срок хранения зависит от вида цветка.'+
        (chilled?' Охлаждаемый павильон: +1 день.':'')+
        (shopBonus?' Улучшенный магазин: +1 день.':'')+
        (!lifeBonus?' Улучшения помогут продлить свежесть.':'');
      const feelingsList=[...(rule.eventBoostTags||[]),...(rule.signalBoostTags||[])]
        .filter((id,i,arr)=>arr.indexOf(id)===i).map(id=>feelings[id]||id);
      const eventNote=rule.orderBudgetDelta>0?
        'В некоторых заказах бюджет увеличен на '+rule.orderBudgetDelta+' '+coinWord(rule.orderBudgetDelta)+'.':
        'Событие влияет на ожидания клиентов.';
      const bonus=seasonIndex()<2?
        '<p class="season-goal-hint">'+floristUiIcon('target')+' <b>Цель сезона:</b> '+
        (seasonIndex()===0?'средняя оценка от 65% — скидка 1 монета на первые 12 цветов в солнечный сезон; от 80% — скидка 2 монеты.':
          'средняя оценка от 65% — +5 к репутации в сезон урожая; от 80% — +10.')+
        ' Сейчас: '+(seasonResults(seasonIndex()).rows.length?seasonResults(seasonIndex()).avg+'%':'ещё нет оценок')+'.</p>':'';
      box.innerHTML='<div class="forecast-title"><h3>Прогноз игрового дня</h3>'+
        '<span class="forecast-signal">День '+(state.day+1)+' · '+safe(currentSeason().name)+'</span></div>'+
        '<div class="forecast-cards ftz-three-forecast-cards">'+
          '<div class="forecast-card ftz-forecast-weather"><div class="symbol">'+forecastMedallion('weather')+'</div>'+
          '<div class="forecast-copy"><b>Погода</b><p>'+safe(weather)+'</p>'+
          '</div></div>'+
          '<div class="forecast-card ftz-forecast-market"><div class="symbol"><span class="ftz-forecast-simple-icon">📊</span></div>'+
          '<div class="forecast-copy"><b>Рынок цветов</b>'+marketText+
          '<div class="ftz-forecast-explainer">Дополнительное влияние дня на закупочные цены. Итоговые цены — на рынке.</div></div></div>'+
          '<div class="forecast-card ftz-forecast-fresh"><div class="symbol"><span class="ftz-forecast-simple-icon">🌿</span></div>'+
          '<div class="forecast-copy"><b>Свежесть цветов</b><p>'+safe(freshness)+'</p>'+
          '<div class="ftz-forecast-explainer">Увядание учитывается по сроку хранения каждой партии, без погодного штрафа.</div></div></div>'+
        '</div>'+
        '<div class="ftz-forecast-context" aria-label="Событие дня и прогноз спроса">'+
        '<div><strong>🎉 Событие в городе</strong><span>'+safe(f.event)+'. '+safe(rule.eventEffectText)+' '+safe(eventNote)+'</span></div>'+
        '<div><strong>💐 Ожидаемый спрос</strong><span>'+safe(f.signal)+'. '+safe(f.hint)+' '+
        (feelingsList.length?'Подходящие эмоции: '+safe(feelingsList.join(', '))+'.':'')+'</span></div></div>'+
        seasonRewardMarketHtml()+bonus+
        '';
    };
    renderForecast();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();