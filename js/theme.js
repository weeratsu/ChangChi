// ===== Theme picker (cat-breed color themes) =====
var LS_THEME="woc_theme_v1";
var THEMES={
 orange: {name:"\u0e41\u0e21\u0e27\u0e2a\u0e49\u0e21", emo:"\ud83d\udfe0", vars:{"--bg":"#fff4e6","--card":"#ffffff","--card2":"#ffe8cc","--line":"#f8c98a","--txt":"#4a2e12","--sub":"#a4703a","--accent":"#ff8c00","--accent2":"#ea6c00","--danger":"#dc2626"}},
 ninrat: {name:"\u0e42\u0e01\u0e0d\u0e08\u0e32 (\u0e41\u0e21\u0e27\u0e14\u0e33)", emo:"\u2b1b", vars:{"--bg":"#0a0a0d","--card":"#15151a","--card2":"#1f1f27","--line":"#2e2e3a","--txt":"#eceef2","--sub":"#9a9aa8","--accent":"#c0a6f5","--accent2":"#8b6ce0","--danger":"#ef4444"}},
 calico: {name:"\u0e2a\u0e32\u0e21\u0e2a\u0e35", emo:"\ud83c\udf42", vars:{"--bg":"#fff7f0","--card":"#ffffff","--card2":"#fdeee0","--line":"#f0d6bf","--txt":"#3f2a1e","--sub":"#9c7259","--accent":"#e8731f","--accent2":"#b9551a","--danger":"#dc2626"}},
 bengal: {name:"\u0e40\u0e1a\u0e07\u0e01\u0e2d\u0e25", emo:"\ud83d\udc06", vars:{"--bg":"#f7ecd9","--card":"#fffaf2","--card2":"#f1e2c9","--line":"#e0c9a0","--txt":"#4a3620","--sub":"#997a4e","--accent":"#c8812e","--accent2":"#a2641d","--danger":"#dc2626"}},
 khaomanee: {name:"\u0e02\u0e32\u0e27\u0e21\u0e13\u0e35 (\u0e41\u0e21\u0e27\u0e02\u0e32\u0e27)", emo:"\u2b50", vars:{"--bg":"#f6f7f9","--card":"#ffffff","--card2":"#eef0f4","--line":"#dde1e8","--txt":"#1f2733","--sub":"#6b7684","--accent":"#14b8a6","--accent2":"#0f8d80","--danger":"#dc2626"}},
 korat: {name:"\u0e2a\u0e35\u0e2a\u0e27\u0e32\u0e14", emo:"\ud83e\udde1", vars:{"--bg":"#15181b","--card":"#1e2327","--card2":"#282f34","--line":"#3a4248","--txt":"#e9edf0","--sub":"#a8b3ba","--accent":"#8aa0ac","--accent2":"#64788a","--danger":"#ef4444"}},
 russianblue: {name:"\u0e23\u0e31\u0e0a\u0e40\u0e0b\u0e35\u0e22\u0e19\u0e1a\u0e25\u0e39", emo:"\ud83d\udd35", vars:{"--bg":"#101619","--card":"#182127","--card2":"#212d34","--line":"#324048","--txt":"#e6eef2","--sub":"#9db4c0","--accent":"#6fb7d4","--accent2":"#4a93b5","--danger":"#ef4444"}}
};
function applyTheme(key){
 var t=THEMES[key]||THEMES.orange;
 var root=document.documentElement;
 for(var k in t.vars){ if(t.vars.hasOwnProperty(k)) root.style.setProperty(k,t.vars[k]); }
 var meta=document.querySelector('meta[name="theme-color"]'); if(meta)meta.setAttribute("content",t.vars["--accent2"]);
 localStorage.setItem(LS_THEME,key);
}
function currentTheme(){ try{var v=localStorage.getItem(LS_THEME); return THEMES[v]?v:"orange";}catch(e){return "orange";} }
function renderThemePicker(){
 var el=document.getElementById("themePicker"); if(!el)return;
 var cur=currentTheme(); var html="";
 for(var k in THEMES){ if(!THEMES.hasOwnProperty(k))continue;
  var t=THEMES[k];
  html+='<button class="theme-chip'+(k===cur?" on":"")+'" data-theme="'+k+'">'
      + '<span class="theme-dot" style="background:'+t.vars["--accent"]+'"></span>'
      + '<span class="theme-dot" style="background:'+t.vars["--bg"]+';border:1px solid '+t.vars["--line"]+'"></span> '
      + t.emo+" "+t.name+'</button>';
 }
 el.innerHTML=html;
 var btns=el.querySelectorAll(".theme-chip");
 for(var i=0;i<btns.length;i++){(function(b){b.onclick=function(){applyTheme(b.getAttribute("data-theme"));renderThemePicker();};})(btns[i]);}
}
applyTheme(currentTheme());
