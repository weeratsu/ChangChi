/* sheet-sync.js - ChangChi <-> Google Sheet (LOCAL-FIRST, background). Oct 8 2026.
   Same design + data guards as CashMan. Uses ChangChi's own backup format (cats/cages/hosps/hist/sel/settings).
   No config (GitHub Pages without login) = does nothing; app keeps working on localStorage. */
(function(){
  var cfg=window.CC_SHEET_CFG;
  if(!cfg||!cfg.endpoint){ try{ cfg=JSON.parse(localStorage.getItem('cc_sheet_cfg')||'null'); }catch(e){ cfg=null; } if(cfg) window.CC_SHEET_CFG=cfg; }
  if(!cfg||!cfg.endpoint||String(cfg.endpoint).indexOf('http')!==0){
    window.CC_SHEET_ON=false;
    try{ if(/^https?:$/.test(location.protocol)){ var _b=function(){ if(document.getElementById('cc-login-bar'))return; var a=document.createElement('a'); a.id='cc-login-bar'; a.href='login.html';
      a.textContent='🔐 Login เพื่อ sync กับ Google Sheet'; a.style.cssText='position:fixed;left:0;right:0;top:0;z-index:99999;background:#2563eb;color:#fff;text-align:center;padding:10px;font:14px system-ui,sans-serif;text-decoration:none';
      document.body.appendChild(a); }; if(document.body)_b(); else window.addEventListener('DOMContentLoaded',_b); } }catch(e){}
    return;
  }
  window.CC_SHEET_ON=true;
  var DIRTY='cc_sheet_dirty', MOD='cc_last_modified', timer=null, pushing=false, gen=0, pulledOnce=false;
  var KEYS=[LS_CATS,LS_CAGES,LS_HOSP,LS_HIST,LS_SEL];
  var hadLocal=false; try{ hadLocal=!!localStorage.getItem(LS_HIST)||!!localStorage.getItem(MOD); }catch(e){}
  function dirty(v){ try{ if(v===undefined) return localStorage.getItem(DIRTY)==='1'; v?localStorage.setItem(DIRTY,'1'):localStorage.removeItem(DIRTY);}catch(e){} return false; }
  function snap(){
    return { _app:'ChangChi', _ver:1, last_modified:localStorage.getItem(MOD)||'',
      cats:load(LS_CATS,[]), cages:load(LS_CAGES,[]), hosps:load(LS_HOSP,[]), hist:load(LS_HIST,[]), sel:load(LS_SEL,{}),
      settings:{ theme:localStorage.getItem('woc_theme_v1'), order:load('woc_order_v1',null), tipHidden:localStorage.getItem('woc_tip_hidden') } };
  }
  var DEF=['\u0e19\u0e49\u0e2d\u0e07 1','\u0e19\u0e49\u0e2d\u0e07 2'];
  function isReal(x){
    if(!x||!Array.isArray(x.cats)) return false;
    if(Array.isArray(x.hist)&&x.hist.length>0) return true;
    return x.cats.some(function(c){ return c&&(c.photo||DEF.indexOf(String(c.name||''))<0); });
  }
  window.__ccIsReal=isReal;
  function badge(t,col){ try{ var el=document.getElementById('cc-sync-badge');
    if(!el){ el=document.createElement('div'); el.id='cc-sync-badge'; el.style.cssText='position:fixed;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:9999;font-size:10px;padding:3px 8px;border-radius:10px;background:rgba(255,255,255,.92);color:#555;border:1px solid #ddd;pointer-events:none'; document.body.appendChild(el); }
    el.textContent=t; el.style.color=col||''; el.style.display=''; clearTimeout(el._t); if(/synced/.test(t)) el._t=setTimeout(function(){el.style.display='none';},2500); }catch(e){} }
  function schedule(ms){ clearTimeout(timer); timer=setTimeout(push,ms); }
  function push(){
    if(!pulledOnce) return;
    if(pushing){ schedule(1500); return; }
    var d=snap();
    if(!isReal(d)){ console.warn('ChangChi: local data looks empty/default - NOT sent'); badge('\u26a0 local data empty - not sent','#c33'); return; }
    pushing=true; badge('\u2191 saving to Sheet\u2026'); var g=gen;
    fetch(cfg.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:cfg.writeToken,action:'replaceAll',data:d})})
      .then(function(r){return r.json();}).then(function(res){
        if(!res||!res.ok) throw new Error((res&&res.error)||'save failed');
        if(g===gen) dirty(false); else schedule(1500);
        badge('\u2713 synced','#2a7');
      }).catch(function(e){ console.warn('ChangChi Sheet push failed (kept locally, retry 30s):',e); badge('\u26a0 not saved: '+String((e&&e.message)||e).slice(0,80),'#c33'); schedule(30000); })
      .then(function(){ pushing=false; });
  }
  // hook ChangChi's save(): every data save marks dirty + schedules a push
  var _save=window.save;
  window.save=function(k,v){ var r=_save.apply(this,arguments); if(KEYS.indexOf(k)>=0){ try{localStorage.setItem(MOD,new Date().toISOString());}catch(e){} gen++; dirty(true); schedule(1500); } return r; };
  function apply(d){
    // same as Import in backup.js: write storage, then reload so every view uses the Sheet data
    if(Array.isArray(d.cats)) _save(LS_CATS,d.cats); if(Array.isArray(d.cages)) _save(LS_CAGES,d.cages);
    if(Array.isArray(d.hosps)) _save(LS_HOSP,d.hosps); if(Array.isArray(d.hist)) _save(LS_HIST,d.hist);
    if(d.sel&&typeof d.sel==='object') _save(LS_SEL,d.sel);
    try{ if(d.settings){ if(d.settings.theme!=null) localStorage.setItem('woc_theme_v1',d.settings.theme); if(d.settings.order!=null) _save('woc_order_v1',d.settings.order); } }catch(e){}
    try{ localStorage.setItem(MOD,d.last_modified||new Date().toISOString()); }catch(e){}
    dirty(false);
    try{ sessionStorage.setItem('cc_just_synced','1'); }catch(e){}
    location.reload();
  }
  function pull(){
    if(pulledOnce && dirty()){ schedule(0); return; }
    var g=gen; badge('\u21bb syncing\u2026');
    fetch(cfg.endpoint+'?action=all&'+'token='+encodeURIComponent(cfg.readToken||cfg.writeToken)+'&t='+Date.now())
      .then(function(r){return r.json();}).then(function(res){
        if(!res||!res.ok) throw new Error((res&&res.error)||'load failed');
        var remote=res.data||{}, first=!pulledOnce; pulledOnce=true;
        if(!first && (dirty()||g!==gen)){ badge('\u2713 synced','#2a7'); return; }
        var local=snap(), lReal=isReal(local), rReal=isReal(remote);
        var rl=remote.last_modified||'', ll=local.last_modified||'';
        if(!rReal){ if(lReal){ gen++; dirty(true); schedule(0); badge('\u2191 uploading to Sheet\u2026'); } else badge('\u2713 synced','#2a7'); return; }
        var takeRemote = !lReal || (rl && rl>ll) || (first && !hadLocal);
        if(takeRemote && !(dirty() && lReal)){
          if(JSON.stringify(remote.hist)===JSON.stringify(local.hist) && JSON.stringify(remote.cats)===JSON.stringify(local.cats) && JSON.stringify(remote.cages)===JSON.stringify(local.cages) && JSON.stringify(remote.hosps)===JSON.stringify(local.hosps)){
            try{ localStorage.setItem(MOD,rl); }catch(e){} dirty(false); badge('\u2713 synced','#2a7'); return; }
          if(sessionStorage.getItem('cc_just_synced')==='1'){ sessionStorage.removeItem('cc_just_synced'); badge('\u2713 synced','#2a7'); return; } // loop guard
          apply(remote); return;
        }
        if((ll && ll>rl) || dirty()){ gen++; dirty(true); schedule(0); }
        badge('\u2713 synced','#2a7');
      }).catch(function(e){ console.warn('ChangChi Sheet pull failed (using local data):',e); badge('\u26a0 offline: '+String((e&&e.message)||e).slice(0,80),'#c33'); });
  }
  window.ccSheetSyncNow=function(){ (pulledOnce&&dirty())?schedule(0):pull(); };
  window.addEventListener('beforeunload',function(e){ if(dirty()&&pulledOnce){ e.preventDefault(); e.returnValue=''; } });
  if(document.readyState==='complete') setTimeout(pull,300); else window.addEventListener('load',function(){ setTimeout(pull,300); });
})();
