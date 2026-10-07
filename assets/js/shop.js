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
  const ORDER_TX={
  "ES": {
    "shippingLabel": "Envío",
    "grandTotal": "Total",
    "pending": "Por confirmar",
    "free": "Gratis",
    "shippingPaid": "Gastos de envío aparte. El importe se confirmará antes del pago.",
    "shippingFree": "Envío incluido en los packs de 12 × 500 ml de tu pedido.",
    "shippingMixed": "El pack de 12 × 500 ml incluye el envío. Los gastos del resto del pedido están pendientes de confirmar.",
    "shippingEmpty": "Añade productos para ver el resumen del envío.",
    "increase": "Aumentar cantidad",
    "decrease": "Reducir cantidad",
    "names": {
      "aceite-premium-125": "Aceite de Oliva Selección Premium",
      "pack-3-aceites": "Pack de 3 botellas de aceite",
      "pack-6-aceites": "Pack de 6 botellas de aceite",
      "pack-12-aceites": "Pack de 12 botellas de aceite"
    }
  },
  "DE": {
    "shippingLabel": "Versand",
    "grandTotal": "Gesamt",
    "pending": "Noch zu bestätigen",
    "free": "Kostenlos",
    "shippingPaid": "Zuzüglich Versandkosten. Der Betrag wird vor der Zahlung bestätigt.",
    "shippingFree": "Der Versand der 12 × 500-ml-Pakete in Ihrer Bestellung ist inklusive.",
    "shippingMixed": "Beim Paket mit 12 × 500 ml ist der Versand inklusive. Die Versandkosten für die übrigen Artikel sind noch zu bestätigen.",
    "shippingEmpty": "Fügen Sie Produkte hinzu, um die Versandübersicht zu sehen.",
    "increase": "Menge erhöhen",
    "decrease": "Menge verringern",
    "names": {
      "aceite-premium-125": "Premium-Olivenöl Auswahl",
      "pack-3-aceites": "3er-Paket Olivenöl",
      "pack-6-aceites": "6er-Paket Olivenöl",
      "pack-12-aceites": "12er-Paket Olivenöl"
    }
  },
  "FR": {
    "shippingLabel": "Livraison",
    "grandTotal": "Total",
    "pending": "À confirmer",
    "free": "Offerte",
    "shippingPaid": "Frais de livraison en supplément. Le montant sera confirmé avant le paiement.",
    "shippingFree": "La livraison des packs de 12 × 500 ml de votre commande est incluse.",
    "shippingMixed": "Le pack de 12 × 500 ml inclut la livraison. Les frais pour les autres articles restent à confirmer.",
    "shippingEmpty": "Ajoutez des produits pour afficher le résumé de livraison.",
    "increase": "Augmenter la quantité",
    "decrease": "Réduire la quantité",
    "names": {
      "aceite-premium-125": "Huile d’Olive Sélection Premium",
      "pack-3-aceites": "Pack de 3 bouteilles d’huile",
      "pack-6-aceites": "Pack de 6 bouteilles d’huile",
      "pack-12-aceites": "Pack de 12 bouteilles d’huile"
    }
  },
  "IT": {
    "shippingLabel": "Spedizione",
    "grandTotal": "Totale",
    "pending": "Da confermare",
    "free": "Gratuita",
    "shippingPaid": "Spese di spedizione escluse. L’importo sarà confermato prima del pagamento.",
    "shippingFree": "La spedizione delle confezioni da 12 × 500 ml del tuo ordine è inclusa.",
    "shippingMixed": "La confezione da 12 × 500 ml include la spedizione. Le spese per gli altri articoli sono da confermare.",
    "shippingEmpty": "Aggiungi prodotti per vedere il riepilogo della spedizione.",
    "increase": "Aumenta la quantità",
    "decrease": "Riduci la quantità",
    "names": {
      "aceite-premium-125": "Olio d’Oliva Selezione Premium",
      "pack-3-aceites": "Confezione da 3 bottiglie d’olio",
      "pack-6-aceites": "Confezione da 6 bottiglie d’olio",
      "pack-12-aceites": "Confezione da 12 bottiglie d’olio"
    }
  },
  "EN": {
    "shippingLabel": "Shipping",
    "grandTotal": "Total",
    "pending": "To be confirmed",
    "free": "Free",
    "shippingPaid": "Shipping costs extra. The amount will be confirmed before payment.",
    "shippingFree": "Shipping is included for the 12 × 500 ml packs in your order.",
    "shippingMixed": "Shipping is included for the 12 × 500 ml pack. Shipping costs for other items are still to be confirmed.",
    "shippingEmpty": "Add products to see the shipping summary.",
    "increase": "Increase quantity",
    "decrease": "Decrease quantity",
    "names": {
      "aceite-premium-125": "Premium Selection Olive Oil",
      "pack-3-aceites": "3-bottle olive oil pack",
      "pack-6-aceites": "6-bottle olive oil pack",
      "pack-12-aceites": "12-bottle olive oil pack"
    }
  }
};
  Object.entries(ORDER_TX).forEach(([code, data])=>{const names={...SHOP_TX[code].names,...data.names};Object.assign(SHOP_TX[code],data,{names});});
  function lang(){const l=(localStorage.getItem('almazara-lang')||'ES').toUpperCase();return SHOP_TX[l]?l:'ES'}
  function tx(){return SHOP_TX[lang()]}
  function pname(id,p){return tx().names[id]||p.name}
  function pformat(p){return p.format==='Pieza'?tx().piece:p.format}

  function get() {
    try {
      const raw=JSON.parse(localStorage.getItem(KEY)||'{}');
      if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
      const clean={};
      Object.entries(raw).forEach(([id,qty])=>{
        const n=Number(qty);
        if(Object.hasOwn(CAT,id)&&Number.isInteger(n)&&n>0)clean[id]=Math.min(n,99);
      });
      return clean;
    } catch (_) { return {}; }
  }
  function money(value) {
    const locale={ES:'es-ES',DE:'de-CH',FR:'fr-CH',IT:'it-CH',EN:'en-GB'}[lang()];
    return 'CHF '+new Intl.NumberFormat(locale,{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)||0);
  }
  function count(cart=get()){return Object.values(cart).reduce((sum,qty)=>sum+qty,0)}
  function total(cart=get()){
    return Object.entries(cart).reduce((cents,[id,qty])=>cents+(CAT[id]?Math.round(CAT[id].price*100)*qty:0),0)/100;
  }
  function shippingSummary(cart=get()){
    const t=tx(),items=Object.entries(cart).filter(([id,qty])=>CAT[id]&&qty>0);
    if(!items.length)return {status:'empty',amount:null,total:null,label:'—',note:t.shippingEmpty};
    const everyFree=items.every(([id])=>CAT[id].shippingIncluded===true);
    const someFree=items.some(([id])=>CAT[id].shippingIncluded===true);
    return everyFree ? {status:'free',amount:0,total:total(cart),label:t.free,note:t.shippingFree} :
      {status:someFree?'mixed':'pending',amount:null,total:null,label:t.pending,note:someFree?t.shippingMixed:t.shippingPaid};
  }
  function thumbnail(id,p){
    return '<span class="shop-product-thumb">'+(p.image?'<img src="'+p.image+'" alt="'+pname(id,p)+'">':'<span class="shop-format-thumb">'+p.format+'</span>')+(p.isPack?'<small>×'+p.bottles+'</small>':'')+'</span>';
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
    document.querySelectorAll('[data-price-product]').forEach(el=>{
      const p=CAT[el.dataset.priceProduct];if(p)el.textContent=money(p.price);
    });
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
          thumbnail(id,p) +
          '<div><h3>' + pname(id,p) + '</h3><small>' + pformat(p) + '</small>' +
          '<div class="shop-qty"><button type="button" aria-label="'+t.decrease+'" data-act="minus" data-id="' + id + '">−</button>' +
          '<span>' + qty + '</span>' +
          '<button type="button" aria-label="'+t.increase+'" data-act="plus" data-id="' + id + '">+</button></div></div>' +
          '<div class="shop-line"><b>' + money(p.price * qty) + '</b>' +
          '<button type="button" class="shop-remove" data-act="remove" data-id="' + id + '">' + t.remove + '</button></div>' +
          '</article>';
      });
      const shipping=shippingSummary(cart);
      content += '</div>' +
        '<div class="shop-cart-total"><span>'+t.subtotal+'</span><strong>' + money(total(cart)) + '</strong></div>' +
        '<div class="shop-summary-row"><span>'+t.shippingLabel+'</span><strong>'+shipping.label+'</strong></div>' +
        '<div class="shop-summary-row shop-grand-total"><span>'+t.grandTotal+'</span><strong>'+(shipping.total===null?t.pending:money(shipping.total))+'</strong></div>' +
        '<p class="shop-shipping-note">'+shipping.note+'</p>' +
        '<a class="btn btn-gold shop-checkout" href="checkout.html">'+t.continue+'</a>';
    }

    drawer.innerHTML = content;
    document.dispatchEvent(new CustomEvent('almazara:cartchange'));
    drawer.querySelector('.premium-close')?.addEventListener('click', closeCart);
    drawer.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = get();
        const id = btn.dataset.id;
        if (btn.dataset.act === 'plus') next[id] = Math.min(99,(next[id] || 0) + 1);
        if (btn.dataset.act === 'minus') next[id] = Math.max(0, (next[id] || 0) - 1);
        if (btn.dataset.act === 'remove' || next[id] === 0) delete next[id];
        localStorage.setItem(KEY, JSON.stringify(next));
        render();
        openCart();
      });
    });
  }

  const motionTimers=new WeakMap();
  function animateAdded(source){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    [source,...document.querySelectorAll('.cart-trigger,.cart-drawer')].filter(Boolean).forEach(el=>{
      clearTimeout(motionTimers.get(el));el.classList.remove('cart-just-added');
      void el.offsetWidth;el.classList.add('cart-just-added');
      motionTimers.set(el,setTimeout(()=>el.classList.remove('cart-just-added'),760));
    });
  }
  function add(id, quantity=1, source=null) {
    if (!Object.hasOwn(CAT,id)) return;
    quantity=Math.min(99,Math.max(1,Math.floor(Number(quantity)||1)));
    const cart = get();
    cart[id] = Math.min(99,(cart[id] || 0) + quantity);
    localStorage.setItem(KEY, JSON.stringify(cart));
    render();
    openCart();
    animateAdded(source);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // app.js creates the drawer during the same DOMContentLoaded cycle.
    render();
    document.addEventListener('click', event => {
      const button = event.target.closest('.add-to-cart');
      if (!button) return;
      event.preventDefault();
      add(button.dataset.product,1,button);
    });
  });

  document.addEventListener('almazara:languagechange', render);
  window.AlmazaraShop = { get, total, count, money, render, add, pname, pformat, shippingSummary, thumbnail };
})();
