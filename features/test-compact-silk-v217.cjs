const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=name=>require('node:url').pathToFileURL(require('node:path').resolve(name)).href;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try{
  for(const width of [1320,390]){
   const read=async(file)=>{
    const p=await browser.newPage({viewport:{width,height:900}});
    const errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(url(file),{waitUntil:'domcontentloaded',timeout:90000});
    await p.evaluate(()=>{
     state.started=true;state.day=0;state.finished=false;state.last=null;
     flowStep=1;flowMax=1;state.chosen=['rose','sun','agapanthusWhite','tulip'];state.positions=[null,null,null,null];
     for(const id of state.chosen)state.stock[id]=10;
     $('arrangementType').value='bouquet';$('wrap').value='kraft';$('greenery').value='none';$('note').value='none';$('decor').value='none';
     $('startScreen').classList.add('hidden');switchTab('work');renderFlow();syncExtras();
    });
    const stats={};
    for(const wrap of ['velvet','signature']){
     await p.evaluate(w=>{$('wrap').value=w;render()},wrap);
     await p.locator('#ftz193Toolbar [data-style="0"]').click();
     stats[wrap]=await p.evaluate(async()=>{
      const root=$('bouquet'),back=root.querySelector('.handoff-paper-back'),front=root.querySelector('.handoff-paper-front');
      const rect=el=>{const r=el.getBoundingClientRect(),scene=root.getBoundingClientRect();return [r.x-scene.x,r.y-scene.y,r.width,r.height]};
      const ib=back.querySelector('img'),ifr=front.querySelector('img');await Promise.all([ib.decode(),ifr.decode()]);
      const scale=el=>{const m=new DOMMatrix(getComputedStyle(el).transform);return [m.a,m.d]};
      const sprouts=[...root.querySelectorAll('.blossom')].map(e=>[e.style.left,e.style.top,e.style.transform]);
      return {back:rect(ib),front:rect(ifr),backScale:scale(back),frontScale:scale(front),
        imageMatch:ib.src===ifr.src,sprouts,positions:state.positions,clip:getComputedStyle(root.querySelector('.ftz214-plant-bed')).clipPath};
     });
     if(process.env.FTZ_SCREENSHOT_DIR)
      await p.locator('#bouquet').screenshot({path:process.env.FTZ_SCREENSHOT_DIR+'/'+width+'-'+file+'-'+wrap+'.png'});
    }
    assert.deepEqual(errors,[]);
    await p.close();return stats;
   };
   const before=await read('baseline.html'),after=await read('index.html');
   assert.deepEqual(after.velvet,before.velvet,'Do not change velvet');
   const old=before.signature,cur=after.signature;
   assert.deepEqual(cur.positions,old.positions);
   assert.deepEqual(cur.sprouts,old.sprouts);
   assert(cur.imageMatch);
   assert.deepEqual(cur.backScale,cur.frontScale);
   assert.notEqual(cur.clip,old.clip);
   assert(cur.back[2]<old.back[2]*.92&&cur.back[3]<old.back[3]*.91);
   assert(cur.front[2]<old.front[2]*.92&&cur.front[3]<old.front[3]*.91);
  }
  console.log('PASS: silk front and back both compact, flowers and velvet unchanged, desktop and mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
