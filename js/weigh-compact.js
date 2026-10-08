// weigh-compact.js (Oct 8 2026): shrink the pinned weigh card while the page is scrolled.
(function(){
 function init(){
  var card=document.querySelector('.weigh-card'); if(!card) return;
  var btn=document.getElementById('saveBtnTop');
  if(btn && btn.innerHTML.indexOf('lbl-long')<0) btn.innerHTML=btn.innerHTML.replace('บันทึกผล','<span class="lbl-long">บันทึกผล</span>');
  var hint=document.createElement('span'); hint.className='weigh-expand-hint'; hint.textContent='\u25be'; card.appendChild(hint);
  var pinned=false, forced=false, T=120;
  function update(){
   var y=window.scrollY||document.documentElement.scrollTop||0;
   if(y<=T) forced=false;
   var on=y>T && !forced;
   if(on!==pinned){ pinned=on; card.classList.toggle('compact',on); }
  }
  // tap on the compact bar (not on the input / save button) -> expand until scrolled back to top
  card.addEventListener('click',function(e){
   if(!card.classList.contains('compact')) return;
   if(e.target.closest('input,button')) return;
   forced=true; card.classList.remove('compact'); pinned=false;
  });
  window.addEventListener('scroll',update,{passive:true});
  update();
  window.__ccWeighCompact={update:update,card:card};
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
