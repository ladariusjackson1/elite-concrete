(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=id=>document.getElementById(id);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const sm=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function bannerOffset(){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--banner'))||0}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---------- Smooth scroll ---------- */
let lenis=null;
if(window.Lenis&&!reduce){try{lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});}catch(e){lenis=null}}
function goTo(y,instant){if(lenis)lenis.scrollTo(y,{immediate:!!instant,duration:1.6});else window.scrollTo({top:y,behavior:instant||reduce?'auto':'smooth'})}
document.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);const t=$(id);if(!t)return;e.preventDefault();closeMenu();goTo(id==='top'?0:t.getBoundingClientRect().top+scrollY-(id==='calc'?100:0)-bannerOffset())}));

/* ---------- Loader, then hero entrance ---------- */
const loader=$('loader'),ldBar=$('ldBar'),hero=$('top');
const t0=performance.now();
(function ld(now){const t=clamp((now-t0)/(reduce?50:1000));ldBar.style.transform=`scaleX(${ease(t)})`;if(t<1)requestAnimationFrame(ld);else{loader.classList.add('out');document.body.classList.add('scene-on');setTimeout(()=>hero.classList.add('is-in'),reduce?0:250);setTimeout(()=>loader.remove(),1300)}})(t0);
setTimeout(()=>{hero.classList.add('is-in');document.body.classList.add('scene-on')},3300);

/* ---------- Mobile menu ---------- */
const menuBtn=$('menuBtn');
function closeMenu(){document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');$('menuLbl').textContent='Menu';if(lenis)lenis.start()}
menuBtn.addEventListener('click',()=>{const o=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',o);menuBtn.setAttribute('aria-expanded',o);$('menuLbl').textContent=o?'Close':'Menu';if(lenis)o?lenis.stop():lenis.start();
  document.querySelectorAll('.mm nav a').forEach((a,i)=>{a.querySelectorAll('span,small').forEach(s=>s.style.transitionDelay=o?(.25+i*.06)+'s':'0s')})});
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

/* ---------- Chapter rail ---------- */
const chaps=[...document.querySelectorAll('[data-ch]')],rail=$('rail');
chaps.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<b>${c.dataset.ch}</b>${String(i+1).padStart(2,'0')}<i></i>`;b.setAttribute('aria-label','Go to '+c.dataset.ch);b.addEventListener('click',()=>goTo(i===0?0:c.getBoundingClientRect().top+scrollY-bannerOffset()));rail.appendChild(b)});
const railBtns=[...rail.children];let railOn=-1;

/* ---------- Reveals (only for what starts below the fold) ---------- */
const revealEls=[...document.querySelectorAll('.coll-head .ml,.coll-head .fade,.prin .ml,.prin .fade,.tenet,.work .ml,.work .fade,.proj,.proc-head .ml,.proc-head .fade,.final .ml,.final .fade,.stmt .fade')];
if('IntersectionObserver' in window&&!reduce){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
  revealEls.forEach(el=>{if(el.id==='stmtSub')return;if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el)}});
  document.querySelectorAll('.coll-head .ml:nth-child(2)>span,.prin .ml:nth-child(2)>span,.work .ml:nth-child(2)>span,.proc-head .ml:nth-child(2)>span,.final-h .ml:nth-child(2)>span').forEach(s=>s.style.transitionDelay='.12s');
}

/* ---------- Statement: words light up with scroll ---------- */
const stmtH=$('stmtH'),stmt=$('about'),stmtSub=$('stmtSub');
stmtH.innerHTML=stmtH.textContent.split(' ').map(w=>`<span class="wd">${w}</span>`).join(' ');
const words=[...stmtH.querySelectorAll('.wd')];

/* ---------- Collection: horizontal pin ---------- */
const collPin=$('collPin'),collTrack=$('collTrack'),collBar=$('collBar'),collNum=$('collNum');let collOn=false,collDist=0;
function collSetup(){collOn=innerWidth>=900&&!reduce;collPin.classList.toggle('coll-on',collOn);collPin.classList.toggle('coll-off',!collOn);collTrack.style.transform='';if(collOn){collDist=Math.max(0,collTrack.scrollWidth-innerWidth);collPin.style.height=(collDist+innerHeight)+'px'}else collPin.style.height=''}
collSetup();addEventListener('resize',collSetup);

/* ---------- Custom cursor on imagery ---------- */
const cur=$('cur');let cx=0,cy=0,qx=0,qy=0;
addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY});
if(fine){document.querySelectorAll('.cp,.proj').forEach(el=>{el.addEventListener('pointerenter',()=>{cur.textContent=el.classList.contains('cp')?(collOn?'Scroll':'View'):'Open';cur.classList.add('on')});el.addEventListener('pointerleave',()=>cur.classList.remove('on'))})}

/* ---------- Lightbox for projects ---------- */
const lb=$('lb'),lbImg=$('lbImg'),lbCap=$('lbCap');let lbLast=null;
document.querySelectorAll('.proj-img').forEach(b=>b.addEventListener('click',()=>{const im=b.querySelector('img');lbLast=b;lbImg.src=im.src;lbImg.alt=im.alt;lbCap.textContent=im.alt;lb.hidden=false;cur.classList.remove('on');if(lenis)lenis.stop();$('lbX').focus()}));
function lbClose(){lb.hidden=true;if(lenis)lenis.start();if(lbLast)lbLast.focus()}
$('lbX').addEventListener('click',lbClose);lb.addEventListener('click',e=>{if(e.target===lb)lbClose()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)lbClose()});

/* ---------- Magnetic buttons ---------- */
if(fine&&!reduce)document.querySelectorAll('.magnet').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});

/* ---------- Reviews ---------- */
const qs=[...document.querySelectorAll('.q')],qb=[...$('revNav').children];let qi=0,qT=0,qLast=performance.now();const QDUR=7000;
function showQ(i){qs[qi].classList.remove('on');qb[qi].classList.remove('on');qb[qi].querySelector('i').style.transform='scaleX(0)';qi=i;qs[qi].classList.add('on');qb[qi].classList.add('on');qT=0}
qb.forEach((b,i)=>b.addEventListener('click',()=>showQ(i)));

/* ---------- Full page 3D build ---------- */
const STG=[{a:0,s:'Site ready',n:'Lights up and forms staged. Keep scrolling to build the slab.'},
 {a:.1,s:'Grade & form',n:'4 in of #57 stone, compacted. Forms set at 1/8 in per ft of slope.'},
 {a:.24,s:'Reinforce',n:'#4 rebar tied on an 18 in grid and lifted on 2 in chairs.'},
 {a:.42,s:'Pour',n:'4,000 psi mix with 6% air, placed in one continuous pour.'},
 {a:.6,s:'Finish',n:'Screeded, floated, and broomed. Joints cut every 10 ft.'},
 {a:.8,s:'Cure',n:'Walk on it in 24 hrs. Drive on it in 7 days. Full strength at 28.'}];
const AN=[['about',.1],['services',.22],['standard',.42],['work',.6],['reviews',.8],['contact',.96]];
const hudTicks=$('hudTicks');STG.slice(1).forEach(x=>{const t=document.createElement('span');t.style.left=(x.a*100)+'%';hudTicks.appendChild(t)});
function sceneTarget(){const vh=innerHeight,y=scrollY+vh*.6;const pts=[[vh*.6,0]];AN.forEach(([id,t])=>{const el=$(id);if(el)pts.push([el.getBoundingClientRect().top+scrollY,t])});pts.push([document.documentElement.scrollHeight-vh*.4,1]);
  for(let i=0;i<pts.length-1;i++){if(y<=pts[i+1][0]){const[a0,t0]=pts[i],[a1,t1]=pts[i+1];return lerp(t0,t1,clamp((y-a0)/Math.max(1,a1-a0)))}}return 1}
let tS=0,stShown=-1;
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function initThree(){
  if(!window.THREE)return null;
  const canvas=document.getElementById('gl');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})}catch(e){return null}
  const mobile=innerWidth<700;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.75:2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const bg=new THREE.Color(0x0f0f0e);
  scene.background=bg;
  scene.fog=new THREE.Fog(0x0f0f0e,16,40);
  const camera=new THREE.PerspectiveCamera(mobile?48:36,1,.1,100);

  const R=rng(7);
  const soil=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#3a332c';g.fillRect(0,0,w,h);for(let i=0;i<16000;i++){const v=30+R()*50|0;g.fillStyle=`rgba(${v+14},${v+6},${v},.5)`;g.fillRect(R()*w,R()*h,1+R()*2,1+R()*2)}});
  soil.repeat.set(10,10);
  const gravel=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#57534d';g.fillRect(0,0,w,h);for(let i=0;i<5600;i++){const v=70+R()*90|0;g.fillStyle=`rgb(${v},${v-4},${v-9})`;g.beginPath();g.ellipse(R()*w,R()*h,1.5+R()*3,1+R()*2.4,R()*3,0,7);g.fill()}});
  gravel.repeat.set(5,3);
  const mottle=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#ecebe7';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){const x=R()*w,y=R()*h,r=40+R()*120;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(60,55,50,.07)');gr.addColorStop(1,'rgba(60,55,50,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)}for(let i=0;i<9000;i++){const v=R()*255|0;g.fillStyle=`rgba(${v},${v},${v},.12)`;g.fillRect(R()*w,R()*h,1,1)}});
  mottle.repeat.set(2,1.2);
  const broom=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=1.6){const v=90+R()*80|0;g.strokeStyle=`rgba(${v},${v},${v},.7)`;g.lineWidth=.6+R()*1.1;g.beginPath();g.moveTo(0,y);for(let x=0;x<=w;x+=32)g.lineTo(x,y+Math.sin(x*.02+y)*1.2);g.stroke()}});
  broom.repeat.set(3,1.8);
  broom.anisotropy=soil.anisotropy=gravel.anisotropy=mottle.anisotropy=renderer.capabilities.getMaxAnisotropy();

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x5a4a3c,map:soil,roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

  const base=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshStandardMaterial({color:0x8a857d,map:gravel,roughness:.95}));
  base.rotation.x=-Math.PI/2;base.receiveShadow=true;scene.add(base);

  const wood=new THREE.MeshStandardMaterial({color:0xa27a4e,roughness:.75});
  const forms=new THREE.Group();
  [[10.24,.36,.12,0,-3.06],[10.24,.36,.12,0,3.06],[.12,.36,6,-5.06,0],[.12,.36,6,5.06,0]].forEach(([w,h,d,x,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),wood);m.position.set(x,.18,z);m.castShadow=m.receiveShadow=true;forms.add(m)});
  for(let x=-4.5;x<=4.5;x+=1.5){[-3.22,3.22].forEach(z=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.07,.55,.07),wood);s.position.set(x,.2,z);s.castShadow=true;forms.add(s)})}
  scene.add(forms);

  const steel=new THREE.MeshStandardMaterial({color:0x6e4430,metalness:.55,roughness:.55});
  const bars=[];
  const barGeoX=new THREE.CylinderGeometry(.028,.028,9.7,6),barGeoZ=new THREE.CylinderGeometry(.028,.028,5.7,6);
  let i=0;
  for(let z=-2.7;z<=2.71;z+=.6){const b=new THREE.Mesh(barGeoX,steel);b.rotation.z=Math.PI/2;b.position.set(0,.16,z);b.castShadow=true;b.userData.o=i++;bars.push(b);scene.add(b)}
  for(let x=-4.8;x<=4.81;x+=.6){const b=new THREE.Mesh(barGeoZ,steel);b.rotation.x=Math.PI/2;b.position.set(x,.2,0);b.castShadow=true;b.userData.o=i++;bars.push(b);scene.add(b)}
  const nBars=i;

  const wet=new THREE.Color(0x3e4041),cured=new THREE.Color(0x9c988f);
  const slabMat=new THREE.MeshStandardMaterial({color:wet.clone(),map:mottle,bumpMap:broom,bumpScale:0,roughness:.12,metalness:0});
  const slab=new THREE.Mesh(new THREE.BoxGeometry(10,.34,6),slabMat);
  slab.castShadow=slab.receiveShadow=true;scene.add(slab);

  const screed=new THREE.Mesh(new THREE.BoxGeometry(.14,.08,6.7),wood);screed.castShadow=true;scene.add(screed);

  const jointMat=new THREE.MeshBasicMaterial({color:0x1b1b1b});
  const jX=new THREE.Mesh(new THREE.PlaneGeometry(.035,6),jointMat);jX.rotation.x=-Math.PI/2;jX.position.set(0,.342,0);scene.add(jX);
  const jZ=new THREE.Mesh(new THREE.PlaneGeometry(10,.035),jointMat);jZ.rotation.x=-Math.PI/2;jZ.position.set(0,.342,0);scene.add(jZ);

  // work lights on stands
  const poleMat=new THREE.MeshStandardMaterial({color:0x222222,roughness:.6,metalness:.4});
  const headMat=new THREE.MeshStandardMaterial({color:0x111111,emissive:0xffb35c,emissiveIntensity:0});
  const spots=[];
  [[-7.5,5.5],[7.5,-5.5]].forEach(([x,z])=>{
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,4,8),poleMat);pole.position.set(x,2,z);pole.castShadow=true;scene.add(pole);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.6,.35,.12),headMat);head.position.set(x,4.05,z);head.lookAt(0,0,0);scene.add(head);
    const sp=new THREE.SpotLight(0xffb35c,0,26,.62,.7,1.2);sp.position.set(x,4,z);sp.target.position.set(0,0,0);scene.add(sp,sp.target);spots.push(sp);
  });

  const hemi=new THREE.HemisphereLight(0x8d96a3,0x1a1512,.45);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff1dc,1.5);sun.position.set(8,12,6);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);
  Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:40});sun.shadow.bias=-.0005;
  scene.add(sun);
  const rim=new THREE.DirectionalLight(0x6f8cff,.55);rim.position.set(-10,5,-10);scene.add(rim);
  const sunCool=new THREE.Color(0xfff1dc),sunGold=new THREE.Color(0xffb46e);

  // dust
  const N=mobile?220:420,pos=new Float32Array(N*3),seed=new Float32Array(N);
  for(let k=0;k<N;k++){pos[k*3]=(R()-.5)*28;pos[k*3+1]=R()*7;pos[k*3+2]=(R()-.5)*28;seed[k]=R()*10}
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xe6cfa6,size:.045,transparent:true,opacity:.4,depthWrite:false}));
  scene.add(dust);

  // camera keyframes: time, position, target
  const KF=[
    [0,  [15,7.5,17],[0,0,0]],
    [.14,[9.5,5.2,10],[0,0,0]],
    [.31,[3.6,2.4,4.6],[0,.12,0]],
    [.48,[-7,2.8,7.5],[0,.2,0]],
    [.66,[5,8.5,10.5],[0,0,0]],
    [.88,[12.5,2.6,-8.5],[0,.1,0]],
    [1,  [13.5,3.4,-10.5],[0,.1,0]]
  ].map(k=>[k[0],new THREE.Vector3(...k[1]),new THREE.Vector3(...k[2])]);
  const cp=new THREE.Vector3(),ct=new THREE.Vector3();

  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.8?52:36;if(w>1020)camera.setViewOffset(w,h,-w*.17,0,w,h);else camera.clearViewOffset();camera.updateProjectionMatrix()}
  resize();addEventListener('resize',resize);

  let mx=0,my=0,sx=0,sy=0;
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});

  function update(p,time){
    // camera
    let k=0;while(k<KF.length-2&&p>KF[k+1][0])k++;
    const a=KF[k],b=KF[k+1],t=ease(clamp((p-a[0])/(b[0]-a[0])));
    cp.lerpVectors(a[1],b[1],t);ct.lerpVectors(a[2],b[2],t);
    if(!reduce){sx+=(mx-sx)*.04;sy+=(my-sy)*.04;cp.x+=sx*.9;cp.y-=sy*.5;cp.z+=time*0;}
    camera.position.copy(cp);camera.lookAt(ct);

    // grade & forms
    const g=.75+.25*sm(0,.14,p);
    forms.position.y=lerp(-.6,0,g);
    base.position.y=lerp(-.08,.012,g);base.material.opacity=1;
    // rebar
    bars.forEach(br=>{const o=br.userData.o/nBars;const s=sm(.22+o*.14,.26+o*.14,p);br.scale.y=Math.max(.001,s);br.visible=s>.002});
    // pour: front moves across x
    const f=sm(.42,.6,p);
    slab.visible=f>.002;slab.scale.x=Math.max(.001,f);slab.position.set(-5+5*f,.17,0);
    // finish: screed pass then broom
    const sc=sm(.6,.7,p);screed.visible=sc>0&&sc<1;screed.position.set(lerp(-5.3,5.3,sc),.38,0);
    slabMat.bumpScale=lerp(0,.04,sm(.69,.76,p));
    const cut=sm(.74,.8,p);jX.visible=jZ.visible=cut>0;jX.scale.y=Math.max(.001,cut);jZ.scale.x=Math.max(.001,cut);
    // cure: dry out, lighten, roughen
    const cr=sm(.62,.96,p);
    slabMat.color.copy(wet).lerp(cured,cr);slabMat.roughness=lerp(.1,.88,cr);
    // lights
    const work=Math.max(1-sm(.06,.16,p),sm(.36,.46,p))*(1-sm(.8,.9,p));
    spots.forEach(s=>s.intensity=work*3.2);headMat.emissiveIntensity=work*2.4;
    const gold=sm(.8,.95,p);
    sun.color.copy(sunCool).lerp(sunGold,gold);
    sun.position.set(lerp(8,13,gold),lerp(12,3.2,gold),lerp(6,-5,gold));
    sun.intensity=lerp(1.1,1.6,gold)*lerp(.6,1,sm(0,.14,p));
    hemi.intensity=lerp(.4,.5,sm(0,.12,p));
    // dust drift
    if(!reduce){const arr=dg.attributes.position.array;for(let q=0;q<N;q++){arr[q*3+1]+=Math.sin(time*.4+seed[q])*.0016+.0012;if(arr[q*3+1]>7)arr[q*3+1]=0;arr[q*3]+=Math.cos(time*.2+seed[q])*.0012}dg.attributes.position.needsUpdate=true}
    renderer.render(scene,camera);
    return {placed:f};
  }
  return {update};
}
let three=null;try{three=initThree()}catch(e){three=null}
if(!three)$('hud').remove();

/* ---------- Estimate calculator ---------- */
function calc(){const L=parseFloat($('len').value)||0,W=parseFloat($('wid').value)||0,T=parseFloat($('thk').value)||4;const area=L*W,yd=area*(T/12)/27*1.1,tr=yd>0?Math.max(1,Math.ceil(yd/10)):0;
  $('oArea').innerHTML=Math.round(area).toLocaleString()+'<small>sq ft</small>';$('oYd').innerHTML=yd.toFixed(1)+'<small>yd³</small>';$('oTr').innerHTML=tr+'<small>'+(tr===1?'load':'loads')+'</small>'}
$('ptype').addEventListener('change',()=>{$('thk').value=$('ptype').value;calc()});['len','wid','thk'].forEach(id=>$(id).addEventListener('input',calc));calc();
/* Connect this to your CRM (for example a GoHighLevel form webhook) at launch. */
function submitLead(data){return Promise.resolve(data)}
$('calc').addEventListener('submit',e=>{e.preventDefault();const n=$('nm').value.trim(),p=$('ph').value.trim(),d=$('done');d.hidden=false;
  if(!n||!p){d.textContent='Add a name and phone number to preview the request.';return}
  submitLead({name:n,phone:p,project:$('ptype').selectedOptions[0].text,length:$('len').value,width:$('wid').value,thickness:$('thk').value}).then(()=>{d.textContent=`Thanks, ${n}. This concept form does not send your ${$('ptype').selectedOptions[0].text.toLowerCase()} request.`})});


/* ---------- Sticky mobile action bar ---------- */
const abar=$('abar');
(function hours(){
  // Business hours: Mon to Fri, 8am to 6pm Central
  let open=false,label='(555) 555-0123';
  try{const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',hour12:false}).formatToParts(new Date());
    const wd=p.find(x=>x.type==='weekday').value,hr=parseInt(p.find(x=>x.type==='hour').value,10)%24;
    open=!['Sat','Sun'].includes(wd)&&hr>=8&&hr<18;
    }catch(e){}
  $('abDot').classList.toggle('open',open);$('abHrs').textContent=label;$('abCall').setAttribute('aria-label','Call (555) 555-0123, '+(open?'open now':'currently closed'));$('abDot').title=open?'Open now':'Closed, open Mon to Fri 8am to 6pm';
  setTimeout(hours,60000);
})();
const calcForm=$('calc');let calcVisible=false;
if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{calcVisible=e.isIntersecting}),{threshold:.25}).observe(calcForm);

/* ---------- Main loop ---------- */
const hdr=$('hdr'),prog=$('prog');
const projs=[...document.querySelectorAll('.proj-img img')];
function frame(now){
  const vh=innerHeight,sy=scrollY,max=document.documentElement.scrollHeight-vh;
  prog.style.transform=`scaleX(${max>0?sy/max:0})`;
  hdr.classList.toggle('scrolled',sy>40);


  // statement word scrub
  {const r=stmt.getBoundingClientRect();const p=clamp((-r.top+vh*.35)/(stmt.offsetHeight-vh*.6));const lit=Math.floor(p*1.25*words.length);words.forEach((w,i)=>w.classList.toggle('lit',i<lit||reduce));stmtSub.classList.toggle('pre',!reduce&&p<.72)}

  // collection horizontal
  if(collOn){const r=collPin.getBoundingClientRect();const p=clamp(-r.top/(collPin.offsetHeight-vh||1));collTrack.style.transform=`translate3d(${-p*collDist}px,0,0)`;collBar.style.transform=`scaleX(${p})`;collNum.textContent=String(Math.min(6,1+Math.floor(p*6))).padStart(2,'0')+' / 06';
    if(!reduce)collTrack.querySelectorAll('.cp-img img').forEach(im=>{const b=im.getBoundingClientRect();const x=clamp((b.left+b.width/2)/innerWidth-.5,-.6,.6);im.style.transform=`translate3d(${x*-7}%,0,0)`})}

  // project image parallax
  if(!reduce)projs.forEach(im=>{const b=im.parentElement.getBoundingClientRect();if(b.bottom<0||b.top>vh)return;const t=(b.top+b.height/2)/vh-.5;im.style.translate=`0 ${(t*-10).toFixed(2)}%`});

  // action bar: hide while the estimate form is on screen or the menu is open
  {const away=calcVisible||document.body.classList.contains('menu-open')||!lb.hidden;abar.classList.toggle('away',away);document.body.classList.toggle('bar-away',away)}
  // 3D build behind the whole page
  if(three){const tt=sceneTarget();tS=reduce?tt:tS+(tt-tS)*.07;three.update(tS,now/1000);
    let k=0;STG.forEach((x,i)=>{if(tS>=x.a)k=i});
    if(k!==stShown){stShown=k;$('hudStage').textContent=STG[k].s;$('hudNote').textContent=STG[k].n;$('hudNum').textContent=String(k).padStart(2,'0')+' / 05'}
    $('hudBar').style.transform=`scaleX(${tS})`;
    const placed=sm(.42,.6,tS);$('roPlaced').textContent=Math.round(placed*100)+'%';
    const day=28*sm(.83,.99,tS);$('roDay').textContent=Math.round(day);$('roPsi').textContent=(Math.round((day<=0?0:Math.min(4000,4000*day/(4+.85*day)))/10)*10).toLocaleString()+' psi';
    $('hud').classList.toggle('off',sy<vh*.35||document.body.classList.contains('menu-open'));
  }
  // chapter rail
  let a=0;chaps.forEach((c,i)=>{if(c.getBoundingClientRect().top<vh*.5)a=i});
  if(a!==railOn){if(railOn>=0)railBtns[railOn].classList.remove('on');railBtns[a].classList.add('on');railOn=a}
  rail.classList.toggle('hide',sy<vh*.5);

  // reviews autoplay
  const dt=now-qLast;qLast=now;if(!document.hidden&&!reduce){qT+=dt;qb[qi].querySelector('i').style.transform=`scaleX(${clamp(qT/QDUR)})`;if(qT>QDUR)showQ((qi+1)%qs.length)}

  // cursor
  qx+=(cx-qx)*.18;qy+=(cy-qy)*.18;cur.style.left=qx+'px';cur.style.top=qy+'px';

  if(lenis)lenis.raf(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
