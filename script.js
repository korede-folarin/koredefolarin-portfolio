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

// Lightweight 3D hero, loaded from CDN. Falls back gracefully if unavailable.
async function initHero3D(){
  const canvas = document.getElementById('hero3d'); if(!canvas) return;
  try{
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,0.15,8.2);
    const group = new THREE.Group(); scene.add(group);

    const glassMat = new THREE.MeshPhysicalMaterial({color:0x57786b,transparent:true,opacity:.14,roughness:.18,metalness:.05,transmission:.7,thickness:.1,side:THREE.DoubleSide});
    for(let i=0;i<7;i++){
      const g = new THREE.PlaneGeometry(3.7,3.7);
      const m = new THREE.Mesh(g,glassMat.clone());
      m.rotation.set((i-3)*.12,(i-3)*.17,(i%2?1:-1)*(i*.05)); m.position.z=(i-3)*.16; group.add(m);
    }
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55,1),new THREE.MeshStandardMaterial({color:0x153d33,roughness:.45,metalness:.2,transparent:true,opacity:.88}));
    core.rotation.set(.45,.7,.2); group.add(core);

    const nodeGeom = new THREE.SphereGeometry(.075,14,14);
    const nodeMat = new THREE.MeshStandardMaterial({color:0xd7bd82,emissive:0x6c5526,emissiveIntensity:.8,metalness:.35,roughness:.25});
    const nodes=[];
    for(let i=0;i<26;i++){
      const n=new THREE.Mesh(nodeGeom,nodeMat.clone());
      const r=1.75+Math.random()*1.05, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
      n.position.set(r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph),r*Math.sin(ph)*Math.sin(th));
      n.userData.base=n.scale.x=0.8+Math.random()*.9; n.scale.setScalar(n.userData.base); group.add(n); nodes.push(n);
    }
    const pts=[];
    nodes.forEach((a,i)=>nodes.slice(i+1).forEach(b=>{if(a.position.distanceTo(b.position)<1.55){pts.push(a.position.clone(),b.position.clone())}}));
    const lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xb99a58,transparent:true,opacity:.34})); group.add(lines);

    const base = new THREE.Group(); scene.add(base);
    const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.25,.32,64),new THREE.MeshStandardMaterial({color:0x33584c,roughness:.55,metalness:.2})); cyl1.position.y=-2.35;base.add(cyl1);
    const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.9,.22,64),new THREE.MeshStandardMaterial({color:0x647d72,roughness:.45,metalness:.12})); cyl2.position.y=-2.05;base.add(cyl2);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.86,.025,10,80),new THREE.MeshBasicMaterial({color:0xd7bd82})); ring.rotation.x=Math.PI/2; ring.position.y=-2.18;base.add(ring);

    scene.add(new THREE.AmbientLight(0xffffff,2.1));
    const key=new THREE.PointLight(0xffe5ad,9,15);key.position.set(3.5,4,5);scene.add(key);
    const fill=new THREE.PointLight(0x91b7a7,7,15);fill.position.set(-4,-1,3);scene.add(fill);

    let px=0,py=0; const target={x:0,y:0};
    canvas.closest('.hero-visual')?.addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect();target.x=((e.clientX-r.left)/r.width-.5)*.35;target.y=((e.clientY-r.top)/r.height-.5)*.25});
    canvas.closest('.hero-visual')?.addEventListener('pointerleave',()=>{target.x=0;target.y=0});
    function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
    resize(); new ResizeObserver(resize).observe(canvas);
    const clock=new THREE.Clock();
    function tick(){
      const t=clock.getElapsedTime(); px+=(target.x-px)*.025;py+=(target.y-py)*.025;
      if(!reduceMotion){group.rotation.y=t*.10+px;group.rotation.x=Math.sin(t*.23)*.06-py;group.position.y=Math.sin(t*.55)*.08;nodes.forEach((n,i)=>n.scale.setScalar(n.userData.base*(1+.18*Math.sin(t*1.5+i))));}
      renderer.render(scene,camera);requestAnimationFrame(tick);
    } tick();
  }catch(err){canvas.style.background='radial-gradient(circle at 50% 45%, rgba(31,78,66,.25), transparent 52%)';}
}
initHero3D();

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
