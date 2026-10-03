// ===== Storage / state / helpers =====
var LS_CAGES="woc_cages_v2", LS_HIST="woc_hist_v2", LS_CATS="woc_cats_v2", LS_SEL="woc_sel_v1", LS_HOSP="woc_hosp_v1";

function load(k,def){try{var v=JSON.parse(localStorage.getItem(k));return v==null?def:v;}catch(e){return def;}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v));}
var cages=load(LS_CAGES,null); if(!cages||!cages.length){cages=DEFAULT_CAGES.slice();save(LS_CAGES,cages);}
var cats=load(LS_CATS,null);  if(!cats||!cats.length){cats=DEFAULT_CATS.slice();save(LS_CATS,cats);}
var DEFAULT_HOSP=[{id:"h1",name:"\u0E23\u0E1E.\u0E2A\u0E31\u0E15\u0E27\u0E4C \u0E1B\u0E23\u0E30\u0E08\u0E33"}];
var hosps=load(LS_HOSP,null); if(!hosps||!hosps.length){hosps=DEFAULT_HOSP.slice();save(LS_HOSP,hosps);}
var hist=load(LS_HIST,[]);
var sel=load(LS_SEL,{});
function defId(arr){for(var i=0;i<arr.length;i++)if(arr[i].def)return arr[i].id;return arr[0]&&arr[0].id;}
var selCage=sel.cage||defId(cages)||null;
var selCat=sel.cat||defId(cats)||null;
var selHosp=sel.hosp||defId(hosps)||null;
function persistSel(){save(LS_SEL,{cage:selCage,cat:selCat,hosp:selHosp});}
function getHosp(id){for(var i=0;i<hosps.length;i++)if(hosps[i].id===id)return hosps[i];return null;}
var histFilter="";
var editingId=null;
function pad(n){return (n<10?"0":"")+n;}
function fmtDateTime(iso){var d=new Date(iso);return pad(d.getDate())+"/"+pad(d.getMonth()+1)+"/"+d.getFullYear()+" "+pad(d.getHours())+":"+pad(d.getMinutes());}
function fmtKg(n){var v=Math.round(n*100)/100;return (v%1===0)?v.toFixed(1):(""+v);}
function catAge(dob){
 if(!dob)return "";
 var b=new Date(dob); if(isNaN(b))return "";
 var now=new Date();
 var months=(now.getFullYear()-b.getFullYear())*12+(now.getMonth()-b.getMonth());
 if(now.getDate()<b.getDate())months--;
 if(months<0)return "";
 var y=Math.floor(months/12), m=months%12;
 if(y<=0)return m+" \u0e40\u0e14\u0e37\u0e2d\u0e19";
 if(m===0)return y+" \u0e1b\u0e35";
 return y+" \u0e1b\u0e35 "+m+" \u0e40\u0e14\u0e37\u0e2d\u0e19";
}
function esc(s){return (""+s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});}
function compressImage(file,cb){
 var reader=new FileReader();
 reader.onload=function(e){
  var img=new Image();
  img.onload=function(){
   var max=480; var w=img.width,h=img.height;
   if(w>h){ if(w>max){h=Math.round(h*max/w);w=max;} } else { if(h>max){w=Math.round(w*max/h);h=max;} }
   var cv=document.createElement("canvas");cv.width=w;cv.height=h;
   cv.getContext("2d").drawImage(img,0,0,w,h);
   cb(cv.toDataURL("image/jpeg",0.72));
  };
  img.onerror=function(){toast("\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E39\u0E1B\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49");};
  img.src=e.target.result;
 };
 reader.onerror=function(){toast("\u0E2D\u0E48\u0E32\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49");};
 reader.readAsDataURL(file);
}
function pickImage(cb){
 var inp=document.createElement("input");inp.type="file";inp.accept="image/*";
 inp.onchange=function(){var f=inp.files&&inp.files[0];if(f)compressImage(f,cb);};
 inp.click();
}
function imgSrc(c){ if(c&&c.img&&IMG[c.img])return IMG[c.img]; if(c&&c.customImg)return c.customImg; return null; }
function getCage(id){for(var i=0;i<cages.length;i++)if(cages[i].id===id)return cages[i];return null;}
function getCat(id){for(var i=0;i<cats.length;i++)if(cats[i].id===id)return cats[i];return null;}
function catPhoto(c){return (c&&c.photo)?c.photo:null;}
var toastT;
function toast(msg){var t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("show");},1800);}

// --- app state ---
var cages=load(LS_CAGES,null); if(!cages||!cages.length){cages=DEFAULT_CAGES.slice();save(LS_CAGES,cages);}
var cats=load(LS_CATS,null);  if(!cats||!cats.length){cats=DEFAULT_CATS.slice();save(LS_CATS,cats);}
var hist=load(LS_HIST,[]);
var sel=load(LS_SEL,{});
var selCage=sel.cage||defId(cages)||null;
var selCat=sel.cat||defId(cats)||null;
var selHosp=sel.hosp||defId(hosps)||null;
var histFilter="";
var editingId=null;
