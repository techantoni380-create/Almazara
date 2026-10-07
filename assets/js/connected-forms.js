/* Same-origin PHP endpoints. No credentials or financial decisions in the browser. */
(() => {
 'use strict';
 const copy={
 ES:{unavailable:'El servicio no está disponible en este momento. Escríbenos desde Contacto y te ayudamos.',rate:'Has realizado varios intentos. Prueba más tarde.',csrf:'La sesión ha caducado. Recarga la página e inténtalo de nuevo.',email:'Introduce un correo electrónico válido.',consent:'Acepta la política de privacidad para continuar.',invalid:'Revisa los datos del formulario.',newsletterOK:'Revisa tu correo para confirmar la suscripción. Si ya estabas suscrito, no necesitas hacer nada más.',contactOK:'Mensaje enviado. Gracias, te responderemos lo antes posible.',trap:'Deja este campo vacío'},
 DE:{unavailable:'Der Dienst ist derzeit nicht verfügbar. Bitte nutze unsere Kontaktseite.',rate:'Zu viele Versuche. Bitte versuche es später erneut.',csrf:'Die Sitzung ist abgelaufen. Lade die Seite neu.',email:'Gib eine gültige E-Mail-Adresse ein.',consent:'Bitte akzeptiere die Datenschutzerklärung.',invalid:'Bitte prüfe deine Angaben.',newsletterOK:'Prüfe deine E-Mails und bestätige das Abonnement. Falls du bereits angemeldet bist, ist nichts weiter nötig.',contactOK:'Nachricht gesendet. Wir melden uns so bald wie möglich.',trap:'Dieses Feld leer lassen'},
 FR:{unavailable:'Le service est momentanément indisponible. Écrivez-nous depuis la page Contact.',rate:'Trop de tentatives. Réessayez plus tard.',csrf:'La session a expiré. Rechargez la page.',email:'Saisissez une adresse e-mail valide.',consent:'Acceptez la politique de confidentialité.',invalid:'Vérifiez les informations du formulaire.',newsletterOK:'Consultez votre e-mail pour confirmer l’inscription. Si vous êtes déjà inscrit, aucune action n’est nécessaire.',contactOK:'Message envoyé. Nous vous répondrons dès que possible.',trap:'Laissez ce champ vide'},
 IT:{unavailable:'Il servizio non è disponibile al momento. Scrivici dalla pagina Contatti.',rate:'Troppi tentativi. Riprova più tardi.',csrf:'La sessione è scaduta. Ricarica la pagina.',email:'Inserisci un indirizzo email valido.',consent:'Accetta l’informativa sulla privacy.',invalid:'Controlla i dati del modulo.',newsletterOK:'Controlla la posta per confermare l’iscrizione. Se sei già iscritto non occorre fare altro.',contactOK:'Messaggio inviato. Ti risponderemo il prima possibile.',trap:'Lascia vuoto questo campo'},
 EN:{unavailable:'This service is temporarily unavailable. Please get in touch through our Contact page.',rate:'Too many attempts. Please try again later.',csrf:'Your session has expired. Reload this page.',email:'Enter a valid email address.',consent:'Accept the privacy policy to continue.',invalid:'Please check the form details.',newsletterOK:'Check your inbox to confirm your subscription. If you are already subscribed, no further action is needed.',contactOK:'Message sent. We will reply as soon as possible.',trap:'Leave this field empty'}
 };
 const lang=()=>{try{return(localStorage.getItem('almazara-lang')||'ES').toUpperCase()}catch(_){return'ES'}},tx=()=>copy[lang()]||copy.ES;
 let statusPromise;
 async function request(action,data){
  if(location.protocol==='file:')throw {code:'unavailable'};
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
  try{const res=await fetch('api/index.php?action='+action,{method:data?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:data?{'Content-Type':'application/json','X-CSRF-Token':(await status()).csrf}:{},body:data?JSON.stringify(data):undefined});const json=await res.json();if(!res.ok||!json.ok)throw json;return json}catch(e){throw {code:e.code||'unavailable'}}finally{clearTimeout(timer)}
 }
 async function status(){if(!statusPromise)statusPromise=request('status').catch(e=>{statusPromise=null;throw e});return statusPromise}
 window.AlmazaraAPI={request,status,lang};
 const forms=[...document.querySelectorAll('.newsletter-live-form,.contact-premium-fields')];
 function show(form,code,error){const el=form.querySelector('.newsletter-success,.form-result');el.dataset.message=code;el.dataset.state=error?'error':'success';el.classList.add('is-visible');el.textContent=tx()[code]||tx().unavailable}
 forms.forEach(form=>{
  const isNews=form.matches('.newsletter-live-form');form.noValidate=false;
  if(!isNews){const fields=form.querySelectorAll('input');fields[0].name='name';fields[0].required=true;fields[0].maxLength=100;fields[0].minLength=2;fields[1].name='email';fields[1].required=true;fields[2].name='phone';fields[2].maxLength=40;const area=form.querySelector('textarea');area.name='message';area.required=true;area.minLength=5;area.maxLength=5000;const consent=form.querySelector('[type=checkbox]');consent.required=true;form.querySelector('.contact-premium-submit').type='submit';const el=document.createElement('p');el.className='form-result';el.setAttribute('role','status');el.setAttribute('aria-live','polite');form.append(el)}
  const email=form.querySelector('[type=email]');email.name='email';email.maxLength=254;email.autocomplete='email';email.inputMode='email';
  const trap=document.createElement('label');trap.className='form-trap';trap.setAttribute('aria-hidden','true');trap.textContent=tx().trap;const inp=document.createElement('input');inp.name='website';inp.tabIndex=-1;inp.autocomplete='off';trap.append(inp);form.append(trap);
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(form.dataset.sending==='true'||!form.reportValidity())return;
   const btn=form.querySelector('[type=submit]');form.dataset.sending='true';btn.disabled=true;btn.setAttribute('aria-busy','true');
   try{const s=await status();if(!s[isNews?'newsletter':'contact'])throw {code:'unavailable'};const body={email:email.value.trim(),consent:form.querySelector('[type=checkbox]').checked,website:inp.value,lang:lang()};if(!isNews)Object.assign(body,{name:form.elements.name.value.trim(),message:form.elements.message.value.trim(),phone:form.elements.phone.value.trim()});await request(isNews?'newsletter':'contact',body);show(form,isNews?'newsletterOK':'contactOK',false);form.reset()}catch(e){show(form,e.code,true)}finally{form.dataset.sending='false';btn.disabled=false;btn.removeAttribute('aria-busy')}
  });
 });
 document.addEventListener('almazara:languagechange',()=>forms.forEach(form=>{const el=form.querySelector('[data-message]');if(el)show(form,el.dataset.message,el.dataset.state==='error')}));
})();
