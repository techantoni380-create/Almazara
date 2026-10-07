(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),touch=matchMedia('(any-pointer:coarse)');
 const timers=new WeakMap();
 function glow(el){if(!el||reduced.matches)return;clearTimeout(timers.get(el));el.classList.remove('is-touch-glowing');void el.offsetWidth;el.classList.add('is-touch-glowing');timers.set(el,setTimeout(()=>el.classList.remove('is-touch-glowing'),1450));}
 const selector='.btn,.card,.value,.stat,.trust-live-btn,.contact-premium-submit,.recipe-premium-btn,.contact-premium-detail,.newsletter-input-row button';
 if(touch.matches&&'IntersectionObserver'in window){const seen=new WeakSet(),items=[...document.querySelectorAll(selector)];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!document.querySelector('.almazara-intro[open]')){glow(e.target);seen.add(e.target);io.unobserve(e.target)}}),{threshold:.4});items.forEach(el=>io.observe(el));document.addEventListener('almazara:introclosed',()=>{io.disconnect();items.filter(el=>!seen.has(el)).forEach(el=>io.observe(el))});}
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen'){glow(e.target.closest(selector));const btn=e.target.closest('.add-to-cart,#quickAdd,#detailBuy button');if(btn&&!reduced.matches){btn.classList.add('touch-cart-preview');setTimeout(()=>btn.classList.remove('touch-cart-preview'),700)}}},{passive:true});
 document.querySelectorAll('[data-social]').forEach(a=>{const value=window.ALMAZARA_PUBLIC?.socials?.[a.dataset.social];try{const u=new URL(value);if(u.protocol!=='https:')return;a.href=u.href;a.removeAttribute('aria-disabled');a.target='_blank';a.rel='noopener noreferrer';}catch(_){a.removeAttribute('href');a.setAttribute('aria-disabled','true')}});
 if(!document.body.classList.contains('home-page'))return;
 const key='almazara_intro_seen_v1';try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1')}catch(_){}
 // Reduced motion users enter directly. Navigation and reloads never replay in this tab session.
 if(reduced.matches)return;
 const dialog=document.createElement('dialog');dialog.className='almazara-intro';dialog.tabIndex=-1;
 const titles={ES:'Presentación de ALMAZARA',DE:'ALMAZARA Vorstellung',FR:'Présentation ALMAZARA',IT:'Presentazione ALMAZARA',EN:'ALMAZARA introduction'};
 let lang='ES';try{lang=localStorage.getItem('almazara-lang')||'ES'}catch(_){}
 dialog.setAttribute('aria-label',titles[lang]||titles.ES);
 // One foreground film, with a soft extension only on unusually tall displays.
 // No visible controls: muted autoplay is followed directly by the home page.
 dialog.innerHTML='<video class="intro-ambient" muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video><video class="intro-film" muted playsinline preload="auto" width="1280" height="720"></video>';
 const video=dialog.querySelector('.intro-film'),ambient=dialog.querySelector('.intro-ambient');
 video.setAttribute('aria-label',titles[lang]||titles.ES);
 [video,ambient].forEach(v=>{v.muted=true;v.defaultMuted=true;v.controls=false;v.disablePictureInPicture=true;v.setAttribute('disableRemotePlayback','');v.setAttribute('webkit-playsinline','')});
 video.autoplay=true;video.src='assets/video/almazara-intro.mp4';
 const tall=matchMedia('(max-aspect-ratio: 9/20)'),scroll={x:scrollX,y:scrollY};
 let closing=false,disposed=false,keyboardExit=false,finishTimer=0,stallTimer=0;
 const lifetime=new AbortController(),events={signal:lifetime.signal};
 document.body.append(dialog);document.documentElement.classList.add('intro-open');document.body.classList.add('intro-open');dialog.showModal();dialog.focus({preventScroll:true});
 const timeout=setTimeout(()=>close(),20000);
 function dispose(){
  if(disposed)return;disposed=true;clearTimeout(timeout);clearTimeout(stallTimer);clearTimeout(finishTimer);lifetime.abort();
  [video,ambient].forEach(v=>v.pause());dialog.close();dialog.remove();
  document.documentElement.classList.remove('intro-open');document.body.classList.remove('intro-open');window.scrollTo(scroll.x,scroll.y);
  if(keyboardExit)document.querySelector('.brand')?.focus({preventScroll:true});document.dispatchEvent(new Event('almazara:introclosed'));
 }
 function close(immediate=false){
  if(closing){if(immediate)dispose();return}closing=true;
  clearTimeout(timeout);clearTimeout(stallTimer);[video,ambient].forEach(v=>v.pause());
  if(immediate||reduced.matches){dispose();return}
  dialog.classList.add('intro-leaving');finishTimer=setTimeout(dispose,360);
 }
 function syncAmbient(){
  if(closing)return;
  if(!tall.matches||document.hidden){ambient.pause();return}
  if(!ambient.getAttribute('src'))ambient.src=video.src;
  if(ambient.readyState>0&&Math.abs(ambient.currentTime-video.currentTime)>.15)ambient.currentTime=video.currentTime;
  if(!video.paused)ambient.play().catch(()=>{});
 }
 function start(){if(!closing)video.play().then(syncAmbient).catch(()=>close(true))}
 video.addEventListener('playing',()=>{clearTimeout(stallTimer);syncAmbient()},events);
 video.addEventListener('waiting',()=>{clearTimeout(stallTimer);stallTimer=setTimeout(()=>close(),6000)},events);
 ambient.addEventListener('loadedmetadata',syncAmbient,events);
 video.addEventListener('timeupdate',syncAmbient,events);
 video.addEventListener('ended',()=>close(),events);video.addEventListener('error',()=>close(true),events);
 // Escape still lets keyboard users dismiss the short film, without visible buttons.
 dialog.addEventListener('cancel',e=>{e.preventDefault();keyboardExit=true;close()},events);
 window.addEventListener('pagehide',()=>close(true),events);
 reduced.addEventListener('change',()=>{if(reduced.matches)close(true)},events);
 tall.addEventListener('change',syncAmbient,events);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();ambient.pause();clearTimeout(stallTimer)}else start()},events);
 start();
})();
