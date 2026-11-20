const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path=require('node:path');
(async () => {
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve('index.html'),{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(1000);
  const test=await page.evaluate(() => {
    if (!window.FTZRarePlantation) throw new Error('Plantation controller missing');
    if (!window.FloristRarePlantation) throw new Error('Plantation game logic missing');
    if (!types.some(x=>x.id==='rare-protea-royal')) throw new Error('Rare type missing');
    if (!document.querySelector('#ftzRarePlantation')) throw new Error('Plantation UI missing');
    if (!document.querySelector('#upgradeGrid')) throw new Error('Upgrades missing');
    state.started=true; state.upgrades.nursery=true;
    state.last=null; state.finished=false;
    render();
    const first='rare-protea-royal';
    state.availability[first]=true;
    const oldMoney=state.money, oldStock=state.stock[first];
    buyStem(first,1);
    if (state.money!==oldMoney || state.stock[first]!==oldStock) throw Error('Rare flowers purchasable at market');
    if (document.getElementById('marketGrid').innerHTML.includes('Королевская протея')) throw Error('Rare flowers visible in market');
    const farm=FTZR();
    function FTZR(){return window.FTZRarePlantation.plantation;}
    farm.plant(0,first);
    const oldNow=Date.now;
    Date.now=()=>oldNow()+30*60*1000;
    try {
      FTZRarePlantation.refresh();
      if (!document.querySelector('[data-ftz-harvest="0"]:not([disabled])')) throw Error('Harvest button never activated');
      farm.harvest(0);
    } finally {Date.now=oldNow;}
    render();
    if (state.stock[first]!==oldStock+1) throw Error('Harvest not in game inventory');
    if (!state.flowerLots[first] || state.flowerLots[first].length!==1) throw Error('No freshness lot for harvest');
    if (!state.stockCosts[first] || state.stockCosts[first].length!==1) throw Error('No stock cost entry');
    flowStep=1;flowMax=1;
    choose(first);
    if (!state.chosen.includes(first)) throw Error('Rare stem cannot be added to bouquet');
    const bouquet=renderBouquet();
    if (!bouquet || bouquet.length < 50) throw Error('Bouquet not rendered');
    document.getElementById('arrangementType').value='basket';
    const basket=renderBouquet();
    if (!basket || basket.length < 50) throw Error('Basket not rendered');
    document.getElementById('arrangementType').value='bouquet';
    if (typeof ftzSaveNow==='function')ftzSaveNow();
    return {rareStock:state.stock[first],chosen:state.chosen.length,
      lotCount:state.flowerLots[first].length,bouquetChars:bouquet.length,basketChars:basket.length,
      saved:!!localStorage.getItem(FTZ_SAVE_KEY)};
  });
  if (errors.length) throw Error('Browser JS errors: '+errors.slice(0,6).join(' | '));
  assert.equal(test.saved,true);
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.locator('#ftzRarePlantation').isVisible();
  assert.equal(mobile,true);
  await browser.close();
  console.log('PASS: market lockout, planting, harvesting, inventory, bouquet, basket, save, mobile',test);
})().catch(e=>{console.error(e);process.exit(1)});
