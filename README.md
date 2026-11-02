# Ana Dent-In — sajt stomatološke ordinacije

Statički sajt (HTML + CSS + JS, bez build koraka). Spreman za GitHub Pages.

## Objavljivanje na GitHub Pages
1. Napravite novi repozitorijum na GitHub-u i ubacite sav sadržaj ovog foldera (`index.html` mora biti u korenu).
2. **Settings → Pages → Source: Deploy from a branch**, izaberite `main` i folder `/ (root)`.
3. Posle minut-dva sajt je na `https://<korisnik>.github.io/<repo>/`.

## Stranice
Sve je u `index.html`; stranice se otvaraju preko adresa:
`#/` (početna) · `#/usluge` · `#/o-nama` · `#/zakazivanje` · `#/pitanja` · `#/kontakt`

## Fotografije
Ubacite slike u `assets/foto/` sa ovim imenima — automatski se prikazuju:
- `hero.jpg` — glavna fotografija (uspravna, 4:5)
- `ordinacija.jpg` — početna, „O ordinaciji“ (5:4)
- `doktorka.jpg` — portret, stranica O nama (4:5)
- `galerija-1.jpg`, `galerija-2.jpg`, `galerija-3.jpg` — galerija (4:5)

## Forme (zakazivanje i kontakt)
Da bi zahtevi stizali na e-mail: napravite besplatan formular na formspree.io,
pa u `script.js` upišite njegov URL u `FORM_ENDPOINT`.
