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
  function init(){
    if(typeof forecastRule!=='function'||typeof renderForecast!=='function'||
       typeof currentSeason!=='function'||typeof state==='undefined')return;
    window.renderForecast=function(){
      const box=document.getElementById('cityForecast');if(!box)return;
      const f=cityForecasts[state.day]||cityForecasts[cityForecasts.length-1];
      const rule=forecastRule();
      const groups=marketGroups(rule,types);
      const weather=String(f.weather||'').replace(/^[^а-яёa-z]+/i,'').trim();
      const icon=window.forecastIcon||((kind)=>'<span class="ftz-forecast-simple-icon">'+(kind==='weather'?'☀️':kind==='market'?'📊':'🌿')+'</span>');
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
          '<div class="forecast-card ftz-forecast-weather"><div class="symbol">'+icon('weather')+'</div>'+
          '<div class="forecast-copy"><b>Погода</b><p>'+safe(weather)+'</p>'+
          '<div class="ftz-forecast-explainer">Погодные условия дня. Рыночные цены показаны отдельно.</div></div></div>'+
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
        '<p class="forecast-disclaimer">Погода, рыночные цены и свежесть показаны отдельно. Фактические закупочные цены зависят также от сезона и ассортимента.</p>';
    };
    renderForecast();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();