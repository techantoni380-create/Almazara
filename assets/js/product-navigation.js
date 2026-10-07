(function(){
 'use strict';
 const catalog=window.ALMAZARA_CATALOG||{};
 const pages=['index.html','aceites.html','jamones.html','productos.html'];
 const prefix='almazara-product-return:';
 const current=location.pathname.split('/').pop()||'index.html';
 const labels={ES:'← Volver al producto',DE:'← Zurück zum Produkt',FR:'← Revenir au produit',IT:'← Torna al prodotto',EN:'← Back to product'};
 const params=new URLSearchParams(location.search);
 const known=id=>typeof id==='string'&&Object.hasOwn(catalog,id);
 function read(token){
  if(!/^[a-z0-9-]{1,80}$/.test(token||''))return null;
  try{const data=JSON.parse(sessionStorage.getItem(prefix+token));return data&&pages.includes(data.page)&&known(data.product)?data:null;}catch{return null;}
 }
 function currentContext(){
  const token=params.get('context'),saved=read(token);
  if(saved)return {...saved,token};
  return {page:pages.includes(params.get('from'))?params.get('from'):'productos.html',product:known(params.get('view'))?params.get('view'):params.get('id'),quantity:1,scroll:0};
 }
 function detailURL(id,context){
  const query=new URLSearchParams({id});
  if(context){query.set('from',context.page);query.set('view',context.product);if(context.token)query.set('context',context.token);}
  return 'producto.html?'+query;
 }
 function remember(id,quantity,scroll){
  if(!known(id)||!pages.includes(current))return null;
  const form=document.getElementById('catalog-filters');
  const context={page:current,product:id,quantity:Math.min(99,Math.max(1,Number(quantity)||1)),scroll:Number.isFinite(scroll)?scroll:window.scrollY,
   categories:form?[...form.querySelectorAll('[name="category"]:checked')].map(el=>el.value):[],
   maxPrice:form?.querySelector('#catalog-max-price')?.value??'500'};
  const token=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
  try{sessionStorage.setItem(prefix+token,JSON.stringify(context));context.token=token;}catch{}
  history.replaceState({...history.state,almazaraProductReturn:context},'');
  return context;
 }
 function prepareLink(link,id,quantity){
  const scroll=window.scrollY;
  const context={page:pages.includes(current)?current:'productos.html',product:id};
  link.href=detailURL(id,context);
  link.onclick=event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const saved=remember(id,typeof quantity==='function'?quantity():quantity,scroll);
   if(saved)link.href=detailURL(id,saved);
  };
 }
 function backURL(){
  const context=currentContext(),query=new URLSearchParams();
  query.set('view',known(context.product)?context.product:'aceite-premium-500');
  if(context.token)query.set('resume',context.token);
  return context.page+'?'+query;
 }
 function updateBack(lang){
  const link=document.getElementById('detailBack');if(!link)return;
  link.href=backURL();link.textContent=labels[String(lang||'ES').toUpperCase()]||labels.ES;
 }
 function clearReturn(){
  history.scrollRestoration='auto';
  if(!history.state?.almazaraProductReturn)return;
  const state={...history.state};delete state.almazaraProductReturn;history.replaceState(state,'');
 }
 function restore(){
  if(!pages.includes(current))return;
  const query=new URLSearchParams(location.search);
  const context=read(query.get('resume'))||
   (known(query.get('view'))?{page:current,product:query.get('view'),quantity:1}:history.state?.almazaraProductReturn);
  if(!context||context.page!==current||!known(context.product))return;
  const modal=window.AlmazaraProductModal;if(!modal)return;
  const form=document.getElementById('catalog-filters');
  if(form&&Array.isArray(context.categories)){
   form.querySelectorAll('[name="category"]').forEach(el=>el.checked=context.categories.includes(el.value));
   form.querySelector('#catalog-max-price').value=context.maxPrice;
   form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  }
  const trigger=document.querySelector('[data-quick-product="'+context.product+'"]');
  history.scrollRestoration='manual';
  const restoreScroll=()=>{
   if(Number.isFinite(context.scroll))window.scrollTo({top:context.scroll,behavior:'instant'});
   else trigger?.closest('.card')?.scrollIntoView({block:'center',behavior:'instant'});
  };
  restoreScroll();
  modal.open(context.product,trigger);
  const quantity=document.getElementById('quickQuantity');if(quantity)quantity.value=String(context.quantity||1);
  query.delete('resume');query.delete('view');
  history.replaceState({...history.state,almazaraProductReturn:context},'',location.pathname+(query.size?'?'+query:'')+location.hash);
  requestAnimationFrame(restoreScroll);
  if(document.readyState!=='complete')window.addEventListener('load',restoreScroll,{once:true});
 }
 // DOMContentLoaded handles a normal navigation; pageshow also handles browser Back/BFCache.
 document.addEventListener('DOMContentLoaded',restore);
 window.addEventListener('pageshow',event=>{if(event.persisted)restore();});
 document.addEventListener('almazara:languagechange',event=>updateBack(event.detail.lang));
 window.AlmazaraProductNavigation={prepareLink,updateBack,clearReturn,
  formatURL:id=>detailURL(id,currentContext()),
  isReturning:()=>!!params.get('context')||!!params.get('from')};
})();
