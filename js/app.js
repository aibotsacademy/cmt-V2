/* Clinic Management Tech · page behaviour (nav, hero video, tabs, demo form) */
(() => {
  'use strict';
  const CFG = window.CMT_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const post = (body) => CFG.ENDPOINT
    ? fetch(CFG.ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...body, page: location.href }) }).catch(e => console.warn('Send failed', e))
    : (console.info('CMT_CONFIG.ENDPOINT is empty; not sent:', body), Promise.resolve());
  const waURL = (txt) => `https://wa.me/${CFG.WHATSAPP}?text=${encodeURIComponent(txt)}`;
  const L = window.CMT_LANG === 'es' ? 'es' : 'en';
  const T = (en, es) => (L === 'es' ? es : en);
  window.CMT = { $, $$, post, waURL, reduce, CFG, L, T };

  $('#yr').textContent = new Date().getFullYear();
  if (CFG.GEO_URL) $('#geo-link').href = CFG.GEO_URL;
  if (CFG.INSTAGRAM) $('#ig-link').href = CFG.INSTAGRAM;

  /* ---------- nav + progress bar ---------- */
  const nav = $('#nav'), links = $('#nav-links'), burger = $('#burger'), bar = $('#pagebar');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', links.classList.toggle('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- hero: scroll scrubs the app recording ----------
     Each chapter plays its slice t:[start,end] (seconds). Pins: x/y in % of the
     screen, visible while the chapter's local progress is between f and u. */
  const CHAPTERS = [
    { label: T('Overview', 'Inicio'), t: [0, 0.3], pins: [] },
    { label: T('Two photos', 'Dos fotos'), t: [0.3, 6.9], pins: [
      { x: 29, y: 30, f: 0, l: T('Guide oval', 'Óvalo guía'), d: T('Sets the face size in the frame, so the distance matches every visit.', 'Fija el tamaño del rostro en el cuadro, para que la distancia sea igual en cada visita.') },
      { x: 86, y: 18, f: .15, l: T('Pose example', 'Pose de ejemplo'), d: T('Shows how to hold the head: straight first, then to the side.', 'Muestra cómo poner la cabeza: primero de frente, luego de lado.') },
      { x: 50, y: 90, f: .3, l: T('Live checks', 'Controles en vivo'), d: T('Light, distance and pose turn green, then the photo is taken.', 'Luz, distancia y pose se ponen en verde y la foto se toma sola.') }] },
    { label: T('468 points', '468 puntos'), t: [7, 9.8], pins: [
      { x: 50, y: 40, f: 0, u: .4, l: T('Face located', 'Rostro ubicado'), d: T('The model first finds the face and its outline.', 'Primero el modelo encuentra el rostro y su contorno.') },
      { x: 33, y: 43, f: .35, l: T('Landmarks', 'Puntos'), d: T('Each dot is one of 468 points, densest around eyes, nose and lips.', 'Cada punto es uno de 468, más densos alrededor de ojos, nariz y labios.') }] },
    { label: T('Proportion', 'Proporción'), t: [10, 12.9], pins: [
      { x: 24, y: 29, f: 0, u: .5, l: T('Facial thirds', 'Tercios faciales'), d: T('Hairline to brows, brows to nose, nose to chin.', 'Del nacimiento del pelo a las cejas, de las cejas a la nariz, de la nariz al mentón.') },
      { x: 50, y: 30, f: .5, l: T('Midline', 'Línea media'), d: T('Each point is compared with its pair on the other side.', 'Cada punto se compara con su par del otro lado.') },
      { x: 14, y: 89, f: .25, l: T('Scores', 'Puntajes'), d: T('Proportion index and symmetry, saved to the file.', 'Índice de proporción y simetría, guardados en el expediente.') }] },
    { label: T('Skin', 'Piel'), t: [13, 17.9], pins: [
      { x: 50, y: 22, f: 0, u: .25, l: T('Forehead', 'Frente'), d: T('Luminosity: how evenly the skin reflects light.', 'Luminosidad: qué tan pareja refleja la luz la piel.') },
      { x: 74, y: 47, f: .25, u: .5, l: T('Cheek', 'Mejilla'), d: T('Redness: higher means more visible redness.', 'Rojez: más alto significa más rojez visible.') },
      { x: 50, y: 66, f: .5, u: .75, l: T('Chin', 'Mentón'), d: T('Uniformity of tone and texture.', 'Uniformidad de tono y textura.') },
      { x: 66, y: 37, f: .75, l: T('Eye contour', 'Contorno de ojos'), d: T('Fine lines around the eyes.', 'Líneas finas alrededor de los ojos.') }] },
    { label: 'Glow', t: [20, 22.9], pins: [
      { x: 33, y: 47, f: 0, l: T('Glow ring', 'Anillo Glow'), d: T('The overall score, from 0 to 100.', 'El puntaje general, de 0 a 100.') },
      { x: 15, y: 79, f: .4, l: T('Day 0', 'Día 0'), d: T('Saved as the starting point for every comparison.', 'Se guarda como punto de partida para cada comparación.') }] },
    { label: T('Report', 'Reporte'), t: [23, 35.5], pins: [
      { x: 30, y: 20, f: 0, u: .35, l: T('Plain-language summary', 'Resumen en palabras simples'), d: T('Explains the analysis in everyday words. Not a diagnosis.', 'Explica el análisis en lenguaje cotidiano. No es un diagnóstico.') },
      { x: 50, y: 26, f: .35, u: .7, l: T('Proportion grid', 'Cuadrícula de proporción'), d: T('Thirds and fifths on her own photo.', 'Tercios y quintos sobre su propia foto.') },
      { x: 50, y: 58, f: .7, l: T('Skin by zone', 'Piel por zona'), d: T('Each zone with what the doctor may recommend, including the home routine.', 'Cada zona con lo que el médico puede recomendar, incluida la rutina en casa.') }] }
  ];
  const track = $('#scrolly'), video = $('#scrub'), rail = $('#rail'), railLabel = $('#rail-label');
  const vphone = $('#vphone'), pinsBox = $('#pins'), chaps = $$('.chap'), ros = $$('.ro');
  track.style.setProperty('--chapters', CHAPTERS.length);

  const pinEls = CHAPTERS.map((c, ci) => {
    if (!c.pins.length) return [];
    const ol = document.createElement('ol'); ol.className = 'seen';
    const h = document.createElement('p'); h.className = 'seen-h'; h.textContent = T('What you are seeing', 'Lo que estás viendo');
    const els = c.pins.map((p, pi) => {
      const li = document.createElement('li');
      li.innerHTML = `<i>${pi + 1}</i><div><b>${p.l}</b><span>${p.d}</span></div>`;
      const pin = document.createElement('span'); pin.className = 'pin'; pin.textContent = pi + 1;
      pin.style.left = p.x + '%'; pin.style.top = p.y + '%';
      li.onmouseenter = () => pin.classList.add('hl'); li.onmouseleave = () => pin.classList.remove('hl');
      ol.appendChild(li); pinsBox.appendChild(pin);
      return { p, li, pin };
    });
    chaps[ci].append(h, ol);
    return els;
  });

  const ticks = CHAPTERS.map((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', c.label); b.innerHTML = '<i></i>';
    b.onclick = () => scrollTo({ top: track.offsetTop + (track.offsetHeight - innerHeight) * ((i + .04) / CHAPTERS.length), behavior: reduce ? 'auto' : 'smooth' });
    rail.appendChild(b); return b;
  });

  const countUp = (root) => {
    if (reduce) return;
    $$('.m b', root).forEach(b => {
      const node = [...b.childNodes].find(n => n.nodeType === 3 && /^\s*[\d.]+\s*$/.test(n.textContent));
      if (!node) return;
      const raw = b.dataset.v || (b.dataset.v = node.textContent), end = parseFloat(raw), dec = (raw.split('.')[1] || '').trim().length, t0 = performance.now();
      const step = (now) => { const k = Math.min((now - t0) / 700, 1); node.textContent = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };

  // Load the recording fully as a blob so seeking while scrolling is instant.
  const src = CFG.VIDEO || 'assets/app-scan.mp4';
  fetch(src).then(r => r.ok ? r.blob() : Promise.reject()).then(b => { video.src = URL.createObjectURL(b); })
    .catch(() => { video.src = src; });
  const prime = () => { const p = video.play(); if (p) p.then(() => video.pause()).catch(() => {}); removeEventListener('touchstart', prime); };
  addEventListener('touchstart', prime, { passive: true });

  let active = -1, target = 0, shown = 0;
  const update = () => {
    const span = track.offsetHeight - innerHeight;
    const p = Math.min(Math.max((scrollY - track.offsetTop) / span, 0), .99999);
    const f = p * CHAPTERS.length, i = Math.floor(f), local = f - i, [a, b] = CHAPTERS[i].t;
    target = a + (b - a) * local;
    if (i !== active) {
      active = i;
      chaps.forEach((c, j) => c.classList.toggle('on', j === i));
      ros.forEach((r, j) => { r.classList.toggle('on', j === i); if (j === i) countUp(r); });
      railLabel.textContent = CHAPTERS[i].label;
    }
    pinEls.forEach((arr, ci) => arr.forEach(({ p, li, pin }) => {
      const here = ci === i, until = p.u ?? 1.01, on = here && local >= (p.f || 0) && local < until;
      pin.classList.toggle('on', on); li.classList.toggle('on', on); li.classList.toggle('done', here && local >= until);
    }));
    ticks.forEach((t, j) => t.style.setProperty('--f', j < i ? '100%' : j === i ? (local * 100).toFixed(1) + '%' : '0%'));
    const k = i === 0 ? Math.min(local * 1.4, 1) : 1;
    if (!reduce) vphone.style.transform = `perspective(1400px) rotateY(${(-16 * (1 - k)).toFixed(2)}deg) rotateZ(${(3 * (1 - k)).toFixed(2)}deg) scale(${(.92 + .08 * k).toFixed(3)})`;
  };
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  const loop = () => {
    shown += (target - shown) * .2;
    if (Math.abs(target - shown) < .01) shown = target;
    if (video.readyState >= 1 && !video.seeking && Math.abs(video.currentTime - shown) > .03) { try { video.currentTime = shown; } catch (_) {} }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- solutions (four moments of the patient) ---------- */
  const SOLUTIONS = [
    { t: T('Acquisition & digital presence', 'Captación y presencia digital'), s: T('Be found and chosen before the first call.', 'Que te encuentren y te elijan antes de la primera llamada.'), items: [
      ['i-globe', T('AI visibility diagnosis', 'Diagnóstico de visibilidad en IA'), T('How ChatGPT, Gemini and Google describe your clinic today.', 'Cómo describen hoy ChatGPT, Gemini y Google a tu clínica.')],
      ['i-spark', T('Digital presence improvements', 'Mejoras de presencia digital'), T('Website, Google profile and the content AI assistants read.', 'Sitio web, perfil de Google y el contenido que leen los asistentes de IA.')],
      ['i-trend', T('Visibility tracking', 'Seguimiento de visibilidad'), T('Monthly check of where your clinic is mentioned and recommended.', 'Revisión mensual de dónde se menciona y recomienda tu clínica.')],
      ['i-chat', T('Instagram content engine', 'Motor de contenido para Instagram'), T('Ideas and copy based on your real treatments and results.', 'Ideas y textos basados en tus tratamientos y resultados reales.')]] },
    { t: T('Care & conversion', 'Atención y conversión'), s: T('Turn a message into a booked assessment.', 'Convierte un mensaje en una valoración agendada.'), items: [
      ['i-chat', T('Savia on web and WhatsApp', 'Savia en web y WhatsApp'), T('Answers frequent questions 24/7 in your clinic\'s voice.', 'Responde preguntas frecuentes 24/7 con la voz de tu clínica.')],
      ['i-cal', T('Online booking', 'Agenda en línea'), T('Real availability by professional, with confirmations and reminders.', 'Disponibilidad real por profesional, con confirmaciones y recordatorios.')],
      ['i-face', T('Assessment with facial analysis', 'Valoración con análisis facial'), T('A Day 0 report that helps explain the treatment plan.', 'Un reporte Día 0 que ayuda a explicar el plan de tratamiento.')],
      ['i-doc', T('Plans and quotes', 'Planes y cotizaciones'), T('A clear proposal the patient can accept from her phone.', 'Una propuesta clara que la paciente acepta desde su celular.')]] },
    { t: T('Clinic operations', 'Operación clínica'), s: T('Less admin, more time with patients.', 'Menos administración, más tiempo con pacientes.'), items: [
      ['i-cal', T('Schedule by professional and room', 'Agenda por profesional y sala'), T('One calendar for the whole team.', 'Un calendario para todo el equipo.')],
      ['i-folder', T('Digital record and consents', 'Expediente digital y consentimientos'), T('Photos, notes and signed consents in one file per patient.', 'Fotos, notas y consentimientos firmados en un expediente por paciente.')],
      ['i-mic', T('Voice note to invoice', 'De nota de voz a factura'), T('The doctor dictates; AI drafts the note, items and invoice for review.', 'El médico dicta; la IA prepara la nota, los ítems y la factura para revisión.')],
      ['i-box', T('Inventory and shop sales', 'Inventario y ventas de la tienda'), T('Stock, orders and sales per professional.', 'Inventario, pedidos y ventas por profesional.')]] },
    { t: T('Follow-up & loyalty', 'Seguimiento y fidelización'), s: T('Keep the patient with your clinic between visits.', 'Mantén a la paciente con tu clínica entre visitas.'), items: [
      ['i-trend', T('Progress against Day 0', 'Progreso contra el Día 0'), T('Every check-up compared with the first analysis.', 'Cada control comparado con el primer análisis.')],
      ['i-drop', T('Prescribed home routine', 'Rutina en casa recetada'), T('Morning and night steps in her app, with reminders.', 'Pasos de mañana y noche en su app, con recordatorios.')],
      ['i-bag', T('Clinic shop', 'Tienda de la clínica'), T('The routine\'s products, bought from your clinic in one tap.', 'Los productos de la rutina, comprados en tu clínica en un toque.')],
      ['i-repeat', T('Refills and check-ups', 'Reposiciones y controles'), T('Automatic invitations when a product runs out or a visit is due.', 'Invitaciones automáticas cuando un producto se acaba o toca un control.')]] }
  ];
  const solTabs = $('#sol-tabs'), solCard = $('#sol-card');
  const showSol = (i) => {
    $$('button', solTabs).forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', j === i); });
    solCard.innerHTML = SOLUTIONS[i].items.map(([ic, b, s]) => `<div class="sol-item"><span class="ic"><svg><use href="#${ic}"/></svg></span><div><b>${b}</b><span>${s}</span></div></div>`).join('');
  };
  SOLUTIONS.forEach((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
    b.innerHTML = `<b>${s.t}</b><span>${s.s}</span>`; b.onclick = () => showSol(i); solTabs.appendChild(b);
  });
  showSol(0);

  /* ---------- voice note → invoice tabs ---------- */
  $('#wave').innerHTML = Array.from({ length: 48 }, (_, i) => `<i style="height:${(18 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * .37))).toFixed(0)}%"></i>`).join('');
  const fBtns = $$('#flow-tabs button'), fPanes = $$('.flow-pane');
  let fIdx = 0, fTimer;
  const showFlow = (i) => { fIdx = i; fBtns.forEach((b, j) => b.classList.toggle('on', j === i)); fPanes.forEach((p, j) => p.classList.toggle('on', j === i)); };
  const fAuto = () => { clearInterval(fTimer); if (!reduce) fTimer = setInterval(() => showFlow((fIdx + 1) % fBtns.length), 3800); };
  fBtns.forEach((b, i) => b.onclick = () => { showFlow(i); clearInterval(fTimer); });
  new IntersectionObserver(es => es[0].isIntersecting ? fAuto() : clearInterval(fTimer)).observe($('#console'));

  /* ---------- patient app feature tabs ---------- */
  const feats = $$('.feat');
  let idx = 0, timer;
  const show = (i) => {
    idx = i;
    feats.forEach((f, j) => { f.classList.toggle('on', j === i); f.setAttribute('aria-selected', j === i); });
    $$('#patients .pane').forEach(p => p.classList.toggle('on', p.id === feats[i].dataset.pane));
  };
  const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show((idx + 1) % feats.length), 4200); };
  feats.forEach((f, i) => {
    f.onclick = () => { show(i); auto(); };
    f.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); auto(); } };
  });
  auto();

  /* ---------- demo request form ---------- */
  $('#demo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = (id) => $('#' + id).value.trim(), err = $('#df-err');
    const lead = { nombre: v('df-name'), clinica: v('df-clinic'), correo: v('df-email').toLowerCase(), whatsapp: v('df-wa'), profesionales: v('df-pros'), intereses: v('df-int'), estado: 'solicitada', idioma: L };
    if (!lead.nombre || !lead.clinica) { err.textContent = T('Please add your name and your clinic.', 'Agrega tu nombre y tu clínica.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.correo)) { err.textContent = T('Please check the email address.', 'Revisa el correo.'); $('#df-email').focus(); return; }
    if (lead.whatsapp.replace(/\D/g, '').length < 8) { err.textContent = T('Please add your WhatsApp number with the country code.', 'Agrega tu WhatsApp con el código de país.'); $('#df-wa').focus(); return; }
    err.textContent = '';
    await post({ action: 'lead', sessionId: 'cmt-demo-' + Date.now().toString(36), lead, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '' });
    $('#df-fields').hidden = true; $('#df-ok').hidden = false;
    const fn = lead.nombre.split(' ')[0];
    $('#df-ok-text').textContent = T(`Thanks, ${fn}. We'll confirm your demo on WhatsApp at ${lead.whatsapp} and send the invite to ${lead.correo}.`, `Gracias, ${fn}. Te confirmamos la demo por WhatsApp al ${lead.whatsapp} y enviamos la invitación a ${lead.correo}.`);
    if (CFG.WHATSAPP) $('#df-ok-acts').innerHTML = `<a class="btn btn-gold" target="_blank" rel="noopener" href="${waURL(T(`Hi, I'm ${lead.nombre} from ${lead.clinica}. I just requested a Clinic Management Tech demo.`, `Hola, soy ${lead.nombre} de ${lead.clinica}. Acabo de solicitar una demo de Clinic Management Tech.`))}">${T('Message us on WhatsApp', 'Escríbenos por WhatsApp')}</a>`;
  });
})();
