/* Rare plantation UI and game inventory integration, v0.15.207 */
(function () {
  'use strict';
  function mount() {
    if (!window.FloristRarePlantation || typeof state === 'undefined' ||
        typeof types === 'undefined' || typeof render !== 'function') {
      console.error('FTZ plantation: game dependencies not ready');
      return;
    }
    const aliases = { 'rare-protea-royal':'rose',
      'rare-strelitzia-gold':'tulip','rare-gloriosa-flame':'lily' };
    for (const [rare, base] of Object.entries(aliases)) {
      for (const catalogue of [typeof approvedFlowerImages !== 'undefined' ? approvedFlowerImages : null,
                               typeof FTZ_NEW_FLOWER_IMAGES !== 'undefined' ? FTZ_NEW_FLOWER_IMAGES : null,
                               typeof bouquetHeadImages !== 'undefined' ? bouquetHeadImages : null]) {
        if (catalogue && catalogue[base] && !catalogue[rare]) catalogue[rare] = catalogue[base];
      }
    }
    const plantation = FloristRarePlantation.create({
      storage: window.localStorage,
      now: () => Date.now(),
      onHarvest: ({id, quantity}) => {
        // The existing game stock is authoritative for bouquets, sales and spoilage.
        if (!state.upgrades.nursery || !state.started || state.finished) throw new Error('Питомник недоступен');
        if (!types.some(f => f.id === id && f.plantationOnly)) throw new Error('Неизвестный сорт');
        state.stock[id] = (state.stock[id] || 0) + quantity;
        if (!Array.isArray(state.stockCosts[id])) state.stockCosts[id] = [];
        if (!Array.isArray(state.flowerLots[id])) state.flowerLots[id] = [];
        for (let i = 0; i < quantity; i++) {
          state.stockCosts[id].push(0);
          state.flowerLots[id].push({boughtDay:state.day, cost:0});
        }
        if (typeof ftzQueueSave === 'function') ftzQueueSave();
      }
    });
    const container = document.getElementById('shop') ||
                      document.getElementById('upgradeGrid')?.parentElement;
    if (!container) { console.error('FTZ plantation: shop not found'); return; }
    const section = document.createElement('section');
    section.id = 'ftzRarePlantation';
    section.className = 'ftz-rare-plantation';
    section.setAttribute('aria-label','Плантация редких цветов');
    const grid = document.getElementById('upgradeGrid');
    if (grid) grid.insertAdjacentElement('afterend',section);
    else container.appendChild(section);

    function formatRemaining(ms) {
      const min = Math.ceil(ms / 60000);
      return min > 0 ? min + ' мин.' : 'Готов к сбору';
    }
    function update() {
      if (!document.getElementById('ftzRarePlantation')) return;
      const owned = !!state.upgrades?.nursery;
      const snapshot = plantation.snapshot();
      const flowers = plantation.flowers();
      const canAct = owned && state.started && !state.finished && !state.last;
      section.innerHTML = '<div class="ftz-rare-heading"><div><h3>🌿 Плантация редких цветов</h3>' +
        '<p>Три эксклюзивных сорта, которых нет в продаже на рынке. Выращивайте их для букетов и корзин.</p></div>' +
        '<span class="ftz-rare-status">' + (owned?'✓ Питомник открыт':'🔒 Нужен апгрейд «Питомник редких цветов»') + '</span></div>' +
        (owned ? '<div class="ftz-rare-plots">' + snapshot.plots.map((plot,i) => {
          if (plot.status === 'empty') return '<div class="ftz-rare-plot"><b>Грядка '+(i+1)+'</b>' +
            '<small>Свободна</small><select id="ftzRareChoice'+i+'" aria-label="Сорт для грядки '+(i+1)+'">' +
            flowers.map(f=>'<option value="'+f.id+'">'+f.name+' · '+Math.ceil(f.growMs/60000)+' мин.</option>').join('') +
            '</select><button type="button" data-ftz-plant="'+i+'" '+(!canAct?'disabled':'')+'>Посадить</button></div>';
          const f = flowers.find(f=>f.id===plot.flowerId);
          return '<div class="ftz-rare-plot"><b>Грядка '+(i+1)+'</b><strong>'+
            (f?.emoji||'🌸')+' '+plot.name+'</strong><small>'+formatRemaining(plot.remainingMs)+'</small>' +
            '<button type="button" data-ftz-harvest="'+i+'" '+
            (plot.status==='ready' && canAct?'':'disabled')+'>'+
            (plot.status==='ready'?'Собрать цветок':'Растёт…')+'</button></div>';
        }).join('')+'</div>' : '') +
        '<p class="ftz-rare-inventory">Выращено на складе: '+
        flowers.map(f=>f.name+' — '+(state.stock[f.id]||0)+' шт.').join(' · ')+'</p>' +
        '<p id="ftzRareMessage" class="ftz-rare-message" role="status"></p>';
      section.querySelectorAll('[data-ftz-plant]').forEach(button => button.addEventListener('click',() => {
        const i=Number(button.dataset.ftzPlant);
        try { plantation.plant(i,section.querySelector('#ftzRareChoice'+i).value); update(); }
        catch(e){message(e.message);}
      }));
      section.querySelectorAll('[data-ftz-harvest]').forEach(button => button.addEventListener('click',() => {
        try {
          plantation.harvest(Number(button.dataset.ftzHarvest));
          if (typeof ftzQueueSave === 'function') ftzQueueSave();
          window.render();
        } catch(e){message(e.message);}
      }));
    }
    function message(value) {
      const target=document.getElementById('ftzRareMessage');
      if(target)target.textContent=value;
    }
    const oldRender=window.render;
    window.render=function() {
      const result=oldRender.apply(this,arguments);
      update();
      return result;
    };
    window.FTZRarePlantation = Object.freeze({plantation:plantation,refresh:update});
    update();
    setInterval(update,30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();