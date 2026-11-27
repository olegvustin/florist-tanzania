const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const wraps=['kraft','linen','velvet','signature','savanna','baobab','kilimanjaro','zanzibar'];
const url=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try {
  for(const viewport of [{width:1320,height:960},{width:390,height:844}]){
   const p=await browser.newPage({viewport,hasTouch:viewport.width<500});
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
   await p.evaluate(()=>{
    state.started=true;state.day=0;state.upgrades.premiumPack=true;state.finished=false;state.last=null;flowStep=1;flowMax=1;
    state.chosen=['tulip','agapanthusWhite','rose'];state.positions=[null,null,null];
    for(const id of state.chosen)state.stock[id]=10;
    $('arrangementType').value='bouquet';$('greenery').value='none';$('note').value='none';$('decor').value='none';
    $('startScreen').classList.add('hidden');switchTab('work');renderFlow();
   });
   await p.locator('#bouquet').scrollIntoViewIfNeeded();
   for(const wrap of wraps){
    const result=await p.evaluate(w=>{
     $('wrap').value=w;render();
     const root=$('bouquet'),bed=root.querySelector('.ftz214-plant-bed');
     // Simulate a large plant crossing both boundaries. Verify actual browser
     // clipping (not just a computed style) below the flap and above the lip.
     const probe=document.createElement('div');
     probe.style.cssText='position:absolute;inset:0;pointer-events:auto;z-index:100';
     bed.append(probe);
     const r=bed.getBoundingClientRect();
     const test=(x,y)=>document.elementsFromPoint(r.left+r.width*x,r.top+r.height*y).includes(probe);
     const result={mask:bed.dataset.sleeve,visible:[test(.25,.15),test(.75,.15),test(.5,.51)],
       outside:[test(.14,.5),test(.86,.5),test(.08,.65),test(.92,.65),test(.5,.8)],
       flowers:bed.querySelectorAll('.blossom').length,greenWithoutAccent:!bed.querySelector('.ftz-paper-selected-green')};
     probe.remove();
     $('greenery').value='fern';render();
     result.fern=!!root.querySelector('.ftz214-plant-bed .ftz-paper-selected-green');
     $('greenery').value='none';return result;
    },wrap);
    assert.equal(result.mask,wrap);assert.equal(result.flowers,3);
    assert.deepEqual(result.visible,[true,true,true],`${wrap}: crown and middle should remain`);
    assert.deepEqual(result.outside,[false,false,false,false,false],`${wrap}: no botanical pixels beyond the sleeve sides or tail`);
    assert(result.greenWithoutAccent&&result.fern,wrap);
   }
   await p.evaluate(()=>{$('wrap').value='savanna';render()});
   const original=await p.evaluate(()=>JSON.stringify(state.positions[2]));
   const rose=p.locator('#bouquet .blossom[data-i="2"]');
   await rose.scrollIntoViewIfNeeded();
   const grip=await rose.evaluate(el=>{
    const r=el.getBoundingClientRect();
    for(const y of [.25,.15,.35,.45])for(const x of [.65,.8,.5,.35,.95]){
     const px=r.left+r.width*x,py=r.top+r.height*y;
     if(document.elementFromPoint(px,py)?.closest('.blossom')===el)return {px,py};
    }
    return null;
   });
   assert(grip,'visible flower still receives pointer events');
   await p.mouse.move(grip.px,grip.py);
   await p.mouse.down();await p.mouse.move(grip.px+22,grip.py+12,{steps:5});await p.mouse.up();
   assert.notEqual(await p.evaluate(()=>JSON.stringify(state.positions[2])),original,'drag remains usable');
   const handoff=await p.evaluate(()=>{deliver();return {
    burnedIn:state.history[0]?.bouquetMarkup.includes('ftz214-plant-bed'),
    visible:!!$('feedback').querySelector('.ftz214-plant-bed'),
    restored:ftzRebuildBouquet(state.history[0]?.bouquetSpec).includes('ftz214-plant-bed')
   }});
   assert.deepEqual(handoff,{burnedIn:true,visible:true,restored:true});
   assert.deepEqual(errors,[]);
   await p.close();
  }
  console.log('PASS: both sides of all eight sleeves, clear flower crown, flower drag, handoff and archive, desktop and mobile');
 } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
