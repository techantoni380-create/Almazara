(function(){
 'use strict';
 const catalog=window.ALMAZARA_CATALOG||{},shop=window.AlmazaraShop;
 const requested=new URLSearchParams(location.search).get('id');
 const id=Object.hasOwn(catalog,requested)?requested:'aceite-premium-500';
 const product=catalog[id];
 const isOil=product?.category==='aceites';
 if(!product||!shop)return;
 const copy={
  ES:{back:'Todos los productos',selection:'SELECCIÓN DE ACEITES',title:'Aceite de oliva',titleEnd:'virgen extra.',pack:'Pack de {n} botellas',choose:'Elige tu formato',quantity:'Cantidad',add:'AÑADIR AL CARRITO',description:'Descripción',details:'Detalles del producto',delivery:'Envío',enjoy:'Un lugar en tu mesa.',uses:'Disfrútalo con pan, aliña tus ensaladas o añádelo como toque final a tus platos. Elige una botella individual o un pack para compartir.',shippingHelp:'¿Dudas sobre el envío? Escríbenos →',end:'El placer de elegir bien.',all:'Descubrir todos los aceites →',photoPending:'Imagen próximamente',brand:'Marca',type:'Producto',oil:'Aceite de oliva virgen extra',format:'Formato',bottles:'Número de botellas',total:'Contenido total',unit:'por botella',saving:'Ahorras {n}',formats:'Formatos disponibles',information:'Información del producto',navigation:'Navegación',free:'Envío incluido en este pack.',paid:'Gastos de envío aparte. El importe se confirmará antes del pago.',freeLong:'El pack de 12 × 500 ml incluye el envío. Si añades otros productos, sus gastos de envío se confirmarán antes del pago.',photo:'Presentación de la botella ALMAZARA de 500 ml'},
  DE:{back:'Alle Produkte',selection:'OLIVENÖL-AUSWAHL',title:'Olivenöl',titleEnd:'extra nativ.',pack:'Paket mit {n} Flaschen',choose:'Wählen Sie Ihr Format',quantity:'Menge',add:'IN DEN WARENKORB',description:'Beschreibung',details:'Produktdetails',delivery:'Versand',enjoy:'Ein Platz auf Ihrem Tisch.',uses:'Genießen Sie es mit Brot, zum Salat oder als letzten Schliff Ihrer Gerichte. Wählen Sie eine einzelne Flasche oder ein Paket zum Teilen.',shippingHelp:'Fragen zum Versand? Schreiben Sie uns →',end:'Die Freude an einer guten Wahl.',all:'Alle Olivenöle entdecken →',photoPending:'Bild folgt',brand:'Marke',type:'Produkt',oil:'Extra natives Olivenöl',format:'Format',bottles:'Anzahl der Flaschen',total:'Gesamtinhalt',unit:'pro Flasche',saving:'Sie sparen {n}',formats:'Verfügbare Formate',information:'Produktinformationen',navigation:'Navigation',free:'Versand in diesem Paket inklusive.',paid:'Zuzüglich Versandkosten. Der Betrag wird vor der Zahlung bestätigt.',freeLong:'Beim Paket mit 12 × 500 ml ist der Versand inklusive. Wenn Sie weitere Produkte hinzufügen, werden deren Versandkosten vor der Zahlung bestätigt.',photo:'Produktdarstellung der ALMAZARA 500-ml-Flasche'},
  FR:{back:'Tous les produits',selection:'SÉLECTION D’HUILES',title:'Huile d’olive',titleEnd:'vierge extra.',pack:'Pack de {n} bouteilles',choose:'Choisissez votre format',quantity:'Quantité',add:'AJOUTER AU PANIER',description:'Description',details:'Détails du produit',delivery:'Livraison',enjoy:'Une place à votre table.',uses:'Savourez-la avec du pain, pour assaisonner vos salades ou apporter la touche finale à vos plats. Choisissez une bouteille ou un pack à partager.',shippingHelp:'Des questions sur la livraison ? Écrivez-nous →',end:'Le plaisir de bien choisir.',all:'Découvrir toutes les huiles →',photoPending:'Photo à venir',brand:'Marque',type:'Produit',oil:'Huile d’olive vierge extra',format:'Format',bottles:'Nombre de bouteilles',total:'Contenu total',unit:'par bouteille',saving:'Économisez {n}',formats:'Formats disponibles',information:'Informations sur le produit',navigation:'Navigation',free:'Livraison incluse pour ce pack.',paid:'Frais de livraison en supplément. Le montant sera confirmé avant le paiement.',freeLong:'Le pack de 12 × 500 ml inclut la livraison. Si vous ajoutez d’autres produits, leurs frais de livraison seront confirmés avant le paiement.',photo:'Présentation de la bouteille ALMAZARA de 500 ml'},
  IT:{back:'Tutti i prodotti',selection:'SELEZIONE DI OLI',title:'Olio d’oliva',titleEnd:'extravergine.',pack:'Confezione da {n} bottiglie',choose:'Scegli il formato',quantity:'Quantità',add:'AGGIUNGI AL CARRELLO',description:'Descrizione',details:'Dettagli del prodotto',delivery:'Spedizione',enjoy:'Un posto sulla tua tavola.',uses:'Gustalo con il pane, condisci le insalate o aggiungilo come tocco finale ai tuoi piatti. Scegli una bottiglia o una confezione da condividere.',shippingHelp:'Dubbi sulla spedizione? Scrivici →',end:'Il piacere di scegliere bene.',all:'Scopri tutti gli oli →',photoPending:'Immagine in arrivo',brand:'Marca',type:'Prodotto',oil:'Olio extravergine d’oliva',format:'Formato',bottles:'Numero di bottiglie',total:'Contenuto totale',unit:'per bottiglia',saving:'Risparmi {n}',formats:'Formati disponibili',information:'Informazioni sul prodotto',navigation:'Navigazione',free:'Spedizione inclusa per questa confezione.',paid:'Spese di spedizione escluse. L’importo sarà confermato prima del pagamento.',freeLong:'La confezione da 12 × 500 ml include la spedizione. Se aggiungi altri prodotti, le relative spese di spedizione saranno confermate prima del pagamento.',photo:'Presentazione della bottiglia ALMAZARA da 500 ml'},
  EN:{back:'All products',selection:'OLIVE OIL SELECTION',title:'Olive oil',titleEnd:'extra virgin.',pack:'Pack of {n} bottles',choose:'Choose your format',quantity:'Quantity',add:'ADD TO CART',description:'Description',details:'Product details',delivery:'Shipping',enjoy:'A place at your table.',uses:'Enjoy it with bread, dress your salads or add a finishing touch to your dishes. Choose an individual bottle or a pack to share.',shippingHelp:'Questions about shipping? Contact us →',end:'The pleasure of choosing well.',all:'Discover all olive oils →',photoPending:'Image coming soon',brand:'Brand',type:'Product',oil:'Extra virgin olive oil',format:'Format',bottles:'Number of bottles',total:'Total volume',unit:'per bottle',saving:'Save {n}',formats:'Available formats',information:'Product information',navigation:'Navigation',free:'Shipping included with this pack.',paid:'Shipping costs extra. The amount will be confirmed before payment.',freeLong:'The 12 × 500 ml pack includes shipping. If you add other products, their shipping costs will be confirmed before payment.',photo:'Product presentation of the ALMAZARA 500 ml bottle'}
 };
 const $=id=>document.getElementById(id);
 const hamCopy={
  ES:{selection:'SELECCIÓN DE IBÉRICOS',choose:'Elige tu producto',all:'Descubrir todos los ibéricos →',weight:'Peso de la pieza',checkWeight:'Consultar la pieza disponible',nutrition:'Información nutricional',checkNutrition:'Solicítanos la ficha del proveedor'},
  DE:{selection:'IBÉRICO-AUSWAHL',choose:'Wählen Sie Ihr Produkt',all:'Alle Ibérico-Produkte entdecken →',weight:'Gewicht des Stücks',checkWeight:'Bitte nach dem verfügbaren Stück fragen',nutrition:'Nährwertangaben',checkNutrition:'Das Produktdatenblatt ist auf Anfrage erhältlich'},
  FR:{selection:'SÉLECTION IBÉRIQUE',choose:'Choisissez votre produit',all:'Découvrir tous les produits ibériques →',weight:'Poids de la pièce',checkWeight:'Nous consulter pour la pièce disponible',nutrition:'Informations nutritionnelles',checkNutrition:'Demandez-nous la fiche du fournisseur'},
  IT:{selection:'SELEZIONE IBERICA',choose:'Scegli il prodotto',all:'Scopri tutti i prodotti iberici →',weight:'Peso del pezzo',checkWeight:'Chiedici informazioni sul pezzo disponibile',nutrition:'Informazioni nutrizionali',checkNutrition:'Richiedici la scheda del fornitore'},
  EN:{selection:'IBERIAN SELECTION',choose:'Choose your product',all:'Discover all Iberian products →',weight:'Piece weight',checkWeight:'Ask about the available piece',nutrition:'Nutritional information',checkNutrition:'Request the supplier’s product information'}
 };
 function apply(lang){
  const code=String(lang||'ES').toUpperCase();
  const t={...(copy[code]||copy.ES),...(!isOil?(hamCopy[code]||hamCopy.ES):{})};
  document.querySelectorAll('[data-detail-text]').forEach(el=>el.textContent=t[el.dataset.detailText]);
  window.AlmazaraProductNavigation.updateBack(lang);
  document.querySelector('[data-detail-text="uses"]').hidden=!isOil;
  document.querySelector('[data-detail-text="all"]').href=isOil?'aceites.html#comprar-aceites':'jamones.html#ibericos';
  const title=$('detailTitle');title.replaceChildren();
  if(!isOil)title.textContent=shop.pname(id,product);
  else if(product.isPack)title.textContent=t.pack.replace('{n}',product.bottles);
  else{title.append(document.createTextNode(t.title),document.createElement('br'));const em=document.createElement('em');em.textContent=t.titleEnd;title.append(em);}
  document.title=(isOil?t.oil:shop.pname(id,product))+' · '+shop.pformat(product)+' · ALMAZARA';
  $('detailCrumb').textContent=isOil?product.format:shop.pname(id,product);
  $('detailFormat').textContent=shop.pformat(product);
  $('detailPrice').textContent=shop.money(product.price);
  const saving=$('detailSaving');saving.hidden=!product.isPack;
  saving.textContent=product.isPack?t.saving.replace('{n}',shop.money(catalog['aceite-premium-500'].price*product.bottles-product.price)):'';
  const description=window.AlmazaraProductModal.description(id,code);
  $('detailIntro').textContent=description;$('detailDescription').textContent=description;
  // The 125 ml visual is a user-requested mockup based on the 500 ml bottle.
  const visual=$('detailImage');visual.hidden=!product.image;$('detailPlaceholder').hidden=!!product.image;
  if(product.image){visual.src=product.image;visual.alt=!isOil?shop.pname(id,product):product.isPack?t.pack.replace('{n}',product.bottles)+' · 500 ml':t.photo.replace(/500/g,String(product.volumeMl));}
  const badge=$('detailPack');badge.hidden=!product.isPack;badge.textContent='×'+product.bottles+' · 500 ml';
  let imageNote=document.getElementById('detailImageNote');
  if(!imageNote){imageNote=document.createElement('p');imageNote.id='detailImageNote';document.querySelector('.oil-detail-visual').append(imageNote);}
  imageNote.hidden=!product.imageIllustrative;
  imageNote.textContent=({ES:'Imagen ilustrativa del formato de 125 ml.',DE:'Illustrative Darstellung des 125-ml-Formats.',FR:'Visuel illustratif du format de 125 ml.',IT:'Immagine illustrativa del formato da 125 ml.',EN:'Illustrative image of the 125 ml format.'})[String(lang||'ES').toUpperCase()]||'';
  const choices=$('detailChoices');choices.replaceChildren();choices.setAttribute('aria-label',t.formats);
  for(const p of Object.values(catalog).filter(p=>p.category===product.category)){
   const link=document.createElement('a');link.href=window.AlmazaraProductNavigation.formatURL(p.id);
   if(window.AlmazaraProductNavigation.isReturning())link.addEventListener('click',event=>{if(event.button===0&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();location.replace(link.href);}});
   if(p.id===id){link.className='is-current';link.setAttribute('aria-current','page');}
   const size=document.createElement('b');size.textContent=isOil?p.format:shop.pname(p.id,p);
   const price=document.createElement('small');price.textContent=shop.money(p.price);link.append(size,price);choices.append(link);
  }
  $('detailShipping').textContent=product.shippingIncluded?t.free:t.paid;
  $('detailShipping').classList.toggle('is-free',product.shippingIncluded);
  $('detailShippingLong').textContent=product.shippingIncluded?t.freeLong:t.paid;
  const facts=$('detailFacts');facts.replaceChildren();
  const rows=isOil?[[t.brand,'ALMAZARA'],[t.type,t.oil],[t.format,product.format],[t.bottles,String(product.bottles)],[t.total,product.volumeMl*product.bottles+' ml']]:[[t.type,shop.pname(id,product)],[t.format,shop.pformat(product)]];
  if(product.isPack)rows.push([t.unit,shop.money(product.price/product.bottles)]);
  if(!isOil)rows.push([t.weight,t.checkWeight],[t.nutrition,t.checkNutrition]);
  for(const [label,value]of rows){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);facts.append(row);}
  document.querySelector('.oil-detail-tabs').setAttribute('aria-label',t.information);
  document.querySelector('.oil-breadcrumb').setAttribute('aria-label',t.navigation);
 }
 $('detailBuy').addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity())shop.add(id,Number($('detailQuantity').value),event.currentTarget.querySelector('[type="submit"]'));});
 const tabs=[...document.querySelectorAll('.oil-detail-tabs [role="tab"]')];
 function selectTab(tab){tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;$(item.getAttribute('aria-controls')).hidden=!active;});}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectTab(tabs[next]);tabs[next].focus();});});
 window.AlmazaraProduct={apply};
 apply(localStorage.getItem('almazara-lang')||'ES');
})();
