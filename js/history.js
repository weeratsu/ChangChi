// ===== History / log / import-export =====
function _catPhotoByName(nm){ for(var i=0;i<cats.length;i++){ if(cats[i].name===nm) return catPhoto(cats[i])||""; } return ""; }
function _buildLogCard(h){
 var row=document.createElement("div");row.className="log-card";
 var _cn=recCatName(h), _gn=recCageName(h), _hn=recHospName(h);
 var initial=((_cn||"?").trim().charAt(0))||"?";
 var _co=recCatObj(h); var _photo=_co?(catPhoto(_co)||""):"";
 var avaHtml=_photo?'<img class="log-ava" src="'+_photo+'">':'<span class="log-badge">'+esc(initial)+'</span>';
 var noteHtml=h.note?'<span>\uD83D\uDCDD '+esc(h.note)+'</span>':'';
 var hospHtml=_hn?'<span>\uD83C\uDFE5 '+esc(_hn)+'</span>':'';
 var costHtml=(h.cost!=null&&h.cost!=="")?'<span>\uD83D\uDCB0 '+esc(h.cost)+' \u0e1a\u0e32\u0e17</span>':'';
 var neuterHtml=("neutered" in h)?(h.neutered?'<span class="tag-neu on">\u2702\ufe0f \u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19\u0e41\u0e25\u0e49\u0e27</span>':'<span class="tag-neu">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19</span>'):'';
 var _hasW=(h.cat!=null&&h.cat!=="");
 var kgBig=_hasW?(fmtKg(h.cat)+' \u0E01\u0E01.'):'\u2014';
 var weightMeta=_hasW?('<span>\u2696\uFE0F \u0E23\u0E27\u0E21 '+fmtKg(h.total)+' \u2212 \u0E01\u0E23\u0E07 '+fmtKg(h.tare)+'</span>'):'<span>\u2696\uFE0F \u0e44\u0e21\u0e48\u0e44\u0e14\u0e49\u0e0a\u0e31\u0e48\u0e07\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01 (\u0e2b\u0e32\u0e2b\u0e21\u0e2d)</span>';
 row.innerHTML=
  '<div class="log-top"><div class="log-cat">'+avaHtml+esc(_cn||"(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E41\u0E21\u0E27)")+'</div><div class="log-kg">'+kgBig+'</div></div>'+
  '<div class="log-meta">'+
    '<span>\uD83D\uDD52 '+fmtDateTime(h.ts)+'</span>'+
    (_gn?('<span>\uD83D\uDCE6 '+esc(_gn)+'</span>'):'')+
    weightMeta+
    noteHtml+hospHtml+costHtml+neuterHtml+
  '</div>'+
  '<div class="log-actions"><button class="log-edit">\u270f\ufe0f \u0e41\u0e01\u0e49</button><button class="log-del">\u0e25\u0e1a</button></div>';
 row.querySelector(".log-edit").onclick=function(){openManual(h.id);};
 row.querySelector(".log-del").onclick=function(){if(!confirm("\u0e25\u0e1a\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e19\u0e35\u0e49?"))return;hist=hist.filter(function(x){return x.id!==h.id;});save(LS_HIST,hist);renderHist();renderSummary();};
 return row;
}
function renderHist(){
 var el=document.getElementById("histList");el.innerHTML="";
 renderHistFilter();
 var items=hist.filter(function(h){return !histFilter || recCatName(h)===histFilter;});
 var _hc=document.getElementById("histCount"); if(_hc){ _hc.textContent=items.length?("\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14 "+items.length+" \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23"):""; }
 if(!items.length){el.innerHTML='<p class="empty-note">'+(hist.length?"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E41\u0E21\u0E27\u0E15\u0E31\u0E27\u0E19\u0E35\u0E49":"\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E0A\u0E31\u0E48\u0E07")+'</p>';return;}
 // When a specific cat filter is active, show a flat paginated list.
 if(histFilter){
  var PAGE=30; if(typeof window.__histShown!=="number")window.__histShown=PAGE; var _shown=Math.min(window.__histShown, items.length);
  items.slice(0,_shown).forEach(function(h){ el.appendChild(_buildLogCard(h)); });
  if(items.length>_shown){ var more=document.createElement("button"); more.className="btn ghost hist-more"; more.textContent="\u0e14\u0e39\u0e40\u0e1e\u0e34\u0e48\u0e21 ("+(items.length-_shown)+" \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23)"; more.onclick=function(){ window.__histShown=_shown+PAGE; renderHist(); }; el.appendChild(more); }
  return;
 }
 // No filter -> collapsible groups by cat.
 if(!window.__histOpen)window.__histOpen={};
 var order=[]; var byCat={};
 items.forEach(function(h){ var k=recCatName(h)||"(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E41\u0E21\u0E27)"; if(!byCat[k]){byCat[k]=[];order.push(k);} byCat[k].push(h); });
 order.forEach(function(k){
  var arr=byCat[k];
  var open=!!window.__histOpen[k];
  var _photo=_catPhotoByName(k);
  var initial=(k.trim().charAt(0))||"?";
  var ava=_photo?'<img class="log-ava" src="'+_photo+'">':'<span class="log-badge">'+esc(initial)+'</span>';
  var head=document.createElement("button");
  head.className="cat-group-head"+(open?" open":"");
  head.innerHTML='<span class="cgh-left">'+ava+'<span class="cgh-name">'+esc(k)+'</span><span class="cgh-count">'+arr.length+'</span></span><span class="cgh-chev">'+(open?"\u25BE":"\u25B8")+'</span>';
  head.onclick=function(){ window.__histOpen[k]=!window.__histOpen[k]; renderHist(); };
  el.appendChild(head);
  if(open){
   var wrap=document.createElement("div"); wrap.className="cat-group-body";
   var GP=30; var keyShown="__grpShown_"+k; if(typeof window[keyShown]!=="number")window[keyShown]=GP;
   var sh=Math.min(window[keyShown],arr.length);
   arr.slice(0,sh).forEach(function(h){ wrap.appendChild(_buildLogCard(h)); });
   if(arr.length>sh){ var mb=document.createElement("button"); mb.className="btn ghost hist-more"; mb.textContent="\u0e14\u0e39\u0e40\u0e1e\u0e34\u0e48\u0e21 ("+(arr.length-sh)+")"; mb.onclick=function(){ window[keyShown]=sh+GP; renderHist(); }; wrap.appendChild(mb); }
   el.appendChild(wrap);
  }
 });
}
function renderHistFilter(){
 var el=document.getElementById("histFilter");if(!el)return;
 var names=[];cats.forEach(function(c){if(names.indexOf(c.name)<0)names.push(c.name);});
 hist.forEach(function(h){var _n=recCatName(h);if(_n&&names.indexOf(_n)<0)names.push(_n);});
 var html='<button class="fchip'+(histFilter===""?" on":"")+'" data-f="">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</button>';
 names.forEach(function(n){html+='<button class="fchip'+(histFilter===n?" on":"")+'" data-f="'+esc(n)+'">'+esc(n)+'</button>';});
 el.innerHTML=html;
 el.querySelectorAll(".fchip").forEach(function(b){b.onclick=function(){histFilter=b.getAttribute("data-f");window.__histShown=30;renderHist();};});
}
function exportCSV(){
 if(!hist.length){toast("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25");return;}
 var rows=[["id","\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32","\u0E41\u0E21\u0E27","\u0E01\u0E23\u0E07","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E27\u0E21(\u0E01\u0E01.)","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E01\u0E23\u0E07(\u0E01\u0E01.)","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E41\u0E21\u0E27(\u0E01\u0E01.)","\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25","\u0E17\u0E33\u0E2B\u0E21\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27","\u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22\u0e2b\u0e32\u0e2b\u0e21\u0e2d(\u0e1a\u0e32\u0e17)"]];
 hist.slice().reverse().forEach(function(h){
  rows.push([h.id||"",fmtDateTime(h.ts),h.catName||"",h.cageName||"",fmtKg(h.total),fmtKg(h.tare),fmtKg(h.cat),h.note||"",h.hosp||"",(("neutered" in h)?(h.neutered?"\u0E43\u0E0A\u0E48":"\u0E44\u0E21\u0E48"):""),(h.cost!=null?h.cost:"")]);
 });
 var csv=rows.map(function(r){return r.map(function(c){return '"'+(""+c).replace(/"/g,'""')+'"';}).join(",");}).join("\r\n");
 var blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});
 var url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;
 (function(){var _d=new Date(),_p=function(x){return (x<10?"0":"")+x;};a.download="changchi_log_"+_d.getFullYear()+_p(_d.getMonth()+1)+_p(_d.getDate())+"_"+_p(_d.getHours())+_p(_d.getMinutes())+_p(_d.getSeconds())+".csv";})();
 document.body.appendChild(a);a.click();document.body.removeChild(a);
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
 var _mc=document.getElementById("mCost"); if(_mc)_mc.value=(rec&&rec.cost!=null)?rec.cost:"";
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
 var _costEl=document.getElementById("mCost"); var costRaw=_costEl?(_costEl.value||"").replace(",",".").trim():""; var cost=costRaw===""?null:(isNaN(parseFloat(costRaw))?null:Math.round(parseFloat(costRaw)*100)/100);
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
  hist[i].ts=ts;hist[i].catId=catObj?catObj.id:"";hist[i].cageId=cageObj.id;hist[i].hospId=hospObj?hospObj.id:"";hist[i].catName=catObj?catObj.name:"";hist[i].cageName=cageObj.name;hist[i].tare=cageObj.tare;hist[i].total=tot;hist[i].cat=cat;hist[i].note=note;hist[i].hosp=hospObj?hospObj.name:"";hist[i].cost=cost;break;
  }}
  toast("\u0e41\u0e01\u0e49\u0e44\u0e02\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e25\u0e49\u0e27");
 } else {
  hist.push({id:"h"+Date.now()+"_"+Math.floor(Math.random()*1000),ts:ts,catId:catObj?catObj.id:"",cageId:cageObj.id,hospId:hospObj?hospObj.id:"",catName:catObj?catObj.name:"",cageName:cageObj.name,tare:cageObj.tare,total:tot,cat:cat,note:note,hosp:hospObj?hospObj.name:"",cost:cost,neutered:(catObj&&catObj.neutered)?true:false});
  toast("\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e25\u0e49\u0e27 \u2022 "+fmtKg(cat)+" \u0e01\u0e01.");
 }
 hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 save(LS_HIST,hist);editingId=null;
 closeManual();renderHist();renderSummary();
}
function downloadTemplate(){
 var rows=[
  ["\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32 (dd/mm/yyyy HH:MM)","\u0E41\u0E21\u0E27","\u0E01\u0E23\u0E07","\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E41\u0E21\u0E27(\u0E01\u0E01.)","\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25","\u0E17\u0E33\u0E2B\u0E21\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 (\u0E43\u0E0A\u0E48/\u0E44\u0E21\u0E48)","\u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22\u0e2b\u0e32\u0e2b\u0e21\u0e2d(\u0e1a\u0e32\u0e17)"],
  ["01/09/2026 09:30","\u0E19\u0E49\u0E2D\u0E07 1","\u0E01\u0E23\u0E07 1","6.3","\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 - \u0E25\u0E1A\u0E41\u0E16\u0E27\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49","\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E2A\u0E31\u0E15\u0E27\u0E4C \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 1","\u0E44\u0E21\u0E48","850"]
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
 // Excel serial date: a plain number (days since 1899-12-30, optional fractional time).
 // Excel often auto-converts a date column to this when a CSV is opened and re-saved.
 if(/^\d+(\.\d+)?$/.test(s)){
  var serial=parseFloat(s);
  if(serial>=10000&&serial<100000){
   // split whole-day and fractional-time parts, build a LOCAL date to avoid a timezone day-shift
   var whole=Math.floor(serial), frac=serial-whole;
   var base=new Date(1899,11,30); base.setDate(base.getDate()+whole);
   var secs=Math.round(frac*86400); base.setHours(Math.floor(secs/3600),Math.floor((secs%3600)/60),secs%60,0);
   return isNaN(base)?null:base;
  }
 }
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
   var added=0,updated=0,skipped=0;
   // detect whether the file has an id column (exported files do; hand-made template may not)
   var hdr=(rows[0]||[]).map(function(x){return (""+x).trim();});
   // Map columns by HEADER NAME (robust to the id column + the 3-way weight split).
   function col(preds){ for(var ci=0;ci<hdr.length;ci++){ var h=hdr[ci]; for(var pi=0;pi<preds.length;pi++){ if(preds[pi](h)) return ci; } } return -1; }
   function has(sub){ return function(h){ return h.indexOf(sub)>=0; }; }
   function eq(v){ return function(h){ return h===v; }; }
   var C={
     id: col([eq("id")]),
     date: col([has("\u0e27\u0e31\u0e19\u0e40\u0e27\u0e25\u0e32"),has("\u0e27\u0e31\u0e19")]),
     cat: col([eq("\u0e41\u0e21\u0e27")]),
     cage: col([eq("\u0e01\u0e23\u0e07")]),
     // the CAT net weight: prefer a header containing "\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27"; fall back to any "\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01" that is NOT total/cage.
     catw: col([has("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27")]),
     note: col([has("\u0e2b\u0e21\u0e32\u0e22\u0e40\u0e2b\u0e15\u0e38")]),
     hosp: col([has("\u0e42\u0e23\u0e07\u0e1e\u0e22\u0e32\u0e1a\u0e32\u0e25")]),
     neu: col([has("\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19")]),
     cost: col([has("\u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49")])
   };
   if(C.catw<0){ C.catw=col([function(h){return h.indexOf("\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01")>=0 && h.indexOf("\u0e23\u0e27\u0e21")<0 && h.indexOf("\u0e01\u0e23\u0e07")<0;}]); }
   function cell(r,ci){ return ci>=0 ? (""+(r[ci]||"")) : ""; }
   for(var i=1;i<rows.length;i++){
    var r=rows[i];if(!r||r.join("").trim()==="")continue;
    var rowId=(C.id>=0?cell(r,C.id):"").trim();
    var dstr=cell(r,C.date),catName=cell(r,C.cat).trim(),cageName=cell(r,C.cage).trim();
    var neuStr=cell(r,C.neu).trim(),note=cell(r,C.note).trim(),hosp=cell(r,C.hosp).trim();
    var costStr=cell(r,C.cost).replace(",",".").trim(); var costVal=costStr===""?null:(isNaN(parseFloat(costStr))?null:Math.round(parseFloat(costStr)*100)/100);
    var catWStr=cell(r,C.catw).replace(",",".").trim();
    // MERGE: if this row carries an id that matches an existing record, UPDATE it in place (no duplicate).
    if(rowId){
     var ex=null; for(var j=0;j<hist.length;j++){ if(hist[j].id===rowId){ ex=hist[j]; break; } }
     if(ex){
      if(note!=="") ex.note=note;
      if(costStr!=="") ex.cost=costVal;
      if(hosp!=="") ex.hosp=hosp;
      if(neuStr){ ex.neutered=/^(\u0E43\u0E0A\u0E48|yes|y|true|1|\u0E17\u0E33\u0E41\u0E25\u0E49\u0E27)$/i.test(neuStr); }
      var _cv=parseFloat(catWStr); if(!isNaN(_cv)&&_cv>0){ var _t=ex.tare||0; ex.cat=Math.round(_cv*100)/100; ex.total=Math.round((ex.cat+_t)*100)/100; }
      updated++; continue;
     }
    }
    var dt=parseThaiDate(dstr);
    var catVal=parseFloat(catWStr);
    if(!dt){skipped++;continue;}
    var tare=0;cages.forEach(function(c){if(c.name===cageName)tare=c.tare;});
    // CSV weight column is the CAT net weight directly; reconstruct total = cat + tare.
    var cat=null, tot=null;
    if(!isNaN(catVal) && catVal>0){ cat=Math.round(catVal*100)/100; tot=Math.round((cat+tare)*100)/100; }
    // A row with no (valid) weight is allowed ONLY if it carries a note or a cost (e.g. a vet visit with no weigh-in).
    if(cat===null && note==="" && (costVal===null||costVal==="")){ skipped++; continue; }
    var _ci=_byName(cats,catName),_gi=_byName(cages,cageName),_hi=_byName(hosps,hosp);
    var rec={id:"h"+Date.now()+"_"+i+"_"+Math.floor(Math.random()*1000),ts:dt.toISOString(),catId:_ci?_ci.id:"",cageId:_gi?_gi.id:"",hospId:_hi?_hi.id:"",catName:catName,cageName:cageName,tare:tare,total:tot,cat:cat,note:note,hosp:hosp,cost:costVal};
    if(neuStr){ var yes=/^(\u0E43\u0E0A\u0E48|yes|y|true|1|\u0E17\u0E33\u0E41\u0E25\u0E49\u0E27)$/i.test(neuStr); rec.neutered=yes; }
    hist.push(rec);
    added++;
   }
   hist.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
   save(LS_HIST,hist);renderHist();renderSummary();
   toast("\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32 "+added+" \u0e43\u0e2b\u0e21\u0e48 \u00b7 \u0e2d\u0e31\u0e1b\u0e40\u0e14\u0e15 "+updated+(skipped?(" \u00b7 \u0E02\u0E49\u0E32\u0E21 "+skipped):""));
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

// ===== One-time fix: reinterpret CSV-imported weights as CAT net weight =====
function fixImportedWeights(){
 var LS_FIXFLAG="woc_import_wt_fixed_v1";
 var n=0;
 for(var i=0;i<hist.length;i++){
  var r=hist[i];
  if(typeof r.id==="string" && /^h\d+_\d+_\d+$/.test(r.id)){
   var tare=(typeof r.tare==="number")?r.tare:0;
   var newCat=Math.round((r.total)*100)/100;
   var newTot=Math.round((r.total+tare)*100)/100;
   r.cat=newCat; r.total=newTot;
   n++;
  }
 }
 if(n>0){ save(LS_HIST,hist); renderHist(); renderSummary(); }
 try{localStorage.setItem(LS_FIXFLAG,"1");}catch(e){}
 toast(n>0?("\u0e41\u0e01\u0e49\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e35\u0e48\u0e19\u0e33\u0e40\u0e02\u0e49\u0e32\u0e41\u0e25\u0e49\u0e27 "+n+" \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23"):"\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e17\u0e35\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e41\u0e01\u0e49");
}
