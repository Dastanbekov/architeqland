(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72245,t=>{"use strict";var e=t.i(43476),i=t.i(71645);t.s(["AsciiArt",0,function(){return(0,i.useEffect)(()=>{let t=document.createElement("script");t.type="text/javascript",t.textContent=`
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `,document.head.appendChild(t);let e=document.createElement("style");e.textContent=`
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `,document.head.appendChild(e);let i=()=>{["[data-us-project]",'[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',".unicorn-studio-container",'canvas[aria-label*="Unicorn"]'].forEach(t=>{document.querySelectorAll(t).forEach(t=>{t.querySelectorAll("*").forEach(t=>{let e=(t.textContent||"").toLowerCase(),i=(t.getAttribute("title")||"").toLowerCase(),n=(t.getAttribute("href")||"").toLowerCase();if(e.includes("made with")||e.includes("unicorn")||i.includes("made with")||i.includes("unicorn")||n.includes("unicorn.studio")){t.style.display="none",t.style.visibility="hidden",t.style.opacity="0",t.style.pointerEvents="none",t.style.position="absolute",t.style.left="-9999px",t.style.top="-9999px";try{t.remove()}catch(t){}}})})})};i();let n=setInterval(i,50);return setTimeout(i,500),setTimeout(i,1e3),setTimeout(i,2e3),setTimeout(i,5e3),setTimeout(i,1e4),()=>{clearInterval(n);try{document.head.removeChild(t)}catch(t){}try{document.head.removeChild(e)}catch(t){}}},[]),(0,e.jsx)("div",{className:"w-full h-full flex items-center justify-center relative z-0",children:(0,e.jsx)("div",{"data-us-project":"OMzqyUv6M3kSnv0JeAtC",style:{width:"100%",height:"100%",position:"absolute",inset:0}})})}])},9366,t=>{t.n(t.i(72245))}]);