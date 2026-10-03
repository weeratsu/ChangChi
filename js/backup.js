// ===== Full data backup / restore (all data as one JSON file) =====
function exportAll(){
 try{
  var data={
   _app:"ChangChi", _ver:1, _exportedAt:new Date().toISOString(),
   cats: load(LS_CATS,[]),
   cages: load(LS_CAGES,[]),
   hosps: load(LS_HOSP,[]),
   hist: load(LS_HIST,[]),
   sel: load(LS_SEL,{}),
   settings: {
     theme: localStorage.getItem("woc_theme_v1"),
     order: load("woc_order_v1", null),
     tipHidden: localStorage.getItem("woc_tip_hidden")
   }
  };
  var json=JSON.stringify(data,null,2);
  var blob=new Blob([json],{type:"application/json;charset=utf-8;"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");a.href=url;
  var d=new Date();
  a.download="changchi_backup_"+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+".json";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},1000);
  toast("\u0e2a\u0e33\u0e23\u0e2d\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14\u0e41\u0e25\u0e49\u0e27");
 }catch(err){toast("\u0e2a\u0e33\u0e23\u0e2d\u0e07\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08: "+err.message);}
}
function importAll(file){
 var fr=new FileReader();
 fr.onload=function(e){
  try{
   var data=JSON.parse(e.target.result);
   if(!data||typeof data!=="object"){toast("\u0e44\u0e1f\u0e25\u0e4c\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07");return;}
   var n=(data.hist?data.hist.length:0);
   if(!confirm("\u0e01\u0e39\u0e49\u0e04\u0e37\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e08\u0e30\u0e40\u0e02\u0e35\u0e22\u0e19\u0e17\u0e31\u0e1a\u0e02\u0e2d\u0e07\u0e40\u0e14\u0e34\u0e21\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14 ("+n+" \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e0a\u0e31\u0e48\u0e07) \u0e22\u0e37\u0e19\u0e22\u0e31\u0e19?"))return;
   if(Array.isArray(data.cats)) save(LS_CATS,data.cats);
   if(Array.isArray(data.cages)) save(LS_CAGES,data.cages);
   if(Array.isArray(data.hosps)) save(LS_HOSP,data.hosps);
   if(Array.isArray(data.hist)) save(LS_HIST,data.hist);
   if(data.sel&&typeof data.sel==="object") save(LS_SEL,data.sel);
   if(data.settings&&typeof data.settings==="object"){
     if(data.settings.theme!=null) localStorage.setItem("woc_theme_v1",data.settings.theme);
     if(data.settings.order!=null) save("woc_order_v1",data.settings.order);
     if(data.settings.tipHidden!=null) localStorage.setItem("woc_tip_hidden",data.settings.tipHidden);
   }
   toast("\u0e01\u0e39\u0e49\u0e04\u0e37\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e41\u0e25\u0e49\u0e27 \u0e01\u0e33\u0e25\u0e31\u0e07\u0e23\u0e35\u0e42\u0e2b\u0e25\u0e14...");
   setTimeout(function(){location.reload();},800);
  }catch(err){toast("\u0e01\u0e39\u0e49\u0e04\u0e37\u0e19\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08: "+err.message);}
 };
 fr.onerror=function(){toast("\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e1f\u0e25\u0e4c\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49");};
 fr.readAsText(file);
}
function pickBackup(){
 var inp=document.createElement("input");inp.type="file";inp.accept="application/json,.json";
 inp.onchange=function(){var f=inp.files&&inp.files[0];if(f)importAll(f);};
 inp.click();
}
