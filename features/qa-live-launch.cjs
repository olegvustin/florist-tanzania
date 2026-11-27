const {chromium}=require('playwright');
const fs=require('fs');
const sites=[
 {name:'GitHub Pages',url:'https://olegvustin.github.io/florist-tanzania/'},
 {name:'Tilda',url:'https://florist-tanzania.tilda.ws/'}
];
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const output=[];
 for(const site of sites){
  const page=await browser.newPage({viewport:{width:1366,height:850},ignoreHTTPSErrors:true});
  const issues=[];
  page.on('pageerror',e=>issues.push(String(e.message).slice(0,250)));
  page.on('requestfailed',r=>{if(issues.length<12)issues.push(r.url().slice(0,130)+' '+r.failure()?.errorText)});
  const result={site:site.name,url:site.url,errors:issues};
  try{
   const response=await page.goto(site.url,{waitUntil:'domcontentloaded',timeout:100000});
   result.http=response?.status()??null;
   result.title=await page.title();
   await page.waitForTimeout(11000);
   const frames=page.frames();
   result.frames=frames.map(f=>({url:f.url().slice(0,200)}));
   result.iframeCount=await page.locator('iframe').count();
   result.observed=[];
   for(const frame of frames){
    try{
     const d=await frame.evaluate(()=>({
      title:document.title,ready:document.readyState,
      bodyLen:document.body?.innerText?.length||0,
      start:!!document.getElementById('startScreen'),
      startVisible:(()=>{const el=document.getElementById('startScreen');return !!el&&!el.classList.contains('hidden')&&getComputedStyle(el).display!=='none';})(),
      gameTabs:['tab-work','tab-shop','tab-journal','tab-rules'].map(id=>!!document.getElementById(id)),
      composer:!!document.getElementById('bouquet'),
      firstText:document.body?.innerText?.slice(0,200)||''
     }));
     result.observed.push({frameUrl:frame.url().slice(0,180),...d});
    }catch(e){result.observed.push({frameUrl:frame.url().slice(0,180),error:String(e.message).slice(0,150)})}
   }
   for(const frame of frames){
    let t;try{t=await frame.evaluate(()=>document.getElementById('startScreen')!==null)}catch{continue}
    if(!t)continue;
    result.gameFrame=frame.url();
    const begin=await frame.evaluate(()=>{
     if(typeof startGame==='function'){startGame();return 'startGame'}
     return 'no startGame'
    }).catch(e=>'startGame failed '+e.message);
    result.startAttempt=begin;
    await page.waitForTimeout(1000);
    result.afterStart=await frame.evaluate(()=>({
      started:typeof state!=='undefined'&&state.started,
      startHidden:document.getElementById('startScreen')?.classList.contains('hidden'),
      workVisible:(()=>{const e=document.getElementById('work');return !!e&&!e.classList.contains('hidden')})(),
      bouquetPresent:!!document.getElementById('bouquet')
    })).catch(e=>({error:e.message}));
    break;
   }
  }catch(e){result.error=String(e.message).slice(0,450)}
  output.push(result);
  await page.close();
 }
 await browser.close();
 fs.writeFileSync('features/live-launch-report.json',JSON.stringify(output,null,2));
 console.log(JSON.stringify(output,null,2));
 if(output.some(x=>x.error||x.http!==200||!x.gameFrame||!x.afterStart?.workVisible)){
   console.error('Live game launch check incomplete or failed');
   process.exitCode=1;
 }
})().catch(e=>{console.error(e);process.exit(1)});
