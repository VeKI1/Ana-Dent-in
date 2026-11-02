# Ana Dent-In — sajt stomatološke ordinacije

Statički sajt (HTML + CSS + JS, bez build koraka). Spreman za GitHub Pages.

## Objavljivanje na GitHub Pages
1. Napravite repozitorijum i ubacite sav sadržaj ovog foldera (`index.html` mora biti u korenu).
2. **Settings → Pages → Source: Deploy from a branch** → `main` / `(root)`.
3. Sajt je za minut-dva na `https://<korisnik>.github.io/<repo>/`.

## Fotografije
Ubacite slike u `assets/foto/` pod ovim imenima — prikazuju se automatski:
- `hero.jpg` — glavna fotografija (uspravna)
- `doktorka.jpg` — portret dr Anice Nikolić (uspravna)
- `usluga-1.jpg` … `usluga-6.jpg` — usluge redom (položene, 16:10)
- `zasto.jpg` — doktorka sa pacijentom (uspravna)
- `rad-1-pre.jpg`, `rad-1-posle.jpg` … `rad-3-pre.jpg`, `rad-3-posle.jpg` — pre/posle (4:3)

## Recenzije
U `index.html`, sekcija `RECENZIJE`: zamenite „Dodajte recenziju pacijenta“ tekstom recenzije,
„Ime pacijenta“ imenom, a „?“ prvim slovom imena. Uklonite klasu `review-empty`.

## Kontakt forma
Napravite besplatan formular na formspree.io i njegov URL upišite u `script.js` kao `FORM_ENDPOINT`.
