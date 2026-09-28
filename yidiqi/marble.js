(() => {
/* 漆扇：基于真实水拓“墨流”数学模型的矢量流体
   滴漆：p' = c + (p - c) * sqrt(1 + r² / |p - c|²)
   划针：沿拖动方向按距离指数衰减位移 */
const cv = document.getElementById('marble'), ctx = cv.getContext('2d');
const card = document.getElementById('card'), cc = card.getContext('2d');
const HAND = '"LXGW WenKai","Kaiti SC","STKaiti","KaiTi",serif';
const INK = '#2b1e16';
const COLORS = [['朱砂','#b3241a'],['石黄','#e0a92e'],['石绿','#2f7a5b'],['黛青','#23456e'],['赭石','#8a4b22'],['金','#d8b25a'],['象牙','#efe4cc'],['玄黑','#120c09']];
let color = COLORS[0][1], S = 600, drops = [], water;
const pal = document.getElementById('palette');
COLORS.forEach(([n,c],i) => { const b = document.createElement('button'); b.style.background = c; b.title = n; if (!i) b.classList.add('on');
  b.onclick = () => { color = c; pal.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }; pal.appendChild(b); });

function size() { const r = cv.getBoundingClientRect(); S = Math.round(r.width); cv.width = cv.height = S * 2; ctx.setTransform(2,0,0,2,0,0); makeWater(); }
function makeWater() {
  water = document.createElement('canvas'); water.width = water.height = S;
  const w = water.getContext('2d');
  const g = w.createRadialGradient(S*.4,S*.35,10,S/2,S/2,S*.6);
  g.addColorStop(0,'#3b4c48'); g.addColorStop(1,'#16211f');
  w.fillStyle = g; w.fillRect(0,0,S,S);
}
function addDrop(x, y, r, c) {
  const r2 = r*r;
  for (const d of drops) for (const p of d.pts) {
    const dx = p[0]-x, dy = p[1]-y, m2 = dx*dx+dy*dy || 1e-6, k = Math.sqrt(1 + r2/m2);
    p[0] = x + dx*k; p[1] = y + dy*k;
  }
  const pts = [], N = 160;
  for (let i = 0; i < N; i++) { const a = i/N*Math.PI*2; pts.push([x+Math.cos(a)*r, y+Math.sin(a)*r]); }
  drops.push({pts, c});
  if (drops.length > 90) drops.shift();
}
function tine(x0, y0, x1, y1) {
  const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy); if (L < 1) return;
  const mx = dx/L, my = dy/L, z = Math.min(L*1.1, 40), u = 1/(S*0.018);
  for (const d of drops) {
    for (const p of d.pts) {
      const t = Math.max(0, Math.min(L, (p[0]-x0)*mx+(p[1]-y0)*my));
      const f = z * Math.exp(-Math.hypot(p[0]-(x0+mx*t), p[1]-(y0+my*t))*u);
      p[0] += mx*f; p[1] += my*f;
    }
    const np = [];
    for (let i = 0; i < d.pts.length; i++) {
      const a = d.pts[i], b = d.pts[(i+1)%d.pts.length]; np.push(a);
      if (Math.hypot(b[0]-a[0], b[1]-a[1]) > 6 && d.pts.length + np.length < 1400) np.push([(a[0]+b[0])/2, (a[1]+b[1])/2]);
    }
    d.pts = np;
  }
}
function render() {
  ctx.clearRect(0,0,S,S);
  ctx.save(); ctx.beginPath(); ctx.arc(S/2,S/2,S/2,0,7); ctx.clip();
  ctx.drawImage(water,0,0);
  for (const d of drops) { ctx.beginPath(); d.pts.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1])); ctx.closePath(); ctx.fillStyle = d.c; ctx.fill(); }
  const hl = ctx.createRadialGradient(S*.32,S*.25,5,S*.32,S*.25,S*.5);
  hl.addColorStop(0,'rgba(255,255,255,.18)'); hl.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle = hl; ctx.fillRect(0,0,S,S);
  ctx.restore();
}
let down = null, moved = false, dirty = true, cardTimer = null;
const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX-r.left, e.clientY-r.top]; };
cv.addEventListener('pointerdown', e => { down = pos(e); moved = false; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', e => { if (!down) return; const p = pos(e); if (Math.hypot(p[0]-down[0],p[1]-down[1]) > 3) { tine(down[0],down[1],p[0],p[1]); down = p; moved = true; dirty = true; } });
cv.addEventListener('pointerup', () => { if (down && !moved) { addDrop(down[0], down[1], S*(0.04+Math.random()*0.04), color); dirty = true; } down = null; clearTimeout(cardTimer); cardTimer = setTimeout(drawCard, 250); });
(function loop(){ if (dirty && water) { render(); dirty = false; } requestAnimationFrame(loop); })();

function seed() {
  drops = [];
  ['#b3241a','#efe4cc','#120c09','#d8b25a','#b3241a','#23456e','#efe4cc','#b3241a'].forEach((c,i) => addDrop(S/2 + Math.cos(i*2.4)*S*.06, S/2 + Math.sin(i*2.4)*S*.06, S*(0.14 - i*0.008), c));
  for (let k = 0; k < 5; k++) { const y = S*(.2+k*.15); tine(S*.05, y, S*.95, y); }
  dirty = true;
}

/* ---------- 拓扇落款：一张卡 ---------- */
function drawCard() {
  if (dirty && water) { render(); dirty = false; }
  const {sketchLine, seg, rnd} = window.YDQ;
  const c = cc, W = 1080, H = 1350;
  const name = (document.getElementById('nameIn').value.trim() || '有缘人');
  const wish = document.getElementById('wishIn').value.trim() || '正于心 · 明于器';
  // 宣纸
  c.fillStyle = '#f4ebd9'; c.fillRect(0,0,W,H);
  for (let i = 0; i < 14000; i++) { c.fillStyle = `rgba(90,65,40,${Math.random()*.06})`; c.fillRect(Math.random()*W, Math.random()*H, 1.5, 1.5); }
  for (let i = 0; i < 90; i++) { c.strokeStyle = `rgba(120,95,60,${Math.random()*.08})`; c.lineWidth = .8; c.beginPath(); const x = Math.random()*W, y = Math.random()*H; c.moveTo(x,y); c.quadraticCurveTo(x+20, y+Math.random()*30-15, x+40+Math.random()*40, y+Math.random()*20-10); c.stroke(); }
  const box = (x,y,w,h,lw,col) => sketchLine(c, [...seg(x,y,x+w,y,14),...seg(x+w,y,x+w,y+h,18),...seg(x+w,y+h,x,y+h,14),...seg(x,y+h,x,y,18)], lw, col, 2.2, 2);
  box(48,48,W-96,H-96,4,INK); box(70,70,W-140,H-140,1.6,'rgba(168,35,26,.7)');
  c.fillStyle = '#a8231a'; c.font = `34px ${HAND}`; c.textAlign = 'center';
  c.fillText('平利牛王漆 · 水拓漆扇', W/2, 150);
  // 扇
  const fx = W/2, fy = 760, R1 = 470, R0 = 170, a0 = Math.PI*1.14, a1 = Math.PI*1.86, ribs = 16;
  const sector = () => { c.beginPath(); c.arc(fx,fy,R1,a0,a1); c.arc(fx,fy,R0,a1,a0,true); c.closePath(); };
  c.save(); c.translate(10,14); sector(); c.fillStyle = 'rgba(43,30,22,.15)'; c.fill(); c.restore();
  c.save(); sector(); c.clip();
  c.fillStyle = '#efe6d2'; c.fillRect(0,0,W,H);
  const sw = cv.width, k = sw*.74;
  c.drawImage(cv, (sw-k)/2, (sw-k)/2, k, k, fx-R1, fy-R1*1.02, R1*2, R1*2);
  for (let i = 0; i <= ribs; i++) {
    const a = a0 + (a1-a0)*i/ribs;
    c.strokeStyle = 'rgba(43,30,22,.28)'; c.lineWidth = 2; c.beginPath(); c.moveTo(fx+Math.cos(a)*R0, fy+Math.sin(a)*R0); c.lineTo(fx+Math.cos(a)*R1, fy+Math.sin(a)*R1); c.stroke();
    if (i < ribs) { const am = a + (a1-a0)/ribs/2; c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 8; c.beginPath(); c.moveTo(fx+Math.cos(am)*R0, fy+Math.sin(am)*R0); c.lineTo(fx+Math.cos(am)*R1, fy+Math.sin(am)*R1); c.stroke(); }
  }
  c.restore();
  const arc = (r, n=40) => Array.from({length:n+1}, (_,i) => { const a = a0 + (a1-a0)*i/n; return [fx+Math.cos(a)*r, fy+Math.sin(a)*r]; });
  sketchLine(c, arc(R1), 3.5, INK, 1.6, 2); sketchLine(c, arc(R0,20), 3, INK, 1.2, 2);
  [a0, a1].forEach(a => sketchLine(c, seg(fx+Math.cos(a)*R0, fy+Math.sin(a)*R0, fx+Math.cos(a)*R1, fy+Math.sin(a)*R1, 10), 3.5, INK, 1.4, 2));
  for (let i = 0; i <= ribs; i++) { const a = a0 + (a1-a0)*i/ribs; const e = i === 0 || i === ribs;
    c.strokeStyle = e ? '#4a2c18' : '#8a5a34'; c.lineWidth = e ? 11 : 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx+Math.cos(a)*R0*1.02, fy+Math.sin(a)*R0*1.02); c.stroke(); }
  c.fillStyle = '#d4ae62'; c.beginPath(); c.arc(fx,fy,11,0,7); c.fill(); sketchLine(c, Array.from({length:13},(_,i)=>[fx+Math.cos(i/12*6.28)*11, fy+Math.sin(i/12*6.28)*11]), 2, INK, .5, 1);
  // 扇坠
  sketchLine(c, [[fx, fy+10],[fx+6, fy+60],[fx+2, fy+100]], 2, '#a8231a', 1, 1);
  c.fillStyle = '#a8231a'; c.beginPath(); c.moveTo(fx-8, fy+100); c.lineTo(fx+12, fy+100); c.lineTo(fx+16, fy+150); c.lineTo(fx-12, fy+150); c.closePath(); c.fill();
  // 名字（竖排，左侧落款）
  const chars = [...name], n = chars.length, fs = n <= 2 ? 130 : n === 3 ? 112 : n === 4 ? 92 : 76;
  c.font = `bold ${fs}px ${HAND}`; c.fillStyle = INK; c.textAlign = 'center';
  const nx = 175, ny0 = 930;
  chars.forEach((ch, i) => c.fillText(ch, nx, ny0 + i*fs*1.02));
  // 印章
  const sx = nx - 44, sy = ny0 + n*fs*1.02 - fs*.55;
  c.save(); c.translate(sx, sy); c.rotate(-.05);
  c.fillStyle = '#b3261e'; c.fillRect(0,0,88,88);
  c.strokeStyle = '#f4ebd9'; c.lineWidth = 3; c.strokeRect(7,7,74,74);
  c.fillStyle = '#f7e2d6'; c.font = `bold 30px ${HAND}`; c.fillText('正大', 44, 40); c.fillText('明漆', 44, 74);
  c.restore();
  // 右下文字
  c.textAlign = 'right'; c.fillStyle = INK; c.font = `48px ${HAND}`;
  c.fillText(wish, W-130, 1010);
  c.fillStyle = 'rgba(43,30,22,.7)'; c.font = `28px ${HAND}`;
  c.fillText('以天然大漆拓之 · 世间仅此一把', W-130, 1070);
  const d = new Date(); c.fillText(`${d.getFullYear()} 年 ${d.getMonth()+1} 月 ${d.getDate()} 日`, W-130, 1115);
  c.textAlign = 'center'; c.fillStyle = '#a8231a'; c.font = `30px ${HAND}`;
  c.fillText('正大明集团 · 始于一九二五', W/2, H-120);
}
document.getElementById('btnFan').onclick = drawCard;
document.getElementById('nameIn').addEventListener('input', drawCard);
document.getElementById('wishIn').addEventListener('input', drawCard);
document.getElementById('btnClear').onclick = () => { drops = []; dirty = true; setTimeout(drawCard, 50); };
document.getElementById('btnSave').onclick = () => { drawCard(); const a = document.createElement('a'); a.download = '我的大漆漆扇-' + (document.getElementById('nameIn').value || '有缘人') + '.png'; a.href = card.toDataURL('image/png'); a.click(); };

addEventListener('load', () => { size(); seed(); setTimeout(drawCard, 60); });
if (document.fonts) document.fonts.ready.then(() => setTimeout(drawCard, 100));
addEventListener('resize', () => { const old = S; size(); const k = S/old; drops.forEach(d => d.pts.forEach(p => { p[0] *= k; p[1] *= k; })); dirty = true; });
})();
