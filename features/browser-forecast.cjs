const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1320,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve('index.html'),{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForTimeout(450);
 const read=()=>page.evaluate(()=>{
   const root=document.getElementById('cityForecast');
   const cards=[...root.querySelectorAll('.ftz-three-forecast-cards>.forecast-card')];
   const f=cityForecasts[state.day],rule=window.FTZForecastBridge.forecastRule();
   return {
     cards:cards.length,
     titles:cards.map(c=>c.querySelector('.forecast-copy>b')?.textContent),
     weather:cards[0]?.textContent||'',
     market:cards[1]?.textContent||'',
     freshness:cards[2]?.textContent||'',
     context:root.querySelectorAll('.ftz-forecast-context>div').length,
     originalWeather:f.weather,
     priceDeltas:Object.entries(rule.marketDelta||{}),
     frostBonus:typeof ftzLifeBonus==='function'?ftzLifeBonus():null,
     layout:getComputedStyle(root.querySelector('.ftz-three-forecast-cards')).gridTemplateColumns
   };
 });
 const a=await read();
 const branding=await page.evaluate(()=>{
   const cards=[...document.querySelectorAll('#cityForecast .ftz-three-forecast-cards>.forecast-card')];
   const icons=cards.map(c=>c.querySelector('.ftz-forecast-emblem'));
   return {count:icons.filter(Boolean).length,
      dimensions:icons.map(e=>({width:e?.getBoundingClientRect().width,height:e?.getBoundingClientRect().height})),
      cardHeights:cards.map(c=>c.getBoundingClientRect().height),
      weatherText:cards[0]?.textContent,
      footer:document.querySelector('#cityForecast .forecast-disclaimer')?.textContent||''};
 });
 assert.equal(branding.count,3,'Three custom emblems required');
 assert(branding.dimensions.every(d=>d.width===branding.dimensions[0].width&&d.height===branding.dimensions[0].height),
   'Forecast icons must have identical dimensions');
 assert(branding.cardHeights.every(x=>Math.abs(x-branding.cardHeights[0])<=1),
   'Forecast cards must be equal in height on desktop');
 assert(!branding.weatherText.includes('Погодные условия дня'));
 assert(!branding.footer.includes('Погода, рыночные цены и свежесть показаны отдельно'));
 assert.equal(a.cards,3);
 assert.deepEqual(a.titles,['Погода','Рынок цветов','Свежесть цветов']);
 assert.equal(a.context,2);
 assert(!a.weather.includes('дешевле:'),'Weather still contains market prices');
 assert(!a.weather.includes('Срок хранения'),'Weather still contains freshness');
 assert(a.freshness.includes('Срок хранения'));
 assert(a.market.includes('Снижение')||a.market.includes('Повышение')||a.market.includes('нет дополнительных'));
 await page.evaluate(()=>{state.day=4; state.upgrades.fridge=true;renderForecast();});
 const b=await read();
 assert(b.freshness.includes('Охлаждаемый павильон: +1 день.'));
 await page.evaluate(()=>{state.day=11;renderForecast();});
 const c=await read();
 assert.equal(c.cards,3);
 await page.setViewportSize({width:390,height:844});
 const mobile=await page.evaluate(()=>{
   const root=document.querySelector('.ftz-three-forecast-cards');
   const cards=[...root.children];
   const widths=cards.map(c=>c.getBoundingClientRect().width);
   return {grid:getComputedStyle(root).gridTemplateColumns,
     rootWidth:root.getBoundingClientRect().width,cardWidths:widths,
     overflow:document.documentElement.scrollWidth>window.innerWidth+2};
 });
 const mobileIcons=await page.evaluate(()=>[...document.querySelectorAll('#cityForecast .ftz-forecast-emblem')]
    .map(e=>[e.getBoundingClientRect().width,e.getBoundingClientRect().height]));
 assert.equal(mobileIcons.length,3);
 assert(mobileIcons.every(x=>x[0]===mobileIcons[0][0]&&x[1]===mobileIcons[0][1]));
 assert(!mobile.overflow,'Mobile document horizontally overflows');
 assert(mobile.cardWidths.every(x=>x<=mobile.rootWidth+1));
 assert.equal(errors.length,0,'Browser JS errors '+errors.join(' | '));
 console.log('PASS: 3 distinct cards, current market rule, real storage upgrades, days, existing context, responsive layout',a.titles);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
