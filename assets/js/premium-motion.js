/* ALMAZARA · Slow, composited movement for editorial photography only. */
// Follow the mouse with decorative light, without making static values clickable.
(() => {
  'use strict';
  function initValueLight() {
    const stripItems = [...document.querySelectorAll('.values > .value, .nosotros-page .stats > .stat')];
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let active = null, frame = 0, point = null;
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      active = null;
      point = null;
    }
    function track(event) {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
      active = event.currentTarget;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active || !point) return;
        const rect = active.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(100, Math.max(0, (point.x - rect.left) / rect.width * 100));
        const y = Math.min(100, Math.max(0, (point.y - rect.top) / rect.height * 100));
        active.style.setProperty('--value-light-x', x.toFixed(2) + '%');
        active.style.setProperty('--value-light-y', y.toFixed(2) + '%');
      });
    }
    stripItems.forEach(item => {
      item.addEventListener('pointerenter', track, { passive: true });
      item.addEventListener('pointermove', track, { passive: true });
      item.addEventListener('pointerleave', stop, { passive: true });
      item.addEventListener('pointercancel', stop, { passive: true });
    });
    function reset() {
      stop();
      stripItems.forEach(item => {
        item.style.removeProperty('--value-light-x');
        item.style.removeProperty('--value-light-y');
      });
    }
    finePointer.addEventListener('change', reset);
    reducedMotion.addEventListener('change', reset);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    window.addEventListener('pagehide', stop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initValueLight, { once: true });
  else initValueLight();
})();

(() => {
  'use strict';

  function initPremiumMotion() {
    if (document.documentElement.dataset.premiumMotion === 'ready') return;
    document.documentElement.dataset.premiumMotion = 'ready';

    // Deliberate allowlist: commercial cards and dynamically inserted shop images
    // cannot accidentally become editorial photography.
    const editorial = [
      '.hero-media > img', '.legal-hero-media > img', '.mosaic-panel > img', '.aceites-collage-panel > img',
      '.producto-foto > img', '.split .visual > img', '.home-story-visual > img',
      '.feature-card > img', '.recipe-premium-card > img'
    ].join(',');
    const excluded = [
      '.card', '.card-media', '#catalogo', '.cart-drawer', '.shop-cart-item',
      '.checkout-page', '.checkout-order-item', '.product-modal', '[data-product-modal]',
      '.alma-assistant', '.site-header', '.site-footer', '.footer-enterprise',
      '.value', '.contact-brand-mini', '[data-no-motion]'
    ].join(',');
    const photos = [...document.querySelectorAll(editorial)].filter(photo => !photo.closest(excluded));
    photos.forEach(photo => photo.setAttribute('data-premium-photo', ''));

    // Keep static photographs in older browsers without individual transforms.
    if (!Element.prototype.animate || !window.CSS?.supports('scale', '1')) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const groups = new Map();
    const bannerLayers = [];
    const featureVideos = new Map([...document.querySelectorAll('video.feature-bg-video')]
      .map(video => [video, { inView: false, pending: false }]));
    const collageSelector = '.home-hero-collage,.aceites-collage-media,.productos-collage-media';
    let pageActive = true;

    function getGroup(root) {
      if (!groups.has(root)) {
        groups.set(root, { root, animations: [], images: [], inView: false });
      }
      return groups.get(root);
    }

    function addMotion(target, root, maxScale, duration) {
      const group = getGroup(root);
      const animation = target.animate([{ scale: '1' }, { scale: String(maxScale) }], {
        duration, iterations: Infinity, direction: 'alternate',
        easing: 'ease-in-out', fill: 'both'
      });
      animation.id = 'almazara-editorial-motion';
      animation.pause();
      animation.currentTime = 0;
      group.animations.push(animation);
      if (target instanceof HTMLImageElement) group.images.push(target);
    }

    photos.forEach((photo, index) => {
      const collage = photo.closest(collageSelector);
      const slide = photo.closest('.hero-sequence-item');
      const root = collage || slide || photo;
      // Product bottles in the editorial collage retain their carefully fitted
      // composition; every panel shares one clock and starts at its exact crop.
      const maxScale = photo.closest('.foto-botellas') ? 1.008 : collage ? 1.016 : 1.035;
      addMotion(photo, root, maxScale, collage ? 34000 : 28000 + (index % 4) * 2000);
      photo.closest('.visual,.home-story-visual,.feature-card,.recipe-premium-card')
        ?.classList.add('premium-motion-frame');
    });

    // Split a computed CSS layer list without splitting the commas in gradients.
    function cssLayers(value) {
      const layers = [];
      let start = 0, depth = 0, quote = '';
      for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (char === '\\') { i++; continue; }
        if (quote) { if (char === quote) quote = ''; continue; }
        if (char === '"' || char === "'") { quote = char; continue; }
        if (char === '(') depth++;
        if (char === ')') depth--;
        if (char === ',' && depth === 0) { layers.push(value.slice(start, i).trim()); start = i + 1; }
      }
      layers.push(value.slice(start).trim());
      return layers;
    }

    const backgroundProperties = ['backgroundPosition', 'backgroundSize', 'backgroundRepeat',
      'backgroundOrigin', 'backgroundClip', 'backgroundAttachment', 'backgroundBlendMode'];

    document.querySelectorAll('.banner').forEach(banner => {
      if (banner.closest(excluded)) return;
      const computed = getComputedStyle(banner);
      const layers = cssLayers(computed.backgroundImage);
      if (!layers.some(layer => /^url\(/i.test(layer))) return;
      const background = document.createElement('span');
      const shade = document.createElement('span');
      background.className = 'premium-motion-background';
      shade.className = 'premium-motion-background-shade';
      [background, shade].forEach(layer => {
        layer.setAttribute('aria-hidden', 'true');
        backgroundProperties.forEach(property => {
          layer.style[property] = computed[property];
        });
      });
      background.style.backgroundImage = layers.map(layer => /^url\(/i.test(layer) ? layer : 'none').join(',');
      shade.style.backgroundImage = layers.map(layer => /^url\(/i.test(layer) ? 'none' : layer).join(',');
      banner.prepend(background, shade);
      banner.setAttribute('data-premium-background', '');
      bannerLayers.push({ banner, background, shade });
      addMotion(background, banner, 1.035, 32000);
    });

    // Retain the original responsive background framing after a rotation/resize.
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => bannerLayers.forEach(({ banner, background, shade }) => {
        const computed = getComputedStyle(banner);
        backgroundProperties.forEach(property => {
          background.style[property] = computed[property];
          shade.style[property] = computed[property];
        });
      }));
    }, { passive: true });

    function ready(group) {
      if (group.root.matches('.hero-sequence-item:not(.is-active)')) return false;
      if (document.documentElement.classList.contains('home-collage-js') &&
          group.root.matches('.home-hero-collage:not(.is-collage-ready)')) return false;
      if (document.documentElement.classList.contains('aceites-collage-js') &&
          group.root.matches('.aceites-collage-media:not(.is-ready)')) return false;
      return group.images.every(image => image.complete && image.naturalWidth > 0);
    }

    function update(group) {
      const play = pageActive && !document.hidden && !reducedMotion.matches && group.inView && ready(group);
      group.animations.forEach(animation => {
        // Pausing, rather than recreating animations, prevents jumps on reentry.
        if (play && animation.playState !== 'running') animation.play();
        if (!play && animation.playState !== 'paused') animation.pause();
      });
    }
    function updateFeatureVideo(video, state) {
      const play = pageActive && !document.hidden && !reducedMotion.matches && state.inView;
      if (!play) { video.pause(); return; }
      if (!video.paused || state.pending) return;
      state.pending = true;
      const request = video.play();
      if (request?.then) request.then(() => {
        state.pending = false;
        // A queued play request may resolve after scrolling away or hiding.
        if (!pageActive || document.hidden || reducedMotion.matches || !state.inView) video.pause();
      }, () => { state.pending = false; });
      else state.pending = false;
    }
    const updateAll = () => {
      groups.forEach(update);
      featureVideos.forEach((state, video) => updateFeatureVideo(video, state));
    };

    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const group = groups.get(entry.target);
        if (group) {
          group.inView = entry.isIntersecting;
          update(group);
        } else {
          const state = featureVideos.get(entry.target);
          if (state) {
            state.inView = entry.isIntersecting;
            updateFeatureVideo(entry.target, state);
          }
        }
      });
    }, { threshold: 0 }) : null;

    // Observe only existing reveal/slide readiness classes; shop DOM updates do
    // not start new animations or touch the slideshow's 6.5 second timings.
    const stateObserver = new MutationObserver(updateAll);
    groups.forEach(group => {
      if (observer) observer.observe(group.root);
      else group.inView = true;
      if (group.root.matches(collageSelector + ',.hero-sequence-item')) {
        stateObserver.observe(group.root, { attributes: true, attributeFilter: ['class'] });
      }
      group.images.forEach(image => {
        if (!image.complete) image.addEventListener('load', () => update(group), { once: true });
      });
    });
    featureVideos.forEach((state, video) => {
      if (observer) observer.observe(video);
      else state.inView = true;
      video.addEventListener('loadeddata', () => updateFeatureVideo(video, state), { once: true });
    });

    document.addEventListener('visibilitychange', updateAll);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateAll);
    else reducedMotion.addListener(updateAll);
    window.addEventListener('pagehide', () => { pageActive = false; updateAll(); });
    window.addEventListener('pageshow', () => { pageActive = true; updateAll(); });
    updateAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPremiumMotion, { once: true });
  else initPremiumMotion();
})();
