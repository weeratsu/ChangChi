// ===== Vet-visit report (sortable TABLE + cat filter + date range, full remarks) =====
var repFilter="", repSortCol="date", repSortAsc=false, repFrom="", repTo="", repSearch="";
function _repCatObj(h){ return (typeof recCatObj==="function")?recCatObj(h):null; }
function _repCatName(h){ return (typeof recCatName==="function")?recCatName(h):(h.catName||""); }
function _repHospName(h){ return (typeof recHospName==="function")?recHospName(h):(h.hosp||""); }
function _repMoney(n){ return (Math.round(n*100)/100).toLocaleString('en-US'); }
function renderReportFilter(){
 var el=document.getElementById("repFilter"); if(!el)return;
 var names=[]; cats.forEach(function(c){ if(names.indexOf(c.name)<0)names.push(c.name); });
 hist.forEach(function(h){ var n=_repCatName(h); if(n&&names.indexOf(n)<0)names.push(n); });
 var html='<button class="fchip'+(repFilter===""?" on":"")+'" data-f="">\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14</button>';
 names.forEach(function(n){ html+='<button class="fchip'+(repFilter===n?" on":"")+'" data-f="'+esc(n)+'">'+esc(n)+'</button>'; });
 el.innerHTML=html;
 el.querySelectorAll(".fchip").forEach(function(b){ b.onclick=function(){ repFilter=b.getAttribute("data-f"); renderReport(); }; });
}
function setRepSort(col){
 if(repSortCol===col){ repSortAsc=!repSortAsc; } else { repSortCol=col; repSortAsc=(col==="date")?false:true; }
 renderReport();
}
window.setRepSort=setRepSort;
function _repArrow(col){ return repSortCol===col?(repSortAsc?" \u25B2":" \u25BC"):""; }
function renderReport(){
 var el=document.getElementById("repList"); if(!el)return;
 renderReportFilter();
 // date range inputs
 var fEl=document.getElementById("repFrom"), tEl=document.getElementById("repTo");
 if(fEl){ fEl.value=repFrom; fEl.onchange=function(){ repFrom=fEl.value; renderReport(); }; }
 if(tEl){ tEl.value=repTo; tEl.onchange=function(){ repTo=tEl.value; renderReport(); }; }
 var sEl=document.getElementById("repSearch"); if(sEl){ if(sEl.value!==repSearch)sEl.value=repSearch; sEl.oninput=function(){ repSearch=sEl.value; renderReport(); }; }
 var fromT=repFrom?new Date(repFrom+"T00:00:00").getTime():null;
 var toT=repTo?new Date(repTo+"T23:59:59").getTime():null;
 var items=hist.filter(function(h){
   if(repFilter && _repCatName(h)!==repFilter) return false;
   var t=new Date(h.ts).getTime();
   if(fromT!=null && t<fromT) return false;
   if(toT!=null && t>toT) return false;
   var hasCost=(h.cost!=null&&h.cost!=="");
   if(!(_repHospName(h)||hasCost||h.note)) return false;
   var q=(repSearch||"").trim().toLowerCase();
   if(q){ var hay=((_repCatName(h)||"")+" "+(_repHospName(h)||"")+" "+(h.note||"")+" "+fmtDateTime(h.ts)).toLowerCase();
     var ws=q.split(/\s+/); for(var qi=0;qi<ws.length;qi++){ if(hay.indexOf(ws[qi])<0) return false; } }
   return true;
 });
 var dir=repSortAsc?1:-1;
 items.sort(function(a,b){
   var v;
   if(repSortCol==="cat") v=(_repCatName(a)||"").localeCompare(_repCatName(b)||"");
   else if(repSortCol==="hosp") v=(_repHospName(a)||"").localeCompare(_repHospName(b)||"");
   else if(repSortCol==="w") v=((a.cat==null?-1:a.cat))-((b.cat==null?-1:b.cat));
   else if(repSortCol==="cost") v=((parseFloat(a.cost)||0))-((parseFloat(b.cost)||0));
   else v=new Date(a.ts)-new Date(b.ts);
   if(v===0) v=new Date(a.ts)-new Date(b.ts);
   return v*dir;
 });
 var totCost=0; items.forEach(function(h){ var c=parseFloat(h.cost); if(!isNaN(c))totCost+=c; });
 var cc=document.getElementById("repCount");
 if(cc) cc.textContent=items.length?(items.length+" \u0e04\u0e23\u0e31\u0e49\u0e07 \u00b7 \u0e23\u0e27\u0e21 "+_repMoney(totCost)+" \u0e1a\u0e32\u0e17"):"";
 if(!items.length){ el.innerHTML='<p class="empty-note">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2b\u0e32\u0e2b\u0e21\u0e2d</p>'; return; }
 var th='<thead><tr>'
   +'<th class="rep-th" onclick="setRepSort(\'date\')">\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48'+_repArrow("date")+'</th>'
   +'<th class="rep-th" onclick="setRepSort(\'cat\')">\u0e41\u0e21\u0e27'+_repArrow("cat")+'</th>'
   +'<th class="rep-th" onclick="setRepSort(\'hosp\')">\u0e23\u0e1e.'+_repArrow("hosp")+'</th>'
   +'<th class="rep-th num" onclick="setRepSort(\'w\')">\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01'+_repArrow("w")+'</th>'
   +'<th class="rep-th num" onclick="setRepSort(\'cost\')">\u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22'+_repArrow("cost")+'</th>'
   +'</tr></thead>';
 var body="";
 items.forEach(function(h){
  var d=fmtDateTime(h.ts).split(" ")[0];
  var wTxt=(h.cat!=null&&h.cat!=="")?fmtKg(h.cat):'\u2014';
  var costTxt=(h.cost!=null&&h.cost!=="")?_repMoney(parseFloat(h.cost)):'';
  body+='<tr class="rep-row">'
    +'<td>'+d+'</td><td>'+esc(_repCatName(h)||"-")+'</td><td>'+esc(_repHospName(h)||"-")+'</td>'
    +'<td class="num">'+wTxt+'</td><td class="num">'+costTxt+'</td></tr>';
  if(h.note){ body+='<tr class="rep-noterow"><td colspan="5"><span class="rep-note">\uD83D\uDCDD '+esc(h.note)+'</span></td></tr>'; }
 });
 el.innerHTML='<div class="rep-tblwrap"><table class="rep-tbl">'+th+'<tbody>'+body+'</tbody></table></div>';
}
