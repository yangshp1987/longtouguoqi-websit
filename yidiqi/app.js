(() => {
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const hex = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const mix = (c1, c2, t) => { const a = hex(c1), b = hex(c2); return `rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],t))).join(',')})`; };
const ramp = (stops, t) => { t = clamp(t,0,1); const n = stops.length-1; const i = Math.min(n-1, Math.floor(t*n)); return mix(stops[i], stops[i+1], t*n-i); };
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const secProgress = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight), 0, 1); };
const INK = '#2b1e16';
/* 伪随机，保证手绘线条每帧稳定 */
const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(42);
/* 手绘线：沿路径加抖动，画两遍 */
function sketchLine(c, pts, w = 2, color = INK, jit = 1.6, passes = 2) {
  c.strokeStyle = color; c.lineCap = 'round'; c.lineJoin = 'round';
  for (let k = 0; k < passes; k++) {
    c.lineWidth = k ? w * .55 : w; c.globalAlpha = k ? .55 : 1;
    c.beginPath();
    pts.forEach((p, i) => { const j = jit * (k + 1) * .6; const x = p[0] + Math.sin(i * 1.7 + k * 3) * j, y = p[1] + Math.cos(i * 2.3 + k * 5) * j; i ? c.lineTo(x, y) : c.moveTo(x, y); });
    c.stroke();
  }
  c.globalAlpha = 1;
}
const seg = (x0, y0, x1, y1, n = 12) => Array.from({length: n + 1}, (_, i) => [lerp(x0, x1, i / n), lerp(y0, y1, i / n)]);
const rectPts = (x, y, w, h) => [...seg(x, y, x + w, y), ...seg(x + w, y, x + w, y + h), ...seg(x + w, y + h, x, y + h), ...seg(x, y + h, x, y)];
function hatch(c, x, y, w, h, gap = 9, color = 'rgba(43,30,22,.28)', ang = 1) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.strokeStyle = color; c.lineWidth = 1.2;
  for (let i = -h; i < w + h; i += gap) { c.beginPath(); c.moveTo(x + i, y + h); c.lineTo(x + i + h * ang, y); c.stroke(); }
  c.restore();
}

/* ---------- reveal & progress ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), {threshold:.2});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
setTimeout(() => document.querySelectorAll('#intro .reveal').forEach(el => el.classList.add('on')), 200);

/* ---------- 1. 割漆（手绘树皮） ---------- */
const cc = $('#cutCanvas'), cx = cc.getContext('2d');
let bark, cuts = [], drawing = null, W1, H1, totalG = 0;
function sizeCut() {
  const r = cc.getBoundingClientRect(); W1 = r.width; H1 = r.height;
  cc.width = W1 * DPR; cc.height = H1 * DPR; cx.setTransform(DPR,0,0,DPR,0,0);
  bark = document.createElement('canvas'); bark.width = W1 * DPR; bark.height = H1 * DPR;
  const b = bark.getContext('2d'); b.setTransform(DPR,0,0,DPR,0,0);
  b.fillStyle = '#fbf5e8'; b.fillRect(0,0,W1,H1);
  const L = W1 * .14, R = W1 * .86;
  b.fillStyle = '#d9c6a3'; b.beginPath(); b.moveTo(L, 0); b.bezierCurveTo(L - 10, H1 * .4, L + 8, H1 * .7, L - 4, H1); b.lineTo(R + 4, H1); b.bezierCurveTo(R - 8, H1 * .6, R + 10, H1 * .3, R, 0); b.closePath(); b.fill();
  hatch(b, R - W1 * .16, 0, W1 * .16, H1, 7, 'rgba(43,30,22,.22)', .15);
  hatch(b, L, 0, W1 * .08, H1, 9, 'rgba(43,30,22,.15)', -.15);
  const s = [];
  for (let y = 0; y <= H1; y += 20) s.push([L + Math.sin(y / 80) * 5 - 3, y]);
  sketchLine(b, s, 2.6);
  const s2 = []; for (let y = 0; y <= H1; y += 20) s2.push([R + Math.sin(y / 90 + 1) * 5, y]);
  sketchLine(b, s2, 2.6);
  for (let i = 0; i < 70; i++) {
    const x = lerp(L + 20, R - 20, rnd()), y = rnd() * H1, h = 30 + rnd() * 90;
    sketchLine(b, seg(x, y, x + rnd() * 6 - 3, y + h, 5), .9 + rnd(), 'rgba(43,30,22,.45)', 1, 1);
  }
  for (let i = 0; i < 26; i++) { const x = lerp(L + 30, R - 40, rnd()), y = rnd() * H1; sketchLine(b, seg(x, y, x + 10 + rnd() * 14, y + rnd() * 2, 3), 1.4, 'rgba(43,30,22,.6)', .6, 1); }
  for (let y = 70; y < H1; y += 120 + rnd() * 40) {
    sketchLine(b, [[W1 * .32, y], [W1 * .41, y + 13], [W1 * .5, y + 26], [W1 * .59, y + 13], [W1 * .68, y]], 1.6, 'rgba(90,50,25,.5)', 1, 1);
  }
  b.fillStyle = 'rgba(43,30,22,.6)'; b.font = `15px ${getComputedStyle(document.body).fontFamily}`; b.fillText('旧刀口 · 已休养', W1 * .56, 64);
}
function pos(e, el) { const r = el.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return {x:p.clientX-r.left, y:p.clientY-r.top}; }
cc.addEventListener('pointerdown', e => { drawing = {pts:[pos(e,cc)], t0:0}; cc.setPointerCapture(e.pointerId); });
cc.addEventListener('pointermove', e => { if (drawing) { const p = pos(e,cc), l = drawing.pts[drawing.pts.length-1]; if (Math.hypot(p.x-l.x,p.y-l.y) > 4) drawing.pts.push(p); } });
cc.addEventListener('pointerup', () => {
  if (drawing && drawing.pts.length > 3) {
    drawing.t0 = performance.now();
    drawing.low = drawing.pts.reduce((a,b) => b.y > a.y ? b : a);
    drawing.g = 10 + Math.round(rnd() * 8);
    cuts.push(drawing); if (cuts.length > 40) cuts.shift();
    totalG += drawing.g;
    const n = +$('#cutN').textContent + 1;
    $('#cutN').textContent = n; $('#cutG').textContent = totalG; $('#cutLeft').textContent = Math.max(0, 500 - totalG);
    if (totalG >= 500) $('#cutNote').innerHTML = '<b>你割够一斤了。</b>可在山里，漆农要走十几里山路、割上几十棵树，一棵树一季只能割十来刀，割完还得休养。所以老话说“百里千刀一斤漆”。';
  }
  drawing = null;
});
function drawShell(x, y, fill) {
  cx.save(); cx.translate(x, y);
  cx.fillStyle = '#f3e7cf'; cx.beginPath(); cx.moveTo(-26, 0); cx.quadraticCurveTo(0, 30, 26, 0); cx.quadraticCurveTo(0, 8, -26, 0); cx.fill();
  if (fill > 0) { cx.fillStyle = fill > .6 ? '#8a4a1d' : '#e8d7b0'; cx.beginPath(); cx.moveTo(-22 * fill, 5); cx.quadraticCurveTo(0, 5 + 20 * fill, 22 * fill, 5); cx.quadraticCurveTo(0, 9, -22 * fill, 5); cx.fill(); }
  sketchLine(cx, [[-26, 0], [-13, 12], [0, 16], [13, 12], [26, 0]], 2);
  sketchLine(cx, [[-26, 0], [0, 6], [26, 0]], 1.6);
  for (let k = -2; k <= 2; k++) sketchLine(cx, [[k * 3, 4], [k * 8, 13]], .8, 'rgba(43,30,22,.5)', .3, 1);
  cx.restore();
}
function drawCut(t) {
  if (!bark) return;
  cx.drawImage(bark, 0, 0, W1, H1);
  const all = drawing ? cuts.concat([{...drawing, t0:t, preview:true}]) : cuts;
  for (const c of all) {
    const age = (t - c.t0)/1000;
    cx.lineCap = 'round'; cx.lineJoin = 'round';
    cx.strokeStyle = '#3a2416'; cx.lineWidth = 6;
    cx.beginPath(); c.pts.forEach((p,i) => i ? cx.lineTo(p.x,p.y) : cx.moveTo(p.x,p.y)); cx.stroke();
    cx.strokeStyle = '#f0e2c4'; cx.lineWidth = 2; cx.stroke();
    if (c.preview) continue;
    const grow = clamp(age/2,0,1), col = ramp(['#fdfaf2','#f3e8cf','#d7a656','#8a4a1d','#3a1d0c'], clamp((age-2)/40,0,1));
    cx.fillStyle = col;
    c.pts.forEach((p,i) => { if (i%2) return; const r = grow*(2.4+Math.sin(i*1.7)*1.2); if (r>0){cx.beginPath(); cx.arc(p.x,p.y+r*.3,r,0,7); cx.fill();} });
    const L = c.low, shellY = L.y + 70;
    if (age > 2) {
      const len = Math.min((age-2)*30, 64);
      cx.strokeStyle = col; cx.lineWidth = 4.5;
      cx.beginPath(); cx.moveTo(L.x,L.y); cx.quadraticCurveTo(L.x+3,L.y+len/2,L.x,L.y+len); cx.stroke();
      if (len < 64) { cx.beginPath(); cx.arc(L.x,L.y+len+3,4.5,0,7); cx.fill(); }
      cx.strokeStyle = 'rgba(43,30,22,.6)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(L.x+3,L.y); cx.quadraticCurveTo(L.x+6,L.y+len/2,L.x+3,L.y+len); cx.stroke();
    }
    drawShell(L.x, shellY, clamp((age - 3.5) / 6, 0, 1));
    if (age > 4) { cx.globalAlpha = clamp((age - 4) / 1, 0, 1); cx.fillStyle = '#a8231a'; cx.font = `bold 17px ${getComputedStyle(document.body).fontFamily}`; cx.fillText(`+${c.g} 克`, L.x + 32, shellY + 12); cx.globalAlpha = 1; }
  }
  if (!cuts.length && !drawing) {
    cx.fillStyle = 'rgba(168,35,26,.9)'; cx.font = `20px ${getComputedStyle(document.body).fontFamily}`; cx.textAlign = 'center';
    cx.globalAlpha = .5+.5*Math.sin(t/400); cx.fillText('↓ 在树皮上划一刀 ↓', W1/2, H1/2); cx.globalAlpha = 1; cx.textAlign = 'left';
  }
}

/* ---------- 2. 活的漆 ---------- */
const alive = $('#alive');
const aliveStages = [
  ['乳白','刚流出的生漆像牛奶一样白。这时它还是“活的”：里面有漆酚，也有一种天然的酶，叫漆酶。'],
  ['琥珀','一接触空气，漆酶开始工作。几分钟后，它变成琥珀色。老漆商说好漆是“搅动琥珀色，挑起如钓钩”。'],
  ['栗褐','漆酚分子一个接一个手拉着手，从液体慢慢变成胶，颜色越来越深。'],
  ['玄黑','最后它变成深沉的黑，硬化成膜。从这一刻起，它可以保存两千年以上。']
];
let aliveIdx = -1;
function updAlive() {
  const p = secProgress(alive);
  $('#dropBody').setAttribute('fill', ramp(['#fbf6ea','#e2c38a','#c98a3c','#7a3f18','#2a140a','#0b0705'], p));
  $('#aliveBar').style.width = (p*100)+'%';
  const i = Math.min(3, Math.floor(p*4));
  if (i !== aliveIdx) { aliveIdx = i; $('#aliveTitle').textContent = aliveStages[i][0]; $('#aliveDesc').textContent = aliveStages[i][1]; }
  $('#aliveTitle').style.color = ramp(['#b9a98c','#c98a3c','#8a4a1d','#1a0f09'], p);
}

/* ---------- 时间轴拖拽 ---------- */
const tl = $('#timeline'); let dragX = null, sl = 0;
tl.addEventListener('pointerdown', e => { dragX = e.clientX; sl = tl.scrollLeft; tl.style.scrollSnapType = 'none'; });
addEventListener('pointerup', () => { dragX = null; tl.style.scrollSnapType = ''; });
tl.addEventListener('pointermove', e => { if (dragX !== null && e.pointerType === 'mouse') tl.scrollLeft = sl - (e.clientX - dragX); });

/* ---------- 3. 时间对照：两张手绘案几 ---------- */
const caps = [
  [0,'两张案几，一样漂亮。'],
  [5,'5 年：化学涂料开始发黄、失光。大漆越用越润，这叫“宝光”。'],
  [20,'20 年：化学涂层出现细密裂纹。大漆漆膜依旧完整。'],
  [60,'60 年：化学涂层起皮剥落，露出木头。大漆的颜色反而更透亮了。'],
  [300,'300 年：化学涂层早已掉光，木头开始朽坏。大漆，还在。'],
  [2000,'2000 年：马王堆、曾侯乙墓的漆器，出土时依然光亮。这不是想象，这是考古。']
];
const vsA = $('#vsA').getContext('2d'), vsB = $('#vsB').getContext('2d');
const crackSeed = Array.from({length: 46}, () => [rnd(), rnd(), rnd(), rnd()]);
const peelSeed = Array.from({length: 14}, () => [rnd(), rnd(), rnd(), rnd()]);
function drawTable(c, y, lacquer) {
  const W = 600, H = 420;
  c.clearRect(0, 0, W, H);
  c.fillStyle = 'rgba(43,30,22,.12)'; c.beginPath(); c.ellipse(300, 392, 250, 16, 0, 0, 7); c.fill();
  const topY = 120, topH = 34, x0 = 60, x1 = 540;
  // 颜色
  let face, side, wood = '#c49a68';
  if (lacquer) { const k = clamp(y / 80, 0, 1); face = mix('#9e1f16', '#c43424', k); side = mix('#6e140e', '#8a1a12', k); }
  else { const yel = clamp(y / 15, 0, 1); face = mix('#9e1f16', '#a9713d', yel); side = mix('#6e140e', '#7d5530', yel); }
  const rot = lacquer ? 0 : clamp((y - 250) / 900, 0, 1);
  const legs = [[x0 + 30, 1], [x1 - 58, 1]];
  // 腿
  legs.forEach(([lx]) => {
    c.fillStyle = side; c.fillRect(lx, topY + topH, 28, 220);
    if (!lacquer && y > 40) { c.save(); c.globalAlpha = clamp((y - 40) / 120, 0, 1); c.fillStyle = wood; c.fillRect(lx + 4, topY + topH + 60, 14, 90); c.restore(); }
    sketchLine(c, rectPts(lx, topY + topH, 28, 220 - rot * 30), 2.4);
  });
  // 横枨
  c.fillStyle = side; c.fillRect(x0 + 58, topY + topH + 150, x1 - x0 - 116, 16);
  sketchLine(c, rectPts(x0 + 58, topY + topH + 150, x1 - x0 - 116, 16), 2);
  // 牙板
  c.fillStyle = side; c.beginPath(); c.moveTo(x0 + 10, topY + topH); c.lineTo(x1 - 10, topY + topH); c.lineTo(x1 - 40, topY + topH + 30); c.quadraticCurveTo(300, topY + topH + 52, x0 + 40, topY + topH + 30); c.closePath(); c.fill();
  sketchLine(c, [[x0 + 10, topY + topH], [x0 + 40, topY + topH + 30], [170, topY + topH + 44], [300, topY + topH + 50], [430, topY + topH + 44], [x1 - 40, topY + topH + 30], [x1 - 10, topY + topH]], 2.2);
  // 桌面（透视）
  c.fillStyle = face; c.beginPath(); c.moveTo(x0 + 40, topY - 50); c.lineTo(x1 - 40, topY - 50); c.lineTo(x1, topY); c.lineTo(x0, topY); c.closePath(); c.fill();
  c.fillStyle = side; c.fillRect(x0, topY, x1 - x0, topH);
  // 化学：裂纹 + 起皮
  if (!lacquer) {
    const crack = clamp((y - 12) / 40, 0, 1), peel = clamp((y - 40) / 160, 0, 1);
    c.save(); c.beginPath(); c.moveTo(x0 + 40, topY - 50); c.lineTo(x1 - 40, topY - 50); c.lineTo(x1, topY); c.lineTo(x1, topY + topH); c.lineTo(x0, topY + topH); c.lineTo(x0, topY); c.closePath(); c.clip();
    if (peel > 0) peelSeed.forEach(([a, b, s, r], i) => { if (i / peelSeed.length > peel) return; const px = lerp(x0 + 20, x1 - 20, a), py = lerp(topY - 45, topY + topH - 4, b), rr = 10 + s * 34 * peel;
      c.fillStyle = wood; c.beginPath(); for (let k = 0; k < 9; k++) { const an = k / 9 * 6.28, q = rr * (.6 + .5 * Math.sin(k * 2.1 + r * 9)); k ? c.lineTo(px + Math.cos(an) * q, py + Math.sin(an) * q * .55) : c.moveTo(px + Math.cos(an) * q, py + Math.sin(an) * q * .55); } c.closePath(); c.fill();
      c.strokeStyle = 'rgba(90,60,30,.6)'; c.lineWidth = 1; for (let g = -2; g <= 2; g++) { c.beginPath(); c.moveTo(px - rr * .8, py + g * 3); c.lineTo(px + rr * .8, py + g * 3 + 1); c.stroke(); }
      sketchLine(c, [[px - rr, py], [px - rr * .5, py - rr * .5], [px + rr * .6, py - rr * .45], [px + rr, py + 2], [px + rr * .4, py + rr * .5], [px - rr * .6, py + rr * .45], [px - rr, py]], 1.3, INK, .8, 1); });
    if (crack > 0) crackSeed.forEach(([a, b, l, d], i) => { if (i / crackSeed.length > crack) return; const px = lerp(x0 + 10, x1 - 10, a), py = lerp(topY - 48, topY + topH, b); const pts = [[px, py]]; let qx = px, qy = py; for (let k = 0; k < 4; k++) { qx += (d - .5) * 30 + Math.sin(k + i) * 10; qy += (l - .5) * 12 + Math.cos(k * 2 + i) * 5; pts.push([qx, qy]); } sketchLine(c, pts, 1.2, 'rgba(30,18,10,.8)', .5, 1); });
    c.restore();
  }
  // 大漆：宝光
  if (lacquer) {
    const g = clamp(y / 60, 0, 1);
    const hl = c.createLinearGradient(x0, topY - 50, x1, topY);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.42, `rgba(255,240,220,${.15 + g * .45})`); hl.addColorStop(.5, 'rgba(255,255,255,0)');
    c.fillStyle = hl; c.beginPath(); c.moveTo(x0 + 40, topY - 50); c.lineTo(x1 - 40, topY - 50); c.lineTo(x1, topY); c.lineTo(x0, topY); c.closePath(); c.fill();
    if (g > .3) { c.fillStyle = `rgba(255,248,230,${g * .8})`; [[380, topY - 30], [396, topY - 38], [372, topY - 42]].forEach(([sx, sy], i) => { c.beginPath(); c.arc(sx, sy, 2.5 - i * .5, 0, 7); c.fill(); }); }
  } else {
    const shine = 1 - clamp(y / 10, 0, 1);
    if (shine > 0) { const hl = c.createLinearGradient(x0, topY - 50, x1, topY); hl.addColorStop(.38, 'rgba(255,255,255,0)'); hl.addColorStop(.44, `rgba(255,240,220,${shine * .3})`); hl.addColorStop(.5, 'rgba(255,255,255,0)'); c.fillStyle = hl; c.beginPath(); c.moveTo(x0 + 40, topY - 50); c.lineTo(x1 - 40, topY - 50); c.lineTo(x1, topY); c.lineTo(x0, topY); c.closePath(); c.fill(); }
  }
  sketchLine(c, [...seg(x0 + 40, topY - 50, x1 - 40, topY - 50, 10), ...seg(x1 - 40, topY - 50, x1, topY, 4), ...seg(x1, topY, x0, topY, 10), ...seg(x0, topY, x0 + 40, topY - 50, 4)], 2.6);
  sketchLine(c, rectPts(x0, topY, x1 - x0, topH), 2.6);
  // 茶杯
  c.fillStyle = '#f7efe0'; c.beginPath(); c.moveTo(236, topY - 38); c.lineTo(262, topY - 38); c.lineTo(258, topY - 16); c.lineTo(240, topY - 16); c.closePath(); c.fill();
  sketchLine(c, [[236, topY - 38], [240, topY - 16], [258, topY - 16], [262, topY - 38], [236, topY - 38]], 1.8);
  sketchLine(c, [[222, topY - 14], [276, topY - 14]], 1.6);
  if (!lacquer && rot > 0) { c.fillStyle = `rgba(80,60,40,${rot * .5})`; c.font = '20px ' + getComputedStyle(document.body).fontFamily; c.fillText('朽', x0 + 36, topY + topH + 200); c.fillText('朽', x1 - 52, topY + topH + 190); }
}
function updVs() {
  const y = +$('#vsRange').value;
  $('#vsYear').textContent = y;
  let cap = caps[0][1]; for (const k of caps) if (y >= k[0]) cap = k[1];
  $('#vsCap').textContent = cap;
  drawTable(vsA, y, false); drawTable(vsB, y, true);
}
$('#vsRange').addEventListener('input', updVs);

/* ---------- 4. 髹漆层叠 ---------- */
const lc = $('#layerCanvas'), lx = lc.getContext('2d'), LS = 900;
const clouds = [];
(function makeClouds(){
  const spiral = (cx0, cy0, r0, dir, rot) => { const pts = []; for (let a = 0; a < Math.PI*3.2; a += .08) { const r = r0*(1-a/(Math.PI*3.6)); pts.push([cx0+Math.cos(a*dir+rot)*r, cy0+Math.sin(a*dir+rot)*r]); } return pts; };
  for (let k = 0; k < 8; k++) {
    const ang = k/8*Math.PI*2, R = 250;
    const x = LS/2+Math.cos(ang)*R, y = LS/2+Math.sin(ang)*R;
    clouds.push(spiral(x, y, 42, 1, ang)); clouds.push(spiral(x+Math.cos(ang+1.6)*55, y+Math.sin(ang+1.6)*55, 26, -1, ang));
  }
  const c = []; for (let a = 0; a < Math.PI*2+.1; a += .03) c.push([LS/2+Math.cos(a)*345, LS/2+Math.sin(a)*345]); clouds.push(c);
  const c2 = []; for (let a = 0; a < Math.PI*2+.1; a += .03) c2.push([LS/2+Math.cos(a)*150, LS/2+Math.sin(a)*150]); clouds.push(c2);
  clouds.push(spiral(LS/2, LS/2, 110, 1, 0));
})();
const woodCv = document.createElement('canvas'); woodCv.width = woodCv.height = LS;
(function(){ const w = woodCv.getContext('2d'); w.fillStyle = '#d7b58a'; w.fillRect(0,0,LS,LS);
  for (let i = 0; i < 60; i++) { const y = rnd()*LS; const pts = []; for (let x = 0; x <= LS; x += 30) pts.push([x, y+Math.sin(x/90+i)*14]); sketchLine(w, pts, 1+rnd()*2, 'rgba(110,70,35,.45)', 1, 1); } })();
const circPts = (r, n = 90) => Array.from({length: n + 1}, (_, i) => [LS/2 + Math.cos(i/n*6.2832)*r, LS/2 + Math.sin(i/n*6.2832)*r]);
const lyStages = [
  [0, '制胎', '先用木头、竹子或者麻布做出器物的“骨头”，叫作胎。'],
  [.1, '裱布', '在木胎上用生漆裱一层麻布。这样木头热胀冷缩，漆面也不会裂。'],
  [.2, '刮灰', '用生漆调上瓦灰、鹿角灰，一遍一遍刮平、磨平。粗灰、中灰、细灰，一层都不能少。'],
  [.32, '髹漆', '开始上漆。每刷一道，都要进荫房等它阴干，再用水砂纸磨平，然后再刷下一道。'],
  [.72, '描金', '用漆调金粉，一笔一笔画上祥云。手不能抖，一笔下去就改不了了。'],
  [.88, '推光', '最后用手掌蘸着细灰和油，推上成百上千遍，直到漆面亮得能照出人影。']
];
let lyLast = -1;
function drawLayers() {
  const p = secProgress($('#layers'));
  let si = 0; lyStages.forEach((s,i) => { if (p >= s[0]) si = i; });
  if (si !== lyLast) { lyLast = si; $('#lyStage').textContent = lyStages[si][1]; $('#lyDesc').textContent = lyStages[si][2]; }
  const coats = Math.round(clamp((p-.32)/.4,0,1)*70);
  const days = Math.round(p < .32 ? p/.32*15 : 15 + coats*1.5 + clamp((p-.72)/.28,0,1)*30);
  $('#lyN').textContent = coats; $('#lyD').textContent = days;
  const c = lx, C = LS/2, R = 380;
  c.clearRect(0,0,LS,LS);
  c.fillStyle = 'rgba(43,30,22,.14)'; c.beginPath(); c.ellipse(C + 16, C + 22, R, R, 0, 0, 7); c.fill();
  c.save(); c.beginPath(); c.arc(C,C,R,0,7); c.clip();
  c.drawImage(woodCv,0,0);
  const cloth = clamp((p-.1)/.1,0,1);
  if (cloth > 0) { c.globalAlpha = cloth; c.fillStyle = '#c8b48f'; c.fillRect(0,0,LS,LS);
    c.strokeStyle = 'rgba(80,60,40,.45)'; c.lineWidth = 1.4;
    for (let i = 0; i < LS; i += 8) { c.beginPath(); c.moveTo(i,0); c.lineTo(i+4,LS); c.stroke(); c.beginPath(); c.moveTo(0,i); c.lineTo(LS,i+4); c.stroke(); }
    c.globalAlpha = 1; }
  const ash = clamp((p-.2)/.12,0,1);
  if (ash > 0) { c.globalAlpha = ash; c.fillStyle = mix('#9a9083','#6d665c',ash); c.fillRect(0,0,LS,LS);
    for (let i = 0; i < 40; i++) { const y = (i*97)%LS; sketchLine(c, seg(0, y, LS, y + 30, 8), 3, 'rgba(255,255,255,.12)', 2, 1); }
    c.globalAlpha = 1; }
  const lac = clamp((p-.32)/.4,0,1);
  if (lac > 0) {
    c.globalAlpha = clamp(lac*4,0,1);
    const g = c.createRadialGradient(C-120,C-140,20,C,C,R);
    g.addColorStop(0, ramp(['#6a3a25','#a3301f','#c7412e'], lac)); g.addColorStop(1, ramp(['#3a2016','#5a0f09','#6a0d08'], lac));
    c.fillStyle = g; c.fillRect(0,0,LS,LS);
    c.globalAlpha = 1;
    if (lac < .9) { c.globalAlpha = (1-lac)*.6; for (let i = 0; i < 40; i++) { const y = (i*53)%LS; sketchLine(c, seg(0, y, LS, y + 20, 6), 7, 'rgba(0,0,0,.18)', 2, 1); } c.globalAlpha = 1; }
  }
  const gold = clamp((p-.72)/.16,0,1);
  if (gold > 0) {
    c.shadowColor = 'rgba(255,210,120,.4)'; c.shadowBlur = 6;
    clouds.forEach((pts,k) => { const n = Math.floor(pts.length*clamp(gold*1.3 - k*0.012,0,1)); if (n < 2) return; sketchLine(c, pts.slice(0, n), 5, '#e2bd6a', 1.2, 2); });
    c.shadowBlur = 0;
  }
  const shine = clamp((p-.88)/.12,0,1);
  if (lac > .3) {
    c.globalAlpha = .15 + lac*.25 + shine*.5;
    const s = c.createRadialGradient(C-140,C-170,5,C-140,C-170,260);
    s.addColorStop(0,'rgba(255,245,230,.9)'); s.addColorStop(1,'rgba(255,245,230,0)');
    c.fillStyle = s; c.fillRect(0,0,LS,LS); c.globalAlpha = 1;
  }
  if (shine > 0) {
    const x = lerp(-LS, LS*2, shine);
    const sg = c.createLinearGradient(x-200,0,x+200,LS);
    sg.addColorStop(0,'rgba(255,255,255,0)'); sg.addColorStop(.5,'rgba(255,255,255,.35)'); sg.addColorStop(1,'rgba(255,255,255,0)');
    c.fillStyle = sg; c.fillRect(0,0,LS,LS);
  }
  c.restore();
  sketchLine(c, circPts(R), 4, INK, 2.2, 2);
  sketchLine(c, circPts(R + 18), 1.6, 'rgba(43,30,22,.4)', 3, 1);
}

/* ---------- 5. 推光 ---------- */
const pc = $('#polishCanvas'), px = pc.getContext('2d');
let polishDone = false, rubbing = false, lastP = null, rubTicks = 0;
function sizePolish() {
  const r = pc.getBoundingClientRect(); pc.width = r.width; pc.height = r.height;
  px.globalCompositeOperation = 'source-over';
  px.fillStyle = '#3b2c22'; px.fillRect(0,0,pc.width,pc.height);
  for (let i = 0; i < pc.width*pc.height/18; i++) { px.fillStyle = `rgba(${Math.random()<.5?90:20},${Math.random()<.5?70:15},50,.35)`; px.fillRect(Math.random()*pc.width, Math.random()*pc.height, 2, 2); }
  polishDone = false;
}
function rubAt(p) {
  px.globalCompositeOperation = 'destination-out';
  const g = px.createRadialGradient(p.x,p.y,0,p.x,p.y,44);
  g.addColorStop(0,'rgba(0,0,0,.09)'); g.addColorStop(1,'rgba(0,0,0,0)');
  px.fillStyle = g; px.beginPath(); px.arc(p.x,p.y,44,0,7); px.fill();
}
const mirror = $('#mirror');
mirror.addEventListener('pointerdown', e => { rubbing = true; lastP = pos(e,pc); mirror.setPointerCapture(e.pointerId); });
mirror.addEventListener('pointerup', () => { rubbing = false; });
mirror.addEventListener('pointermove', e => {
  const p = pos(e,pc), r = mirror.getBoundingClientRect();
  $('#mirrorLight').style.transform = `translateX(${(p.x/r.width-.5)*60}%)`;
  if (!rubbing) return;
  const d = Math.hypot(p.x-lastP.x, p.y-lastP.y), n = Math.ceil(d/6);
  for (let i = 1; i <= n; i++) rubAt({x:lerp(lastP.x,p.x,i/n), y:lerp(lastP.y,p.y,i/n)});
  lastP = p;
  if (++rubTicks % 8 === 0) checkPolish();
});
function checkPolish() {
  const d = px.getImageData(0,0,pc.width,pc.height).data; let s = 0, n = 0;
  for (let i = 3; i < d.length; i += 4*37) { s += d[i]; n++; }
  const prog = clamp((1 - s/(n*255))/.8,0,1);
  $('#polishBar').style.width = prog*100 + '%';
  $('.mirror-reflect').style.color = `rgba(255,240,215,${prog*.55})`;
  $('#mirrorLight').style.opacity = prog;
  if (prog >= 1 && !polishDone) { polishDone = true; $('#polishTip').innerHTML = '亮了。这就是古人说的“以漆为镜”。<br>你刚才推了几十下，真正的匠人，要推上千下。'; }
}

/* ---------- 数字滚动 ---------- */
const numIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; numIO.unobserve(e.target);
  const el = e.target, to = +el.dataset.to, suf = el.dataset.suf || '', t0 = performance.now();
  const step = t => { const k = clamp((t-t0)/1800,0,1), v = Math.round(to*(1-Math.pow(1-k,3))); el.textContent = v + (k === 1 ? suf : ''); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), {threshold:.5});
document.querySelectorAll('.nums em').forEach(el => numIO.observe(el));

window.YDQ = { sketchLine, seg, rectPts, rnd };

/* ---------- loop ---------- */
function onResize() { sizeCut(); sizePolish(); }
addEventListener('resize', onResize);
function onScroll() {
  const h = document.documentElement; $('#progress').style.width = (h.scrollTop/(h.scrollHeight-innerHeight)*100) + '%';
  updAlive(); drawLayers();
}
addEventListener('scroll', onScroll, {passive:true});
function loop(t) { drawCut(t); requestAnimationFrame(loop); }
function start() { onResize(); onScroll(); updVs(); requestAnimationFrame(loop); }
addEventListener('load', start);
if (document.fonts) document.fonts.ready.then(() => { if (bark) sizeCut(); updVs(); });
})();
