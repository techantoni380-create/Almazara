
document.querySelectorAll('.reveal').forEach(el=>{
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.14});
 io.observe(el);
});


// HOME HERO: interacciones premium de los tres valores.
(() => {
  const buttons = document.querySelectorAll('.trust-live-btn');
  const pop = document.getElementById('trust-popover');
  const title = document.getElementById('trust-popover-title');
  const copy = document.getElementById('trust-popover-copy');
  const close = document.querySelector('.trust-popover-close');

  if (!buttons.length || !pop) return;

  const closePopover = () => {
    pop.classList.remove('is-open');
    pop.setAttribute('aria-hidden','true');
    buttons.forEach(b => b.classList.remove('is-active'));
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const already = btn.classList.contains('is-active');

      buttons.forEach(b => b.classList.remove('is-active'));

      if (already) {
        closePopover();
        return;
      }

      btn.classList.add('is-active');
      title.textContent = btn.dataset.title || '';
      copy.textContent = btn.dataset.copy || '';
      pop.classList.add('is-open');
      pop.setAttribute('aria-hidden','false');
    });
  });

  close?.addEventListener('click', closePopover);
  document.addEventListener('click', e => {
    if (!pop.contains(e.target) && !e.target.closest('.trust-live-btn')) {
      closePopover();
    }
  });
})();

// ALMAZARA · Asistente virtual global
(function(){
  if(document.querySelector('.alma-assistant')) return;
  const wa='https://wa.me/41767850506?text='+encodeURIComponent('Hola, he visitado la web de ALMAZARA y me gustaría recibir información.');
  const wrap=document.createElement('div'); wrap.className='alma-assistant';
  wrap.innerHTML=`<div class="alma-assistant-panel" role="dialog" aria-label="Asistente virtual de ALMAZARA">
    <div class="alma-assistant-head"><b>ALMAZARA</b><span>ASISTENTE VIRTUAL</span><button class="alma-assistant-close" aria-label="Cerrar">×</button></div>
    <div class="alma-assistant-body"><div class="alma-assistant-message"><b>Hola 👋</b><br>Soy la asistente virtual de ALMAZARA.<br>¿En qué puedo ayudarte hoy?</div>
      <div class="alma-assistant-actions">
        <a class="alma-assistant-action" href="productos.html"><span class="ai">🛒</span><span><b>Nuestros productos</b><small>Aceites, jamones y mucho más</small></span><span class="arrow">›</span></a>
        <a class="alma-assistant-action" href="recetas.html"><span class="ai">♨</span><span><b>Recetas</b><small>Ideas y sabores mediterráneos</small></span><span class="arrow">›</span></a>
        <a class="alma-assistant-action" href="contacto.html"><span class="ai">i</span><span><b>Información</b><small>Dudas, envíos y pedidos</small></span><span class="arrow">›</span></a>
        <a class="alma-assistant-action" href="${wa}" target="_blank" rel="noopener"><span class="ai">☎</span><span><b>Hablar por WhatsApp</b><small>+41 76 785 05 06</small></span><span class="arrow">›</span></a>
        <a class="alma-assistant-action" href="mailto:almazara.olive@gmail.com"><span class="ai">✉</span><span><b>Escríbenos</b><small>almazara.olive@gmail.com</small></span><span class="arrow">›</span></a>
      </div></div><div class="alma-assistant-foot">Un placer ayudarte ♡</div></div>
    <button class="alma-assistant-launcher" aria-label="Abrir asistente virtual" aria-expanded="false"><img class="alma-assistant-avatar" src="assets/img/asistente-almazara.png" alt="Asistente virtual ALMAZARA"><span class="alma-assistant-online"></span><span><strong>¿Te ayudo?</strong><small>ASISTENTE ALMAZARA</small></span></button>`;
  document.body.appendChild(wrap);
  const launcher=wrap.querySelector('.alma-assistant-launcher'), close=wrap.querySelector('.alma-assistant-close');
  function setOpen(v){wrap.classList.toggle('open',v);launcher.setAttribute('aria-expanded',String(v));}
  launcher.addEventListener('click',()=>setOpen(!wrap.classList.contains('open'))); close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
})();


// Newsletter ALMAZARA: demo visual (Brevo se conectará tras aprobación)
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.newsletter-demo-form').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const email=form.querySelector('input[type="email"]');
      const consent=form.querySelector('input[type="checkbox"]');
      if(!email.checkValidity()){ email.reportValidity(); return; }
      if(!consent.checked){ consent.focus(); return; }
      const ok=form.querySelector('.newsletter-success');
      if(ok) ok.classList.add('is-visible');
      email.value=''; consent.checked=false;
    });
  });
});


// ALMAZARA · Herramientas premium del header (demo ecommerce)
document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('.header-overlay')) return;
  const overlay=document.createElement('div'); overlay.className='header-overlay';
  const search=document.createElement('section'); search.className='search-premium'; search.setAttribute('aria-hidden','true');
  search.innerHTML=`<button class="premium-close" aria-label="Cerrar">×</button><span class="eyebrow">BÚSQUEDA · ALMAZARA</span><h2>¿Qué estás buscando?</h2><div class="search-box"><input type="search" placeholder="Aceites, jamones, recetas…" aria-label="Buscar en ALMAZARA"><button aria-label="Buscar">⌕</button></div><div class="search-results"></div>`;
  const cart=document.createElement('aside'); cart.className='cart-drawer'; cart.setAttribute('aria-hidden','true');
  cart.innerHTML=`<button class="premium-close" aria-label="Cerrar">×</button><span class="eyebrow">TU SELECCIÓN · ALMAZARA</span><h2>Tu cesta</h2><div class="cart-empty"><div class="cart-empty-icon">🛒</div><h3>Tu cesta está vacía</h3><p>Descubre nuestra selección de productos<br>de origen español.</p><a href="productos.html">DESCUBRIR PRODUCTOS →</a></div>`;
  document.body.append(overlay,search,cart);
  const closeAll=()=>{overlay.classList.remove('open');search.classList.remove('open');cart.classList.remove('open');search.setAttribute('aria-hidden','true');cart.setAttribute('aria-hidden','true')};
  document.querySelectorAll('.search-trigger').forEach(b=>b.addEventListener('click',()=>{closeAll();overlay.classList.add('open');search.classList.add('open');search.setAttribute('aria-hidden','false');setTimeout(()=>search.querySelector('input').focus(),150)}));
  document.querySelectorAll('.cart-trigger').forEach(b=>b.addEventListener('click',()=>{closeAll();overlay.classList.add('open');cart.classList.add('open');cart.setAttribute('aria-hidden','false')}));
  overlay.addEventListener('click',closeAll); search.querySelector('.premium-close').addEventListener('click',closeAll);cart.querySelector('.premium-close').addEventListener('click',closeAll);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
  const pages=[['Aceites','aceites.html'],['Jamones','jamones.html'],['Productos','productos.html'],['Recetas','recetas.html'],['Nosotros','nosotros.html'],['Contacto','contacto.html']];
  const inp=search.querySelector('input'), results=search.querySelector('.search-results');
  function render(){const q=inp.value.trim().toLowerCase();results.innerHTML=q?pages.filter(x=>x[0].toLowerCase().includes(q)||({'aceites':'oliva aove aceite','jamones':'iberico bellota jamon','productos':'tienda comprar gourmet','recetas':'cocina salmorejo gambas bacalao','nosotros':'historia almazara origen','contacto':'whatsapp email ayuda'}[x[0].toLowerCase()]||'').includes(q)).map(x=>`<a href="${x[1]}">${x[0]} <span>→</span></a>`).join(''):`<a href="productos.html">Productos <span>→</span></a><a href="recetas.html">Recetas <span>→</span></a>`} inp.addEventListener('input',render);render();
  document.querySelectorAll('.lang-switch').forEach(sw=>{const trigger=sw.querySelector('.lang-trigger');trigger.addEventListener('click',e=>{e.stopPropagation();sw.classList.toggle('open');trigger.setAttribute('aria-expanded',sw.classList.contains('open'))});sw.querySelectorAll('.lang-menu button').forEach(btn=>btn.addEventListener('click',()=>{sw.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const flag=trigger.querySelector('.lang-flag'), code=trigger.querySelector('.lang-code'), menuFlag=btn.querySelector('.menu-flag'); if(flag&&menuFlag) flag.src=menuFlag.src; if(code) code.textContent=btn.dataset.lang;sw.classList.remove('open');if(btn.dataset.lang!=='ES') alert('Vista de demostración: '+btn.querySelector('small').textContent+' estará disponible en la versión multidioma.')}));});document.addEventListener('click',()=>document.querySelectorAll('.lang-switch').forEach(x=>x.classList.remove('open')));
});

// ALMAZARA · Navegación responsive global
(function(){
  function initMobileNav(){
    const header=document.querySelector('.site-header');
    const desktopNav=header?.querySelector('.nav-links');
    const tools=header?.querySelector('.nav-tools');
    if(!header||!desktopNav||!tools||document.querySelector('.mobile-menu-trigger')) return;
    const trigger=document.createElement('button');
    trigger.className='mobile-menu-trigger'; trigger.type='button'; trigger.setAttribute('aria-label','Abrir menú'); trigger.setAttribute('aria-expanded','false'); trigger.innerHTML='<span></span>';
    tools.insertAdjacentElement('afterend',trigger);
    const panel=document.createElement('div'); panel.className='mobile-nav-panel'; panel.setAttribute('aria-hidden','true');
    const nav=document.createElement('nav'); nav.setAttribute('aria-label','Navegación móvil'); nav.innerHTML=desktopNav.innerHTML;
    panel.append(nav);
    const utilities=document.createElement('div'); utilities.className='mobile-nav-utilities';
    utilities.innerHTML='<button type="button" class="mobile-search-open">⌕ &nbsp; Buscar</button><div class="mobile-languages" aria-label="Idiomas"><span class="mobile-languages-title">IDIOMAS</span><div class="mobile-language-options"><button type="button" class="active" data-mobile-lang="ES">ES</button><button type="button" data-mobile-lang="DE">DE</button><button type="button" data-mobile-lang="FR">FR</button><button type="button" data-mobile-lang="IT">IT</button><button type="button" data-mobile-lang="EN">EN</button></div></div>';
    panel.append(utilities);
    const note=document.createElement('div'); note.className='mobile-note'; note.textContent='ALMAZARA · CALIDAD DE ORIGEN ESPAÑOL'; panel.append(note); document.body.append(panel);
    utilities.querySelector('.mobile-search-open').addEventListener('click',()=>{setOpen(false);document.querySelector('.search-trigger')?.click()});
    utilities.querySelectorAll('[data-mobile-lang]').forEach(btn=>btn.addEventListener('click',()=>{const lang=btn.dataset.mobileLang;utilities.querySelectorAll('[data-mobile-lang]').forEach(x=>x.classList.toggle('active',x===btn));const desktopBtn=document.querySelector('.lang-menu button[data-lang="'+lang+'"]');if(desktopBtn) desktopBtn.click();}));
    const setOpen=v=>{panel.classList.toggle('open',v);document.body.classList.toggle('mobile-menu-open',v);trigger.setAttribute('aria-expanded',String(v));panel.setAttribute('aria-hidden',String(!v));trigger.setAttribute('aria-label',v?'Cerrar menú':'Abrir menú')};
    trigger.addEventListener('click',()=>setOpen(!panel.classList.contains('open'))); panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false))); document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)}); window.addEventListener('resize',()=>{if(innerWidth>980)setOpen(false)});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileNav); else initMobileNav();
})();

// ALMAZARA · Hero Inicio: vídeo completo -> 3 imágenes -> vídeo
(function(){
  function initHomeHeroSequence(){
    const media=document.querySelector('[data-hero-sequence]');
    if(!media) return;
    const items=[...media.querySelectorAll('.hero-sequence-item')];
    const video=items[0];
    if(!(video instanceof HTMLVideoElement)||items.length<2) return;
    const imageDuration=6500;
    let timer=null, index=0;
    const show=i=>{
      clearTimeout(timer); index=i;
      items.forEach((el,n)=>el.classList.toggle('is-active',n===i));
      media.classList.toggle('is-photo-phase',i!==0);
      const hero=media.closest('.home-hero');
      hero?.classList.toggle('is-photo-phase',i!==0);
      hero?.classList.toggle('is-product-photo',i===1);
      const videoBuy=hero?.querySelector('.hero-video-buy');
      if(videoBuy){
        videoBuy.style.setProperty('display',i===0?'flex':'none','important');
        videoBuy.setAttribute('aria-hidden',i===0?'false':'true');
      }
      // El título, subtítulo y CTA son HTML real superpuesto en todas las fotografías.
      const photoMessage=hero?.querySelector('.hero-photo-message');
      if(photoMessage) photoMessage.style.removeProperty('display');
      if(i===0){
        try{ video.currentTime=0; const play=video.play(); if(play?.catch) play.catch(()=>{}); }catch(e){}
      }else{
        video.pause();
        timer=setTimeout(()=>show(i===items.length-1?0:i+1),imageDuration);
      }
    };
    video.loop=false;
    video.addEventListener('ended',()=>show(1));
    video.addEventListener('error',()=>show(1),{once:true});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){ clearTimeout(timer); if(index===0) video.pause(); }
      else if(index===0){ video.play().catch(()=>{}); }
      else { timer=setTimeout(()=>show(index===items.length-1?0:index+1),imageDuration); }
    });
    show(0);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initHomeHeroSequence); else initHomeHeroSequence();
})();
