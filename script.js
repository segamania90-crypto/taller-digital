// Toggle groups (Referencias / Materiales — Sí/No)
function setupToggleGroup(groupId, hiddenInputId, onChange){
  const group = document.getElementById(groupId);
  const hidden = document.getElementById(hiddenInputId);
  if (!group || !hidden) return;
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hidden.value = btn.dataset.value;
      if (onChange) onChange(btn.dataset.value);
    });
  });
}
const fileNameLabels = {
  es: { none: 'Ningún archivo seleccionado' },
  en: { none: 'No file selected' }
};

setupToggleGroup('referenciasToggle', 'referencias', (value) => {
  const extra = document.getElementById('referenciasExtra');
  const detalle = document.getElementById('referenciasDetalle');
  const imagen = document.getElementById('referenciaImagen');
  const nombre = document.getElementById('referenciaImagenNombre');
  if (value === 'si') {
    extra.classList.add('show');
  } else {
    extra.classList.remove('show');
    detalle.value = '';
    imagen.value = '';
    nombre.textContent = fileNameLabels[currentLang].none;
  }
});

document.getElementById('referenciaImagen').addEventListener('change', function(){
  const nombre = document.getElementById('referenciaImagenNombre');
  nombre.textContent = this.files && this.files[0] ? this.files[0].name : fileNameLabels[currentLang].none;
});
setupToggleGroup('materialesToggle', 'materiales');

// Mobile nav toggle
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Chat animations
function replayWaChat(){
  document.querySelectorAll('#waBody .wa-msg, .pf-chat-msg').forEach(msg => {
    msg.style.animation = 'none';
    void msg.offsetWidth;
    msg.style.animation = '';
  });
}
setInterval(replayWaChat, 15000);

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ================= ENVÍO DEL FORMULARIO → Google Apps Script =================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwliFs89ukLqQTYqzOzd9C09tAC9ZWCl8MbAXfO0YIzl8Zmr3qIPSw7TT5nGgmXJkX3/exec';

const formMessages = {
  es: {
    success: 'Gracias, hemos recibido tu solicitud. Te contactaremos por WhatsApp o email en menos de 24h.',
    error: 'No se pudo enviar el formulario. Inténtalo de nuevo o escríbenos directamente por WhatsApp.',
    sending: 'Enviando...'
  },
  en: {
    success: 'Thanks — we got your request. We will reach out on WhatsApp or email within 24h.',
    error: 'The form could not be sent. Please try again or message us directly on WhatsApp.',
    sending: 'Sending...'
  }
};

const briefForm = document.getElementById('briefForm');
const MAX_IMG_MB = 4;

const imgTooBigMsg = {
  es: 'La imagen pesa demasiado (máx. ' + MAX_IMG_MB + ' MB). Elige una más ligera o pega solo el enlace.',
  en: 'The image is too large (max ' + MAX_IMG_MB + ' MB). Choose a smaller one or paste the link instead.'
};

briefForm.addEventListener('submit', function(e){
  e.preventDefault();

  if (SCRIPT_URL.indexOf('PEGA_AQUI') !== -1) {
    alert('Falta configurar SCRIPT_URL en script.js con la URL de Apps Script.');
    return;
  }

  const fileInput = document.getElementById('referenciaImagen');
  const file = fileInput.files && fileInput.files[0];

  if (file && file.size > MAX_IMG_MB * 1024 * 1024) {
    alert(imgTooBigMsg[currentLang]);
    return;
  }

  const submitBtn = briefForm.querySelector('.submit-btn');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = formMessages[currentLang].sending;

  function enviar(base64, mimeType, filename) {
    const formData = new FormData(briefForm);
    formData.delete('referenciaImagen'); 
    if (base64) {
      formData.append('referenciaImagenBase64', base64);
      formData.append('referenciaImagenTipo', mimeType || 'image/jpeg');
      formData.append('referenciaImagenNombre', filename || 'referencia.jpg');
    }

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      alert(formMessages[currentLang].success);
      briefForm.reset();
      document.getElementById('referenciasExtra').classList.remove('show');
      document.getElementById('referenciaImagenNombre').textContent = fileNameLabels[currentLang].none;
      briefForm.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    })
    .catch(() => {
      alert(formMessages[currentLang].error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function(){
      const base64 = reader.result.split(',')[1];
      enviar(base64, file.type, file.name);
    };
    reader.onerror = function(){
      enviar(null);
    };
    reader.readAsDataURL(file);
  } else {
    enviar(null);
  }
});

// ================= TEMA (día / noche) =================
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
  localStorage.setItem('td-theme', theme);
}
applyTheme(localStorage.getItem('td-theme') || 'dark');
themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

// ================= IDIOMA (ES / EN) =================
const translations = {
  en: {
    'nav.servicios':'Services',
    'nav.portafolio':'Portfolio',
    'nav.proceso':'How it works',
    'nav.cta':'Get a quote',
    'nav.burger':'Open menu',
    'theme.toggle':'Switch theme',
    'hero.title':'Websites, bots and <em>automation</em> for businesses.',
    'hero.desc':'I help small businesses get online, answer customers on WhatsApp automatically, and stop doing repetitive tasks by hand — all explained without jargon.',
    'hero.cta1':'Get a quote →',
    'hero.cta2':'View portfolio',
    'wa.status':'online',
    'wa.msg1':'Hello 👋 How can we automate your business today?',
    'wa.msg2':'I need a bot to book appointments via WhatsApp.',
    'wa.msg3':'Sure! We connect it directly to Google Calendar and done 🤖',
    'wa.msg4':'Awesome! How do we start?',
    'wa.input':'Type a message...',
    'servicios.eyebrow':'What I can do for your business',
    'servicios.h2':'Four ways to save you time',
    'servicios.note':"Not tied to a single industry: every project adapts to the business, not the other way around.",
    'servicios.1.h3':'Custom websites',
    'servicios.1.p':'Landing pages, catalogs and booking sites — ready to share on WhatsApp.',
    'servicios.2.h3':'WhatsApp and Telegram bots',
    'servicios.2.p':'Answer FAQs, take orders and book appointments without anyone watching the phone.',
    'servicios.3.h3':'Google Sheets integration',
    'servicios.3.p':'Forms and orders that save themselves to a spreadsheet — no copy-pasting.',
    'servicios.4.h3':'Process automation',
    'servicios.4.p':'Repetitive tasks — reminders, reports, follow-ups — solved once and for good.',
    'portafolio.eyebrow':'Work delivered',
    'portafolio.h2':'Portfolio',
    'portafolio.note':"Personal and practice projects — the point is to show how I work, not just tell you.",
    'portafolio.tag.web':'Website',
    'portafolio.tag.app':'Web app',
    'portafolio.tag.bot':'Automation',
    'portafolio.1.h3':'Ámbar — cocktail bar',
    'portafolio.1.p':'Landing page for a cocktail bar in Madrid: menu, gallery, reviews and bookings via form or WhatsApp.',
    'portafolio.2.h3':'Palomita — movies & TV',
    'portafolio.2.p':'Real-time catalog powered by TMDB, user accounts, cloud-saved favorites and a full ES/EN/RU interface.',
    'portafolio.3.h3':'Jugando — game catalog',
    'portafolio.3.p':'Browse thousands of games via the RAWG API, with user accounts, cloud-synced favorites and 3 languages.',
    'portafolio.4.h3':'Download bot — Instagram & YouTube',
    'portafolio.4.p':'Telegram bot that downloads videos from a link and sends them straight to the chat. Private use — illustrative flow, not a real recording.',
    'portafolio.bot.chat1':'🎬 Here\'s your video! ✅',
    'portafolio.bot.link':'Ask me about it →',
    'portafolio.link':'View demo →',
    'proceso.eyebrow':'From idea to delivered project',
    'proceso.1.h3':'Tell me what you need',
    'proceso.1.p':'Fill in a short form or message me on WhatsApp.',
    'proceso.2.h3':'We sort out the details',
    'proceso.2.p':'I contact you by call or WhatsApp to fully understand the project and clear up any questions.',
    'proceso.3.h3':'You get a proposal',
    'proceso.3.p':'I send you the scope of work and the price, clear and in writing. You confirm you\'re happy with it.',
    'proceso.4.h3':'Confirm with a deposit',
    'proceso.4.p':'30–50% to get started, via Bizum or bank transfer.',
    'proceso.5.h3':'Delivery and review',
    'proceso.5.p':'I deliver the working project and we adjust anything needed.',
    'brief.eyebrow':"Let's start",
    'brief.h2':'Tell me what your business needs',
    'brief.p':"Fill in these details and I'll reach out on WhatsApp with a proposal or to answer questions.",
    'brief.whatsapp':'Usual reply time: under 24h on WhatsApp',
    'form.servicio':'Service',
    'form.select.placeholder':'Choose an option',
    'form.select.placeholder.short':'Choose…',
    'form.select.web':'Website',
    'form.select.bot':'WhatsApp / Telegram bot',
    'form.select.sheets':'Google Sheets integration',
    'form.select.auto':'Process automation',
    'form.select.otro':"Other / not sure",
    'form.tarea':'Task or problem to solve',
    'form.tarea.placeholder':'E.g. I need customers to book a table without calling',
    'form.referencias':'References',
    'form.referencias.cual':'Link, Instagram or Telegram handle',
    'form.referencias.subir':'Attach screenshot',
    'form.referencias.sinarchivo':'No file selected',
    'form.yes':'Yes',
    'form.no':'No',
    'form.plazos.urgente':'Urgent',
    'form.plazos.semana':'Within a week',
    'form.plazos.mes':'Within a month',
    'form.plazos.sinprisa':'No rush',
    'form.materiales':'Materials',
    'form.presupuesto':'Budget',
    'form.referencias.placeholder':'Sites or bots you like',
    'form.plazos':'Timeline',
    'form.materiales.placeholder':'Text, photos, logo...',
    'form.presupuesto.placeholder':'€ (open)',
    'form.contacto':'WhatsApp or email to contact you',
    'form.contacto.placeholder':"So I can send you the proposal",
    'form.submit':'Send and get a proposal',
    'form.note':'🔒 Form securely connected to our internal system.',
    'form.privacy': "Drop us a line and we'll get back to you with no pressure. Your data is safe.",
    'footer.zone': 'Service area: Guadalajara, Madrid & remote (Spain)',
    'footer.copy': '© 2026 Taller Digital — Every project, made to measure.',
    'footer.privacy': 'Your data is protected and never shared with third parties.',
    'whatsapp.aria':'Message on WhatsApp'
  },
  es: {
    'form.privacy': 'Escríbenos y te responderemos sin compromiso. Tus datos están seguros.',
    'footer.privacy': 'Tus datos están protegidos y nunca se comparten con terceros.'
  }
};

const langButtons = { 
  es: document.getElementById('langEs'), 
  en: document.getElementById('langEn') 
};
let currentLang = localStorage.getItem('td-lang') || 'es';

function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('td-lang', lang);
  langButtons.es.classList.toggle('active', lang === 'es');
  langButtons.en.classList.toggle('active', lang === 'en');

  if (lang === 'es') {
    document.querySelectorAll('[data-i18n-es]').forEach(el => { el.textContent = el.getAttribute('data-i18n-es'); });
    document.querySelectorAll('[data-i18n-html-es]').forEach(el => { el.innerHTML = el.getAttribute('data-i18n-html-es'); });
    document.querySelectorAll('[data-i18n-placeholder-es]').forEach(el => { el.placeholder = el.getAttribute('data-i18n-placeholder-es'); });
    document.querySelectorAll('[data-i18n-aria-es]').forEach(el => { el.setAttribute('aria-label', el.getAttribute('data-i18n-aria-es')); });
    
    const privacyEl = document.querySelector('[data-i18n="form.privacy"]');
    if (privacyEl && translations.es['form.privacy']) {
      privacyEl.textContent = translations.es['form.privacy'];
    }
    return;
  }

  const dict = translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key]) el.setAttribute('aria-label', dict[key]);
  });
}

document.querySelectorAll('[data-i18n]').forEach(el => el.setAttribute('data-i18n-es', el.textContent));
document.querySelectorAll('[data-i18n-html]').forEach(el => el.setAttribute('data-i18n-html-es', el.innerHTML));
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.setAttribute('data-i18n-placeholder-es', el.placeholder));
document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('data-i18n-aria-es', el.getAttribute('aria-label')));

langButtons.es.addEventListener('click', () => applyLang('es'));
langButtons.en.addEventListener('click', () => applyLang('en'));
applyLang(currentLang);

// ================= 3D CYBER-BRAIN CANVAS ENGINE =================
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let brainNodes = [];
  const nodeCount = 340;
  const brainRadius = 380;
  let rotationX = 0;
  let rotationY = 0;
  let targetRotX = 0.001;
  let targetRotY = 0.002;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Генерация геометрии Мозга (Два полушария с корой и стволом)
  for (let i = 0; i < nodeCount; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const u = Math.random() * Math.PI;
    const v = Math.random() * Math.PI * 2;
    
    // Эллипсоидное искажение для полушарий мозжечка
    let x = (brainRadius * 0.7) * Math.sin(u) * Math.cos(v) + (side * 65);
    let y = (brainRadius * 0.55) * Math.cos(u);
    let z = (brainRadius * 0.75) * Math.sin(u) * Math.sin(v);

    // Добавляем складки коры (волнистость)
    const wave = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 25;
    x += wave;
    y += wave;

    brainNodes.push({
      x: x,
      y: y,
      z: z,
      pulse: Math.random() * Math.PI * 2,
      synapseSpeed: 0.02 + Math.random() * 0.04
    });
  }

  window.addEventListener('mousemove', (e) => {
    targetRotY = (e.clientX / width - 0.5) * 0.015;
    targetRotX = (e.clientY / height - 0.5) * 0.015;
  });

  window.addEventListener('scroll', () => {
    rotationX += 0.008;
  });

  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    rotationY += targetRotY;
    rotationX += targetRotX;

    const projected = [];
    const light = isLightTheme();

    const cyanColor = light ? '0, 163, 204' : '0, 240, 255'; 
    const pinkColor = light ? '255, 0, 85' : '255, 0, 85';

    for (let i = 0; i < brainNodes.length; i++) {
      const p = brainNodes[i];
      p.pulse += p.synapseSpeed;

      // 3D Вращение
      let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
      let z1 = p.z * Math.cos(rotationY) + p.x * Math.sin(rotationY);

      let y1 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      let z2 = z1 * Math.cos(rotationX) + p.y * Math.sin(rotationX);

      const scale = 500 / (500 + z2);
      const px = x1 * scale + width / 2;
      const py = y1 * scale + height / 2;
      const alpha = (z2 + brainRadius) / (2 * brainRadius);

      projected.push({ 
        x: px, 
        y: py, 
        z: z2, 
        alpha: Math.max(0.12, alpha), 
        scale, 
        pulse: p.pulse 
      });
    }

    // Рендер Нейронных связей (Аксонов)
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          const baseAlpha = light ? 0.35 : 0.28;
          const lineAlpha = (1 - dist / 85) * baseAlpha * projected[i].alpha;
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.strokeStyle = `rgba(${cyanColor}, ${lineAlpha})`;
          ctx.lineWidth = light ? 1 : 0.85;
          ctx.stroke();
        }
      }
    }

    // Рендер Синапсов (Узлы мозга с импульсным неоновым свечением)
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const pSize = (2 + Math.sin(p.pulse) * 1.2) * p.scale;
      const glow = Math.sin(p.pulse) > 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, pSize), 0, Math.PI * 2);
      ctx.fillStyle = glow ? `rgba(${pinkColor}, ${p.alpha * 0.95})` : `rgba(${cyanColor}, ${p.alpha * 0.8})`;
      ctx.fill();

      // Отдельные синаптические вспышки
      if (glow && p.alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pinkColor}, ${p.alpha * 0.25})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  render();
});