(function () {
  'use strict';

  const KEY = 'almazara_cart_v1';
  const CAT = window.ALMAZARA_CATALOG || {};
  const SHOP_TX = {
    ES:{sel:'TU SELECCIÓN · ALMAZARA',basket:'Tu cesta',empty:'Tu cesta está vacía',discover:'Descubre nuestra selección de productos<br>de origen español.',products:'DESCUBRIR PRODUCTOS →',remove:'Eliminar',subtotal:'Subtotal',shipping:'El envío se calculará cuando definamos las tarifas definitivas.',continue:'CONTINUAR COMPRA →',close:'Cerrar',piece:'Pieza',names:{'aceite-premium-500':'Aceite de Oliva Selección Premium','pack-3-aceites':'Pack de 3 Aceites de Oliva','jamon-iberico':'Jamón ibérico','paleta-iberica':'Paleta ibérica'}},
    DE:{sel:'IHRE AUSWAHL · ALMAZARA',basket:'Ihr Warenkorb',empty:'Ihr Warenkorb ist leer',discover:'Entdecken Sie unsere Auswahl an Produkten<br>spanischer Herkunft.',products:'PRODUKTE ENTDECKEN →',remove:'Entfernen',subtotal:'Zwischensumme',shipping:'Die Versandkosten werden berechnet, sobald die endgültigen Tarife feststehen.',continue:'WEITER ZUR BESTELLUNG →',close:'Schließen',piece:'Stück',names:{'aceite-premium-500':'Premium-Olivenöl Auswahl','pack-3-aceites':'3er-Pack Olivenöl','jamon-iberico':'Ibérico-Schinken','paleta-iberica':'Ibérico-Paleta'}},
    FR:{sel:'VOTRE SÉLECTION · ALMAZARA',basket:'Votre panier',empty:'Votre panier est vide',discover:'Découvrez notre sélection de produits<br>d’origine espagnole.',products:'DÉCOUVRIR LES PRODUITS →',remove:'Supprimer',subtotal:'Sous-total',shipping:'Les frais de livraison seront calculés lorsque les tarifs définitifs seront fixés.',continue:'CONTINUER LA COMMANDE →',close:'Fermer',piece:'Pièce',names:{'aceite-premium-500':'Huile d’Olive Sélection Premium','pack-3-aceites':'Pack de 3 Huiles d’Olive','jamon-iberico':'Jambon ibérique','paleta-iberica':'Palette ibérique'}},
    IT:{sel:'LA TUA SELEZIONE · ALMAZARA',basket:'Il tuo carrello',empty:'Il tuo carrello è vuoto',discover:'Scopri la nostra selezione di prodotti<br>di origine spagnola.',products:'SCOPRI I PRODOTTI →',remove:'Rimuovi',subtotal:'Subtotale',shipping:'La spedizione verrà calcolata quando saranno definite le tariffe definitive.',continue:'CONTINUA L’ACQUISTO →',close:'Chiudi',piece:'Pezzo',names:{'aceite-premium-500':'Olio d’Oliva Selezione Premium','pack-3-aceites':'Pack da 3 Oli d’Oliva','jamon-iberico':'Prosciutto iberico','paleta-iberica':'Paleta iberica'}},
    EN:{sel:'YOUR SELECTION · ALMAZARA',basket:'Your basket',empty:'Your basket is empty',discover:'Discover our selection of products<br>of Spanish origin.',products:'DISCOVER PRODUCTS →',remove:'Remove',subtotal:'Subtotal',shipping:'Shipping will be calculated once the final rates are confirmed.',continue:'CONTINUE CHECKOUT →',close:'Close',piece:'Piece',names:{'aceite-premium-500':'Premium Selection Olive Oil','pack-3-aceites':'3-Pack Olive Oil','jamon-iberico':'Iberian ham','paleta-iberica':'Iberian shoulder'}}
  };
  function lang(){const l=(localStorage.getItem('almazara-lang')||'ES').toUpperCase();return SHOP_TX[l]?l:'ES'}
  function tx(){return SHOP_TX[lang()]}
  function pname(id,p){return tx().names[id]||p.name}
  function pformat(p){return p.format==='Pieza'?tx().piece:p.format}

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function money(value) {
    return 'CHF ' + Number(value || 0).toFixed(2).replace('.', ',');
  }

  function count(cart = get()) {
    return Object.values(cart).reduce((sum, qty) => sum + Number(qty || 0), 0);
  }

  function total(cart = get()) {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      return sum + (CAT[id] ? CAT[id].price * qty : 0);
    }, 0);
  }

  function updateBadges() {
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count();
    });
  }

  function closeCart() {
    document.querySelector('.header-overlay')?.classList.remove('open');
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  function openCart() {
    document.querySelector('.header-overlay')?.classList.add('open');
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
  }

  function render() {
    updateBadges();
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer) return;

    const cart = get();
    const items = Object.entries(cart).filter(([id, qty]) => CAT[id] && qty > 0);

    const t=tx();
    let content = '<button class="premium-close" aria-label="'+t.close+'">×</button>' +
      '<span class="eyebrow">'+t.sel+'</span><h2>'+t.basket+'</h2>';

    if (!items.length) {
      content += '<div class="cart-empty"><div class="cart-empty-icon">🛒</div>' +
        '<h3>'+t.empty+'</h3>' +
        '<p>'+t.discover+'</p>' +
        '<a href="productos.html">'+t.products+'</a></div>';
    } else {
      content += '<div class="shop-cart-items">';
      items.forEach(([id, qty]) => {
        const p = CAT[id];
        content += '<article class="shop-cart-item">' +
          '<img src="' + p.image + '" alt="' + p.name + '">' +
          '<div><h3>' + pname(id,p) + '</h3><small>' + pformat(p) + '</small>' +
          '<div class="shop-qty"><button type="button" data-act="minus" data-id="' + id + '">−</button>' +
          '<span>' + qty + '</span>' +
          '<button type="button" data-act="plus" data-id="' + id + '">+</button></div></div>' +
          '<div class="shop-line"><b>' + money(p.price * qty) + '</b>' +
          '<button type="button" class="shop-remove" data-act="remove" data-id="' + id + '">Eliminar</button></div>' +
          '</article>';
      });
      content += '</div>' +
        '<div class="shop-cart-total"><span>'+t.subtotal+'</span><strong>' + money(total(cart)) + '</strong></div>' +
        '<p class="shop-shipping-note">'+t.shipping+'</p>' +
        '<a class="btn btn-gold shop-checkout" href="checkout.html">'+t.continue+'</a>';
    }

    drawer.innerHTML = content;
    drawer.querySelector('.premium-close')?.addEventListener('click', closeCart);
    drawer.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = get();
        const id = btn.dataset.id;
        if (btn.dataset.act === 'plus') next[id] = (next[id] || 0) + 1;
        if (btn.dataset.act === 'minus') next[id] = Math.max(0, (next[id] || 0) - 1);
        if (btn.dataset.act === 'remove' || next[id] === 0) delete next[id];
        localStorage.setItem(KEY, JSON.stringify(next));
        render();
        openCart();
      });
    });
  }

  function add(id) {
    if (!CAT[id]) return;
    const cart = get();
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(cart));
    render();
    openCart();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // app.js creates the drawer during the same DOMContentLoaded cycle.
    render();
    document.addEventListener('click', event => {
      const button = event.target.closest('.add-to-cart');
      if (!button) return;
      event.preventDefault();
      add(button.dataset.product);
    });
  });

  document.addEventListener('almazara:languagechange', render);
  window.AlmazaraShop = { get, total, count, money, render, add, pname, pformat };
})();
