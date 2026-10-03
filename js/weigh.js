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
function _wnum(v){ v=parseFloat((""+(v||"")).replace(",",".").trim()); return isNaN(v)?null:v; }
// Two inputs: totalW (hero, cat+cage) and catWInput (secondary, cat only). Editing one back-fills the other.
// calc() reads whichever field is non-empty, preferring totalW, and shows the cat net weight.
function calc(){
 var cage=getCage(selCage);
 var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput");
 var res=document.getElementById("result"), catEl=document.getElementById("catW"), calcL=document.getElementById("calcLine");
 function clear(msg){ if(res)res.classList.add("empty"); if(catEl)catEl.textContent="\u2014"; if(calcL)calcL.textContent=msg; return null; }
 if(!cage){ return clear("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07\u0e01\u0e48\u0e2d\u0e19"); }
 var tare=cage.tare||0;
 var totV=_wnum(totI&&totI.value), catV=_wnum(catI&&catI.value);
 var cat;
 if(totV!=null){
  cat=Math.round((totV-tare)*100)/100;
  if(res)res.classList.remove("empty");
  if(cat<=0){ if(catEl)catEl.textContent=fmtKg(cat); if(calcL)calcL.innerHTML="\u26a0\ufe0f \u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21\u0e19\u0e49\u0e2d\u0e22\u0e01\u0e27\u0e48\u0e32\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e01\u0e23\u0e07 ("+fmtKg(tare)+" \u0e01\u0e01.)"; if(res)res.classList.add("empty"); return cat; }
  if(catEl)catEl.textContent=fmtKg(cat);
  if(calcL)calcL.textContent=fmtKg(totV)+" \u2212 "+fmtKg(tare)+" ("+cage.name+")";
  return cat;
 } else if(catV!=null){
  cat=Math.round(catV*100)/100;
  var tot=Math.round((cat+tare)*100)/100;
  if(res)res.classList.remove("empty");
  if(cat<=0){ return clear("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e15\u0e49\u0e2d\u0e07\u0e21\u0e32\u0e01\u0e01\u0e27\u0e48\u0e32 0"); }
  if(catEl)catEl.textContent=fmtKg(cat);
  if(calcL)calcL.textContent="\u0e23\u0e27\u0e21 "+fmtKg(tot)+" = \u0e41\u0e21\u0e27 "+fmtKg(cat)+" + \u0e01\u0e23\u0e07 "+fmtKg(tare)+" ("+cage.name+")";
  return cat;
 }
 return clear("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21\u0e14\u0e49\u0e32\u0e19\u0e1a\u0e19");
}
// Keep the two inputs in sync as the user types.
function _syncFromTotal(){ var cage=getCage(selCage); var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput"); if(!cage||!totI||!catI)return; var t=_wnum(totI.value); if(t!=null){ var c=Math.round((t-(cage.tare||0))*100)/100; catI.value = c>0?fmtKg(c):""; } calc(); }
function _syncFromCat(){ var cage=getCage(selCage); var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput"); if(!cage||!totI||!catI)return; var c=_wnum(catI.value); if(c!=null){ var t=Math.round((c+(cage.tare||0))*100)/100; totI.value = fmtKg(t); } calc(); }
function saveWeighing(){
 var cage=getCage(selCage);
 if(!cage){toast("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07\u0e01\u0e48\u0e2d\u0e19");return;}
 var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput");
 var tare=cage.tare||0;
 var totV=_wnum(totI&&totI.value), catV=_wnum(catI&&catI.value);
 var cat, tot;
 if(totV!=null){ tot=totV; cat=Math.round((tot-tare)*100)/100; }
 else if(catV!=null){ cat=Math.round(catV*100)/100; tot=Math.round((cat+tare)*100)/100; }
 else { toast("\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e01\u0e48\u0e2d\u0e19"); return; }
 if(cat<=0){toast("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
 var catObj=getCat(selCat);
 var noteEl=document.getElementById("noteW");var note=noteEl?noteEl.value.trim():"";
 var hospObj=getHosp(selHosp);
 hist.unshift({id:"h"+Date.now(),ts:new Date().toISOString(),catName:catObj?catObj.name:"",cageName:cage.name,tare:cage.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:"",neutered:(catObj&&catObj.neutered)?true:false});
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);
 if(totI)totI.value=""; if(catI)catI.value=""; if(noteEl)noteEl.value="";
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
