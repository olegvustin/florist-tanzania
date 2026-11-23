/* Флорист. Танзания — конкурсы флористов, deterministic scoring. */
(function(root){
'use strict';
const CONTESTS=[
 {day:5,id:'village',title:'Цветы моей деревни',subtitle:'Тёплое сердце Танзании',theme:'Традиции, забота и естественность',tags:['care','sincere','calm','hope'],minRep:0,fee:30,
 rivals:[{name:'Аша Мвиньи',style:'Тёплый деревенский букет',flowers:['🌺','🌼','🌿'],score:68},
         {name:'Джума Касим',style:'Минимализм саванны',flowers:['🌸','🌿','🌼'],score:58},
         {name:'Неема Бакари',style:'Семейная традиция',flowers:['🌺','🌻','🍃'],score:77}]},
 {day:12,id:'savanna',title:'Краски саванны',subtitle:'Яркость, свобода и движение',theme:'Контрастные оттенки, смелая форма',tags:['joy','hope','passion','love'],minRep:0,fee:30,
 rivals:[{name:'Аша Мвиньи',style:'Золото заката',flowers:['🌻','🌺','🌾'],score:76},
         {name:'Джума Касим',style:'Экспрессивная стрелиция',flowers:['🌼','🍂','🌸'],score:84},
         {name:'Неема Бакари',style:'Огненная саванна',flowers:['🌺','🌻','🌸'],score:70}]},
 {day:19,id:'grand-prix',title:'Гран-при Танзании',subtitle:'Лучший флорист фестиваля',theme:'Техника, редкость и гармония',tags:['love','hope','care','joy'],minRep:0,fee:30,
 rivals:[{name:'Аша Мвиньи',style:'Королевские цветы',flowers:['🌺','🌿','🌼'],score:87},
         {name:'Джума Касим',style:'Цветочная скульптура',flowers:['🌸','🌻','🍃'],score:80},
         {name:'Неема Бакари',style:'Дыхание Занзибара',flowers:['🌼','🌺','🌿'],score:92}]}
];
const PRIZES=[{money:150,rep:15,label:'Золотой кубок'}, {money:80,rep:8,label:'Серебряная медаль'},
 {money:40,rep:4,label:'Бронзовая медаль'}, {money:0,rep:0,label:'Диплом участника'}];
const clamp=(value,max)=>Math.min(max,Math.max(0,Math.round(value)));
function contestForDay(day){return CONTESTS.find(c=>c.day===day)||null;}
function score(payload,contest){
 if(!contest)throw Error('Конкурс не найден');
 const flowers=payload.flowers||[];
 if(flowers.length<4)throw Error('Для конкурса нужно не менее четырёх цветов');
 const distinct=new Set(flowers.map(f=>f.id)).size;
 if(distinct<2)throw Error('Для конкурса нужно минимум два сорта');
 const tags=flowers.flatMap(f=>f.tags||[]);
 const common=contest.tags.reduce((total,tag)=>total+Math.min(2,tags.filter(t=>t===tag).length),0);
 const palette=flowers.map(f=>f.id);
 const coherent=tags.filter(t=>tags.filter(a=>a===t).length>=2).length;
 const harmony=clamp(9+Math.min(distinct,5)*2+Math.min(4,coherent)+ (flowers.length>=5&&flowers.length<=8?3:0),25);
 const originality=clamp(5+Math.min(distinct,5)*3+(payload.decorCount||0)*2+
      (payload.format==='basket'?2:0)+(payload.customPositions?3:0),25);
 const topic=clamp(4+Math.min(16,common*3),20);
 const craftsmanship=clamp(5+Math.min(6,flowers.length)+
      (payload.greenery&&payload.greenery!=='none'?3:0)+
      (payload.wrap&&payload.wrap!=='kraft'?2:0)+
      Math.min(payload.decorCount||0,2)*2+(payload.customPositions?2:0),20);
 const premiumCount=flowers.filter(f=>f.plantationOnly||f.rarity==='premium').length;
 const rareCount=flowers.filter(f=>f.rarity==='rare').length;
 const rarity=clamp(premiumCount*4+rareCount*2+(flowers.some(f=>f.plantationOnly)?2:0),10);
 const scores={harmony,originality,topic,craftsmanship,rarity};
 const total=Object.values(scores).reduce((a,b)=>a+b,0);
 const rivals=contest.rivals.map(r=>({name:r.name,style:r.style,flowers:[...r.flowers],score:r.score}));
 const rank=1+rivals.filter(r=>r.score>=total).length;
 return {scores,total,rank,prize:{...PRIZES[rank-1]},rivals,flowerIds:[...palette],
   format:payload.format,wrap:payload.wrap,decorCount:payload.decorCount||0};
}
root.FTZCompetitionEngine=Object.freeze({contests:CONTESTS,contestForDay,score,prizes:PRIZES});
if(typeof module!=='undefined'&&module.exports)module.exports=root.FTZCompetitionEngine;
})(typeof window!=='undefined'?window:globalThis);
