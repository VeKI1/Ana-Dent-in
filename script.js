/* Ana Dent-In — logika sajta (bez biblioteka)
 *
 * FORM_ENDPOINT: da bi zahtevi i poruke stizali na e-mail, napravite besplatan
 * formular na https://formspree.io (ili sličnom servisu) i ovde upišite njegov URL,
 * npr. 'https://formspree.io/f/abcdwxyz'. Dok je prazno, forme samo prikazuju potvrdu.
 */
const FORM_ENDPOINT = '';

const PAGES = {
  'pocetna': 'Ana Dent-In — Stomatološka ordinacija Niš',
  'usluge': 'Usluge — Ana Dent-In',
  'o-nama': 'O nama — Ana Dent-In',
  'zakazivanje': 'Zakazivanje — Ana Dent-In',
  'pitanja': 'Česta pitanja — Ana Dent-In',
  'kontakt': 'Kontakt — Ana Dent-In'
};

/* ---------- Navigacija (#/stranica) ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
  mobileMenu.hidden = !open;
  menuBtn.textContent = open ? 'Zatvori' : 'Meni';
  menuBtn.setAttribute('aria-expanded', String(open));
}
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));

function route(scroll) {
  const key = location.hash.replace(/^#\/?/, '');
  const page = key in PAGES ? key : 'pocetna';
  document.body.dataset.page = page;
  document.title = PAGES[page];
  document.querySelectorAll('[data-show]').forEach(el => { el.hidden = !el.dataset.show.split(' ').includes(page); });
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));
  setMenu(false);
  if (scroll) {
    window.scrollTo(0, 0);
    const m = document.querySelector('main');
    m.classList.remove('page-anim'); void m.offsetWidth; m.classList.add('page-anim');
  }
  observeReveals();
}

/* ---------- Animacija pri skrolovanju ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
const REVEAL = '.section-head, .svc-card, .svc-row, .principles>div, .gallery .photo, .about-photo, .doctor-photo, .grid-2>.stack, .card, .faq details, .contact-info>div, .map, .cta-row, .footer-grid>*';
function observeReveals() {
  if (!io) return;
  document.querySelectorAll(REVEAL).forEach(el => {
    if (el.closest('.hero') || el.closest('[hidden]')) return;
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      const sib = [...el.parentElement.children].filter(c => c.matches(REVEAL));
      el.style.setProperty('--d', Math.min(sib.indexOf(el), 5) * 0.07 + 's');
    }
    el.classList.remove('in');
    io.observe(el);
  });
}
window.addEventListener('hashchange', () => route(true));
route(false);

/* ---------- Pomoćne ---------- */
const DOW = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];
const DOWL = ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'];
const MON = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function send(data) {
  if (!FORM_ENDPOINT) return true;
  try {
    const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    return r.ok;
  } catch (e) { return false; }
}
function showError(el, msg) { el.textContent = msg; el.hidden = !msg; }

/* ---------- Zakazivanje ---------- */
const bk = { day: 0, slot: null };
const days = [];
{ const d = new Date(); d.setHours(0, 0, 0, 0); while (days.length < 12) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) days.push(new Date(d)); } }
const elDays = document.getElementById('bkDays'), elSlots = document.getElementById('bkSlots');
const elService = document.getElementById('bkService'), elErr = document.getElementById('bkError'), elSubmit = document.getElementById('bkSubmit');

function renderDays() {
  elDays.innerHTML = days.map((d, i) =>
    `<button type="button" class="day" data-i="${i}" aria-pressed="${i === bk.day}"><small>${DOW[d.getDay()]}</small><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small></button>`).join('');
}
function renderSlots() {
  const d = days[bk.day];
  const hrs = d.getDay() === 6 ? [9, 10, 11, 12, 13] : [13, 14, 15, 16, 17, 18, 19];
  elSlots.innerHTML = hrs.map(h => {
    const t = String(h).padStart(2, '0') + ':00';
    return `<button type="button" class="slot" data-t="${t}" aria-pressed="${bk.slot === t}">${t}</button>`;
  }).join('');
  const d2 = days[bk.day];
  elSubmit.textContent = bk.slot ? `Pošalji zahtev · ${DOW[d2.getDay()]} ${d2.getDate()}. ${MON[d2.getMonth()]} u ${bk.slot}` : 'Pošalji zahtev';
}
elDays.addEventListener('click', e => { const b = e.target.closest('.day'); if (!b) return; bk.day = +b.dataset.i; bk.slot = null; showError(elErr, ''); renderDays(); renderSlots(); });
elSlots.addEventListener('click', e => { const b = e.target.closest('.slot'); if (!b || b.disabled) return; bk.slot = b.dataset.t; showError(elErr, ''); renderSlots(); });
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => { elService.value = a.dataset.service; }));
renderDays(); renderSlots();

document.getElementById('bookingForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  if (!bk.slot) return showError(elErr, 'Izaberite vreme termina.');
  if (name.length < 2) return showError(elErr, 'Unesite ime i prezime.');
  if (phone.replace(/\D/g, '').length < 6) return showError(elErr, 'Unesite ispravan broj telefona.');
  const d = days[bk.day];
  const service = elService.options[elService.selectedIndex].text;
  const when = `${DOWL[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]} u ${bk.slot}`;
  elSubmit.disabled = true;
  const ok = await send({ _subject: 'Zahtev za termin — ' + name, tip: 'Zakazivanje', usluga: service, termin: when, ime: name, telefon: phone });
  elSubmit.disabled = false;
  if (!ok) return showError(elErr, 'Slanje nije uspelo. Pozovite nas na +381 64 906 3633.');
  document.getElementById('bkThanks').textContent = `Hvala, ${name.split(' ')[0]}!`;
  document.getElementById('bkSummary').innerHTML = `Primili smo zahtev za <b>${esc(service.toLowerCase())}</b>, ${when}. Pozvaćemo vas na <b>${esc(phone)}</b> da potvrdimo termin.`;
  e.target.hidden = true; document.getElementById('bookingDone').hidden = false;
});
document.getElementById('bkReset').addEventListener('click', () => {
  bk.slot = null; renderSlots();
  document.getElementById('bookingForm').hidden = false; document.getElementById('bookingDone').hidden = true;
});

/* ---------- Kontakt forma ---------- */
const cErr = document.getElementById('cError');
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const contact = document.getElementById('cContact').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  if (name.length < 2) return showError(cErr, 'Unesite ime i prezime.');
  if (!/@|\d{6,}/.test(contact.replace(/\s/g, ''))) return showError(cErr, 'Unesite e-mail ili broj telefona.');
  if (msg.length < 5) return showError(cErr, 'Napišite poruku.');
  showError(cErr, '');
  const ok = await send({ _subject: 'Poruka sa sajta — ' + name, tip: 'Kontakt', ime: name, kontakt: contact, poruka: msg });
  if (!ok) return showError(cErr, 'Slanje nije uspelo. Pišite nam na dranicanikolic@gmail.com.');
  document.getElementById('cSummary').innerHTML = `Hvala, ${esc(name.split(' ')[0])}! Odgovorićemo vam na <b>${esc(contact)}</b> u toku radnog vremena.`;
  e.target.hidden = true; document.getElementById('contactDone').hidden = false;
});
document.getElementById('cReset').addEventListener('click', () => {
  document.getElementById('cMsg').value = '';
  document.getElementById('contactForm').hidden = false; document.getElementById('contactDone').hidden = true;
});

/* ---------- Radno vreme: istakni današnji dan ---------- */
const today = new Date().getDay();
document.querySelectorAll('#hours [data-days]').forEach(r => r.classList.toggle('today', r.dataset.days.split(',').includes(String(today))));
document.getElementById('year').textContent = new Date().getFullYear();
