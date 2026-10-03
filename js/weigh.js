// ===== Weigh screen =====
function renderCats(){
 var el=document.getElementById("catRow");el.innerHTML="";
 if(!cats.length){el.innerHTML='<p class="empty-note" style="padding:10px">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E41\u0E21\u0E27</p>';return;}
 cats.forEach(function(c){
  var d=document.createElement("div");
  d.className="cat-chip"+(c.id===selCat?" on":"");
  var ph=catPhoto(c);
  var av=ph?'<img class="cat-ava" src="'+ph+'">':'<span class="cat-ava cat-ava-i">'+esc((c.name||"?").charAt(0))+'</span>';
  d.innerHTML=av+'<span>'+esc(c.name)+'</span>';
  d.onclick=function(){selCat=c.id;persistSel();renderCats();renderSelSummary();};
  el.appendChild(d);
 });
}
function renderCages(){
 var el=document.getElementById("cageGrid");el.innerHTML="";
 if(!cages.length){el.innerHTML='<p class="empty-note" style="grid-column:1/-1">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E23\u0E07</p>';return;}
 cages.forEach(function(c){
  var src=imgSrc(c);
  var d=document.createElement("div");
  d.className="cage-tile"+(c.id===selCage?" on":"")+(src?"":" noimg");
  var inner = src ? '<img src="'+src+'" alt="">' : '<span class="ph">\uD83C\uDFE0</span>';
  inner += '<span class="chk">\u2713</span>';
  inner += '<span class="cap">'+esc(c.name)+'<br><span class="kg">'+fmtKg(c.tare)+' \u0E01\u0E01.</span></span>';
  d.innerHTML=inner;
  d.onclick=function(){selCage=c.id;persistSel();renderCages();calc();renderSelSummary();};
  el.appendChild(d);
 });
}
function renderHospSel(){
 var el=document.getElementById("hospSelect");if(!el)return;
 if(!hosps.length){el.innerHTML='<option value="">(\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35 \u0E23\u0E1E.)</option>';return;}
 el.innerHTML=hosps.map(function(hp){return '<option value="'+hp.id+'"'+(hp.id===selHosp?" selected":"")+'>'+esc(hp.name)+'</option>';}).join("");
 el.onchange=function(){selHosp=el.value;persistSel();try{renderHdrCtx();}catch(e){}};
}
function weighMode(){ return (typeof window!=="undefined"&&window.__weighMode)||"cat"; }
function setWeighMode(m){
 window.__weighMode=m;
 var catI=document.getElementById("catWInput"), totI=document.getElementById("totalW");
 var bCat=document.getElementById("modeCat"), bTot=document.getElementById("modeTotal");
 var lbl=document.getElementById("resLbl"), calcL=document.getElementById("calcLine");
 if(m==="total"){
  if(catI)catI.style.display="none";
  if(totI)totI.style.display="";
  if(bCat)bCat.classList.remove("on"); if(bTot)bTot.classList.add("on");
  if(lbl)lbl.textContent="\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27";
 } else {
  if(catI)catI.style.display="";
  if(totI)totI.style.display="none";
  if(bCat)bCat.classList.add("on"); if(bTot)bTot.classList.remove("on");
  if(lbl)lbl.textContent="\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21 (\u0e41\u0e21\u0e27 + \u0e01\u0e23\u0e07)";
 }
 calc();
}
function calc(){
 var cage=getCage(selCage);
 var res=document.getElementById("result"),catEl=document.getElementById("catW"),calcL=document.getElementById("calcLine");
 var lbl=document.getElementById("resLbl");
 var mode=weighMode();
 var catI=document.getElementById("catWInput"), totI=document.getElementById("totalW");
 function clear(msg){ res.classList.add("empty"); catEl.textContent="\u2014"; if(calcL)calcL.textContent=msg; return null; }
 if(!cage){ return clear("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07\u0e01\u0e48\u0e2d\u0e19"); }
 if(mode==="cat"){
  var rawC=(catI&&catI.value||"").replace(",",".").trim();
  var catV=parseFloat(rawC);
  if(isNaN(catV)||rawC===""){ if(lbl)lbl.textContent="\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21 (\u0e41\u0e21\u0e27 + \u0e01\u0e23\u0e07)"; return clear("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19"); }
  var cat=Math.round(catV*100)/100;
  if(cat<=0){ return clear("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e15\u0e49\u0e2d\u0e07\u0e21\u0e32\u0e01\u0e01\u0e27\u0e48\u0e32 0"); }
  var tot=Math.round((cat+cage.tare)*100)/100;
  res.classList.remove("empty");
  if(lbl)lbl.textContent="\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21 (\u0e41\u0e21\u0e27 + \u0e01\u0e23\u0e07)";
  catEl.textContent=fmtKg(tot);
  if(calcL)calcL.textContent=fmtKg(cat)+" + "+fmtKg(cage.tare)+" ("+cage.name+")";
  return cat;
 } else {
  var rawT=(totI&&totI.value||"").replace(",",".").trim();
  var tot2=parseFloat(rawT);
  if(lbl)lbl.textContent="\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27";
  if(isNaN(tot2)||rawT===""){ return clear("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19"); }
  var cat2=Math.round((tot2-cage.tare)*100)/100;
  res.classList.remove("empty");
  if(cat2<=0){ catEl.textContent=fmtKg(cat2); if(calcL)calcL.innerHTML="\u26a0\ufe0f \u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21\u0e19\u0e49\u0e2d\u0e22\u0e01\u0e27\u0e48\u0e32\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e01\u0e23\u0e07 ("+fmtKg(cage.tare)+" \u0e01\u0e01.)"; res.classList.add("empty"); }
  else{ catEl.textContent=fmtKg(cat2); if(calcL)calcL.textContent=fmtKg(tot2)+" \u2212 "+fmtKg(cage.tare)+" ("+cage.name+")"; }
  return cat2;
 }
}
function saveWeighing(){
 var cage=getCage(selCage);
 if(!cage){toast("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07\u0e01\u0e48\u0e2d\u0e19");return;}
 var mode=weighMode();
 var catI=document.getElementById("catWInput"), totI=document.getElementById("totalW");
 var cat, tot;
 if(mode==="cat"){
  var rawC=(catI&&catI.value||"").replace(",",".").trim();
  var catV=parseFloat(rawC);
  if(isNaN(catV)||rawC===""){toast("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27\u0e01\u0e48\u0e2d\u0e19");return;}
  cat=Math.round(catV*100)/100;
  tot=Math.round((cat+cage.tare)*100)/100;
 } else {
  var rawT=(totI&&totI.value||"").replace(",",".").trim();
  var totV=parseFloat(rawT);
  if(isNaN(totV)||rawT===""){toast("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21\u0e01\u0e48\u0e2d\u0e19");return;}
  tot=totV; cat=Math.round((tot-cage.tare)*100)/100;
 }
 if(cat<=0){toast("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
 var catObj=getCat(selCat);
 var noteEl=document.getElementById("noteW");var note=noteEl?noteEl.value.trim():"";
 var hospObj=getHosp(selHosp);
 hist.unshift({id:"h"+Date.now(),ts:new Date().toISOString(),catName:catObj?catObj.name:"",cageName:cage.name,tare:cage.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:"",neutered:(catObj&&catObj.neutered)?true:false});
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);
 if(catI)catI.value=""; if(totI)totI.value=""; if(noteEl)noteEl.value="";
 calc();renderHist();renderSummary();
 toast("\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27 \u2022 "+(catObj?catObj.name+" ":"")+fmtKg(cat)+" \u0e01\u0e01.");
}

function renderSelSummary(){
 var el=document.getElementById("selSummary");if(!el)return;
 var cat=getCat(selCat), cage=getCage(selCage);
 var html="";
 html+='<span class="pill">\uD83D\uDC31 <b>'+esc(cat?cat.name:"-")+'</b></span>';
 html+='<span class="pill">\uD83C\uDFE0 <b>'+esc(cage?cage.name:"-")+'</b> ('+(cage?fmtKg(cage.tare):"-")+' \u0E01\u0E01.)</span>';
 el.innerHTML=html;
 try{renderHdrCtx();}catch(e){}
}

// ===== Header selected-context panel =====
function _hdrFmtDateTime(d){
 var dd=pad(d.getDate()), mo=pad(d.getMonth()+1), yy=d.getFullYear();
 var hh=pad(d.getHours()), mi=pad(d.getMinutes());
 return dd+"/"+mo+"/"+yy+" "+hh+":"+mi;
}
function renderHdrCtx(){
 var el=document.getElementById("hdrCtx"); if(!el) return;
 var cat=getCat(selCat), cage=getCage(selCage), hosp=(typeof getHosp==="function")?getHosp(selHosp):null;
 var now=new Date();
 var lines=""
  + '<span class="hc-line hc-time"><span class="hc-ic">\uD83D\uDD52</span>'+_hdrFmtDateTime(now)+'</span>'
  + '<span class="hc-line"><span class="hc-ic">\uD83D\uDC31</span>'+esc(cat?cat.name:"-")+'</span>'
  + '<span class="hc-line"><span class="hc-ic">\uD83C\uDFE5</span>'+esc(hosp?hosp.name:"-")+'</span>'
  + '<span class="hc-line"><span class="hc-ic">\uD83D\uDCE6</span>'+esc(cage?cage.name:"-")+'</span>';
 el.innerHTML=lines;
}
if(typeof window!=="undefined"){ try{ if(window.__hdrClock)clearInterval(window.__hdrClock); window.__hdrClock=setInterval(function(){ try{renderHdrCtx();}catch(e){} }, 30000); }catch(e){} }
