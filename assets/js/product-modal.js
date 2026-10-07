(function(){
 'use strict';
 const catalog=window.ALMAZARA_CATALOG,shop=window.AlmazaraShop;
 if(!catalog||!shop||document.getElementById('productQuickView'))return;
 const texts={
  "ES": {
    "close": "Cerrar descripción",
    "view": "Ver producto",
    "quantity": "Cantidad",
    "add": "AÑADIR AL CARRITO",
    "full": "Ver ficha completa →",
    "contact": "Consultar sobre este producto →",
    "description": "DESCRIPCIÓN",
    "delivery": "Gastos de envío aparte. El importe se confirmará antes del pago.",
    "free": "Envío incluido en este pack.",
    "unit": "por botella",
    "saving": "Ahorras",
    "mockup": "Imagen ilustrativa del formato de 125 ml.",
    "ham": "Jamón ibérico de la selección Almazara, presentado en pieza para cortar al momento. Una propuesta para preparar un aperitivo, acompañar una tabla y compartir en la mesa. Consulta el peso y las características de la pieza disponible antes de realizar tu pedido.",
    "shoulder": "Paleta ibérica de la selección Almazara, presentada en pieza para disfrutar en lonchas recién cortadas. Ideal para servir en aperitivos y tablas para compartir. Consulta el peso y las características de la pieza disponible antes de realizar tu pedido."
  },
  "DE": {
    "close": "Produktbeschreibung schließen",
    "view": "Produkt ansehen",
    "quantity": "Menge",
    "add": "IN DEN WARENKORB",
    "full": "Vollständige Produktdetails →",
    "contact": "Frage zu diesem Produkt →",
    "description": "BESCHREIBUNG",
    "delivery": "Zuzüglich Versandkosten. Der Betrag wird vor der Zahlung bestätigt.",
    "free": "Versand in diesem Paket inklusive.",
    "unit": "pro Flasche",
    "saving": "Sie sparen",
    "mockup": "Illustrative Darstellung des 125-ml-Formats.",
    "ham": "Ibérico-Schinken aus der Almazara-Auswahl, am Stück zum frischen Aufschneiden. Für einen Aperitif, eine Schinkenplatte oder gemeinsame Genussmomente. Bitte fragen Sie vor Ihrer Bestellung nach Gewicht und Eigenschaften des verfügbaren Stücks.",
    "shoulder": "Ibérico-Vorderschinken aus der Almazara-Auswahl, am Stück für frisch geschnittene Scheiben. Ideal als Aperitif oder auf einer Platte zum Teilen. Bitte fragen Sie vor Ihrer Bestellung nach Gewicht und Eigenschaften des verfügbaren Stücks."
  },
  "FR": {
    "close": "Fermer la description",
    "view": "Voir le produit",
    "quantity": "Quantité",
    "add": "AJOUTER AU PANIER",
    "full": "Voir la fiche complète →",
    "contact": "Poser une question sur ce produit →",
    "description": "DESCRIPTION",
    "delivery": "Frais de livraison en supplément. Le montant sera confirmé avant le paiement.",
    "free": "Livraison incluse pour ce pack.",
    "unit": "par bouteille",
    "saving": "Économisez",
    "mockup": "Visuel illustratif du format de 125 ml.",
    "ham": "Jambon ibérique de la sélection Almazara, proposé entier pour être tranché au moment de servir. À déguster à l’apéritif, sur une planche ou à partager à table. Contactez-nous pour connaître le poids et les caractéristiques de la pièce disponible avant de commander.",
    "shoulder": "Épaule ibérique de la sélection Almazara, proposée entière pour savourer des tranches fraîchement coupées. Idéale à l’apéritif et sur des planches à partager. Contactez-nous pour connaître le poids et les caractéristiques de la pièce disponible avant de commander."
  },
  "IT": {
    "close": "Chiudi descrizione",
    "view": "Vedi prodotto",
    "quantity": "Quantità",
    "add": "AGGIUNGI AL CARRELLO",
    "full": "Vedi la scheda completa →",
    "contact": "Chiedi informazioni sul prodotto →",
    "description": "DESCRIZIONE",
    "delivery": "Spese di spedizione escluse. L’importo sarà confermato prima del pagamento.",
    "free": "Spedizione inclusa per questa confezione.",
    "unit": "per bottiglia",
    "saving": "Risparmi",
    "mockup": "Immagine illustrativa del formato da 125 ml.",
    "ham": "Prosciutto iberico della selezione Almazara, proposto intero da affettare al momento. Da gustare come aperitivo, su un tagliere o da condividere a tavola. Prima di ordinare, contattaci per conoscere il peso e le caratteristiche del pezzo disponibile.",
    "shoulder": "Spalla iberica della selezione Almazara, proposta intera per gustare fette appena tagliate. Ideale per aperitivi e taglieri da condividere. Prima di ordinare, contattaci per conoscere il peso e le caratteristiche del pezzo disponibile."
  },
  "EN": {
    "close": "Close product description",
    "view": "View product",
    "quantity": "Quantity",
    "add": "ADD TO CART",
    "full": "View full product details →",
    "contact": "Ask about this product →",
    "description": "DESCRIPTION",
    "delivery": "Shipping costs extra. The amount will be confirmed before payment.",
    "free": "Shipping included with this pack.",
    "unit": "per bottle",
    "saving": "Save",
    "mockup": "Illustrative image of the 125 ml format.",
    "ham": "Iberian ham from the Almazara selection, offered as a whole piece to slice fresh. Enjoy it as an appetizer, on a sharing board or around the table. Please contact us for the weight and characteristics of the available piece before placing your order.",
    "shoulder": "Iberian shoulder from the Almazara selection, offered as a whole piece to enjoy freshly cut slices. Ideal for appetizers and sharing boards. Please contact us for the weight and characteristics of the available piece before placing your order."
  }
};
 const dialog=document.createElement('dialog');dialog.id='productQuickView';dialog.className='product-modal';dialog.setAttribute('aria-labelledby','quickTitle');dialog.setAttribute('aria-describedby','quickDescription');
 dialog.innerHTML=`<button type="button" class="product-modal-close" aria-label="Cerrar descripción" autofocus>×</button><div class="product-modal-layout"><div class="product-modal-visual"><img id="quickImage" alt="" width="1254" height="1254"/><span class="product-modal-pack" id="quickPack" hidden></span><p id="quickImageNote" hidden></p></div><div class="product-modal-copy"><p class="product-modal-brand">ALMAZARA</p><h2 id="quickTitle"></h2><p id="quickFormat"></p><strong id="quickPrice"></strong><p id="quickSaving" hidden></p><h3 id="quickDescriptionLabel"></h3><p id="quickDescription"></p><form id="quickBuy"><label><span id="quickQuantityLabel"></span><input id="quickQuantity" type="number" min="1" max="99" step="1" value="1" inputmode="numeric" required/></label><button type="submit" class="btn btn-gold" id="quickAdd"></button></form><p id="quickDelivery"></p><a id="quickFull"></a></div></div>`;
 document.body.append(dialog);
 let activeId=null,opener=null,restoreFocus=true;
 const $=id=>dialog.querySelector('#'+id);
 function language(){const l=(localStorage.getItem('almazara-lang')||'ES').toUpperCase();return texts[l]?l:'ES';}
 function apply(lang=language()){
  const t=texts[lang]||texts.ES;
  document.querySelectorAll('.product-preview-trigger').forEach(b=>{const p=catalog[b.dataset.quickProduct];b.setAttribute('aria-label',t.view+' · '+shop.pname(p.id,p)+' · '+shop.pformat(p));});
  dialog.querySelector('.product-modal-close').setAttribute('aria-label',t.close);
  if(!activeId)return;
  const p=catalog[activeId];
  $('quickTitle').textContent=shop.pname(activeId,p);$('quickFormat').textContent=shop.pformat(p);$('quickPrice').textContent=shop.money(p.price);
  $('quickImage').src=p.image;$('quickImage').alt=shop.pname(activeId,p)+' · '+shop.pformat(p);
  $('quickPack').hidden=!p.isPack;$('quickPack').textContent='×'+p.bottles+' · 500 ml';
  $('quickImageNote').hidden=activeId!=='aceite-premium-125';$('quickImageNote').textContent=t.mockup;
  const save=$('quickSaving');save.hidden=!p.isPack;
  if(p.isPack)save.textContent=shop.money(p.price/p.bottles)+' '+t.unit+' · '+t.saving+' '+shop.money(catalog['aceite-premium-500'].price*p.bottles-p.price);
  $('quickDescriptionLabel').textContent=t.description;
  $('quickDescription').textContent=description(activeId,lang);
  $('quickQuantityLabel').textContent=t.quantity;$('quickAdd').textContent=t.add;
  $('quickDelivery').textContent=p.shippingIncluded?t.free:t.delivery;$('quickDelivery').classList.toggle('is-free',!!p.shippingIncluded);
  $('quickFull').textContent=t.full;
  window.AlmazaraProductNavigation.prepareLink($('quickFull'),activeId,()=>$('quickQuantity').value);
 }
 function description(id,lang=language()){
  const p=catalog[id],t=texts[lang]||texts.ES;if(!p)return '';
  return p.category==='aceites'?window.AlmazaraI18n.translate(p.description,lang):t[id==='jamon-iberico'?'ham':'shoulder'];
 }
 function open(id,trigger){
  if(!Object.hasOwn(catalog,id))return;
  activeId=id;opener=trigger;restoreFocus=true;$('quickQuantity').value='1';apply();
  if(!dialog.open){document.body.classList.add('product-modal-open');dialog.showModal();}
  dialog.scrollTop=0;dialog.querySelector('.product-modal-close').focus({preventScroll:true});
 }
 function close(){window.AlmazaraProductNavigation.clearReturn();dialog.close();}
 dialog.querySelector('.product-modal-close').addEventListener('click',close);
 dialog.addEventListener('cancel',()=>window.AlmazaraProductNavigation.clearReturn());
 let downOnBackdrop=false;
 dialog.addEventListener('pointerdown',e=>{downOnBackdrop=e.target===dialog;});
 dialog.addEventListener('click',e=>{if(e.target===dialog&&downOnBackdrop)close();downOnBackdrop=false;});
 dialog.addEventListener('close',()=>{document.body.classList.remove('product-modal-open');window.AlmazaraProductNavigation.clearReturn();if(restoreFocus&&opener?.isConnected)opener.focus({preventScroll:true});});
 $('quickBuy').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const qty=Number($('quickQuantity').value),id=activeId;restoreFocus=false;close();requestAnimationFrame(()=>{shop.add(id,qty,$('quickAdd'));document.querySelector('.cart-drawer .premium-close')?.focus({preventScroll:true});});});
 document.addEventListener('click',event=>{const trigger=event.target.closest('[data-quick-product]');if(!trigger||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();open(trigger.dataset.quickProduct,trigger);});
 document.addEventListener('almazara:languagechange',event=>apply(event.detail.lang));
 window.AlmazaraProductModal={apply,open,description};apply();
})();
