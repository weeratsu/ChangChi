// ===== Birthday greeting =====
(function(){
 function todayMD(){ var d=new Date(); return (d.getMonth()+1)+"-"+d.getDate(); }
 function thisYear(){ return new Date().getFullYear(); }
 function dobMD(dob){ if(!dob)return null; var b=new Date(dob); if(isNaN(b))return null; return (b.getMonth()+1)+"-"+b.getDate(); }
 function seenKey(catId){ return "woc_bday_seen_"+catId+"_"+thisYear(); }
 function seen(catId){ try{return localStorage.getItem(seenKey(catId))==="1";}catch(e){return false;} }
 function markSeen(catId){ try{localStorage.setItem(seenKey(catId),"1");}catch(e){} }

 function overlay(){ return document.getElementById("bdayOverlay"); }
 function closeBday(){ var o=overlay(); if(o){o.classList.remove("show"); setTimeout(function(){o.style.display="none";},200);} }

 function showFor(cat){
  var o=overlay(); if(!o)return;
  var photo=(typeof catPhoto==="function")?(catPhoto(cat)||""):"";
  var ageTxt=(typeof catAge==="function"&&cat.dob)?catAge(cat.dob):"";
  // Image: use the cat's own photo if present, else a placeholder block (to be replaced with a supplied image later).
  var imgHtml = '<img class="bday-photo bday-art" src="assets/birthday.jpg?v23" alt="">';
  o.innerHTML =
   '<div class="bday-box">'
   + '<button class="bday-x" id="bdayClose">\u00d7</button>'
   + '<div class="bday-conf">\uD83C\uDF89\uD83C\uDF8A\u2728</div>'
   + imgHtml
   + '<div class="bday-title">\u0e2a\u0e38\u0e02\u0e2a\u0e31\u0e19\u0e15\u0e4c\u0e27\u0e31\u0e19\u0e40\u0e01\u0e34\u0e14</div>'
   + '<div class="bday-name">'+esc(cat.name||"")+' \uD83C\uDF82</div>'
   + (ageTxt?('<div class="bday-age">\u0e04\u0e23\u0e1a '+esc(ageTxt)+' \u0e41\u0e25\u0e49\u0e27!</div>'):'')
   + '<div class="bday-msg">\u0e02\u0e2d\u0e43\u0e2b\u0e49\u0e2b\u0e19\u0e39\u0e19\u0e49\u0e2d\u0e22\u0e2a\u0e38\u0e02\u0e20\u0e32\u0e1e\u0e41\u0e02\u0e47\u0e07\u0e41\u0e23\u0e07 \u0e01\u0e34\u0e19\u0e40\u0e22\u0e2d\u0e30 \u0e46 \u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e2a\u0e27\u0e22 \u0e2d\u0e22\u0e39\u0e48\u0e01\u0e31\u0e1a\u0e40\u0e23\u0e32\u0e44\u0e1b\u0e19\u0e32\u0e19 \u0e46 \u0e19\u0e30 \u2764\ufe0f</div>'
   + '<button class="btn bday-ok" id="bdayOk">\u0e02\u0e2d\u0e1a\u0e04\u0e38\u0e13! \uD83C\uDF88</button>'
   + '</div>';
  o.style.display="flex";
  // force reflow then add show for transition
  void o.offsetWidth; o.classList.add("show");
  var x=document.getElementById("bdayClose"), ok=document.getElementById("bdayOk");
  if(x)x.onclick=closeBday; if(ok)ok.onclick=closeBday;
  o.onclick=function(e){ if(e.target===o)closeBday(); };
  markSeen(cat.id);
 }

 function checkBirthdays(){
  if(typeof cats==="undefined"||!cats||!cats.length)return;
  var md=todayMD();
  for(var i=0;i<cats.length;i++){
   var c=cats[i];
   if(c.dob && dobMD(c.dob)===md && !seen(c.id)){ showFor(c); break; } // one at a time
  }
 }
 window.checkBirthdays=checkBirthdays;
 if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',checkBirthdays);}else{setTimeout(checkBirthdays,300);}
})();
