// ===== Pull-to-refresh (standalone PWA) =====
(function(){
 var ind=null, startY=0, pulling=false, dist=0;
 var THRESH=70, MAX=120;
 function isStandalone(){ return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone===true; }
 function reload(){
  try{ var base=location.href.split("?")[0].split("#")[0]; location.replace(base+"?r="+Date.now()); }
  catch(e){ location.reload(); }
 }
 function ensureInd(){
  ind=document.getElementById("ptrInd");
  if(!ind){ ind=document.createElement("div"); ind.id="ptrInd"; ind.className="ptr-ind"; ind.innerHTML='<span class="ptr-spin">\u21bb</span><span class="ptr-txt"></span>'; document.body.appendChild(ind); }
 }
 function setInd(d, ready){
  if(!ind)return;
  var h=Math.min(d,MAX);
  ind.style.height=h+"px";
  ind.style.opacity=Math.min(1,d/THRESH);
  var txt=ind.querySelector(".ptr-txt");
  var spin=ind.querySelector(".ptr-spin");
  if(txt)txt.textContent=ready?"\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a":"\u0e14\u0e36\u0e07\u0e25\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a";
  if(spin)spin.style.transform="rotate("+(d*2.6)+"deg)";
 }
 function onStart(e){
  if(window.scrollY>0){pulling=false;return;}
  startY=e.touches[0].clientY; pulling=true; dist=0; ensureInd();
 }
 function onMove(e){
  if(!pulling)return;
  dist=e.touches[0].clientY-startY;
  if(dist<=0){ setInd(0,false); return; }
  if(window.scrollY>0){ pulling=false; setInd(0,false); return; }
  // Resist and show indicator; prevent native rubber-band only while actively pulling from top
  if(dist>6 && e.cancelable)e.preventDefault();
  setInd(dist, dist>=THRESH);
 }
 function onEnd(){
  if(!pulling)return; pulling=false;
  var ready=dist>=THRESH;
  if(ready){
   if(ind){ ind.style.height="46px"; ind.classList.add("ptr-loading"); var t=ind.querySelector(".ptr-txt"); if(t)t.textContent="\u0e01\u0e33\u0e25\u0e31\u0e07\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a..."; }
   setTimeout(reload,250);
  } else {
   if(ind){ ind.style.height="0px"; ind.style.opacity="0"; }
  }
  dist=0;
 }
 function init(){
  // Enable everywhere (works in Safari tab too), but most useful in standalone where there is no browser pull-to-refresh.
  document.addEventListener("touchstart",onStart,{passive:true});
  document.addEventListener("touchmove",onMove,{passive:false});
  document.addEventListener("touchend",onEnd,{passive:true});
 }
 if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
