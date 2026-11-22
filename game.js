{
// ---------- Konstanten & Daten ----------
const W=128,H=64,D=128,CS=16,MACH=250,BELT=251,RESERVE=40,MAXIN=20,MAXOUT=20,BS=1.6,SP=0.34;
const DIRS=[[0,1],[-1,0],[0,-1],[1,0]];
const KEY='satiscraft-v1';
const ITEMS={wood:['Holz','#9b6b3d'],dirt:['Erde','#7a5535'],stone:['Stein','#8d9094'],sand:['Sand','#e3d39a'],coal:['Kohle','#2b2b2e'],
 copper_ore:['Kupfererz','#c87533'],iron_ore:['Eisenerz','#c49a83'],gold_ore:['Golderz','#e8c33f'],titan_ore:['Titanerz','#6fd0d8'],
 iron_bar:['Eisenbarren','#c8ccd2'],copper_bar:['Kupferbarren','#e08a4a'],gold_bar:['Goldbarren','#ffd24a'],titan_bar:['Titanbarren','#a5eef4'],
 iron_plate:['Eisenplatte','#a9b0b8'],rod:['Eisenstange','#6f7780'],wire:['Draht','#d9783a'],steel:['Stahlbarren','#4f5862'],motor:['Motor','#3e6ea8'],circuit:['Schaltkreis','#3c9a4c']};
const BL=[null,
 {n:'Gras',t:[0,1,2],tier:0,time:.5,drop:'dirt'},
 {n:'Erde',t:[2,2,2],tier:0,time:.45,drop:'dirt'},
 {n:'Stein',t:[3,3,3],tier:1,time:1.4,drop:'stone'},
 {n:'Sand',t:[4,4,4],tier:0,time:.4,drop:'sand'},
 {n:'Holzstamm',t:[6,5,6],tier:0,time:1.1,drop:'wood'},
 {n:'Laub',t:[7,7,7],tier:0,time:.2,drop:null},
 {n:'Kohlevorkommen',t:[8,8,8],tier:1,time:1.6,drop:'coal',ore:1},
 {n:'Kupfervorkommen',t:[9,9,9],tier:2,time:1.8,drop:'copper_ore',ore:1},
 {n:'Eisenvorkommen',t:[10,10,10],tier:2,time:1.9,drop:'iron_ore',ore:1},
 {n:'Goldvorkommen',t:[11,11,11],tier:3,time:2.2,drop:'gold_ore',ore:1},
 {n:'Titanvorkommen',t:[12,12,12],tier:4,time:2.8,drop:'titan_ore',ore:1},
 {n:'Grundgestein',t:[13,13,13],tier:99,time:1,drop:null}];
const TOOLS=[{n:'Hand',s:1},{n:'Holzspitzhacke',s:1.7},{n:'Steinspitzhacke',s:2.4},{n:'Eisenspitzhacke',s:3.3},{n:'Stahlspitzhacke',s:4.6}];
const TOOLREC=[null,{wood:5},{stone:8,wood:2},{iron_bar:6,wood:2},{steel:6,rod:3}];
const PLACE=[['dirt',2],['stone',3],['sand',4],['wood',5]];
const BUILD={
 workbench:{n:'Werkbank',w:2,d:2,h:2,cost:{wood:8},ins:[],outs:[],desc:'Stellt Spitzhacken her. [E] zum Öffnen.'},
 chest:{n:'Lagerkiste',w:1,d:1,h:1,cost:{wood:6},ins:'all',outs:[],desc:'Nimmt Items von Bändern aus jeder Richtung auf.'},
 belt:{n:'Förderband',w:1,d:1,h:1,cost:{copper_bar:1},ins:[],outs:[],desc:'Läuft in Blickrichtung. LMB halten zum Ziehen. Stufen ±1 Block möglich.'},
 smelter:{n:'Schmelzofen',w:2,d:2,h:2,cost:{stone:20,coal:5},ins:[[0,-1,0]],outs:[[1,2,0]],auto:1,desc:'Erz → Barren. Wählt das Rezept automatisch.'},
 miner1:{n:'Miner Mk1',w:2,d:2,h:3,cost:{iron_bar:10,stone:15},ins:[],outs:[[0,2,0]],miner:1,tier:2,period:2.4,desc:'Auf Erzvorkommen setzen. Fördert Kohle, Kupfer, Eisen.'},
 constructor:{n:'Konstruktor',w:2,d:3,h:2,cost:{iron_bar:12,copper_bar:8},ins:[[0,-1,0]],outs:[[1,3,0]],desc:'Barren → Platten, Stangen, Draht.'},
 foundry:{n:'Gießerei',w:3,d:3,h:3,cost:{iron_plate:15,wire:10,stone:30},ins:[[0,-1,0],[2,-1,0]],outs:[[1,3,0]],desc:'Eisenerz + Kohle → Stahl. Zwei Eingänge.'},
 assembler:{n:'Monteur',w:3,d:3,h:3,cost:{steel:10,wire:20,iron_plate:10},ins:[[0,-1,0],[2,-1,0]],outs:[[1,3,0]],desc:'Motoren und Schaltkreise. Zwei Eingänge.'},
 miner2:{n:'Miner Mk2',w:2,d:2,h:3,cost:{titan_bar:10,motor:4,circuit:4},ins:[],outs:[[0,2,0]],miner:1,tier:4,period:1,desc:'Schneller, fördert alle Erze inkl. Gold und Titan.'}};
const RECIPES={
 smelter:[{in:{iron_ore:1},out:{iron_bar:1},t:2},{in:{copper_ore:1},out:{copper_bar:1},t:2},{in:{gold_ore:1},out:{gold_bar:1},t:3},{in:{titan_ore:1},out:{titan_bar:1},t:4}],
 constructor:[{in:{iron_bar:2},out:{iron_plate:1},t:3},{in:{iron_bar:1},out:{rod:1},t:2},{in:{copper_bar:1},out:{wire:2},t:2}],
 foundry:[{in:{iron_ore:1,coal:1},out:{steel:1},t:3}],
 assembler:[{in:{steel:1,wire:4},out:{motor:1},t:6},{in:{gold_bar:1,wire:2},out:{circuit:1},t:5}]};
const GOALS=[
 ['Baue Bäume mit der Hand ab und sammle 8 Holz.',()=>inv.wood>=8||count('workbench')],
 ['Räume eine ebene 2×2-Fläche frei und baue eine Werkbank (Q).',()=>count('workbench')],
 ['Öffne die Werkbank (E) und stelle eine Holzspitzhacke her.',()=>tier>=1],
 ['Baue 20 Stein und 5 Kohle ab.',()=>(inv.stone>=20&&inv.coal>=5)||count('smelter')],
 ['Baue einen Schmelzofen (2×2).',()=>count('smelter')],
 ['Stelle eine Steinspitzhacke her – jetzt sind Eisen und Kupfer abbaubar.',()=>tier>=2],
 ['Schmelze 10 Eisenbarren: Erz per E in den Ofen legen.',()=>inv.iron_bar>=10||count('miner1')],
 ['Setze einen Miner Mk1 direkt auf ein Erzvorkommen.',()=>count('miner1')],
 ['Verbinde den Miner per Förderband mit Ofen oder Kiste.',()=>stats.delivered>0],
 ['Baue einen Konstruktor (2×3) für Platten, Stangen und Draht.',()=>count('constructor')],
 ['Stelle eine Eisenspitzhacke her – Gold wird abbaubar.',()=>tier>=3],
 ['Baue eine Gießerei (3×3) und produziere Stahl.',()=>(stats.produced.steel||0)>0],
 ['Stelle eine Stahlspitzhacke her – Titan wird abbaubar.',()=>tier>=4],
 ['Baue einen Monteur und stelle Motoren und Schaltkreise her.',()=>(stats.produced.motor||0)>0&&(stats.produced.circuit||0)>0],
 ['Baue einen Miner Mk2 auf ein Titanvorkommen.',()=>count('miner2')],
 ['Alle Meilensteine erreicht. Automatisiere deine Fabrik weiter!',()=>false]];

// ---------- Zustand ----------
const world=new Uint8Array(W*H*D);
const changes=new Map(),reserves=new Map(),machineAt=new Map(),belts=new Map();
let machines=[],inv={},tier=0,stats={delivered:0,produced:{}},goal=0,seed=1;
const idx=(x,y,z)=>x+z*W+y*W*D;
function get(x,y,z){if(y<0)return 12;if(x<0||z<0||x>=W||z>=D||y>=H)return 0;return world[x+z*W+y*W*D]}
const opaque=id=>id>0&&id<200;
const count=t=>machines.filter(m=>m.type===t).length;
const add=(it,n)=>{inv[it]=(inv[it]||0)+n;if(inv[it]<=0)delete inv[it]};
const has=c=>Object.keys(c).every(k=>(inv[k]||0)>=c[k]);
const tot=o=>Object.values(o).reduce((a,b)=>a+b,0);
const sw=it=>`<span class="it"><i style="background:${ITEMS[it][1]}"></i>${ITEMS[it][0]}</span>`;

// ---------- Zufall / Rauschen ----------
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash2(x,z){let h=(x*374761393+z*668265263+seed*1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296}
function vnoise(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);
 const a=hash2(xi,zi),b=hash2(xi+1,zi),c=hash2(xi,zi+1),d=hash2(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,z,o){let s=0,a=1,f=1,n=0;for(let i=0;i<o;i++){s+=vnoise(x*f,z*f)*a;n+=a;a*=.5;f*=2}return s/n}

// ---------- Weltgenerierung ----------
let heights=new Int16Array(W*D);
function generate(){
 world.fill(0);reserves.clear();
 const rnd=mulberry(seed*7919+13);
 const rawH=(x,z)=>{const b=fbm(x/38,z/38,4),m=fbm(x/80+31.7,z/80+11.3,3);return Math.max(6,Math.min(H-12,Math.floor(12+b*16+Math.max(0,m-.52)*70)))};
 // Startplatz an die Umgebungshöhe angleichen (Mittel über einen Ring), damit keine Grube entsteht
 let hc=0;for(let i=0;i<16;i++){const a=i/16*Math.PI*2;hc+=rawH(64+Math.round(Math.cos(a)*14),64+Math.round(Math.sin(a)*14))}hc=Math.round(hc/16);
 for(let x=0;x<W;x++)for(let z=0;z<D;z++){
  let h=rawH(x,z);
  const dx=x-64,dz=z-64,dd=Math.sqrt(dx*dx+dz*dz);if(dd<14){const t=dd/14;h=Math.round(h*t+hc*(1-t))}
  heights[x+z*W]=h;
  for(let y=0;y<=h;y++){let id=y===0?12:y<h-3?3:y<h?2:1;
   if(h<=14&&y>=h-2)id=4;if(h>32&&y>=h-1)id=3;world[idx(x,y,z)]=id}
 }
 const vein=(id,cx,cy,cz,r)=>{const R=Math.ceil(r);for(let x=cx-R;x<=cx+R;x++)for(let y=cy-R;y<=cy+R;y++)for(let z=cz-R;z<=cz+R;z++){
  if(x<0||z<0||x>=W||z>=D||y<1||y>=H)continue;const d=Math.hypot(x-cx,(y-cy)*1.3,z-cz);const c=world[idx(x,y,z)];
  if(d<r+rnd()*.5&&c>=1&&c<=4)world[idx(x,y,z)]=id}};
 const spec=[[7,46,0,3],[8,28,0,3],[9,32,0,3],[10,16,2,9],[11,12,4,14]];
 for(const[id,n,dmin,dvar]of spec)for(let i=0;i<n;i++){const x=Math.floor(rnd()*W),z=Math.floor(rnd()*D),h=heights[x+z*W];
  let y=h-dmin-Math.floor(rnd()*dvar);if(id===11&&h>30&&rnd()<.6)y=h-1;vein(id,x,Math.max(2,y),z,1.6+rnd()*1.4)}
 const sh=(x,z)=>heights[x+z*W];
 vein(7,72,sh(72,68)-1,68,2.3);vein(9,76,sh(76,57)-1,57,2.4);vein(8,55,sh(55,71)-1,71,2.3);vein(3,58,sh(58,58),58,1.5);
 for(let i=0;i<120;i++){const x=3+Math.floor(rnd()*(W-6)),z=3+Math.floor(rnd()*(D-6));
  if(Math.hypot(x-64,z-64)<6)continue;const h=sh(x,z);if(world[idx(x,h,z)]!==1||h>34)continue;
  const th=4+Math.floor(rnd()*3);for(let y=1;y<=th;y++)world[idx(x,h+y,z)]=5;
  for(let lx=-2;lx<=2;lx++)for(let lz=-2;lz<=2;lz++)for(let ly=th-1;ly<=th+2;ly++){
   const r=ly>th?1.3:2.4;if(Math.hypot(lx,lz)>r)continue;const p=idx(x+lx,h+ly,z+lz);if(h+ly<H&&!world[p])world[p]=6}}
}

// ---------- Texturatlas ----------
function makeAtlas(){
 const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const r=mulberry(99);
 const hex=(s,v)=>{const n=parseInt(s.slice(1),16);const f=k=>Math.max(0,Math.min(255,((n>>k)&255)*v|0));return`rgb(${f(16)},${f(8)},${f(0)})`};
 const fill=(t,base,var_)=>{const ox=(t%4)*16,oy=Math.floor(t/4)*16;for(let x=0;x<16;x++)for(let y=0;y<16;y++){g.fillStyle=hex(base,1-var_/2+r()*var_);g.fillRect(ox+x,oy+y,1,1)}return[ox,oy]};
 const spots=(t,col,n)=>{const ox=(t%4)*16,oy=Math.floor(t/4)*16;for(let i=0;i<n;i++){const x=1+Math.floor(r()*13),y=1+Math.floor(r()*13);g.fillStyle=hex(col,.8+r()*.4);g.fillRect(ox+x,oy+y,2+(r()<.4),2);}};
 fill(0,'#5fa04a',.25);
 let [ox,oy]=fill(1,'#7a5535',.3);for(let x=0;x<16;x++){const hh=3+Math.floor(r()*3);for(let y=0;y<hh;y++){g.fillStyle=hex('#5fa04a',.85+r()*.3);g.fillRect(ox+x,oy+y,1,1)}}
 fill(2,'#7a5535',.3);fill(3,'#8d9094',.22);fill(4,'#e3d39a',.15);
 [ox,oy]=fill(5,'#6e4a28',.2);for(let x=0;x<16;x+=3){g.fillStyle='#4f3419';g.fillRect(ox+x,oy,1,16)}
 [ox,oy]=fill(6,'#a77b48',.15);g.strokeStyle='#7c5630';g.strokeRect(ox+3.5,oy+3.5,9,9);g.strokeRect(ox+6.5,oy+6.5,3,3);
 [ox,oy]=fill(7,'#3f8a37',.45);
 fill(8,'#8d9094',.22);spots(8,'#1e1e22',9);fill(9,'#8d9094',.22);spots(9,'#d9772e',8);
 fill(10,'#8d9094',.22);spots(10,'#d7a98e',8);fill(11,'#8d9094',.22);spots(11,'#f3cd3a',8);
 fill(12,'#5e6a72',.22);spots(12,'#7fe6ee',8);fill(13,'#3a3a3d',.4);
 const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}
function arrowTex(col,belt){const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');
 if(belt){g.fillStyle='#2a2d31';g.fillRect(0,0,32,32);g.strokeStyle='#4b5058';g.lineWidth=4;g.beginPath();g.moveTo(6,6);g.lineTo(16,18);g.lineTo(26,6);g.stroke();}
 else{g.fillStyle=col;g.beginPath();g.moveTo(16,30);g.lineTo(30,10);g.lineTo(21,10);g.lineTo(21,2);g.lineTo(11,2);g.lineTo(11,10);g.lineTo(2,10);g.closePath();g.fill();}
 const t=new THREE.CanvasTexture(c);if(belt){t.wrapS=t.wrapT=THREE.RepeatWrapping}t.magFilter=THREE.NearestFilter;return t}

// ---------- Three.js ----------
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);document.body.prepend(renderer.domElement);
const canvas=renderer.domElement;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd4f5);scene.fog=new THREE.Fog(0x9fd4f5,45,115);
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.05,220);camera.rotation.order='YXZ';
scene.add(new THREE.HemisphereLight(0xe8f3ff,0x6b5a40,.8));const sun=new THREE.DirectionalLight(0xffffff,.65);sun.position.set(.5,1,.3);scene.add(sun);
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
const terrainMat=new THREE.MeshBasicMaterial({map:makeAtlas(),vertexColors:true});

// ---------- Meshing ----------
const FACES=[];
for(let a=0;a<3;a++)for(const s of[1,0]){const n=[0,0,0];n[a]=s?1:-1;const u=(a+1)%3,v=(a+2)%3;
 let cs=[[0,0],[1,0],[1,1],[0,1]].map(([i,j])=>{const c=[0,0,0];c[a]=s;c[u]=i;c[v]=j;return c});
 const e1=cs[1].map((q,i)=>q-cs[0][i]),e2=cs[2].map((q,i)=>q-cs[0][i]);
 const cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
 if(cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]<0)cs.reverse();
 FACES.push({n,a,u,v,cs,k:a===1?(s?0:2):1,sh:a===1?(s?1:.5):a===0?.8:.66})}
const AOL=[.5,.68,.84,1];
const NCX=W/CS,NCY=H/CS,NCZ=D/CS;const chunks=new Array(NCX*NCY*NCZ).fill(null);const dirty=new Set();
function buildChunk(ci){
 const cx=ci%NCX,cz=Math.floor(ci/NCX)%NCZ,cy=Math.floor(ci/(NCX*NCZ));
 const pos=[],col=[],uv=[],ind=[];let vc=0;const p1=[0,0,0],p2=[0,0,0],p3=[0,0,0];
 for(let y=cy*CS;y<cy*CS+CS;y++)for(let z=cz*CS;z<cz*CS+CS;z++)for(let x=cx*CS;x<cx*CS+CS;x++){
  const id=world[idx(x,y,z)];if(!id||id>=200)continue;const bd=BL[id];
  for(const f of FACES){const nx=x+f.n[0],ny=y+f.n[1],nz=z+f.n[2];if(opaque(get(nx,ny,nz)))continue;
   const tile=bd.t[f.k],tu=(tile%4)/4,tv=1-(Math.floor(tile/4)+1)/4;const ao=[];
   for(let i=0;i<4;i++){const c=f.cs[i];pos.push(x+c[0],y+c[1],z+c[2]);
    const du=c[f.u]?1:-1,dv=c[f.v]?1:-1;
    p1[0]=p2[0]=p3[0]=nx;p1[1]=p2[1]=p3[1]=ny;p1[2]=p2[2]=p3[2]=nz;p1[f.u]+=du;p2[f.v]+=dv;p3[f.u]+=du;p3[f.v]+=dv;
    const s1=opaque(get(p1[0],p1[1],p1[2]))?1:0,s2=opaque(get(p2[0],p2[1],p2[2]))?1:0,s3=opaque(get(p3[0],p3[1],p3[2]))?1:0;
    const a=(s1&&s2)?0:3-(s1+s2+s3);ao.push(a);const br=AOL[a]*f.sh;col.push(br,br,br);
    let U,V;if(f.a===1){U=c[0];V=c[2]}else if(f.a===0){U=c[2];V=c[1]}else{U=c[0];V=c[1]}
    uv.push(tu+.002+U*.246,tv+.002+V*.246)}
   if(ao[0]+ao[2]>=ao[1]+ao[3])ind.push(vc,vc+1,vc+2,vc,vc+2,vc+3);else ind.push(vc+1,vc+2,vc+3,vc+1,vc+3,vc);vc+=4}}
 if(chunks[ci]){scene.remove(chunks[ci]);chunks[ci].geometry.dispose();chunks[ci]=null}
 if(!vc)return;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 g.setIndex(new THREE.BufferAttribute(new Uint32Array(ind),1));g.computeBoundingSphere();
 const m=new THREE.Mesh(g,terrainMat);scene.add(m);chunks[ci]=m}
function markDirty(x,y,z){const cx=Math.floor(x/CS),cy=Math.floor(y/CS),cz=Math.floor(z/CS);
 for(let ax=-1;ax<=1;ax++)for(let ay=-1;ay<=1;ay++)for(let az=-1;az<=1;az++){
  const lx=x-cx*CS,ly=y-cy*CS,lz=z-cz*CS;
  if((ax===-1&&lx!==0)||(ax===1&&lx!==CS-1)||(ay===-1&&ly!==0)||(ay===1&&ly!==CS-1)||(az===-1&&lz!==0)||(az===1&&lz!==CS-1))continue;
  const X=cx+ax,Y=cy+ay,Z=cz+az;if(X<0||Y<0||Z<0||X>=NCX||Y>=NCY||Z>=NCZ)continue;dirty.add(X+Z*NCX+Y*NCX*NCZ)}}
function setBlock(x,y,z,id,rec){const i=idx(x,y,z);world[i]=id;if(rec)changes.set(i,id);markDirty(x,y,z)}

// ---------- Laubzerfall ----------
// Laub ist gehalten, wenn es über höchstens LEAF_REACH zusammenhängende Laubblöcke einen Stamm berührt.
const LOG=5,LEAF=6,LEAF_REACH=5,decay=new Map();let gameTime=0;
function leafSupported(x,y,z){
 const seen=new Set([idx(x,y,z)]);let front=[[x,y,z]];
 for(let d=0;d<LEAF_REACH&&front.length;d++){const next=[];
  for(const[cx,cy,cz]of front)for(const[dx,dy,dz]of N6){const nx=cx+dx,ny=cy+dy,nz=cz+dz;
   if(nx<0||nz<0||ny<0||nx>=W||nz>=D||ny>=H)continue;const id=world[idx(nx,ny,nz)];
   if(id===LOG)return true;if(id!==LEAF)continue;const k=idx(nx,ny,nz);if(!seen.has(k)){seen.add(k);next.push([nx,ny,nz])}}
  front=next}
 return false}
const N6=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function scheduleDecay(x,y,z){const k=idx(x,y,z);if(!decay.has(k))decay.set(k,gameTime+.3+Math.random()*4)}
function checkLeavesAround(x,y,z){const r=LEAF_REACH+1;
 for(let lx=Math.max(0,x-r);lx<=Math.min(W-1,x+r);lx++)for(let ly=Math.max(0,y-r);ly<=Math.min(H-1,y+r);ly++)for(let lz=Math.max(0,z-r);lz<=Math.min(D-1,z+r);lz++)
  if(world[idx(lx,ly,lz)]===LEAF&&!decay.has(idx(lx,ly,lz))&&!leafSupported(lx,ly,lz))scheduleDecay(lx,ly,lz)}
function checkAllLeaves(){for(let i=0;i<world.length;i++)if(world[i]===LEAF){const x=i%W,z=Math.floor(i/W)%D,y=Math.floor(i/(W*D));if(!leafSupported(x,y,z))scheduleDecay(x,y,z)}}
function updateDecay(){let n=0;for(const[k,t]of decay){if(t>gameTime)continue;decay.delete(k);if(world[k]!==LEAF)continue;
 const x=k%W,z=Math.floor(k/W)%D,y=Math.floor(k/(W*D));if(leafSupported(x,y,z))continue;setBlock(x,y,z,0,true);if(++n>=8)break}}

// ---------- Modelle ----------
const BOX=new THREE.BoxGeometry(1,1,1),CYL=new THREE.CylinderGeometry(.5,.5,1,10),CONE=new THREE.ConeGeometry(.5,1,8);
const mats={};const M=(c,e)=>mats[c+'_'+(e||0)]||(mats[c+'_'+(e||0)]=new THREE.MeshLambertMaterial({color:c,emissive:e?c:0,emissiveIntensity:e?.9:0}));
const ghostMat=new THREE.MeshBasicMaterial({color:0x5fcf6f,transparent:true,opacity:.42,depthWrite:false});
const arrIn=new THREE.MeshBasicMaterial({map:arrowTex('#5fcf6f'),transparent:true,depthWrite:false});
const arrOut=new THREE.MeshBasicMaterial({map:arrowTex('#f29a2e'),transparent:true,depthWrite:false});
const beltTex=arrowTex(0,1);const beltTop=new THREE.MeshBasicMaterial({map:beltTex});
const PLANE=new THREE.PlaneGeometry(.8,.8),BPLANE=new THREE.PlaneGeometry(.82,1);
function bx(g,m,w,h,d,x,y,z,geo){const me=new THREE.Mesh(geo||BOX,m);me.scale.set(w,h,d);me.position.set(x,y+h/2,z);g.add(me);return me}
function model(type,ghost){
 const def=BUILD[type],g=new THREE.Group(),C=(c,e)=>ghost?ghostMat:M(c,e),a={emit:[]};
 const GL=c=>ghost?ghostMat:new THREE.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:.2});
 if(type==='belt'){bx(g,C(0x3a3f45),.98,.1,1,0,0,0);bx(g,C(0x707780),.08,.16,1,-.46,0,0);bx(g,C(0x707780),.08,.16,1,.46,0,0);
  const t=new THREE.Mesh(BPLANE,ghost?ghostMat:beltTop);t.rotation.x=-Math.PI/2;t.position.y=.105;g.add(t);
  if(ghost){const ar=new THREE.Mesh(PLANE,arrOut);ar.rotation.x=-Math.PI/2;ar.position.y=.2;g.add(ar)}return{g,a}}
 if(type==='workbench'){bx(g,C(0xa0703f),1.9,.16,1.9,0,.78,0);for(const sx of[-.8,.8])for(const sz of[-.8,.8])bx(g,C(0x6e4a28),.16,.78,.16,sx,0,sz);
  bx(g,C(0x5e656d),.55,.28,.32,.45,.94,-.45);bx(g,C(0x34383d),.5,.22,.3,-.4,.94,.35);bx(g,C(0xc9ced4),.7,.04,.12,.1,.94,.2);bx(g,C(0x6e4a28),1.7,.08,1.7,0,.25,0);
  const hm=new THREE.Group();hm.position.set(-.05,1.0,.35);bx(hm,C(0x7a5232),.06,.06,.5,0,0,.2);bx(hm,C(0x4a4f55),.12,.12,.22,0,-.03,.45).rotation.y=Math.PI/2;g.add(hm);a.hammer=hm;
  a.emit.push({p:[-.4,1.2,.35],k:'spark'})}
 if(type==='chest'){bx(g,C(0x8b5a2b),.86,.6,.86,0,0,0);const lid=new THREE.Group();lid.position.set(0,.6,-.45);bx(lid,C(0x6b4220),.9,.2,.9,0,0,.45);bx(lid,C(0xd8b04a),.16,.18,.04,0,-.1,.9);g.add(lid);a.lid=lid}
 if(type==='smelter'){bx(g,C(0x3b3f44),1.95,.25,1.95,0,0,0);bx(g,C(0x8c8f93),1.7,1.25,1.7,0,.25,0);a.glow=bx(g,GL(0xff7a1a),.8,.45,.06,0,.45,.86);
  bx(g,C(0x5d6166),1.8,.15,1.8,0,1.5,0);bx(g,C(0x55595e),.42,1,.42,-.5,1.65,-.5);bx(g,C(0x55595e),.5,.3,.3,-.5,.3,-.95);a.emit.push({p:[-.5,2.7,-.5],k:'smoke'})}
 if(def.miner){const hc=type==='miner1'?0xe8892b:0x7b5cd6;for(const sx of[-.8,.8])for(const sz of[-.8,.8])bx(g,C(0x4a4f55),.2,2.6,.2,sx,0,sz);
  a.house=bx(g,C(hc),1.5,.9,1.5,0,1.6,0);bx(g,C(0x33373c),1.65,.12,1.65,0,2.5,0);bx(g,C(hc),.3,.35,.3,.45,2.62,.45);
  const dr=new THREE.Group();bx(dr,C(0x9aa1a8),.36,1.4,.36,0,.2,0,CYL);const tip=bx(dr,C(0x6d747b),.55,.6,.55,0,-.4,0,CONE);tip.rotation.x=Math.PI;
  for(let i=0;i<4;i++){const f=bx(dr,C(0x6d747b),.6,.08,.1,0,.4+i*.3,0);f.rotation.y=i*.8}g.add(dr);a.drill=dr;
  bx(g,C(0x4a4f55),.45,.45,.6,-.5,.9,.75);bx(g,C(0x3b3f44),1.8,.12,1.8,0,1.45,0);a.emit.push({p:[0,.15,0],k:'dust'})}
 if(type==='constructor'){bx(g,C(0x3b3f44),1.95,.2,2.95,0,0,0);bx(g,C(0x3d78c2),1.7,1,2.4,0,.2,0);bx(g,C(0x2a5a96),1.3,.25,1.2,0,1.2,0);
  a.press=bx(g,C(0xb7bec5),.35,.6,.35,0,1.35,0);bx(g,C(0x23272c),.6,.4,.1,.5,.4,1.21);bx(g,C(0x23272c),.6,.4,.1,-.5,.4,-1.21);bx(g,C(0x8a9199),.16,.4,.16,.6,1.2,-.9);a.emit.push({p:[.6,1.65,-.9],k:'steam'})}
 if(type==='foundry'){bx(g,C(0x3b3f44),2.95,.25,2.95,0,0,0);bx(g,C(0x6b3a2a),2.6,1.5,2.6,0,.25,0);a.glow=bx(g,GL(0xff5a10),1.2,.45,.06,0,.5,1.31);
  for(const sx of[-.75,.75])bx(g,C(0x45494e),.5,1.4,.5,sx,1.75,-.75);bx(g,C(0x8a4b33),2.2,.2,1.2,0,1.75,.5);a.emit.push({p:[-.75,3.2,-.75],k:'dark'},{p:[.75,3.2,-.75],k:'dark'})}
 if(type==='assembler'){bx(g,C(0x3b3f44),2.95,.25,2.95,0,0,0);bx(g,C(0x2f9b8f),2.6,1,2.6,0,.25,0);bx(g,C(0xd0d4d8),1.4,.1,1.4,0,1.25,.2);
  const arm=new THREE.Group();arm.position.set(-.8,1.25,-.8);bx(arm,C(0xe8892b),.3,.9,.3,0,0,0);const up=bx(arm,C(0xe8892b),.2,.2,1.1,0,.8,.5);up.position.z=.5;
  bx(arm,C(0x33373c),.25,.3,.25,0,.55,1.05);g.add(arm);a.arm=arm;a.emit.push({p:[0,1.4,.2],k:'spark'})}
 const ports=(list,mat)=>{if(!Array.isArray(list))return;for(const[lx,lz,ld]of list){const p=new THREE.Object3D();p.position.set(lx+.5-def.w/2,.04,lz+.5-def.d/2);p.rotation.y=-ld*Math.PI/2;
  const ar=new THREE.Mesh(PLANE,mat);ar.rotation.x=-Math.PI/2;p.add(ar);g.add(p)}};
 ports(def.ins,arrIn);ports(def.outs,arrOut);return{g,a}}

// ---------- Gebäude ----------
function toW(def,rot,lx,lz){const w=def.w,d=def.d;return rot===0?[lx,lz]:rot===1?[d-1-lz,lx]:rot===2?[w-1-lx,d-1-lz]:[lz,w-1-lx]}
const dims=(def,rot)=>rot%2?[def.d,def.w]:[def.w,def.d];
function checkPlace(type,ox,oy,oz,rot){
 const def=BUILD[type],[rw,rd]=dims(def,rot);
 for(let x=ox;x<ox+rw;x++)for(let z=oz;z<oz+rd;z++){
  if(x<0||z<0||x>=W||z>=D||oy+def.h>=H)return'Außerhalb der Welt';
  for(let y=oy;y<oy+def.h;y++)if(get(x,y,z))return'Platz blockiert – Blöcke wegräumen';
  if(!opaque(get(x,oy-1,z)))return'Fläche nicht eben – Boden fehlt'}
 const px0=Math.floor(P.x-.3),px1=Math.floor(P.x+.3),pz0=Math.floor(P.z-.3),pz1=Math.floor(P.z+.3),py0=Math.floor(P.y),py1=Math.floor(P.y+1.79);
 if(px1>=ox&&px0<ox+rw&&pz1>=oz&&pz0<oz+rd&&py1>=oy&&py0<oy+def.h)return'Du stehst im Weg';
 if(!has(def.cost))return'Zu wenig Ressourcen';return''}
function createMachine(type,ox,oy,oz,rot,data){
 const def=BUILD[type],[rw,rd]=dims(def,rot);
 if(type==='belt'){const b={x:ox,y:oy,z:oz,dir:rot,items:[]};const{g}=model('belt');g.position.set(ox+.5,oy,oz+.5);g.rotation.y=-rot*Math.PI/2;scene.add(g);b.g=g;
  belts.set(idx(ox,oy,oz),b);world[idx(ox,oy,oz)]=BELT;if(data)b.items=data.map((it,i)=>({item:it,p:Math.max(0,.9-i*SP)}));return b}
 const m={type,x:ox,y:oy,z:oz,rot,rw,rd,h:def.h,inBuf:{},outBuf:{},recipe:0,t:0,status:'',working:false};
 if(data){m.inBuf=data.i||{};m.outBuf=data.o||{};m.recipe=data.rc||0}
 for(let x=ox;x<ox+rw;x++)for(let z=oz;z<oz+rd;z++)for(let y=oy;y<oy+def.h;y++){const i=idx(x,y,z);world[i]=MACH;machineAt.set(i,m);markDirty(x,y,z)}
 const mp=l=>Array.isArray(l)?l.map(([lx,lz,ld])=>{const[a,b]=toW(def,rot,lx,lz);return{x:ox+a,y:oy,z:oz+b,dir:(ld+rot)%4}}):[];
 m.ins=mp(def.ins);m.outs=mp(def.outs);
 const{g,a}=model(type);g.position.set(ox+rw/2,oy,oz+rd/2);g.rotation.y=-rot*Math.PI/2;scene.add(g);g.updateMatrixWorld(true);m.g=g;m.a=a;m.pulse=0;m.emitT=Math.random()*.3;machines.push(m);return m}
function removeBuilding(t){
 if(t.dir!==undefined&&t.items){scene.remove(t.g);belts.delete(idx(t.x,t.y,t.z));world[idx(t.x,t.y,t.z)]=0;for(const i of t.items)add(i.item,1);
  for(const k in BUILD.belt.cost)add(k,BUILD.belt.cost[k]);return}
 const m=t;for(let x=m.x;x<m.x+m.rw;x++)for(let z=m.z;z<m.z+m.rd;z++)for(let y=m.y;y<m.y+m.h;y++){const i=idx(x,y,z);world[i]=0;machineAt.delete(i);markDirty(x,y,z)}
 scene.remove(m.g);machines=machines.filter(q=>q!==m);for(const k in m.inBuf)add(k,m.inBuf[k]);for(const k in m.outBuf)add(k,m.outBuf[k]);
 const c=BUILD[m.type].cost;for(const k in c)add(k,c[k]);if(panel&&panel.m===m)closePanel()}

// ---------- Logistik ----------
const beltFree=b=>!b.items.length||(b.items.length<4&&b.items[b.items.length-1].p>=SP);
function machineAccept(m,item){
 const def=BUILD[m.type];
 if(m.type==='chest'){if(tot(m.inBuf)>=999)return false;m.inBuf[item]=(m.inBuf[item]||0)+1;m.pulse=.35;return true}
 const rs=RECIPES[m.type];if(!rs)return false;let r=rs[m.recipe];
 if(r.in[item]===undefined){if(!def.auto||tot(m.inBuf))return false;const j=rs.findIndex(q=>q.in[item]!==undefined);if(j<0)return false;m.recipe=j;m.t=0;r=rs[j]}
 if((m.inBuf[item]||0)>=MAXIN)return false;m.inBuf[item]=(m.inBuf[item]||0)+1;return true}
function transfer(b,item){
 const[dx,dz]=DIRS[b.dir],tx=b.x+dx,tz=b.z+dz;
 for(const dy of[0,1,-1]){const nb=belts.get(idx(tx,b.y+dy,tz));if(tx<0||tz<0||tx>=W||tz>=D)return false;
  if(nb){if(nb.dir===(b.dir+2)%4)return false;if(beltFree(nb)){nb.items.push({item,p:0});return true}return false}}
 const m=machineAt.get(idx(tx,b.y,tz));if(!m)return false;
 if(m.type==='chest'||m.ins.some(p=>p.x===b.x&&p.y===b.y&&p.z===b.z&&p.dir===b.dir)){if(machineAccept(m,item)){stats.delivered++;return true}}
 return false}
function updateBelts(dt){for(const b of belts.values()){const its=b.items;
 for(let i=0;i<its.length;i++){const lim=i===0?1:its[i-1].p-SP;its[i].p=Math.max(its[i].p,Math.min(its[i].p+BS*dt,lim))}
 if(its.length&&its[0].p>=1&&transfer(b,its[0].item))its.shift()}}
function minerArea(m,fn){const def=BUILD[m.type];for(let y=m.y-1;y>=Math.max(1,m.y-12);y--)for(let x=m.x-1;x<=m.x+m.rw;x++)for(let z=m.z-1;z<=m.z+m.rd;z++){
 const id=get(x,y,z);if(BL[id]&&BL[id].ore&&BL[id].tier<=def.tier){if(fn(x,y,z,id))return}}}
function tickMachine(m,dt){
 const def=BUILD[m.type];
 if(def.miner){
  if(tot(m.outBuf)>=12){m.working=false;m.status='Ausgang voll – Förderband anschließen'}
  else{m.t+=dt;m.working=true;m.status='Fördert…';
   if(m.t>=def.period){m.t=0;let found=false;
    minerArea(m,(x,y,z,id)=>{found=true;const k=idx(x,y,z);let r=reserves.has(k)?reserves.get(k):RESERVE;r--;const it=BL[id].drop;m.outBuf[it]=(m.outBuf[it]||0)+1;
     stats.produced[it]=(stats.produced[it]||0)+1;if(r<=0){reserves.delete(k);setBlock(x,y,z,0,true)}else reserves.set(k,r);return true});
    if(!found){m.working=false;m.status='Kein abbaubares Erz im Bereich unter dem Miner'}}}}
 else if(RECIPES[m.type]){const r=RECIPES[m.type][m.recipe];
  const ok=Object.keys(r.in).every(k=>(m.inBuf[k]||0)>=r.in[k]);const full=Object.keys(r.out).some(k=>(m.outBuf[k]||0)>=MAXOUT);
  if(ok&&!full){m.working=true;m.status='Produziert…';m.t+=dt;if(m.t>=r.t){m.t=0;for(const k in r.in){m.inBuf[k]-=r.in[k];if(!m.inBuf[k])delete m.inBuf[k]}
   for(const k in r.out){m.outBuf[k]=(m.outBuf[k]||0)+r.out[k];stats.produced[k]=(stats.produced[k]||0)+r.out[k]}}}
  else{m.working=false;m.status=full?'Ausgang voll':'Wartet auf Eingangsmaterial'}}
 for(const p of m.outs){const b=belts.get(idx(p.x,p.y,p.z));if(!b||b.dir===(p.dir+2)%4||!beltFree(b))continue;
  const it=Object.keys(m.outBuf).find(k=>m.outBuf[k]>0);if(!it)break;m.outBuf[it]--;if(!m.outBuf[it])delete m.outBuf[it];b.items.push({item:it,p:0})}}

// ---------- Spieler ----------
const P={x:64.5,y:30,z:64.5,vy:0,yaw:0,pitch:0,ground:false};
const keys={};let mouseL=false;
function collides(px,py,pz){const x0=Math.floor(px-.3),x1=Math.floor(px+.3),y0=Math.floor(py),y1=Math.floor(py+1.79),z0=Math.floor(pz-.3),z1=Math.floor(pz+.3);
 for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++){const id=get(x,y,z);if(id&&id!==BELT)return true}return false}
function movePlayer(dt){
 const sp=keys.ShiftLeft||keys.ShiftRight?8:4.6;let fx=0,fz=0;
 const sx=-Math.sin(P.yaw),sz=-Math.cos(P.yaw);
 if(keys.KeyW){fx+=sx;fz+=sz}if(keys.KeyS){fx-=sx;fz-=sz}if(keys.KeyA){fx+=sz;fz-=sx}if(keys.KeyD){fx-=sz;fz+=sx}
 const l=Math.hypot(fx,fz)||1;const vx=fx/l*sp,vz=fz/l*sp;
 let nx=P.x+vx*dt;if(!collides(nx,P.y,P.z))P.x=nx;let nz=P.z+vz*dt;if(!collides(P.x,P.y,nz))P.z=nz;
 P.x=Math.max(.4,Math.min(W-.4,P.x));P.z=Math.max(.4,Math.min(D-.4,P.z));
 if(keys.Space&&P.ground){P.vy=8.2;P.ground=false}
 P.vy=Math.max(-40,P.vy-26*dt);const ny=P.y+P.vy*dt;
 if(collides(P.x,ny,P.z)){if(P.vy<0){const sy=Math.floor(ny)+1;if(!collides(P.x,sy,P.z))P.y=sy;P.ground=true}P.vy=0}else{P.y=ny;P.ground=false}
 if(P.y<-10){P.y=heights[Math.floor(P.x)+Math.floor(P.z)*W]+2;P.vy=0}}
const aimV=new THREE.Vector3(),mouse={x:0,y:0};let mouseR=false,dragDist=0;
function raycast(max){
 const ox=P.x,oy=P.y+1.62,oz=P.z;camera.updateMatrixWorld();aimV.set(mouse.x,mouse.y,.5).unproject(camera).sub(camera.position).normalize();const dx=aimV.x,dy=aimV.y,dz=aimV.z;
 let x=Math.floor(ox),y=Math.floor(oy),z=Math.floor(oz);const sx=Math.sign(dx),sy=Math.sign(dy),sz=Math.sign(dz);
 const tdx=dx?Math.abs(1/dx):Infinity,tdy=dy?Math.abs(1/dy):Infinity,tdz=dz?Math.abs(1/dz):Infinity;
 let tx=dx?(dx>0?x+1-ox:ox-x)*tdx:Infinity,ty=dy?(dy>0?y+1-oy:oy-y)*tdy:Infinity,tz=dz?(dz>0?z+1-oz:oz-z)*tdz:Infinity;let n=[0,0,0],t=0;
 while(t<=max){const id=y<0?0:get(x,y,z);if(id)return{x,y,z,id,n};
  if(tx<ty&&tx<tz){x+=sx;t=tx;tx+=tdx;n=[-sx,0,0]}else if(ty<tz){y+=sy;t=ty;ty+=tdy;n=[0,-sy,0]}else{z+=sz;t=tz;tz+=tdz;n=[0,0,-sz]}}
 return null}
const facing=()=>{const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);return Math.abs(fx)>Math.abs(fz)?(fx>0?3:1):(fz>0?0:2)};

// ---------- UI ----------
const $=id=>document.getElementById(id);
let panel=null,locked=false,buildType=null,rotOff=0,ghost=null,ghostType=null,selSlot=0,toastT=0,mineT=0,mineKey='',lastBelt='';
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;toastT=2.2}
function showPause(resume){$('pause').classList.add('on');$('ptext').textContent=resume?'Pausiert. Klicke auf „Spielen“, um weiterzumachen.':$('ptext').textContent;$('play').textContent=resume?'Weiterspielen':'Spielen'}
function releaseMouse(){mouseL=false;mouseR=false;canvas.classList.remove('drag');for(const k in keys)keys[k]=false}
function resume(){$('pause').classList.remove('on');locked=true}
function pause(){locked=false;releaseMouse();showPause(true)}
$('play').onclick=()=>resume();
$('saveb').onclick=()=>save();
$('newb').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}newWorld(Math.floor(Math.random()*1e6));toast('Neue Welt erstellt')};
function openPanel(kind,m){panel={kind,m};$('panel').classList.add('on');renderPanel();locked=false;releaseMouse()}
function closePanel(){panel=null;$('panel').classList.remove('on');resume()}
$('panel').addEventListener('mousedown',e=>{if(e.target.id==='panel')closePanel()});
function costHtml(c){return`<div class="cost">${Object.keys(c).map(k=>`<span class="${(inv[k]||0)>=c[k]?'':'miss'}">${c[k]}× ${sw(k)}</span>`).join('')}</div>`}
function bufRows(buf,act,label){const ks=Object.keys(buf);if(!ks.length)return'<p class="mut">leer</p>';
 return ks.map(k=>`<div class="row"><span>${buf[k]}× ${sw(k)}</span>${act?`<button class="b sec" data-act="${act}:${k}">${label}</button>`:''}</div>`).join('')}
function renderPanel(){
 if(!panel)return;const pc=$('pc');let h='';const x=`<button class="b sec" data-act="close">Schließen</button>`;
 if(panel.kind==='build'){
  h=`<h2>Baumenü ${x}</h2><p class="mut">Maschinen brauchen eine ebene, freie Fläche in voller Höhe. Wähle ein Gebäude, dann LMB zum Platzieren, R zum Drehen.</p><div class="grid">`+
   Object.keys(BUILD).map(k=>{const d=BUILD[k];return`<button class="bcard ${has(d.cost)?'':'no'}" data-act="build:${k}"><b>${d.n}</b> <span class="mut">${d.w}×${d.d}, Höhe ${d.h}</span><div class="mut" style="font-size:13px">${d.desc}</div>${costHtml(d.cost)}</button>`}).join('')+'</div>'}
 else if(panel.kind==='inv'){
  const ks=Object.keys(inv);h=`<h2>Inventar ${x}</h2><p>Werkzeug: <b>${TOOLS[tier].n}</b> <span class="mut">(Stufe ${tier})</span></p><div class="grid">`+
   (ks.length?ks.map(k=>`<div class="row">${sw(k)}<b>${inv[k]}</b></div>`).join(''):'<p class="mut">Noch leer – baue etwas ab.</p>')+'</div>'+
   `<h3>Abbaubarkeit</h3><p class="mut">Hand: Erde, Sand, Holz · Holzspitzhacke: Stein, Kohle · Steinspitzhacke: Kupfer, Eisen · Eisenspitzhacke: Gold · Stahlspitzhacke: Titan</p>`}
 else{const m=panel.m,def=BUILD[m.type];h=`<h2>${def.n} ${x}</h2>`;
  if(m.type==='workbench'){h+=`<p>Aktuell: <b>${TOOLS[tier].n}</b></p>`+[1,2,3,4].map(t=>`<div class="row"><div><b>${TOOLS[t].n}</b>${costHtml(TOOLREC[t])}</div><button class="b" data-act="craft:${t}" ${tier>=t||!has(TOOLREC[t])||t>tier+1?'disabled':''}>${tier>=t?'Vorhanden':'Herstellen'}</button></div>`).join('')}
  else if(m.type==='chest'){h+=`<h3>Inhalt</h3>${bufRows(m.inBuf,'takec','Nehmen')}<div class="btns"><button class="b" data-act="takeall">Alles nehmen</button></div>`}
  else if(def.miner){let left=0,blocks=0;minerArea(m,(x,y,z)=>{const k=idx(x,y,z);left+=reserves.has(k)?reserves.get(k):RESERVE;blocks++});
   h+=`<p>${m.status||'Startet…'}</p><p class="mut">Abbaubereich: ${m.rw+2}×${m.rd+2} Felder, bis 12 Blöcke tief. Verbleibend: <b style="color:var(--ink)">${left}</b> Einheiten in ${blocks} Erzblöcken.</p>
    <div class="prog"><i style="width:${Math.min(100,m.t/def.period*100)}%"></i></div><h3>Ausgang</h3>${bufRows(m.outBuf,'take','Entnehmen')}`}
  else{const rs=RECIPES[m.type],r=rs[m.recipe];
   h+=`<h3>Rezept</h3><div class="recs">${rs.map((q,i)=>`<button class="rec ${i===m.recipe?'on':''}" data-act="recipe:${i}">${Object.keys(q.in).map(k=>q.in[k]+'× '+ITEMS[k][0]).join(' + ')} → ${Object.keys(q.out).map(k=>q.out[k]+'× '+ITEMS[k][0]).join(', ')} <span class="mut">(${q.t} s)</span></button>`).join('')}</div>
   <p>${m.status||''}</p><div class="prog"><i style="width:${Math.min(100,m.t/r.t*100)}%"></i></div>
   <div class="cols"><div><h3>Eingang</h3>${Object.keys(r.in).map(k=>`<div class="row"><span>${m.inBuf[k]||0}/${MAXIN} ${sw(k)} <span class="mut">(Inventar: ${inv[k]||0})</span></span><button class="b sec" data-act="put:${k}" ${inv[k]?'':'disabled'}>Einlegen</button></div>`).join('')}</div>
   <div><h3>Ausgang</h3>${bufRows(m.outBuf,'take','Entnehmen')}</div></div>`}}
 pc.innerHTML=h}
$('pc').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const[act,arg]=b.dataset.act.split(':');const m=panel&&panel.m;
 if(act==='close')return closePanel();
 if(act==='build'){buildType=arg;rotOff=0;closePanel();return}
 if(act==='craft'){const t=+arg;if(has(TOOLREC[t])&&tier===t-1){for(const k in TOOLREC[t])add(k,-TOOLREC[t][k]);tier=t;if(m)m.pulse=1.4;toast(TOOLS[t].n+' hergestellt')}}
 if(act==='recipe'){const i=+arg;if(i!==m.recipe){for(const k in m.inBuf)add(k,m.inBuf[k]);m.inBuf={};m.recipe=i;m.t=0}}
 if(act==='put'){const n=Math.min(inv[arg]||0,MAXIN-(m.inBuf[arg]||0));if(n>0){add(arg,-n);m.inBuf[arg]=(m.inBuf[arg]||0)+n}}
 if(act==='take'){add(arg,m.outBuf[arg]);delete m.outBuf[arg]}
 if(act==='takec'){add(arg,m.inBuf[arg]);delete m.inBuf[arg]}
 if(act==='takeall'){for(const k in m.inBuf)add(k,m.inBuf[k]);m.inBuf={}}
 renderPanel();renderHotbar()});
function renderHotbar(){
 $('hotbar').innerHTML=PLACE.map(([it],i)=>`<div class="slot ${i===selSlot?'sel':''}"><span class="k">${i+1}</span><span class="sw" style="background:${ITEMS[it][1]}"></span><span class="n">${inv[it]||0}</span><span class="l">${ITEMS[it][0]}</span></div>`).join('');
 $('tool').innerHTML=`Werkzeug: <b>${TOOLS[tier].n}</b>`}
function renderGoal(){while(goal<GOALS.length-1&&GOALS[goal][1]()){goal++;if(goal>0)toast('Meilenstein erreicht!')}
 $('goal').innerHTML=`<b>Meilenstein ${Math.min(goal+1,GOALS.length-1)} / ${GOALS.length-1}</b>${GOALS[goal][0]}`}

// ---------- Eingabe ----------
addEventListener('keydown',e=>{
 if(['Tab','Space'].includes(e.code))e.preventDefault();
 if(panel){if(['Escape','KeyE','KeyI','KeyQ','Tab'].includes(e.code))closePanel();return}
 if(!locked)return;if(e.code==='Escape')return pause();keys[e.code]=true;
 if(e.code.startsWith('Digit')){const n=+e.code.slice(5)-1;if(n>=0&&n<PLACE.length){selSlot=n;renderHotbar()}}
 if(e.code==='KeyQ'){if(buildType){buildType=null}else openPanel('build')}
 if(e.code==='KeyI'||e.code==='Tab')openPanel('inv');
 if(e.code==='KeyR'&&buildType)rotOff=(rotOff+1)%4;
 if(e.code==='KeyE'){const h=raycast(6);if(h&&h.id===MACH){const m=machineAt.get(idx(h.x,h.y,h.z));if(m&&m.type!=='belt'){buildType=null;openPanel('machine',m)}}}});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',releaseMouse);
// Kamera dreht nur bei gedrückter rechter Maustaste; ein kurzer Rechtsklick ohne Ziehen setzt einen Block bzw. bricht den Baumodus ab.
document.addEventListener('mousemove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;
 if(!locked||!mouseR)return;dragDist+=Math.abs(e.movementX)+Math.abs(e.movementY);
 if(dragDist>4)canvas.classList.add('drag');P.yaw-=e.movementX*.004;P.pitch=Math.max(-1.55,Math.min(1.55,P.pitch-e.movementY*.004))});
canvas.addEventListener('mousedown',e=>{if(!locked)return;
 if(e.button===0){mouseL=true;if(buildType&&buildType!=='belt')tryPlace()}
 if(e.button===2){mouseR=true;dragDist=0}});
document.addEventListener('mouseup',e=>{if(e.button===0){mouseL=false;lastBelt=''}
 if(e.button===2&&mouseR){mouseR=false;canvas.classList.remove('drag');if(locked&&dragDist<=4){if(buildType)buildType=null;else placeBlock()}}});
document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('wheel',e=>{if(!locked)return;if(buildType){rotOff=(rotOff+(e.deltaY>0?1:3))%4}else{selSlot=(selSlot+(e.deltaY>0?1:PLACE.length-1))%PLACE.length;renderHotbar()}},{passive:true});
function placeBlock(){const h=raycast(6);if(!h)return;const[it,id]=PLACE[selSlot];if(!inv[it])return toast('Kein '+ITEMS[it][0]+' im Inventar');
 const x=h.x+h.n[0],y=h.y+h.n[1],z=h.z+h.n[2];if(x<0||z<0||x>=W||z>=D||y<1||y>=H||get(x,y,z))return;
 if(Math.floor(P.x-.3)<=x&&x<=Math.floor(P.x+.3)&&Math.floor(P.z-.3)<=z&&z<=Math.floor(P.z+.3)&&Math.floor(P.y)<=y&&y<=Math.floor(P.y+1.79))return;
 add(it,-1);setBlock(x,y,z,id,true);renderHotbar()}
let place=null;
function computePlace(){place=null;if(!buildType)return;const h=raycast(8);if(!h)return;const def=BUILD[buildType];
 const rot=(facing()+rotOff)%4,[rw,rd]=dims(def,rot);const ax=h.x+h.n[0],ay=h.y+h.n[1],az=h.z+h.n[2];
 const ox=ax-Math.floor(rw/2),oz=az-Math.floor(rd/2);place={ox,oy:ay,oz,rot,rw,rd,err:checkPlace(buildType,ox,ay,oz,rot)}}
function tryPlace(){if(!place)return;if(place.err){toast(place.err);return}const def=BUILD[buildType];
 for(const k in def.cost)add(k,-def.cost[k]);createMachine(buildType,place.ox,place.oy,place.oz,place.rot);renderHotbar();
 if(!has(def.cost)&&buildType!=='belt')buildType=null}

// ---------- Speichern / Laden ----------
function save(){try{const data={seed,changes:[...changes],res:[...reserves],inv,tier,stats,goal,P:{x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch},
 machines:machines.map(m=>({t:m.type,x:m.x,y:m.y,z:m.z,r:m.rot,i:m.inBuf,o:m.outBuf,rc:m.recipe})),
 belts:[...belts.values()].map(b=>[b.x,b.y,b.z,b.dir,b.items.map(i=>i.item)])};
 localStorage.setItem(KEY,JSON.stringify(data));lastSave=new Date();toast('Spiel gespeichert');saveFeedback(true);return true}catch(e){toast('Speichern in diesem Browser nicht möglich');saveFeedback(false);return false}}
let lastSave=null,saveFbT=0;
function saveFeedback(ok){const b=$('saveb'),st=$('savestate');b.textContent=ok?'Gespeichert':'Fehlgeschlagen';b.classList.toggle('ok',ok);b.classList.toggle('err',!ok);
 clearTimeout(saveFbT);saveFbT=setTimeout(()=>{b.textContent='Speichern';b.classList.remove('ok','err')},2000);
 st.textContent=ok?'Zuletzt gespeichert: '+lastSave.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Speichern fehlgeschlagen – der Browser blockiert den lokalen Speicher (z. B. privates Fenster).';st.classList.toggle('err',!ok)}
// Speicherstand kommt aus localStorage (gleiche Origin, z. B. andere Pages-Seiten desselben Kontos) – nur validierte Daten übernehmen.
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const isInt=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
const isNum=(v,a,b)=>typeof v==='number'&&isFinite(v)&&v>=a&&v<=b;
const arr=v=>Array.isArray(v)?v:[];
function cleanBag(o,max){const r={};if(o&&typeof o==='object'&&!Array.isArray(o))for(const k of Object.keys(o))if(own(ITEMS,k)&&isInt(o[k],1,max))r[k]=o[k];return r}
function sanitize(d){
 if(!d||typeof d!=='object'||!isInt(d.seed,0,1e9))return null;const N=W*H*D;
 const o={seed:d.seed,changes:[],res:[],machines:[],belts:[]};
 for(const c of arr(d.changes))if(Array.isArray(c)&&isInt(c[0],0,N-1)&&isInt(c[1],0,12))o.changes.push([c[0],c[1]]);
 for(const c of arr(d.res))if(Array.isArray(c)&&isInt(c[0],0,N-1)&&isInt(c[1],1,RESERVE))o.res.push([c[0],c[1]]);
 o.inv=cleanBag(d.inv,1e9);o.tier=isInt(d.tier,0,4)?d.tier:0;o.goal=isInt(d.goal,0,GOALS.length-1)?d.goal:0;
 const st=d.stats&&typeof d.stats==='object'?d.stats:{};o.stats={delivered:isInt(st.delivered,0,1e12)?st.delivered:0,produced:cleanBag(st.produced,1e12)};
 const p=d.P&&typeof d.P==='object'?d.P:{};o.P={};
 for(const[k,a,b]of[['x',.4,W-.4],['y',-5,H+5],['z',.4,D-.4],['yaw',-1e6,1e6],['pitch',-1.55,1.55]])if(isNum(p[k],a,b))o.P[k]=p[k];
 for(const m of arr(d.machines)){if(!m||typeof m!=='object'||!own(BUILD,m.t)||m.t==='belt')continue;
  if(!isInt(m.x,0,W-1)||!isInt(m.y,1,H-1)||!isInt(m.z,0,D-1)||!isInt(m.r,0,3))continue;
  const rs=RECIPES[m.t];o.machines.push({t:m.t,x:m.x,y:m.y,z:m.z,r:m.r,i:cleanBag(m.i,999),o:cleanBag(m.o,999),rc:rs&&isInt(m.rc,0,rs.length-1)?m.rc:0})}
 for(const b of arr(d.belts)){if(!Array.isArray(b)||!isInt(b[0],0,W-1)||!isInt(b[1],1,H-1)||!isInt(b[2],0,D-1)||!isInt(b[3],0,3))continue;
  o.belts.push([b[0],b[1],b[2],b[3],arr(b[4]).filter(k=>typeof k==='string'&&own(ITEMS,k)).slice(0,4)])}
 return o}
function fits(type,ox,oy,oz,rot){const def=BUILD[type],[rw,rd]=dims(def,rot);
 for(let x=ox;x<ox+rw;x++)for(let z=oz;z<oz+rd;z++)for(let y=oy;y<oy+def.h;y++){if(x<0||z<0||y<1||x>=W||z>=D||y>=H||world[idx(x,y,z)])return false}return true}
function clearAll(){decay.clear();for(const m of machines)scene.remove(m.g);for(const b of belts.values())scene.remove(b.g);machines=[];belts.clear();machineAt.clear();changes.clear();
 for(let i=0;i<chunks.length;i++)if(chunks[i]){scene.remove(chunks[i]);chunks[i].geometry.dispose();chunks[i]=null}dirty.clear();buildType=null}
function newWorld(s,data){clearAll();seed=s;generate();inv={};tier=0;stats={delivered:0,produced:{}};goal=0;
 P.x=64.5;P.z=64.5;P.y=heights[64+64*W]+1;P.vy=0;P.yaw=0;P.pitch=-.15;
 if(data){for(const[i,id]of data.changes){world[i]=id;changes.set(i,id)}for(const[i,r]of data.res)reserves.set(i,r);
  inv=data.inv||{};tier=data.tier||0;stats=data.stats||stats;goal=data.goal||0;Object.assign(P,data.P||{});
  for(const m of data.machines)if(fits(m.t,m.x,m.y,m.z,m.r))createMachine(m.t,m.x,m.y,m.z,m.r,m);
  for(const b of data.belts)if(fits('belt',b[0],b[1],b[2],b[3]))createMachine('belt',b[0],b[1],b[2],b[3],b[4])}
 if(data)checkAllLeaves();for(let i=0;i<chunks.length;i++)buildChunk(i);dirty.clear();renderHotbar();renderGoal()}

// ---------- Szene-Helfer ----------
// ---------- Partikel (Rauch, Dampf, Staub, Funken) ----------
const PK={smoke:{c:0xd9d9d9,life:2.6,vy:.85,dr:.22,s0:.35,s1:1.35,a:.75,rate:.28,j:.08},
 dark:{c:0x5f5f62,life:3,vy:1,dr:.28,s0:.45,s1:1.6,a:.8,rate:.22,j:.1},
 steam:{c:0xffffff,life:1.1,vy:1.3,dr:.15,s0:.18,s1:.75,a:.65,rate:.55,j:.04},
 dust:{c:0x9c7b58,life:.9,vy:.45,dr:.7,s0:.22,s1:.65,a:.7,rate:.2,j:.55},
 spark:{c:0xffcf4a,life:.35,vy:1.6,dr:1.3,s0:.13,s1:.03,a:1,rate:.07,j:.05,g:6}};
const smokeTex=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');const gr=x.createRadialGradient(16,16,2,16,16,15);
 gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.6,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c)})();
const parts=[];for(let i=0;i<400;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false}));sp.visible=false;scene.add(sp);parts.push({sp,life:0,max:1,vx:0,vy:0,vz:0,k:null})}
let partI=0;const tmpV=new THREE.Vector3();
function emit(pos,kind){const K=PK[kind];for(let n=0;n<parts.length;n++){const p=parts[partI=(partI+1)%parts.length];if(p.life>0)continue;
 p.k=K;p.life=p.max=K.life*(.8+Math.random()*.4);p.sp.position.set(pos.x+(Math.random()-.5)*K.j*2,pos.y,pos.z+(Math.random()-.5)*K.j*2);
 p.vx=(Math.random()-.5)*K.dr+(kind==='smoke'||kind==='dark'?.18:0);p.vy=K.vy*(.7+Math.random()*.6);p.vz=(Math.random()-.5)*K.dr;
 p.sp.material.color.setHex(K.c);p.sp.visible=true;return}}
function updateParts(dt){for(const p of parts){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.sp.visible=false;continue}
 const K=p.k,t=1-p.life/p.max;if(K.g)p.vy-=K.g*dt;p.sp.position.x+=p.vx*dt;p.sp.position.y+=p.vy*dt;p.sp.position.z+=p.vz*dt;
 p.sp.scale.setScalar(K.s0+(K.s1-K.s0)*t);p.sp.material.opacity=K.a*(1-t)*Math.min(1,t*8)}}
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),new THREE.LineBasicMaterial({color:0x111111}));scene.add(hl);
const itemMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.3,.3,.3),new THREE.MeshLambertMaterial(),4000);
itemMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);const tmpC=new THREE.Color(),tmpM=new THREE.Matrix4();
for(let i=0;i<4000;i++)itemMesh.setColorAt(i,tmpC.set(0xffffff));itemMesh.frustumCulled=false;scene.add(itemMesh);
const itemCol={};for(const k in ITEMS)itemCol[k]=new THREE.Color(ITEMS[k][1]);
function drawItems(){let n=0;for(const b of belts.values()){const[dx,dz]=DIRS[b.dir];for(const it of b.items){if(n>=4000)break;
 tmpM.makeTranslation(b.x+.5+dx*(it.p-.5),b.y+.27,b.z+.5+dz*(it.p-.5));itemMesh.setMatrixAt(n,tmpM);itemMesh.setColorAt(n,itemCol[it.item]);n++}}
 itemMesh.count=n;itemMesh.instanceMatrix.needsUpdate=true;if(itemMesh.instanceColor)itemMesh.instanceColor.needsUpdate=true}

// ---------- Hauptschleife ----------
let last=performance.now(),slow=0,saveT=0,time=0;
function frame(now){
 requestAnimationFrame(frame);let dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
 if(locked)movePlayer(dt);
 camera.position.set(P.x,P.y+1.62,P.z);camera.rotation.y=P.yaw;camera.rotation.x=P.pitch;
 for(const m of machines)tickMachine(m,dt);updateBelts(dt);drawItems();beltTex.offset.y=(beltTex.offset.y+BS*dt)%1;
 for(const m of machines){const a=m.a;if(m.pulse>0)m.pulse=Math.max(0,m.pulse-dt);
  if(a.lid)a.lid.rotation.x=-Math.sin(m.pulse/.35*Math.PI)*.55;
  if(a.hammer)a.hammer.rotation.x=m.pulse>0?-Math.abs(Math.sin(m.pulse*11))*1.1:0;
  const on=m.working||m.pulse>0;
  if(a.glow){const tgt=m.working?.75+Math.sin(time*9+m.x)*.2+Math.sin(time*23)*.08:.2;a.glow.material.emissiveIntensity+=(tgt-a.glow.material.emissiveIntensity)*Math.min(1,dt*4)}
  if(!on)continue;
  if(a.drill)a.drill.rotation.y+=dt*(m.type==='miner2'?14:8);
  if(a.house)a.house.position.y=1.6+.45+Math.sin(time*47)*.012;
  if(a.press)a.press.position.y=1.35+.3+Math.sin(time*6)*.2;
  if(a.arm){a.arm.rotation.y=Math.sin(time*2)*1.2;a.arm.rotation.x=Math.sin(time*3.1)*.12}
  if(a.emit.length&&(m.type!=='workbench'||m.pulse>0)){m.emitT-=dt;if(m.emitT<=0){m.emitT=PK[a.emit[0].k].rate*(.7+Math.random()*.6);
   for(const e of a.emit){tmpV.set(e.p[0],e.p[1],e.p[2]);m.g.localToWorld(tmpV);emit(tmpV,e.k)}}}}
 updateParts(dt);
 gameTime+=dt;updateDecay();
 let n=0;for(const ci of dirty){buildChunk(ci);dirty.delete(ci);if(++n>=6)break}
 // Ziel & Abbau
 const h=locked&&!buildType?raycast(6):null;let info='';
 if(h){let tgt=null,nm='',sub='';
  if(h.id===MACH){tgt=machineAt.get(idx(h.x,h.y,h.z));const d=BUILD[tgt.type];nm=d.n;sub=(tgt.status?tgt.status+' · ':'')+'[E] öffnen · LMB halten: abreißen';
   hl.scale.set(tgt.rw+.02,tgt.h+.02,tgt.rd+.02);hl.position.set(tgt.x+tgt.rw/2,tgt.y+tgt.h/2,tgt.z+tgt.rd/2)}
  else if(h.id===BELT){tgt=belts.get(idx(h.x,h.y,h.z));nm='Förderband';sub=tgt.items.length+' Items · LMB halten: abreißen';hl.scale.set(1.02,.22,1.02);hl.position.set(h.x+.5,h.y+.1,h.z+.5)}
  else{const bd=BL[h.id];nm=bd.n;hl.scale.set(1.004,1.004,1.004);hl.position.set(h.x+.5,h.y+.5,h.z+.5);
   if(bd.tier>tier)sub=`<span class="bad">${bd.tier>4?'Unzerstörbar':'Benötigt '+TOOLS[bd.tier].n}</span>`;
   else if(bd.ore){const k=idx(h.x,h.y,h.z);sub=`Vorrat für Miner: ${reserves.has(k)?reserves.get(k):RESERVE} Einheiten`}}
  hl.visible=true;info=`${nm}<small>${sub}</small>`;
  const key=h.x+','+h.y+','+h.z;
  if(mouseL){if(key!==mineKey){mineKey=key;mineT=0}
   if(tgt){mineT+=dt/.6;if(mineT>=1){removeBuilding(tgt);mineT=0;mineKey='';renderHotbar();toast(nm+' abgerissen – Material erstattet')}}
   else{const bd=BL[h.id];if(bd.tier<=tier){mineT+=dt*TOOLS[tier].s/bd.time;if(mineT>=1){mineT=0;mineKey='';
    setBlock(h.x,h.y,h.z,0,true);if(h.id===LOG||h.id===LEAF)checkLeavesAround(h.x,h.y,h.z);const k=idx(h.x,h.y,h.z);reserves.delete(k);if(bd.drop)add(bd.drop,bd.ore?2:1);renderHotbar()}}}}
  else{mineT=0;mineKey=''}}
 else{hl.visible=false;mineT=0}
 $('bar').style.display=mineT>0?'block':'none';$('bar').firstChild.style.width=(mineT*100)+'%';
 // Bauvorschau
 computePlace();
 if(buildType&&place){if(ghostType!==buildType){if(ghost)scene.remove(ghost);ghost=model(buildType,true).g;scene.add(ghost);ghostType=buildType}
  ghost.visible=true;ghost.position.set(place.ox+place.rw/2,place.oy,place.oz+place.rd/2);ghost.rotation.y=-place.rot*Math.PI/2;
  ghostMat.color.set(place.err?0xef5a4c:0x5fcf6f);
  if(buildType==='belt'&&mouseL){const k=place.ox+','+place.oy+','+place.oz;if(k!==lastBelt&&!place.err){lastBelt=k;tryPlace()}}}
 else if(ghost)ghost.visible=false;
 const md=$('mode');if(buildType){const d=BUILD[buildType];md.style.display='block';
  md.innerHTML=`Baumodus: <b>${d.n}</b> (${d.w}×${d.d}) · LMB platzieren · R / Mausrad drehen · Rechtsklick abbrechen${place&&place.err?`<br><span style="color:#ff8a7e">${place.err}</span>`:''}`;info=''}
 else md.style.display='none';
 $('info').innerHTML=info;
 if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').style.opacity=0}
 slow+=dt;if(slow>.3){slow=0;if(panel&&panel.kind==='machine')renderPanel();renderGoal()}
 saveT+=dt;if(saveT>60){saveT=0;if(locked)save()}
 renderer.render(scene,camera)}

// ---------- Start ----------
let saved=null;try{const raw=localStorage.getItem(KEY);if(raw&&raw.length<2e7)saved=sanitize(JSON.parse(raw))}catch(e){saved=null}
let loaded=false;if(saved){try{newWorld(saved.seed,saved);loaded=true;$('ptext').textContent='Gespeicherter Spielstand geladen. Klicke auf „Spielen“.'}catch(e){loaded=false}}
if(!loaded)newWorld(Math.floor(Math.random()*1e6));
showPause(false);requestAnimationFrame(frame);
}
