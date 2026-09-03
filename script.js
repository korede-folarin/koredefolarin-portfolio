const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.classList.toggle('open');
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn?.classList.remove('open'); nav?.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false');
}));

// CV placeholder
const modal = document.querySelector('.cv-modal');
document.querySelectorAll('[data-cv-placeholder]').forEach(btn => btn.addEventListener('click', () => {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('.cv-close,.cv-close-secondary').forEach(btn => btn.addEventListener('click', () => {
  modal.hidden = true; document.body.style.overflow = '';
}));
modal?.addEventListener('click', e => { if (e.target === modal) { modal.hidden = true; document.body.style.overflow=''; } });

// Reveal on scroll
const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Expertise interaction
const expertise = {
  ai: ['AI Engineering','Designing and building end-to-end AI systems.','From retrieval and tool integration to APIs and deployment, with an emphasis on maintainability and production readiness.',['LLMs, RAG and tool integration','APIs and service orchestration','Evaluation and observability','Deployment and monitoring']],
  agents: ['Agentic Systems','Building systems that can retrieve, reason, use tools and escalate.','Agentic design is useful only when the orchestration, memory, tool boundaries and human controls are deliberate.',['Tool use and orchestration','Memory and context design','Human-in-the-loop escalation','Auditability and guardrails']],
  eval: ['AI Evaluation & Reliability','Testing whether AI behaves well beyond a polished demo.','I focus on groundedness, retrieval quality, failure modes, abstention and the evidence needed to trust outputs.',['Grounding and retrieval evaluation','Failure analysis and test sets','Confidence and abstention','Safety, monitoring and escalation']],
  ml: ['Machine Learning','Turning data into decisions with rigorous validation.','From feature engineering and model comparison to calibration, explainability and temporal validation.',['Feature engineering','Model comparison and calibration','Explainability and diagnostics','Temporal validation and drift']],
  ops: ['ML / AI Operations','Keeping systems reproducible, observable and maintainable.','The model is only one component. I care about the pipeline, deployment, monitoring and controls around it.',['Experiment tracking and reproducibility','CI/CD and containerisation','Drift and performance monitoring','Production-oriented APIs and services']]
};
const tabs = document.querySelectorAll('.expertise-tab');
const title = document.getElementById('expertiseTitle');
const desc = document.getElementById('expertiseDesc');
const list = document.getElementById('expertiseList');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
  const [kicker,t,d,items] = expertise[tab.dataset.expertise];
  document.querySelector('.detail-kicker').textContent = kicker;
  title.textContent = t; desc.textContent = d; list.innerHTML = items.map(i=>`<li>${i}</li>`).join('');
}));

// High-resolution hero artwork with subtle pointer parallax.
(function initHeroArtwork(){
  const stage=document.querySelector('.hero-image-stage');
  const motion=document.querySelector('.hero-image-motion');
  if(!stage||!motion||reduceMotion)return;
  let tx=0,ty=0,cx=0,cy=0,raf=0;
  const render=()=>{
    cx+=(tx-cx)*.075; cy+=(ty-cy)*.075;
    motion.style.transform=`translate3d(${cx*12}px,${cy*8}px,0) rotateX(${-cy*1.2}deg) rotateY(${cx*1.5}deg)`;
    raf=requestAnimationFrame(render);
  };
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5)*2; ty=((e.clientY-r.top)/r.height-.5)*2;
  });
  stage.addEventListener('pointerleave',()=>{tx=0;ty=0});
  render();
})();

function fitCanvas(canvas){const r=canvas.getBoundingClientRect();const d=Math.min(devicePixelRatio,2);canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);return {c,w:r.width,h:r.height};}

// Sentinel terrain
function terrain(){const canvas=document.getElementById('terrainCanvas');if(!canvas)return;let anim=0;
  const draw=()=>{const {c,w,h}=fitCanvas(canvas);c.clearRect(0,0,w,h);for(let row=0;row<12;row++){c.beginPath();for(let x=0;x<=w;x+=5){const y=h*.72-row*8-Math.sin(x*.028+row*.65+anim)*14-Math.sin(x*.009+row)*20*(row/12);x?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle=`rgba(88,112,101,${.10+row*.025})`;c.lineWidth=1;c.stroke()}for(let i=0;i<55;i++){const x=(i*97)%w,y=h*.45+Math.sin(i*2.4+anim)*50;c.fillStyle=i%4===0?'rgba(185,153,88,.55)':'rgba(69,98,86,.3)';c.beginPath();c.arc(x,y,1.2,0,Math.PI*2);c.fill()}if(!reduceMotion){anim+=.012;requestAnimationFrame(draw)}};draw();}
terrain();

// Fraud particle stream
function fraud(){const canvas=document.getElementById('fraudCanvas');if(!canvas)return;let t=0;
  const draw=()=>{const {c,w,h}=fitCanvas(canvas);c.clearRect(0,0,w,h);const cx=w*.63,cy=h*.5;c.strokeStyle='rgba(216,193,140,.55)';c.beginPath();c.arc(cx,cy,42,0,Math.PI*2);c.stroke();for(let i=0;i<180;i++){const p=(i/180);const x=(p*w*.76 + (t*18+i*3)%35);const spread=(1-p)*70;let y=cy+Math.sin(i*1.8+t)*spread*.55;if(x>cx){const branch=(i%4===0?-1:1);y=cy+branch*(x-cx)*.28+Math.sin(i+t)*12}const alpha=.25+.65*p;c.fillStyle=x>cx&&y<cy?'rgba(213,105,67,'+alpha+')':'rgba(229,235,230,'+alpha+')';c.beginPath();c.arc(x,y,1.1+(i%5===0),0,Math.PI*2);c.fill()}if(!reduceMotion){t+=.018;requestAnimationFrame(draw)}};draw();}
fraud();

// Contact wave
function wave(){const canvas=document.getElementById('waveCanvas');if(!canvas)return;let t=0;
 const draw=()=>{const {c,w,h}=fitCanvas(canvas);c.clearRect(0,0,w,h);for(let row=0;row<18;row++){c.beginPath();for(let x=0;x<=w;x+=6){const y=h*.55+Math.sin(x*.018+row*.32+t)*24+Math.sin(x*.007+t*.5)*48+row*5;x?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle=`rgba(196,164,106,${.03+row*.018})`;c.lineWidth=.8;c.stroke()}for(let i=0;i<35;i++){const x=(i*83+t*20)%w,y=h*.5+Math.sin(i*1.9+t)*80;c.fillStyle='rgba(216,193,140,.45)';c.beginPath();c.arc(x,y,1.2,0,Math.PI*2);c.fill()}if(!reduceMotion){t+=.009;requestAnimationFrame(draw)}};draw();}
wave();
