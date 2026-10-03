// ===== App init / view switch / wiring =====
function switchView(v){
 document.querySelectorAll(".view").forEach(function(x){x.classList.remove("on");});
 document.getElementById("view-"+v).classList.add("on");
 if(v==="summary")renderSummary();
 if(v==="hist")renderHist();
 if(v==="manage"){renderCatMgr();renderCageMgr();renderHospMgr();renderThemePicker();renderOrderMgr();}
 document.querySelectorAll(".tabbar button").forEach(function(b){b.classList.toggle("on",b.dataset.view===v);});
 window.scrollTo(0,0);
}

function __wocInit(){
document.querySelectorAll(".tabbar button").forEach(function(b){b.onclick=function(){switchView(b.dataset.view);};});
var _twi=document.getElementById("totalW"); if(_twi)_twi.addEventListener("input",_syncFromTotal);
var _cwi=document.getElementById("catWInput"); if(_cwi)_cwi.addEventListener("input",_syncFromCat);
var _sb=document.getElementById("saveBtn"); if(_sb)_sb.onclick=saveWeighing;
var _sbt=document.getElementById("saveBtnTop"); if(_sbt)_sbt.onclick=saveWeighing;
document.getElementById("addCage").onclick=addCage;
document.getElementById("addCat").onclick=addCat;
var _ex=document.getElementById("exportCSV"); if(_ex)_ex.onclick=exportCSV;
var _ah=document.getElementById("addHosp"); if(_ah)_ah.onclick=addHosp;
var _ea=document.getElementById("exportAllBtn"); if(_ea)_ea.onclick=exportAll;
var _ia=document.getElementById("importAllBtn"); if(_ia)_ia.onclick=pickBackup;
var _mo=document.getElementById("manualBtn"); if(_mo)_mo.onclick=function(){openManual();};
var _mc=document.getElementById("mCancel"); if(_mc)_mc.onclick=closeManual;
var _ms=document.getElementById("mSave"); if(_ms)_ms.onclick=saveManual;
var _dt=document.getElementById("tmplBtn"); if(_dt)_dt.onclick=downloadTemplate;
var _im=document.getElementById("importBtn"); if(_im)_im.onclick=pickCSV;
var _mbg=document.getElementById("manualModal"); if(_mbg)_mbg.onclick=function(e){if(e.target===_mbg)closeManual();};
document.getElementById("clearHist").onclick=function(){if(!hist.length){toast("\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34");return;}if(confirm("\u0E25\u0E49\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E0A\u0E31\u0E48\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14?")){hist=[];save(LS_HIST,hist);renderHist();toast("\u0E25\u0E49\u0E32\u0E07\u0E41\u0E25\u0E49\u0E27");}};
var _tc=document.getElementById("tipCard"); if(_tc&&localStorage.getItem("woc_tip_hidden")==="1")_tc.style.display="none";
var _fib=document.getElementById("fixImportBtn"); if(_fib)_fib.onclick=function(){ if(confirm("\u0e41\u0e01\u0e49\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e02\u0e2d\u0e07\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e17\u0e35\u0e48\u0e19\u0e33\u0e40\u0e02\u0e49\u0e32\u0e08\u0e32\u0e01 CSV \u0e43\u0e2b\u0e49\u0e40\u0e1b\u0e47\u0e19\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e41\u0e21\u0e27?")){fixImportedWeights();} };
var _rb=document.getElementById("reloadBtn"); if(_rb)_rb.onclick=function(){ try{var base=location.href.split("?")[0].split("#")[0]; location.replace(base+"?r="+Date.now());}catch(e){location.reload();} };
var _vl=document.getElementById("verLine"); if(_vl){var _d=new Date(); _vl.textContent="\u0e40\u0e27\u0e2d\u0e23\u0e4c\u0e0a\u0e31\u0e19 v23 \u00b7 \u0e42\u0e2b\u0e25\u0e14\u0e40\u0e21\u0e37\u0e48\u0e2d "+_d.getHours().toString().padStart(2,"0")+":"+_d.getMinutes().toString().padStart(2,"0");}
var _tx=document.getElementById("tipClose"); if(_tx)_tx.onclick=function(){var t=document.getElementById("tipCard"); if(t)t.style.display="none"; localStorage.setItem("woc_tip_hidden","1");};
renderCats();renderCages();renderHospSel();renderSelSummary();renderHist();renderSummary();renderCatMgr();renderCageMgr();renderHospMgr();renderCatMgr();renderCageMgr();renderThemePicker();renderOrderMgr();applyWeighOrder();calc();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__wocInit);}else{__wocInit();}
