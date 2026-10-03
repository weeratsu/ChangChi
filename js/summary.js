// ===== Summary + chart =====
function renderSummary(){
 var el=document.getElementById("summaryBox");if(!el)return;
 var byCat={};
 hist.forEach(function(h){var k=h.catName||"(\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38)";(byCat[k]=byCat[k]||[]).push(h);});
 var names=Object.keys(byCat);
 if(!names.length){el.innerHTML='<p class="empty-note" style="padding:14px">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E0A\u0E31\u0E48\u0E07\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E2A\u0E23\u0E38\u0E1B</p>';return;}
 function catByName(nm){for(var i=0;i<cats.length;i++)if(cats[i].name===nm)return cats[i];return null;}
 function avg(a){if(!a.length)return 0;var s=0;a.forEach(function(x){s+=x.cat;});return s/a.length;}
 var html="";
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
 el.innerHTML=html;
}
function sparkline(arr){
 // arr oldest->newest; draw a tiny inline SVG weight trend
 if(arr.length<2) return '<div class="spark-empty">(\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E31\u0E48\u0E07 2 \u0E04\u0E23\u0E31\u0E49\u0E07\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B\u0E08\u0E36\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E01\u0E23\u0E32\u0E1F)</div>';
 var vals=arr.map(function(h){return h.cat;});
 var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals);
 var rng=(mx-mn)||1; var W=240,H=48,pad=4;
 var step=(W-pad*2)/(vals.length-1);
 var pts=vals.map(function(v,i){var x=pad+i*step;var y=H-pad-((v-mn)/rng)*(H-pad*2);return [x,y];});
 var d=pts.map(function(p,i){return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1);}).join(" ");
 var dots=pts.map(function(p){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.2" fill="#14b8a6"/>';}).join("");
 var last=pts[pts.length-1];
 return '<svg class="spark" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">'+
   '<path d="'+d+'" fill="none" stroke="#14b8a6" stroke-width="2"/>'+dots+
   '</svg>'+
   '<div class="spark-range"><span>\u0E15\u0E48\u0E33\u0E2A\u0E38\u0E14 '+fmtKg(mn)+'</span><span>\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 '+fmtKg(mx)+'</span></div>';
}
