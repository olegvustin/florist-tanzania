const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('path');
const wraps=['savanna','baobab','kilimanjaro','zanzibar'];
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1320,height:960}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+path.resolve('index.html'),{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(350);
const results=await page.evaluate((wraps)=>{
  state.started=true;state.day=0;state.finished=false;state.last=null;
  flowStep=1;flowMax=1;
  state.chosen=['rose','tulip','sun','lav','peony','lily','calla'];
  state.positions=state.chosen.map(()=>null);
  for(const id of state.chosen)state.stock[id]=Math.max(5,state.stock[id]||0);
  document.getElementById('arrangementType').value='bouquet';
  document.getElementById('startScreen')?.classList.add('hidden');
  switchTab('work');renderFlow();
  const out=[];
  for(const wrap of wraps){
    document.getElementById('wrap').value=wrap;render();
    const bouquet=document.getElementById('bouquet');
    const front=bouquet.querySelector('.handoff-paper-front.ftz212-african-front');
    const back=bouquet.querySelector('.handoff-paper-back.ftz212-african-back');
    if(!front||!back)throw Error('No front/back '+wrap);
    const flowerNodes=[...bouquet.querySelectorAll('.flower-head.ftz211-unified-bloom')];
    const frontImage=front.querySelector('img');
    const alpha=(()=>{const c=document.createElement('canvas');c.width=frontImage.naturalWidth;c.height=frontImage.naturalHeight;
      const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(frontImage,0,0);
      const pix=(x,y)=>ctx.getImageData(Math.floor(c.width*x),Math.floor(c.height*y),1,1).data[3];
      return {corner:pix(.97,.76),bottomRight:pix(.94,.88),core:pix(.50,.60)};})();
    out.push({wrap,alpha,count:flowerNodes.length,
      geometry:flowerNodes.map(el=>({left:el.style.left,top:el.style.top,transform:el.style.transform})),
      opacity:getComputedStyle(front).opacity,
      clip:getComputedStyle(front).clipPath,
      frontZ:getComputedStyle(front).zIndex,
      background:getComputedStyle(back).backgroundColor});
  }
  return out;
},wraps);
assert.equal(results.length,4);
for(const r of results){
  assert.equal(r.count,7);
  assert.equal(r.opacity,'1');
  assert(r.clip.includes('48%'),'New central front overlap not present '+r.wrap);
  assert.equal(r.alpha.corner,0,'Background matte remains at lower right '+r.wrap);
  assert.equal(r.alpha.bottomRight,0,'Background matte remains around knot '+r.wrap);
  assert(r.alpha.core>=200,'Central wrapper was erased '+r.wrap);
  assert.deepEqual(r.geometry,results[0].geometry,'Flower arrangement changed '+r.wrap);
}
await page.setViewportSize({width:390,height:844});
await page.evaluate(()=>{document.getElementById('wrap').value='zanzibar';render()});
assert.equal(await page.locator('#bouquet .ftz211-unified-bloom').count(),7);
assert.equal(errors.length,0,'JS exceptions '+errors.join(' | '));
console.log('PASS: clean PNG backgrounds, four opaque front layers, raised flap, uniform flower placement, mobile');
console.log(results.map(({wrap,alpha,frontZ})=>({wrap,alpha,frontZ})));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
