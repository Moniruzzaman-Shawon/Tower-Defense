// Minimal Tiny TD stub implementing key behaviors from specs/td-01.md
// Uses game-utils.js (SeededRNG, saveGame, loadGame, makeInitialState, clearSave)

const TILE = 40;
const GRID_W = 20, GRID_H = 12;
const CANVAS_W = 800, CANVAS_H = 500;

// Path tiles (from spec)
const PATH_TILES = [[0,6],[5,6],[5,3],[12,3],[12,9],[19,9]];
function tileToPx(tx, ty){ return [tx*TILE+20, ty*TILE+20]; }
const PATH_PX = PATH_TILES.map(([x,y])=> tileToPx(x,y));

// Creep types
const CREEPS = {
  Grunt: {baseHP:30, speed:1.2, bounty:5},
  Runner:{baseHP:20, speed:2.0, bounty:5},
  Tank:  {baseHP:160, speed:0.7, bounty:12}
};

// Towers
const TOWERS = {
  Arrow: {id:'T1', cost:50, range:140, dmg:10, fire_rate:1.0, proj_speed:500, aoe:0},
  Cannon:{id:'T2', cost:80, range:120, dmg:20, fire_rate:0.6, proj_speed:360, aoe:50}
};

// Waves (simple expansion of spec: list of [type,count])
const WAVES = [
  [['Grunt',12]],
  [['Grunt',8],['Runner',6]],
  [['Runner',10]],
  [['Tank',6]],
  [['Grunt',8],['Tank',4]],
  [['Runner',10],['Grunt',6]],
  [['Tank',8]],
  [['Runner',12],['Tank',6]],
  [['Grunt',16],['Tank',6]],
  [['Tank',10]]
];

// Spawn timing parameters (per-wave spawn_rate and hp_mult simplified)
const SPAWN_PARAMS = [0.90,0.85,0.80,0.80,0.75,0.70,0.70,0.65,0.60,0.55];
const HP_MULT = [1.00,1.10,1.20,1.30,1.45,1.60,1.80,2.10,2.40,3.00];

// State
let state = loadGame() || makeInitialState();
const rng = new SeededRNG('TDMINI');
if (state.rngState) rng.state = state.rngState;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let coinsEl = document.getElementById('coins');
let livesEl = document.getElementById('lives');
let waveEl = document.getElementById('wave');
let placingEl = document.getElementById('placing');

let paused = false; let speed = 1;

// Game objects
let creeps = [];
let towers = state.towers || [];
let projectiles = [];

// Simple path interpolation helpers: compute point along polyline given progress [0..1]
function pathLengthPoints(points){
  let lens=[]; let tot=0;
  for(let i=0;i<points.length-1;i++){
    const d = Math.hypot(points[i+1][0]-points[i][0], points[i+1][1]-points[i][1]);
    lens.push(d); tot+=d;
  }
  return {lens,tot};
}
const PATH_META = pathLengthPoints(PATH_PX);

function pointAtProgress(p){
  let dist = p * PATH_META.tot;
  for(let i=0;i<PATH_PX.length-1;i++){
    if(dist <= PATH_META.lens[i]){
      const a = PATH_PX[i], b = PATH_PX[i+1];
      const t = dist / PATH_META.lens[i];
      return [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
    }
    dist -= PATH_META.lens[i];
  }
  return PATH_PX[PATH_PX.length-1].slice();
}

// Creep factory
function spawnCreep(type){
  const meta = CREEPS[type];
  return {
    type, hp: meta.baseHP * (HP_MULT[state.waveIndex]||1), maxHp: meta.baseHP * (HP_MULT[state.waveIndex]||1),
    speed: meta.speed, bounty: meta.bounty,
    progress: 0, alive:true
  };
}

// Wave spawn controller (simple)
let spawning = false, spawnQueue = [], spawnTimer = 0, currentSpawnRate = 1.0;

function prepareWave(index){
  spawnQueue = [];
  const wave = WAVES[index] || [];
  for(const [type,count] of wave){
    for(let i=0;i<count;i++) spawnQueue.push(type);
  }
  currentSpawnRate = SPAWN_PARAMS[index] || 0.9;
  spawning = spawnQueue.length>0;
  spawnTimer = 0;
}

function update(dt){
  // spawn
  if(spawning){
    spawnTimer -= dt;
    while(spawnTimer <= 0 && spawnQueue.length>0){
      const t = spawnQueue.shift();
      creeps.push(spawnCreep(t));
      spawnTimer += currentSpawnRate;
    }
    if(spawnQueue.length===0) spawning=false;
  }

  // creeps move
  for(const c of creeps){
    if(!c.alive) continue;
    c.progress += (c.speed * dt) / (PATH_META.tot / TILE); // normalize to progress
    if(c.progress >= 1){ c.alive = false; state.player.lives -= 1; }
  }

  // towers fire
  for(const tw of towers){
    tw.reload = (tw.reload||0) - dt* (tw.fire_rate || TOWERS[tw.kind].fire_rate) * speed;
    if((tw.reload||0) <= 0){
      // find first target by progress
      let inRange = creeps.filter(c=>c.alive).map(c=>({c, p: c.progress, pos: pointAtProgress(c.progress)})).filter(x=>{
        const dx = x.pos[0]-tw.x, dy = x.pos[1]-tw.y; return Math.hypot(dx,dy) <= (tw.range||TOWERS[tw.kind].range);
      });
      if(inRange.length>0){
        inRange.sort((a,b)=> b.c.progress - a.c.progress);
        const target = inRange[0];
        // launch projectile
        projectiles.push({x:tw.x,y:tw.y, tx: target.pos[0], ty: target.pos[1], kind: tw.kind, speed: TOWERS[tw.kind].proj_speed, dmg: TOWERS[tw.kind].dmg, aoe: TOWERS[tw.kind].aoe, targetC: target.c});
        tw.reload = 1.0; // base reload (we use fire_rate factor above)
      }
    }
  }

  // projectiles move and impact
  for(const p of projectiles){
    const dx = p.tx - p.x, dy = p.ty - p.y; const d = Math.hypot(dx,dy);
    const step = p.speed * dt;
    if(d <= step + 1){
      // impact
      if(p.aoe && p.aoe>0){
        for(const c of creeps){ if(c.alive){ const pos = pointAtProgress(c.progress); if(Math.hypot(pos[0]-p.tx,pos[1]-p.ty) <= p.aoe){ c.hp -= p.dmg; } }}
      } else {
        p.targetC.hp -= p.dmg;
      }
      p.hit = true;
    } else {
      p.x += dx/d * step; p.y += dy/d * step;
    }
  }

  // remove hit projectiles
  projectiles = projectiles.filter(p=>!p.hit);

  // resolve creep deaths
  for(const c of creeps){
    if(c.alive && c.hp <= 0){ c.alive=false; state.player.coins += c.bounty; }
  }

  // check end-of-wave: no alive creeps and not spawning
  if(!spawning && creeps.every(c=>!c.alive) && state.waveIndex < WAVES.length){
    // wave complete
    onWaveComplete();
  }

  // eviction of dead beyond end
  if(state.player.lives <= 0){ // defeat reset
    // minimal defeat: reset
    alert('Defeat - reload to try again');
    state = makeInitialState(); towers = []; creeps = []; projectiles = [];
    saveGame(state);
  }
}

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // draw path polyline
  ctx.strokeStyle = '#ddd'; ctx.lineWidth=24; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(PATH_PX[0][0],PATH_PX[0][1]);
  for(let i=1;i<PATH_PX.length;i++) ctx.lineTo(PATH_PX[i][0],PATH_PX[i][1]);
  ctx.stroke();

  // towers
  for(const tw of towers){ ctx.fillStyle='black'; ctx.beginPath(); ctx.arc(tw.x,tw.y,12,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.stroke(); }

  // creeps
  for(const c of creeps){ if(!c.alive) continue; const pos = pointAtProgress(c.progress); ctx.fillStyle='green'; ctx.beginPath(); ctx.arc(pos[0],pos[1],12,0,Math.PI*2); ctx.fill(); ctx.fillStyle='white'; ctx.fillText(Math.max(0,Math.round(c.hp)), pos[0]-8,pos[1]-16); }

  // projectiles
  for(const p of projectiles){ ctx.fillStyle = p.kind==='Cannon'?'orange':'black'; ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill(); }
}

function updateHUD(){ coinsEl.textContent = `Coins: ${state.player.coins}`; livesEl.textContent = `Lives: ${state.player.lives}`; waveEl.textContent = `Wave ${state.waveIndex+1}/10`; }

function onWaveComplete(){ state.waveIndex = Math.min(state.waveIndex+1, WAVES.length); state.rngState = rng.state; saveGame(state); updateHUD(); if(state.waveIndex < WAVES.length) prepareWave(state.waveIndex); }

// Building
let placing = null; // 'Arrow' or 'Cannon'
document.getElementById('buildArrow').addEventListener('click', ()=>{ placing='Arrow'; placingEl.textContent='Placing Arrow'; });
document.getElementById('buildCannon').addEventListener('click', ()=>{ placing='Cannon'; placingEl.textContent='Placing Cannon'; });

canvas.addEventListener('click', (e)=>{
  const rect = canvas.getBoundingClientRect(); const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if(placing){
    // validate not on path: check distance to each path segment centerlines
    // simple tile center check
    const tx = Math.floor((mx-20)/TILE + 0.5);
    const ty = Math.floor((my-20)/TILE + 0.5);
    // path tiles
    const onPath = PATH_TILES.some(([px,py])=> px===tx && py===ty);
    if(onPath){ placing = null; placingEl.textContent=''; return; }
    // overlap check
    const cx = tx*TILE+20, cy = ty*TILE+20;
    if(towers.some(t=>Math.hypot(t.x-cx,t.y-cy) < 24)){ placing=null; placingEl.textContent=''; return; }
    const kind = placing;
    const cost = TOWERS[kind].cost;
    if(state.player.coins < cost){ placing=null; placingEl.textContent=''; return; }
    // place
    towers.push({kind, x:cx, y:cy, level:1, range: TOWERS[kind].range, fire_rate: TOWERS[kind].fire_rate});
    state.player.coins -= cost; state.towers = towers; state.rngState = rng.state; saveGame(state); updateHUD(); placing=null; placingEl.textContent='';
  }
});

// HUD control wiring
document.getElementById('startWave').addEventListener('click', ()=>{ prepareWave(state.waveIndex); });
document.getElementById('pauseBtn').addEventListener('click', ()=>{ paused = !paused; });
document.getElementById('speedBtn').addEventListener('click', ()=>{ speed = speed===1?2:1; document.getElementById('speedBtn').textContent=`Speed ×${speed}`; });
document.getElementById('clearSave').addEventListener('click', ()=>{ clearSave(); state = makeInitialState(); towers=[]; creeps=[]; projectiles=[]; saveGame(state); updateHUD(); });

// Continue button
if(loadGame()){ const cbtn=document.getElementById('continueBtn'); cbtn.style.display='inline-block'; cbtn.addEventListener('click', ()=>{ state = loadGame(); if(state.rngState) rng.state = state.rngState; towers = state.towers || []; updateHUD(); cbtn.style.display='none'; startLoop(); }); } else { updateHUD(); startLoop(); }

function gameTick(ts){ if(!paused){ update(1/60 * speed); render(); } requestAnimationFrame(gameTick); }
function startLoop(){ requestAnimationFrame(gameTick); }

// initialize
updateHUD();
startLoop();
