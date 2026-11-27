const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const file=require('node:url').pathToFileURL(require('node:path').resolve('index.html')).href;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FTZ_CHROMIUM||undefined,args:['--no-sandbox']});
 try{
 for(const width of [1320,390]){
  const p=await browser.newPage({viewport:{width,height:900}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(file,{waitUntil:'domcontentloaded',timeout:90000});
  const setup=await p.evaluate(()=>{
    state.started=true;state.day=0;state.finished=false;state.last=null;
    flowStep=1;flowMax=1;state.chosen=['rose','sun','agapanthusWhite','tulip'];state.positions=[null,null,null,null];
    for(const id of state.chosen)state.stock[id]=10;
    $('arrangementType').value='bouquet';$('wrap').value='kraft';
    $('greenery').value='none';$('note').value='none';$('decor').value='none';
    $('startScreen').classList.add('hidden');switchTab('work');renderFlow();syncExtras();
    return {day:state.day,installed:state.upgrades.premiumPack,money:state.money,price:price(),budget:budgetLimit()};
  });
  assert.equal(setup.day,0);assert.equal(setup.installed,false);
  assert.equal(await p.locator('#wrap option[value="signature"]').evaluate(n=>n.disabled),false);
  const card=p.locator('[data-ftz-wrap="signature"]');
  await p.locator('#ftzWrapDisclosure').evaluate(n=>{n.open=true});
  assert(await card.isVisible());assert(await card.isEnabled());assert.match(await card.innerText(),/Премиум-шёлк/);
  assert.match(await card.innerText(),/\+12/);
  // First, show the normal budget guard works when there is not enough room.
  await p.evaluate(amount=>{stories[state.day].budget+=amount-budgetLimit()},setup.price+11);
  await card.click();
  assert.equal(await p.locator('#wrap').inputValue(),'kraft');
  await p.evaluate(budget=>{stories[state.day].budget+=budget-budgetLimit();render()},Math.max(75,setup.budget));
  await card.click();
  const pick=await p.evaluate(async()=>{
    const root=$('bouquet'),front=root.querySelector('.handoff-paper-front.classic-material-signature');
    const art=front?.querySelector('img');if(art)await art.decode();
    return {wrap:$('wrap').value,money:state.money,price:price(),installed:state.upgrades.premiumPack,
      art:!!art&&art.src===TZ_APPROVED_PACK_IMAGES.signature&&art.src!==TZ_APPROVED_PACK_IMAGES.velvet,
      layer:!!root.querySelector('.ftz214-plant-bed[data-sleeve="signature"]'),opacity:front&&getComputedStyle(front).opacity};
  });
  assert.deepEqual(pick,{wrap:'signature',money:setup.money,price:setup.price+12,installed:false,art:true,layer:true,opacity:'1'});
  const next=p.locator('#ftz193Toolbar [data-action="next"]');
  for(let preset=0;preset<3;preset++){
   await next.click();
   assert.equal(await p.evaluate(()=>state.harmonyVariant),preset);
   assert.equal(await p.locator('#wrap').inputValue(),'signature');
   if(process.env.FTZ_SCREENSHOT_DIR)
    await p.locator('#bouquet').screenshot({path:process.env.FTZ_SCREENSHOT_DIR+'/'+width+'-silk-'+preset+'.png'});
  }
  const delivered=await p.evaluate(()=>{
    deliver();
    const entry=state.history[0];
    return {wrap:entry?.bouquetSpec?.extras?.wrap??entry?.bouquetSpec?.wrap,
      visible:!!$('feedback').querySelector('.classic-material-signature'),
      restored:ftzRebuildBouquet(entry?.bouquetSpec).includes('classic-material-signature')};
  });
  assert.deepEqual(delivered,{wrap:'signature',visible:true,restored:true});
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('PASS: silk from day one, +12 charge and budget guard, correct distinct artwork, all presets, handoff/archive, desktop and mobile');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
