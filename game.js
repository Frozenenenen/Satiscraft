{
// ---------- Konstanten & Daten ----------
const H=64,CS=16,MACH=250,BELT=251,RESERVE=40,MAXIN=20,MAXOUT=20,BS=1.6,SP=0.34;
const DIRS=[[0,1],[-1,0],[0,-1],[1,0]];
const KEY='satiscraft-v1';
const ITEMS={wood:['Holz','#9b6b3d'],dirt:['Erde','#7a5535'],stone:['Stein','#8d9094'],sand:['Sand','#e3d39a'],coal:['Kohle','#2b2b2e'],
 copper_ore:['Kupfererz','#c87533'],iron_ore:['Eisenerz','#c49a83'],gold_ore:['Golderz','#e8c33f'],titan_ore:['Titanerz','#6fd0d8'],
 iron_bar:['Eisenbarren','#c8ccd2'],copper_bar:['Kupferbarren','#e08a4a'],gold_bar:['Goldbarren','#ffd24a'],titan_bar:['Titanbarren','#a5eef4'],
 iron_plate:['Eisenplatte','#a9b0b8'],rod:['Eisenstange','#6f7780'],wire:['Draht','#d9783a'],steel:['Stahlbarren','#4f5862'],motor:['Motor','#3e6ea8'],circuit:['Schaltkreis','#3c9a4c'],
 sandstone:['Sandstein','#d9c38a'],quartz_ore:['Quarzerz','#e9e4f2'],bauxite:['Bauxit','#b5562f'],planks:['Bretter','#c39a5f'],glass:['Glas','#bfe6f0'],concrete:['Beton','#b9bcbf'],
 quartz:['Quarzkristall','#f4efff'],alu_bar:['Aluminiumbarren','#dfe4ea'],alu_sheet:['Alublech','#cfd8e2'],copper_sheet:['Kupferblech','#d9874f'],silicon:['Silizium','#5d6b8a'],frame:['Rahmen','#8a939c'],chip:['Mikrochip','#2f8f6a'],ammo:['Munition','#b08d3c']};
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
 {n:'Grundgestein',t:[13,13,13],tier:99,time:1,drop:null},
 {n:'Sandstein',t:[15,14,15],tier:1,time:1.2,drop:'sandstone'},
 {n:'Schnee',t:[16,17,2],tier:0,time:.5,drop:'dirt'},
 {n:'Kaktus',t:[19,18,19],tier:0,time:.5,drop:null},
 {n:'Tannennadeln',t:[20,20,20],tier:0,time:.2,drop:null},
 {n:'Birkenstamm',t:[22,21,22],tier:0,time:1.1,drop:'wood'},
 {n:'Birkenlaub',t:[23,23,23],tier:0,time:.2,drop:null},
 {n:'Rotgestein',t:[24,24,24],tier:1,time:1.3,drop:'stone'},
 {n:'Quarzvorkommen',t:[25,25,25],tier:3,time:2.2,drop:'quartz_ore',ore:1},
 {n:'Bauxitvorkommen',t:[26,26,26],tier:2,time:1.9,drop:'bauxite',ore:1},
 {n:'Bretter',t:[27,27,27],tier:0,time:.8,drop:'planks'},
 {n:'Glas',t:[28,28,28],tier:0,time:.4,drop:'glass',cut:1},
 {n:'Beton',t:[29,29,29],tier:1,time:1.6,drop:'concrete'},
 {n:'Pfadstein',t:[30,30,30],tier:99,time:1,drop:null}];
const NBL=BL.length-1;const isLog=id=>id===5||id===17,isLeaf=id=>id===6||id===16||id===18;
const TOOLS=[{n:'Hand',s:1},{n:'Holzspitzhacke',s:1.7},{n:'Steinspitzhacke',s:2.4},{n:'Eisenspitzhacke',s:3.3},{n:'Stahlspitzhacke',s:4.6}];
const TOOLREC=[null,{wood:5},{stone:8,wood:2},{iron_bar:6,wood:2},{steel:6,rod:3}];
const GADGETS={radar:{n:'Erzradar',cost:{copper_bar:4,iron_bar:2},desc:'Zeigt Richtung und Entfernung zum nächsten Erz der gewählten Art (Taste F).'}};
const PLACE=[['dirt',2],['stone',3],['sand',4],['wood',5],['planks',22],['glass',23],['concrete',24],['sandstone',13]];
const BUILD={
 workbench:{n:'Werkbank',w:2,d:2,h:2,cost:{wood:8},ins:[],outs:[],desc:'Stellt Spitzhacken her. [E] zum Öffnen.'},
 chest:{n:'Lagerkiste',w:1,d:1,h:1,cost:{wood:6},ins:'all',outs:[[0,1,0]],store:999,desc:'Nimmt Items aus jeder Richtung auf, Ausgang vorne (Dispenser, gibt standardmäßig alles aus, im Fenster einstellbar). Fasst 999 Items.'},
 container:{n:'Lagercontainer',w:2,d:2,h:2,cost:{wood:20,iron_bar:8},ins:[[0,-1,0],[1,-1,0],[-1,0,3],[2,0,1]],outs:[[0,2,0],[1,2,0]],store:1500,desc:'Großes Lager mit 4 Eingängen (hinten 2, seitlich je 1) und 2 Ausgängen vorne. Fasst 1.500 Items.'},
 warehouse:{n:'Industrielager',w:3,d:3,h:2,cost:{iron_plate:20,steel:5},ins:[[0,-1,0],[1,-1,0],[2,-1,0],[-1,1,3],[3,1,1]],outs:[[0,3,0],[1,3,0],[2,3,0]],store:5000,desc:'Sehr großes Lager mit 5 Eingängen (hinten 3, seitlich je 1) und 3 Ausgängen vorne, je Ausgang einstellbar. Fasst 5.000 Items.'},
 belt:{n:'Förderband',w:1,d:1,h:1,cost:{copper_bar:1},ins:[],outs:[],desc:'Klick setzt ein Band in Blickrichtung. Shift + Ziehen legt eine Linie, die der Zugrichtung folgt (auch Kurven). Stufen ±1 Block möglich.'},
 bridge1:{n:'Förderbandbrücke',w:1,d:3,h:2,cost:{iron_bar:4,copper_bar:2},ins:[[0,-1,0]],outs:[[0,3,0]],bridge:1,desc:'Überspannt 1 Feld: Darunter kann ein Band quer durchlaufen. Eingang hinten, Ausgang vorne.'},
 bridge3:{n:'Lange Förderbandbrücke',w:1,d:5,h:2,cost:{iron_plate:6,rod:4},ins:[[0,-1,0]],outs:[[0,5,0]],bridge:1,desc:'Überspannt 3 Felder für mehrere Bänder oder Hindernisse.'},
 splitter:{n:'Splitter',w:1,d:1,h:1,cost:{iron_bar:2,copper_bar:2},ins:[[0,-1,0]],outs:[[0,1,0],[-1,0,1],[1,0,3]],router:1,desc:'1 Eingang hinten, 3 Ausgänge. Verteilt reihum. Kann direkt auf ein Band gesetzt werden.'},
 merger:{n:'Merger',w:1,d:1,h:1,cost:{iron_bar:2,copper_bar:2},ins:[[0,-1,0],[-1,0,3],[1,0,1]],outs:[[0,1,0]],router:1,desc:'3 Eingänge, 1 Ausgang vorne. Führt Bänder zusammen. Kann direkt auf ein Band gesetzt werden.'},
 smelter:{n:'Schmelzofen',w:2,d:2,h:2,cost:{stone:20,coal:5},ins:[[0,-1,0]],outs:[[1,2,0]],auto:1,desc:'Erz → Barren, Sand → Glas. Wählt das Rezept automatisch.'},
 miner1:{n:'Miner Mk1',w:2,d:2,h:3,cost:{iron_bar:10,stone:15},ins:[],outs:[[0,2,0]],miner:1,tier:2,period:2.4,desc:'Auf Erzvorkommen setzen. Fördert Kohle, Kupfer, Eisen.'},
 constructor:{n:'Konstruktor',w:2,d:3,h:2,cost:{iron_bar:12,copper_bar:8},ins:[[0,-1,0]],outs:[[1,3,0]],desc:'Platten, Stangen, Draht, Bretter, Beton, Bleche.'},
 foundry:{n:'Gießerei',w:3,d:3,h:3,cost:{iron_plate:15,wire:10,stone:30},ins:[[0,-1,0],[2,-1,0]],outs:[[1,3,0]],desc:'Stahl und Silizium. Zwei Eingänge.'},
 assembler:{n:'Monteur',w:3,d:3,h:3,cost:{steel:10,wire:20,iron_plate:10},ins:[[0,-1,0],[2,-1,0]],outs:[[1,3,0]],desc:'Motoren, Schaltkreise, Rahmen, Mikrochips. Zwei Eingänge.'},
 miner2:{n:'Miner Mk2',w:2,d:2,h:3,cost:{titan_bar:10,motor:4,circuit:4},ins:[],outs:[[0,2,0]],miner:1,tier:4,period:1,desc:'Schneller, fördert alle Erze inkl. Gold und Titan.'},
 ballista:{n:'Balliste',w:1,d:1,h:2,cost:{wood:12,stone:8},ins:[],outs:[],turret:{range:10,dmg:9,cd:1.3,spd:16,kind:'bolt'},desc:'Einfacher Verteidigungsturm. Braucht keine Munition. Reichweite 10.'},
 gunturret:{n:'Geschützturm',w:2,d:2,h:2,cost:{iron_plate:8,rod:6,wire:4},ins:[[0,-1,0],[1,-1,0]],outs:[],turret:{range:14,dmg:13,cd:.35,spd:45,kind:'bullet',ammo:'ammo'},desc:'Schnelles Feuer, braucht Munition (Konstruktor) per Band oder E. Reichweite 14.'},
 laser:{n:'Laserturm',w:2,d:2,h:3,cost:{alu_sheet:6,chip:2,steel:6},ins:[],outs:[],turret:{range:18,dmg:28,cd:.5,kind:'laser'},desc:'Starker Strahl ohne Munition. Reichweite 18.'},
 tower:{n:'Basisturm',w:3,d:3,h:15,cost:{},ins:[],outs:[],fixed:1,desc:'Deine Basis. Steht seit Spielbeginn und muss verteidigt werden.'},
 barke:{n:'Barke',w:1,d:1,h:2,cost:{stone:6,coal:2,iron_bar:2},ins:[],outs:[],beacon:1,desc:'Benennbarer Wegpunkt mit Lichtsäule. Erscheint im Kompass oben.'},
 miner3:{n:'Miner Mk3',w:2,d:2,h:3,cost:{alu_sheet:10,frame:6,chip:4},ins:[],outs:[[0,2,0]],miner:1,tier:4,period:.5,desc:'Doppelt so schnell wie Mk2, fördert alle Erze.'}};
const CATS=[['abbau','Abbau',['miner1','miner2','miner3']],['verarbeitung','Verarbeitung',['smelter','constructor','foundry','assembler']],
 ['logistik','Logistik',['belt','splitter','merger','bridge1','bridge3']],['lager','Lager',['chest','container','warehouse']],['werkstatt','Werkstatt',['workbench','barke']],['verteidigung','Verteidigung',['ballista','gunturret','laser']]];
let buildCat=0;try{const c=+localStorage.getItem('satiscraft-cat');if(c>=0&&c<CATS.length)buildCat=c}catch(e){}
const RECIPES={
 smelter:[{in:{iron_ore:1},out:{iron_bar:1},t:2},{in:{copper_ore:1},out:{copper_bar:1},t:2},{in:{gold_ore:1},out:{gold_bar:1},t:3},{in:{titan_ore:1},out:{titan_bar:1},t:4},
  {in:{sand:1},out:{glass:1},t:2},{in:{quartz_ore:1},out:{quartz:1},t:3},{in:{bauxite:1},out:{alu_bar:1},t:4}],
 constructor:[{in:{iron_bar:2},out:{iron_plate:1},t:3},{in:{iron_bar:1},out:{rod:1},t:2},{in:{copper_bar:1},out:{wire:2},t:2},
  {in:{wood:1},out:{planks:2},t:1.5},{in:{stone:2},out:{concrete:1},t:3},{in:{alu_bar:1},out:{alu_sheet:1},t:3},{in:{copper_bar:2},out:{copper_sheet:1},t:3},{in:{rod:1},out:{ammo:6},t:2}],
 foundry:[{in:{iron_ore:1,coal:1},out:{steel:1},t:3},{in:{sand:2,quartz:1},out:{silicon:1},t:4}],
 assembler:[{in:{steel:1,wire:4},out:{motor:1},t:6},{in:{gold_bar:1,wire:2},out:{circuit:1},t:5},
  {in:{iron_plate:2,rod:2},out:{frame:1},t:5},{in:{silicon:1,copper_sheet:1},out:{chip:1},t:6}]};
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
 ['Erkunde Wüste und Ödland: Aus Bauxit und Quarz entstehen Alublech und Mikrochips – baue einen Miner Mk3.',()=>count('miner3')],
 ['Alle Meilensteine erreicht. Automatisiere deine Fabrik weiter!',()=>false]];

// ---------- Zustand ----------
// Endlose Welt: Spalten (Chunks) von 16×64×16 Blöcken, erzeugt bei Bedarf aus dem Seed.
const changes=new Map(),reserves=new Map(),machineAt=new Map(),belts=new Map();
let machines=[],inv={},tier=0,gadgets={radar:false},stats={delivered:0,produced:{}},goal=0,seed=1;
const OFF=1048576,ZS=2097152,LIM=1000000;
const idx=(x,y,z)=>((x+OFF)*ZS+(z+OFF))*64+y;  // eindeutiger Schlüssel auch für negative Koordinaten
const kX=i=>Math.floor(i/(64*ZS))-OFF,kZ=i=>Math.floor(i/64)%ZS-OFF,kY=i=>i%64;
const isKey=i=>Number.isInteger(i)&&i>=0&&i<ZS*ZS*64,isXZ=v=>Number.isInteger(v)&&v>=-LIM&&v<LIM;
const cols=new Map(),changesByCol=new Map();const colKey=(cx,cz)=>(cx+65536)*131072+(cz+65536);
function colAt(cx,cz){return cols.get(colKey(cx,cz))||genCol(cx,cz)}
function get(x,y,z){if(y<0)return 12;if(y>=H)return 0;return colAt(x>>4,z>>4).d[(x&15)|((z&15)<<4)|(y<<8)]}
function rawSet(x,y,z,id){if(y<0||y>=H)return;const c=colAt(x>>4,z>>4);c.d[(x&15)|((z&15)<<4)|(y<<8)]=id;c.ore=null}
const getI=i=>get(kX(i),kY(i),kZ(i)),setI=(i,id)=>rawSet(kX(i),kY(i),kZ(i),id);
function recordChange(i,id){changes.set(i,id);const ck=colKey(kX(i)>>4,kZ(i)>>4);let s=changesByCol.get(ck);if(!s)changesByCol.set(ck,s=new Set());s.add(i)}
const opaque=id=>id>0&&id<200&&id!==23;const solidId=id=>id>0&&id<200;
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
// ---------- Weltgenerierung (pro Spalte, deterministisch aus dem Seed) ----------
function hashI(a,b,c){let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul((c|0)+seed,1442695041);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return h>>>0}
const hash3=(x,y,z)=>hashI(x*31+y,z,7)/4294967296;
const rawH=(x,z)=>{const b=fbm(x/38,z/38,4),m=fbm(x/80+31.7,z/80+11.3,3);return Math.max(6,Math.min(H-12,Math.floor(12+b*16+Math.max(0,m-.52)*70)))};
let spawnH=20,spawnVeins=[];const featCache=new Map();
function computeSpawn(){let hc=0;for(let i=0;i<16;i++){const a=i/16*Math.PI*2;hc+=rawH(64+Math.round(Math.cos(a)*14),64+Math.round(Math.sin(a)*14))}spawnH=Math.round(hc/16);
 const sh=(x,z)=>surfaceH(x,z);spawnVeins=[[7,72,sh(72,68)-1,68,2.3],[9,76,sh(76,57)-1,57,2.4],[8,55,sh(55,71)-1,71,2.3],[3,58,sh(58,58),58,1.5]]}
// ---------- Biome: großräumiges Temperatur-/Feuchte-Rauschen; um den Startpunkt immer gemäßigt ----------
const BIOMES=['Wiese','Birkenwald','Tundra','Wüste','Ödland'];
const sstep=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
function climate(x,z){let t=.5+(fbm(x/320+500,z/320-200,3)-.5)*1.7,m=.5+(fbm(x/280-300,z/280+700,3)-.5)*1.7;
 const d=Math.hypot(x-64,z-64);if(d<160){const k=Math.max(0,(d-90)/70);t=.5+(t-.5)*k;m=.5+(m-.5)*k}return[t,m]}
const biomeOf=(t,m)=>t<.36?2:t>.64?(m<.5?3:4):(m>.62?1:0);
function biomeAt(x,z){const[t,m]=climate(x,z);return biomeOf(t,m)}
function surfaceH(x,z){return terrainAt(x,z)[0]}
// Höhe und Biom in einem Durchgang (Klima nur einmal berechnen)
function terrainAt(x,z){let h=rawH(x,z);const[t,m]=climate(x,z);
 const cold=sstep(.42,.3,t),hot=sstep(.58,.7,t),dry=hot*sstep(.55,.45,m),bad=hot*sstep(.45,.55,m);
 if(cold>0)h+=cold*fbm(x/60+9,z/60-4,3)*24;
 if(dry>0)h=h+(15+fbm(x/22,z/22,2)*8-h)*dry*.85;
 if(bad>0){const hb=h+Math.max(0,fbm(x/45-7,z/45+3,3)-.42)*70;h=h+(Math.floor(hb/4)*4-h)*bad}
 h=Math.max(6,Math.min(H-6,Math.floor(h)));
 const b=biomeOf(t,m);let rock=false;
 // Felsplatten: Stein tritt an die Oberfläche (Wiese, Birkenwald, Tundra), teils als kleine Kuppen
 if(b<=2){const r=fbm(x/16+77,z/16-33,2);if(r>.66){rock=true;h+=Math.min(3,Math.floor((r-.66)*30))}}
 const dx=x-64,dz=z-64,dd=Math.sqrt(dx*dx+dz*dz);if(dd<14){const tt=dd/14;h=Math.round(h*tt+spawnH*(1-tt));if(dd<8)rock=false}return[h,b,rock]}
// Erzadern und Bäume je Chunk; eine Spalte übernimmt auch die Teile, die aus Nachbar-Chunks hineinragen.
const VEINS=[[7,.72,0,3],[8,.44,0,3],[9,.5,0,3],[10,.25,2,9],[11,.19,4,14]];
const BVEINS=[[],[[7,.4,0,3]],[[11,.3,2,10],[9,.3,0,4]],[[20,.7,1,6],[10,.25,1,6]],[[21,.8,0,3],[8,.4,0,3]]];
const TREE=['oak','birch','spruce','cactus',null];
function chunkFeatures(fx,fz){const k=colKey(fx,fz);let f=featCache.get(k);if(f)return f;const rnd=mulberry(hashI(fx,fz,99));f={v:[],t:[]};
 for(const[id,dens,dmin,dvar]of VEINS){const n=Math.floor(dens)+(rnd()<dens%1?1:0);for(let i=0;i<n;i++){const x=fx*16+Math.floor(rnd()*16),z=fz*16+Math.floor(rnd()*16),h=surfaceH(x,z);
  let y=h-dmin-Math.floor(rnd()*dvar);if(id===11&&h>30&&rnd()<.6)y=h-1;f.v.push([id,x,Math.max(2,y),z,1.6+rnd()*1.4])}}
 // Reihenfolge der Zufallszahlen wie zuvor (Basis-Adern, dann 2 Baumversuche), damit gemäßigte Gebiete unverändert bleiben.
 for(let i=0;i<2;i++){const x=fx*16+Math.floor(rnd()*16),z=fz*16+Math.floor(rnd()*16),th=4+Math.floor(rnd()*3),h=surfaceH(x,z);
  if(Math.hypot(x-64,z-64)<6)continue;const b=biomeAt(x,z),ty=TREE[b];if(!ty)continue;
  if(ty==='oak'||ty==='birch'){if(h<=14||h>32)continue}else if(ty==='cactus'){if(h<=14)continue}else if(h>48)continue;
  f.t.push([x,h,z,ty==='spruce'?th+2:ty==='cactus'?th-2:th,ty])}
 const cb=biomeAt(fx*16+8,fz*16+8);
 for(const[id,dens,dmin,dvar]of BVEINS[cb]){const n=Math.floor(dens)+(rnd()<dens%1?1:0);for(let i=0;i<n;i++){const x=fx*16+Math.floor(rnd()*16),z=fz*16+Math.floor(rnd()*16),h=surfaceH(x,z);
  f.v.push([id,x,Math.max(2,h-dmin-Math.floor(rnd()*dvar)),z,1.6+rnd()*1.4])}}
 if(cb===1)for(let i=0;i<3;i++){const x=fx*16+Math.floor(rnd()*16),z=fz*16+Math.floor(rnd()*16),th=5+Math.floor(rnd()*3),h=surfaceH(x,z);
  if(biomeAt(x,z)===1&&h>14&&h<=32)f.t.push([x,h,z,th,'birch'])}
 f.b=[];for(let i=0;i<2;i++){const x=fx*16+Math.floor(rnd()*16),z=fz*16+Math.floor(rnd()*16),r=1+rnd()*1.3,keep=rnd()<.55;const[h,bb]=terrainAt(x,z);
  if(keep&&bb<=2&&h>14&&Math.hypot(x-64,z-64)>12)f.b.push([x,h,z,r])}
 featCache.set(k,f);return f}
function genCol(cx,cz){const c={cx,cz,d:new Uint8Array(16*16*H),m:[null,null,null,null],shown:false,leaf:false};cols.set(colKey(cx,cz),c);const d=c.d,x0=cx*16,z0=cz*16;
 const I=(x,y,z)=>(x-x0)|((z-z0)<<4)|(y<<8),inside=(x,y,z)=>x>=x0&&x<x0+16&&z>=z0&&z<z0+16&&y>=0&&y<H;
 for(let x=x0;x<x0+16;x++)for(let z=z0;z<z0+16;z++){const[h,b,rock]=terrainAt(x,z);
  for(let y=0;y<=h;y++){let id;
   if(y===0)id=12;
   else if(b===3)id=y>=h-3?4:y>=h-7?13:3;
   else if(b===4)id=y>=h-9?((y>>1)%3===0?13:19):3;
   else if(rock&&h>14)id=3;
   else{id=y<h-3?3:y<h?2:(b===2?14:1);if(h<=14&&y>=h-2)id=4;if(h>32&&y>=h-1&&b!==2)id=3}
   d[I(x,y,z)]=id}}
 const vein=(id,vx,vy,vz,r)=>{const R=Math.ceil(r);for(let x=Math.max(vx-R,x0);x<=Math.min(vx+R,x0+15);x++)for(let z=Math.max(vz-R,z0);z<=Math.min(vz+R,z0+15);z++)for(let y=Math.max(1,vy-R);y<=Math.min(H-1,vy+R);y++){
  const dd=Math.hypot(x-vx,(y-vy)*1.3,z-vz),p=I(x,y,z),cur=d[p];if(dd<r+hash3(x,y,z)*.5&&((cur>=1&&cur<=4)||cur===13||cur===14||cur===19))d[p]=id}};
 const near=[];for(let fx=cx-1;fx<=cx+1;fx++)for(let fz=cz-1;fz<=cz+1;fz++)near.push(chunkFeatures(fx,fz));
 for(const f of near)for(const v of f.v)vein(...v);
 for(const v of spawnVeins)vein(...v);
 const put=(x,y,z,id,force)=>{if(inside(x,y,z)&&(force||!d[I(x,y,z)]))d[I(x,y,z)]=id};
 for(const f of near)for(const[bx0,bh,bz0,br]of f.b){const R=Math.ceil(br);for(let ax=-R;ax<=R;ax++)for(let az=-R;az<=R;az++)for(let ay=-1;ay<=R;ay++){
  if(Math.hypot(ax,ay*1.25,az)<br+hash3(bx0+ax,bh+ay,bz0+az)*.45)put(bx0+ax,bh+ay,bz0+az,3,ay<=0)}}
 for(const f of near)for(const[tx,h,tz,th,ty]of f.t){
  if(ty==='cactus'){for(let y=1;y<=th;y++)put(tx,h+y,tz,15,true);continue}
  const log=ty==='birch'?17:5,leaf=ty==='birch'?18:ty==='spruce'?16:6;
  for(let y=1;y<=th;y++)put(tx,h+y,tz,log,true);
  if(ty==='spruce'){for(let ly=2;ly<=th+1;ly++){const r=ly>th?.5:Math.max(.9,(th+1-ly)*.42+.4);for(let lx=-3;lx<=3;lx++)for(let lz=-3;lz<=3;lz++)if(Math.hypot(lx,lz)<=r&&!(lx===0&&lz===0&&ly<=th))put(tx+lx,h+ly,tz+lz,leaf)}continue}
  const rr=ty==='birch'?1.7:2.4;
  for(let lx=-2;lx<=2;lx++)for(let lz=-2;lz<=2;lz++)for(let ly=th-1;ly<=th+2;ly++){const r=ly>th?1.3:rr;if(Math.hypot(lx,lz)>r)continue;put(tx+lx,h+ly,tz+lz,leaf)}}
 const ch=changesByCol.get(colKey(cx,cz));if(ch){for(const i of ch)d[I(kX(i),kY(i),kZ(i))]=changes.get(i);c.leaf=true}
 const pa=pathAirCols.get(colKey(cx,cz));if(pa)for(const i of pa){const p=I(kX(i),kY(i),kZ(i));if(d[p]!==25)d[p]=0}
 return c}

// ---------- Texturatlas ----------
function makeAtlas(){
 const c=document.createElement('canvas');c.width=128;c.height=64;const g=c.getContext('2d');const r=mulberry(99);
 const hex=(s,v)=>{const n=parseInt(s.slice(1),16);const f=k=>Math.max(0,Math.min(255,((n>>k)&255)*v|0));return`rgb(${f(16)},${f(8)},${f(0)})`};
 const fill=(t,base,var_)=>{const ox=(t%8)*16,oy=Math.floor(t/8)*16;for(let x=0;x<16;x++)for(let y=0;y<16;y++){g.fillStyle=hex(base,1-var_/2+r()*var_);g.fillRect(ox+x,oy+y,1,1)}return[ox,oy]};
 const spots=(t,col,n)=>{const ox=(t%8)*16,oy=Math.floor(t/8)*16;for(let i=0;i<n;i++){const x=1+Math.floor(r()*13),y=1+Math.floor(r()*13);g.fillStyle=hex(col,.8+r()*.4);g.fillRect(ox+x,oy+y,2+(r()<.4),2);}};
 fill(0,'#5fa04a',.25);
 let [ox,oy]=fill(1,'#7a5535',.3);for(let x=0;x<16;x++){const hh=3+Math.floor(r()*3);for(let y=0;y<hh;y++){g.fillStyle=hex('#5fa04a',.85+r()*.3);g.fillRect(ox+x,oy+y,1,1)}}
 fill(2,'#7a5535',.3);fill(3,'#8d9094',.22);fill(4,'#e3d39a',.15);
 [ox,oy]=fill(5,'#6e4a28',.2);for(let x=0;x<16;x+=3){g.fillStyle='#4f3419';g.fillRect(ox+x,oy,1,16)}
 [ox,oy]=fill(6,'#a77b48',.15);g.strokeStyle='#7c5630';g.strokeRect(ox+3.5,oy+3.5,9,9);g.strokeRect(ox+6.5,oy+6.5,3,3);
 [ox,oy]=fill(7,'#3f8a37',.45);
 fill(8,'#8d9094',.22);spots(8,'#1e1e22',9);fill(9,'#8d9094',.22);spots(9,'#d9772e',8);
 fill(10,'#8d9094',.22);spots(10,'#d7a98e',8);fill(11,'#8d9094',.22);spots(11,'#f3cd3a',8);
 fill(12,'#5e6a72',.22);spots(12,'#7fe6ee',8);fill(13,'#3a3a3d',.4);
 [ox,oy]=fill(14,'#d9c38a',.12);for(const yy of[4,9,13]){g.fillStyle='#c4ab72';g.fillRect(ox,oy+yy,16,1)}fill(15,'#e0cc94',.1);
 fill(16,'#f2f6fa',.06);[ox,oy]=fill(17,'#7a5535',.3);for(let x=0;x<16;x++){const hh=3+Math.floor(r()*3);for(let y=0;y<hh;y++){g.fillStyle=hex('#f2f6fa',.92+r()*.08);g.fillRect(ox+x,oy+y,1,1)}}
 [ox,oy]=fill(18,'#4f8f3a',.18);for(let x=1;x<16;x+=4){g.fillStyle='#2f5f22';g.fillRect(ox+x,oy,1,16)}for(let i=0;i<10;i++){g.fillStyle='#e8e3c4';g.fillRect(ox+Math.floor(r()*16),oy+Math.floor(r()*16),1,1)}
 [ox,oy]=fill(19,'#5a9a44',.15);g.strokeStyle='#2f5f22';g.strokeRect(ox+2.5,oy+2.5,11,11);
 fill(20,'#2f5e3a',.4);
 [ox,oy]=fill(21,'#e9e6dc',.08);for(let i=0;i<9;i++){g.fillStyle='#2b2b2b';g.fillRect(ox+Math.floor(r()*14),oy+Math.floor(r()*16),2+Math.floor(r()*2),1)}
 [ox,oy]=fill(22,'#d8cfb6',.12);g.strokeStyle='#a8996f';g.strokeRect(ox+3.5,oy+3.5,9,9);
 fill(23,'#8fc25a',.4);
 [ox,oy]=fill(24,'#b5562f',.12);for(let y=0;y<16;y+=4){g.fillStyle=y%8?'#c9724a':'#9a4527';g.fillRect(ox,oy+y,16,2)}
 fill(25,'#8d9094',.22);spots(25,'#f4f0ff',8);fill(26,'#8d9094',.22);spots(26,'#b84f28',9);
 [ox,oy]=fill(27,'#c39a5f',.12);for(const yy of[0,4,8,12]){g.fillStyle='#8f6a3a';g.fillRect(ox,oy+yy,16,1)}for(const[xx,yy]of[[5,0],[11,4],[3,8],[9,12]]){g.fillStyle='#8f6a3a';g.fillRect(ox+xx,oy+yy,1,4)}
 // Glas: Rahmen deckend, Mitte durchsichtig (Alpha-Cutout)
 ox=(28%8)*16;oy=Math.floor(28/8)*16;g.clearRect(ox,oy,16,16);g.fillStyle='#d9f2f8';g.fillRect(ox,oy,16,1);g.fillRect(ox,oy+15,16,1);g.fillRect(ox,oy,1,16);g.fillRect(ox+15,oy,1,16);
 g.fillStyle='rgba(230,250,255,.95)';g.fillRect(ox+3,oy+3,1,3);g.fillRect(ox+4,oy+2,2,1);
 fill(29,'#b9bcbf',.08);
 [ox,oy]=fill(30,'#6f5d4a',.25);g.fillStyle='#4a3e32';for(const[xx,yy,w,hh]of[[0,5,16,1],[0,11,16,1],[6,0,1,5],[11,6,1,5],[3,12,1,4]])g.fillRect(ox+xx,oy+yy,w,hh);
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
const hemi=new THREE.HemisphereLight(0xe8f3ff,0x6b5a40,.8);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffffff,.65);sun.position.set(.5,1,.3);scene.add(sun);
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();viewCam.aspect=camera.aspect;viewCam.updateProjectionMatrix()});
const terrainMat=new THREE.MeshBasicMaterial({map:makeAtlas(),vertexColors:true,alphaTest:.5});

// ---------- Meshing ----------
const FACES=[];
for(let a=0;a<3;a++)for(const s of[1,0]){const n=[0,0,0];n[a]=s?1:-1;const u=(a+1)%3,v=(a+2)%3;
 let cs=[[0,0],[1,0],[1,1],[0,1]].map(([i,j])=>{const c=[0,0,0];c[a]=s;c[u]=i;c[v]=j;return c});
 const e1=cs[1].map((q,i)=>q-cs[0][i]),e2=cs[2].map((q,i)=>q-cs[0][i]);
 const cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
 if(cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]<0)cs.reverse();
 FACES.push({n,a,u,v,cs,k:a===1?(s?0:2):1,sh:a===1?(s?1:.5):a===0?.8:.66})}
const AOL=[.5,.68,.84,1];
const dirty=new Set();const meshKey=(cx,cy,cz)=>colKey(cx,cz)*4+cy;
function buildChunk(cx,cy,cz){const c=cols.get(colKey(cx,cz));if(!c)return;
 const pos=[],col=[],uv=[],ind=[];let vc=0;const p1=[0,0,0],p2=[0,0,0],p3=[0,0,0],x0=cx*CS,z0=cz*CS;
 for(let y=cy*CS;y<cy*CS+CS;y++)for(let z=z0;z<z0+CS;z++)for(let x=x0;x<x0+CS;x++){
  const id=c.d[(x-x0)|((z-z0)<<4)|(y<<8)];if(!id||id>=200)continue;const bd=BL[id];
  for(const f of FACES){const nx=x+f.n[0],ny=y+f.n[1],nz=z+f.n[2];const nb=get(nx,ny,nz);if(opaque(nb)||(bd.cut&&nb===id))continue;
   const tile=bd.t[f.k],tu=(tile%8)/8,tv=1-(Math.floor(tile/8)+1)/4;const ao=[];
   for(let i=0;i<4;i++){const cc=f.cs[i];pos.push(x+cc[0],y+cc[1],z+cc[2]);
    const du=cc[f.u]?1:-1,dv=cc[f.v]?1:-1;
    p1[0]=p2[0]=p3[0]=nx;p1[1]=p2[1]=p3[1]=ny;p1[2]=p2[2]=p3[2]=nz;p1[f.u]+=du;p2[f.v]+=dv;p3[f.u]+=du;p3[f.v]+=dv;
    const s1=opaque(get(p1[0],p1[1],p1[2]))?1:0,s2=opaque(get(p2[0],p2[1],p2[2]))?1:0,s3=opaque(get(p3[0],p3[1],p3[2]))?1:0;
    const a=(s1&&s2)?0:3-(s1+s2+s3);ao.push(a);const br=AOL[a]*f.sh;col.push(br,br,br);
    let U,V;if(f.a===1){U=cc[0];V=cc[2]}else if(f.a===0){U=cc[2];V=cc[1]}else{U=cc[0];V=cc[1]}
    uv.push(tu+.001+U*.123,tv+.002+V*.246)}
   if(ao[0]+ao[2]>=ao[1]+ao[3])ind.push(vc,vc+1,vc+2,vc,vc+2,vc+3);else ind.push(vc+1,vc+2,vc+3,vc+1,vc+3,vc);vc+=4}}
 if(c.m[cy]){scene.remove(c.m[cy]);c.m[cy].geometry.dispose();c.m[cy]=null}
 if(!vc)return;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 g.setIndex(new THREE.BufferAttribute(new Uint32Array(ind),1));g.computeBoundingSphere();
 const m=new THREE.Mesh(g,terrainMat);scene.add(m);c.m[cy]=m}
function hideCol(c){for(let cy=0;cy<4;cy++)if(c.m[cy]){scene.remove(c.m[cy]);c.m[cy].geometry.dispose();c.m[cy]=null}c.shown=false}
function markDirty(x,y,z){const cx=x>>4,cy=y>>4,cz=z>>4,lx=x&15,ly=y&15,lz=z&15;
 for(let ax=-1;ax<=1;ax++)for(let ay=-1;ay<=1;ay++)for(let az=-1;az<=1;az++){
  if((ax===-1&&lx!==0)||(ax===1&&lx!==CS-1)||(ay===-1&&ly!==0)||(ay===1&&ly!==CS-1)||(az===-1&&lz!==0)||(az===1&&lz!==CS-1))continue;
  const X=cx+ax,Y=cy+ay,Z=cz+az;if(Y<0||Y>=H/CS)continue;const c=cols.get(colKey(X,Z));if(c&&c.shown)dirty.add(meshKey(X,Y,Z))}}
// Streaming: Spalten im Umkreis erzeugen und zeichnen, ferne Spalten ausblenden (Daten bleiben erhalten).
// Sichtweite in Chunks (Einstellung). Nebel und Kamera-Sichtgrenze wachsen mit.
const RD_OPTS=[4,6,8,10,12,16];let RD=6,ORDER=[];
function setViewDist(n){RD=RD_OPTS.includes(n)?n:6;ORDER=[];for(let dx=-RD;dx<=RD;dx++)for(let dz=-RD;dz<=RD;dz++)if(dx*dx+dz*dz<=RD*RD+1)ORDER.push([dx,dz]);
 ORDER.sort((a,b)=>a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]);const r=RD*16;scene.fog.near=r*.45;scene.fog.far=r*1.12;camera.far=r*1.4+40;camera.updateProjectionMatrix();
 try{localStorage.setItem('satiscraft-rd',String(RD))}catch(e){}}
try{setViewDist(+(localStorage.getItem('satiscraft-rd')||6))}catch(e){setViewDist(6)}
let unloadT=0;
// Zeitbudget pro Frame (ms): mindestens eine Spalte erzeugen und eine zeichnen, danach so viel wie ins Budget passt.
function stream(dt,ms){const t0=performance.now(),pcx=Math.floor(P.x)>>4,pcz=Math.floor(P.z)>>4;let g=0,mb=0;
 const genOk=()=>g<1||performance.now()-t0<ms,meshOk=()=>mb<1||performance.now()-t0<ms;
 for(const[dx,dz]of ORDER){if(!meshOk()&&!genOk())break;const cx=pcx+dx,cz=pcz+dz;let c=cols.get(colKey(cx,cz));
  if(!c){if(!genOk())continue;c=genCol(cx,cz);g++}
  if(c.shown||!meshOk())continue;let ok=true;
  for(let ax=-1;ax<=1;ax++)for(let az=-1;az<=1;az++)if(!cols.has(colKey(cx+ax,cz+az))){if(genOk()){genCol(cx+ax,cz+az);g++}else ok=false}
  if(!ok)continue;for(let cy=0;cy<H/CS;cy++)buildChunk(cx,cy,cz);c.shown=true;mb++;
  if(c.leaf){c.leaf=false;checkLeavesInCol(c)}}
 unloadT+=dt;if(unloadT>1){unloadT=0;for(const c of cols.values())if(c.shown&&(Math.abs(c.cx-pcx)>RD+2||Math.abs(c.cz-pcz)>RD+2))hideCol(c)}}
function setBlock(x,y,z,id,rec){const i=idx(x,y,z);rawSet(x,y,z,id);if(rec)recordChange(i,id);markDirty(x,y,z);if(rec&&net.role==='host')netEmit({t:'blk',i,id})}

// ---------- Laubzerfall ----------
// Laub ist gehalten, wenn es über höchstens LEAF_REACH zusammenhängende Laubblöcke einen Stamm berührt.
const LOG=5,LEAF=6,LEAF_REACH=5,decay=new Map();let gameTime=0;
function leafSupported(x,y,z){
 const seen=new Set([idx(x,y,z)]);let front=[[x,y,z]];
 for(let d=0;d<LEAF_REACH&&front.length;d++){const next=[];
  for(const[cx,cy,cz]of front)for(const[dx,dy,dz]of N6){const nx=cx+dx,ny=cy+dy,nz=cz+dz;
   if(ny<0||ny>=H)continue;const id=get(nx,ny,nz);
   if(isLog(id))return true;if(!isLeaf(id))continue;const k=idx(nx,ny,nz);if(!seen.has(k)){seen.add(k);next.push([nx,ny,nz])}}
  front=next}
 return false}
const N6=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function scheduleDecay(x,y,z){const k=idx(x,y,z);if(!decay.has(k))decay.set(k,gameTime+.3+Math.random()*4)}
function checkLeavesAround(x,y,z){const r=LEAF_REACH+1;
 for(let lx=x-r;lx<=x+r;lx++)for(let ly=Math.max(0,y-r);ly<=Math.min(H-1,y+r);ly++)for(let lz=z-r;lz<=z+r;lz++)
  if(isLeaf(get(lx,ly,lz))&&!decay.has(idx(lx,ly,lz))&&!leafSupported(lx,ly,lz))scheduleDecay(lx,ly,lz)}
function checkLeavesInCol(c){for(let p=0;p<c.d.length;p++)if(isLeaf(c.d[p])){const x=c.cx*16+(p&15),z=c.cz*16+((p>>4)&15),y=p>>8;if(!leafSupported(x,y,z))scheduleDecay(x,y,z)}}
function updateDecay(){if(net.role==='client')return;let n=0;for(const[k,t]of decay){if(t>gameTime)continue;decay.delete(k);if(!isLeaf(getI(k)))continue;
 const x=kX(k),z=kZ(k),y=kY(k);if(leafSupported(x,y,z))continue;setBlock(x,y,z,0,true);if(++n>=8)break}}

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
 if(type==='container'){bx(g,C(0x3b3f44),1.95,.15,1.95,0,0,0);bx(g,C(0x8b5a2b),1.8,1.05,1.8,0,.15,0);
  for(const sx of[-.86,.86])for(const sz of[-.86,.86])bx(g,C(0x5e656d),.12,1.1,.12,sx,.15,sz);bx(g,C(0x6b4220),1.82,.08,1.82,0,.7,0);
  const lid=new THREE.Group();lid.position.set(0,1.2,-.9);bx(lid,C(0x5e656d),1.86,.14,1.86,0,0,.9);bx(lid,C(0xe8892b),.5,.06,.5,0,.14,.9);g.add(lid);a.lid=lid;a.lamp=.25}
 if(type==='warehouse'){bx(g,C(0x3b3f44),2.95,.15,2.95,0,0,0);bx(g,C(0x6f7a84),2.8,1.4,2.8,0,.15,0);
  for(let i=-1.2;i<=1.21;i+=.3){bx(g,C(0x5a646d),.08,1.4,.05,i,.15,1.41);bx(g,C(0x5a646d),.08,1.4,.05,i,.15,-1.41)}
  bx(g,C(0xe8892b),2.82,.12,2.82,0,1.2,0);bx(g,C(0x23272c),1,1,.06,0,.15,1.43);
  const lid=new THREE.Group();lid.position.set(0,1.55,-1.4);bx(lid,C(0x4d565e),2.86,.14,2.86,0,0,1.4);bx(lid,C(0xffd24a),.9,.05,.9,0,.14,1.4);g.add(lid);a.lid=lid;a.lamp=.18}
 if(def.router){const col=type==='splitter'?0xe8b02b:0x3d78c2;bx(g,C(0x3b3f44),.96,.12,.96,0,0,0);bx(g,C(col),.66,.42,.66,0,.12,0);
  bx(g,C(0x33373c),.5,.06,.5,0,.54,0);bx(g,C(0x23272c),.3,.2,.08,0,.18,.33);bx(g,C(0x23272c),.3,.2,.08,0,.18,-.33);
  bx(g,C(0x23272c),.08,.2,.3,.33,.18,0);bx(g,C(0x23272c),.08,.2,.3,-.33,.18,0)}
 if(def.bridge){const N=def.d*8;const pts=[];for(let i=0;i<=N;i++){const[py,pz]=bridgePath(def,i/N);pts.push([py-.17,pz])}
  for(let i=0;i<N;i++){const[y0,z0]=pts[i],[y1,z1]=pts[i+1];const len=Math.hypot(y1-y0,z1-z0),ang=Math.atan2(y1-y0,z1-z0),cy=(y0+y1)/2,cz=(z0+z1)/2;
   for(const[w,h,x,c]of[[.9,.08,0,0x3a3f45],[.08,.2,-.46,0x707780],[.08,.2,.46,0x707780]]){const me=new THREE.Mesh(BOX,C(c));me.scale.set(w,h,len+.02);me.position.set(x,cy+h/2,cz);me.rotation.x=-ang;g.add(me)}}
  for(const zz of[-def.d/2+.55,def.d/2-.55])for(const sx of[-.42,.42])bx(g,C(0x4a4f55),.12,bridgePath(def,(zz+def.d/2)/def.d)[0]-.2,.12,sx,0,zz);
  bx(g,C(0xe8892b),.98,.06,.5,0,0,-def.d/2+.25);bx(g,C(0xe8892b),.98,.06,.5,0,0,def.d/2-.25)}
 if(type==='ballista'){bx(g,C(0x6e4a28),.8,.2,.8,0,0,0);bx(g,C(0x7a5232),.22,.95,.22,0,.2,0);const hd=new THREE.Group();hd.position.y=1.2;g.add(hd);a.head=hd;
  bx(hd,C(0xa0703f),.24,.18,.9,0,-.09,0);bx(hd,C(0x6e4a28),1.1,.08,.1,0,0,.2);bx(hd,C(0xd8d8d8),.04,.04,.7,0,.06,.05);a.muzzle=[0,1.2,.5]}
 if(type==='gunturret'){bx(g,C(0x3b3f44),1.9,.3,1.9,0,0,0);bx(g,C(0x55595e),1.1,.55,1.1,0,.3,0);const hd=new THREE.Group();hd.position.y=1.05;g.add(hd);a.head=hd;
  bx(hd,C(0x6d7a52),.9,.5,.9,0,-.25,0);bx(hd,C(0x4f5862),.6,.32,.5,0,.25,-.05);
  for(const sx of[-.16,.16])bx(hd,C(0x2a2d31),.1,.1,.9,sx,-.05,.55);a.muzzle=[0,1.05,1]}
 if(type==='laser'){bx(g,C(0x3b3f44),1.9,.3,1.9,0,0,0);bx(g,C(0xcfd8e2),.6,1.6,.6,0,.3,0);for(const[sx,sz]of[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]])bx(g,C(0x8a939c),.18,1,.18,sx,.3,sz);
  const hd=new THREE.Group();hd.position.y=2.15;g.add(hd);a.head=hd;bx(hd,C(0xdfe4ea),.8,.4,.8,0,-.2,0);
  a.glow=bx(hd,ghost?ghostMat:new THREE.MeshLambertMaterial({color:0xff3b6b,emissive:0xff3b6b,emissiveIntensity:.6}),.22,.22,.5,0,-.1,.5);a.muzzle=[0,2.05,.8]}
 if(type==='tower'){const st=0x9a9ea3,dk=0x5d6166;bx(g,C(dk),3,1,3,0,0,0);bx(g,C(st),2.6,12,2.6,0,1,0);
  for(const yy of[4,8,12])bx(g,C(dk),2.8,.3,2.8,0,yy,0);
  for(const yy of[5.5,9.5])for(const[sx,sz,w,d]of[[0,1.31,.5,.06],[0,-1.31,.5,.06],[1.31,0,.06,.5],[-1.31,0,.06,.5]])bx(g,C(0x23272c),w,.9,d,sx,yy,sz);
  bx(g,C(0x3b2a1c),.9,1.7,.08,0,1,1.31);bx(g,C(dk),3,.5,3,0,13,0);
  for(const[sx,sz]of[[-1.25,-1.25],[0,-1.25],[1.25,-1.25],[-1.25,0],[1.25,0],[-1.25,1.25],[0,1.25],[1.25,1.25]])bx(g,C(st),.5,.8,.5,sx,13.5,sz);
  bx(g,C(0x33373c),.1,1.6,.1,.9,13.5,-.9);a.flag=bx(g,C(0xf29a2e),.7,.4,.04,1.25,14.65,-.9);
  a.glow=bx(g,ghost?ghostMat:new THREE.MeshLambertMaterial({color:0xffb347,emissive:0xffb347,emissiveIntensity:.9}),.6,.6,.6,0,13.5,0)}
 if(type==='barke'){bx(g,C(0x3b3f44),.8,.15,.8,0,0,0);bx(g,C(0x55595e),.16,1.4,.16,0,.15,0);bx(g,C(0x33373c),.5,.1,.5,0,1.55,0);
  a.glow=bx(g,ghost?ghostMat:new THREE.MeshLambertMaterial({color:0x4fe3ff,emissive:0x4fe3ff,emissiveIntensity:.9}),.36,.36,.36,0,1.65,0);
  if(!ghost){const beam=new THREE.Mesh(BOX,new THREE.MeshBasicMaterial({color:0x4fe3ff,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));beam.scale.set(.18,48,.18);beam.position.y=2+24;g.add(beam)}}
 if(type==='chest'){bx(g,C(0x8b5a2b),.86,.6,.86,0,0,0);const lid=new THREE.Group();lid.position.set(0,.6,-.45);bx(lid,C(0x6b4220),.9,.2,.9,0,0,.45);bx(lid,C(0xd8b04a),.16,.18,.04,0,-.1,.9);g.add(lid);a.lid=lid}
 if(type==='smelter'){bx(g,C(0x3b3f44),1.95,.25,1.95,0,0,0);bx(g,C(0x8c8f93),1.7,1.25,1.7,0,.25,0);a.glow=bx(g,GL(0xff7a1a),.8,.45,.06,0,.45,.86);
  bx(g,C(0x5d6166),1.8,.15,1.8,0,1.5,0);bx(g,C(0x55595e),.42,1,.42,-.5,1.65,-.5);bx(g,C(0x55595e),.5,.3,.3,-.5,.3,-.95);a.emit.push({p:[-.5,2.7,-.5],k:'smoke'})}
 if(def.miner){const hc=type==='miner1'?0xe8892b:type==='miner2'?0x7b5cd6:0x2fb3a0;for(const sx of[-.8,.8])for(const sz of[-.8,.8])bx(g,C(0x4a4f55),.2,2.6,.2,sx,0,sz);
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
 const ports=(list,mat)=>{if(!Array.isArray(list))return;for(const[lx,lz,ld]of list){const px=lx+.5-def.w/2,pz=lz+.5-def.d/2;
  // Pfeil schwebt knapp über Bandhöhe, damit er auf angeschlossenen Bändern sichtbar bleibt
  const p=new THREE.Object3D();p.position.set(px,.135,pz);p.rotation.y=-ld*Math.PI/2;const ar=new THREE.Mesh(PLANE,mat);ar.rotation.x=-Math.PI/2;ar.renderOrder=2;p.add(ar);g.add(p);
  // Splitter/Merger: zusätzlich kleine Pfeile oben auf dem Gehäuse, je Anschlussseite
  if(def.router){const q=new THREE.Object3D(),l=Math.hypot(px,pz)||1;q.position.set(px/l*.24,.605,pz/l*.24);q.rotation.y=-ld*Math.PI/2;
   const t=new THREE.Mesh(PLANE,mat);t.scale.set(.42,.42,1);t.rotation.x=-Math.PI/2;t.renderOrder=2;q.add(t);g.add(q)}}};
 ports(def.ins,arrIn);ports(def.outs,arrOut);return{g,a}}

// ---------- Gebäude ----------
function toW(def,rot,lx,lz){const w=def.w,d=def.d;return rot===0?[lx,lz]:rot===1?[d-1-lz,lx]:rot===2?[w-1-lx,d-1-lz]:[lz,w-1-lx]}
const dims=(def,rot)=>rot%2?[def.d,def.w]:[def.w,def.d];
// Belegte Zellen eines Gebäudes. Brücken belegen an den Enden Boden+Höhe, in der Mitte nur die Höhe (darunter bleibt frei).
function shapeOf(def,lx,lz){if(def.bridge)return(lz===0||lz===def.d-1)?[0,1]:[1];const r=[];for(let y=0;y<def.h;y++)r.push(y);return r}
function cellsOf(def,ox,oy,oz,rot){const c=[];for(let lx=0;lx<def.w;lx++)for(let lz=0;lz<def.d;lz++){const[a,b]=toW(def,rot,lx,lz);
 for(const dy of shapeOf(def,lx,lz))c.push({x:ox+a,y:oy+dy,z:oz+b,base:dy===0})}return c}
function checkPlace(type,ox,oy,oz,rot,ignoreP){
 const def=BUILD[type];const cells=cellsOf(def,ox,oy,oz,rot);
 for(const c of cells){if(!isXZ(c.x)||!isXZ(c.z)||c.y<1||c.y>=H)return'Außerhalb der Welt';
  if(pathSet.has(idx(c.x,c.y,c.z)))return'Hier verläuft der Angriffspfad';
  if(get(c.x,c.y,c.z)&&!(def.router&&get(c.x,c.y,c.z)===BELT))return'Platz blockiert – Blöcke wegräumen';
  if(c.base&&!solidId(get(c.x,c.y-1,c.z)))return'Fläche nicht eben – Boden fehlt'}
 const px0=Math.floor(P.x-.3),px1=Math.floor(P.x+.3),pz0=Math.floor(P.z-.3),pz1=Math.floor(P.z+.3),py0=Math.floor(P.y),py1=Math.floor(P.y+1.79);
 if(!ignoreP&&cells.some(c=>c.x>=px0&&c.x<=px1&&c.z>=pz0&&c.z<=pz1&&c.y>=py0&&c.y<=py1))return'Du stehst im Weg';
 if(!has(def.cost))return'Zu wenig Ressourcen';return''}
function createMachine(type,ox,oy,oz,rot,data){
 const def=BUILD[type],[rw,rd]=dims(def,rot);
 if(type==='belt'){const b={x:ox,y:oy,z:oz,dir:rot,items:[],s:0};const g=new THREE.Group(),k=model('belt').g;g.add(k);b.k=k;g.position.set(ox+.5,oy,oz+.5);g.rotation.y=-rot*Math.PI/2;scene.add(g);b.g=g;
  belts.set(idx(ox,oy,oz),b);rawSet(ox,oy,oz,BELT);if(data)b.items=data.map((it,i)=>({item:it,p:Math.max(0,.9-i*SP)}));slopesDirty=true;if(net.role==='host')netEmit({t:'build',type,x:ox,y:oy,z:oz,r:rot});return b}
 const m={type,x:ox,y:oy,z:oz,rot,rw,rd,h:def.h,inBuf:{},outBuf:{},recipe:0,t:0,status:'',working:false,tr:[]};
 if(data){m.inBuf=data.i||{};m.outBuf=data.o||{};m.recipe=data.rc||0;m.disp=data.ds||null;if(data.nm)m.name=data.nm}else if(def.store)m.disp='all'
 if(def.beacon&&!m.name){let n=1;while(machines.some(q=>q.name==='Barke '+n))n++;m.name='Barke '+n}
 m.cells=cellsOf(def,ox,oy,oz,rot).map(c=>idx(c.x,c.y,c.z));
 for(const i of m.cells){setI(i,MACH);machineAt.set(i,m);markDirty(kX(i),kY(i),kZ(i))}
 const mp=l=>Array.isArray(l)?l.map(([lx,lz,ld])=>{const[a,b]=toW(def,rot,lx,lz);return{x:ox+a,y:oy,z:oz+b,dir:(ld+rot)%4}}):[];
 m.ins=mp(def.ins);m.outs=mp(def.outs);if(def.store){m.disp=normDisp(m.disp,m.outs.length);m.di=m.outs.map(()=>0);m.ps=m.outs.map(()=>'')}
 if(def.router&&data){for(const k in m.outBuf)for(let i=0;i<m.outBuf[k]&&m.tr.length<4;i++)m.tr.push({item:k});m.outBuf={}}
 // Abbauziel nur beim Aufstellen automatisch wählen; geladene Miner behalten ihre gespeicherte Einstellung.
 if(def.miner&&!data){m.recipe=0;let ore=false;minerArea(m,()=>{ore=true;return true});if(!ore)m.recipe=1}
 const{g,a}=model(type);g.position.set(ox+rw/2,oy,oz+rd/2);g.rotation.y=-rot*Math.PI/2;scene.add(g);g.updateMatrixWorld(true);m.g=g;m.a=a;m.pulse=0;m.emitT=Math.random()*.3;machines.push(m);if(net.role==='host')netEmit({t:'build',type,x:ox,y:oy,z:oz,r:rot});return m}
function removeBuilding(t){
 if(net.role==='host')netEmit({t:'rm',i:keyOf(t)});
 if(t.dir!==undefined&&t.items){scene.remove(t.g);belts.delete(idx(t.x,t.y,t.z));slopesDirty=true;rawSet(t.x,t.y,t.z,0);for(const i of t.items)add(i.item,1);
  for(const k in BUILD.belt.cost)add(k,BUILD.belt.cost[k]);return}
 const m=t;for(const i of m.cells){setI(i,0);machineAt.delete(i);markDirty(kX(i),kY(i),kZ(i))}for(const it of m.tr)add(it.item,1);
 scene.remove(m.g);machines=machines.filter(q=>q!==m);for(const k in m.inBuf)add(k,m.inBuf[k]);for(const k in m.outBuf)add(k,m.outBuf[k]);
 const c=BUILD[m.type].cost;for(const k in c)add(k,c[k]);if(panel&&panel.m===m)closePanel()}

// ---------- Logistik ----------
// Rampen: ein Band, dessen Ziel 1 Block höher liegt, steigt an; ein Band, das von 1 Block höher beliefert wird, fällt ab.
let slopesDirty=false;
function beltAhead(b,dy){const[dx,dz]=DIRS[b.dir];const nb=belts.get(idx(b.x+dx,b.y+dy,b.z+dz));return nb&&nb.dir!==(b.dir+2)%4?nb:null}
function updateSlopes(){slopesDirty=false;
 for(const b of belts.values()){let s=0;
  if(!beltAhead(b,0)&&beltAhead(b,1))s=1;
  else for(let d=0;d<4&&!s;d++){const[dx,dz]=DIRS[d];const ub=belts.get(idx(b.x-dx,b.y+1,b.z-dz));if(ub&&ub.dir===d&&!beltAhead(ub,0))s=-1}
  if(s!==b.s){b.s=s;b.k.rotation.x=s?s*-Math.PI/4:0;b.k.scale.z=s?Math.SQRT2:1;b.k.position.y=s?.5:0}}}
const beltFree=b=>!b.items.length||(b.items.length<4&&b.items[b.items.length-1].p>=SP);
function machineAccept(m,item,pi){
 const def=BUILD[m.type];
 if(def.turret){if(def.turret.ammo!==item||(m.inBuf[item]||0)>=200)return false;m.inBuf[item]=(m.inBuf[item]||0)+1;return true}
 if(def.router){if(m.type==='merger'){if(m.tr.some(t=>t.pi===pi))return false;m.tr.push({item,pi});return true}if(m.tr.length>=2)return false;m.tr.push({item});return true}
 if(def.bridge){const tr=m.tr;if(tr.length>=def.d*3||(tr.length&&tr[tr.length-1].t<SP/BS))return false;tr.push({item,t:0});return true}
 if(def.store){if(tot(m.inBuf)>=def.store)return false;m.inBuf[item]=(m.inBuf[item]||0)+1;m.pulse=.35;return true}
 const rs=RECIPES[m.type];if(!rs)return false;let r=rs[m.recipe];
 if(r.in[item]===undefined){if(!def.auto||tot(m.inBuf))return false;const j=rs.findIndex(q=>q.in[item]!==undefined);if(j<0)return false;m.recipe=j;m.t=0;r=rs[j]}
 if((m.inBuf[item]||0)>=MAXIN)return false;m.inBuf[item]=(m.inBuf[item]||0)+1;return true}
function transfer(b,item){
 const[dx,dz]=DIRS[b.dir],tx=b.x+dx,tz=b.z+dz;
 for(const dy of[0,1,-1]){const nb=belts.get(idx(tx,b.y+dy,tz));
  if(nb){if(nb.dir===(b.dir+2)%4)return false;if(beltFree(nb)){nb.items.push({item,p:0});return true}return false}}
 const m=machineAt.get(idx(tx,b.y,tz));if(!m)return false;
 const pi=m.ins.findIndex(p=>p.x===b.x&&p.y===b.y&&p.z===b.z&&p.dir===b.dir);
 if(BUILD[m.type].ins==='all'||pi>=0){if(machineAccept(m,item,pi)){stats.delivered++;return true}}
 return false}
// Falsche Items am Eingang: passt zu keinem (Auto-Ofen) bzw. nicht zum gewählten Rezept.
function wrongFor(m,item){const def=BUILD[m.type],rs=RECIPES[m.type];if(!rs||def.bridge||def.router)return false;
 if(rs[m.recipe].in[item]!==undefined)return false;return!(def.auto&&rs.some(q=>q.in[item]!==undefined))}
function feederOf(b){for(let d=0;d<4;d++){const[dx,dz]=DIRS[d];for(const dy of[0,1,-1]){const f=belts.get(idx(b.x-dx,b.y+dy,b.z-dz));
 if(f&&f.dir===d&&!(dy!==0&&beltAhead(f,0)))return f}}return null}
function inputChains(m){const out=[];for(const p of m.ins){let b=belts.get(idx(p.x,p.y,p.z));if(!b||b.dir!==p.dir)continue;const seen=new Set();
 for(let n=0;b&&n<30&&!seen.has(b);n++){seen.add(b);out.push(b);b=feederOf(b)}}return out}
function wrongItems(m){const c={};for(const b of inputChains(m))for(const it of b.items)if(wrongFor(m,it.item))c[it.item]=(c[it.item]||0)+1;return c}
function purgeInputs(m){let n=0;for(const b of inputChains(m)){const keep=[];for(const it of b.items){if(wrongFor(m,it.item)){add(it.item,1);n++}else keep.push(it)}b.items=keep}
 if(n)toast(n+' falsche Items ins Inventar gelegt');return n}
function updateBelts(dt){for(const b of belts.values()){const its=b.items;
 for(let i=0;i<its.length;i++){const lim=i===0?1:its[i-1].p-SP;its[i].p=Math.max(its[i].p,Math.min(its[i].p+BS*dt,lim))}
 if(its.length&&its[0].p>=1&&transfer(b,its[0].item))its.shift()}}
function minerArea(m,fn){const def=BUILD[m.type];for(let y=m.y-1;y>=Math.max(1,m.y-12);y--)for(let x=m.x-1;x<=m.x+m.rw;x++)for(let z=m.z-1;z<=m.z+m.rd;z++){
 const id=get(x,y,z);if(m.recipe===1?id===3:(BL[id]&&BL[id].ore&&BL[id].tier<=def.tier)){if(fn(x,y,z,id))return}}}
const bridgePath=(def,f)=>[.27+1.25*Math.min(1,Math.sin(Math.PI*f)*1.6),-def.d/2+f*def.d];
// Lager als Dispenser: gibt das gewählte Item (oder reihum alle) an freie Bänder an den Ausgängen ab.
const dispOk=v=>v==='all'||(typeof v==='string'&&own(ITEMS,v))?v:null;
function normDisp(v,n){return Array.from({length:n},(_,i)=>dispOk(Array.isArray(v)?v[i]:v))}
const portName=(m,i)=>m.outs.length===1?'Ausgang':m.outs.length===2?['Ausgang links','Ausgang rechts'][i]:['Ausgang links','Ausgang Mitte','Ausgang rechts'][i];
function dispense(m){m.working=false;let gave=false;
 m.outs.forEach((p,i)=>{const sel=m.disp[i];let st;
  if(!sel)st='aus';else{const b=belts.get(idx(p.x,p.y,p.z));
   if(!b)st='kein Band (oranger Pfeil, Bodenhöhe)';else if(b.dir===(p.dir+2)%4)st='Band zeigt zum Lager – umdrehen';else if(!beltFree(b))st='Band voll';
   else{let it=null;if(sel==='all'){const ks=Object.keys(m.inBuf).filter(k=>m.inBuf[k]>0&&!m.disp.includes(k));if(ks.length){m.di[i]=(m.di[i]+1)%ks.length;it=ks[m.di[i]]}}else if((m.inBuf[sel]||0)>0)it=sel;
    if(!it)st=sel==='all'?(m.disp.some(v=>v&&v!=='all')?'nichts Übriges im Lager':'Lager leer'):'kein '+ITEMS[sel][0]+' im Lager';
    else{m.inBuf[it]--;if(!m.inBuf[it])delete m.inBuf[it];b.items.push({item:it,p:0});gave=true;st='gibt aus'}}}
  if(st!=='Band voll'||m.ps[i]!=='gibt aus')m.ps[i]=st});
 if(gave){m.working=true;m.pulse=Math.max(m.pulse||0,.35)}
 m.status=m.disp.every(v=>!v)?'Ausgabe aus – im Fenster [E] einschalten':m.outs.map((p,i)=>(m.outs.length>1?portName(m,i).replace('Ausgang ','')+': ':'')+m.ps[i]).join(' · ')}
function tickMachine(m,dt){
 const def=BUILD[m.type];
 if(def.miner&&net.role==='client')return; // Abbau läuft nur beim Host, Zustand kommt per Sync
 if(def.router){m.working=m.tr.length>0;m.status=m.tr.length?'Verteilt…':'Wartet auf Items';
  if(m.tr.length&&m.type==='merger'){const p=m.outs[0],b=belts.get(idx(p.x,p.y,p.z));
   if(b&&b.dir!==(p.dir+2)%4&&beltFree(b)){m.ri=m.ri||0;let j=-1,pi=0;for(let k=0;k<3&&j<0;k++){pi=(m.ri+k)%3;j=m.tr.findIndex(t=>t.pi===pi)}
    if(j<0)j=0;else m.ri=(pi+1)%3;b.items.push({item:m.tr.splice(j,1)[0].item,p:0})}return}
  if(m.tr.length){const n=m.outs.length;m.rr=m.rr||0;for(let k=0;k<n;k++){const i=(m.rr+k)%n,p=m.outs[i],b=belts.get(idx(p.x,p.y,p.z));
   if(!b||b.dir===(p.dir+2)%4||!beltFree(b))continue;b.items.push({item:m.tr.shift().item,p:0});m.rr=(i+1)%n;break}}
  return}
 if(def.bridge){const travel=def.d/BS;for(let i=0;i<m.tr.length;i++){const lim=i===0?travel:m.tr[i-1].t-SP/BS;m.tr[i].t=Math.max(m.tr[i].t,Math.min(m.tr[i].t+dt,lim))}
  if(m.tr.length&&m.tr[0].t>=travel&&!tot(m.outBuf)){const it=m.tr.shift().item;m.outBuf[it]=1}
  m.working=m.tr.length>0;m.status=m.tr.length+' Items unterwegs'}
 if(def.miner){
  if(tot(m.outBuf)>=12){m.working=false;m.status='Ausgang voll – Förderband anschließen'}
  else{m.t+=dt;m.working=true;m.status='Fördert…';
   if(m.t>=def.period){m.t=0;let found=false;
    minerArea(m,(x,y,z,id)=>{found=true;const k=idx(x,y,z);let r=reserves.has(k)?reserves.get(k):RESERVE;r--;const it=BL[id].drop;m.outBuf[it]=(m.outBuf[it]||0)+1;
     stats.produced[it]=(stats.produced[it]||0)+1;if(r<=0){reserves.delete(k);setBlock(x,y,z,0,true)}else reserves.set(k,r);return true});
    if(!found){m.working=false;m.status=m.recipe===1?'Kein Stein im Bereich unter dem Miner':'Kein abbaubares Erz im Bereich unter dem Miner – Abbauziel auf Stein stellen?'}}}}
 else if(!def.bridge&&!def.router&&RECIPES[m.type]){const r=RECIPES[m.type][m.recipe];
  const ok=Object.keys(r.in).every(k=>(m.inBuf[k]||0)>=r.in[k]);const full=Object.keys(r.out).some(k=>(m.outBuf[k]||0)>=MAXOUT);
  if(ok&&!full){m.working=true;m.status='Produziert…';m.t+=dt;if(m.t>=r.t){m.t=0;for(const k in r.in){m.inBuf[k]-=r.in[k];if(!m.inBuf[k])delete m.inBuf[k]}
   for(const k in r.out){m.outBuf[k]=(m.outBuf[k]||0)+r.out[k];stats.produced[k]=(stats.produced[k]||0)+r.out[k]}}}
  else{m.working=false;m.status=full?'Ausgang voll':'Wartet auf Eingangsmaterial'}}
 if(def.store){dispense(m);return}
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
 P.x=Math.max(-LIM+1,Math.min(LIM-1,P.x));P.z=Math.max(-LIM+1,Math.min(LIM-1,P.z));
 if(keys.Space&&P.ground){P.vy=8.2;P.ground=false}
 P.vy=Math.max(-40,P.vy-26*dt);const ny=P.y+P.vy*dt;
 if(collides(P.x,ny,P.z)){if(P.vy<0){const sy=Math.floor(ny)+1;if(!collides(P.x,sy,P.z))P.y=sy;P.ground=true}P.vy=0}else{P.y=ny;P.ground=false}
 if(P.y<-10){P.y=surfaceH(Math.floor(P.x),Math.floor(P.z))+2;P.vy=0}}
const aimV=new THREE.Vector3(),mouse={x:0,y:0};let mouseR=false,dragDist=0;
function raycast(max){
 const ox=P.x,oy=P.y+1.62,oz=P.z;camera.updateMatrixWorld();aimV.set(mouse.x,mouse.y,.5).unproject(camera).sub(camera.position).normalize();const dx=aimV.x,dy=aimV.y,dz=aimV.z;
 let x=Math.floor(ox),y=Math.floor(oy),z=Math.floor(oz);const sx=Math.sign(dx),sy=Math.sign(dy),sz=Math.sign(dz);
 const tdx=dx?Math.abs(1/dx):Infinity,tdy=dy?Math.abs(1/dy):Infinity,tdz=dz?Math.abs(1/dz):Infinity;
 let tx=dx?(dx>0?x+1-ox:ox-x)*tdx:Infinity,ty=dy?(dy>0?y+1-oy:oy-y)*tdy:Infinity,tz=dz?(dz>0?z+1-oz:oz-z)*tdz:Infinity;let n=[0,0,0],t=0;
 while(t<=max){const id=y<0?0:get(x,y,z);
  // Bänder sind flach: nur treffen, wenn der Strahl in dieser Zelle wirklich bis auf Bandhöhe kommt – zählt dann als Treffer von oben
  if(id===BELT){const te=Math.min(tx,ty,tz),ya=oy+dy*t,yb=oy+dy*te;if(Math.min(ya,yb)<=y+.25)return{x,y,z,id,n:[0,1,0]}}
  else if(id)return{x,y,z,id,n};
  if(tx<ty&&tx<tz){x+=sx;t=tx;tx+=tdx;n=[-sx,0,0]}else if(ty<tz){y+=sy;t=ty;ty+=tdy;n=[0,-sy,0]}else{z+=sz;t=tz;tz+=tdz;n=[0,0,-sz]}}
 return null}
const facing=()=>{const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);return Math.abs(fx)>Math.abs(fz)?(fx>0?3:1):(fz>0?0:2)};

// ---------- UI ----------
const $=id=>document.getElementById(id);
let panel=null,locked=false,buildType=null,rotOff=0,ghost=null,ghostType=null,selSlot=0,toastT=0,mineT=0,mineKey='',lastBelt='';
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;toastT=2.2}
function showPause(resume){try{renderSettings()}catch(e){}$('pause').classList.add('on');$('ptext').textContent=resume?'Pausiert. Klicke auf „Spielen“, um weiterzumachen.':$('ptext').textContent;$('play').textContent=resume?'Weiterspielen':'Spielen'}
function releaseMouse(){mouseL=false;mouseR=false;canvas.classList.remove('drag');for(const k in keys)keys[k]=false}
function resume(){$('pause').classList.remove('on');locked=true}
function pause(){locked=false;releaseMouse();showPause(true)}
$('play').onclick=()=>resume();
$('saveb').onclick=()=>save();
$('newb').onclick=()=>{if(net.role!=='solo')return toast('Während Koop nicht möglich – erst Koop verlassen');try{localStorage.removeItem(KEY)}catch(e){}newWorld(Math.floor(Math.random()*1e6));toast('Neue Welt erstellt')};
function openPanel(kind,m){panel={kind,m};panelHtml='';$('panel').classList.add('on');renderPanel();locked=false;releaseMouse()}
function closePanel(){panel=null;$('panel').classList.remove('on');resume()}
$('panel').addEventListener('mousedown',e=>{if(e.target.id==='panel')closePanel()});
function costHtml(c){return`<div class="cost">${Object.keys(c).map(k=>`<span class="${(inv[k]||0)>=c[k]?'':'miss'}">${c[k]}× ${sw(k)}</span>`).join('')}</div>`}
function bufRows(buf,act,label){const ks=Object.keys(buf);if(!ks.length)return'<p class="mut">leer</p>';
 return ks.map(k=>`<div class="row"><span>${buf[k]}× ${sw(k)}</span>${act?`<button class="b sec" data-act="${act}:${k}">${label}</button>`:''}</div>`).join('')}
function renderPanel(){
 if(!panel)return;const pc=$('pc');let h='';const x=`<button class="b sec" data-act="close">Schließen</button>`;
 if(panel.kind==='build'){
  h=`<h2>Baumenü ${x}</h2><div class="tabs" role="tablist">${CATS.map((c,i)=>`<button class="tab ${i===buildCat?'on':''}" role="tab" aria-selected="${i===buildCat}" data-act="cat:${i}"><span class="mut">${i+1}</span> ${c[1]} <span class="mut">(${c[2].length})</span></button>`).join('')}</div>
   <p class="mut">Maschinen brauchen eine ebene, freie Fläche in voller Höhe. Wähle ein Gebäude, dann LMB zum Platzieren, R zum Drehen.</p><div class="grid">`+
   CATS[buildCat][2].map(k=>{const d=BUILD[k];return`<button class="bcard ${has(d.cost)?'':'no'}" data-act="build:${k}"><b>${d.n}</b> <span class="mut">${d.w}×${d.d}, Höhe ${d.h}</span><div class="mut" style="font-size:13px">${d.desc}</div>${costHtml(d.cost)}</button>`}).join('')+'</div>'}
 else if(panel.kind==='inv'){
  const ks=Object.keys(inv);h=`<h2>Inventar ${x}</h2><p>Werkzeug: <b>${TOOLS[tier].n}</b> <span class="mut">(Stufe ${tier})</span> · Geräte: <b>${Object.keys(GADGETS).filter(k=>gadgets[k]).map(k=>GADGETS[k].n).join(', ')||'keine'}</b></p><div class="grid">`+
   (ks.length?ks.map(k=>`<div class="row">${sw(k)}<b>${inv[k]}</b></div>`).join(''):'<p class="mut">Noch leer – baue etwas ab.</p>')+'</div>'+
   `<h3>Abbaubarkeit</h3><p class="mut">Hand: Erde, Sand, Holz · Holzspitzhacke: Stein, Kohle · Steinspitzhacke: Kupfer, Eisen · Eisenspitzhacke: Gold · Stahlspitzhacke: Titan</p>`}
 else{const m=panel.m,def=BUILD[m.type];h=`<h2>${def.n} ${x}</h2>`;
  if(m.type==='workbench'){h+=`<h3>Geräte</h3>`+Object.keys(GADGETS).map(k=>{const g=GADGETS[k];return`<div class="row"><div><b>${g.n}</b> <span class="mut" style="font-size:13px">${g.desc}</span>${costHtml(g.cost)}</div><button class="b" data-act="gadget:${k}" ${gadgets[k]||!has(g.cost)?'disabled':''}>${gadgets[k]?'Vorhanden':'Herstellen'}</button></div>`}).join('')+`<h3>Spitzhacken</h3><p>Aktuell: <b>${TOOLS[tier].n}</b></p>`+[1,2,3,4].map(t=>`<div class="row"><div><b>${TOOLS[t].n}</b>${costHtml(TOOLREC[t])}</div><button class="b" data-act="craft:${t}" ${tier>=t||!has(TOOLREC[t])||t>tier+1?'disabled':''}>${tier>=t?'Vorhanden':'Herstellen'}</button></div>`).join('')}
  else if(def.turret){const T=def.turret;h+=`<p>${m.status||'Bereit'}</p><p class="mut">Reichweite ${T.range} · Schaden ${T.dmg} · ${(1/T.cd).toFixed(1)} Schüsse/s${T.ammo?' · 1 Munition pro Schuss':' · ohne Munition'}</p>`+
   (T.ammo?`<div class="row"><span>${m.inBuf[T.ammo]||0}/200 ${sw(T.ammo)} <span class="mut">(Inventar: ${inv[T.ammo]||0})</span></span><button class="b sec" data-act="put:${T.ammo}" ${inv[T.ammo]?'':'disabled'}>Einlegen</button></div><p class="mut">Munition kann auch per Förderband an den grünen Pfeilen geliefert werden.</p>`:'')}
  else if(def.beacon){h+=`<p class="mut">Wegpunkt im Kompass. Gib der Barke einen Namen, um sie von anderen zu unterscheiden.</p>
   <div class="crow"><input id="bname" maxlength="24" value="${esc(m.name)}" aria-label="Name der Barke" autocomplete="off"><button class="b" data-act="rename">Umbenennen</button></div>
   <p class="mut">Position: ${m.x}, ${m.y}, ${m.z}</p>`}
  else if(def.fixed){const dd=Math.round(Math.hypot(m.x+1.5-P.x,m.z+1.5-P.z));h+=`<p>Deine Basis. Sie steht seit Spielbeginn und kann nicht abgerissen werden.</p><p>Lebenspunkte: <b>${Math.max(0,Math.round(td.hp))}</b> / ${TOWER_HP} · Welle ${td.wave} · Besiegte Gegner ${td.kills}${td.defeats?' · gefallen: '+td.defeats+'×':''}</p><p class="mut">Position: ${m.x+1}, ${m.y}, ${m.z+1} · Entfernung ${dd} m</p>`}
  else if(def.store){const n=tot(m.inBuf);h+=`<p>Belegt: <b>${n}</b> / ${def.store} Items</p><div class="prog"><i style="width:${Math.min(100,n/def.store*100)}%"></i></div><h3>Inhalt</h3>${bufRows(m.inBuf,'takec','Nehmen')}<div class="btns"><button class="b" data-act="takeall">Alles nehmen</button></div>
   <h3>Ausgabe (Dispenser) – ${m.outs.length} Ausgang${m.outs.length>1?'e':''} vorne</h3>${m.outs.length>1?'<p class="mut">Links/rechts gesehen, wenn du vor den orangen Pfeilen stehst und auf das Lager schaust. „Alles“ gibt alles aus, was kein anderer Ausgang ausgibt.</p>':''}
   ${m.outs.map((p,i)=>{const cur=m.disp[i]||'off';const opts=[['off','Aus'],['all','Alles'],...[...new Set([...Object.keys(m.inBuf),...(m.disp[i]&&m.disp[i]!=='all'?[m.disp[i]]:[])])].map(k=>[k,ITEMS[k][0]])];
    return`<div class="dsp"><b>${portName(m,i)}</b> <span class="mut">– ${esc(m.ps[i]||'')}</span><div class="recs">${opts.map(([k,n])=>`<button class="rec ${cur===k?'on':''}" data-act="disp:${i}.${k}">${n}</button>`).join('')}</div></div>`}).join('')}`}
  else if(def.miner){let left=0,blocks=0;minerArea(m,(x,y,z)=>{const k=idx(x,y,z);left+=reserves.has(k)?reserves.get(k):RESERVE;blocks++});
   h+=`<h3>Abbauziel</h3><div class="recs">${['Erze','Stein'].map((n,i)=>`<button class="rec ${i===m.recipe?'on':''}" data-act="recipe:${i}">${n}</button>`).join('')}</div>
   <p>${m.status||'Startet…'}</p><p class="mut">Abbaubereich: ${m.rw+2}×${m.rd+2} Felder, bis 12 Blöcke tief. Verbleibend: <b style="color:var(--ink)">${left}</b> Einheiten in ${blocks} ${m.recipe===1?'Steinblöcken':'Erzblöcken'}.</p>
    <div class="prog"><i style="width:${Math.min(100,m.t/def.period*100)}%"></i></div><h3>Ausgang</h3>${bufRows(m.outBuf,'take','Entnehmen')}`}
  else{const rs=RECIPES[m.type],r=rs[m.recipe];
   h+=`<h3>Rezept</h3><div class="recs">${rs.map((q,i)=>`<button class="rec ${i===m.recipe?'on':''}" data-act="recipe:${i}">${Object.keys(q.in).map(k=>q.in[k]+'× '+ITEMS[k][0]).join(' + ')} → ${Object.keys(q.out).map(k=>q.out[k]+'× '+ITEMS[k][0]).join(', ')} <span class="mut">(${q.t} s)</span></button>`).join('')}</div>
   <p>${m.status||''}</p><div class="prog"><i style="width:${Math.min(100,m.t/r.t*100)}%"></i></div>${(()=>{const w=wrongItems(m),ks=Object.keys(w);return ks.length?`<div class="warn"><span><b>Eingang blockiert:</b> ${ks.map(k=>w[k]+'× '+sw(k)).join(', ')} passt nicht zum Rezept.</span><button class="b danger" data-act="purge">Falsche Items entfernen</button></div>`:''})()}
   <div class="cols"><div><h3>Eingang</h3>${Object.keys(r.in).map(k=>`<div class="row"><span>${m.inBuf[k]||0}/${MAXIN} ${sw(k)} <span class="mut">(Inventar: ${inv[k]||0})</span></span><button class="b sec" data-act="put:${k}" ${inv[k]?'':'disabled'}>Einlegen</button></div>`).join('')}</div>
   <div><h3>Ausgang</h3>${bufRows(m.outBuf,'take','Entnehmen')}</div></div>`}}
 if(h===panelHtml)return;panelHtml=h;pc.innerHTML=h}
// Während die Maustaste im Fenster gedrückt ist, nicht neu aufbauen – sonst verliert der Browser den Klick.
let panelHtml='',panelHold=false;
$('pc').addEventListener('pointerdown',()=>{panelHold=true});
addEventListener('pointerup',()=>setTimeout(()=>{panelHold=false},0));
addEventListener('pointercancel',()=>{panelHold=false});
$('pc').addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){e.stopPropagation();if(e.key==='Enter'){const b=$('pc').querySelector('[data-act="rename"]');if(b)b.click()}}});
$('pc').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;let[act,arg]=b.dataset.act.split(':');const m=panel&&panel.m;
 if(act==='rename'){const inp=$('bname');arg=inp?inp.value:'';panelHtml=''}
 if(act==='close')return closePanel();
 if(act==='cat'){const i=+arg;if(i>=0&&i<CATS.length){buildCat=i;try{localStorage.setItem('satiscraft-cat',String(i))}catch(e){}}renderPanel();return}
 if(act==='build'){buildType=arg;rotOff=0;closePanel();return}
 if(m&&PANEL_ACTS.includes(act)){if(net.role==='client')netSend({t:'act',a:'panel',k:m.cells[0],act,arg});else panelAct(m,act,arg)}
 renderPanel();renderHotbar()});
const PANEL_ACTS=['rename','gadget','craft','recipe','put','take','takec','takeall','purge','disp'];
function panelAct(m,act,arg){
 if(act==='craft'){const t=+arg;if(m.type==='workbench'&&TOOLREC[t]&&has(TOOLREC[t])&&tier===t-1){for(const k in TOOLREC[t])add(k,-TOOLREC[t][k]);tier=t;m.pulse=1.4;toast(TOOLS[t].n+' hergestellt')}}
 if(act==='recipe'){const i=+arg,n=BUILD[m.type].miner?2:RECIPES[m.type]?RECIPES[m.type].length:0;if(isInt(i,0,n-1)&&i!==m.recipe){for(const k in m.inBuf)add(k,m.inBuf[k]);m.inBuf={};m.recipe=i;m.t=0}}
 if(act==='rename'){if(BUILD[m.type].beacon&&typeof arg==='string'){m.name=cleanName(arg);toast('Barke heißt jetzt „'+m.name+'“')}return}
 if(act==='gadget'){const g=GADGETS[arg];if(m.type==='workbench'&&g&&own(GADGETS,arg)&&!gadgets[arg]&&has(g.cost)){for(const k in g.cost)add(k,-g.cost[k]);gadgets[arg]=true;m.pulse=1.4;toast(g.n+' hergestellt'+(arg==='radar'?' – Taste F':''))}return}
 if(act==='purge'){purgeInputs(m);return}
 if(act==='disp'){if(!BUILD[m.type].store||typeof arg!=='string')return;const[pi,k]=arg.split('.');const i=+pi;if(!isInt(i,0,m.outs.length-1))return;if(k==='off')m.disp[i]=null;else if(dispOk(k))m.disp[i]=k;return}
 if(act==='takeall'&&BUILD[m.type].store){for(const k in m.inBuf)add(k,m.inBuf[k]);m.inBuf={};return}
 if(!own(ITEMS,arg))return;
 if(act==='put'&&BUILD[m.type].turret){const T=BUILD[m.type].turret;if(T.ammo!==arg)return;const n=Math.min(inv[arg]||0,200-(m.inBuf[arg]||0));if(n>0){add(arg,-n);m.inBuf[arg]=(m.inBuf[arg]||0)+n}return}
 if(act==='put'){const r=RECIPES[m.type]&&RECIPES[m.type][m.recipe];if(!r||r.in[arg]===undefined)return;const n=Math.min(inv[arg]||0,MAXIN-(m.inBuf[arg]||0));if(n>0){add(arg,-n);m.inBuf[arg]=(m.inBuf[arg]||0)+n}}
 if(act==='take'&&m.outBuf[arg]){add(arg,m.outBuf[arg]);delete m.outBuf[arg]}
 if(act==='takec'&&m.inBuf[arg]){add(arg,m.inBuf[arg]);delete m.inBuf[arg]}
 if(act==='takeall'){for(const k in m.inBuf)add(k,m.inBuf[k]);m.inBuf={}}}
function renderHotbar(){
 $('hotbar').innerHTML=PLACE.map(([it],i)=>`<div class="slot ${i===selSlot?'sel':''}"><span class="k">${i+1}</span><span class="sw" style="background:${ITEMS[it][1]}"></span><span class="n">${inv[it]||0}</span><span class="l">${ITEMS[it][0]}</span></div>`).join('');
 $('tool').innerHTML=`Werkzeug: <b>${TOOLS[tier].n}</b> · Biom: <b>${BIOMES[biomeAt(Math.floor(P.x),Math.floor(P.z))]}</b>`}
function renderGoal(){while(net.role!=='client'&&goal<GOALS.length-1&&GOALS[goal][1]()){goal++;if(goal>0)toast('Meilenstein erreicht!')}
 $('goal').innerHTML=`<b>Meilenstein ${Math.min(goal+1,GOALS.length-1)} / ${GOALS.length-1}</b>${GOALS[goal][0]}`}

// ---------- Eingabe ----------
addEventListener('keydown',e=>{
 if(['Tab','Space'].includes(e.code))e.preventDefault();
 if(panel){if(panel.kind==='build'&&e.code.startsWith('Digit')){const i=+e.code.slice(5)-1;if(i>=0&&i<CATS.length){buildCat=i;try{localStorage.setItem('satiscraft-cat',String(i))}catch(e){}renderPanel()}return}
  if(['Escape','KeyE','KeyI','KeyQ','Tab'].includes(e.code))closePanel();return}
 if(e.code==='F3'){e.preventDefault();if(!e.repeat)cyclePerf();return}
 if(e.code==='Escape'&&e.repeat)return;
 if(!locked){if(e.code==='Escape'&&$('pause').classList.contains('on'))resume();return}
 if(e.code==='Escape')return pause();keys[e.code]=true;
 if(e.code.startsWith('Digit')){const n=+e.code.slice(5)-1;if(n>=0&&n<PLACE.length){selSlot=n;renderHotbar()}}
 if(e.code==='KeyQ'){if(buildType){buildType=null}else openPanel('build')}
 if(e.code==='KeyI'||e.code==='Tab')openPanel('inv');
 if(e.code==='KeyR'&&buildType)rotOff=(rotOff+1)%4;
 if(e.code==='KeyF')cycleRadar(e.shiftKey);
 if(e.code==='KeyE'){const h=raycast(6);if(h&&h.id===MACH){const m=machineAt.get(idx(h.x,h.y,h.z));if(m&&m.type!=='belt'&&!BUILD[m.type].bridge&&!BUILD[m.type].router){buildType=null;openPanel('machine',m)}}}});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',releaseMouse);
// Kamera dreht nur bei gedrückter rechter Maustaste; ein kurzer Rechtsklick ohne Ziehen setzt einen Block bzw. bricht den Baumodus ab.
document.addEventListener('mousemove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;
 if(!locked||!mouseR)return;dragDist+=Math.abs(e.movementX)+Math.abs(e.movementY);
 if(dragDist>4)canvas.classList.add('drag');P.yaw-=e.movementX*.004;P.pitch=Math.max(-1.55,Math.min(1.55,P.pitch-e.movementY*.004))});
canvas.addEventListener('mousedown',e=>{if(!locked)return;
 if(e.button===0){mouseL=true;if(buildType){const ok=place&&!place.err;const pos=place&&{x:place.ox,y:place.oy,z:place.oz};tryPlace();if(buildType==='belt'){lastBeltPos=ok?pos:null;lastBelt=place?place.ox+','+place.oy+','+place.oz:''}}}
 if(e.button===2){mouseR=true;dragDist=0}});
document.addEventListener('mouseup',e=>{if(e.button===0){mouseL=false;lastBelt='';lastBeltPos=null}
 if(e.button===2&&mouseR){mouseR=false;canvas.classList.remove('drag');if(locked&&dragDist<=4){if(buildType)buildType=null;else{placeBlock();vmPunch=.3}}}});
document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('wheel',e=>{if(!locked)return;if(buildType){rotOff=(rotOff+(e.deltaY>0?1:3))%4}else{selSlot=(selSlot+(e.deltaY>0?1:PLACE.length-1))%PLACE.length;renderHotbar()}},{passive:true});
function placeBlock(){const h=raycast(6);if(!h)return;const[it,id]=PLACE[selSlot];if(!inv[it])return toast('Kein '+ITEMS[it][0]+' im Inventar');
 const x=h.x+h.n[0],y=h.y+h.n[1],z=h.z+h.n[2];if(!isXZ(x)||!isXZ(z)||y<1||y>=H||get(x,y,z))return;if(pathSet.has(idx(x,y,z)))return toast('Der Angriffspfad muss frei bleiben');
 if(Math.floor(P.x-.3)<=x&&x<=Math.floor(P.x+.3)&&Math.floor(P.z-.3)<=z&&z<=Math.floor(P.z+.3)&&Math.floor(P.y)<=y&&y<=Math.floor(P.y+1.79))return;
 if(net.role==='client'){netSend({t:'act',a:'place',slot:selSlot,x,y,z});return}
 add(it,-1);setBlock(x,y,z,id,true);renderHotbar()}
let place=null;
function computePlace(){place=null;if(!buildType)return;const h=raycast(8);if(!h)return;const def=BUILD[buildType];
 const rot=(facing()+rotOff)%4,[rw,rd]=dims(def,rot);// Zielt man von oben auf ein Band, wird auf dessen Höhe gebaut (z. B. Brückenmitte genau über dem Band).
 const onBelt=h.id===BELT&&h.n[1]===1;const ax=onBelt?h.x:h.x+h.n[0],ay=onBelt?h.y:h.y+h.n[1],az=onBelt?h.z:h.z+h.n[2];
 const ox=ax-Math.floor(rw/2),oz=az-Math.floor(rd/2);let r2=rot;
 if(def.router){const ob=belts.get(idx(ox,ay,oz));if(ob)r2=(ob.dir+rotOff)%4}
 place={ox,oy:ay,oz,rot:r2,rw,rd,err:checkPlace(buildType,ox,ay,oz,r2)}}
function tryPlace(rotOverride){if(!place)return null;if(place.err){toast(place.err);return null}const def=BUILD[buildType],rot=rotOverride??place.rot;
 if(net.role==='client'){netSend({t:'act',a:'build',type:buildType,x:place.ox,y:place.oy,z:place.oz,r:rot});return null}
 const r=doBuild(buildType,place.ox,place.oy,place.oz,rot);renderHotbar();
 if(!has(def.cost)&&buildType!=='belt')buildType=null;return r}
function doBuild(type,ox,oy,oz,rot){const def=BUILD[type];
 if(def.router){const ob=belts.get(idx(ox,oy,oz));if(ob)removeBuilding(ob)}
 for(const k in def.cost)add(k,-def.cost[k]);return createMachine(type,ox,oy,oz,rot)}
function doMine(x,y,z,id){const bd=BL[id];setBlock(x,y,z,0,true);if(isLog(id)||isLeaf(id))checkLeavesAround(x,y,z);reserves.delete(idx(x,y,z));if(bd.drop)add(bd.drop,bd.ore?2:1)}
// Shift + Ziehen: Bänder folgen der Zugrichtung; das vorige Band wird zum neuen hin ausgerichtet (Kurven).
let lastBeltPos=null;
function setBeltDir(b,d){b.dir=d;b.g.rotation.y=-d*Math.PI/2;slopesDirty=true;if(net.role==='host')netEmit({t:'bdir',i:idx(b.x,b.y,b.z),d})}
const keyOf=t=>t.items&&t.dir!==undefined?idx(t.x,t.y,t.z):t.cells[0];
function dragBelt(){const k=place.ox+','+place.oy+','+place.oz;if(k===lastBelt||place.err)return;
 let dir=null;const lp=lastBeltPos;
 if(lp){const dx=place.ox-lp.x,dz=place.oz-lp.z,dy=place.oy-lp.y;if(Math.abs(dx)+Math.abs(dz)===1&&Math.abs(dy)<=1){dir=DIRS.findIndex(([a,b])=>a===dx&&b===dz);
  const i=idx(lp.x,lp.y,lp.z);if(net.role==='client')netSend({t:'act',a:'bdir',i,d:dir});else{const lb=belts.get(i);if(lb)setBeltDir(lb,dir)}}}
 lastBelt=k;const pos={x:place.ox,y:place.oy,z:place.oz};tryPlace(dir??undefined);lastBeltPos=pos}

// ---------- Speichern / Laden ----------
function snapshot(){return{v:2,td:{day:td.day,t:+td.t.toFixed(4),wave:td.wave,hp:Math.round(td.hp),every:td.every,defeats:td.defeats,kills:td.kills,path:td.path,
  en:enemies.map(e=>[e.ty,+e.s.toFixed(2),Math.round(e.hp),Math.round(e.max)]),q:spawnQ.map(q=>q.ty)},seed,dv:1,changes:[...changes],res:[...reserves],inv,tier,gadgets,stats,goal,P:{x:P.x,y:P.y,z:P.z,yaw:P.yaw,pitch:P.pitch},
 machines:machines.map(m=>{const o={...m.outBuf};for(const it of m.tr)o[it.item]=(o[it.item]||0)+1;return{t:m.type,x:m.x,y:m.y,z:m.z,r:m.rot,i:m.inBuf,o,rc:m.recipe,ds:m.disp&&m.disp.some(Boolean)?m.disp:undefined,nm:m.name||undefined}}),
 belts:[...belts.values()].map(b=>[b.x,b.y,b.z,b.dir,b.items.map(i=>i.item)])}}
function save(){if(net.role==='client'){toast('Im Koop speichert der Host');return false}try{const data=snapshot();
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
function cleanTd(t){if(!t||typeof t!=='object')return null;const o={day:isInt(t.day,1,1e7)?t.day:1,t:isNum(t.t,0,.9999)?t.t:.08,wave:isInt(t.wave,0,1e6)?t.wave:0,
 hp:isNum(t.hp,0,TOWER_HP)?t.hp:TOWER_HP,every:WAVE_OPTS.includes(t.every)?t.every:2,defeats:isInt(t.defeats,0,1e7)?t.defeats:0,kills:isInt(t.kills,0,1e9)?t.kills:0,path:null,en:[],q:[]};
 const p=arr(t.path);if(p.length>=2&&p.length<=400&&p.every(q=>Array.isArray(q)&&isXZ(q[0])&&isInt(q[1],1,H-2)&&isXZ(q[2]))&&p.every((q,i)=>!i||Math.abs(q[0]-p[i-1][0])+Math.abs(q[2]-p[i-1][2])===1))o.path=p.map(q=>[q[0],q[1],q[2]]);
 for(const e of arr(t.en).slice(0,200))if(Array.isArray(e)&&own(ETYPES,e[0])&&isNum(e[1],0,400)&&isNum(e[2],1,1e7)&&isNum(e[3],1,1e7))o.en.push([e[0],e[1],Math.min(e[2],e[3]),e[3]]);
 for(const q of arr(t.q).slice(0,100))if(typeof q==='string'&&own(ETYPES,q))o.q.push(q);return o}
function cleanName(v){return String(v).replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,24)||'Barke'}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cleanBag(o,max){const r={};if(o&&typeof o==='object'&&!Array.isArray(o))for(const k of Object.keys(o))if(own(ITEMS,k)&&isInt(o[k],1,max))r[k]=o[k];return r}
function sanitize(d){
 if(!d||typeof d!=='object'||!isInt(d.seed,0,1e9))return null;
 // Spielstände vor der endlosen Welt (v1) nutzten Schlüssel x+z*128+y*16384 – umrechnen.
 const conv=d.v===2?(i=>isKey(i)?i:-1):(i=>isInt(i,0,128*64*128-1)?idx(i%128,Math.floor(i/16384),Math.floor(i/128)%128):-1);
 const o={seed:d.seed,dv:d.dv===1?1:0,changes:[],res:[],machines:[],belts:[]};
 for(const c of arr(d.changes))if(Array.isArray(c)&&isInt(c[1],0,NBL)){const k=conv(c[0]);if(k>=0&&kY(k)<H)o.changes.push([k,c[1]])}
 for(const c of arr(d.res))if(Array.isArray(c)&&isInt(c[1],1,RESERVE)){const k=conv(c[0]);if(k>=0)o.res.push([k,c[1]])}
 o.inv=cleanBag(d.inv,1e9);o.td=cleanTd(d.td);o.gadgets={radar:!!(d.gadgets&&d.gadgets.radar===true)};o.tier=isInt(d.tier,0,4)?d.tier:0;o.goal=isInt(d.goal,0,GOALS.length-1)?d.goal:0;
 const st=d.stats&&typeof d.stats==='object'?d.stats:{};o.stats={delivered:isInt(st.delivered,0,1e12)?st.delivered:0,produced:cleanBag(st.produced,1e12)};
 const p=d.P&&typeof d.P==='object'?d.P:{};o.P={};
 for(const[k,a,b]of[['x',-LIM,LIM],['y',-5,H+5],['z',-LIM,LIM],['yaw',-1e6,1e6],['pitch',-1.55,1.55]])if(isNum(p[k],a,b))o.P[k]=p[k];
 for(const m of arr(d.machines)){if(!m||typeof m!=='object'||!own(BUILD,m.t)||m.t==='belt')continue;
  if(!isXZ(m.x)||!isInt(m.y,1,H-1)||!isXZ(m.z)||!isInt(m.r,0,3))continue;
  const rs=RECIPES[m.t];o.machines.push({t:m.t,x:m.x,y:m.y,z:m.z,r:m.r,i:cleanBag(m.i,BUILD[m.t].store||999),o:cleanBag(m.o,999),rc:rs&&isInt(m.rc,0,rs.length-1)?m.rc:BUILD[m.t].miner&&isInt(m.rc,0,1)?m.rc:0,nm:BUILD[m.t].beacon&&typeof m.nm==='string'?cleanName(m.nm):undefined,ds:BUILD[m.t].store?(Array.isArray(m.ds)?m.ds.slice(0,3).map(dispOk):dispOk(m.ds)):null})}
 for(const b of arr(d.belts)){if(!Array.isArray(b)||!isXZ(b[0])||!isInt(b[1],1,H-1)||!isXZ(b[2])||!isInt(b[3],0,3))continue;
  o.belts.push([b[0],b[1],b[2],b[3],arr(b[4]).filter(k=>typeof k==='string'&&own(ITEMS,k)).slice(0,4)])}
 return o}
// Beim Laden: Gebäudezellen dürfen durch geänderte Weltgenerierung (z. B. Felsbrocken) belegt sein – natürliche Blöcke dann entfernen.
function clearFor(type,ox,oy,oz,rot){const cells=type==='belt'?[{x:ox,y:oy,z:oz}]:cellsOf(BUILD[type],ox,oy,oz,rot);
 for(const c of cells){if(!isXZ(c.x)||!isXZ(c.z)||c.y<1||c.y>=H)return false;const v=get(c.x,c.y,c.z);if(v===MACH||v===BELT)return false}
 for(const c of cells)if(get(c.x,c.y,c.z))setBlock(c.x,c.y,c.z,0,true);return true}
function fits(type,ox,oy,oz,rot){if(type==='belt')return isXZ(ox)&&isXZ(oz)&&oy>=1&&oy<H&&!get(ox,oy,oz);
 return cellsOf(BUILD[type],ox,oy,oz,rot).every(c=>isXZ(c.x)&&isXZ(c.z)&&c.y>=1&&c.y<H&&!get(c.x,c.y,c.z))}
function clearAll(){decay.clear();pathAirCols.clear();for(const e of enemies)scene.remove(e.g);enemies=[];spawnQ=[];for(const sh of shots)scene.remove(sh.mesh);shots=[];pathSet.clear();route=[];if(portal){scene.remove(portal);portal=null}for(const m of machines)scene.remove(m.g);for(const b of belts.values())scene.remove(b.g);machines=[];belts.clear();machineAt.clear();changes.clear();
 for(const c of cols.values())hideCol(c);cols.clear();changesByCol.clear();featCache.clear();reserves.clear();dirty.clear();buildType=null}
function newWorld(s,data){clearAll();seed=s;computeSpawn();td={day:1,t:.08,wave:0,hp:TOWER_HP,every:prefEvery(),defeats:0,kills:0,path:null};inv={};tier=0;gadgets={radar:false};stats={delivered:0,produced:{}};goal=0;
 P.x=64.5;P.z=64.5;P.y=surfaceH(64,64)+1;P.vy=0;P.yaw=0;P.pitch=-.15;
 if(data){if(data.td){const t=data.td;Object.assign(td,{day:t.day,t:t.t,wave:t.wave,hp:t.hp,every:t.every,defeats:t.defeats,kills:t.kills,path:t.path});buildPathIndex()}
  for(const[i,id]of data.changes)recordChange(i,id);for(const[i,r]of data.res)reserves.set(i,r);
  inv=data.inv||{};tier=data.tier||0;gadgets=data.gadgets||{radar:false};stats=data.stats||stats;goal=data.goal||0;Object.assign(P,data.P||{});
  for(const m of data.machines){if(!data.dv&&BUILD[m.t]&&BUILD[m.t].store&&!m.ds)m.ds='all';if(clearFor(m.t,m.x,m.y,m.z,m.r))createMachine(m.t,m.x,m.y,m.z,m.r,m)}
  for(const b of data.belts)if(clearFor('belt',b[0],b[1],b[2],b[3]))createMachine('belt',b[0],b[1],b[2],b[3],b[4])}
 if(data&&data.td){const t=data.td;
  if(td.path){for(const[ty,sv,hp,mx]of t.en){const e=spawnEnemy(ty,mx,0,Math.min(sv,route.length-1));e.hp=hp}spawnQ=t.q.map((ty,i)=>({ty,t:i*1.6}));waveT=0}}
 if(!data){placeBaseTower();const tw=machines.find(m=>m.type==='tower');if(tw){makePath(tw);placeStarterBallista()}}
 stream(0,250);dirty.clear();renderHotbar();renderGoal()}
// Neues Spiel: Basisturm steht schon (3×3, 15 hoch) nordöstlich des Startpunkts, Fundament wird aufgefüllt.
function placeBaseTower(ox=69,oz=57){let top=0;for(let x=ox;x<ox+3;x++)for(let z=oz;z<oz+3;z++)top=Math.max(top,surfaceH(x,z));const y=top+1;
 for(let x=ox;x<ox+3;x++)for(let z=oz;z<oz+3;z++){for(let yy=surfaceH(x,z)+1;yy<y;yy++)setBlock(x,yy,z,3,true);for(let yy=y;yy<y+15&&yy<H;yy++)if(get(x,yy,z))setBlock(x,yy,z,0,true)}
 createMachine('tower',ox,y,oz,2)}

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
 tmpM.makeTranslation(b.x+.5+dx*(it.p-.5),b.y+.27+(b.s===1?it.p:b.s===-1?1-it.p:0),b.z+.5+dz*(it.p-.5));itemMesh.setMatrixAt(n,tmpM);itemMesh.setColorAt(n,itemCol[it.item]);n++}}
 for(const m of machines){const def=BUILD[m.type];if(def.router){m.tr.forEach((it,k)=>{if(n>=4000)return;tmpM.makeTranslation(m.x+.5,m.y+.75+k*.32,m.z+.5);itemMesh.setMatrixAt(n,tmpM);itemMesh.setColorAt(n,itemCol[it.item]);n++});continue}
  if(!def.bridge)continue;const travel=def.d/BS;
  const list=m.tr.map(it=>[it.item,Math.min(1,it.t/travel)]);for(const k in m.outBuf)list.push([k,1]);
  for(const[item,f]of list){if(n>=4000)break;const[py,pz]=bridgePath(def,f);tmpV.set(0,py,pz);m.g.localToWorld(tmpV);
   tmpM.makeTranslation(tmpV.x,tmpV.y,tmpV.z);itemMesh.setMatrixAt(n,tmpM);itemMesh.setColorAt(n,itemCol[item]);n++}}
 itemMesh.count=n;itemMesh.instanceMatrix.needsUpdate=true;if(itemMesh.instanceColor)itemMesh.instanceColor.needsUpdate=true}

// ---------- Tag/Nacht und Turmverteidigung ----------
// Ein Tag = 12 min (t 0..1, 0 = 6:00, Nacht ab t=0.65 = 19:00). Angriffe zur Nacht alle td.every Tage über den festen Pfad.
const DAYLEN=720,NIGHT=.65,TOWER_HP=1000,WAVE_OPTS=[0,1,2,3,5,7];
const pathAirCols=new Map();let td={day:1,t:.08,wave:0,hp:TOWER_HP,every:2,defeats:0,kills:0,path:null},route=[],pathSet=new Set(),enemies=[],spawnQ=[],shots=[],enemyId=1,portal=null,waveT=0;
const ETYPES={walker:{n:'Läufer',hp:30,sp:2.2,dps:6,col:0xc0392b,sc:1},brute:{n:'Brocken',hp:140,sp:1.2,dps:18,col:0x6c3483,sc:1.45},runner:{n:'Flitzer',hp:18,sp:4.2,dps:3,col:0xe6b800,sc:.75}};
const hpMul=n=>1+.3*(n-1)+.02*(n-1)**2;
function waveList(n){const cnt=Math.min(45,4+n*2),l=[];for(let i=0;i<cnt;i++){let ty='walker';if(n>=5&&i%3===1)ty='runner';if(n>=3&&i%4===3)ty='brute';l.push(ty)}return l}
const isNight=t=>t>=NIGHT;
function lightLevel(t){if(t<.05)return .22+.78*sstep(0,.05,t);if(t<.6)return 1;if(t<.68)return 1-.78*sstep(.6,.68,t);return .22}
function clockStr(t){const h=t<NIGHT?6+t/NIGHT*13:19+(t-NIGHT)/(1-NIGHT)*11;const hh=Math.floor(h)%24,mm=Math.floor((h%1)*60);return String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')}
const DAYSKY=new THREE.Color(0x9fd4f5),NIGHTSKY=new THREE.Color(0x0b1426),skyCol=new THREE.Color();
function applyLight(){const k=(lightLevel(td.t)-.22)/.78;skyCol.copy(NIGHTSKY).lerp(DAYSKY,k);scene.background.copy(skyCol);scene.fog.color.copy(skyCol);
 terrainMat.color.setScalar(.33+.67*k);hemi.intensity=.22+.58*k;sun.intensity=.08+.57*k;const a=td.t*Math.PI*2;sun.position.set(Math.cos(a)*.8,.35+Math.max(0,Math.sin(a+.4)),.3)}
// Fester Pfad: vom Turm nach Norden mit Seitenschwenks, 3 breit, Höhe geglättet (max ±1 je Feld). Pfadstein ist unzerstörbar.
function makePath(t){const rnd=mulberry(hashI(t.x,t.z,777));let x=t.x+1,z=t.z-2;const pts=[[x,z]];let dir=2;
 while(pts.length<95){const len=dir===2?6+Math.floor(rnd()*9):3+Math.floor(rnd()*6);for(let i=0;i<len&&pts.length<95;i++){x+=DIRS[dir][0];z+=DIRS[dir][1];pts.push([x,z])}dir=dir===2?(rnd()<.5?1:3):2}
 let hs=pts.map(([px,pz])=>surfaceH(px,pz));hs=hs.map((_,i)=>{let a=0,n=0;for(let j=i-3;j<=i+3;j++)if(hs[j]!==undefined){a+=hs[j];n++}return Math.round(a/n)});
 hs[0]=t.y-1;for(let i=1;i<hs.length;i++)hs[i]=Math.max(hs[i-1]-1,Math.min(hs[i-1]+1,hs[i]));
 const path=pts.map(([px,pz],i)=>[px,Math.max(2,Math.min(H-8,hs[i])),pz]);
 // Jede Pfadzelle bekommt genau eine Höhe: Mittellinie hat Vorrang, Randzellen nehmen die niedrigste angrenzende Höhe.
 const cellH=new Map(),ck=(x,z)=>x+','+z;
 for(const[px,py,pz]of path)for(let ax=-1;ax<=1;ax++)for(let az=-1;az<=1;az++){const k=ck(px+ax,pz+az);if(!cellH.has(k)||cellH.get(k)[2]>py)cellH.set(k,[px+ax,pz+az,py])}
 for(const[px,py,pz]of path)cellH.set(ck(px,pz),[px,pz,py]);
 for(const[cx,cz,py]of cellH.values()){if(machineAt.has(idx(cx,py,cz))||machineAt.has(idx(cx,py+1,cz))||belts.has(idx(cx,py,cz)))continue;
  for(let yy=py-1;yy>0&&!solidId(get(cx,yy,cz));yy--)setBlock(cx,yy,cz,3,true);
  setBlock(cx,py,cz,25,true);for(let yy=py+1;yy<=py+4&&yy<H;yy++){const v=get(cx,yy,cz);if(v&&v!==MACH&&v!==BELT)setBlock(cx,yy,cz,0,true)}}
 td.path=path;buildPathIndex()}
// Neues Spiel: eine Balliste steht schon neben dem Pfad, nahe am Turm.
function placeStarterBallista(){if(!td.path)return;
 for(const i of[10,12,8,14,6,16])for(const side of[1,-1])for(let off=3;off<=5;off++){const p=td.path[i];const x=p[0]+side*off,z=p[2],y=Math.max(p[1]+1,surfaceH(x,z)+1);
  let ok=y+2<H;for(let ax=-1;ax<=1&&ok;ax++)for(let az=-1;az<=1&&ok;az++)for(let yy=y-1;yy<=y+2;yy++)if(pathSet.has(idx(x+ax,yy,z+az)))ok=false;
  for(let yy=y-1;yy<=y+2&&ok;yy++){const v=get(x,yy,z);if(v===MACH||v===BELT)ok=false}if(!ok)continue;
  for(let yy=y-1;yy>0&&!solidId(get(x,yy,z));yy--)setBlock(x,yy,z,3,true);for(let yy=y;yy<=y+2;yy++)if(get(x,yy,z))setBlock(x,yy,z,0,true);
  createMachine('ballista',x,y,z,0);return true}return false}
function buildPathIndex(){pathSet.clear();pathAirCols.clear();route=[];if(portal){scene.remove(portal);portal=null}if(!td.path)return;
 for(const[px,py,pz]of td.path)for(let ax=-1;ax<=1;ax++)for(let az=-1;az<=1;az++)for(let yy=py-1;yy<=py+4;yy++){const k=idx(px+ax,yy,pz+az);pathSet.add(k);
  if(yy>py){const ck=colKey((px+ax)>>4,(pz+az)>>4);let a=pathAirCols.get(ck);if(!a)pathAirCols.set(ck,a=[]);a.push(k)}}
 // Bereits geladene Spalten nachträglich freiräumen (sonst hängt das Ergebnis von der Ladereihenfolge ab)
 for(const[ck,l]of pathAirCols){const c=cols.get(ck);if(!c)continue;for(const i of l){const p=(kX(i)&15)|((kZ(i)&15)<<4)|(kY(i)<<8);if(c.d[p]&&c.d[p]!==25&&c.d[p]!==MACH&&c.d[p]!==BELT){c.d[p]=0;c.ore=null;markDirty(kX(i),kY(i),kZ(i))}}}
 route=td.path.slice().reverse().map(([px,py,pz])=>({x:px+.5,y:py+1,z:pz+.5}));
 const p=route[0],g=new THREE.Group();g.position.set(p.x,p.y,p.z);const n=route[1];g.rotation.y=Math.atan2(n.x-p.x,n.z-p.z);
 bx(g,M(0x2b2140),.5,3.2,.5,-1.6,0,0);bx(g,M(0x2b2140),.5,3.2,.5,1.6,0,0);bx(g,M(0x2b2140),3.7,.5,.5,0,3.2,0);
 const pl=new THREE.Mesh(BOX,new THREE.MeshBasicMaterial({color:0x9b4dff,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));pl.scale.set(2.7,3.1,.1);pl.position.y=1.6;g.add(pl);portal=g;portal.userData.pl=pl;scene.add(g)}
function routePos(s){const L=route.length-1,i=Math.max(0,Math.min(L-1,Math.floor(s))),f=Math.min(1,s-i),a=route[i],b=route[i+1];
 return{x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,z:a.z+(b.z-a.z)*f,yaw:Math.atan2(b.x-a.x,b.z-a.z)}}
function enemyModel(ty){const E=ETYPES[ty],g=new THREE.Group(),b=new THREE.Group(),s=E.sc;g.add(b);
 bx(b,M(E.col),.6*s,.7*s,.45*s,0,.55*s,0);bx(b,M(0x23272c),.45*s,.4*s,.4*s,0,1.25*s,0);
 bx(b,M(0xffe14d,1),.1*s,.08*s,.03,-.1*s,1.45*s,.2*s);bx(b,M(0xffe14d,1),.1*s,.08*s,.03,.1*s,1.45*s,.2*s);
 const l1=bx(b,M(0x33373c),.18*s,.55*s,.2*s,-.15*s,0,0),l2=bx(b,M(0x33373c),.18*s,.55*s,.2*s,.15*s,0,0);
 const bar=new THREE.Group();bar.position.y=1.95*s;const bg=new THREE.Mesh(BOX,M(0x23272c));bg.scale.set(.9,.1,.02);bar.add(bg);
 const fg=new THREE.Mesh(BOX,M(0x5fcf6f,1));fg.scale.set(.88,.07,.03);fg.position.z=.01;bar.add(fg);g.add(bar);scene.add(g);return{g,b,l1,l2,bar,fg}}
function spawnEnemy(ty,hp,id,s){const e={id:id||enemyId++,ty,s:s||0,hp,max:hp,ph:Math.random()*6,...enemyModel(ty)};enemies.push(e);return e}
function removeEnemy(e,fx){scene.remove(e.g);const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1);if(fx&&e.pos)for(let k=0;k<4;k++)emit(new THREE.Vector3(e.pos.x,e.pos.y+.6,e.pos.z),'dark')}
// Countdown 30 s vor einer Welle, rechts groß eingeblendet
let waveAlarm=0,wtLast='';
function updateWaveTimer(dt){const el=$('wavetimer');let html='',cls='';
 const left=(NIGHT-td.t)*DAYLEN;
 if(td.path&&td.every>0&&td.day%td.every===0&&!isNight(td.t)&&left<=30){const s=Math.ceil(left);
  html=`<small>Angriff in</small><b>0:${String(s).padStart(2,'0')}</b><small>Welle ${td.wave+1}</small>`;cls=s<=10?'on hot':'on';waveAlarm=0}
 else if(waveAlarm>0){waveAlarm-=dt;html=`<b>Angriff!</b><small>Welle ${td.wave}</small>`;cls='on hot'}
 const key=cls+html;if(key!==wtLast){wtLast=key;el.innerHTML=html;el.className=cls}}
function startWave(){waveAlarm=4;td.wave++;spawnQ=waveList(td.wave).map((ty,i)=>({ty,t:i*1.6}));waveT=0;toast('Angriff! Welle '+td.wave+' – '+spawnQ.length+' Gegner')}
function baseFallen(){for(const e of[...enemies])removeEnemy(e,true);spawnQ=[];td.hp=TOWER_HP/2;td.defeats++;toast('Die Basis ist gefallen! Der Turm steht wieder mit halber Kraft.')}
function damageEnemy(e,d){e.hp-=d;if(e.pos)emit(new THREE.Vector3(e.pos.x,e.pos.y+.8,e.pos.z),'spark');
 if(e.hp<=0){removeEnemy(e,true);td.kills++;const r=['iron_ore','copper_ore','coal'][Math.floor(Math.random()*3)];add(r,1+(Math.random()<.3?1:0));renderHotbar()}}
const shotMat={bolt:new THREE.MeshLambertMaterial({color:0x8a5a2b}),bullet:new THREE.MeshBasicMaterial({color:0xffd24a}),laser:new THREE.MeshBasicMaterial({color:0xff3b6b,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false})};
function fire(m,e,T){const mz=m.a.muzzle||[0,1,0],from={x:m.x+m.rw/2,y:m.y+mz[1],z:m.z+m.rd/2},p=e.pos,dist=Math.hypot(p.x-from.x,p.y+.8-from.y,p.z-from.z);
 const mesh=new THREE.Mesh(BOX,shotMat[T.kind]);if(T.kind==='bolt')mesh.scale.set(.07,.07,.6);else if(T.kind==='bullet')mesh.scale.set(.08,.08,.35);scene.add(mesh);
 shots.push({id:e.id,from,dmg:T.dmg,t:0,dur:T.kind==='laser'?.09:Math.max(.05,dist/T.spd),kind:T.kind,mesh})}
const lookV=new THREE.Vector3();
function updateShots(dt,client){for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.t+=dt;const e=enemies.find(q=>q.id===s.id);
 if(!e||!e.pos){scene.remove(s.mesh);shots.splice(i,1);continue}const tx=e.pos.x,ty=e.pos.y+.8*ETYPES[e.ty].sc,tz=e.pos.z,f=Math.min(1,s.t/s.dur);
 if(s.kind==='laser'){const mx=(s.from.x+tx)/2,my=(s.from.y+ty)/2,mz=(s.from.z+tz)/2,len=Math.hypot(tx-s.from.x,ty-s.from.y,tz-s.from.z);s.mesh.position.set(mx,my,mz);s.mesh.scale.set(.07,.07,len);s.mesh.lookAt(lookV.set(tx,ty,tz))}
 else{s.mesh.position.set(s.from.x+(tx-s.from.x)*f,s.from.y+(ty-s.from.y)*f,s.from.z+(tz-s.from.z)*f);s.mesh.lookAt(lookV.set(tx,ty,tz))}
 if(s.t>=s.dur){scene.remove(s.mesh);shots.splice(i,1);if(!client)damageEnemy(e,s.dmg)}}}
function updateTurrets(dt,client){for(const m of machines){const T=BUILD[m.type].turret;if(!T)continue;m.cd=(m.cd||0)-dt;
 const cx=m.x+m.rw/2,cz=m.z+m.rd/2,cy=m.y+(m.a.muzzle?m.a.muzzle[1]:1);let best=null;
 for(const e of enemies){if(!e.pos)continue;const d=Math.hypot(e.pos.x-cx,e.pos.y+.8-cy,e.pos.z-cz);if(d<=T.range&&(!best||e.s>best.s))best=e}
 m.working=!!best;if(m.a.head&&best)m.a.head.rotation.y=Math.atan2(best.pos.x-cx,best.pos.z-cz)-m.g.rotation.y;
 if(!best){m.status=T.ammo&&!(m.inBuf[T.ammo]>0)?'Keine Munition':'Bereit';continue}if(m.cd>0)continue;
 if(T.ammo){if(!(m.inBuf[T.ammo]>0)){m.status='Keine Munition';continue}if(!client){m.inBuf[T.ammo]--;if(!m.inBuf[T.ammo])delete m.inBuf[T.ammo]}}
 m.cd=T.cd;m.status='Feuert';fire(m,best,T)}}
function updateEnemies(dt,client){const L=route.length-1;for(const e of[...enemies]){const E=ETYPES[e.ty];
 if(e.s<L)e.s=Math.min(L,e.s+E.sp*dt);else if(!client)td.hp-=E.dps*dt;
 const p=routePos(e.s);e.pos=p;e.ph+=dt*E.sp*3;const atk=e.s>=L;
 e.g.position.set(p.x,p.y+(atk?0:Math.abs(Math.sin(e.ph))*.06),p.z);e.g.rotation.y=p.yaw;e.b.rotation.x=atk?Math.sin(e.ph*2)*.35:0;
 e.l1.rotation.x=atk?0:Math.sin(e.ph)*.6;e.l2.rotation.x=-e.l1.rotation.x;
 e.bar.rotation.y=P.yaw-e.g.rotation.y;const f=Math.max(0,e.hp/e.max);e.fg.scale.x=.88*f;e.fg.position.x=-.44*(1-f)}}
function tdUpdate(dt){const client=net.role==='client',wasN=isNight(td.t);td.t+=dt/DAYLEN;if(td.t>=1){td.t-=1;td.day++;toast('Tag '+td.day+' beginnt')}
 applyLight();if(portal)portal.userData.pl.material.opacity=.45+Math.sin(time*3)*.15;
 if(!td.path)return;const nowN=isNight(td.t);
 if(client&&nowN&&!wasN&&td.every>0&&td.day%td.every===0)waveAlarm=4;
 if(!client){if(nowN&&!wasN&&td.every>0&&td.day%td.every===0)startWave();
  if(spawnQ.length){waveT+=dt;while(spawnQ.length&&spawnQ[0].t<=waveT){const q=spawnQ.shift();spawnEnemy(q.ty,Math.round(ETYPES[q.ty].hp*hpMul(td.wave)))}}
  if(!nowN&&!enemies.length)td.hp=Math.min(TOWER_HP,td.hp+dt*1.2)}
 updateEnemies(dt,client);updateTurrets(dt,client);updateShots(dt,client);
 updateWaveTimer(dt);
 if(!client&&td.hp<=0)baseFallen()}
function nextAttackText(){if(!td.path)return'';if(td.every<=0)return'Angriffe aus';if(enemies.length||spawnQ.length)return'Angriff läuft: '+(enemies.length+spawnQ.length)+' Gegner';
 let d=td.day;if(isNight(td.t)||d%td.every!==0){d=d+1;while(d%td.every!==0)d++}const n=d-td.day;return'Nächster Angriff: '+(n===0?'heute Nacht':n===1?'morgen Nacht':'in '+n+' Tagen')+' (Welle '+(td.wave+1)+')'}
function updateTdHud(){const el=$('tdhud');const night=isNight(td.t);
 const hpP=Math.max(0,Math.round(td.hp/TOWER_HP*100));
 el.innerHTML=`<span><b>Tag ${td.day}</b> · ${clockStr(td.t)} ${night?'· <span class="nt">Nacht</span>':''}</span>`+(td.path?`<span class="bh">Basis <i><u style="width:${hpP}%;background:${hpP>50?'#5fcf6f':hpP>25?'#f29a2e':'#ef5a4c'}"></u></i> ${hpP}%</span><span class="na">${nextAttackText()}</span>`:'')}

// ---------- Kompass oben: Himmelsrichtungen + Marker für Basis und Barken ----------
// Norden = −z (Blickrichtung beim Start), Osten = +x. Sichtbereich ±90°.
const CDIR=[[0,'N'],[45,'NO'],[90,'O'],[135,'SO'],[180,'S'],[225,'SW'],[270,'W'],[315,'NW']];
const wrap180=a=>((a+540)%360)-180;
function updateCompass(){const el=$('cstrip');const W=el.clientWidth||520,half=W/2;
 const head=(Math.atan2(-Math.sin(P.yaw),Math.cos(P.yaw))*180/Math.PI+360)%360;
 let h='';for(let a=0;a<360;a+=15){const r=wrap180(a-head);if(Math.abs(r)>92)continue;const x=half+r/90*half,lab=CDIR.find(c=>c[0]===a);
  h+=lab?`<span class="ct big${lab[1]==='N'?' n':''}" style="left:${x.toFixed(1)}px">${lab[1]}</span>`:`<span class="ct" style="left:${x.toFixed(1)}px">|</span>`}
 const marks=[];for(const m of machines){const d=BUILD[m.type];if(d.fixed)marks.push([m.x+1.5,m.z+1.5,'Basis','base']);else if(d.beacon)marks.push([m.x+.5,m.z+.5,m.name,'bk'])}
 for(const[tx,tz,name,cls]of marks){const dx=tx-P.x,dz=tz-P.z,dist=Math.hypot(dx,dz),b=(Math.atan2(dx,-dz)*180/Math.PI+360)%360,r=wrap180(b-head);
  const edge=Math.abs(r)>90,x=edge?(r<0?8:W-8):half+r/90*half;
  h+=`<span class="cm ${cls}${edge?' edge':''}" style="left:${x.toFixed(1)}px">${edge?(r<0?'◀':'▶'):'▼'}<b>${esc(name)}</b><i>${dist<1000?Math.round(dist)+' m':(dist/1000).toFixed(1)+' km'}</i></span>`}
 el.innerHTML=h}

// ---------- Erzradar (F): Richtung zum nächsten Block der gewählten Erzart ----------
const RADAR=[7,8,9,10,11,20,21],RADAR_R=10;let radarSel=-1,radarT=0,radarHit=null;
try{const raw=localStorage.getItem('satiscraft-radar');const v=raw===null?-1:+raw;if(Number.isInteger(v)&&v>=-1&&v<RADAR.length)radarSel=v}catch(e){}
function oreIndex(c){if(c.ore)return c.ore;const o={};for(let p=0;p<c.d.length;p++){const v=c.d[p];if(BL[v]&&BL[v].ore)(o[v]||(o[v]=[])).push(p)}return c.ore=o}
function radarScan(){radarHit=null;if(radarSel<0)return;const id=RADAR[radarSel],ex=P.x,ey=P.y+1.6,ez=P.z,pcx=Math.floor(ex)>>4,pcz=Math.floor(ez)>>4;let best=Infinity,gen=0;
 const ring=[];for(let dx=-RADAR_R;dx<=RADAR_R;dx++)for(let dz=-RADAR_R;dz<=RADAR_R;dz++)if(dx*dx+dz*dz<=RADAR_R*RADAR_R)ring.push([dx,dz]);ring.sort((a,b)=>a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]);
 for(const[dx,dz]of ring){const cx=pcx+dx,cz=pcz+dz,x0=cx*16,z0=cz*16;
  const nx=Math.max(x0,Math.min(ex,x0+16))-ex,nz=Math.max(z0,Math.min(ez,z0+16))-ez;if(nx*nx+nz*nz>=best)continue;
  let c=cols.get(colKey(cx,cz));if(!c){if(gen>=3)continue;c=genCol(cx,cz);gen++}
  const l=oreIndex(c)[id];if(!l)continue;
  for(const p of l){const x=x0+(p&15)+.5,z=z0+((p>>4)&15)+.5,y=(p>>8)+.5,d=(x-ex)**2+(y-ey)**2+(z-ez)**2;if(d<best){best=d;radarHit={x,y,z,d:Math.sqrt(d)}}}}}
function updateRadar(dt){const el=$('radar');if(radarSel<0||!gadgets.radar){el.style.display='none';return}el.style.display='flex';
 radarT-=dt;if(radarT<=0){radarT=.3;radarScan()}const id=RADAR[radarSel],bd=BL[id];
 $('rname').textContent=bd.n.replace('vorkommen','');$('rdot').style.background=ITEMS[bd.drop][1];
 if(!radarHit){$('rinfo').textContent='Nicht im Umkreis ('+RADAR_R*16+' m)';$('rarrow').style.opacity=.25;return}
 const dx=radarHit.x-P.x,dz=radarHit.z-P.z,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);
 const ang=Math.atan2(dx*rx+dz*rz,dx*fx+dz*fz),dy=Math.round(radarHit.y-(P.y+1));
 $('rarrow').style.opacity=1;$('rarrow').style.transform=`rotate(${ang}rad)`;
 $('rinfo').textContent=`${Math.round(radarHit.d)} m · ${dy>1?'▲ '+dy+' höher':dy<-1?'▼ '+(-dy)+' tiefer':'gleiche Höhe'}${bd.tier>tier?' · braucht '+TOOLS[bd.tier].n:''}`}
function cycleRadar(back){if(!gadgets.radar)return toast('Erzradar zuerst an der Werkbank herstellen (4 Kupferbarren, 2 Eisenbarren)');radarSel=back?(radarSel<=-1?RADAR.length-1:radarSel-1):(radarSel>=RADAR.length-1?-1:radarSel+1);radarT=0;
 try{localStorage.setItem('satiscraft-radar',String(radarSel))}catch(e){}toast(radarSel<0?'Erzradar aus':'Erzradar: '+BL[RADAR[radarSel]].n.replace('vorkommen',''))}

// ---------- Eigene Hand / Werkzeug (Ich-Perspektive, eigener Render-Durchgang über der Welt) ----------
renderer.autoClear=false;
const viewScene=new THREE.Scene(),viewCam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.01,10);
viewScene.add(new THREE.HemisphereLight(0xf2f6ff,0x5a5048,.85));{const l=new THREE.DirectionalLight(0xffffff,.55);l.position.set(-1,2,1.5);viewScene.add(l)}
const vmPivot=new THREE.Group();vmPivot.position.set(.42,-.5,-.32);viewScene.add(vmPivot);
let vmKey='',vmSwing=0,vmBob=0,vmPunch=0,vmEquip=0;
const TOOLCOL=[null,0xa0703f,0x8d9094,0xd0d4d8,0x52677c];
function vb(g,c,w,h,d,x,y,z,e){const me=new THREE.Mesh(BOX,new THREE.MeshLambertMaterial({color:c,emissive:e?c:0,emissiveIntensity:e?.6:0}));me.scale.set(w,h,d);me.position.set(x,y,z);g.add(me);return me}
function buildViewModel(key){vmPivot.clear();const sleeve=net.role==='solo'?PCOL[0]:PCOL[net.id];
 vb(vmPivot,sleeve,.17,.17,.5,0,0,-.22);vb(vmPivot,0x33373c,.18,.05,.18,0,0,-.47);vb(vmPivot,0xe0b48c,.15,.15,.16,0,0,-.57);
 const hold=new THREE.Group();hold.position.set(0,.03,-.6);vmPivot.add(hold);
 if(buildType){hold.position.set(-.1,.14,-.6);hold.rotation.set(1.05,.3,-.1);vb(hold,0x23272c,.32,.022,.24,0,.06,-.02);vb(hold,0x3d78c2,.27,.006,.19,0,.075,-.02,1);
  vb(hold,0xf29a2e,.12,.008,.04,-.05,.08,-.06,1);vb(hold,0xf29a2e,.04,.008,.08,.06,.08,.02,1)}
 else if(tier>0){hold.rotation.set(-.55,0,-.42);hold.scale.setScalar(.72);vb(hold,0x7a5232,.045,.62,.045,0,.16,0);const hc=TOOLCOL[tier];
  vb(hold,hc,.46,.075,.075,0,.45,0);const l=vb(hold,hc,.16,.06,.06,-.27,.41,0);l.rotation.z=.45;const r=vb(hold,hc,.16,.06,.06,.27,.41,0);r.rotation.z=-.45;
  if(tier===4){vb(hold,0x9fd4ff,.06,.08,.08,0,.45,0,1)}}
 else{vb(vmPivot,0xd8a77f,.16,.07,.08,0,.03,-.62)} // Faust
 vmEquip=1}
function updateViewModel(dt){
 const key=(buildType?'b':'t'+tier)+'|'+net.role+net.id;if(key!==vmKey){vmKey=key;buildViewModel(key)}
 vmPivot.visible=locked&&!panel;
 const mining=locked&&mouseL&&!buildType&&hl.visible;
 if(mining)vmSwing+=dt*11;else vmSwing=vmSwing%(Math.PI*2)>0.05?vmSwing+dt*11:0;
 if(vmSwing>=Math.PI*2&&!mining)vmSwing=0;
 const moving=locked&&P.ground&&(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD);vmBob+=dt*(moving?(keys.ShiftLeft||keys.ShiftRight?13:9):0);
 if(vmPunch>0)vmPunch=Math.max(0,vmPunch-dt);if(vmEquip>0)vmEquip=Math.max(0,vmEquip-dt*4);
 const sw=Math.sin(vmSwing)*(vmSwing?1:0),pu=Math.sin(vmPunch/.3*Math.PI);
 vmPivot.position.set(.5+Math.cos(vmBob)*.018,-.52+Math.abs(Math.sin(vmBob))*.025-vmEquip*.35-Math.max(0,sw)*.05,-.32-pu*.08);
 vmPivot.rotation.set(.1-Math.max(0,sw)*1.05-pu*.4,.05+sw*.1,0)}

// ---------- Hauptschleife ----------
let lastBiome=-1,last=performance.now(),slow=0,saveT=0,time=0;
// ---------- Leistungsdiagnose (F3: aus → FPS → Details) ----------
let perfMode=(()=>{try{return+localStorage.getItem('satiscraft-perf')||0}catch(e){return 0}})()%3;
const perf={hist:new Float32Array(240),hi:0,sec:{},acc:{},n:0,t0:0,last:0,secT:0,fps:0,low:0,max:0,js:0,show:{},cnt:0};
renderer.info.autoReset=false;
function cyclePerf(){perfMode=(perfMode+1)%3;try{localStorage.setItem('satiscraft-perf',perfMode)}catch(e){}$('perf').style.display=perfMode?'block':'none';perf.secT=1}
function perfStart(fdt){if(!perfMode)return;perf.hist[perf.hi]=fdt;perf.hi=(perf.hi+1)%240;perf.t0=perf.last=performance.now();perf.cnt++;perf.secT+=fdt/1000}
function pm(name){if(perfMode<2)return;const t=performance.now();perf.acc[name]=(perf.acc[name]||0)+(t-perf.last);perf.last=t}
function perfEnd(){if(!perfMode)return;perf.js+=performance.now()-perf.t0;if(perf.secT<.5)return;
 const a=[...perf.hist].filter(v=>v>0).sort((x,y)=>x-y),n=a.length,avg=a.reduce((x,y)=>x+y,0)/Math.max(1,n);
 perf.fps=1000/avg;perf.low=1000/(a[Math.floor(n*.99)]||avg);perf.max=a[n-1]||0;
 const js=perf.js/perf.cnt,sec={};for(const k in perf.acc)sec[k]=perf.acc[k]/perf.cnt;perf.acc={};perf.js=0;perf.cnt=0;perf.secT=0;renderPerf(avg,js,sec)}
function renderPerf(avg,js,sec){const el=$('perf'),col=perf.fps>=55?'ok':perf.fps>=30?'warn':'bad';
 let h=`<div class="pf ${col}"><b>${perf.fps.toFixed(0)}</b> FPS <span class="mut">· ${avg.toFixed(1)} ms · 1%-Tief ${perf.low.toFixed(0)} FPS</span></div>`;
 if(perfMode===2){const ri=renderer.info,gpu=Math.max(0,avg-js);
  let loaded=0,meshes=0;for(const c of cols.values()){loaded++;for(const m of c.m)if(m)meshes++}
  const items=[...belts.values()].reduce((x,b)=>x+b.items.length,0),pts=parts.filter(p=>p.life>0).length;
  const rows=Object.entries(sec).sort((x,y)=>y[1]-x[1]);const mx=Math.max(1,...rows.map(r=>r[1]));
  h+=`<canvas id="pfg" width="240" height="44"></canvas><table>`+rows.map(([k,v])=>`<tr><td>${k}</td><td class="r">${v.toFixed(2)} ms</td><td><i style="width:${Math.round(v/mx*60)}px"></i></td></tr>`).join('')+
   `<tr class="sum"><td>JavaScript gesamt</td><td class="r">${js.toFixed(2)} ms</td><td></td></tr><tr><td>Rest (GPU, Browser, Warten)</td><td class="r">${gpu.toFixed(1)} ms</td><td></td></tr></table>`+
   `<div class="mut">Draw Calls ${ri.render.calls} · Dreiecke ${(ri.render.triangles/1000).toFixed(0)}k · Geometrien ${ri.memory.geometries}<br>Spalten ${loaded} · Chunk-Meshes ${meshes} · Warteschlange ${dirty.size}<br>Gebäude ${machines.length} · Bänder ${belts.size} · Items auf Bändern ${items}<br>Gegner ${enemies.length} · Partikel ${pts} · Sichtweite ${RD} · Auflösung ${renderer.domElement.width}×${renderer.domElement.height}`+
   (performance.memory?` · JS-Speicher ${(performance.memory.usedJSHeapSize/1048576).toFixed(0)} MB`:'')+`</div>`;
  // Einschätzung: größter Verbraucher + Tipp
  const top=rows[0]||['',0],tips=[];
  if(perf.fps<50){if(gpu>js&&gpu>8)tips.push('Grafikkarten-limitiert: Sichtweite senken oder Fenster verkleinern. Hardwarebeschleunigung im Browser prüfen.');
   if(top[0]==='Weltgenerierung'&&top[1]>3)tips.push('Neue Welt wird geladen. Das legt sich, sobald du stehst. Niedrigere Sichtweite hilft.');
   if(top[0]==='Fabrik & Bänder'||top[0]==='Band-Items')tips.push('Die Fabrik ist teuer: viele Bänder/Items. Volle Bänder entlasten.');
   if(top[0]==='Chunk-Meshes')tips.push('Viele Blockänderungen werden neu aufgebaut.');
   if(top[0]==='Animation & Partikel')tips.push('Viele arbeitende Gebäude erzeugen Partikel.');
   if(ri.render.calls>1500)tips.push('Sehr viele Draw Calls ('+ri.render.calls+') – Sichtweite senken.');
   if(perf.max>100)tips.push('Einzelne Ruckler bis '+perf.max.toFixed(0)+' ms (z. B. Speichern, Weltladen).')}
  h+=tips.length?`<div class="tip">${tips.map(esc).join('<br>')}</div>`:'';h+='<div class="mut">F3: weiter / aus</div>'}
 el.innerHTML=h;
 if(perfMode===2){const c=$('pfg'),x=c.getContext('2d');x.clearRect(0,0,240,44);x.strokeStyle='#ffffff22';[16.7,33.3].forEach(v=>{const y=44-v;x.beginPath();x.moveTo(0,y);x.lineTo(240,y);x.stroke()});
  for(let i=0;i<240;i++){const v=perf.hist[(perf.hi+i)%240];x.fillStyle=v>33.4?'#ef5a4c':v>17.5?'#e8b04a':'#5fcf6f';x.fillRect(i,44-Math.min(44,v),1,Math.min(44,v))}}}
$('perf').style.display=perfMode?'block':'none';
function frame(now){
 requestAnimationFrame(frame);const fdt=now-last;let dt=Math.min(.05,fdt/1000);last=now;time+=dt;perfStart(fdt);
 if(locked)movePlayer(dt);
 camera.position.set(P.x,P.y+1.62,P.z);camera.rotation.y=P.yaw;camera.rotation.x=P.pitch;
 pm('Spieler');if(slopesDirty)updateSlopes();for(const m of machines)tickMachine(m,dt);updateBelts(dt);pm('Fabrik & Bänder');drawItems();beltTex.offset.y=(beltTex.offset.y+BS*dt)%1;pm('Band-Items');
 for(const m of machines){const a=m.a;if(m.pulse>0)m.pulse=Math.max(0,m.pulse-dt);
  if(a.lid)a.lid.rotation.x=-Math.sin(m.pulse/.35*Math.PI)*(a.lamp||.55);
  if(a.hammer)a.hammer.rotation.x=m.pulse>0?-Math.abs(Math.sin(m.pulse*11))*1.1:0;
  const on=m.working||m.pulse>0;
  if(a.flag)a.flag.rotation.y=Math.sin(time*2.3+m.x)*.35;
  if(a.glow&&(BUILD[m.type].beacon||BUILD[m.type].fixed)){a.glow.material.emissiveIntensity=.75+Math.sin(time*3+m.z)*.25}
  else if(a.glow){const tgt=m.working?.75+Math.sin(time*9+m.x)*.2+Math.sin(time*23)*.08:.2;a.glow.material.emissiveIntensity+=(tgt-a.glow.material.emissiveIntensity)*Math.min(1,dt*4)}
  if(!on)continue;
  if(a.drill)a.drill.rotation.y+=dt*(m.type==='miner2'?14:8);
  if(a.house)a.house.position.y=1.6+.45+Math.sin(time*47)*.012;
  if(a.press)a.press.position.y=1.35+.3+Math.sin(time*6)*.2;
  if(a.arm){a.arm.rotation.y=Math.sin(time*2)*1.2;a.arm.rotation.x=Math.sin(time*3.1)*.12}
  if(a.emit.length&&(m.type!=='workbench'||m.pulse>0)){m.emitT-=dt;if(m.emitT<=0){m.emitT=PK[a.emit[0].k].rate*(.7+Math.random()*.6);
   for(const e of a.emit){tmpV.set(e.p[0],e.p[1],e.p[2]);m.g.localToWorld(tmpV);emit(tmpV,e.k)}}}}
 updateParts(dt);pm('Animation & Partikel');
 gameTime+=dt;updateDecay();
 let n=0;for(const k of dirty){dirty.delete(k);const cy=k%4,ck=(k-cy)/4,cx=Math.floor(ck/131072)-65536,cz=ck%131072-65536;buildChunk(cx,cy,cz);if(++n>=8)break}pm('Chunk-Meshes');
 stream(dt,6);pm('Weltgenerierung');
 // Ziel & Abbau
 const h=locked&&!buildType?raycast(6):null;let info='';
 if(h){let tgt=null,nm='',sub='';
  if(h.id===MACH){tgt=machineAt.get(idx(h.x,h.y,h.z));const d=BUILD[tgt.type];nm=d.beacon?d.n+' „'+tgt.name+'“':d.n;sub=d.fixed?'Unzerstörbar · [E] Info · ':(tgt.status?tgt.status+' · ':'')+'[E] öffnen · LMB halten: abreißen';
   hl.scale.set(tgt.rw+.02,tgt.h+.02,tgt.rd+.02);hl.position.set(tgt.x+tgt.rw/2,tgt.y+tgt.h/2,tgt.z+tgt.rd/2)}
  else if(h.id===BELT){tgt=belts.get(idx(h.x,h.y,h.z));nm='Förderband';sub=tgt.items.length+' Items · LMB halten: abreißen';hl.scale.set(1.02,.22,1.02);hl.position.set(h.x+.5,h.y+.1,h.z+.5)}
  else{const bd=BL[h.id];nm=bd.n;hl.scale.set(1.004,1.004,1.004);hl.position.set(h.x+.5,h.y+.5,h.z+.5);
   if(bd.tier>tier)sub=`<span class="bad">${bd.tier>4?'Unzerstörbar':'Benötigt '+TOOLS[bd.tier].n}</span>`;
   else if(bd.ore){const k=idx(h.x,h.y,h.z);sub=`Vorrat für Miner: ${reserves.has(k)?reserves.get(k):RESERVE} Einheiten`}}
  hl.visible=true;info=`${nm}<small>${sub}</small>`;
  const key=h.x+','+h.y+','+h.z;
  if(mouseL){if(key!==mineKey){mineKey=key;mineT=0}
   if(tgt&&tgt.type&&BUILD[tgt.type].fixed){mineT=0}
   else if(tgt){mineT+=dt/.6;if(mineT>=1){if(net.role==='client')netSend({t:'act',a:'rm',i:keyOf(tgt)});else removeBuilding(tgt);mineT=0;mineKey='';renderHotbar();toast(nm+' abgerissen – Material erstattet')}}
   else{const bd=BL[h.id];if(bd.tier<=tier){mineT+=dt*TOOLS[tier].s/bd.time;if(mineT>=1){mineT=0;mineKey='';
    if(net.role==='client')netSend({t:'act',a:'mine',x:h.x,y:h.y,z:h.z});else doMine(h.x,h.y,h.z,h.id);renderHotbar()}}}}
  else{mineT=0;mineKey=''}}
 else{hl.visible=false;mineT=0}
 $('bar').style.display=mineT>0?'block':'none';$('bar').firstChild.style.width=(mineT*100)+'%';
 // Bauvorschau
 computePlace();
 if(buildType&&place){if(ghostType!==buildType){if(ghost)scene.remove(ghost);ghost=model(buildType,true).g;scene.add(ghost);ghostType=buildType}
  ghost.visible=true;ghost.position.set(place.ox+place.rw/2,place.oy,place.oz+place.rd/2);ghost.rotation.y=-place.rot*Math.PI/2;
  ghostMat.color.set(place.err?0xef5a4c:0x5fcf6f);
  if(buildType==='belt'&&mouseL&&(keys.ShiftLeft||keys.ShiftRight))dragBelt()}
 else if(ghost)ghost.visible=false;
 const md=$('mode');if(buildType){const d=BUILD[buildType];md.style.display='block';
  md.innerHTML=`Baumodus: <b>${d.n}</b> (${d.w}×${d.d}) · ${buildType==='belt'?'Klick: 1 Band · Shift + Ziehen: Linie':'LMB platzieren'} · R / Mausrad drehen · Rechtsklick abbrechen${place&&place.err?`<br><span style="color:#ff8a7e">${place.err}</span>`:''}`;info=''}
 else md.style.display='none';
 $('info').innerHTML=info;
 if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').style.opacity=0}
 slow+=dt;if(slow>.3){slow=0;updateTdHud();{const b=biomeAt(Math.floor(P.x),Math.floor(P.z));if(b!==lastBiome){lastBiome=b;renderHotbar()}}if(panel&&panel.kind==='machine'&&!panelHold)renderPanel();renderGoal()}
 saveT+=dt;if(saveT>60){saveT=0;if(locked&&net.role!=='client')save()}
 pm('Zielen, Bauvorschau, HUD');netTick(dt);pm('Netzwerk');
 tdUpdate(dt);pm('Tower Defense');updateViewModel(dt);updateRadar(dt);updateCompass();pm('Kompass, Radar, Arm');renderer.info.reset();renderer.clear();renderer.render(scene,camera);renderer.clearDepth();renderer.render(viewScene,viewCam);pm('Rendern (CPU)');perfEnd()}

// ---------- Koop (PeerJS/WebRTC; der Host ist maßgeblich, Mitspieler senden nur Aktionen) ----------
const NET_PREFIX='satiscraft-v2-',PCOL=['#f29a2e','#3d9bd6','#5fcf6f','#d65fb4'];
const net={role:'solo',id:0,peer:null,conns:new Map(),host:null,code:'',others:new Map(),queue:[],syncT:0,posT:0};
let peerLib=null;
function loadPeer(){if(window.Peer)return Promise.resolve();if(peerLib)return peerLib;
 peerLib=new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js';
  sc.integrity='sha384-nlUQ8ZqCbvStErob+biJNzSgltf6urV3VGqhfIfzhmg9RXmpeRm76ELw0pYnKlTR';sc.crossOrigin='anonymous';sc.referrerPolicy='no-referrer';
  sc.onload=()=>res();sc.onerror=()=>{peerLib=null;rej(new Error('Netzwerkbibliothek konnte nicht geladen werden.'))};document.head.appendChild(sc)});return peerLib}
const PeerC=()=>window.Peer||(window.peerjs&&window.peerjs.Peer);
function myName(){const v=($('pname').value||'').trim().slice(0,16);return v||'Spieler'}
function coopState(t,bad){const e=$('coopstate');e.textContent=t;e.classList.toggle('err',!!bad)}
function netEmit(msg){net.queue.push(msg)}
function netSend(msg){if(net.host&&net.host.open)net.host.send(msg)}
function playerList(){const l=[{id:0,name:myName(),x:P.x,y:P.y,z:P.z,yaw:P.yaw}];for(const[id,o]of net.others)if(o.x!==undefined)l.push({id,name:o.name||'Spieler',x:o.x,y:o.y,z:o.z,yaw:o.yaw});return l}
function updateCoopUI(){const inCoop=net.role!=='solo';$('hostb').hidden=inCoop;$('joinb').hidden=inCoop;$('joincode').hidden=inCoop;$('leaveb').hidden=!inCoop;
 const n=net.role==='host'?net.conns.size+1:net.role==='client'?avatars.size+1:1;
 $('coophud').style.display=inCoop?'block':'none';
 $('coophud').textContent=net.role==='host'?`Koop-Host · Raum ${net.code} · ${n}/4 Spieler`:net.role==='client'?`Koop · Spieler ${net.id+1} · ${n} Spieler`:'';
 $('newb').disabled=inCoop;$('saveb').disabled=net.role==='client'}
// --- Host ---
// Spielversion (aus ?v= der Skriptadresse) – Host und Gast müssen gleich sein.
const GAME_VER=(()=>{try{const m=/[?&]v=(\d+)/.exec(document.currentScript&&document.currentScript.src||'');return m?+m[1]:0}catch(e){return 0}})();
const ON_PAGES=typeof location!=='undefined'&&(/(^|\.)github\.io$/.test(location.hostname)||location.hostname==='localhost');
function envProblem(){if(typeof RTCPeerConnection==='undefined')return'Dieser Browser bzw. diese Ansicht erlaubt keine Direktverbindungen (WebRTC).';
 if(!ON_PAGES)return'Koop funktioniert nur auf der Spielseite frozenenenen.github.io/Satiscraft – nicht in der Claude-Vorschau.';return''}
async function hostGame(){if(net.role!=='solo'||net.peer)return;const env=envProblem();if(env)return coopState(env,true);
 coopState('Verbinde mit dem Vermittlungsserver…');try{await loadPeer()}catch(e){return coopState(e.message+' Prüfe Internetverbindung und Werbeblocker.',true)}
 const code=Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('');
 let peer;try{peer=new(PeerC())(NET_PREFIX+code,{debug:0})}catch(e){return coopState('Koop nicht möglich: '+e.message,true)}net.peer=peer;
 const to=setTimeout(()=>{if(net.role!=='host'){coopState('Der Vermittlungsserver (0.peerjs.com) antwortet nicht. Ursachen: keine Internetverbindung, Werbe-/Skriptblocker, Firmen-Firewall. Später erneut versuchen.',true);try{peer.destroy()}catch(e){}net.peer=null}},12000);
 peer.on('open',()=>{clearTimeout(to);net.role='host';net.id=0;net.code=code;coopState('Raum offen. Code für deine Mitspieler: '+code+' – du bestätigst jeden Beitritt.');updateCoopUI()});
 peer.on('connection',c=>hostAccept(c));
 peer.on('disconnected',()=>{if(net.role==='host')try{peer.reconnect()}catch(e){}});
 peer.on('error',err=>{clearTimeout(to);if(net.role!=='host'){coopState(err.type==='unavailable-id'?'Raumcode zufällig schon vergeben – bitte erneut hosten.':'Raum konnte nicht geöffnet werden ('+(err.type||err.message)+'). Prüfe Internetverbindung, Werbeblocker oder Firewall.',true);try{peer.destroy()}catch(e){}net.peer=null}})}
// Beitrittsanfragen: Gast meldet sich mit Name + Version, Host bestätigt oder lehnt ab.
const joinReqs=[];
function hostAccept(conn){conn.joinT=setTimeout(()=>{if(!conn.open&&!conn.pid){toast('Ein Spieler wollte beitreten, aber die Direktverbindung kam nicht zustande (Firewall/VPN/Netz).')}},20000);
 conn.on('open',()=>{clearTimeout(conn.joinT);if(net.conns.size>=3){conn.send({t:'full'});setTimeout(()=>conn.close(),500);return}
  conn.helloT=setTimeout(()=>{if(!conn.asked){try{conn.close()}catch(e){}}},10000)});
 conn.on('data',d=>{try{if(!conn.pid)hostPreJoin(conn,d);else hostRecv(conn,d)}catch(e){}});
 conn.on('close',()=>{clearTimeout(conn.joinT);const i=joinReqs.indexOf(conn);if(i>=0){joinReqs.splice(i,1);renderJoinReqs()}
  if(conn.pid&&net.conns.get(conn.pid)===conn){net.conns.delete(conn.pid);net.others.delete(conn.pid);removeAvatar(conn.pid);toast((conn.pname||'Ein Spieler')+' hat das Spiel verlassen');updateCoopUI()}})}
function hostPreJoin(conn,d){if(!d||typeof d!=='object'||d.t!=='hello'||conn.asked)return;conn.asked=true;clearTimeout(conn.helloT);
 const name=(typeof d.name==='string'?d.name:'').replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,16)||'Spieler';conn.pname=name;
 if(!isInt(d.ver,0,1e6)||d.ver!==GAME_VER){conn.send({t:'denied',why:'version',host:GAME_VER});toast(name+' hat eine andere Spielversion ('+d.ver+' statt '+GAME_VER+') – beide Seite neu laden (Strg+F5).');setTimeout(()=>conn.close(),800);return}
 if(net.conns.size+joinReqs.length>=3){conn.send({t:'full'});setTimeout(()=>conn.close(),500);return}
 conn.send({t:'wait'});conn.reqT=Date.now();joinReqs.push(conn);renderJoinReqs();toast(name+' möchte beitreten')}
function decideJoin(conn,ok){const i=joinReqs.indexOf(conn);if(i<0)return;joinReqs.splice(i,1);renderJoinReqs();if(!conn.open)return;
 if(!ok){conn.send({t:'denied',why:'host'});setTimeout(()=>conn.close(),800);toast(conn.pname+' abgelehnt');return}
 if(net.conns.size>=3){conn.send({t:'full'});setTimeout(()=>conn.close(),500);return}
 let id=1;while(net.conns.has(id))id++;conn.pid=id;net.conns.set(id,conn);net.others.set(id,{name:conn.pname});
 conn.send({t:'welcome',id,save:snapshot()});toast(conn.pname+' ist beigetreten');updateCoopUI()}
function renderJoinReqs(){const el=$('joinreq');if(!joinReqs.length){el.style.display='none';el.innerHTML='';return}el.style.display='block';
 el.innerHTML=joinReqs.map((c,i)=>{const left=Math.max(0,60-Math.floor((Date.now()-c.reqT)/1000));return`<div class="jr"><span><b>${esc(c.pname)}</b> möchte beitreten <span class="mut">(${left} s)</span></span><button class="b" data-jr="${i}:1">Annehmen</button><button class="b sec" data-jr="${i}:0">Ablehnen</button></div>`}).join('')}
$('joinreq').addEventListener('click',e=>{const b=e.target.closest('[data-jr]');if(!b)return;const[i,ok]=b.dataset.jr.split(':');const c=joinReqs[+i];if(c)decideJoin(c,ok==='1')});
setInterval(()=>{for(const c of[...joinReqs])if(Date.now()-c.reqT>60000)decideJoin(c,false);if(joinReqs.length)renderJoinReqs()},1000);
function hostRecv(conn,d){if(!conn.pid||!d||typeof d!=='object')return;
 if(d.t==='pos'){const o=net.others.get(conn.pid);if(!o)return;if([d.x,d.y,d.z,d.yaw].every(v=>isNum(v,-1e4,1e4))){o.x=d.x;o.y=d.y;o.z=d.z;o.yaw=d.yaw}
  if(typeof d.name==='string'){o.name=d.name.slice(0,16);conn.pname=o.name}return}
 if(d.t==='act'){applyAction(d);net.syncT=1}}
// Aktionen von Mitspielern: alles prüfen, nichts ungeprüft übernehmen.
function applyAction(d){const ok3=()=>isXZ(d.x)&&isInt(d.y,1,H-1)&&isXZ(d.z);
 if(d.a==='mine'){if(!ok3())return;const id=get(d.x,d.y,d.z);if(!id||id>=200||!BL[id]||BL[id].tier>tier)return;doMine(d.x,d.y,d.z,id)}
 else if(d.a==='place'){if(!ok3()||!isInt(d.slot,0,PLACE.length-1))return;const[it,id]=PLACE[d.slot];if(!inv[it]||get(d.x,d.y,d.z)||pathSet.has(idx(d.x,d.y,d.z)))return;add(it,-1);setBlock(d.x,d.y,d.z,id,true)}
 else if(d.a==='build'){if(typeof d.type!=='string'||!own(BUILD,d.type)||!ok3()||!isInt(d.r,0,3))return;if(checkPlace(d.type,d.x,d.y,d.z,d.r,true))return;doBuild(d.type,d.x,d.y,d.z,d.r)}
 else if(d.a==='rm'){if(!isKey(d.i))return;const t=belts.get(d.i)||machineAt.get(d.i);if(t&&!(t.type&&BUILD[t.type].fixed))removeBuilding(t)}
 else if(d.a==='bdir'){if(!isKey(d.i)||!isInt(d.d,0,3))return;const b=belts.get(d.i);if(b)setBeltDir(b,d.d)}
 else if(d.a==='panel'){if(!isKey(d.k)||!PANEL_ACTS.includes(d.act))return;const m=machineAt.get(d.k);if(m&&(typeof d.arg==='string'||d.arg===undefined))panelAct(m,d.act,d.arg)}
 renderHotbar()}
function syncMsg(){return{t:'sync',inv,tier,goal,gadgets,td:{day:td.day,t:+td.t.toFixed(4),wave:td.wave,hp:Math.round(td.hp),every:td.every,kills:td.kills,defeats:td.defeats,en:enemies.map(e=>[e.id,e.ty,+e.s.toFixed(2),Math.round(e.hp),Math.round(e.max)])},
 m:machines.map(m=>[m.cells[0],m.inBuf,m.outBuf,m.recipe,+m.t.toFixed(2),m.working?1:0,m.tr.map(x=>[x.item,+(x.t||0).toFixed(2),x.pi??-1]),m.disp||0,m.name||0,m.ps||0]),
 b:[...belts.entries()].map(([k,b])=>[k,b.items.map(i=>[i.item,+i.p.toFixed(2)])])}}
// --- Mitspieler ---
// Gast: Verbindungsaufbau in Schritten mit Diagnose
const STEPS=['Netzwerkbibliothek','Vermittlungsserver','Raum gefunden','Direktverbindung','Bestätigung durch den Host','Welt übertragen'];
let stepState=[];
function steps(i,st,note){if(i===-1){stepState=[];}else{stepState[i]=st;if(st==='ok'||st==='bad')for(let j=0;j<i;j++)if(stepState[j]!=='bad')stepState[j]='ok'}
 const el=$('coopsteps');if(!stepState.length){el.innerHTML='';return}
 el.innerHTML=STEPS.map((n,j)=>{const s=stepState[j];return`<li class="${s||'todo'}">${s==='ok'?'✓':s==='bad'?'✗':s==='run'?'…':'·'} ${n}</li>`}).join('')+(note?`<li class="why">${esc(note)}</li>`:'')}
async function joinGame(){if(net.role!=='solo'||net.peer)return;const code=($('joincode').value||'').trim().toUpperCase();
 if(!/^[A-Z0-9]{5}$/.test(code))return coopState('Bitte den 5-stelligen Raumcode eingeben.',true);
 const env=envProblem();if(env)return coopState(env,true);
 steps(-1);steps(0,'run');coopState('Verbinde…');try{await loadPeer()}catch(e){steps(0,'bad','Die Netzwerkbibliothek konnte nicht geladen werden: Internetverbindung, Werbe-/Skriptblocker oder cdnjs gesperrt.');return coopState('Verbindung fehlgeschlagen.',true)}
 steps(0,'ok');steps(1,'run');
 let peer;try{peer=new(PeerC())({debug:0})}catch(e){return coopState('Koop nicht möglich: '+e.message,true)}net.peer=peer;let stage=1;
 const fail=(i,why)=>{clearTimeout(tSig);clearTimeout(tConn);clearTimeout(tWait);steps(i,'bad',why);coopState('Beitritt fehlgeschlagen.',true);try{peer.destroy()}catch(e){}net.peer=null;net.host=null};
 let tConn=0,tWait=0;
 const tSig=setTimeout(()=>{if(stage===1)fail(1,'Der Vermittlungsserver (0.peerjs.com) antwortet nicht: keine Internetverbindung, Werbe-/Skriptblocker oder Firmen-Firewall.')},12000);
 peer.on('open',()=>{clearTimeout(tSig);stage=2;steps(1,'ok');steps(2,'run');const conn=peer.connect(NET_PREFIX+code,{reliable:true});net.host=conn;
  // Wird der Raum gefunden, baut PeerJS die Direktverbindung auf; kommt sie nicht zustande, blockiert meist eine Firewall/VPN.
  tConn=setTimeout(()=>{if(stage<=3)fail(3,'Die Direktverbindung zum Host kam nicht zustande. Häufige Ursachen: VPN, Firmen-/Schulnetz, strenge Router-Firewall oder Mobilfunk-NAT. Versuch: VPN aus, anderes WLAN oder Handy-Hotspot. Der Host kann es auch umgekehrt versuchen (du hostest).')},20000);
  setTimeout(()=>{if(stage===2){stage=3;steps(2,'ok');steps(3,'run')}},2500);
  conn.on('open',()=>{clearTimeout(tConn);stage=4;steps(3,'ok');steps(4,'run');conn.send({t:'hello',name:myName(),ver:GAME_VER});
   tWait=setTimeout(()=>{if(stage===4)fail(4,'Der Host hat nicht reagiert. Er muss die Anfrage oben im Bild annehmen – vielleicht ist sein Tab im Hintergrund oder er ist abwesend.')},75000)});
  conn.on('data',d=>{try{if(d&&d.t==='wait'){coopState('Warte auf Bestätigung durch den Host…')}else if(d&&d.t==='denied'){stage=9;
    fail(4,d.why==='version'?'Der Host nutzt eine andere Spielversion ('+(isInt(d.host,0,1e6)?d.host:'?')+', du '+GAME_VER+'). Beide laden die Seite neu (Strg+F5) und versuchen es erneut.':'Der Host hat die Anfrage abgelehnt.')}
   else{if(d&&d.t==='welcome'){clearTimeout(tWait);stage=5;steps(4,'ok');steps(5,'ok')}clientRecv(d)}}catch(e){}});
  conn.on('close',()=>{if(net.role==='client'){leaveCoop('Die Verbindung zum Host wurde getrennt.')}else if(stage<5&&stage!==9)fail(Math.max(3,stage),'Die Verbindung wurde vom Host geschlossen (Raum voll, abgelehnt oder Host hat den Raum verlassen).')})});
 peer.on('error',err=>{if(net.role==='client')return leaveCoop('Verbindungsfehler: '+(err.type||err.message));
  if(err.type==='peer-unavailable')fail(2,'Raum '+code+' nicht gefunden. Ursachen: Code vertippt, Host hat den Raum geschlossen oder den Tab zugemacht, oder ihr habt unterschiedliche Spielversionen – beide Seite neu laden (Strg+F5).');
  else if(['network','server-error','socket-error','socket-closed'].includes(err.type))fail(1,'Keine Verbindung zum Vermittlungsserver ('+err.type+'): Internetverbindung, Werbe-/Skriptblocker oder Firewall prüfen.');
  else if(err.type==='webrtc'||err.type==='browser-incompatible')fail(3,'Der Browser konnte keine Direktverbindung aufbauen ('+err.type+'). Aktuellen Chrome, Edge oder Firefox verwenden.');
  else fail(Math.min(stage,3),'Fehler: '+(err.type||err.message))})}
function clientRecv(d){if(!d||typeof d!=='object')return;
 if(d.t==='full'){steps(4,'bad','Der Raum ist voll (max. 4 Spieler).');coopState('Der Raum ist voll (max. 4 Spieler).',true);try{net.peer.destroy()}catch(e){}net.peer=null;net.host=null;return}
 if(d.t==='welcome'){const sv=sanitize(d.save);if(!sv||!isInt(d.id,1,3))return;net.role='client';net.id=d.id;newWorld(sv.seed,sv);
  if(sv.P){P.x=(sv.P.x??64)+1.5;P.z=sv.P.z??64;P.y=(sv.P.y??40)+.5}
  coopState('Verbunden als Spieler '+(net.id+1)+'. Inventar und Fortschritt teilt ihr euch.');updateCoopUI();toast('Koop beigetreten');return}
 if(net.role!=='client')return;
 if(d.t==='ev'){for(const e of arr(d.l))applyEvent(e);return}
 if(d.t==='sync'){applySync(d);return}
 if(d.t==='players'){const seen=new Set();for(const p of arr(d.l)){if(!p||!isInt(p.id,0,3)||p.id===net.id||![p.x,p.y,p.z,p.yaw].every(v=>isNum(v,-1e4,1e4)))continue;
  seen.add(p.id);setAvatar(p.id,p.x,p.y,p.z,p.yaw,typeof p.name==='string'?p.name.slice(0,16):'Spieler')}
  for(const id of[...avatars.keys()])if(!seen.has(id))removeAvatar(id);updateCoopUI()}}
function applyEvent(e){if(!e||typeof e!=='object')return;
 if(e.t==='blk'&&isKey(e.i)&&kY(e.i)<H&&isInt(e.id,0,NBL)){const i=e.i,cur=getI(i);if(cur===MACH||cur===BELT)return;setBlock(kX(i),kY(i),kZ(i),e.id,true);reserves.delete(i)}
 else if(e.t==='build'&&typeof e.type==='string'&&own(BUILD,e.type)&&isXZ(e.x)&&isInt(e.y,1,H-1)&&isXZ(e.z)&&isInt(e.r,0,3)){if(fits(e.type,e.x,e.y,e.z,e.r))createMachine(e.type,e.x,e.y,e.z,e.r)}
 else if(e.t==='rm'&&isKey(e.i)){const t=belts.get(e.i)||machineAt.get(e.i);if(t)removeBuilding(t)}
 else if(e.t==='bdir'&&isKey(e.i)&&isInt(e.d,0,3)){const b=belts.get(e.i);if(b)setBeltDir(b,e.d)}}
function applySync(d){applyTdSync(d.td);inv=cleanBag(d.inv,1e9);gadgets={radar:!!(d.gadgets&&d.gadgets.radar===true)};if(isInt(d.tier,0,4))tier=d.tier;if(isInt(d.goal,0,GOALS.length-1))goal=d.goal;
 for(const r of arr(d.m)){if(!Array.isArray(r)||!isKey(r[0]))continue;const m=machineAt.get(r[0]);if(!m)continue;const def=BUILD[m.type];
  m.inBuf=cleanBag(r[1],def.store||1e5);m.outBuf=cleanBag(r[2],1e5);if(isInt(r[3],0,9))m.recipe=r[3];if(isNum(r[4],0,1e4))m.t=r[4];m.working=!!r[5];
  if(def.beacon&&typeof r[8]==='string')m.name=cleanName(r[8]);
  if(def.store){m.disp=normDisp(r[7],m.outs.length);if(Array.isArray(r[9]))m.ps=m.outs.map((_,i)=>typeof r[9][i]==='string'?r[9][i].slice(0,60):'')}
  m.tr=arr(r[6]).filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&own(ITEMS,x[0])).slice(0,def.bridge?def.d*3:4).map(x=>({item:x[0],t:isNum(x[1],0,1e4)?x[1]:0,pi:isInt(x[2],0,2)?x[2]:undefined}))}
 for(const r of arr(d.b)){if(!Array.isArray(r)||!isKey(r[0]))continue;const b=belts.get(r[0]);if(!b)continue;
  b.items=arr(r[1]).filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&own(ITEMS,x[0])&&isNum(x[1],0,1)).slice(0,4).map(x=>({item:x[0],p:x[1]}))}
 renderHotbar()}
function applyTdSync(t){if(!t||typeof t!=='object')return;if(isInt(t.day,1,1e7))td.day=t.day;if(isNum(t.t,0,.9999))td.t=t.t;if(isInt(t.wave,0,1e6))td.wave=t.wave;if(isNum(t.hp,0,TOWER_HP))td.hp=t.hp;
 if(WAVE_OPTS.includes(t.every))td.every=t.every;if(isInt(t.kills,0,1e9))td.kills=t.kills;if(isInt(t.defeats,0,1e7))td.defeats=t.defeats;if(!td.path)return;
 const seen=new Set();for(const r of arr(t.en).slice(0,300)){if(!Array.isArray(r)||!isInt(r[0],1,1e9)||!own(ETYPES,r[1])||!isNum(r[2],0,400)||!isNum(r[3],0,1e7)||!isNum(r[4],1,1e7))continue;seen.add(r[0]);
  let e=enemies.find(q=>q.id===r[0]);if(!e)e=spawnEnemy(r[1],r[4],r[0],Math.min(r[2],route.length-1));if(Math.abs(e.s-r[2])>1.5)e.s=Math.min(r[2],route.length-1);e.hp=r[3];e.max=r[4]}
 for(const e of[...enemies])if(!seen.has(e.id))removeEnemy(e,true)}
function leaveCoop(msg){const wasClient=net.role==='client';
 for(const c of net.conns.values())try{c.close()}catch(e){}net.conns.clear();try{net.host&&net.host.close()}catch(e){}for(const c of[...joinReqs])try{c.close()}catch(e){}joinReqs.length=0;renderJoinReqs();try{net.peer&&net.peer.destroy()}catch(e){}
 net.peer=null;net.host=null;net.role='solo';net.others.clear();for(const id of[...avatars.keys()])removeAvatar(id);updateCoopUI();
 if(wasClient){// eigene Welt wiederherstellen
  let sv=null;try{const raw=localStorage.getItem(KEY);if(raw&&raw.length<2e7)sv=sanitize(JSON.parse(raw))}catch(e){}
  try{if(sv)newWorld(sv.seed,sv);else newWorld(Math.floor(Math.random()*1e6))}catch(e){newWorld(Math.floor(Math.random()*1e6))}pause()}
 coopState(msg||'Koop beendet.',!!msg&&wasClient)}
// --- Spielerfiguren ---
const avatars=new Map();
function nameSprite(name,col){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='bold 30px "Chakra Petch",sans-serif';x.textAlign='center';
 x.fillStyle='rgba(22,25,29,.75)';const w=Math.min(250,x.measureText(name).width+24);x.fillRect(128-w/2,8,w,46);x.fillStyle=col;x.fillText(name,128,42);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false,transparent:true}));sp.scale.set(1.6,.4,1);return sp}
function setAvatar(id,x,y,z,yaw,name){let a=avatars.get(id);
 if(!a||a.name!==name){if(a)scene.remove(a.g);const g=new THREE.Group(),col=PCOL[id];const body=new THREE.MeshLambertMaterial({color:col});
  bx(g,M(0x33373c),.22,.75,.26,-.13,0,0);bx(g,M(0x33373c),.22,.75,.26,.13,0,0);bx(g,body,.55,.75,.32,0,.75,0);
  bx(g,body,.16,.7,.18,-.36,.8,0);bx(g,body,.16,.7,.18,.36,.8,0);bx(g,M(0xe0b48c),.44,.44,.44,0,1.5,0);bx(g,M(0x23272c),.3,.08,.05,0,1.62,-.23);
  const lab=nameSprite(name,col);lab.position.y=2.25;g.add(lab);scene.add(g);a={g,name,x,y,z,yaw,tx:x,ty:y,tz:z,tyaw:yaw};avatars.set(id,a);if(!a.init){a.init=1}}
 a.tx=x;a.ty=y;a.tz=z;a.tyaw=yaw}
function removeAvatar(id){const a=avatars.get(id);if(a){scene.remove(a.g);avatars.delete(id)}}
function updateAvatars(dt){const k=Math.min(1,dt*10);for(const a of avatars.values()){a.x+=(a.tx-a.x)*k;a.y+=(a.ty-a.y)*k;a.z+=(a.tz-a.z)*k;
 let dy=a.tyaw-a.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));a.yaw+=dy*k;a.g.position.set(a.x,a.y,a.z);a.g.rotation.y=a.yaw}}
function netTick(dt){
 if(net.role==='host'){
  if(net.queue.length&&net.conns.size){const batch={t:'ev',l:net.queue};for(const c of net.conns.values())if(c.open)c.send(batch)}net.queue=[];
  for(const[id,o]of net.others)if(o.x!==undefined)setAvatar(id,o.x,o.y,o.z,o.yaw,o.name||'Spieler');
  net.posT+=dt;if(net.posT>.1&&net.conns.size){net.posT=0;const msg={t:'players',l:playerList()};for(const c of net.conns.values())if(c.open)c.send(msg)}
  net.syncT+=dt;if(net.syncT>.5&&net.conns.size){net.syncT=0;const msg=syncMsg();for(const c of net.conns.values())if(c.open)c.send(msg)}}
 else{net.queue=[];if(net.role==='client'){net.posT+=dt;if(net.posT>.1){net.posT=0;netSend({t:'pos',x:P.x,y:P.y,z:P.z,yaw:P.yaw,name:myName()})}}}
 updateAvatars(dt)}
$('hostb').onclick=()=>{saveName();hostGame()};$('joinb').onclick=()=>{saveName();joinGame()};$('leaveb').onclick=()=>leaveCoop();
$('joincode').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){saveName();joinGame()}});$('pname').addEventListener('keydown',e=>e.stopPropagation());
// Hintergrund-Tabs bekommen kein requestAnimationFrame mehr: im Koop trotzdem weiterrechnen (Browser erlauben ~1×/s).
setInterval(()=>{if(!document.hidden||net.role==='solo')return;
 for(let i=0;i<10;i++){if(slopesDirty)updateSlopes();for(const m of machines)tickMachine(m,.1);updateBelts(.1)}
 gameTime+=1;updateDecay();netTick(1)},1000);
// Einstellungen im Pause-Menü
function prefEvery(){try{const v=+localStorage.getItem('satiscraft-every');return WAVE_OPTS.includes(v)&&localStorage.getItem('satiscraft-every')!==null?v:2}catch(e){return 2}}
// Für Spielstände ohne Basis: Turm 8 Blöcke vor dem Spieler aufstellen, Pfad läuft von dort nach Norden.
function setupDefense(){if(td.path)return;const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),ox=Math.floor(P.x+fx*8)-1,oz=Math.floor(P.z+fz*8)-1;
 for(let x=ox;x<ox+3;x++)for(let z=oz;z<oz+3;z++)for(let y=0;y<H;y++){const v=get(x,y,z);if(v===MACH||v===BELT)return toast('Dort steht schon etwas – such dir eine freie Stelle')}
 let tw=machines.find(m=>m.type==='tower');if(!tw){placeBaseTower(ox,oz);tw=machines.find(m=>m.type==='tower')}if(tw){makePath(tw);toast('Basis und Angriffspfad eingerichtet');renderSettings()}}
function renderSettings(){$('waveopts').innerHTML=WAVE_OPTS.map(n=>`<button class="rec ${n===td.every?'on':''}" data-every="${n}" ${net.role==='client'?'disabled':''}>${n?n+(n>1?' Tage':' Tag'):'Aus'}</button>`).join('');
 $('tdsetup').innerHTML=td.path?'':`Dieser Spielstand hat noch keine Basis mit Angriffspfad. <button class="b sec" id="tdsetupb" ${net.role!=='solo'?'disabled':''}>Turmverteidigung hier einrichten</button> <span class="mut">(Turm 8 Blöcke vor dir, Pfad nach Norden)</span>`;
 const sb=$('tdsetupb');if(sb)sb.onclick=()=>{setupDefense();resume()};
 $('rdopts').innerHTML=RD_OPTS.map(n=>`<button class="rec ${n===RD?'on':''}" data-rd="${n}">${n} Chunks <span class="mut">(${n*16} m)</span></button>`).join('')}
$('waveopts').addEventListener('click',e=>{const b=e.target.closest('[data-every]');if(!b||b.disabled)return;td.every=+b.dataset.every;try{localStorage.setItem('satiscraft-every',String(td.every))}catch(e){}renderSettings();toast(td.every?'Angriffe alle '+td.every+' Tage':'Angriffe ausgeschaltet')});
$('rdopts').addEventListener('click',e=>{const b=e.target.closest('[data-rd]');if(!b)return;setViewDist(+b.dataset.rd);renderSettings();toast('Sichtweite: '+RD+' Chunks')});
renderSettings();
function saveName(){try{localStorage.setItem('satiscraft-name',myName())}catch(e){}}
try{$('pname').value=(localStorage.getItem('satiscraft-name')||'').slice(0,16)}catch(e){}

// ---------- Start ----------
let saved=null;try{const raw=localStorage.getItem(KEY);if(raw&&raw.length<2e7)saved=sanitize(JSON.parse(raw))}catch(e){saved=null}
let loaded=false;if(saved){try{newWorld(saved.seed,saved);loaded=true;$('ptext').textContent='Gespeicherter Spielstand geladen. Klicke auf „Spielen“.'}catch(e){loaded=false}}
if(!loaded)newWorld(Math.floor(Math.random()*1e6));
showPause(false);requestAnimationFrame(frame);
}
