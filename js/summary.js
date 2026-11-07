// ===== Summary + chart =====
function renderSummary(){
 var el=document.getElementById("summaryBox");if(!el)return;
 var byCat={};
 hist.forEach(function(h){ if(h.cat==null||h.cat==="")return; var k=recCatName(h)||"(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38)";(byCat[k]=byCat[k]||[]).push(h);});
 var names=Object.keys(byCat);
 if(!names.length){el.innerHTML='<p class="empty-note" style="padding:14px">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E0A\u0E31\u0E48\u0E07\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E2A\u0E23\u0E38\u0E1B</p>';return;}
 function catByName(nm){for(var i=0;i<cats.length;i++)if(cats[i].name===nm)return cats[i];return null;}
 function avg(a){if(!a.length)return 0;var s=0;a.forEach(function(x){s+=x.cat;});return s/a.length;}
var html="";
 // ----- Vet cost summary + analysis -----
 (function(){
  function money(n){ return (Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2}); }
  var total=0, nWith=0, byCatCost={}, byMonth={}, costs=[], now=new Date(), ym=now.getFullYear()+'-'+(now.getMonth()+1), monthTot=0;
  hist.forEach(function(h){
   var c=(h.cost!=null&&h.cost!=='')?parseFloat(h.cost):0; if(isNaN(c)||c<=0) return;
   var _cs=window.__cst||{}; var _d0=new Date(h.ts); if(_cs.from&&_d0<new Date(_cs.from+'T00:00')) return; if(_cs.to&&_d0>new Date(_cs.to+'T23:59:59')) return; if(_cs.cat&&(h.catId||'')!==_cs.cat) return;
   total+=c; nWith++; costs.push(c);
   var k=recCatName(h)||'(\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38)'; byCatCost[k]=(byCatCost[k]||0)+c;
   var d=new Date(h.ts); var _g=(window.__cst||{}).grp||'m'; var mk=_g==='y'?String(d.getFullYear()):(_g==='c'?k:d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)); byMonth[mk]=(byMonth[mk]||0)+c;
   if(d.getFullYear()+'-'+(d.getMonth()+1)===ym) monthTot+=c;
  });
  var _fx=window.__cst||{};
  if(total>0||_fx.from||_fx.to||_fx.cat){
   var avg=nWith?total/nWith:0, mx=costs.length?Math.max.apply(null,costs):0, mn=costs.length?Math.min.apply(null,costs):0;
   // monthly bar chart (last up to 12 months, chronological)
   var mkeys=Object.keys(byMonth).sort(); var _cs2=window.__cst||{}; if(_cs2.grp==='c') mkeys.sort(function(a,b){return byMonth[b]-byMonth[a];});
   var _mAvg=0; mkeys.forEach(function(k){_mAvg+=byMonth[k];}); _mAvg=mkeys.length?_mAvg/mkeys.length:0;
   var maxM=0; mkeys.forEach(function(k){ if(byMonth[k]>maxM)maxM=byMonth[k]; });
   var bars='';
   mkeys.forEach(function(k){
    var hpct=maxM>0?Math.round(byMonth[k]/maxM*100):0;
    var _gg=(window.__cst||{}).grp||'m'; var mlabel=_gg==='m'?(k.slice(5)+'/'+dispYear2(k.slice(0,4))):(_gg==='y'?String(dispYear(k)):k);
    var _ap=maxM>0?Math.min(100,_mAvg/maxM*100):0;
    bars+='<div class="cbar"><div class="cbar-area"><span class="cbar-val" style="bottom:calc('+Math.max(hpct,3)+'% + 2px)">'+money(Math.round(byMonth[k]))+'</span><div class="cbar-fill" style="height:'+Math.max(hpct,3)+'%" title="'+money(byMonth[k])+'"></div>'+((window.__cst||{}).avg!==false?'<i class="cbar-avg" style="bottom:'+_ap.toFixed(1)+'%">'+(k===mkeys[mkeys.length-1]?'<b class="cavg-v">'+money(Math.round(_mAvg))+'</b>':'')+'</i>':'')+'</div><span class="cbar-lb">'+mlabel+'</span></div>';
   });
   var _st=window.__cst||{};
   var _cb=cats.map(function(c){ return '<button class="btn ghost'+(_st.cat===c.id?' on':'')+'" onclick="cstSet(\'cat\',\''+c.id+'\')">'+esc(c.name)+'</button>'; }).join('');
   var ctl='<div class="cf-box">'
    +'<div class="cf-row"><span class="cf-lbl">\uD83D\uDCC5 \u0e0a\u0e48\u0e27\u0e07\u0e40\u0e27\u0e25\u0e32</span><div class="cf-opts"><button class="btn ghost'+(_st.pre===3?' on':'')+'" onclick="cstPreset(3)">3\u0e14.</button><button class="btn ghost'+(_st.pre===6?' on':'')+'" onclick="cstPreset(6)">6\u0e14.</button><button class="btn ghost'+(_st.pre===12?' on':'')+'" onclick="cstPreset(12)">1\u0e1b\u0e35</button><button class="btn ghost'+(_st.pre===0?' on':'')+'" onclick="cstPreset(0)">\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14</button>'
    +'<span class="cf-dates"><input type="date" class="cst-date" value="'+(_st.from||'')+'" onchange="cstSet(\'from\',this.value)"> \u2013 <input type="date" class="cst-date" value="'+(_st.to||'')+'" onchange="cstSet(\'to\',this.value)"></span></div></div>'
    +'<div class="cf-row"><span class="cf-lbl">\uD83D\uDC31 \u0e41\u0e21\u0e27</span><div class="cf-opts"><button class="btn ghost'+(!_st.cat?' on':'')+'" onclick="cstSet(\'cat\',\'\')">\u0e17\u0e38\u0e01\u0e15\u0e31\u0e27</button>'+_cb+'</div></div>'
    +'<div class="cf-row"><span class="cf-lbl">\uD83D\uDCCA \u0e41\u0e2a\u0e14\u0e07</span><div class="cf-opts"><button class="btn ghost'+((_st.grp||'m')==='m'?' on':'')+'" onclick="cstSet(\'grp\',\'m\')">\u0e40\u0e14\u0e37\u0e2d\u0e19</button><button class="btn ghost'+((_st.grp||'m')==='y'?' on':'')+'" onclick="cstSet(\'grp\',\'y\')">\u0e1b\u0e35</button><button class="btn ghost'+((_st.grp||'m')==='c'?' on':'')+'" onclick="cstSet(\'grp\',\'c\')">\u0e41\u0e21\u0e27</button>'
    +'<button class="btn ghost'+(_st.avg!==false?' on':'')+'" onclick="cstSet(\'avg\','+(_st.avg===false)+')">\u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22</button></div></div></div>';
   var chartHtml=ctl+(mkeys.length?'<div class="cost-chart-h">'+({m:'\u0e23\u0e32\u0e22\u0e40\u0e14\u0e37\u0e2d\u0e19',y:'\u0e23\u0e32\u0e22\u0e1b\u0e35',c:'\u0e41\u0e22\u0e01\u0e15\u0e32\u0e21\u0e41\u0e21\u0e27'}[_st.grp||'m'])+((_st.avg!==false)?' <span class="cavg-lg"><i></i>\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22 '+money(Math.round(_mAvg))+' '+({m:'\u0e1a\u0e32\u0e17/\u0e40\u0e14\u0e37\u0e2d\u0e19',y:'\u0e1a\u0e32\u0e17/\u0e1b\u0e35',c:'\u0e1a\u0e32\u0e17/\u0e15\u0e31\u0e27'}[_st.grp||'m'])+'</span>':'')+'</div><div class="cost-chart">'+bars+'</div>':'<p class="empty-note cost-none">\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22\u0e43\u0e19\u0e0a\u0e48\u0e27\u0e07\u0e19\u0e35\u0e49</p>');
   var rows='';
   Object.keys(byCatCost).forEach(function(k){ rows+='<div class="cost-row"><span>'+esc(k)+'</span><b>'+money(byCatCost[k])+' \u0e1a\u0e32\u0e17</b></div>'; });
   html+='<div class="sum-card cost-card">'+
     '<div class="sum-head"><span class="sum-name">\ud83d\udcb0 \u0e04\u0e48\u0e32\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22\u0e2b\u0e32\u0e2b\u0e21\u0e2d</span></div>'+
     '<div class="cost-total">'+money(total)+' <small>\u0e1a\u0e32\u0e17</small></div>'+
     '<div class="cost-sub">\u0e40\u0e14\u0e37\u0e2d\u0e19\u0e19\u0e35\u0e49 '+money(monthTot)+' \u0e1a\u0e32\u0e17 \u00b7 '+nWith+' \u0e04\u0e23\u0e31\u0e49\u0e07</div>'+
     '<div class="cost-stats">'+
       '<div class="cstat"><span>\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22/\u0e04\u0e23\u0e31\u0e49\u0e07</span><b>'+money(avg)+'</b></div>'+
       '<div class="cstat"><span>\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14</span><b>'+money(mx)+'</b></div>'+
       '<div class="cstat"><span>\u0e15\u0e48\u0e33\u0e2a\u0e38\u0e14</span><b>'+money(mn)+'</b></div>'+
     '</div>'+
     chartHtml+
     '<div class="cost-bycat-h">\u0e41\u0e22\u0e01\u0e15\u0e32\u0e21\u0e41\u0e21\u0e27</div>'+
     rows+
   '</div>';
  }
 })();
 names.forEach(function(n){
  var arr=byCat[n].slice().sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  var latest=arr[0], prev=arr[1];
  var initial=(n.trim().charAt(0))||"?";
  var cobj=catByName(n);
  var deltaHtml="";
  if(prev){
   var d=Math.round((latest.cat-prev.cat)*100)/100;
   var cls=d>0?"up":(d<0?"down":"flat");
   var arrow=d>0?"\u25B2":(d<0?"\u25BC":"=");
   deltaHtml='<span class="sum-delta '+cls+'">'+arrow+' '+fmtKg(Math.abs(d))+' \u0E01\u0E01.</span>';
  } else { deltaHtml='<span class="sum-delta flat">\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01</span>'; }
  // age + neuter status line (from the cat object)
  var metaBits=[];
  if(cobj&&cobj.dob){var ag=catAge(cobj.dob); if(ag)metaBits.push("\ud83c\udf82 "+ag);}
  if(cobj){metaBits.push(cobj.neutered?"\u2702\ufe0f \u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19\u0e41\u0e25\u0e49\u0e27":"\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19");}
  var metaHtml=metaBits.length?'<div class="sum-meta">'+metaBits.join(" \u00b7 ")+'</div>':'';
  var _sphoto=cobj?(catPhoto(cobj)||""):"";
  var sAva=_sphoto?'<img class="log-ava" src="'+_sphoto+'">':'<span class="log-badge">'+esc(initial)+'</span>';
  // before/after neuter comparison (from per-log snapshot)
  var before=arr.filter(function(x){return x.neutered===false;});
  var after=arr.filter(function(x){return x.neutered===true;});
  var cmpHtml="";
  if(before.length&&after.length){
   var ab=avg(before), aa=avg(after); var dd=Math.round((aa-ab)*100)/100;
   var sign=dd>0?"+":""; 
   cmpHtml='<div class="sum-cmp">\u0e01\u0e48\u0e2d\u0e19\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19 \u0e40\u0e09\u0e25\u0e35\u0e48\u0e22 <b>'+fmtKg(ab)+'</b> \u2192 \u0e2b\u0e25\u0e31\u0e07\u0e17\u0e33\u0e2b\u0e21\u0e31\u0e19 <b>'+fmtKg(aa)+'</b> ('+sign+fmtKg(dd)+' \u0e01\u0e01.)</div>';
  }
  html+='<div class="sum-card">'+
   '<div class="sum-head">'+sAva+'<span class="sum-name">'+esc(n)+'</span></div>'+
   metaHtml+
   '<div class="sum-kg">'+fmtKg(latest.cat)+' <small>\u0E01\u0E01.</small></div>'+
   deltaHtml+
   '<div class="sum-date">\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 '+fmtDateTime(latest.ts)+' \u00B7 \u0E0A\u0E31\u0E48\u0E07 '+arr.length+' \u0E04\u0E23\u0E31\u0E49\u0E07</div>'+
   cmpHtml+
   sparkline(arr.slice().reverse())+
  '</div>';
 });
 el.innerHTML=html; // big weight chart removed per user (v81); _wtChartHtml kept for later
}
function sparkline(arr){
 // smooth theme-colored trend; non-scaling stroke so it never looks thick/thin when stretched (v79)
 if(arr.length<2) return '<div class="spark-empty">(\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E31\u0E48\u0E07 2 \u0E04\u0E23\u0E31\u0E49\u0E07\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B\u0E08\u0E36\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E01\u0E23\u0E32\u0E1F)</div>';
 var vals=arr.map(function(h){return h.cat;});
 var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals);
 var rng=(mx-mn)||1; var W=240,H=48,pad=4;
 var step=(W-pad*2)/(vals.length-1);
 var pts=vals.map(function(v,i){return [pad+i*step, H-pad-((v-mn)/rng)*(H-pad*2)];});
 var d=_smoothPath(pts);
 return '<svg class="spark" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">'+
   '<path d="'+d+' L'+pts[pts.length-1][0].toFixed(1)+' '+H+' L'+pts[0][0].toFixed(1)+' '+H+' Z" class="spark-fill"/>'+
   '<path d="'+d+'" class="spark-line" vector-effect="non-scaling-stroke"/>'+
   '</svg>'+
   '<div class="spark-range"><span>\u0E15\u0E48\u0E33\u0E2A\u0E38\u0E14 '+fmtKg(mn)+'</span><span>\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 '+fmtKg(mx)+'</span></div>';
}

// ===== Smooth weight trend chart + avg toggle + date range (Nov 7 2026) =====
window.__wt=window.__wt||{from:"",to:"",avg:true};
function wtSet(k,v){ window.__wt[k]=v; renderSummary(); }
function wtPreset(m){ var t=new Date(); window.__wt.to=""; if(m===0){window.__wt.from="";} else { var f=new Date(t.getFullYear(),t.getMonth()-m,t.getDate()); window.__wt.from=f.getFullYear()+"-"+("0"+(f.getMonth()+1)).slice(-2)+"-"+("0"+f.getDate()).slice(-2); } renderSummary(); }
window.wtSet=wtSet; window.wtPreset=wtPreset;
function _smoothPath(p){ if(p.length<2) return ""; var d="M"+p[0][0].toFixed(1)+" "+p[0][1].toFixed(1);
 for(var i=0;i<p.length-1;i++){ var p0=p[i-1]||p[i], p1=p[i], p2=p[i+1], p3=p[i+2]||p2;
  var c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6, c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
  d+=" C"+c1x.toFixed(1)+" "+c1y.toFixed(1)+","+c2x.toFixed(1)+" "+c2y.toFixed(1)+","+p2[0].toFixed(1)+" "+p2[1].toFixed(1); }
 return d; }
function _wtChartHtml(byCat,names){
 var st=window.__wt, PAL=["var(--accent)","var(--accent2)","color-mix(in srgb,var(--accent) 45%,var(--txt))","color-mix(in srgb,var(--accent2) 50%,var(--sub))","color-mix(in srgb,var(--accent) 50%,var(--card))","var(--sub)"];
 var f=st.from?new Date(st.from+"T00:00"):null, t=st.to?new Date(st.to+"T23:59:59"):null;
 var series=[], allT=[], allV=[];
 names.forEach(function(n,ci){ var pts=byCat[n].filter(function(h){ var d=new Date(h.ts); return (!f||d>=f)&&(!t||d<=t); })
   .map(function(h){return {t:+new Date(h.ts),v:+h.cat};}).sort(function(a,b){return a.t-b.t;});
  if(!pts.length) return; pts.forEach(function(p){allT.push(p.t);allV.push(p.v);});
  var a=0; pts.forEach(function(p){a+=p.v;}); series.push({n:n,c:PAL[ci%PAL.length],p:pts,avg:a/pts.length}); });
 var ctl='<div class="wt-ctl">'
  +'<label>\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48 <input type="date" class="sel" value="'+st.from+'" onchange="wtSet(\'from\',this.value)"></label>'
  +'<label>\u0e16\u0e36\u0e07 <input type="date" class="sel" value="'+st.to+'" onchange="wtSet(\'to\',this.value)"></label>'
  +'<div class="wt-pre"><button class="btn ghost" onclick="wtPreset(3)">3\u0e14.</button><button class="btn ghost" onclick="wtPreset(6)">6\u0e14.</button><button class="btn ghost" onclick="wtPreset(12)">1\u0e1b\u0e35</button><button class="btn ghost" onclick="wtPreset(0)">\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14</button>'
  +'<label class="wt-avg"><input type="checkbox" '+(st.avg?'checked':'')+' onchange="wtSet(\'avg\',this.checked)"> \u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22</label></div></div>';
 var head='<div class="wt-card"><div class="cost-h">\uD83D\uDCC8 \u0e01\u0e23\u0e32\u0e1f\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01</div>'+ctl;
 if(!allT.length) return head+'<p class="empty-note">\u0e44\u0e21\u0e48\u0e21\u0e35\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e43\u0e19\u0e0a\u0e48\u0e27\u0e07\u0e19\u0e35\u0e49</p></div>';
 var Wd=640,H=230,L=36,R=12,T=12,B=26;
 var t0=Math.min.apply(null,allT), t1=Math.max.apply(null,allT); if(t1===t0){t0-=86400000;t1+=86400000;}
 var v0=Math.min.apply(null,allV), v1=Math.max.apply(null,allV); var pad=Math.max(.2,(v1-v0)*.12); v0=Math.floor((v0-pad)*2)/2; v1=Math.ceil((v1+pad)*2)/2;
 function X(x){return L+(x-t0)/(t1-t0)*(Wd-L-R);} function Y(v){return T+(1-(v-v0)/(v1-v0))*(H-T-B);}
 var g='';
 for(var k=0;k<=4;k++){ var vv=v0+(v1-v0)*k/4, yy=Y(vv); g+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+yy+'" y2="'+yy+'" class="wt-grid"/><text x="'+(L-6)+'" y="'+(yy+4)+'" class="wt-ax" text-anchor="end">'+vv.toFixed(1)+'</text>'; }
 for(var k2=0;k2<=4;k2++){ var tt=t0+(t1-t0)*k2/4, dd=new Date(tt); g+='<text x="'+X(tt)+'" y="'+(H-6)+'" class="wt-ax" text-anchor="'+(k2===0?'start':(k2===4?'end':'middle'))+'">'+("0"+(dd.getMonth()+1)).slice(-2)+"/"+dispYear2(dd.getFullYear())+'</text>'; }
 var lines='', leg='';
 series.forEach(function(s,si){ var P=s.p.map(function(p){return [X(p.t),Y(p.v)];});
  var d=_smoothPath(P);
  if(P.length>1) lines+='<path d="'+d+' L'+P[P.length-1][0].toFixed(1)+' '+(H-B)+' L'+P[0][0].toFixed(1)+' '+(H-B)+' Z" fill="url(#wtg'+si+')"/>';
  lines+='<path d="'+d+'" fill="none" style="stroke:'+s.c+'" stroke-width="2.6" stroke-linecap="round"/>';
  if(st.avg){ var ay=Y(s.avg); lines+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+ay+'" y2="'+ay+'" style="stroke:'+s.c+'" stroke-width="1.4" stroke-dasharray="5 5" opacity=".75"/>'; }
  s.p.forEach(function(p,i){ lines+='<circle cx="'+P[i][0].toFixed(1)+'" cy="'+P[i][1].toFixed(1)+'" r="'+(s.p.length>40?1.6:2.8)+'" style="fill:'+s.c+'"><title>'+esc(s.n)+' '+fmtDateTime(new Date(p.t).toISOString()).split(" ")[0]+' \u00b7 '+fmtKg(p.v)+'</title></circle>'; });
  leg+='<span class="wt-leg"><i style="background:'+s.c+'"></i>'+esc(s.n)+(st.avg?' <small>\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22 '+fmtKg(s.avg)+'</small>':'')+'</span>'; });
 var defs='<defs>'+series.map(function(s,si){return '<linearGradient id="wtg'+si+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:'+s.c+'" stop-opacity=".22"/><stop offset="1" style="stop-color:'+s.c+'" stop-opacity="0"/></linearGradient>';}).join("")+'</defs>';
 return head+'<svg class="wt-svg" viewBox="0 0 '+Wd+' '+H+'">'+defs+g+lines+'</svg><div class="wt-legs">'+leg+'</div></div>';
}

// vet-cost range + avg toggle (v82)
window.__cst=window.__cst||(function(){ var t=new Date(), f=new Date(t.getFullYear(),t.getMonth()-11,1); return {from:f.getFullYear()+"-"+("0"+(f.getMonth()+1)).slice(-2)+"-01",to:"",avg:true,grp:"m",pre:12}; })();
function cstSet(k,v){ window.__cst[k]=v; if(k==="from"||k==="to") window.__cst.pre=-1; renderSummary(); }
function cstPreset(m){ var c=window.__cst; c.to=""; c.pre=m; if(!m){c.from="";} else { var t=new Date(), f=new Date(t.getFullYear(),t.getMonth()-m+1,1); c.from=f.getFullYear()+"-"+("0"+(f.getMonth()+1)).slice(-2)+"-01"; } renderSummary(); }
window.cstSet=cstSet; window.cstPreset=cstPreset;
