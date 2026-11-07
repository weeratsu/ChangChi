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
  d.onclick=function(){selCat=c.id;try{var _lc=_lastCageOf(c.id);if(_lc&&getCage(_lc)){selCage=_lc;renderCages();}}catch(e){}persistSel();renderCats();try{_prefillLast();}catch(e){}try{calc();}catch(e){}renderSelSummary();};
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
  d.onclick=function(){selCage=c.id;persistSel();renderCages();try{_prefillLast();}catch(e){}calc();renderSelSummary();};
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
function _syncFromTotal(){ var cage=getCage(selCage); var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput"); if(!cage||!totI||!catI)return; totI.dataset.auto="";catI.dataset.auto=""; var t=_wnum(totI.value); if(t!=null){ var c=Math.round((t-(cage.tare||0))*100)/100; catI.value = c>0?fmtKg(c):""; } calc(); }
function _syncFromCat(){ var cage=getCage(selCage); var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput"); if(!cage||!totI||!catI)return; totI.dataset.auto="";catI.dataset.auto=""; var c=_wnum(catI.value); if(c!=null){ var t=Math.round((c+(cage.tare||0))*100)/100; totI.value = fmtKg(t); } calc(); }
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
 var apptEl=document.getElementById("apptW"); var appt=apptEl?(apptEl.value||""):"";
 var costEl=document.getElementById("costW"); var _cr=costEl?(costEl.value||"").replace(",",".").trim():""; var cost=_cr===""?null:(isNaN(parseFloat(_cr))?null:Math.round(parseFloat(_cr)*100)/100);
 var hospObj=getHosp(selHosp);
 hist.unshift({id:"h"+Date.now(),ts:new Date().toISOString(),catId:catObj?catObj.id:"",cageId:cage.id,hospId:hospObj?hospObj.id:"",catName:catObj?catObj.name:"",cageName:cage.name,tare:cage.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:"",cost:cost,nextAppt:appt,neutered:(catObj&&catObj.neutered)?true:false});
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);
 if(totI)totI.value=""; if(catI)catI.value=""; if(noteEl)noteEl.value=""; if(costEl)costEl.value=""; if(apptEl)apptEl.value=""; if(totI){totI.dataset.auto="";} if(catI){catI.dataset.auto="";}
 calc();renderHist();renderSummary();try{renderAppts();}catch(e){}
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
 var dd=pad(d.getDate()), mo=pad(d.getMonth()+1), yy=dispYear(d.getFullYear());
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

// ===== Last-weight prefill + next-appointment helpers (Nov 7 2026) =====
function _recIsCat(h,cat){ return cat && (h.catId===cat.id || (!h.catId && h.catName===cat.name)); }
function _lastCatW(catId){
 var cat=getCat(catId); if(!cat) return null; var best=null;
 for(var i=0;i<hist.length;i++){ var h=hist[i]; if(!_recIsCat(h,cat)) continue; if(h.cat==null||h.cat==="") continue;
  if(!best||new Date(h.ts)>new Date(best.ts)) best=h; }
 return best?parseFloat(best.cat):null;
}
function _prefillLast(){
 var totI=document.getElementById("totalW"), catI=document.getElementById("catWInput"); if(!totI||!catI) return;
 var canT=(totI.value===""||totI.dataset.auto==="1"), canC=(catI.value===""||catI.dataset.auto==="1");
 if(!(canT&&canC)) return;
 var w=_lastCatW(selCat), cage=getCage(selCage);
 if(w==null||!cage){ if(totI.dataset.auto==="1"){totI.value="";catI.value="";totI.dataset.auto="";catI.dataset.auto="";} calc(); return; }
 catI.value=fmtKg(w); totI.value=fmtKg(Math.round((w+(cage.tare||0))*100)/100);
 totI.dataset.auto="1"; catI.dataset.auto="1"; calc();
}
function _fmtYMD(s){ if(!s) return ""; var a=String(s).split("T"), p=a[0].split("-"); var d=p.length===3?(p[2]+"/"+p[1]+"/"+dispYear(p[0])):a[0]; return (a[1]&&a[1].slice(0,5)!=="00:00")?(d+" "+a[1].slice(0,5)):d; }
function _apptDate(v){ if(!v) return null; v=String(v); var t=v.indexOf("T")>0?v.split("T")[1].slice(0,5):""; var d=new Date((t&&t!=="00:00")?v:(v.split("T")[0]+"T23:59")); return isNaN(d)?null:d; }
function renderAppts(){
 var now=new Date(), today=new Date(); today.setHours(0,0,0,0);
 var rows=[];
 hist.forEach(function(h){ if(!h.nextAppt) return; var d=_apptDate(h.nextAppt); if(!d||d<now) return;
  var k=(typeof recCatName==="function")?recCatName(h):h.catName;
  var dd=new Date(d); dd.setHours(0,0,0,0); rows.push({k:k,h:h,d:d,days:Math.round((dd-today)/86400000)}); });
 rows.sort(function(a,b){return a.d-b.d;});
 var html='<div class="appt-hd"><h2>\uD83D\uDCC5 '+(rows.length?'<s class="strike-old">\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22</s> <span class="cute-new">\u0e19\u0e31\u0e14\u0e41\u0e21\u0e27</span>\u0e17\u0e35\u0e48\u0e08\u0e30\u0e16\u0e36\u0e07':'\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22')+'</h2><button class="btn sec appt-add" onclick="openApptModal()">+ \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e19\u0e31\u0e14</button></div>';
 rows.forEach(function(r){
  var when=r.days===0?"\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49":(r.days===1?"\u0e1e\u0e23\u0e38\u0e48\u0e07\u0e19\u0e35\u0e49":("\u0e2d\u0e35\u0e01 "+r.days+" \u0e27\u0e31\u0e19"));
  var hn=(typeof recHospName==="function")?recHospName(r.h):(r.h.hosp||"");
  var why=(r.h.note||"").split("\n")[0]; if(why.length>80) why=why.slice(0,80)+"\u2026";
  html+='<div class="appt-row'+(r.days<=1?' soon':'')+'"><b>'+esc(r.k)+'</b><span>'+_fmtYMD(r.h.nextAppt)+' \u00b7 '+when+'</span>'
    +'<button class="appt-edit" title="\u0e41\u0e01\u0e49\u0e44\u0e02\u0e19\u0e31\u0e14" onclick="openApptModal(\'\',\''+r.h.id+'\')">\u270f\ufe0f</button>'
    +'<button class="appt-del" title="\u0e25\u0e1a\u0e19\u0e31\u0e14" onclick="delAppt(\''+r.h.id+'\')">\u00d7</button>'
    +(hn?('<small>\uD83C\uDFE5 '+esc(hn)+'</small>'):'')
    +(why?('<small>\uD83D\uDCDD '+esc(why)+'</small>'):'')+'</div>';
 });
 var _op=localStorage.getItem("cc_appt_open")==="1";
 var _ix2=html.indexOf('</h2>');
 html='<div class="appt-tg" onclick="apptToggle(event)">'+html.slice(0,_ix2).replace('<div class="appt-hd"><h2>','<div class="appt-hd"><h2><span class="appt-chev">'+(_op?'\u25BC':'\u25B6')+'</span> ')
  +(rows.length?' <span class="appt-cnt">'+rows.length+'</span>':'')+html.slice(_ix2).replace('</div>','</div></div><div class="appt-body"'+(_op?'':' style="display:none"')+'>')+'</div>';
 if(!rows.length) html=html.replace('<div class="appt-body"','<p class="empty-note appt-none">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e19\u0e31\u0e14</p><div class="appt-body"');
 if(html.slice(-6)==="</div>") html=html.slice(0,-6)+_apptCalHtml()+"</div>";
 ["apptBox","apptBoxSum"].forEach(function(id){ var el=document.getElementById(id); if(!el) return;
  if(id==="apptBoxSum"){ el.innerHTML=""; el.style.display="none"; return; }
  el.innerHTML=html; el.style.display=""; el.classList.toggle("appt-empty",!rows.length); });
 var cb=document.getElementById("apptCalBox"); if(cb){ cb.style.display="none"; cb.innerHTML="";} if(0){ cb.innerHTML='<h2>\uD83D\uDCC6 \u0e1b\u0e0f\u0e34\u0e17\u0e34\u0e19\u0e19\u0e31\u0e14\u0e41\u0e21\u0e27</h2>'+_apptCalHtml(); }
}
function delAppt(id){
 for(var i=0;i<hist.length;i++){ if(hist[i].id===id){
  var _ix=i; askConfirm("\u0e25\u0e1a\u0e19\u0e31\u0e14\u0e19\u0e35\u0e49?",function(){
   if(hist[_ix].kind==="appt") hist.splice(_ix,1); else hist[_ix].nextAppt="";
   save(LS_HIST,hist); renderAppts(); try{renderHist();}catch(e){} },{danger:true}); return; } }
}
function openApptModal(iso,eid){
 var ed=null; if(eid){ for(var q=0;q<hist.length;q++){ if(hist[q].id===eid){ ed=hist[q]; break; } } }
 var isAppt=!ed||ed.kind==="appt";
 var m=document.getElementById("apptModal");
 if(!m){ m=document.createElement("div"); m.id="apptModal"; m.className="modal"; document.body.appendChild(m);
  m.onmousedown=function(e){ m._downOnBg=(e.target===m); }; m.onclick=function(e){ if(e.target===m && m._downOnBg) m.classList.remove("show"); m._downOnBg=false; }; }
 var co=cats.map(function(c){return '<option value="'+c.id+'"'+(c.id===(ed?ed.catId:selCat)?' selected':'')+'>'+esc(c.name)+'</option>';}).join("");
 var ho=hosps.map(function(h){return '<option value="'+h.id+'"'+(h.id===(ed?ed.hospId:selHosp)?' selected':'')+'>'+esc(h.name)+'</option>';}).join("");
 m.innerHTML='<div class="modal-box"><h3>\uD83D\uDCC5 '+(ed?'\u0e41\u0e01\u0e49\u0e44\u0e02\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22':'\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22')+'</h3>'
  +'<label>\u0e41\u0e21\u0e27</label><select id="aCat" class="sel"'+(isAppt?'':' disabled')+'>'+co+'</select>'
  +'<label>\u0e42\u0e23\u0e07\u0e1e\u0e22\u0e32\u0e1a\u0e32\u0e25 / \u0e04\u0e25\u0e34\u0e19\u0e34\u0e01</label><select id="aHosp" class="sel">'+ho+'</select>'
  +'<label>\u0e27\u0e31\u0e19\u0e41\u0e25\u0e30\u0e40\u0e27\u0e25\u0e32\u0e19\u0e31\u0e14</label><input type="datetime-local" id="aWhen" class="sel">'
  +(isAppt?(''+'<label>\u0e19\u0e31\u0e14\u0e17\u0e33\u0e2d\u0e30\u0e44\u0e23 (\u0e44\u0e21\u0e48\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a)</label><textarea id="aNote" class="note-ta" rows="3" placeholder="\u0e40\u0e0a\u0e48\u0e19 \u0e09\u0e35\u0e14\u0e27\u0e31\u0e04\u0e0b\u0e35\u0e19, \u0e15\u0e23\u0e27\u0e08\u0e40\u0e0a\u0e37\u0e49\u0e2d\u0e23\u0e32"></textarea>'):'')+''
  +'<div class="modal-btns"><button class="btn ghost" id="aCancel">\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01</button><button class="btn" id="aSave">\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01</button></div></div>';
 m.classList.add("show");
 if(typeof iso==="string"&&iso){ document.getElementById("aWhen").value=iso+"T09:00"; }
 if(ed){ var _v=String(ed.nextAppt||""); if(_v&&_v.indexOf("T")<0)_v+="T09:00"; document.getElementById("aWhen").value=_v.slice(0,16); var _n=document.getElementById("aNote"); if(_n)_n.value=ed.note||""; }
 document.getElementById("aCancel").onclick=function(){ m.classList.remove("show"); };
 document.getElementById("aSave").onclick=function(){
  var when=document.getElementById("aWhen").value; if(!when){ toast("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32\u0e19\u0e31\u0e14\u0e01\u0e48\u0e2d\u0e19"); return; }
  var c=getCat(document.getElementById("aCat").value), hp=getHosp(document.getElementById("aHosp").value);
  if(ed){ ed.nextAppt=when; if(hp){ed.hospId=hp.id;ed.hosp=hp.name;}
   if(isAppt){ if(c){ed.catId=c.id;ed.catName=c.name;} var _n2=document.getElementById("aNote"); ed.note=_n2?_n2.value.trim():ed.note; }
   save(LS_HIST,hist); m.classList.remove("show"); renderAppts(); try{renderHist();}catch(e){} toast("\u0e41\u0e01\u0e49\u0e44\u0e02\u0e19\u0e31\u0e14\u0e41\u0e25\u0e49\u0e27"); return; }
  hist.push({id:"a"+Date.now(),kind:"appt",ts:new Date().toISOString(),catId:c?c.id:"",catName:c?c.name:"",hospId:hp?hp.id:"",hosp:hp?hp.name:"",
   cageId:"",cageName:"",tare:0,cat:null,total:null,note:document.getElementById("aNote").value.trim(),nextAppt:when});
  save(LS_HIST,hist); m.classList.remove("show"); renderAppts(); toast("\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e19\u0e31\u0e14\u0e41\u0e25\u0e49\u0e27");
 };
}
window.openApptModal=openApptModal; window.delAppt=delAppt;
// Auto-filled weight: tap selects all, so typing replaces it; not typing keeps it (Nov 7 2026)
document.addEventListener("focusin",function(e){ var t=e.target; if(!t||t.tagName!=="INPUT"||t.dataset.auto!=="1") return;
 setTimeout(function(){ try{ t.select(); t.setSelectionRange(0,String(t.value).length); }catch(x){} },0); });

// ===== Appointment month calendar: tap a day to add (Nov 7 2026) =====
function _apptPad(n){return (n<10?"0":"")+n;}
function apptCalNav(d){ var b=window.__apptMon||new Date(); b=new Date(b.getFullYear(),b.getMonth()+d,1); window.__apptMon=b; renderAppts(); }
window.apptCalNav=apptCalNav;
function apptToggle(e){ if(e&&e.target&&e.target.closest&&e.target.closest('button')) return; var o=localStorage.getItem("cc_appt_open")==="1"; localStorage.setItem("cc_appt_open",o?"0":"1"); renderAppts(); }
window.apptToggle=apptToggle;
function apptCalToday(){ window.__apptMon=new Date(); renderAppts(); }
window.apptCalToday=apptCalToday;
function _apptCalHtml(){
 var b=window.__apptMon||new Date(); var y=b.getFullYear(), mo=b.getMonth();
 var TH=["\u0e2d\u0e32","\u0e08","\u0e2d","\u0e1e","\u0e1e\u0e24","\u0e28","\u0e2a"], MO=["\u0e21.\u0e04.","\u0e01.\u0e1e.","\u0e21\u0e35.\u0e04.","\u0e40\u0e21.\u0e22.","\u0e1e.\u0e04.","\u0e21\u0e34.\u0e22.","\u0e01.\u0e04.","\u0e2a.\u0e04.","\u0e01.\u0e22.","\u0e15.\u0e04.","\u0e1e.\u0e22.","\u0e18.\u0e04."];
 var byDay={};
 hist.forEach(function(h){ if(!h.nextAppt) return; var k=String(h.nextAppt).split("T")[0]; var t=String(h.nextAppt).split("T")[1]||"";
  var n=(typeof recCatName==="function")?recCatName(h):h.catName; (byDay[k]=byDay[k]||[]).push({id:h.id,n:n,t:(t&&t.slice(0,5)!=="00:00")?t.slice(0,5):""}); });
 var t0=new Date(); var todayK=t0.getFullYear()+"-"+_apptPad(t0.getMonth()+1)+"-"+_apptPad(t0.getDate());
 var first=new Date(y,mo,1).getDay(), days=new Date(y,mo+1,0).getDate();
 var h='<div class="acal"><div class="acal-hd"><button class="btn ghost acal-nv" onclick="apptCalNav(-1)">\u2039</button><b>'+MO[mo]+' '+dispYear(y)+'</b><span class="acal-r">'+'<button class="btn ghost acal-td" onclick="apptCalToday()">\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49</button>'+'<button class="btn ghost acal-nv" onclick="apptCalNav(1)">\u203a</button></span></div><div class="acal-g">';
 TH.forEach(function(x){ h+='<div class="acal-w">'+x+'</div>'; });
 for(var i=0;i<first;i++) h+='<div class="acal-c acal-x"></div>';
 for(var d=1;d<=days;d++){ var k=y+"-"+_apptPad(mo+1)+"-"+_apptPad(d), L=byDay[k]||[];
  h+='<div class="acal-c'+(k===todayK?' acal-t':'')+(L.length?' acal-has':'')+'" onclick="openApptModal(\''+k+'\')"><span class="acal-d">'+d+'</span>';
  L.slice(0,2).forEach(function(a){ h+='<span class="acal-e" onclick="event.stopPropagation();openApptModal(\'\',\''+a.id+'\')">'+esc((a.t?a.t+' ':'')+a.n)+'</span>'; });
  if(L.length>2) h+='<span class="acal-e">+'+(L.length-2)+'</span>';
  h+='</div>'; }
 return h+'</div></div>';
}
// Remember cage per cat: last record of this cat that used a cage (Nov 7 2026)
function _lastCageOf(catId){ var best=null;
 hist.forEach(function(h){ if(h.kind==="appt"||!h.cageId) return; if(h.catId!==catId) return;
  if(!best||new Date(h.ts)>new Date(best.ts)) best=h; });
 return best?best.cageId:null; }
// Auto-open "more" section when any extra field has a value
function _moreWSync(){ var d=document.getElementById("moreW"); if(!d) return;
 var has=["noteW","costW","apptW"].some(function(id){ var e=document.getElementById(id); return e&&String(e.value||"").trim(); });
 if(has) d.open=true; }
document.addEventListener("input",function(e){ if(e.target&&/^(noteW|costW|apptW)$/.test(e.target.id)) _moreWSync(); });
setTimeout(_moreWSync,300);
// Tap small photo in cat/cage picker -> big photo popup (Nov 7 2026)
function showImgZoom(src,cap){ var z=document.getElementById("imgZoom");
 if(!z){ z=document.createElement("div"); z.id="imgZoom"; document.body.appendChild(z);
  z.onclick=function(e){ if(e.target===z||e.target.classList.contains("iz-x")) z.classList.remove("show"); };
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") z.classList.remove("show"); }); }
 z.innerHTML='<button class="iz-x">\u00d7</button><img src="'+src+'" alt=""><div class="iz-cap">'+esc(cap||"")+'</div>';
 z.classList.add("show"); }
window.showImgZoom=showImgZoom;
document.addEventListener("click",function(e){ var t=e.target; if(!t||t.tagName!=="IMG"||!t.closest(".pick-row")) return;
 var chip=t.closest(".cat-chip,.cage-tile"); e.stopPropagation(); e.preventDefault();
 var cap=chip?(chip.textContent||"").trim():""; showImgZoom(t.src,cap); },true);
