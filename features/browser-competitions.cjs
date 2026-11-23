const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve('index.html'),{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForTimeout(500);
 const start=await page.evaluate(()=>{
   if(!window.FTZCompetition)throw Error('Competition UI not initialized');
   if(!window.FTZCompetitionEngine)throw Error('Competition engine missing');
   state.started=true;
   state.day=5;
   state.money=100;
   state.rep=20;
   state.last=null;
   state.finished=false;
   flowStep=1;
   flowMax=1;
   state.chosen=['rose','tulip','lily','calla','sun'];
   state.positions=state.chosen.map(()=>null);
   for(const id of state.chosen)state.stock[id]=Math.max(2,state.stock[id]||0);
   document.getElementById('startScreen')?.classList.add('hidden');
   switchTab('work');
   render();
   if(typeof renderFlow==='function')renderFlow();
   return {day:state.day,shown:!document.getElementById('ftzCompetition').hidden,
      initialStock:state.chosen.map(id=>state.stock[id]),
      chosen:state.chosen.slice(),money:state.money};
 });
 assert(start.shown,'Contest invitation missing on day 6');
 await page.locator('#ftzCompetitionSubmit').click();
 const after=await page.evaluate(()=>{
   const r=state.competitions.village;
   if(!r)throw Error('No saved contest');
   if(r.rivals.length!==3)throw Error('Expected 3 virtual opponents');
   if(document.querySelectorAll('#ftzCompetition .ftz-competition-jury>div').length!==5)throw Error('5 jury criteria missing');
   if(document.querySelectorAll('#ftzCompetition .ftz-competition-rival').length!==4)throw Error('Podium should include player + 3 opponents');
   return {rank:r.rank,total:r.total,prize:r.prize,money:state.money,rep:state.rep,
      stock:state.chosen.map(id=>state.stock[id]),chosen:state.chosen.slice(),saved:!!localStorage.getItem(FTZ_SAVE_KEY)};
 });
 assert(after.saved,'Contest not saved');
 assert.equal(after.money,100-30+after.prize.money);
 assert.equal(after.rep,Math.min(100,20+after.prize.rep));
 assert.deepEqual(after.stock,start.initialStock,'Entry must not consume client bouquet stock');
 assert.deepEqual(after.chosen,start.chosen,'Client bouquet should remain intact');
 await page.evaluate(()=>{FTZCompetition.submit();});
 assert.equal(await page.evaluate(()=>state.money),after.money,'Duplicate entry changed money');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.getElementById('startScreen')?.classList.add('hidden'));
 const restored=await page.evaluate(()=>({rank:state.competitions?.village?.rank,money:state.money}));
 assert.equal(restored.rank,after.rank,'Competition result not restored');
 assert.equal(restored.money,after.money);
 await page.evaluate(()=>{
   state.day=12;state.last=null;state.finished=false;
   flowStep=1;flowMax=1;
   state.money=100;
   state.chosen=['rose','tulip','lily','calla','sun'];
   for(const id of state.chosen)state.stock[id]=Math.max(3,state.stock[id]||0);
   render();
   if(typeof renderFlow==='function')renderFlow();
 });
 assert(await page.locator('#ftzCompetitionSubmit').isEnabled(),'Day 13 contest missing');
 await page.locator('#ftzCompetitionSubmit').click();
 assert.equal(await page.evaluate(()=>Object.keys(state.competitions).length),2);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{
   state.day=19;state.last=null;state.finished=false;flowStep=1;flowMax=1;
   state.money=100;
   state.chosen=['rose','tulip','lily','calla','sun'];
   for(const id of state.chosen)state.stock[id]=Math.max(3,state.stock[id]||0);
   render();
   if(typeof renderFlow==='function')renderFlow();
 });
 assert(await page.locator('#ftzCompetitionSubmit').isVisible(),'Mobile grand prix entry missing');
 await page.locator('#ftzCompetitionSubmit').click();
 assert.equal(await page.evaluate(()=>Object.keys(state.competitions).length),3);
 await page.evaluate(()=>switchTab('journal'));
 assert(await page.locator('#ftzCompetitionHistory').isVisible(),'Journal medals missing');
 assert.equal(await page.locator('#ftzCompetitionHistory .ftz-competition-medal.earned').count(),3);
 assert.equal(errors.length,0,'Uncaught browser errors: '+errors.join(' | '));
 console.log('PASS: tournaments days 6/13/20, 3 rivals, 5 criteria, prizes, no duplicate, persistence, journal and mobile');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
