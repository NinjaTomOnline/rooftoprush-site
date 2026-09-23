(async()=>{const {sprite}=await import('./common.js');
for(const canvas of document.querySelectorAll('[data-portrait]')){
 try {const dog=canvas.dataset.portrait==='memphis';const art=await sprite(dog?'memphis-idle.png':'tom-idle.png',dog?8:1,dog?180:192);const c=canvas.getContext('2d');art.draw(c,0,dog?20:55,dog?-8:-16,dog?270:270);}
 catch {canvas.setAttribute('aria-label','Character artwork unavailable');}
}})();
