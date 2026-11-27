const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const file=name=>require('node:url').pathToFileURL(path.resolve(name)).href;
const wraps=['kraft','linen','velvet','signature','savanna','baobab','kilimanjaro','zanzibar'];
const examples=[
 ['rose','rose','sun','tulip','agapanthusWhite','calla'],
 ['rose'],['calla','watsonia','tulip','lily'],
 ['sun','rose','tulip','daisy','lav','peony','iris','lily']
];
(async()=>{
 const b=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try{
 for(const width of [1320,390]){
  assert(fs.existsSync('baseline.html'),'Create baseline.html from the preceding version');
  const before=await b.newPage({viewport:{width,height:900}});
  const after=await b.newPage({viewport:{width,height:900}});
  const errors=[];after.on('pageerror',e=>errors.push(e.message));
  for(const [p,name] of [[before,'baseline.html'],[after,'index.html']]){
   await p.goto(file(name),{waitUntil:'domcontentloaded',timeout:90000});
   await p.evaluate(chosen=>{
    state.upgrades.premiumPack=true;state.started=true;state.day=0;state.finished=false;state.last=null;
    flowStep=1;flowMax=1;state.chosen=chosen;state.positions=chosen.map(()=>null);
    for(const id of chosen)state.stock[id]=10;
    $('arrangementType').value='bouquet';$('greenery').value='none';$('note').value='none';$('decor').value='none';
    $('startScreen').classList.add('hidden');switchTab('work');renderFlow();
   },examples[0]);
  }
  const probe=async(p)=>p.evaluate(({wraps,examples})=>examples.map(chosen=>{
   state.chosen=chosen;state.positions=chosen.map(()=>null);state.harmonyVariant=-1;
   return [...wraps,'basket'].map(w=>{
    $('arrangementType').value=w==='basket'?'basket':'bouquet';
    if(w!=='basket')$('wrap').value=w;
    return {defaults:FTZ193.solve(-1),presets:[0,1,2].map(v=>FTZ193.solve(v))};
   });
  }),{wraps,examples});
  const v0=await probe(before),v1=await probe(after);
  for(let i=0;i<examples.length;i++) for(let j=0;j<wraps.length+1;j++){
   assert.deepEqual(v1[i][j].defaults,v0[i][j].defaults,'Default layout unchanged');
   if(j===wraps.length){assert.deepEqual(v1[i][j],v0[i][j],'Baskets unchanged');continue;}
   for(let v=0;v<3;v++){
    const bas=v0[i][j].presets[v],newPos=v1[i][j].presets[v];
    assert.equal(newPos.length,examples[i].length);
    assert(newPos.some((p,k)=>p.y>bas[k].y+2),wraps[j]+' preset '+v+' should sit lower');
    for(let k=0;k<newPos.length;k++){
     const a=newPos[k],o=bas[k];
     assert.deepEqual({...a,y:o.y},o,'The styles keep their widths, rotations and depth order');
     assert(a.y>=o.y&&a.y<=o.y+14.01&&a.y<=108);
    }
   }
  }
  await after.evaluate(chosen=>{
   state.chosen=chosen;state.positions=chosen.map(()=>null);state.harmonyVariant=-1;
   $('arrangementType').value='bouquet';$('wrap').value='linen';render();
  },examples[0]);
  const button=after.locator('#ftz193Toolbar [data-action="next"]');
  for(let v=0;v<3;v++){
   await button.click();
   const view=await after.evaluate(()=>({style:state.harmonyVariant,positions:state.positions,
    tops:[...$('bouquet').querySelectorAll('.blossom[data-i]')].map(n=>parseFloat(n.style.top)),
    clip:getComputedStyle($('bouquet').querySelector('.ftz214-plant-bed')).clipPath}));
   assert.equal(view.style,v);
   assert.deepEqual(view.positions,v1[0][1].presets[v]);
   assert.equal(view.tops.length,examples[0].length);
   assert(view.clip.startsWith('polygon('));
  }
  const prev=await after.evaluate(()=>state.positions[0].y);
  const flower=after.locator('#bouquet .blossom[data-i="0"]');
  await flower.press('ArrowDown');
  assert.equal(await after.evaluate(()=>state.positions[0].y),+(prev+3).toFixed(2),'Manual adjustment remains available');
  await after.locator('#ftz193Toolbar [data-action="undo"]').click();
  assert.equal(await after.evaluate(()=>state.positions[0].y),prev);
  const final=await after.evaluate(()=>{
   const expected=JSON.stringify(state.positions);
   deliver();
   const spec=state.history[0]?.bouquetSpec;
   return {
    positions:JSON.stringify(spec?.positions),
    expected,
    rendered:!!$('feedback').querySelector('.ftz214-plant-bed')
   };
  });
  assert.equal(final.positions,final.expected);
  assert(final.rendered);
  assert.deepEqual(errors,[]);
  await before.close();await after.close();
 }
 console.log('PASS: three presets, eight sleeves, four bouquet sizes, desktop/mobile, manual edit, undo and handoff; basket and defaults unchanged');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
