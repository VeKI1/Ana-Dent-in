/* Ana Dent-In — logika sajta (bez biblioteka)
 *
 * FORM_ENDPOINT: da bi poruke stizale na e-mail, napravite besplatan formular na
 * https://formspree.io i ovde upišite njegov URL (npr. 'https://formspree.io/f/abcdwxyz').
 * Dok je prazno, forma samo prikazuje potvrdu.
 */
const FORM_ENDPOINT = '';

/* Meni (mobilni) */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
  mobileMenu.hidden = !open;
  menuBtn.textContent = open ? 'Zatvori' : 'Meni';
  menuBtn.setAttribute('aria-expanded', String(open));
}
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* Senka zaglavlja + aktivna stavka menija */
const header = document.getElementById('header');
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const y = window.scrollY + 140;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Animacija pri skrolovanju */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  const SEL = '.section .section-head, .section .split>*, .svc-card, .why-list li, .ba, .review, .faq details, .contact-col>*, .message, .footer-grid>*';
  document.querySelectorAll(SEL).forEach(el => {
    el.classList.add('reveal');
    const sib = [...el.parentElement.children].filter(c => c.matches(SEL));
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 5) * 0.07 + 's');
    io.observe(el);
  });
}

/* Pre / posle klizač */
document.querySelectorAll('.ba').forEach(fig => {
  const input = fig.querySelector('input');
  input.addEventListener('input', () => fig.style.setProperty('--pos', input.value + '%'));
});

/* Kontakt forma */
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cErr = document.getElementById('cError');
function showError(msg) { cErr.textContent = msg; cErr.hidden = !msg; }
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const contact = document.getElementById('cContact').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  if (name.length < 2) return showError('Unesite ime i prezime.');
  if (!/@|\d{6,}/.test(contact.replace(/\s/g, ''))) return showError('Unesite telefon ili e-mail.');
  if (msg.length < 5) return showError('Napišite poruku.');
  showError('');
  if (FORM_ENDPOINT) {
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: 'Poruka sa sajta — ' + name, ime: name, kontakt: contact, poruka: msg }) });
      if (!r.ok) throw 0;
    } catch (_) { return showError('Slanje nije uspelo. Pozovite nas na +381 64 906 3633.'); }
  }
  document.getElementById('cSummary').innerHTML = `Hvala, ${esc(name.split(' ')[0])}! Javićemo vam se na <b>${esc(contact)}</b> u toku radnog vremena.`;
  e.target.hidden = true; document.getElementById('contactDone').hidden = false;
});
document.getElementById('cReset').addEventListener('click', () => {
  document.getElementById('cMsg').value = '';
  document.getElementById('contactForm').hidden = false; document.getElementById('contactDone').hidden = true;
});

/* Današnji dan u radnom vremenu + godina */
const today = String(new Date().getDay());
document.querySelectorAll('#hours [data-days]').forEach(r => r.classList.toggle('today', r.dataset.days.split(',').includes(today)));
document.getElementById('year').textContent = new Date().getFullYear();
