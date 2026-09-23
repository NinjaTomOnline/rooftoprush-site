export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const $ = (id) => document.getElementById(id);
export async function sprite(path, frames = 1, cell = 192) {
  const image = new Image(); image.src = new URL('../assets/' + path, import.meta.url).href;
  await image.decode();
  const source = document.createElement('canvas'); source.width = image.width; source.height = image.height;
  const c = source.getContext('2d', {willReadFrequently:true}); c.drawImage(image,0,0);
  // Same source-art matte removal used by the native sprite loader. The
  // original, accepted image files stay byte-identical in the site package.
  const pixels = c.getImageData(0,0,source.width,source.height);
  for(let i=0;i<pixels.data.length;i+=4){const [r,g,b]=pixels.data.subarray(i,i+3);if(r>145&&b>145&&g<Math.min(r,b)*.62)pixels.data[i+3]=0;}
  c.putImageData(pixels,0,0);
  return {source,frames,cell,draw(ctx,frame,x,y,w,h=w){ctx.imageSmoothingEnabled=false;ctx.drawImage(source,(frame%frames)*cell,0,cell,cell,x,y,w,h);}};
}
export function bestScore(key, value) {
  try { const saved = Math.max(0,Number(localStorage.getItem('rr-arcade-'+key))||0); if(value===undefined)return saved;
    const next=Math.max(saved,value);localStorage.setItem('rr-arcade-'+key,String(next));return next;
  } catch { return Math.max(0,value||0); }
}
export function clearScores(){try{localStorage.removeItem('rr-arcade-flick');localStorage.removeItem('rr-arcade-sniff');return true;}catch{return false;}}
export function connectSound(){let enabled=false,ctx;
 const button=$('sound'); if(button)button.addEventListener('click',()=>{enabled=!enabled;button.textContent=enabled?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(enabled));if(enabled){try{ctx??=new (window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});}catch{enabled=false;button.textContent='Sound unavailable';button.setAttribute('aria-pressed','false');}}});
 return (success)=>{if(!enabled||!ctx||document.hidden)return;[0,.10,.20].forEach((delay,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=(success?440:180)*(success?[1,1.25,1.5][i]:[1,.9,.8][i]);g.gain.setValueAtTime(.07,ctx.currentTime+delay);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+delay+.14);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+delay);o.stop(ctx.currentTime+delay+.15);});};
}
if(new URLSearchParams(location.search).get('embed')==='1')document.body.dataset.embed='true';
