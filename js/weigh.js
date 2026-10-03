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
 el.onchange=function(){selHosp=el.value;persistSel();};
}
function calc(){
 var totEl=document.getElementById("totalW");
 var raw=(totEl.value||"").replace(",",".").trim();
 var tot=parseFloat(raw);
 var cage=getCage(selCage);
 var res=document.getElementById("result"),catEl=document.getElementById("catW"),calcL=document.getElementById("calcLine");
 if(!cage||isNaN(tot)||raw===""){res.classList.add("empty");catEl.textContent="\u2014";calcL.textContent=cage?"\u0E04\u0E35\u0E22\u0E4C\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19":"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E01\u0E23\u0E07\u0E01\u0E48\u0E2D\u0E19";return null;}
 var cat=Math.round((tot-cage.tare)*100)/100;
 res.classList.remove("empty");
 if(cat<=0){catEl.textContent=fmtKg(cat);calcL.innerHTML="\u26A0\uFE0F \u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E01\u0E23\u0E07 ("+fmtKg(cage.tare)+" \u0E01\u0E01.)";res.classList.add("empty");}
 else{catEl.textContent=fmtKg(cat);calcL.textContent=fmtKg(tot)+" \u2212 "+fmtKg(cage.tare)+" ("+cage.name+")";}
 return cat;
}
function saveWeighing(){
 var cage=getCage(selCage);
 var totEl=document.getElementById("totalW");
 var raw=(totEl.value||"").replace(",",".").trim();
 var tot=parseFloat(raw);
 if(!cage){toast("\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E01\u0E23\u0E07\u0E01\u0E48\u0E2D\u0E19");return;}
 if(isNaN(tot)||raw===""){toast("\u0E04\u0E35\u0E22\u0E4C\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21\u0E01\u0E48\u0E2D\u0E19");return;}
 var cat=Math.round((tot-cage.tare)*100)/100;
 if(cat<=0){toast("\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07");return;}
 var catObj=getCat(selCat);
 var noteEl=document.getElementById("noteW");var note=noteEl?noteEl.value.trim():"";
 var hospObj=getHosp(selHosp);
 hist.unshift({id:"h"+Date.now(),ts:new Date().toISOString(),catName:catObj?catObj.name:"",cageName:cage.name,tare:cage.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:""});
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);
 totEl.value="";if(noteEl)noteEl.value="";calc();renderHist();renderSummary();
 toast("\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27 \u2022 "+(catObj?catObj.name+" ":"")+fmtKg(cat)+" \u0E01\u0E01.");
}
function renderSelSummary(){
 var el=document.getElementById("selSummary");if(!el)return;
 var cat=getCat(selCat), cage=getCage(selCage);
 var html="";
 html+='<span class="pill">\uD83D\uDC31 <b>'+esc(cat?cat.name:"-")+'</b></span>';
 html+='<span class="pill">\uD83C\uDFE0 <b>'+esc(cage?cage.name:"-")+'</b> ('+(cage?fmtKg(cage.tare):"-")+' \u0E01\u0E01.)</span>';
 el.innerHTML=html;
}
