// ===== Weigh-screen step ordering (user-customizable) =====
var LS_ORDER="woc_order_v1";
var STEP_LABELS={weigh:"\u2696\ufe0f \u0e0a\u0e48\u0e2d\u0e07\u0e04\u0e35\u0e22\u0e4c\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01 + \u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c", cat:"\ud83d\udc31 \u0e40\u0e25\u0e37\u0e2d\u0e01\u0e41\u0e21\u0e27", cage:"\ud83c\udfe0 \u0e40\u0e25\u0e37\u0e2d\u0e01\u0e01\u0e23\u0e07", hosp:"\ud83c\udfe5 \u0e42\u0e23\u0e07\u0e1e\u0e22\u0e32\u0e1a\u0e32\u0e25 + \u0e2b\u0e21\u0e32\u0e22\u0e40\u0e2b\u0e15\u0e38"};
var DEFAULT_ORDER=["weigh","cat","cage","hosp"];
function loadOrder(){
 var o; try{o=JSON.parse(localStorage.getItem(LS_ORDER));}catch(e){o=null;}
 if(!o||!o.length)o=DEFAULT_ORDER.slice();
 // ensure every known key present exactly once (repair if keys added/removed)
 var out=[],seen={};
 o.forEach(function(k){if(STEP_LABELS[k]&&!seen[k]){out.push(k);seen[k]=1;}});
 DEFAULT_ORDER.forEach(function(k){if(!seen[k]){out.push(k);seen[k]=1;}});
 return out;
}
function saveOrder(o){localStorage.setItem(LS_ORDER,JSON.stringify(o));}
function applyWeighOrder(){
 var sec=document.getElementById("view-weigh"); if(!sec)return;
 var order=loadOrder();
 order.forEach(function(k){
  var card=sec.querySelector('[data-wkey="'+k+'"]');
  var saveBtn=document.getElementById("saveBtn");
  if(card)sec.insertBefore(card, saveBtn); // move before the save button (keeps save last)
 });
}
function renderOrderMgr(){
 var el=document.getElementById("orderMgr"); if(!el)return;
 var order=loadOrder(); el.innerHTML="";
 order.forEach(function(k,idx){
  var row=document.createElement("div"); row.className="order-row";
  row.innerHTML='<span class="order-num">'+(idx+1)+'</span><span class="order-label">'+STEP_LABELS[k]+'</span>'+
   '<span class="order-btns">'+
   '<button class="order-up"'+(idx===0?' disabled':'')+'>\u25b2</button>'+
   '<button class="order-down"'+(idx===order.length-1?' disabled':'')+'>\u25bc</button>'+
   '</span>';
  row.querySelector(".order-up").onclick=function(){if(idx>0){var t=order[idx-1];order[idx-1]=order[idx];order[idx]=t;saveOrder(order);renderOrderMgr();applyWeighOrder();}};
  row.querySelector(".order-down").onclick=function(){if(idx<order.length-1){var t=order[idx+1];order[idx+1]=order[idx];order[idx]=t;saveOrder(order);renderOrderMgr();applyWeighOrder();}};
  el.appendChild(row);
 });
}
