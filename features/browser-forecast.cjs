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
   const f=cityForecasts[state.day],rule=forecastRule();
   return {
     cards:cards.length,
     titles:cards.map(c=>c.querySelector('.forecast-copy>b')?.textContent),
     weather:cards[0]?.innerText||'',
     market:cards[1]?.innerText||'',
     freshness:cards[2]?.innerText||'',
     context:root.querySelectorAll('.ftz-forecast-context>div').length,
     originalWeather:f.weather,
     priceDeltas:Object.entries(rule.marketDelta||{}),
     frostBonus:typeof ftzLifeBonus==='function'?ftzLifeBonus():null,
     layout:getComputedStyle(root.querySelector('.ftz-three-forecast-cards')).gridTemplateColumns
   };
 });
 const a=await read();
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
 assert(!mobile.overflow,'Mobile document horizontally overflows');
 assert(mobile.cardWidths.every(x=>x<=mobile.rootWidth+1));
 assert.equal(errors.length,0,'Browser JS errors '+errors.join(' | '));
 console.log('PASS: 3 distinct cards, current market rule, real storage upgrades, days, existing context, responsive layout',a.titles);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
