/* Флорист. Танзания — плантация редких цветов (подключаемый модуль).
 * Не изменяет состояние основной игры, пока не вызван create().
 * Подключение: <script src="features/rare-plantation.js"></script>
 * API: window.FloristRarePlantation.create({storage, onHarvest, now})
 */
(function (root) {
  'use strict';

  var KEY = 'florist-tanzania:rare-plantation:v1';
  var FLOWERS = Object.freeze([
    Object.freeze({id:'rare-protea-royal', name:'Королевская протея', growMs: 10 * 60 * 1000, yield: 1, emoji:'🌺'}),
    Object.freeze({id:'rare-strelitzia-gold', name:'Золотая стрелиция', growMs: 15 * 60 * 1000, yield: 1, emoji:'🌼'}),
    Object.freeze({id:'rare-gloriosa-flame', name:'Огненная глориоза', growMs: 20 * 60 * 1000, yield: 1, emoji:'🌸'})
  ]);
  var IDS = FLOWERS.map(function (f) { return f.id; });
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function emptyState() { return {version:1, plots:[null,null,null], stock:{}}; }
  function validPlot(p) {
    return p === null || (p && IDS.indexOf(p.flowerId) !== -1 &&
      Number.isFinite(p.plantedAt) && p.plantedAt >= 0);
  }
  function sanitize(parsed) {
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.plots)) return emptyState();
    var s = emptyState();
    for (var i=0;i<3;i++) s.plots[i] = validPlot(parsed.plots[i]) ? parsed.plots[i] : null;
    if (parsed.stock && typeof parsed.stock === 'object') {
      IDS.forEach(function(id) {
        var n = parsed.stock[id];
        if (Number.isSafeInteger(n) && n >= 0) s.stock[id] = n;
      });
    }
    return s;
  }
  function create(opts) {
    opts = opts || {};
    var storage = opts.storage || null;
    var now = typeof opts.now === 'function' ? opts.now : Date.now;
    var onHarvest = typeof opts.onHarvest === 'function' ? opts.onHarvest : function () {};
    var state = emptyState();
    if (storage) {
      try { state = sanitize(JSON.parse(storage.getItem(KEY))); }
      catch (_) { state = emptyState(); }
    }
    function persist() {
      if (storage) storage.setItem(KEY, JSON.stringify(state));
    }
    function plotIndex(i) {
      if (!Number.isInteger(i) || i < 0 || i >= 3) throw new RangeError('Неизвестная грядка');
    }
    function getFlower(id) {
      var found = FLOWERS.filter(function(f) { return f.id === id; })[0];
      if (!found) throw new RangeError('Неизвестный редкий цветок');
      return found;
    }
    function currentTime() {
      var n = Number(now());
      if (!Number.isFinite(n) || n < 0) throw new Error('Недопустимое время');
      return n;
    }
    function status(i) {
      plotIndex(i);
      var p = state.plots[i];
      if (!p) return {index:i, status:'empty'};
      var f = getFlower(p.flowerId);
      var remainingMs = Math.max(0, p.plantedAt + f.growMs - currentTime());
      return {index:i, status:remainingMs ? 'growing' : 'ready',
        flowerId:f.id, name:f.name, remainingMs:remainingMs, plantedAt:p.plantedAt};
    }
    return Object.freeze({
      flowers:function() { return copy(FLOWERS); },
      snapshot:function() { return copy({plots:[status(0),status(1),status(2)],stock:state.stock}); },
      plant:function(i,id) {
        plotIndex(i);
        var f = getFlower(id);
        if (state.plots[i]) throw new Error('Грядка уже занята');
        state.plots[i] = {flowerId:f.id, plantedAt:currentTime()};
        persist();
        return status(i);
      },
      harvest:function(i) {
        var p = status(i);
        if (p.status !== 'ready') throw new Error('Цветок ещё не созрел');
        var f = getFlower(p.flowerId);
        var old = state.stock[f.id] || 0;
        // Сначала передаём результат игре: в случае ошибки не изменяем состояние плантации.
        onHarvest({id:f.id, name:f.name, quantity:f.yield});
        state.stock[f.id] = old + f.yield;
        state.plots[i] = null;
        persist();
        return {id:f.id, quantity:f.yield, stock:state.stock[f.id]};
      },
      consume:function(id,quantity) {
        getFlower(id);
        if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new RangeError('Неверное количество');
        if ((state.stock[id] || 0) < quantity) throw new Error('Недостаточно выращенных цветов');
        state.stock[id] -= quantity;
        persist();
        return state.stock[id];
      },
      reset:function() { state = emptyState(); persist(); }
    });
  }
  root.FloristRarePlantation = Object.freeze({create:create, flowers:FLOWERS, storageKey:KEY});
})(typeof window !== 'undefined' ? window : globalThis);
