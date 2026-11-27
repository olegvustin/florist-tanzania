const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const file=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;
const greens=['asparagus','palm','fern'];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try{
  for(const width of [1320,390]){
   const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(file,{waitUntil:'domcontentloaded',timeout:90000});
   await p.evaluate(()=>{
    state.started=true;state.day=0;state.finished=false;state.last=null;flowStep=1;flowMax=1;
    state.chosen=['tulip','agapanthusWhite','rose'];state.positions=[null,null,null];
    for(const f of state.chosen)state.stock[f]=10;
    $('arrangementType').value='bouquet';$('wrap').value='linen';$('greenery').value='none';$('note').value='none';$('decor').value='none';
    $('startScreen').classList.add('hidden');switchTab('work');renderFlow();
   });
   const distinct=[];
   for(const wrap of ['linen','signature','savanna','basket']){
    for(const green of ['none',...greens]){
     const summary=await p.evaluate(async({wrap,green})=>{
      $('arrangementType').value=wrap==='basket'?'basket':'bouquet';$('wrap').value=wrap==='basket'?'linen':wrap;
      $('greenery').value=green;render();
      const root=$('bouquet'),nodes=[...root.querySelectorAll('.ftz218-green-art')];
      if(!nodes.length)return {n:0,total:price()};
      const svg=nodes[0],img=new Image();img.src=svg.querySelector('image').getAttribute('href');await img.decode();
      const canvas=document.createElement('canvas');canvas.width=290;canvas.height=286;
      const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,290,286);
      const {data}=ctx.getImageData(0,0,290,286);let solid=0,hash=0;
      for(let i=3;i<data.length;i+=4)if(data[i]>220){solid++;hash=(Math.imul(hash,31)+(data[i-2]<<1)+(i>>>2))>>>0;}
      const preview=new Image();preview.src=greeneryPreviewImage(green);await preview.decode();
      return {n:nodes.length,total:price(),solid,hash,preview:preview.naturalWidth>0,
       layer:getComputedStyle(svg.parentElement).display,
       tucked:wrap==='basket'||!!svg.closest('.ftz214-plant-bed'),selected:svg.parentElement.dataset.greenery};
     },{wrap,green});
     if(green==='none'){assert.equal(summary.n,0);distinct[0]=summary.total;continue;}
     assert.equal(summary.n,1);assert.equal(summary.selected,green);
     assert.equal(summary.total,distinct[0]+(green==='fern'?2:3));
     assert(summary.solid>300,green+' leaf blades must be genuinely opaque, not outlines: '+summary.solid);
     assert(summary.preview&&summary.tucked&&summary.layer==='block');
     if(wrap==='linen')distinct.push(summary.hash);
    }
   }
   assert.equal(new Set(distinct.slice(1)).size,3);
   await p.evaluate(()=>{$('arrangementType').value='bouquet';$('wrap').value='linen';$('greenery').value='palm';render()});
   const result=await p.evaluate(()=>{
    deliver();
    return {shown:$('feedback').querySelectorAll('.ftz218-green-art').length,
     rebuild:ftzRebuildBouquet(state.history[0]?.bouquetSpec).includes('ftz218-green-art')};
   });
   assert.deepEqual(result,{shown:1,rebuild:true});
   assert.deepEqual(errors,[]);await p.close();
  }
  console.log('PASS: three filled foliage silhouettes, transparent cutouts, previews, all prices, no duplicate layers, packaging, baskets and delivery in desktop/mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
