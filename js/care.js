// ===== Care log / health book (Nov 7 2026) =====
// record.care = [tagId,...]; tags in localStorage cc_care_tags: {id,name,icon,every(days|0)}
var LS_CARE="cc_care_tags";
var CARE_DEF=[{id:"vac",name:"\u0e27\u0e31\u0e04\u0e0b\u0e35\u0e19\u0e23\u0e27\u0e21",icon:"\uD83D\uDC89",every:365},{id:"rab",name:"\u0e1e\u0e34\u0e29\u0e2a\u0e38\u0e19\u0e31\u0e02\u0e1a\u0e49\u0e32",icon:"\uD83D\uDC89",every:365},
 {id:"flea",name:"\u0e2b\u0e22\u0e14\u0e2b\u0e25\u0e31\u0e07\u0e04\u0e2d",icon:"\uD83D\uDCA7",every:30},{id:"worm",name:"\u0e16\u0e48\u0e32\u0e22\u0e1e\u0e22\u0e32\u0e18\u0e34",icon:"\uD83D\uDC8A",every:90},
 {id:"nail",name:"\u0e15\u0e31\u0e14\u0e40\u0e25\u0e47\u0e1a",icon:"\u2702\uFE0F",every:0},{id:"neuter",name:"\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19",icon:"\uD83E\uDE79",every:0},{id:"checkup",name:"\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e",icon:"\uD83E\uDE7A",every:0},{id:"bath",name:"\u0e2d\u0e32\u0e1a\u0e19\u0e49\u0e33",icon:"\uD83D\uDEC1",every:0}];
function careTags(){ var t; try{t=JSON.parse(localStorage.getItem(LS_CARE));}catch(e){t=null;} return (Array.isArray(t)&&t.length)?t:CARE_DEF.slice(); }
// one-time: add neuter tag to existing saved lists (v106)
(function(){ try{ if(localStorage.getItem("cc_care_mig_neuter")) return; var t=JSON.parse(localStorage.getItem(LS_CARE)); if(Array.isArray(t)&&t.length&&!t.some(function(x){return x.id==="neuter";})){ t.push({id:"neuter",name:"\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19",icon:"\uD83E\uDE79",every:0}); localStorage.setItem(LS_CARE,JSON.stringify(t)); } localStorage.setItem("cc_care_mig_neuter","1"); }catch(e){} })();
(function(){ try{ if(localStorage.getItem("cc_care_mig_checkup")) return; var t=JSON.parse(localStorage.getItem(LS_CARE)); if(Array.isArray(t)&&t.length&&!t.some(function(x){return x.id==="checkup";})){ t.push({id:"checkup",name:"\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e",icon:"\uD83E\uDE7A",every:0}); localStorage.setItem(LS_CARE,JSON.stringify(t)); } localStorage.setItem("cc_care_mig_checkup","1"); }catch(e){} })();
function careSave(t){ localStorage.setItem(LS_CARE,JSON.stringify(t)); careRenderAll(); }
function careTag(id){ var t=careTags(); for(var i=0;i<t.length;i++) if(t[i].id===id) return t[i]; return null; }
function _careGet(elId){ var el=document.getElementById(elId); if(!el) return []; return [].map.call(el.querySelectorAll(".care-chip.on"),function(b){return b.getAttribute("data-id");}); }
function _careSet(elId,ids){ var el=document.getElementById(elId); if(!el) return; ids=ids||[];
 el.innerHTML=careTags().map(function(t){ return '<button type="button" class="care-chip'+(ids.indexOf(t.id)>=0?' on':'')+'" data-id="'+esc(t.id)+'">'+t.icon+' '+esc(t.name)+'</button>'; }).join("");
 el.querySelectorAll(".care-chip").forEach(function(b){ b.onclick=function(){ b.classList.toggle("on"); }; }); }
window._careGet=_careGet; window._careSet=_careSet;
function careIcons(h){ if(!h||!h.care||!h.care.length) return ""; return '<span class="care-ic">'+h.care.map(function(id){ var t=careTag(id); return t?'<span title="'+esc(t.name)+'">'+t.icon+'</span>':''; }).join("")+'</span>'; }
window.careIcons=careIcons;
function _d(s){ var d=new Date(s); d.setHours(0,0,0,0); return d; }
function _fmtD(d){ return fmtDateTime(d.toISOString()).split(" ")[0]; }
// latest done per cat+tag
function careLatest(){ var L={}; hist.forEach(function(h){ if(!h.care||!h.care.length||h.kind==="appt") return; var cid=h.catId||""; h.care.forEach(function(id){ var k=cid+"|"+id; if(!L[k]||new Date(h.ts)>new Date(L[k].ts)) L[k]=h; }); }); return L; }
// due rows for the appointment card (overdue or within 14 days)
function _careDueRows(){ var out=[], L=careLatest(), today=_d(new Date());
 Object.keys(L).forEach(function(k){ var p=k.split("|"), t=careTag(p[1]); if(!t||!t.every) return; var c=getCat(p[0]); if(!c) return;
  var due=_d(L[k].ts); due.setDate(due.getDate()+(+t.every)); var days=Math.round((due-today)/86400000); if(days>14) return;
  var iso=due.getFullYear()+"-"+pad(due.getMonth()+1)+"-"+pad(due.getDate());
  out.push({k:c.name,d:days<0?new Date():new Date(iso+"T09:00"),days:days<0?0:days,
   h:{id:"care_"+k,virt:1,catId:c.id,nextAppt:iso,note:t.icon+" \u0e04\u0e23\u0e1a\u0e23\u0e2d\u0e1a "+t.name+(days<0?" (\u0e40\u0e25\u0e22\u0e21\u0e32 "+(-days)+" \u0e27\u0e31\u0e19)":"")}}); });
 return out; }
window._careDueRows=_careDueRows;
// health book card in summary
function careBookHtml(){ var L=careLatest(), tags=careTags(), today=_d(new Date()), html="";
 cats.forEach(function(c){ var rows="";
  tags.forEach(function(t){ var h=L[c.id+"|"+t.id]; if(!h) return; var last=_d(h.ts), nx="";
   if(t.every){ var due=new Date(last); due.setDate(due.getDate()+(+t.every)); var dd=Math.round((due-today)/86400000);
    nx=dd<0?'<span class="cb-late">\u26A0\uFE0F \u0e40\u0e25\u0e22\u0e21\u0e32 '+(-dd)+' \u0e27\u0e31\u0e19</span>':'<span class="cb-next">\u0e04\u0e23\u0e31\u0e49\u0e07\u0e16\u0e31\u0e14\u0e44\u0e1b '+_fmtD(due)+' (\u0e2d\u0e35\u0e01 '+dd+' \u0e27\u0e31\u0e19)</span>'; }
   rows+='<div class="cb-row" onclick="careShowHist(\''+c.id+'\',\''+t.id+'\')"><span class="cb-n">'+t.icon+' '+esc(t.name)+'</span><span class="cb-l">\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14 '+_fmtD(last)+'</span>'+nx+'</div>'; });
  if(rows) html+='<div class="cb-cat"><div class="cb-h">'+esc(c.name)+'</div>'+rows+'</div>'; });
 return '<div class="sum-card care-book"><div class="sum-head"><span class="sum-name">\uD83D\uDCD2 \u0e2a\u0e21\u0e38\u0e14\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e</span></div>'+(html||'<p class="empty-note">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 \u2014 \u0e40\u0e25\u0e37\u0e2d\u0e01 \u201c\u0e17\u0e33\u0e2d\u0e30\u0e44\u0e23\u0e1a\u0e49\u0e32\u0e07\u201d \u0e15\u0e2d\u0e19\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e44\u0e14\u0e49\u0e40\u0e25\u0e22</p>')+'</div>'; }
function careShowHist(cid,tid){ var t=careTag(tid), c=getCat(cid); var L=hist.filter(function(h){ return h.catId===cid&&h.care&&h.care.indexOf(tid)>=0; }).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
 askConfirm((c?c.name:"")+" \u00b7 "+(t?t.icon+" "+t.name:"")+"\n\n"+L.map(function(h){ return "\u2022 "+fmtDateTime(h.ts).split(" ")[0]+(recHospName(h)?"  "+recHospName(h):""); }).join("\n"),null,{ok:"OK",cancel:"\u0e1b\u0e34\u0e14"}); }
window.careShowHist=careShowHist;
// settings manager
function careRenderMgr(){ var el=document.getElementById("careMgr"); if(!el) return; var t=careTags();
 el.innerHTML=t.map(function(x,i){ return '<div class="care-mrow"><input class="cm-ic" value="'+esc(x.icon)+'" data-i="'+i+'" data-k="icon"><input class="cm-nm" placeholder="\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e43\u0e2b\u0e21\u0e48" value="'+esc(x.name)+'" data-i="'+i+'" data-k="name"><label class="cm-ev">\u0e17\u0e38\u0e01 <input inputmode="numeric" value="'+(x.every||"")+'" placeholder="-" data-i="'+i+'" data-k="every"> \u0e27\u0e31\u0e19</label><button class="del" data-del="'+i+'">\u00d7</button></div>'; }).join("");
 el.querySelectorAll("input").forEach(function(inp){ inp.onchange=function(){ var a=careTags(), i=+inp.getAttribute("data-i"), k=inp.getAttribute("data-k"); a[i][k]=k==="every"?(parseInt(inp.value)||0):inp.value.trim(); careSave(a); }; });
 el.querySelectorAll("[data-del]").forEach(function(b){ b.onclick=function(){ var a=careTags(), i=+b.getAttribute("data-del"); askConfirm("\u0e25\u0e1a "+a[i].name+" ?",function(){ a.splice(i,1); careSave(a); },{danger:true}); }; }); }
function careAdd(){ var a=careTags(); a.push({id:"t"+Date.now(),name:"",icon:"\uD83E\uDE7A",every:0}); careSave(a); setTimeout(function(){ var l=document.querySelectorAll("#careMgr .cm-nm"); if(l.length) l[l.length-1].focus(); },30); }
window.careAdd=careAdd;
function careRenderAll(){ _careSet("careW",_careGet("careW")); careRenderMgr(); try{renderSummary();}catch(e){} try{renderAppts();}catch(e){} try{renderReport();}catch(e){} }
// wrap summary to append the book
(function(){ var o=window.renderSummary; if(typeof o!=="function"||o._care) return; var f=function(){ var r=o.apply(this,arguments); var el=document.getElementById("summaryBox"); if(el) el.insertAdjacentHTML("afterbegin",careBookHtml()); return r; }; f._care=1; window.renderSummary=f; })();
// report: care filter chips
window.__repCare="";
function careRepFilterHtml(){ var t=careTags(); return '<button class="fchip'+(!window.__repCare?' on':'')+'" onclick="window.__repCare=\'\';renderReport()">\u0e17\u0e38\u0e01\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23</button>'+t.map(function(x){ return '<button class="fchip'+(window.__repCare===x.id?' on':'')+'" onclick="window.__repCare=\''+x.id+'\';renderReport()">'+x.icon+' '+esc(x.name)+'</button>'; }).join("")+'<button class="fchip'+(window.__repCare==="__none"?' on':'')+'" onclick="window.__repCare=\'__none\';renderReport()">\u2754 \u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38</button>'; }
(function(){ var o=window.renderReport; if(typeof o!=="function"||o._care) return; var f=function(){ var r=o.apply(this,arguments); var el=document.getElementById("repCare"); if(el) el.innerHTML=careRepFilterHtml(); return r; }; f._care=1; window.renderReport=f; })();
document.addEventListener("DOMContentLoaded",function(){ _careSet("careW",[]); careRenderMgr(); });
setTimeout(function(){ _careSet("careW",_careGet("careW")); careRenderMgr(); try{renderSummary();renderReport();renderAppts();}catch(e){} },50);
