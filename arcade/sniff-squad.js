import {$,sprite,bestScore,clearScores,connectSound} from './common.js';
const tone=connectSound(),grid=$('sniff-grid'),labels=Array.from({length:12},(_,i)=>'ABC'[Math.floor(i/4)]+(i%4+1));
let hidden=new Set(),opened=new Set(),found=new Set(),sniffs=9,done=false,art=null;
const jokes=['Evidence bag! Smells like justice. And cheese.','Another bag. Memphis requests a snack-based promotion.','All three! Case closed. Time to sniff something unrelated.'];
function distance(i,j){return Math.abs(Math.floor(i/4)-Math.floor(j/4))+Math.abs(i%4-j%4);}
function scent(i){return hidden.size?Math.min(...[...hidden].map(j=>distance(i,j))):0;}
function refresh(){for(let i=0;i<12;i++){const b=grid.children[i];b.disabled=opened.has(i)||done;b.className='sniff-tile'+(found.has(i)?' found':done&&hidden.has(i)?' revealed':'');
 if(found.has(i)){b.innerHTML='<span class="tile-icon" aria-hidden="true">✓</span><small>'+labels[i]+' · BAG FOUND</small>';b.setAttribute('aria-label',labels[i]+': evidence bag found');}
 else if(done&&hidden.has(i)){b.innerHTML='<span class="tile-icon" aria-hidden="true">▣</span><small>'+labels[i]+' · HIDING HERE</small>';b.setAttribute('aria-label',labels[i]+': unrecovered evidence bag');}
 else if(opened.has(i)){const d=scent(i);b.innerHTML='<span class="tile-icon">'+(hidden.size?d:'—')+'</span><small>'+labels[i]+(hidden.size?' · STEPS AWAY':' · CLEAR')+'</small>';b.setAttribute('aria-label',labels[i]+': '+(hidden.size?'nearest remaining bag is '+d+' steps away':'all bags found'));}
 else {b.innerHTML='<span class="tile-icon" aria-hidden="true">⌕</span><span>'+labels[i]+'</span>';b.setAttribute('aria-label','Sniff '+labels[i]);}}
 $('found').textContent=found.size+' / 3';$('sniffs').textContent=sniffs;$('best').textContent=bestScore('sniff');}
function sniff(i){if(done||opened.has(i))return;opened.add(i);sniffs--;if(hidden.has(i)){hidden.delete(i);found.add(i);tone(true);$('message').textContent=jokes[found.size-1];$('dog-thought').textContent='A clue! And a smell!';}
 else{const d=scent(i);tone(false);$('message').textContent=labels[i]+': '+(d===1?'Strong scent! A bag is one horizontal or vertical step away.':'The nearest remaining bag is '+d+' steps away. Count horizontal and vertical steps.');$('dog-thought').textContent=d===1?'VERY interesting.':'Conducting nose business.';}
 if(found.size===3||sniffs===0){done=true;const score=found.size*40+(found.size===3?sniffs*10:0);bestScore('sniff',score);$('result').hidden=false;$('result').textContent=found.size===3?'CASE CLOSED. '+score+' points. Memphis is employee of the sniff.':'CASE STILL OPEN. '+found.size+' / 3 bags found · '+score+' points. The remaining bags are revealed.';$('restart').focus();}
 refresh();if(!done){const next=[...grid.children].find(b=>!b.disabled);next?.focus();}drawDog();}
function newRound(){const order=Array.from({length:12},(_,i)=>i);for(let i=11;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 hidden=new Set(order.slice(0,3));opened=new Set();found=new Set();sniffs=9;done=false;$('result').hidden=true;grid.replaceChildren();labels.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.addEventListener('click',()=>sniff(i));grid.append(b);});$('message').textContent='Nine sniffs. Three bags. Empty tiles show the distance to the nearest remaining bag, counting horizontal and vertical steps.';$('dog-thought').textContent='Official business. Probably.';refresh();drawDog();}
function drawDog(){if(!art)return;const c=$('sniff-dog').getContext('2d');c.clearRect(0,0,270,170);art.draw(c,found.size?1:0,15,-10,215);}
sprite('memphis-idle.png',8,180).then(a=>{art=a;drawDog();}).catch(()=>{$('dog-thought').textContent='Nose online. Portrait offline.';});
$('restart').addEventListener('click',newRound);$('clear').addEventListener('click',()=>{$('message').textContent=clearScores()?'Local best scores cleared. The current search continues.':'Browser storage is unavailable.';refresh();});newRound();
