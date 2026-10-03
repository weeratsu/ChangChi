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
document.getElementById("totalW").addEventListener("input",calc);
document.getElementById("saveBtn").onclick=saveWeighing;
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
var _tx=document.getElementById("tipClose"); if(_tx)_tx.onclick=function(){var t=document.getElementById("tipCard"); if(t)t.style.display="none"; localStorage.setItem("woc_tip_hidden","1");};
renderCats();renderCages();renderHospSel();renderSelSummary();renderHist();renderSummary();renderCatMgr();renderCageMgr();renderHospMgr();renderCatMgr();renderCageMgr();renderThemePicker();renderOrderMgr();applyWeighOrder();calc();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__wocInit);}else{__wocInit();}
