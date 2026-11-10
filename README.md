# Clinic Management Tech · landing

Static site, no build step. Works on GitHub Pages as-is.

```
index.html          page markup + CONFIG (top of <head>)
css/styles.css      all styles
js/app.js           nav, scroll-driven hero video, solutions, voice-note tabs, patient-app tabs, demo form
js/catalog.js       product catalog, treatment plans and product photos
js/i18n.js          language detection + Spanish texts
js/shop.js          clinic shop simulation
js/savia.js         Savia patient assistant (local rules, or your Apps Script endpoint)
assets/             logo.png, poster.jpg, app-scan.mp4 (hero recording)
```

## Configure
Edit `window.CMT_CONFIG` in `index.html`: `WHATSAPP`, `ENDPOINT` (Apps Script /exec URL; receives `lead`, `chat`, `appointment`, `alert`), `GEO_URL`, `INSTAGRAM`, `CURRENCY`.

## Edit the shop catalog
`js/shop.js` → `CATALOG` (brand, product, price, days of supply) and `PLANS` (morning/night steps per treatment). Prices and products are examples.

Note: the hero video is fetched from `assets/`, so open the site through a web server (GitHub Pages, or `python3 -m http.server`) rather than double-clicking the file.

## Languages (EN / ES)
The page detects the visitor's language: `?lang=es|en` in the URL → the visitor's last choice (ES/EN switch in the nav) → browser language (any `es-*` gets Spanish, everything else English).
`index.html` is written in English; Spanish texts live in `js/i18n.js` (dictionary keyed by the English text). Texts built by JavaScript (hero steps, solutions, shop, Savia) carry both languages inline with `T('English', 'Español')`.
If you change an English text in `index.html`, update its key in `js/i18n.js` too.

## Product photos
Catalog and routine thumbnails come from `assets/products/`. Add the official photo of each product with these names (square, white background, ~600×600):

| id | product | file |
|---|---|---|
| clean | Sensilis Purify Essential Cleanser | sensilis-purify-essential-cleanser.jpg |
| foam | Sensilis Gentle Cleansing | sensilis-gentle-cleansing.jpg |
| spf | Colorescience Sunforgettable Total Protection Face Shield SPF 50 | colorescience-face-shield-spf50.jpg |
| vitc | SkinCeuticals C E Ferulic | skinceuticals-ce-ferulic.jpg |
| disc | SkinCeuticals Discoloration Defense | skinceuticals-discoloration-defense.jpg |
| b5 | La Roche-Posay Cicaplast Baume B5 | laroche-posay-cicaplast-baume-b5.jpg |
| tol | La Roche-Posay Toleriane Sensitive | laroche-posay-toleriane-sensitive.jpg |
| oral | Heliocare Advanced (capsules) | heliocare-advanced-capsules.jpg |
| gelspf | Heliocare 360° Water Gel SPF 50+ | heliocare-360-water-gel.jpg |
| retinal | ISDIN Isdinceutics Retinal Intense | isdin-retinal-intense.jpg |

You can also put a full `https://` URL in the `img` field of `js/catalog.js`. Until a photo exists, a brand monogram is shown. Use photos you have rights to (brand/distributor media kit).
