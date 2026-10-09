// weigh-compact.js v3 (Oct 9 2026): slim bar while scrolled, but never while typing; no flicker.
(function(){
 function init(){
  var card=document.querySelector('.weigh-card'); if(!card) return;
  var btn=document.getElementById('saveBtnTop');
  if(btn) btn.innerHTML=btn.innerHTML.replace(/<span class="lbl-long">([^<]*)<\/span>/,'$1');   // keep "💾 บันทึก" visible
  var hint=document.createElement('span'); hint.className='weigh-expand-hint'; hint.textContent='\u25be'; card.appendChild(hint);
  var on=false, forced=false, ON=180, OFF=60;              // hysteresis: compact after 180px, expand only near top
  function typing(){ var a=document.activeElement; return !!(a && card.contains(a) && /INPUT|TEXTAREA/.test(a.tagName)); }
  // Spacer (Oct 9 2026 v3): when the card shrinks, an invisible spacer takes the freed height so the
  // cat/cage list below does NOT jump up and vanish under the finger.
  var spacer=document.createElement('div'); spacer.className='weigh-spacer'; spacer.style.height='0px';
  if(card.parentNode) card.parentNode.insertBefore(spacer, card.nextSibling);
  function set(v){
   if(v===on) return; on=v;
   if(v){ var h1=card.offsetHeight; card.classList.add('compact'); var h2=card.offsetHeight; spacer.style.height=Math.max(0,h1-h2)+'px'; }
   else { card.classList.remove('compact'); spacer.style.height='0px'; }
  }
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
