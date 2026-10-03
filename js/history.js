// ===== History / log / import-export =====
function renderHist(){
 var el=document.getElementById("histList");el.innerHTML="";
 renderHistFilter();
 var items=hist.filter(function(h){return !histFilter || h.catName===histFilter;});
 if(!items.length){el.innerHTML='<p class="empty-note">'+(hist.length?"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E41\u0E21\u0E27\u0E15\u0E31\u0E27\u0E19\u0E35\u0E49":"\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E0A\u0E31\u0E48\u0E07")+'</p>';return;}
 items.forEach(function(h){
  var row=document.createElement("div");row.className="log-card";
  var initial=((h.catName||"?").trim().charAt(0))||"?";
  var _photo="";
  for(var _i=0;_i<cats.length;_i++){ if(cats[_i].name===h.catName){ _photo=catPhoto(cats[_i])||""; break; } }
  var avaHtml=_photo?'<img class="log-ava" src="'+_photo+'">':'<span class="log-badge">'+esc(initial)+'</span>';
  var noteHtml=h.note?'<span>\uD83D\uDCDD '+esc(h.note)+'</span>':'';
  var hospHtml=h.hosp?'<span>\uD83C\uDFE5 '+esc(h.hosp)+'</span>':'';
  var neuterHtml=("neutered" in h)?(h.neutered?'<span class="tag-neu on">\u2702\ufe0f \u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19\u0e41\u0e25\u0e49\u0e27</span>':'<span class="tag-neu">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19</span>'):'';
  row.innerHTML=
   '<div class="log-top"><div class="log-cat">'+avaHtml+esc(h.catName||"(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E41\u0E21\u0E27)")+'</div><div class="log-kg">'+fmtKg(h.cat)+' \u0E01\u0E01.</div></div>'+
   '<div class="log-meta">'+
     '<span>\uD83D\uDD52 '+fmtDateTime(h.ts)+'</span>'+
     '<span>\uD83D\uDCE6 '+esc(h.cageName)+'</span>'+
     '<span>\u2696\uFE0F \u0E23\u0E27\u0E21 '+fmtKg(h.total)+' \u2212 \u0E01\u0E23\u0E07 '+fmtKg(h.tare)+'</span>'+
     noteHtml+
     hospHtml+
     neuterHtml+
   '</div>'+
   '<div class="log-actions"><button class="log-edit">\u270f\ufe0f \u0e41\u0e01\u0e49</button><button class="log-del">\u0e25\u0e1a</button></div>';
  row.querySelector(".log-edit").onclick=function(){openManual(h.id);};
  row.querySelector(".log-del").onclick=function(){if(!confirm("\u0e25\u0e1a\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e19\u0e35\u0e49?"))return;hist=hist.filter(function(x){return x.id!==h.id;});save(LS_HIST,hist);renderHist();renderSummary();};
  el.appendChild(row);
 });
}
function renderHistFilter(){
 var el=document.getElementById("histFilter");if(!el)return;
 var names=[];cats.forEach(function(c){if(names.indexOf(c.name)<0)names.push(c.name);});
 hist.forEach(function(h){if(h.catName&&names.indexOf(h.catName)<0)names.push(h.catName);});
 var html='<button class="fchip'+(histFilter===""?" on":"")+'" data-f="">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</button>';
 names.forEach(function(n){html+='<button class="fchip'+(histFilter===n?" on":"")+'" data-f="'+esc(n)+'">'+esc(n)+'</button>';});
 el.innerHTML=html;
 el.querySelectorAll(".fchip").forEach(function(b){b.onclick=function(){histFilter=b.getAttribute("data-f");renderHist();};});
}
function exportCSV(){
 if(!hist.length){toast("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25");return;}
 var rows=[["\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32","\u0E41\u0E21\u0E27","\u0E01\u0E23\u0E07","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21(\u0E01\u0E01.)","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E01\u0E23\u0E07(\u0E01\u0E01.)","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E41\u0E21\u0E27(\u0E01\u0E01.)","\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25","\u0E17\u0E33\u0E2B\u0E21\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27"]];
 hist.slice().reverse().forEach(function(h){
  rows.push([fmtDateTime(h.ts),h.catName||"",h.cageName||"",fmtKg(h.total),fmtKg(h.tare),fmtKg(h.cat),h.note||"",h.hosp||"",(("neutered" in h)?(h.neutered?"\u0E43\u0E0A\u0E48":"\u0E44\u0E21\u0E48"):"")]);
 });
 var csv=rows.map(function(r){return r.map(function(c){return '"'+(""+c).replace(/"/g,'""')+'"';}).join(",");}).join("\r\n");
 var blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});
 var url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;a.download="changchi_log.csv";document.body.appendChild(a);a.click();document.body.removeChild(a);
 setTimeout(function(){URL.revokeObjectURL(url);},1000);
 toast("\u0E2A\u0E48\u0E07\u0E2D\u0E2D\u0E01 CSV \u0E41\u0E25\u0E49\u0E27");
}
function fillSelect(el,arr,selId){
 if(!el)return;
 el.innerHTML=arr.map(function(o){return '<option value="'+o.id+'"'+(o.id===selId?" selected":"")+'>'+esc(o.name)+'</option>';}).join("");
}
function nowLocalInput(){
 var d=new Date();
 return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"T"+pad(d.getHours())+":"+pad(d.getMinutes());
}
function openManual(id){
 var m=document.getElementById("manualModal");if(!m)return;
 // Guard: when wired as a button onclick (onclick=openManual), the first arg is a MouseEvent,
 // not a record id. Only treat a STRING id as an edit; anything else is a new entry.
 editingId=(typeof id==="string" && id)?id:null;
 var rec=null;if(editingId){for(var i=0;i<hist.length;i++)if(hist[i].id===editingId){rec=hist[i];break;}}
 var title=document.getElementById("manualTitle");if(title)title.textContent=rec?"\u270f\ufe0f \u0e41\u0e01\u0e49\u0e44\u0e02\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23":"\u2795 \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e22\u0e49\u0e2d\u0e19\u0e2b\u0e25\u0e31\u0e07";
 var catId=selCat,cageId=selCage,hospId=selHosp;
 if(rec){
  cats.forEach(function(c){if(c.name===rec.catName)catId=c.id;});
  cages.forEach(function(c){if(c.name===rec.cageName)cageId=c.id;});
  hosps.forEach(function(h){if(h.name===rec.hosp)hospId=h.id;});
 }
 fillSelect(document.getElementById("mCat"),cats,catId);
 fillSelect(document.getElementById("mCage"),cages,cageId);
 fillSelect(document.getElementById("mHosp"),hosps,hospId);
 document.getElementById("mDate").value=rec?isoToLocalInput(rec.ts):nowLocalInput();
 var mTotalEl=document.getElementById("mTotal");
 var mCatEl=document.getElementById("mCatKg");
 mTotalEl.value=rec?rec.total:"";
 if(mCatEl)mCatEl.value=rec?rec.cat:"";
 document.getElementById("mNote").value=rec?(rec.note||""):"";
 // Bidirectional auto-calc between cat weight and total weight using the selected cage tare.
 var mCageEl=document.getElementById("mCage");
 function _curTare(){var cg=getCage(mCageEl.value);return cg?(cg.tare||0):0;}
 function _num(v){v=parseFloat((v||"").replace(",",".").trim());return isNaN(v)?null:v;}
 var _lock=false;
 function _fromCat(){ if(_lock||!mCatEl)return; var c=_num(mCatEl.value); if(c==null){return;} _lock=true; mTotalEl.value=fmtKg(Math.round((c+_curTare())*100)/100); _lock=false; }
 function _fromTotal(){ if(_lock)return; var t=_num(mTotalEl.value); if(t==null){return;} _lock=true; if(mCatEl)mCatEl.value=fmtKg(Math.round((t-_curTare())*100)/100); _lock=false; }
 if(mCatEl)mCatEl.oninput=_fromCat;
 mTotalEl.oninput=_fromTotal;
 mCageEl.onchange=function(){ if(mCatEl&&_num(mCatEl.value)!=null){_fromCat();} else if(_num(mTotalEl.value)!=null){_fromTotal();} };
 m.classList.add("show");
}
function isoToLocalInput(iso){var d=new Date(iso);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"T"+pad(d.getHours())+":"+pad(d.getMinutes());}
function closeManual(){var m=document.getElementById("manualModal");if(m)m.classList.remove("show");}
function saveManual(){
 var catObj=getCat(document.getElementById("mCat").value);
 var cageObj=getCage(document.getElementById("mCage").value);
 var hospObj=getHosp(document.getElementById("mHosp").value);
 var dtv=document.getElementById("mDate").value;
 var note=document.getElementById("mNote").value.trim();
 if(!cageObj){toast("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07\u0e01\u0e48\u0e2d\u0e19");return;}
 if(!dtv){toast("\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32\u0e01\u0e48\u0e2d\u0e19");return;}
 var rawTot=(document.getElementById("mTotal").value||"").replace(",",".").trim();
 var catEl=document.getElementById("mCatKg");
 var rawCat=catEl?(catEl.value||"").replace(",",".").trim():"";
 var tare=cageObj.tare||0;
 var tot, cat;
 if(rawTot!==""){
   tot=parseFloat(rawTot);
   if(isNaN(tot)){toast("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
   cat=Math.round((tot-tare)*100)/100;
 } else if(rawCat!==""){
   cat=parseFloat(rawCat);
   if(isNaN(cat)){toast("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
   cat=Math.round(cat*100)/100;
   tot=Math.round((cat+tare)*100)/100;
 } else {
   toast("\u0e43\u0e2a\u0e48\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27 \u0e2b\u0e23\u0e37\u0e2d\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e23\u0e27\u0e21 \u0e2d\u0e22\u0e48\u0e32\u0e07\u0e43\u0e14\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e2b\u0e19\u0e36\u0e48\u0e07");return;
 }
 if(cat<=0){toast("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
 var ts=new Date(dtv.replace("T"," ").replace(/-/g,"/")).toISOString();
 if(editingId){
  for(var i=0;i<hist.length;i++){if(hist[i].id===editingId){
   hist[i].ts=ts;hist[i].catName=catObj?catObj.name:"";hist[i].cageName=cageObj.name;hist[i].tare=cageObj.tare;hist[i].total=tot;hist[i].cat=cat;hist[i].note=note;hist[i].hosp=hospObj?hospObj.name:"";break;}}
  toast("\u0e41\u0e01\u0e49\u0e44\u0e02\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e25\u0e49\u0e27");
 } else {
  hist.push({id:"h"+Date.now()+"_"+Math.floor(Math.random()*1000),ts:ts,catName:catObj?catObj.name:"",cageName:cageObj.name,tare:cageObj.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:"",neutered:(catObj&&catObj.neutered)?true:false});
  toast("\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e25\u0e49\u0e27 \u2022 "+fmtKg(cat)+" \u0e01\u0e01.");
 }
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);editingId=null;
 closeManual();renderHist();renderSummary();
}
function downloadTemplate(){
 var rows=[
  ["\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32 (dd/mm/yyyy HH:MM)","\u0E41\u0E21\u0E27","\u0E01\u0E23\u0E07","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21(\u0E01\u0E01.)","\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25","\u0E17\u0E33\u0E2B\u0E21\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 (\u0E43\u0E0A\u0E48/\u0E44\u0E21\u0E48)"],
  ["01/09/2026 09:30","\u0E19\u0E49\u0E2D\u0E07 1","\u0E01\u0E23\u0E07 1","6.3","\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 - \u0E25\u0E1A\u0E41\u0E16\u0E27\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E2A\u0E31\u0E15\u0E27\u0E4C \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 1","\u0E44\u0E21\u0E48"]
 ];
 var csv=rows.map(function(r){return r.map(function(c){return '"'+(""+c).replace(/"/g,'""')+'"';}).join(",");}).join("\r\n");
 var blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});
 var url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;a.download="changchi_template.csv";document.body.appendChild(a);a.click();document.body.removeChild(a);
 setTimeout(function(){URL.revokeObjectURL(url);},1000);
 toast("\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14 template \u0E41\u0E25\u0E49\u0E27");
}
function parseCSV(text){
 if(text.charCodeAt(0)===0xFEFF)text=text.slice(1);
 var rows=[],row=[],cur="",inq=false;
 for(var i=0;i<text.length;i++){
  var ch=text[i];
  if(inq){
   if(ch=='"'){ if(text[i+1]=='"'){cur+='"';i++;} else {inq=false;} }
   else cur+=ch;
  } else {
   if(ch=='"')inq=true;
   else if(ch==","){row.push(cur);cur="";}
   else if(ch=="\n"){row.push(cur);rows.push(row);row=[];cur="";}
   else if(ch=="\r"){}
   else cur+=ch;
  }
 }
 if(cur!==""||row.length){row.push(cur);rows.push(row);}
 return rows;
}
function parseThaiDate(s){
 s=(""+s).trim();if(!s)return null;
 var m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2}))?/);
 if(m){var y=+m[3];if(y>2500)y-=543;var d=new Date(y,(+m[2])-1,+m[1],m[4]?+m[4]:0,m[5]?+m[5]:0);return isNaN(d)?null:d;}
 var d2=new Date(s.replace(/-/g,"/"));return isNaN(d2)?null:d2;
}
function importCSV(file){
 var fr=new FileReader();
 fr.onload=function(e){
  try{
   var rows=parseCSV(e.target.result);
   if(rows.length<2){toast("\u0E44\u0E1F\u0E25\u0E4C\u0E27\u0E48\u0E32\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E21\u0E35\u0E41\u0E15\u0E48\u0E2B\u0E31\u0E27\u0E15\u0E32\u0E23\u0E32\u0E07");return;}
   var added=0,skipped=0;
   for(var i=1;i<rows.length;i++){
    var r=rows[i];if(!r||r.join("").trim()==="")continue;
    var dstr=r[0],catName=(r[1]||"").trim(),cageName=(r[2]||"").trim();
    var tot=parseFloat((""+(r[3]||"")).replace(",","."));
    var neuStr=(r[4]||"").trim(),note=(r[5]||"").trim(),hosp=(r[6]||"").trim();
    var dt=parseThaiDate(dstr);
    if(!dt||isNaN(tot)){skipped++;continue;}
    var tare=0;cages.forEach(function(c){if(c.name===cageName)tare=c.tare;});
    var cat=Math.round((tot-tare)*100)/100;
    if(cat<=0){skipped++;continue;}
    var rec={id:"h"+Date.now()+"_"+i+"_"+Math.floor(Math.random()*1000),ts:dt.toISOString(),catName:catName,cageName:cageName,tare:tare,total:tot,cat:cat,note:note,hosp:hosp};
    if(neuStr){ var yes=/^(\u0E43\u0E0A\u0E48|yes|y|true|1|\u0E17\u0E33\u0E41\u0E25\u0E49\u0E27)$/i.test(neuStr); rec.neutered=yes; }
    hist.push(rec);
    added++;
   }
   hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
   save(LS_HIST,hist);renderHist();renderSummary();
   toast("\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32 "+added+" \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"+(skipped?(" (\u0E02\u0E49\u0E32\u0E21 "+skipped+")"):""));
  }catch(err){toast("\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08: "+err.message);}
 };
 fr.onerror=function(){toast("\u0E2D\u0E48\u0E32\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49");};
 fr.readAsText(file);
}
function pickCSV(){
 var inp=document.createElement("input");inp.type="file";inp.accept=".csv,text/csv";
 inp.onchange=function(){var f=inp.files&&inp.files[0];if(f)importCSV(f);};
 inp.click();
}
