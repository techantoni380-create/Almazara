/* Standalone local pages: no network request is needed to change language. */
(() => {
  'use strict';
  const labels = {
    ES: {kicker:'ALMAZARA · Información legal',documents:'Información legal',contents:'En esta página',review:'Texto en revisión',date:'Versión del 24 de septiembre de 2026',contact:'Contacto de la empresa',country:'Suiza',skip:'Saltar al contenido'},
    DE: {kicker:'ALMAZARA · Rechtliche Informationen',documents:'Rechtliche Informationen',contents:'Auf dieser Seite',review:'Text zur Prüfung',date:'Fassung vom 24. September 2026',contact:'Unternehmenskontakt',country:'Schweiz',skip:'Zum Inhalt springen'},
    FR: {kicker:'ALMAZARA · Informations légales',documents:'Informations légales',contents:'Sur cette page',review:'Texte en cours de validation',date:'Version du 24 septembre 2026',contact:'Contact de l’entreprise',country:'Suisse',skip:'Aller au contenu'},
    IT: {kicker:'ALMAZARA · Informazioni legali',documents:'Informazioni legali',contents:'In questa pagina',review:'Testo in revisione',date:'Versione del 24 settembre 2026',contact:'Contatti della società',country:'Svizzera',skip:'Vai al contenuto'},
    EN: {kicker:'ALMAZARA · Legal information',documents:'Legal information',contents:'On this page',review:'Text under review',date:'Version dated 24 September 2026',contact:'Company contact',country:'Switzerland',skip:'Skip to content'}
  };
  const documents = ['aviso-legal','privacidad','cookies','impressum'];
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const rich = text => escape(text)
    .replace(/almazara\.olive@gmail\.com/g, '<a href="mailto:almazara.olive@gmail.com">almazara.olive@gmail.com</a>')
    .replace(/\+41 76 785 05 06/g, '<a href="tel:+41767850506">+41 76 785 05 06</a>');
  function apply(lang) {
    const page = document.body.dataset.legalPage;
    const content = window.AlmazaraLegalContent;
    if (!page || !content?.[page]) return;
    lang = labels[lang] ? lang : 'ES';
    const ui = labels[lang], doc = content[page][lang];
    document.title = doc.title + ' · ALMAZARA';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = doc.intro;
    document.querySelectorAll('[data-legal-ui]').forEach(el => { el.textContent = ui[el.dataset.legalUi] || ''; });
    document.querySelector('#legal-title').textContent = doc.title;
    document.querySelector('.legal-hero-intro').textContent = doc.intro;
    document.querySelector('.legal-document-nav').setAttribute('aria-label',ui.documents);
    document.querySelector('.legal-document-nav').innerHTML = documents.map(key =>
      `<a href="${key}.html"${key === page ? ' aria-current="page"' : ''}>${escape(content[key][lang].title)}</a>`).join('');
    document.querySelector('.legal-toc').setAttribute('aria-label',ui.contents);
    document.querySelector('.legal-toc ol').innerHTML = doc.sections.map((section,index) =>
      `<li><a href="#section-${index+1}">${escape(section.title)}</a></li>`).join('');
    document.querySelector('#legal-sections').innerHTML = doc.sections.map((section,index) =>
      `<section class="legal-section" id="section-${index+1}"><h2>${escape(section.title)}</h2>`+
      section.paragraphs.map(text => `<p>${rich(text)}</p>`).join('')+
      (section.items?.length ? '<ul>'+section.items.map(text => `<li>${rich(text)}</li>`).join('')+'</ul>' : '')+
      '</section>').join('');
  }
  window.AlmazaraLegal = {apply};
  function init() {
    let lang = 'ES';
    try { lang = localStorage.getItem('almazara-lang') || lang; } catch (_) { /* Static Spanish remains readable. */ }
    apply(lang.toUpperCase());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
