/* Clinic Management Tech · product catalog (example) + product photo helper
   PHOTOS: put each product's official photo in assets/products/ using the file
   name in `img` (square, white background, ~600×600 jpg/png/webp works best).
   You can also set `img` to a full https:// URL from your supplier's CDN.
   Until a photo exists, a brand monogram is shown instead. */
(() => {
  'use strict';
  const L = window.CMT_LANG === 'es' ? 'es' : 'en';
  const T = (en, es) => (L === 'es' ? es : en);

  // price: example sale price (CMT_CONFIG.CURRENCY). days: approximate supply, used for refill reminders.
  const CATALOG = {
    clean:   { brand: 'Sensilis',       ab: 'SE',  name: 'Purify Essential Cleanser',            type: T('Cleansing gel', 'Gel limpiador'),                    price: 32,  days: 60, img: 'sensilis-purify-essential-cleanser.jpg' },
    foam:    { brand: 'Sensilis',       ab: 'SE',  name: 'Gentle Cleansing',                     type: T('Cleansing foam, sensitive skin', 'Espuma limpiadora, piel sensible'), price: 29, days: 60, img: 'sensilis-gentle-cleansing.jpg' },
    spf:     { brand: 'Colorescience',  ab: 'CS',  name: 'Sunforgettable Total Protection Face Shield SPF 50', type: T('Tinted mineral sunscreen', 'Protector mineral con color'), price: 69, days: 45, img: 'colorescience-face-shield-spf50.jpg' },
    vitc:    { brand: 'SkinCeuticals',  ab: 'SC',  name: 'C E Ferulic',                          type: T('Vitamin C antioxidant serum', 'Sérum antioxidante vitamina C'), price: 182, days: 60, img: 'skinceuticals-ce-ferulic.jpg' },
    disc:    { brand: 'SkinCeuticals',  ab: 'SC',  name: 'Discoloration Defense',                type: T('Dark spot serum', 'Sérum para manchas'),             price: 108, days: 60, img: 'skinceuticals-discoloration-defense.jpg' },
    b5:      { brand: 'La Roche-Posay', ab: 'LRP', name: 'Cicaplast Baume B5',                   type: T('Repair balm', 'Bálsamo reparador'),                  price: 18,  days: 30, img: 'laroche-posay-cicaplast-baume-b5.jpg' },
    tol:     { brand: 'La Roche-Posay', ab: 'LRP', name: 'Toleriane Sensitive',                  type: T('Soothing moisturizer', 'Crema calmante hidratante'),  price: 24,  days: 45, img: 'laroche-posay-toleriane-sensitive.jpg' },
    oral:    { brand: 'Heliocare',      ab: 'HC',  name: 'Advanced',                             type: T('Oral photoprotection capsules', 'Cápsulas de fotoprotección oral'), price: 38, days: 30, img: 'heliocare-advanced-capsules.jpg' },
    gelspf:  { brand: 'Heliocare',      ab: 'HC',  name: '360° Water Gel SPF 50+',               type: T('Light gel sunscreen', 'Protector solar en gel ligero'), price: 34, days: 45, img: 'heliocare-360-water-gel.jpg' },
    retinal: { brand: 'ISDIN',          ab: 'IS',  name: 'Isdinceutics Retinal Intense',         type: T('Night retinal serum', 'Sérum de noche con retinal'), price: 85,  days: 60, img: 'isdin-retinal-intense.jpg' }
  };
  const PLANS = [
    { id: 'laser',   name: T('Post-laser recovery', 'Recuperación post-láser'),     am: ['clean', 'b5', 'spf'],           pm: ['clean', 'b5'] },
    { id: 'pigment', name: T('Pigmentation', 'Manchas y melasma'),                  am: ['clean', 'vitc', 'spf', 'oral'], pm: ['clean', 'disc'] },
    { id: 'aging',   name: T('Anti-aging', 'Antiedad'),                             am: ['clean', 'vitc', 'gelspf'],      pm: ['clean', 'retinal', 'tol'] },
    { id: 'red',     name: T('Redness & sensitivity', 'Rojeces y sensibilidad'),    am: ['foam', 'tol', 'spf'],           pm: ['foam', 'b5'] }
  ];

  const src = (p) => /^https?:/.test(p.img) ? p.img : 'assets/products/' + p.img;
  // Returns the markup for a product photo; falls back to a monogram if the photo is missing.
  const photo = (id) => {
    const p = CATALOG[id]; if (!p) return '';
    return `<img src="${src(p)}" alt="${p.brand} ${p.name}" loading="lazy" onerror="this.outerHTML='<span class=&quot;ab&quot;>${p.ab}</span>'">`;
  };
  const fill = (root = document) => root.querySelectorAll('.pimg[data-p]').forEach(el => { if (!el.dataset.done) { el.innerHTML = photo(el.dataset.p); el.dataset.done = 1; } });
  document.addEventListener('DOMContentLoaded', () => fill());

  window.CMT_CATALOG = { CATALOG, PLANS, photo, fill, T, L };
})();
