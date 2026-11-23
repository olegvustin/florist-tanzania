/* Флорист. Танзания · Конкурсы против виртуальных флористов */
(function(){
 'use strict';
 const E=window.FTZCompetitionEngine;
 if(!E)return;
 function mount(){
   if(typeof state==='undefined'||typeof render!=='function'||!document.getElementById('stage-1'))return;
   if(!state.competitions || typeof state.competitions!=='object' || Array.isArray(state.competitions))state.competitions={};
   const card=document.createElement('section');
   card.id='ftzCompetition';
   card.className='ftz-competition';
   card.setAttribute('aria-label','Фестиваль флористов Танзании');
   const stage=document.getElementById('stage-1');
   const layout=stage.querySelector('.layout');
   if(layout)layout.insertAdjacentElement('beforebegin',card);
   else stage.prepend(card);
   const journal=document.getElementById('journal');
   const gallery=document.createElement('section');
   gallery.id='ftzCompetitionHistory';
   gallery.className='ftz-competition-history';
   gallery.setAttribute('aria-label','Мои награды на конкурсах');
   if(journal)journal.insertAdjacentElement('afterbegin',gallery);
   const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   const C=E.contests;
   function contestResult(contest,result){
     const ordered=[{name:'Ваш букет',score:result.total,isPlayer:true,flowers:['🏆']}]
        .concat(result.rivals.map(r=>({...r,isPlayer:false})))
        .sort((a,b)=>b.score-a.score||(a.isPlayer?1:-1));
     return '<div class="ftz-competition-result">'+
       '<div class="ftz-competition-fanfare" aria-hidden="true">✦ 🌺 ✦ 🏆 ✦ 🌺 ✦</div>'+
       '<h3>'+esc(contest.title)+' · результаты</h3>'+
       '<div class="ftz-competition-score"><strong>'+result.total+' / 100</strong><span>'+result.rank+' место · '+esc(result.prize.label)+'</span></div>'+
       '<div class="ftz-competition-podium">'+ordered.map((r,i)=>
         '<div class="ftz-competition-rival '+(r.isPlayer?'ftz-competition-you':'')+'">'+
         '<b>'+(i+1)+' место</b><div class="ftz-rival-flowers">'+r.flowers.join(' ')+'</div>'+
         '<strong>'+esc(r.name)+'</strong><small>'+esc(r.style||'Ваша конкурсная работа')+'</small><b>'+r.score+' баллов</b></div>').join('')+'</div>'+
       '<h4>Оценки профессионального жюри</h4>'+
       '<div class="ftz-competition-jury">'+
       [['harmony','Гармония цветов',25],['originality','Оригинальность',25],
        ['topic','Соответствие теме',20],['craftsmanship','Мастерство оформления',20],
        ['rarity','Редкость цветов',10]].map(([id,label,max])=>
          '<div><span>'+label+'</span><meter min="0" max="'+max+'" value="'+result.scores[id]+'"></meter>'+
          '<b>'+result.scores[id]+'/'+max+'</b></div>').join('')+'</div>'+
       '<p class="ftz-competition-prize">Награда: +'+result.prize.money+
       ' монет · +'+result.prize.rep+' репутации. Результат сохранён в книге историй.</p></div>';
   }
   function history(){
     if(!gallery.isConnected)return;
     const won=C.filter(c=>state.competitions[c.id]);
     gallery.innerHTML='<div class="ftz-competition-gallery-head"><h3>🏆 Конкурсы флористов</h3>'+
       '<p>Фестиваль в дни 6, 13 и 20. Соперники — виртуальные флористы Танзании.</p></div>'+
       '<div class="ftz-competition-medals">'+C.map(c=>{
         const r=state.competitions[c.id];
         return '<div class="ftz-competition-medal '+(r?'earned':'')+'">'+
           '<div class="ftz-competition-medal-icon">'+(!r?'🔒':r.rank===1?'🏆':r.rank===2?'🥈':r.rank===3?'🥉':'🎗️')+'</div>'+
           '<strong>'+esc(c.title)+'</strong><small>День '+(c.day+1)+'</small>'+
           '<span>'+(r?r.rank+' место · '+r.total+' баллов':'Пока не завершён')+'</span></div>';
       }).join('')+'</div>';
   }
   function update(){
     if(!card.isConnected)return;
     const contest=E.contestForDay(state.day);
     history();
     if(!contest || !state.started || state.finished){
       card.hidden=true;
       return;
     }
     card.hidden=false;
     const result=state.competitions[contest.id];
     if(result){
       card.innerHTML=contestResult(contest,result);
       return;
     }
     const valid=state.chosen.length>=4&&new Set(state.chosen).size>=2;
     const available=typeof flowStep!=='undefined'&&flowStep===1&&!state.last;
     const canEnter=valid && available && state.money>=contest.fee;
     const reason=!available?'Сначала перейдите к сборке букета. Участвовать нужно до вручения заказа.':
       !valid?'Соберите композицию минимум из 4 цветов и 2 разных сортов.':
       state.money<contest.fee?'Для участия недостаточно монет.':'Конкурсная работа готова к оценке жюри.';
     card.innerHTML='<div class="ftz-competition-hero">'+
       '<div><span class="ftz-competition-eyebrow">🌺 ФЕСТИВАЛЬ ФЛОРИСТОВ · ДЕНЬ '+(contest.day+1)+'</span>'+
       '<h3>'+esc(contest.title)+'</h3><p>'+esc(contest.subtitle)+' · '+esc(contest.theme)+'</p>'+
       '<p class="ftz-competition-description">Создайте композицию в конструкторе выше. Жюри оценивает гармонию, оригинальность, тему, оформление и редкость цветов. Соперничают три виртуальных флориста. Участие необязательно.</p></div>'+
       '<div class="ftz-competition-fee"><b>'+contest.fee+' 🪙</b><span>взнос за участие</span></div></div>'+
       '<div class="ftz-competition-people">'+contest.rivals.map(r=>
         '<div><span>'+r.flowers.join(' ')+'</span><b>'+esc(r.name)+'</b><small>'+esc(r.style)+'</small></div>').join('')+'</div>'+
       '<div class="ftz-competition-action"><p>'+reason+'</p>'+
       '<button type="button" id="ftzCompetitionSubmit" '+(!canEnter?'disabled':'')+
       '>Отправить работу на конкурс · '+contest.fee+' 🪙</button></div>'+
       '<p class="ftz-competition-note">На конкурс отправляется снимок текущей композиции. Цветы остаются для заказа клиента; списывается только взнос. Награда выдаётся один раз.</p>';
     const btn=card.querySelector('#ftzCompetitionSubmit');
     if(btn)btn.addEventListener('click',submit);
   }
   function submit(){
     const contest=E.contestForDay(state.day);
     if(!contest || !state.started || state.finished || state.last || flowStep!==1 ||
        state.competitions[contest.id] || state.money<contest.fee)return;
     if(state.chosen.length<4||new Set(state.chosen).size<2)return;
     // Avoid illegally chosen stems: the live game's stock is the source of truth.
     const quantities={};
     for(const id of state.chosen)quantities[id]=(quantities[id]||0)+1;
     if(Object.entries(quantities).some(([id,n])=>(state.stock[id]||0)<n))return;
     const flowers=state.chosen.map(id=>types.find(f=>f.id===id));
     if(flowers.some(f=>!f))return;
     const input={
       flowers,format:typeof ftzIsBasket==='function'&&ftzIsBasket()?'basket':'bouquet',
       wrap:document.getElementById('wrap')?.value||'kraft',
       greenery:document.getElementById('greenery')?.value||'none',
       decorCount:typeof ftzDecorItems==='function'?ftzDecorItems().length:0,
       customPositions:state.positions.some(p=>p&&typeof p==='object')
     };
     let result;
     try{result=E.score(input,contest);}catch(e){console.error('FTZ contest evaluation',e);return;}
     // Atomic, synchronous prize assignment, with an idempotence guard.
     state.competitions[contest.id]={...result,day:contest.day,
       title:contest.title,submittedAt:Date.now(),entryFee:contest.fee};
     state.money=state.money-contest.fee+result.prize.money;
     state.rep=Math.min(100,Math.max(0,state.rep+result.prize.rep));
     if(typeof ftzSaveNow==='function')ftzSaveNow();
     else if(typeof ftzQueueSave==='function')ftzQueueSave();
     window.render();
     card.scrollIntoView({block:'start',behavior:'smooth'});
   }
   const oldRender=window.render;
   window.render=function(){const v=oldRender.apply(this,arguments);update();return v;};
   window.FTZCompetition=Object.freeze({refresh:update,submit,engine:E});
   update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
 else mount();
})();