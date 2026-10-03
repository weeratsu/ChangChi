// ===== Settings / managers =====
function renderCatMgr(){
 var el=document.getElementById("catMgr");el.innerHTML="";
 if(!cats.length){el.innerHTML='<p class="empty-note">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E41\u0E21\u0E27</p>';}
 cats.forEach(function(c,idx){
  var row=document.createElement("div");row.className="mgr-row cat-mgr-row";
  var ph=catPhoto(c);
  var thumb = '<button class="thumb-btn" title="\u0E43\u0E2A\u0E48/\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E23\u0E39\u0E1B">'+(ph?'<img class="thumb-img" src="'+ph+'">':'<span class="thumb-ph-ic">\ud83d\udc31</span>')+'<span class="thumb-cam">\ud83d\udcf7</span></button>';
  var ageTxt=c.dob?catAge(c.dob):"";
  row.innerHTML=thumb+
   '<div class="nm">'+
     '<input class="c-name" value="'+esc(c.name)+'" placeholder="\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E21\u0E27">'+
     '<div class="cat-fields">'+
       '<label class="cf">\u0e27\u0e31\u0e19\u0e40\u0e01\u0e34\u0e14 <input type="date" class="c-dob" value="'+(c.dob||"")+'"></label>'+
       '<span class="cf-age">'+(ageTxt?("\u0e2d\u0e32\u0e22\u0e38 "+ageTxt):"")+'</span>'+
     '</div>'+
     '<label class="defrow"><input type="checkbox" class="c-neuter"'+(c.neutered?" checked":"")+'> \u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19\u0e41\u0e25\u0e49\u0e27</label>'+
     '<label class="defrow"><input type="checkbox" class="defchk"'+(c.def?" checked":"")+'> \u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</label>'+
   '</div>'+
   '<button class="del">\u00D7</button>';
  var inp=row.querySelector('.c-name');
  inp.oninput=function(){c.name=this.value;save(LS_CATS,cats);};
  inp.onblur=function(){renderCats();renderSummary();};
  row.querySelector('.c-dob').onchange=function(){c.dob=this.value;save(LS_CATS,cats);renderCatMgr();renderSummary();};
  row.querySelector('.c-neuter').onchange=function(){c.neutered=this.checked;save(LS_CATS,cats);};
  row.querySelector(".thumb-btn").onclick=function(){pickImage(function(dataUrl){c.photo=dataUrl;save(LS_CATS,cats);renderCatMgr();renderCats();renderSummary();});};
  row.querySelector(".defchk").onchange=function(){var on=this.checked;cats.forEach(function(x){x.def=false;});c.def=on;if(on){selCat=c.id;persistSel();}save(LS_CATS,cats);renderCatMgr();renderCats();renderSelSummary();};
  row.querySelector(".del").onclick=function(){
   if(cats.length<=1){toast("\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E15\u0E31\u0E27");return;}
   if(!confirm("\u0E25\u0E1A\u0E41\u0E21\u0E27 "+c.name+" ?"))return;
   cats.splice(idx,1); if(selCat===c.id){selCat=cats[0].id;persistSel();}
   save(LS_CATS,cats);renderCatMgr();renderCats();renderSummary();
  };
  el.appendChild(row);
 });
}
function renderHospMgr(){
 var el=document.getElementById("hospMgr");if(!el)return;el.innerHTML="";
 if(!hosps.length){el.innerHTML='<p class="empty-note">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25</p>';}
 hosps.forEach(function(hp,idx){
  var row=document.createElement("div");row.className="mgr-row";
  row.innerHTML='<div class="nm"><input value="'+esc(hp.name)+'" placeholder="\u0E0A\u0E37\u0E48\u0E2D\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25/\u0E04\u0E25\u0E34\u0E19\u0E34\u0E01">'+
   '<label class="defrow"><input type="checkbox" class="defchk"'+(hp.def?" checked":"")+'> \u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</label></div>'+
   '<button class="del">\u00D7</button>';
  var inp=row.querySelector('.nm input');
  inp.oninput=function(){hp.name=this.value;save(LS_HOSP,hosps);};
  inp.onblur=function(){renderHospSel();};
  row.querySelector(".defchk").onchange=function(){var on=this.checked;hosps.forEach(function(x){x.def=false;});hp.def=on;if(on){selHosp=hp.id;persistSel();}save(LS_HOSP,hosps);renderHospMgr();renderHospSel();};
  row.querySelector(".del").onclick=function(){
   if(!confirm("\u0E25\u0E1A "+hp.name+" ?"))return;
   hosps.splice(idx,1); if(selHosp===hp.id){selHosp=hosps[0]&&hosps[0].id;persistSel();}
   save(LS_HOSP,hosps);renderHospMgr();renderHospSel();
  };
  el.appendChild(row);
 });
}
function addHosp(){hosps.push({id:"hp"+Date.now(),name:"\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E43\u0E2B\u0E21\u0E48"});save(LS_HOSP,hosps);renderHospMgr();renderHospSel();}
function addCat(){var c={id:"cat"+Date.now(),name:"\u0E41\u0E21\u0E27\u0E43\u0E2B\u0E21\u0E48"};cats.push(c);save(LS_CATS,cats);renderCatMgr();renderCats();}
function renderCageMgr(){
 var el=document.getElementById("cageMgr");el.innerHTML="";
 if(!cages.length){el.innerHTML='<p class="empty-note">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E23\u0E07</p>';}
 cages.forEach(function(c,idx){
  var src=imgSrc(c);
  var row=document.createElement("div");row.className="mgr-row";
  var thumb = '<button class="thumb-btn" title="\u0E43\u0E2A\u0E48/\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E23\u0E39\u0E1B">'+(src?'<img class="thumb-img" src="'+src+'">':'<span class="thumb-ph-ic">\ud83c\udfe0</span>')+'<span class="thumb-cam">\ud83d\udcf7</span></button>';
  row.innerHTML=thumb+
   '<div class="nm"><input value="'+esc(c.name)+'" placeholder="\u0E0A\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E07">'+
   '<label class="defrow"><input type="checkbox" class="defchk"'+(c.def?" checked":"")+'> \u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</label></div>'+
   '<div class="tw"><input inputmode="decimal" value="'+fmtKg(c.tare)+'"></div>'+
   '<button class="del">\u00D7</button>';
  var ins=row.querySelectorAll('input[type="text"],input[inputmode="decimal"],.nm input');
  var nameInp=row.querySelector('.nm input');
  var tareInp=row.querySelector('.tw input');
  nameInp.oninput=function(){c.name=this.value;save(LS_CAGES,cages);};
  nameInp.onblur=function(){renderCages();};
  tareInp.oninput=function(){var v=parseFloat((this.value||"").replace(",","."));c.tare=isNaN(v)?0:v;save(LS_CAGES,cages);};
  tareInp.onblur=function(){renderCages();calc();};
  row.querySelector(".thumb-btn").onclick=function(){pickImage(function(dataUrl){c.customImg=dataUrl;save(LS_CAGES,cages);renderCageMgr();renderCages();});};
  row.querySelector(".defchk").onchange=function(){var on=this.checked;cages.forEach(function(x){x.def=false;});c.def=on;if(on){selCage=c.id;persistSel();}save(LS_CAGES,cages);renderCageMgr();renderCages();renderSelSummary();};
  row.querySelector(".del").onclick=function(){
   if(cages.length<=1){toast("\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E01\u0E23\u0E07");return;}
   if(!confirm("\u0E25\u0E1A\u0E01\u0E23\u0E07 "+c.name+" ?"))return;
   cages.splice(idx,1); if(selCage===c.id){selCage=cages[0].id;persistSel();}
   save(LS_CAGES,cages);renderCageMgr();renderCages();calc();
  };
  el.appendChild(row);
 });
}
function addCage(){var c={id:"c"+Date.now(),name:"\u0E01\u0E23\u0E07\u0E43\u0E2B\u0E21\u0E48",tare:0};cages.push(c);save(LS_CAGES,cages);renderCageMgr();renderCages();}
