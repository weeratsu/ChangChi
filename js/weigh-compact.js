// weigh-compact.js v2 (Oct 9 2026): slim bar while scrolled, but never while typing; no flicker.
(function(){
 function init(){
  var card=document.querySelector('.weigh-card'); if(!card) return;
  var btn=document.getElementById('saveBtnTop');
  if(btn) btn.innerHTML=btn.innerHTML.replace(/<span class="lbl-long">([^<]*)<\/span>/,'$1');   // keep "💾 บันทึก" visible
  var hint=document.createElement('span'); hint.className='weigh-expand-hint'; hint.textContent='\u25be'; card.appendChild(hint);
  var on=false, forced=false, ON=180, OFF=60;              // hysteresis: compact after 180px, expand only near top
  function typing(){ var a=document.activeElement; return !!(a && card.contains(a) && /INPUT|TEXTAREA/.test(a.tagName)); }
  function set(v){ if(v!==on){ on=v; card.classList.toggle('compact',v); } }
  function update(){
   var y=window.scrollY||document.documentElement.scrollTop||0;
   if(typing()) return;                                   // keyboard open: freeze layout (no jumping under the finger)
   if(y<=OFF){ forced=false; set(false); return; }
   if(y>=ON && !forced) set(true);
  }
  card.addEventListener('click',function(e){
   if(!card.classList.contains('compact')) return;
   if(e.target.closest('input,button')) return;
   forced=true; set(false);
  });
  window.addEventListener('scroll',update,{passive:true});
  update();
  window.__ccWeighCompact={update:update,card:card};
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
