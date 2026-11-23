const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1320,height:960},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve('index.html'),{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(450);
  const wraps=['kraft','linen','velvet','savanna','baobab','kilimanjaro','zanzibar'];
  const records=await page.evaluate((wraps)=>{
    state.started=true;
    state.day=0;
    state.finished=false;
    state.last=null;
    flowStep=1;flowMax=1;
    state.chosen=['rose','tulip','sun','lav','peony','lily','calla'];
    state.positions=state.chosen.map(()=>null);
    state.harmonyVariant=-1;
    for(const id of state.chosen)state.stock[id]=Math.max(5,state.stock[id]||0);
    const wrap=document.getElementById('wrap');
    const formats=[...wrap.options].map(o=>o.value);
    const missing=wraps.filter(w=>!formats.includes(w));
    if(missing.length)throw Error('Missing wrapper options: '+missing.join(','));
    const format=document.getElementById('arrangementType');
    format.value='bouquet';
    document.getElementById('startScreen')?.classList.add('hidden');
    switchTab('work');
    if(typeof renderFlow==='function')renderFlow();
    const records=[];
    for(const key of wraps){
      wrap.value=key;
      render();
      const bouquet=document.getElementById('bouquet');
      const nodes=[...bouquet.querySelectorAll('.flower-head.ftz211-unified-bloom')];
      if(nodes.length!==state.chosen.length)throw Error('Wrong flower count '+key+' '+nodes.length);
      const geometry=nodes.map(el=>({
        top:el.style.top,left:el.style.left,transform:el.style.transform,
        width:el.style.getPropertyValue('--fw'),height:el.style.getPropertyValue('--fh'),
        z:el.style.zIndex
      }));
      const front=bouquet.querySelector('.handoff-paper-front.approved-african-pack-overlay');
      const back=bouquet.querySelector('.handoff-paper-back.approved-african-pack');
      if(!front||!back)throw Error('Missing physical wrapper layers '+key);
      const img=front.querySelector('.approved-african-pack-art');
      records.push({wrap:key,geometry,images:nodes.map(el=>[...el.querySelectorAll('img')].map(i=>i.src)),
        frontOpacity:getComputedStyle(front).opacity,frontBlend:getComputedStyle(front).mixBlendMode,
        frontClip:getComputedStyle(front).clipPath,frontClass:front.className,
        material:getComputedStyle(front,'::after').backgroundImage,
        imageSrc:img?.src||'',markup:bouquet.innerHTML.length});
    }
    return records;
  },wraps);
  assert.equal(records.length,7);
  const canonical=records[0].geometry;
  for(const r of records){
    assert.deepEqual(r.geometry,canonical,'Bouquet layout changes when wrapper is '+r.wrap);
    assert.equal(r.frontOpacity,'1','Front may not be translucent '+r.wrap);
    assert.equal(r.frontBlend,'normal');
    assert(r.imageSrc.startsWith('data:image/'),'Missing authentic artwork '+r.wrap);
    assert(r.frontClip!=='none','Missing front clipping '+r.wrap);
  }
  assert.notEqual(records[0].material,records[1].material,'Linen has same finish as kraft');
  assert.notEqual(records[1].material,records[2].material,'Velvet has same finish as linen');
  assert.notEqual(records[3].material,'none','African fold shading missing');
  // Persist selected wrap and manual flower arrangements during wrapper switching.
  await page.evaluate(()=>{
    document.getElementById('wrap').value='kraft';
    state.positions[0]={x:17,y:24,r:9,scale:1.11};
    render();
    document.getElementById('wrap').value='zanzibar';
    render();
  });
  const manual=await page.evaluate(()=>({
    pos:state.positions[0],
    node:document.querySelector('#bouquet .ftz211-unified-bloom')?.style.left
  }));
  console.log('manual floral position diagnostic',JSON.stringify(manual));
  assert.equal(manual.pos.x,17);
  assert(manual.node.includes('17px'),'Manual positions lost on wrap switch');
  fs.mkdirSync('features/qa-v211',{recursive:true});
  // Restore default positions and render exact same bouquet seven times.
  await page.evaluate(()=>{state.positions=state.chosen.map(()=>null);render();});
  for(const key of wraps){
    await page.evaluate(k=>{document.getElementById('wrap').value=k;render();},key);
    await page.waitForTimeout(100);
    const element=page.locator('#bouquet');
    if(await element.isVisible()){
      await element.screenshot({path:'features/qa-v211/'+key+'.png',animations:'disabled',timeout:20000});
    }
  }
  // Mobile + basket regression: no orphan styles, normal basket behavior unchanged.
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>{
    document.getElementById('wrap').value='velvet';
    render();
    return {flowerCount:document.querySelectorAll('#bouquet .ftz211-unified-bloom').length,
      overflow:document.documentElement.scrollWidth>innerWidth+3};
  });
  assert.equal(mobile.flowerCount,7);
  assert.equal(mobile.overflow,false,'Mobile horizontal overflow');
  const basket=await page.evaluate(()=>{
    document.getElementById('arrangementType').value='basket';
    render();
    return {markup:renderBouquet(),flowers:document.querySelectorAll('#bouquet .basket-seated').length};
  });
  assert(basket.markup.includes('ftz-basket'));
  assert.equal(basket.flowers,7);
  assert.equal(errors.length,0,'Browser errors: '+errors.slice(0,5).join(' | '));
  console.log('PASS: 7 identical arrangements; opaque masks; textured materials; manually moved blooms; mobile; basket',records.map(r=>r.wrap));
  await browser.close();
})().catch(err=>{console.error(err);process.exit(1)});
