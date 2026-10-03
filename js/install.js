// ===== PWA install banner (smart: Android prompt / iOS instructions) =====
(function(){
 var LS_HIDE="woc_install_hide_v1";
 var deferredPrompt=null;

 function isStandalone(){
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone===true;
 }
 function isIOS(){
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
 }
 function isSafari(){
  var ua=window.navigator.userAgent;
  return /safari/i.test(ua) && !/crios|fxios|edgios|android/i.test(ua);
 }
 function hidden(){ try{return localStorage.getItem(LS_HIDE)==="1";}catch(e){return false;} }
 function setHidden(){ try{localStorage.setItem(LS_HIDE,"1");}catch(e){} }

 function bar(){ return document.getElementById("installBar"); }
 function hideBar(){ var b=bar(); if(b)b.style.display="none"; }
 function showBar(html){
  var b=bar(); if(!b)return;
  b.innerHTML=html;
  b.style.display="flex";
  var x=b.querySelector(".ib-close");
  if(x)x.onclick=function(){ setHidden(); hideBar(); };
 }

 function showAndroid(){
  showBar('<span class="ib-ic">\uD83D\uDCF2</span>'
    +'<span class="ib-txt">\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07 ChangChi \u0e44\u0e27\u0e49\u0e17\u0e35\u0e48\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e2e\u0e21?</span>'
    +'<button class="ib-btn" id="ibInstall">\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07</button>'
    +'<button class="ib-close" aria-label="close">\u00d7</button>');
  var btn=document.getElementById("ibInstall");
  if(btn)btn.onclick=function(){
   if(!deferredPrompt)return;
   deferredPrompt.prompt();
   deferredPrompt.userChoice.then(function(){ deferredPrompt=null; hideBar(); });
  };
 }
 function showIOS(){
  showBar('<span class="ib-ic">\uD83D\uDCF2</span>'
    +'<span class="ib-txt">\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e25\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e42\u0e2e\u0e21: \u0e41\u0e15\u0e30 <b>\u0e41\u0e0a\u0e23\u0e4c</b> \u2191 \u0e41\u0e25\u0e49\u0e27\u0e40\u0e25\u0e37\u0e2d\u0e01 <b>\u201c\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e25\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e08\u0e2d\u0e42\u0e2e\u0e21\u201d</b></span>'
    +'<button class="ib-close" aria-label="close">\u00d7</button>');
 }

 window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault(); deferredPrompt=e;
  if(!hidden() && !isStandalone()) showAndroid();
 });
 window.addEventListener('appinstalled',function(){ setHidden(); hideBar(); });

 function init(){
  if(hidden()||isStandalone()){ hideBar(); return; }
  // iOS Safari has no beforeinstallprompt -> show instructions.
  if(isIOS() && isSafari()){ showIOS(); return; }
  // Android/Chrome: wait for beforeinstallprompt (handler above). Nothing to show yet.
 }
 if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
