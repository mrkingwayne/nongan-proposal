// 櫃體立面拆解施工圖 — 參數化 CAD 風格 SVG（單位 mm）
(function(){
const A='建議配置，待確認';
// ---------- primitives (mm, z up) ----------
function V(title,W,H,opt){return Object.assign({title,W,H,items:[],hd:[],vd:[],vdR:[],tags:[],x0:0},opt||{})}
const R=(v,x,z,w,h,c,o)=>v.items.push(Object.assign({t:'r',x,z,w,h,c},o||{}));
const L=(v,x1,z1,x2,z2,c,o)=>v.items.push(Object.assign({t:'l',x1,z1,x2,z2,c},o||{}));
const T=(v,x,z,s,o)=>v.items.push(Object.assign({t:'t',x,z,s},o||{}));
const Ci=(v,x,z,r,c,o)=>v.items.push(Object.assign({t:'c',x,z,r,c},o||{}));
function door(v,x,z,w,h,hinge,o){R(v,x,z,w,h,'p',o);const a=8;if(hinge=='L'){L(v,x+w-a,z+a,x+a,z+h/2,'s',{d:1});L(v,x+a,z+h/2,x+w-a,z+h-a,'s',{d:1})}else if(hinge=='R'){L(v,x+a,z+a,x+w-a,z+h/2,'s',{d:1});L(v,x+w-a,z+h/2,x+a,z+h-a,'s',{d:1})}else if(hinge=='U'){L(v,x+a,z+a,x+w/2,z+h-a,'s',{d:1});L(v,x+w/2,z+h-a,x+w-a,z+a,'s',{d:1})}}
function doors(v,x,z,w,h,n,o){const dw=w/n;for(let i=0;i<n;i++)door(v,x+i*dw,z,dw,h,(n%2==0?(i%2?'R':'L'):(i%2?'R':'L')),o)}
function drawer(v,x,z,w,h,o){R(v,x,z,w,h,'p',o);L(v,x+w/2-Math.min(80,w/4),z+h-40,x+w/2+Math.min(80,w/4),z+h-40,'p')}
function shelf(v,x,w,z,o){R(v,x,z,w,18,'p',Object.assign({f:'#e7d6bf'},o||{}))}
function rod(v,x,w,z){L(v,x+20,z,x+w-20,z,'p',{sw:2.2});Ci(v,x+20,z,12,'p');Ci(v,x+w-20,z,12,'p')}
// ---------- render ----------
function render(v,k,nar){
  const SP=nar?21:28,B0=nar?54:70,BR=nar?7.5:9;
  const ML=v.vd.length?B0+SP*(v.vd.length-1):(nar?14:30),MR=v.vdR.length?B0+SP*(v.vdR.length-1):(nar?14:30),MT=nar?18:34,MB=(v.hd.length?(nar?40:46)+SP*(v.hd.length-1):20)+(v.foot&&!nar?22:0);
  const W=v.W*k,H=v.H*k,VW=ML+W+MR,VH=MT+H+MB,X=x=>ML+(x-v.x0)*k,Y=z=>MT+(v.H-z)*k;
  let s=`<svg viewBox="0 0 ${VW.toFixed(0)} ${VH.toFixed(0)}" width="${VW.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" class="cad">`;
  if(v.floor!==false)s+=`<line x1="${ML-14}" y1="${Y(0)}" x2="${ML+W+14}" y2="${Y(0)}" class="fl"/><path d="${hatchFloor(ML-14,Y(0),W+28)}" class="ht"/>`;
  if(v.ceil)s+=`<line x1="${ML-14}" y1="${Y(v.ceil)}" x2="${ML+W+14}" y2="${Y(v.ceil)}" class="cl"/><text x="${ML+W+12}" y="${Y(v.ceil)-4}" class="sm" text-anchor="end">天花 CH${v.ceil}</text>`;
  for(const it of v.items){
    const cls={o:'lo',p:'lp',s:'ls',h:'lh',a:'la'}[it.c]||'lp';
    if(it.t=='r'){const x=X(it.x),y=Y(it.z+it.h),w=it.w*k,h=it.h*k;
      s+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="${cls}${it.d?' dsh':''}" fill="${it.f||'none'}"/>`;
      if(it.hatch)s+=`<path d="${hatch(x,y,w,h,it.hatch)}" class="ht"/>`;
      if(it.lab&&!(nar&&(String(it.lab).length*11>w||h<22)))s+=`<text x="${(x+w/2).toFixed(1)}" y="${(y+h/2+4).toFixed(1)}" class="il" text-anchor="middle">${it.lab}</text>`;}
    else if(it.t=='l')s+=`<line x1="${X(it.x1).toFixed(1)}" y1="${Y(it.z1).toFixed(1)}" x2="${X(it.x2).toFixed(1)}" y2="${Y(it.z2).toFixed(1)}" class="${cls}${it.d?' dsh':''}"${it.sw?` style="stroke-width:${it.sw}"`:''}/>`;
    else if(it.t=='c')s+=`<circle cx="${X(it.x).toFixed(1)}" cy="${Y(it.z).toFixed(1)}" r="${(it.px?it.r:it.r*k).toFixed(1)}" class="${cls}${it.d?' dsh':''}" fill="${it.f||'none'}"/>`;
    else if(it.t=='t'&&!(nar&&(it.cl||'il')=='il'))s+=`<text x="${X(it.x).toFixed(1)}" y="${(Y(it.z)+4).toFixed(1)}" class="${it.cl||'il'}" text-anchor="${it.a||'middle'}">${it.s}</text>`;
  }
  // balloons / tags
  for(const g of v.tags){const x=X(g.x),y=Y(g.z);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${BR}" class="bl${g.a?' ba':''}"/><text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" class="bt" text-anchor="middle">${g.n}</text>`}
  // dims horizontal (bottom)
  v.hd.forEach((ch,i)=>{const y=Y(0)+(v.floor!==false?(nar?26:30):22)+i*SP;s+=chainH(ch.map(X),ch,y,Y(0)+6)});
  v.vd.forEach((ch,i)=>{const x=ML-(nar?22:26)-i*SP;s+=chainV(ch.map(Y),ch,x,ML-6,1)});
  v.vdR.forEach((ch,i)=>{const x=ML+W+(nar?22:26)+i*SP;s+=chainV(ch.map(Y),ch,x,ML+W+6,0)});
  if(v.foot&&!nar)s+=`<text x="${ML}" y="${VH-6}" class="sm">${v.foot}</text>`;
  return s+'</svg>';
}
function tick(x,y){return `<line x1="${x-4}" y1="${y+4}" x2="${x+4}" y2="${y-4}" class="tk"/>`}
function chainH(px,mm,y,yo){let s=`<line x1="${px[0]-6}" y1="${y}" x2="${px[px.length-1]+6}" y2="${y}" class="dm"/>`;
  px.forEach(x=>{s+=`<line x1="${x}" y1="${yo}" x2="${x}" y2="${y+5}" class="ex"/>`+tick(x,y)});
  for(let i=0;i<px.length-1;i++){const val=Math.round(Math.abs(mm[i+1]-mm[i])),w=Math.abs(px[i+1]-px[i]),mx=(px[i]+px[i+1])/2;
    if(w>=String(val).length*6.6+4)s+=`<text x="${mx}" y="${y-4}" class="dt" text-anchor="middle">${val}</text>`;
    else s+=`<text x="${mx}" y="${y+13+(i%2)*10}" class="dt dts" text-anchor="middle">${val}</text>`}
  return s}
function chainV(py,mm,x,xo,left){let s=`<line x1="${x}" y1="${Math.max(...py)+6}" x2="${x}" y2="${Math.min(...py)-6}" class="dm"/>`;
  py.forEach(y=>{s+=`<line x1="${xo}" y1="${y}" x2="${left?x-5:x+5}" y2="${y}" class="ex"/>`+tick(x,y)});
  for(let i=0;i<py.length-1;i++){const val=Math.round(Math.abs(mm[i+1]-mm[i])),h=Math.abs(py[i+1]-py[i]),my=(py[i]+py[i+1])/2;
    if(h>=String(val).length*6.6+4)s+=`<text transform="translate(${x-4} ${my}) rotate(-90)" class="dt" text-anchor="middle">${val}</text>`;
    else s+=`<text x="${left?x-6:x+6}" y="${my+3.5}" class="dt dts" text-anchor="${left?'end':'start'}">${val}</text>`}
  return s}
function hatch(x,y,w,h,step){let d='';const st=step===true?6:step;for(let t=-h;t<w;t+=st){const x1=Math.max(x,x+t),y1=x1==x?y+(-t):y,x2=Math.min(x+w,x+t+h),y2=y+(x2-(x+t));d+=`M${x1.toFixed(1)} ${(y1).toFixed(1)}L${x2.toFixed(1)} ${Math.min(y+h,y2).toFixed(1)}`}return d}
function hatchFloor(x,y,w){let d='';for(let t=0;t<w;t+=8)d+=`M${(x+t).toFixed(1)} ${(y+8).toFixed(1)}L${(x+t+8).toFixed(1)} ${y.toFixed(1)}`;return d}
window.CADHTML=function(c,avail){
  const views=c.views(),maxW=Math.max(...views.map(v=>v.W)),maxH=Math.max(...views.map(v=>v.H));
  const mg=v=>narrow?(v.vd.length?54+21*(v.vd.length-1):14)+(v.vdR.length?54+21*(v.vdR.length-1):14):(v.vd.length?70+28*(v.vd.length-1):30)+(v.vdR.length?70+28*(v.vdR.length-1):30);
  avail=avail||1000;const narrow=avail<700;
  // fit: every view must fit available width at one shared scale
  let k=Math.min(c.k||9,980/maxW,(narrow?560:500)/maxH,0.26);
  for(const v of views)k=Math.min(k,(avail-4-mg(v))/v.W);
  let h=`<div class="cadv${narrow?' nar':''}">${views.map((v,i)=>`<div class="cadw" data-i="${i}" title="點擊放大"><div class="cvt">${v.title}</div>${render(v,k,narrow)}${narrow&&v.foot?`<div class="cvf">${v.foot}</div>`:''}</div>`).join('')}</div>`;
  h+=`<p class="sm2">比例約 1:${Math.round(1/k*3.78)}（螢幕示意，尺寸以標註為準，單位 mm）。<span class="tg">橘色編號</span>＝${A}；黑色編號＝依 D8 平面／3D 模型。</p>`;
  h+=`<table class="ctb"><tr><th>#</th><th>部位</th><th>尺寸／說明</th><th>依據</th></tr>${c.parts.map(p=>`<tr><td><span class="nb${p.a?' na':''}">${p.n}</span></td><td>${p.k}</td><td>${p.v}</td><td>${p.a?`<span class="tg">${A}</span>`:'D8'}</td></tr>`).join('')}</table>`;
  h+=`<div class="cnotes"><b>板材</b><ul>${c.mat.map(x=>`<li>${x}</li>`).join('')}</ul><b>五金</b><ul>${c.hw.map(x=>`<li>${x}</li>`).join('')}</ul>${c.warn?`<b>待確認／資料差異</b><ul>${c.warn.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`;
  return h};
const AS=x=>`${x}<span class="tg">${A}</span>`;
const SYS_MAT=[AS('系統板 18mm 雙面美耐皿塑合板（櫃身、層板、門片），封邊 ABS；背板 8mm'),'木紋色號未定，以實體樣板確認'];
const SYS_HW=[AS('門片：緩衝鉸鏈（每門高 ≤900 用 2 只、≤1600 用 3 只、>1600 用 4 只）'),AS('把手：斜切免把手或隱藏式嵌入把手，色號隨五金樣本')];

// ---------- 通用：到頂系統衣櫃 ----------
function wardrobe(name,W,orient){return{k:7,views:()=>{
  const H=2600,D=600,a=V(`A 外觀立面｜${orient}`,W,H,{ceil:2600});
  R(a,0,0,W,H,'o');R(a,0,0,W,100,'p',{f:'#5a504a'});doors(a,0,100,W,2500,4);
  a.hd=[[0,W/4,W/2,3*W/4,W],[0,W]];a.vd=[[0,100,H],[0,H]];a.tags=[{x:W/8,z:H-200,n:1},{x:3*W/8,z:H-200,n:1}];
  const b=V('B 內部立面（門片拆除）',W,H,{ceil:2600}),m=W/2;
  R(b,0,0,W,H,'o');R(b,18,0,W-36,100,'p',{f:'#5a504a'});L(b,m-9,100,m-9,H-18,'p');L(b,m+9,100,m+9,H-18,'p');
  shelf(b,18,m-27,2200,{d:1});shelf(b,m+9,W/2-27,2200,{d:1});rod(b,18,m-27,2120);
  rod(b,m+9,m-27,2120);shelf(b,m+9,m-27,1160,{d:1});rod(b,m+9,m-27,1080);
  [100,320,540,760].forEach((z,i)=>{if(i<3)R(b,m+9,z,m-27,200,'s',{d:1})});
  b.tags=[{x:m/2,z:2400,n:2,a:1},{x:m/2,z:1400,n:3,a:1},{x:m+m/2,z:1600,n:4,a:1},{x:m+m/2,z:400,n:5,a:1},{x:m/2,z:50,n:6}];
  b.hd=[[0,18,m-9,m+9,W-18,W]];b.vdR=[[0,100,760,1160,2120,2200,2218,H],[0,H]];
  const c=V('C 側剖面',D,H,{ceil:2600});
  R(c,0,0,D,H,'o');R(c,0,0,8,H,'s',{f:'#ddd'});R(c,D-18,0,18,H,'p',{hatch:5});shelf(c,8,D-26,2200,{d:1});Ci(c,D/2,2120,14,'p');L(c,D/2,2120,D/2,1150,'s',{d:1});T(c,D/2+40,1700,'衣架迴轉 ≥560',{a:'start',cl:'sm'});
  c.hd=[[0,8,D-18,D],[0,D]];c.vd=[[0,H]];
  return[a,b,c]},
  parts:[{n:1,k:'門片 ×4（雙開 2 組）',v:`各 ${(W/4).toFixed(W%4?1:0)}×2500（H100–2600 單片到頂）`},{n:2,k:'頂部層板',v:'H2200 起，換季收納'},{n:3,k:'長衣區 吊衣桿',v:'桿高 2120，可吊長大衣／洋裝'},{n:4,k:'短衣區 上下雙桿',v:'上桿 2120、下桿 1080'},{n:5,k:'抽屜 ×3',v:'H200 ×3，置於短衣下方'},{n:6,k:'踢腳板',v:'H100'}].map((p,i)=>Object.assign(p,{a:!(i==0||i==5)})),
  mat:SYS_MAT,hw:SYS_HW.concat([AS('衣桿：鋁合金橢圓衣桿＋固定座'),AS('抽屜：三節式緩衝滑軌（或隱藏式滑軌）')]),
  warn:['櫃深依金哥確認為 600（d8.json 記為 550，以 600 為準）。']}}

const C={};
C.c9=Object.assign({n:'主臥衣櫃'},wardrobe('主臥衣櫃',2080,'面東牆（由西往東看）'));
C.c10=Object.assign({n:'次臥衣櫃'},wardrobe('次臥衣櫃',2090,'面西牆（由東往西看）'));

// ---------- 鞋櫃A ----------
C.c0={n:'鞋櫃A（L 型・面落塵區）',k:8,views:()=>{const W=1500,D=450,H=2600;
  const a=V('A 外觀立面｜由西往東看（左＝北、右＝南）',W,H,{ceil:2600});
  R(a,0,0,W,900,'o');R(a,0,0,W,100,'p',{f:'#5a504a'});doors(a,0,100,W,800,3);R(a,0,900,W,30,'o',{f:'#d9c6ad',hatch:4});R(a,0,930,W,270,'s',{d:1,lab:'鏤空檯面 H270'});R(a,0,1200,W,1400,'o');doors(a,0,1200,W,1400,3);
  a.hd=[[0,500,1000,1500],[0,1500]];a.vd=[[0,100,900,930,1200,2600],[0,2600]];a.tags=[{x:250,z:700,n:1},{x:1250,z:1050,n:2},{x:250,z:2400,n:3}];
  const b=V('B 內部立面（門片拆除）',W,H,{ceil:2600});R(b,0,0,W,900,'o');R(b,0,0,W,100,'p',{f:'#5a504a'});R(b,0,900,W,30,'o',{hatch:4});R(b,0,1200,W,1400,'o');
  [500,1000].forEach(x=>{L(b,x,0,x,900,'p');L(b,x,1200,x,2600,'p')});
  [260,420,580,740].forEach(z=>shelf(b,18,W-36,z,{d:1}));[1550,1900,2250].forEach(z=>shelf(b,18,W-36,z,{d:1}));
  L(b,40,960,W-40,960,'a',{d:1});T(b,W/2,1060,'檯面下 LED 燈條',{cl:'sm'});
  b.tags=[{x:250,z:450,n:4,a:1},{x:1250,z:1730,n:5,a:1},{x:1250,z:990,n:6,a:1}];b.vdR=[[0,100,260,420,580,740,900],[1200,1550,1900,2250,2600]];
  const c=V('C 側剖面',D,H,{ceil:2600});R(c,0,0,D,900,'o');R(c,0,900,D,30,'o',{hatch:4});R(c,0,1200,D,1400,'o');R(c,0,0,8,900,'s',{f:'#ddd'});R(c,0,1200,8,1400,'s',{f:'#ddd'});R(c,D-18,0,18,900,'p',{hatch:5});R(c,D-18,1200,18,1400,'p',{hatch:5});
  [260,420,580,740].forEach(z=>shelf(c,8,D-26,z,{d:1}));[1550,1900,2250].forEach(z=>shelf(c,8,D-26,z,{d:1}));c.hd=[[0,D]];c.vd=[[0,900,930,1200,2600]];return[a,b,c]},
  parts:[{n:1,k:'下櫃門片 ×3＋踢腳',v:'各 500×800（H100–900），踢腳 H100'},{n:2,k:'檯面＋鏤空',v:'檯面 30 厚（H900–930），鏤空 H930–1200，可放鑰匙／隨手物'},{n:3,k:'上櫃門片 ×3',v:'各 500×1400（H1200–2600 到頂）'},{n:4,k:'下櫃鞋層板 ×4',v:'間距約 160，可調式',a:1},{n:5,k:'上櫃層板 ×3',v:'間距約 350，放靴子／換季鞋',a:1},{n:6,k:'鏤空檯面 LED',v:'檯面下崁燈條，感應式',a:1}],
  mat:SYS_MAT.concat([AS('檯面 30mm：同系統板加厚或實木皮，待選')]),hw:SYS_HW.concat([AS('層板粒：可調層板，間距 32mm 系統孔')]),
  warn:['櫃深依金哥確認為 450（d8.json 記為 350，以 450 為準）。','分段高度（900／930／1200）取自 D8 3D 模型。']};
// ---------- 鞋櫃B ----------
C.c1={n:'鞋櫃B（L 型・到頂）',k:8,views:()=>{const W=1200,D=450,H=2600;
  const a=V('A 外觀立面｜由南往北看（左＝西、右＝東）',W,H,{ceil:2600});R(a,0,0,W,H,'o');R(a,0,0,W,100,'p',{f:'#5a504a'});doors(a,0,100,W,2500,3);
  a.hd=[[0,400,800,1200],[0,1200]];a.vd=[[0,100,2600]];a.tags=[{x:200,z:2300,n:1}];
  const b=V('B 內部立面（門片拆除）',W,H,{ceil:2600});R(b,0,0,W,H,'o');R(b,0,0,W,100,'p',{f:'#5a504a'});[400,800].forEach(x=>L(b,x,100,x,H,'p'));
  const zs=[280,460,640,820,1000,1180,1360,1540,1720,1900,2250];zs.forEach(z=>shelf(b,18,W-36,z,{d:1}));
  b.tags=[{x:200,z:1000,n:2,a:1},{x:1000,z:2400,n:3,a:1}];b.vdR=[[0,100,280,460,640,820,1000,1180,1360,1540,1720,1900,2250,2600]];
  const c=V('C 側剖面',D,H,{ceil:2600});R(c,0,0,D,H,'o');R(c,0,0,8,H,'s',{f:'#ddd'});R(c,D-18,0,18,H,'p',{hatch:5});zs.forEach(z=>shelf(c,8,D-26,z,{d:1}));c.hd=[[0,D]];c.vd=[[0,H]];return[a,b,c]},
  parts:[{n:1,k:'門片 ×3＋踢腳',v:'各 400×2500（H100–2600 單片到頂），踢腳 H100'},{n:2,k:'鞋層板 ×10',v:'間距約 180，可調',a:1},{n:3,k:'頂層',v:'H2200 以上放季節性物品',a:1}],
  mat:SYS_MAT,hw:SYS_HW,warn:['長度 1200、深度 450 已確認。','與鞋櫃A 轉角交接處的收邊方式待現場確認。']};
// ---------- 客廳高櫃 ----------
C.c2={n:'客廳高櫃',k:8,views:()=>{const W=600,D=450,H=2600;
  const a=V('A 外觀立面｜由北往南看',W,H,{ceil:2600});R(a,0,0,W,H,'o');R(a,0,0,W,100,'p',{f:'#5a504a'});doors(a,0,100,W,2500,2);a.hd=[[0,300,600]];a.vd=[[0,100,H]];a.tags=[{x:150,z:2300,n:1}];
  const b=V('B 內部立面',W,H,{ceil:2600});R(b,0,0,W,H,'o');R(b,0,0,W,100,'p',{f:'#5a504a'});[500,800,1200,1600,2000].forEach(z=>shelf(b,18,W-36,z,{d:1}));b.tags=[{x:300,z:1400,n:2,a:1}];b.vdR=[[0,100,500,800,1200,1600,2000,2600]];
  const c=V('C 側剖面',D,H,{ceil:2600});R(c,0,0,D,H,'o');R(c,0,0,8,H,'s',{f:'#ddd'});R(c,D-18,0,18,H,'p',{hatch:5});[500,800,1200,1600,2000].forEach(z=>shelf(c,8,D-26,z,{d:1}));c.hd=[[0,D]];c.vd=[[0,H]];return[a,b,c]},
  parts:[{n:1,k:'門片 ×2＋踢腳',v:'各 300×2500（H100–2600），踢腳 H100'},{n:2,k:'層板 ×5',v:'間距約 400，可調',a:1}],mat:SYS_MAT,hw:SYS_HW};
// ---------- 電視櫃 ----------
C.c3={n:'電視櫃（懸吊）',k:8,views:()=>{const W=2500,D=450,H=2600;
  const a=V('A 外觀立面｜由北往南看（左＝東、右＝西）',W,H,{ceil:2600});R(a,0,400,W,2200,'s',{f:'#f1e6d6'});T(a,W/2,2350,'電視主牆 木作滿牆（H400–2600）',{cl:'il'});
  R(a,(2050-850)/2*0+650,900,1200,700,'p',{f:'#555',d:0});T(a,1250,1250,'電視（示意）',{cl:'iw'});
  R(a,0,100,W,300,'o');for(let i=0;i<4;i++)drawer(a,i*625,100,625,300);
  a.hd=[[0,625,1250,1875,2500],[0,2500]];a.vd=[[0,100,400,2600]];a.tags=[{x:312,z:250,n:1},{x:300,z:2000,n:3}];
  const c=V('C 側剖面',D,H,{ceil:2600});R(c,0,400,20,2200,'p',{hatch:5});R(c,0,100,D,300,'o');R(c,20,100,8,300,'s');R(c,D-18,100,18,300,'p',{hatch:5});R(c,30,120,D-60,250,'s',{d:1});
  c.hd=[[0,20,D]];c.vd=[[0,100,400]];c.tags=[{x:D/2,z:600,n:2,a:1}];return[a,c]},
  parts:[{n:1,k:'抽屜 ×4',v:'各 625×300，櫃體離地 100 懸吊'},{n:2,k:'懸吊固定',v:'壁掛五金／內鐵件吊掛，牆面需確認可鎖固',a:1},{n:3,k:'電視主牆',v:'木作滿牆 W3100（含高櫃段）×H400–2600'}],
  mat:SYS_MAT.concat(['主牆：木作（材質、線板形式未定）']),hw:[AS('抽屜：三節式緩衝滑軌，400–450 深型'),AS('懸吊：櫃體吊碼或隱藏式 L 鐵件；預留電視插座、HDMI 弱電管')],warn:['電視尺寸與掛高為示意，依實際機型。']};
// ---------- 廚房南牆 ----------
function kitchen(){return{n:'廚房一字型（冰箱｜電器櫃｜廚具）',k:5,views:()=>{const W=4060,H=2600;
  // 由北往南看：左＝東。x(由左) = 6340 - X
  const a=V('A 外觀立面｜南牆，由北往南看（左＝東、右＝西）',W,H,{ceil:2600});
  // counter run 0..2760 : seasoning 0-200, gas 200-1000, prep 1000-1860, sink 1860-2760; appliance 2760-3360; fridge 3360-4060
  R(a,0,850,2760,650,'s',{f:'#e9eef0'});T(a,1380,1180,'烤漆玻璃 H850–1500',{cl:'il'});
  R(a,0,0,2760,100,'p',{f:'#5a504a'});R(a,0,100,2760,720,'o');R(a,0,820,2760,30,'o',{f:'#cfc8bf',hatch:4});
  R(a,0,100,200,720,'p');L(a,100,600,100,780,'p',{sw:2});
  drawer(a,200,100,800,360);drawer(a,200,460,800,360);
  [100,340,580].forEach(z=>drawer(a,1000,z,860,240));
  doors(a,1860,100,900,720,2);
  // IH? no: 3-burner gas on counter (shown as thin line)
  L(a,280,852,920,852,'p',{sw:3});T(a,600,880,'三口瓦斯爐',{cl:'sm'});
  L(a,2010,852,2610,852,'s',{d:1});T(a,2310,880,'水槽',{cl:'sm'});
  // uppers
  R(a,0,1500,2760,1100,'o');doors(a,0,1500,200,1100,1);doors(a,200,1500,800,1100,2);doors(a,1000,1500,860,1100,2);doors(a,1860,1500,900,1100,2);
  R(a,220,1500,760,0.1,'p');R(a,250,1430,700,70,'p',{d:1,f:'#eee'});T(a,600,1400,'排油煙機',{cl:'sm'});
  L(a,40,1495,2720,1495,'a',{d:1});
  // appliance tower
  R(a,2760,0,600,2600,'o');R(a,2760,0,600,100,'p',{f:'#5a504a'});drawer(a,2760,100,600,350);
  R(a,2760,450,600,600,'p',{f:'#e6e2dc'});R(a,2800,500,520,500,'s',{lab:'烤箱'});R(a,2760,1050,600,450,'p',{f:'#e6e2dc'});R(a,2800,1100,520,350,'s',{lab:'微波爐'});
  doors(a,2760,1500,600,1100,2);
  // fridge
  R(a,3360,0,700,1850,'s',{d:1,lab:'冰箱 W700'});R(a,3360,1900,700,700,'o');doors(a,3360,1900,700,700,2);
  a.hd=[[0,200,1000,1860,2760,3360,4060],[0,2760,3360,4060],[0,4060]];a.vd=[[0,100,820,850,1500,2600],[0,2600]];a.vdR=[[0,100,450,1050,1500,2600],[0,1850,1900,2600]];
  a.tags=[{x:100,z:300,n:1},{x:600,z:700,n:2},{x:1430,z:700,n:3,a:1},{x:2310,z:500,n:4},{x:1380,z:2300,n:5},{x:3060,z:270,n:6,a:1},{x:3060,z:750,n:7,a:1},{x:3060,z:2300,n:8},{x:3710,z:2250,n:9}];
  a.foot='底線：西端冰箱貼牆；東端調味拉籃 200。';
  const c=V('C 側剖面（經水槽段）',1000,2600,{ceil:2600});
  R(c,0,0,30,2600,'p',{hatch:5});R(c,30,850,6,650,'s',{f:'#cde'});R(c,30,0,600,820,'o');R(c,80,0,550,100,'p',{f:'#5a504a'});R(c,30,820,620,30,'o',{f:'#cfc8bf',hatch:4});
  R(c,612,100,18,720,'p',{hatch:5});R(c,30,1500,350,1100,'o');R(c,362,1500,18,1100,'p',{hatch:5});[1870,2230].forEach(z=>shelf(c,38,324,z,{d:1}));shelf(c,38,574,400,{d:1});
  R(c,150,620,380,200,'s',{d:1,lab:'槽'});
  c.hd=[[0,30,380,630,650]];c.vd=[[0,100,820,850,1500,2600]];c.tags=[{x:300,z:300,n:10,a:1}];
  return[a,c]},
  parts:[{n:1,k:'調味拉籃',v:'W200（指定）'},{n:2,k:'爐下 大抽 ×2',v:'W800；三口瓦斯爐 800 位於此段',a:0},{n:3,k:'備料區 抽屜 ×3',v:'W860，三等分抽屜（餐具／刀具／鍋蓋）',a:1},{n:4,k:'水槽下 雙開門',v:'W900，水槽寬 900 段'},{n:5,k:'吊櫃',v:'H1500–2600，深 350，下緣 LED 燈'},{n:6,k:'電器櫃底抽',v:'H100–450',a:1},{n:7,k:'烤箱／微波爐 嵌入格',v:'烤箱格 H450–1050、微波爐格 H1050–1500；依機型開孔',a:1},{n:8,k:'電器櫃上櫃',v:'H1500–2600 雙開門'},{n:9,k:'冰箱上櫃 W700',v:'H1900–2600；下緣高度依冰箱機型（冰箱高約 1800）',a:1},{n:10,k:'下櫃內層板',v:'水槽下 1 片可調層板（避開排水管）',a:1}],
  mat:['檯面：人造石 30mm（H820–850），前緣出挑 20','壁面：烤漆玻璃（H850–1500），色號未定',SYS_MAT[0],'踢腳 H100 退縮 60（依 D8 模型）'],
  hw:[AS('下櫃抽屜：隱藏式緩衝滑軌（全拉），爐下大抽承重 ≥30kg'),AS('吊櫃門：緩衝鉸鏈或上掀氣壓棒'),AS('排油煙機：隱藏式 W800 嵌於吊櫃下（型式待選）'),'吊櫃下 LED 燈條（依提案）',AS('調味拉籃：200 型不鏽鋼側拉籃')],
  warn:['廚具配置依 Cowork 版本（水槽 900｜備料 860｜三口瓦斯爐 800｜調味 200）；D8 3D 模型的水槽位置不同，以金哥指示為準。','爐下段原記為「三口瓦斯爐 800」，櫃內分割（大抽 ×2）為建議。','烤箱／微波爐高度、冰箱上櫃下緣高度需依實際機型確認。']}}
C.c4=kitchen();C.c5=kitchen();
// ---------- 中島 ----------
C.c7={n:'中島（木作・IH 兩口）',k:7,views:()=>{const W=2040,H=880;
  const a=V('A 立面｜廚房側（由南往北看）',W,H,{ceil:false});
  R(a,20,0,1980,100,'p',{f:'#5a504a'});R(a,20,100,1980,750,'o');doors(a,20,100,1980,750,4);R(a,0,850,W,30,'o',{f:'#cfc8bf',hatch:4});R(a,2000,0,40,850,'o',{f:'#cfc8bf',hatch:4});
  a.hd=[[20,515,1010,1505,2000],[0,20,2000,2040],[0,2040]];a.vd=[[0,100,850,880]];a.tags=[{x:267,z:500,n:1},{x:1000,z:865,n:2},{x:2020,z:400,n:3}];
  const b=V('B 立面｜座位側（由北往南看）',W,1000,{ceil:false});R(b,0,850,W,30,'o',{f:'#cfc8bf',hatch:4});R(b,0,0,40,850,'o',{f:'#cfc8bf',hatch:4});R(b,40,100,1980,750,'s',{d:1,lab:'櫃背（退縮 250 腳踏空間）'});
  [5420-3750,5420-4400,5420-5050].forEach(x=>{R(b,x-180,640,360,50,'p',{f:'#e3d4c2'});R(b,x-120,690,240,260,'p',{f:'#e3d4c2'});L(b,x-150,0,x-150,640,'p');L(b,x+150,0,x+150,640,'p')});
  b.hd=[[0,40,2040],[0,5420-5050,5420-4400,5420-3750,2040]];b.vd=[[0,640,690,850,880]];b.tags=[{x:5420-4400,z:800,n:4}];b.foot='吧檯椅座高 640–690（D8 模型），共 3 張';
  const c=V('C 側剖面（短向）',920,880,{ceil:false});R(c,0,850,920,30,'o',{f:'#cfc8bf',hatch:4});R(c,70,0,550,100,'p',{f:'#5a504a'});R(c,20,100,650,750,'o');R(c,20,100,18,750,'p',{hatch:5});shelf(c,38,612,450,{d:1});R(c,60,560,520,290,'s',{d:1,lab:'IH 機體'});
  c.hd=[[0,20,670,920],[0,920]];c.vd=[[0,100,850,880]];c.tags=[{x:795,z:400,n:5}];
  const p=V('D 頂視｜IH 位置',W,920,{floor:false});R(p,0,0,W,920,'o',{f:'#f0ebe4'});R(p,20,250,1980,650,'s',{d:1});
  [[4650,1760],[5050,1760]].forEach(([x,y])=>{Ci(p,x-3380,2400-y,150,'p');Ci(p,x-3380,2400-y,90,'s')});
  R(p,1050,480,800,370,'s',{d:1});T(p,1450,420,'IH 兩口（嵌入）',{cl:'sm'});p.hd=[[0,1270,1670,2040]];p.vd=[[0,250,920]];p.foot='上＝廚房側（南）；下緣 250 為座位懸挑';
  return[a,b,c,p]},
  parts:[{n:1,k:'廚房側門片 ×4',v:'各約 495×750（H100–850）'},{n:2,k:'檯面',v:'人造石 2040×920×30，頂高 H880（高於廚具 850，配合吧檯椅，已確認），座位側懸挑 250'},{n:3,k:'東端石材側板',v:'40 厚，落地至 H850'},{n:4,k:'吧檯椅 ×3',v:'中心距 650'},{n:5,k:'座位側腳踏空間',v:'櫃背退縮 250'}],
  mat:['櫃身：木作（D8 標示），表面材質未定','檯面＋東端側板：人造石（同廚具）',AS('木作 6 分木心板櫃身＋實木皮或美耐板面材')],
  hw:[AS('門片：緩衝鉸鏈'),AS('IH 下方需預留散熱開口與 220V 專用迴路（地板出線）')],
  warn:['不設水槽（依指示）；IH 兩口位置依 D8 平面。']};
// ---------- 咖啡吧 ----------
C.c6={n:'咖啡吧櫃',k:7,views:()=>{const W=2400,H=2600;
  const a=V('A 外觀立面｜由南往北看（左＝西、右＝東）',W,H,{ceil:2600});
  R(a,0,0,W,100,'p',{f:'#5a504a'});R(a,0,100,W,720,'o');doors(a,0,100,W,720,4);R(a,0,820,W,30,'o',{f:'#cfc8bf',hatch:4});R(a,0,1500,W,1100,'o');doors(a,0,1500,W,1100,4);
  a.hd=[[0,600,1200,1800,2400],[0,2400]];a.vd=[[0,100,820,850,1500,2600]];a.tags=[{x:300,z:450,n:1},{x:300,z:2100,n:2},{x:1200,z:1180,n:3,a:1}];
  const c=V('C 側剖面',470,2600,{ceil:2600});R(c,0,0,20,2600,'p',{hatch:5});R(c,20,100,450,720,'o');R(c,50,0,420,100,'p',{f:'#5a504a'});R(c,0,820,470,30,'o',{f:'#cfc8bf',hatch:4});R(c,20,1500,350,1100,'o');shelf(c,28,334,2050,{d:1});shelf(c,28,424,450,{d:1});
  c.hd=[[0,20,370,470]];c.vd=[[0,100,820,850,1500,2600]];return[a,c]},
  parts:[{n:1,k:'下櫃門片 ×4',v:'各 600×720'},{n:2,k:'吊櫃門片 ×4',v:'各 600×1100，深 350'},{n:3,k:'檯面上插座',v:'咖啡機、熱水壺用，建議 2 組 110V',a:1}],
  mat:SYS_MAT.concat(['檯面：人造石 30mm（H820–850）']),hw:SYS_HW,warn:['D8 平面於檯面上有一小圓形標記，用途（龍頭／出線孔）未標示，未納入，待確認。','壁面材質未定。']};
// ---------- 展示層板 ----------
C.c8={n:'展示層板',k:9,views:()=>{const W=720,H=2600;const a=V('A 立面',W,H,{ceil:2600});R(a,0,0,W,H,'s',{d:1,lab:''});
  [900,1300,1700,2100].forEach(z=>R(a,0,z,W,40,'o',{f:'#e7d6bf'}));a.hd=[[0,720]];a.vd=[[0,900,940,1300,1340,1700,1740,2100,2140,2600]];a.tags=[{x:360,z:1150,n:1},{x:680,z:2120,n:2,a:1}];
  const c=V('C 側剖面',250,H,{ceil:2600});R(c,0,0,20,H,'p',{hatch:5});[900,1300,1700,2100].forEach(z=>{R(c,20,z,250-20,40,'o',{f:'#e7d6bf'});L(c,20,z+20,180,z+20,'s',{d:1})});c.hd=[[0,20,250]];c.vd=[[0,900,1300,1700,2100]];return[a,c]},
  parts:[{n:1,k:'層板 ×4',v:'720×250×40，H900／1300／1700／2100'},{n:2,k:'隱藏式層板支架',v:'牆內鐵件，牆面需可鎖固',a:1}],
  mat:['層板：木作 40mm（D8 標示木作）',AS('木心板包實木皮')],hw:[AS('隱藏式層板鐵件（每片 2–3 支）')]};
// ---------- 書桌 ----------
function desk(n,W){return{n,k:9,views:()=>{const D=600,H=750;
  const a=V('A 立面｜正面',W,H,{ceil:false});R(a,0,720,W,30,'o',{f:'#e7d6bf'});R(a,0,0,18,720,'p',{d:1});R(a,W-18,0,18,720,'p',{d:1});R(a,18,560,W-36,140,'s',{d:1});
  a.hd=[[0,18,W-18,W],[0,W]];a.vd=[[0,560,720,750]];a.tags=[{x:W/2,z:735,n:1},{x:9,z:300,n:2,a:1},{x:W/2,z:630,n:3,a:1}];
  const c=V('C 側剖面',D,H,{ceil:false});R(c,0,720,D,30,'o',{f:'#e7d6bf',hatch:4});R(c,0,0,D,720,'p',{d:1});R(c,0,560,D-20,140,'s',{d:1});c.hd=[[0,D]];c.vd=[[0,720,750]];return[a,c]},
  parts:[{n:1,k:'桌板',v:`${W}×600×30，桌面高 750`},{n:2,k:'支撐側板',v:'18mm 系統板落地側板 ×2（或單側靠牆＋壁掛）',a:1},{n:3,k:'淺抽屜',v:'H140，可選配',a:1}],
  mat:[AS('系統板 25–30mm 加厚桌板，側板 18mm')],hw:[AS('鍵盤／淺抽屜：緩衝滑軌'),AS('桌面理線孔 ø60 ×1')],warn:['D8 只有桌板（H720–750），支撐方式與抽屜未定。']}}
C.c11=desk('主臥書桌',800);C.c12=desk('次臥書桌',850);
window.CABDRAW=C;
})();
