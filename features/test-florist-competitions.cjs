const assert=require('node:assert/strict');
const engine=require('./florist-competitions.js');
assert.equal(engine.contests.length,3);
assert.deepEqual(engine.contests.map(c=>c.day),[5,12,19]);
assert.equal(engine.contestForDay(4),null);
const flowers=[
 {id:'rose',rarity:'rare',tags:['hope','care']},
 {id:'tulip',rarity:'rare',tags:['hope','joy']},
 {id:'rare-protea-royal',rarity:'premium',plantationOnly:true,tags:['hope','care']},
 {id:'calla',rarity:'common',tags:['calm','care']},
 {id:'sun',rarity:'common',tags:['joy','hope']}
];
const input={flowers,format:'basket',wrap:'savanna',greenery:'fern',decorCount:2,customPositions:true};
const r=engine.score(input,engine.contests[0]);
assert.equal(r.total,Object.values(r.scores).reduce((a,b)=>a+b,0));
assert(r.total>=0&&r.total<=100);
assert(r.rank>=1&&r.rank<=4);
assert.deepEqual(engine.score(input,engine.contests[0]),r);
const maximum={harmony:25,originality:25,topic:20,craftsmanship:20,rarity:10};
for(const [id,value] of Object.entries(maximum)) assert(r.scores[id]<=value);
assert.equal(r.rivals.length,3);
assert.throws(()=>engine.score({...input,flowers:flowers.slice(0,2)},engine.contests[0]),/четырёх/);
assert.throws(()=>engine.score({...input,flowers:Array(5).fill(flowers[0])},engine.contests[0]),/два сорта/);
for(const contest of engine.contests) {
 const outcome=engine.score(input,contest);
 assert.deepEqual(outcome.prize,engine.prizes[outcome.rank-1]);
}
console.log('PASS: 3 contest dates, repeatable scores, jury weights, rivals, prizes, validation');
