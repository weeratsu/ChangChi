// ===== Square (1:1) image cropper \u2014 overrides pickImage() to add crop step =====
// Output: 400x400 JPEG data URI. Pan by drag, zoom by slider.
(function(){
 var VIEW=280;   // on-screen crop frame size (px)
 var OUT=400;    // output size (px)
 var state=null; // {img, scale, minScale, maxScale, x, y, cb}

 function ensureModal(){
  if(document.getElementById("cropModal"))return;
  var m=document.createElement("div"); m.className="modal"; m.id="cropModal";
  m.innerHTML=
   '<div class="modal-box crop-box">'
   +'<h3>\u270c\ufe0f \u0e04\u0e23\u0e2d\u0e1b\u0e23\u0e39\u0e1b (1:1)</h3>'
   +'<div class="crop-stage" id="cropStage"><canvas id="cropCanvas" width="'+VIEW+'" height="'+VIEW+'"></canvas><div class="crop-ring"></div></div>'
   +'<div class="crop-zoom"><span>\u2212</span><input type="range" id="cropZoom" min="1" max="3" step="0.01" value="1"><span>+</span></div>'
   +'<div class="modal-btns"><button class="btn ghost" id="cropCancel">\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01</button><button class="btn" id="cropOk">\u0e43\u0e0a\u0e49\u0e23\u0e39\u0e1b\u0e19\u0e35\u0e49</button></div>'
   +'</div>';
  document.body.appendChild(m);
  document.getElementById("cropCancel").onclick=closeCrop;
  m.onclick=function(e){if(e.target===m)closeCrop();};
  document.getElementById("cropZoom").oninput=function(){ if(!state)return; state.scale=state.minScale*parseFloat(this.value); clampPan(); draw(); };
  document.getElementById("cropOk").onclick=confirmCrop;
  var cv=document.getElementById("cropCanvas");
  var drag=null;
  function pt(e){var t=e.touches?e.touches[0]:e;return {x:t.clientX,y:t.clientY};}
  cv.addEventListener("mousedown",function(e){drag=pt(e);});
  cv.addEventListener("touchstart",function(e){drag=pt(e);},{passive:true});
  function move(e){ if(!drag||!state)return; var p=pt(e); state.x+=(p.x-drag.x); state.y+=(p.y-drag.y); drag=p; clampPan(); draw(); e.preventDefault&&e.preventDefault(); }
  window.addEventListener("mousemove",move);
  cv.addEventListener("touchmove",move,{passive:false});
  window.addEventListener("mouseup",function(){drag=null;});
  cv.addEventListener("touchend",function(){drag=null;});
 }
 function clampPan(){
  var w=state.img.width*state.scale, h=state.img.height*state.scale;
  // keep image covering the VIEW frame
  var minX=VIEW-w, minY=VIEW-h;
  if(state.x>0)state.x=0; if(state.x<minX)state.x=minX;
  if(state.y>0)state.y=0; if(state.y<minY)state.y=minY;
 }
 function draw(){
  var cv=document.getElementById("cropCanvas"), ctx=cv.getContext("2d");
  ctx.clearRect(0,0,VIEW,VIEW);
  ctx.drawImage(state.img, state.x, state.y, state.img.width*state.scale, state.img.height*state.scale);
 }
 function openCrop(img,cb){
  ensureModal();
  var minScale=Math.max(VIEW/img.width, VIEW/img.height); // cover
  state={img:img, minScale:minScale, scale:minScale, x:(VIEW-img.width*minScale)/2, y:(VIEW-img.height*minScale)/2, cb:cb};
  document.getElementById("cropZoom").value=1;
  draw();
  document.getElementById("cropModal").classList.add("show");
 }
 function closeCrop(){var m=document.getElementById("cropModal"); if(m)m.classList.remove("show"); state=null;}
 function confirmCrop(){
  if(!state){closeCrop();return;}
  var out=document.createElement("canvas"); out.width=OUT; out.height=OUT;
  var r=OUT/VIEW;
  out.getContext("2d").drawImage(state.img, state.x*r, state.y*r, state.img.width*state.scale*r, state.img.height*state.scale*r);
  var uri=out.toDataURL("image/jpeg",0.8);
  var cb=state.cb; closeCrop(); if(cb)cb(uri);
 }
 // Override global pickImage: pick file -> load -> crop -> cb(dataUri)
 window.pickImage=function(cb){
  var inp=document.createElement("input"); inp.type="file"; inp.accept="image/*";
  inp.onchange=function(){
   var f=inp.files&&inp.files[0]; if(!f)return;
   var fr=new FileReader();
   fr.onload=function(e){ var img=new Image(); img.onload=function(){ openCrop(img,cb); }; img.onerror=function(){toast&&toast("\u0e2d\u0e48\u0e32\u0e19\u0e23\u0e39\u0e1b\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49");}; img.src=e.target.result; };
   fr.readAsDataURL(f);
  };
  inp.click();
 };
 if(typeof pickImage!=="undefined"){} // ensure reference
})();
