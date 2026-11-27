const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const wraps=['kraft','linen','velvet','signature','savanna','baobab','kilimanjaro','zanzibar'];
const file='file://'+path.resolve('index.html');
const out=process.env.FTZ_SCREENSHOTS;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try {
 for(const size of [{width:1320,height:960},{width:390,height:844}]){
  const p=await browser.newPage({viewport:size});
  const errors=[]; p.on('pageerror',e=>errors.push(e.message));
  await p.goto(file,{waitUntil:'domcontentloaded',timeout:90000});
  await p.evaluate(()=>{
   state.started=true;state.day=0;state.finished=false;state.last=null;flowStep=1;flowMax=1;
   state.chosen=['rose','tulip','sun','lav','peony','lily','calla'];state.positions=state.chosen.map(()=>null);
   state.harmonyVariant=-1;
   for(const id of state.chosen)state.stock[id]=Math.max(5,state.stock[id]||0);
   $('arrangementType').value='bouquet'; $('greenery').value='fern';$('note').value='thanks';$('decor').value='ribbon';
   $('startScreen').classList.add('hidden');switchTab('work');renderFlow();
  });
  let baseline;const cuts={};
  for(const wrap of wraps){
   const data=await p.evaluate(async key=>{
    $('wrap').value=key;render();
    const root=$('bouquet'),front=root.querySelector('.handoff-paper-front'),back=root.querySelector('.handoff-paper-back');
    const blade=front.querySelector('.ftz213-front-image');
    const backArt=back.querySelector('img');
    const flowers=[...root.querySelectorAll('.ftz211-unified-bloom')];
    await backArt.decode();
    const c=document.createElement('canvas');c.width=backArt.naturalWidth;c.height=backArt.naturalHeight;
    const ctx=c.getContext('2d');ctx.drawImage(backArt,0,0);
    const alpha=(x,y)=>ctx.getImageData(Math.floor(c.width*x),Math.floor(c.height*y),1,1).data[3];
    const z=x=>Number(getComputedStyle(x).zIndex);
    return {
     classes:front.className,
     fakeOverlay:getComputedStyle(front,'::after').content,
     fakeBack:getComputedStyle(back,'::after').content,
     opacity:getComputedStyle(front).opacity,
     frontAbove:flowers.every(n=>z(n)<z(front)&&z(back)<z(n)),
     greenery:!!root.querySelector('.ftz-paper-selected-green'),
     accessories:[...root.children].filter(n=>n!==front&&n!==back&&!n.matches('.flower-head,.ftz-paper-selected-green,.ftz-pocket-layers')).length,
     cut:blade?getComputedStyle(blade).clipPath:null,
     sameArtwork:!blade||blade.href.baseVal===backArt.getAttribute('src'),
     alpha:[alpha(.97,.76),alpha(.94,.88),alpha(.5,.55)],
     geometry:flowers.map(n=>[n.style.top,n.style.left,n.style.transform]),
     overflow:document.documentElement.scrollWidth>innerWidth+3
    };
   },wrap);
   assert.equal(data.fakeOverlay,'none',wrap);assert.equal(data.fakeBack,'none',wrap);
   assert.equal(data.opacity,'1',wrap);assert(data.frontAbove,wrap);assert(data.greenery,wrap);assert(data.accessories>0,wrap);
   assert(data.sameArtwork,wrap);assert.deepEqual(data.alpha.slice(0,2),[0,0],wrap);
   assert(data.alpha[2]>=200,wrap);assert.equal(data.geometry.length,7,wrap);
   assert.equal(data.overflow,false,wrap);
   baseline??=data.geometry;assert.deepEqual(data.geometry,baseline,wrap);
   if(wrap==='kraft'||wrap==='linen'){
    assert(data.cut?.startsWith('polygon('),wrap);cuts[wrap]=data.cut;
   }
   if(out&&['kraft','linen','velvet','zanzibar'].includes(wrap)){
    fs.mkdirSync(out,{recursive:true});
    await p.locator('#bouquet').screenshot({path:path.join(out,size.width+'-'+wrap+'.png'),animations:'disabled'});
   }
  }
  assert.notEqual(cuts.kraft,cuts.linen);
  for(const wrap of ['kraft','linen','zanzibar']){
   const sent=await p.evaluate(k=>{
    flowStep=1;flowMax=1;state.last=null;state.finished=false;state.history=[];
    state.chosen=['rose','tulip','lav'];state.positions=state.chosen.map(()=>null);
    for(const id of state.chosen)state.stock[id]=5;
    $('wrap').value=k;$('note').value='none';$('decor').value='none';
    render(); const original=$('bouquet').querySelector('.handoff-paper-front').className;
    deliver();
    return {original,history:state.history.length,result:!!$('feedback').querySelector('.delivery-result-screen'),
      archived:state.history[0]?.bouquetMarkup?.includes(original)};
   },wrap);
   assert.equal(sent.history,1,wrap);assert(sent.result&&sent.archived,wrap);
  }
  await p.evaluate(()=>{flowStep=1;state.last=null;state.finished=false; $('arrangementType').value='basket';render()});
  assert.equal(await p.locator('#bouquet .ftz-basket-front').count(),1);
  assert.equal(await p.locator('#bouquet .ftz213-classic-front').count(),0);
  assert.deepEqual(errors,[]);
  await p.close();
 }
 console.log('PASS: all eight wraps, alpha and bouquet geometry, accessories, kraft/linen/Zanzibar handoff, basket, desktop and mobile');
 } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
