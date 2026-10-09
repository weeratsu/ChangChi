// weigh-compact.js v4 (Oct 9 2026): NOTHING in the page changes size any more (sizes changing = list jumps).
// The weigh card stays a normal card. When it scrolls out of view, a separate FIXED mini bar appears under the
// header: [total weight] [cat weight] [💾 บันทึกผล]. Fixed elements take no space, so cats/cages never move.
(function(){
 function init(){
  var card=document.querySelector('.weigh-card'), total=document.getElementById('totalW');
  if(!card||!total) return;
  var save=document.getElementById('saveBtnTop')||document.getElementById('saveBtn');
  var catW=document.getElementById('catW');
  var bar=document.createElement('div'); bar.id='weighMini';
  bar.innerHTML='<input id="totalWMini" inputmode="decimal" placeholder="น้ำหนักรวม" autocomplete="off">'
   +'<div class="wm-cat"><span id="catWMini">\u2014</span> <small>กก.</small></div>'
   +'<button type="button" id="saveMini">💾 บันทึกผล</button>';
  document.body.appendChild(bar);
  var mi=document.getElementById('totalWMini'), mc=document.getElementById('catWMini');
  function syncOut(){ if(catW) mc.textContent=catW.textContent; if(document.activeElement!==mi) mi.value=total.value; }
  mi.addEventListener('input',function(){ total.value=mi.value; try{ total.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){} syncOut(); });
  total.addEventListener('input',syncOut);
  document.getElementById('saveMini').addEventListener('click',function(){ if(save) save.click(); setTimeout(syncOut,50); });
  var shown=false;
  function headerH(){ var h=document.querySelector('header'); return h?h.getBoundingClientRect().bottom:0; }
  function update(){
   var r=card.getBoundingClientRect(), hb=headerH();
   var want=(r.bottom < hb+20) || document.activeElement===mi;   // card gone under header (or typing in bar)
   if(want!==shown){ shown=want; bar.classList.toggle('on',want); if(want) syncOut(); }
   bar.style.top=hb+'px';
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  mi.addEventListener('blur',function(){ setTimeout(update,50); });
  update();
  window.__ccWeighMini={update:update,bar:bar};
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
