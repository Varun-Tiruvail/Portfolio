/* ============================================================
   script.js â€” Portfolio Interactivity
   Varun Tiruvail Portfolio
============================================================ */

'use strict';

// ============================================================
// 1. DARK / LIGHT MODE TOGGLE
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Restore saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

// ============================================================
// 2. NAVBAR â€” SCROLL SHRINK + ACTIVE LINK
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Shrink navbar
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}, { passive: true });

// ============================================================
// 3. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close on nav-link click (mobile)
navLinksList.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ============================================================
// 4. SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// 5. PARTICLE CANVAS â€” HERO BACKGROUND
// ============================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '#00e5ff' : '#7c3aed';
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += this.pulseSpeed;
    const pulsedOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
      return;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = pulsedOpacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles(count = 130) {
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

// Draw connection lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00e5ff';
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => p.update());
  animFrame = requestAnimationFrame(animateParticles);
}

// Pause/resume on visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(animFrame);
  else animateParticles();
});

// Mouse interaction â€” attract particles
let mouse = { x: null, y: null };
canvas.parentElement.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      p.x += dx * 0.008;
      p.y += dy * 0.008;
    }
  });
}, { passive: true });

initParticles();
animateParticles();

// ============================================================
// 6. TYPED TEXT ANIMATOR
// ============================================================
const typedEl = document.getElementById('typedText');
const words = [
  'Reporting Specialist',
  'AI Engineer',
  'Python Developer',
  'Desktop App Builder',
  'NLP Enthusiast',
  'FinTech Innovator',
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingPaused = false;

function typeLoop() {
  if (!typedEl) return;
  const currentWord = words[wordIdx];

  if (!isDeleting) {
    typedEl.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentWord.length) {
      typingPaused = true;
      setTimeout(() => { isDeleting = true; typingPaused = false; typeLoop(); }, 2000);
      return;
    }
  } else {
    typedEl.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
    }
  }

  const speed = isDeleting ? 60 : 100;
  setTimeout(typeLoop, speed);
}
setTimeout(typeLoop, 800);

// ============================================================
// 7. SCROLL REVEAL â€” IntersectionObserver
// ============================================================
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Check if it has skill bars
      const bars = entry.target.querySelectorAll('.skill-bar-fill');
      bars.forEach(bar => {
        const target = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = `${target}%`; }, 300);
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealItems.forEach(item => revealObserver.observe(item));

// ============================================================
// 8. HERO STAT COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, suffix, duration = 1500) {
  const start = 0;
  const isFloat = !Number.isInteger(target);
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = start + (target - start) * eased;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(el => {
        const raw = el.getAttribute('data-target');
        animateCounter(el, parseFloat(raw), '');
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ============================================================
// 9. CONTACT FORM VALIDATION
// ============================================================
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors() {
  ['nameError', 'emailError', 'subjectError', 'messageError'].forEach(id => setError(id, ''));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.addEventListener('submit', (e) => {
    clearErrors();
    formSuccess.classList.remove('show');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    if (!name) { setError('nameError', 'Name is required'); valid = false; }
    if (!email) { setError('emailError', 'Email is required'); valid = false; }
    else if (!validateEmail(email)) { setError('emailError', 'Enter a valid email address'); valid = false; }
    if (!subject) { setError('subjectError', 'Subject is required'); valid = false; }
    if (!message) { setError('messageError', 'Message is required'); valid = false; }
    else if (message.length < 10) { setError('messageError', 'Message too short (min 10 chars)'); valid = false; }

    if (!valid) {
      e.preventDefault();
      return;
    }

    // UI feedback, allow default mailto: action to execute
    formSuccess.classList.add('show');
    setTimeout(() => { 
      formSuccess.classList.remove('show');
      form.reset();
    }, 5000);
  });
}

// ============================================================
// 10. GLASS TILE â€” DYNAMIC MOUSE GLOW EFFECT
// ============================================================
document.querySelectorAll('.glass-tile').forEach(tile => {
  tile.addEventListener('mousemove', (e) => {
    const rect = tile.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const glow = tile.querySelector('.tile-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0, 229, 255, 0.08), transparent 60%)`;
    }
  });
});

// ============================================================
// 11. NAVBAR ACTIVE STYLE (CSS injection)
// ============================================================
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--accent-cyan); background: var(--accent-cyan-dim); }
.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }`;
document.head.appendChild(navStyle);

// ============================================================
// 12. DUAL ISLAND NAV SYSTEM
// ============================================================

/* ---- Particle colour helpers ---- */
const COLOR_PARTICLE_MAP = {
  aqua: ['#00e5ff', '#7c3aed'],
  ember: ['#f97316', '#ef4444'],
  forest: ['#22c55e', '#eab308'],
  sakura: ['#ff6eb4', '#c084fc'],
};

const LAYOUT_PARTICLE_MAP = {
  default: null,
  planet: ['#c4922a', '#8b6d24', '#e8c87a'],
  minimal: ['#6366f1', '#a855f7'],
};

function syncIslandParticles() {
  const layout = html.getAttribute('data-layout-theme') || 'default';
  const color = html.getAttribute('data-color-theme') || 'aqua';
  const cols = LAYOUT_PARTICLE_MAP[layout] || COLOR_PARTICLE_MAP[color] || COLOR_PARTICLE_MAP.aqua;
  particles.forEach(p => {
    p.color = cols[Math.floor(Math.random() * cols.length)];
  });
}

/* ---- Persistence keys ---- */
const LS_COLOR = 'vt-color-theme';
const LS_FONT = 'vt-font-theme';
const LS_LAYOUT = 'vt-layout-theme';

/* ---- Apply helpers ---- */
function applyColorTheme(name) {
  html.setAttribute('data-color-theme', name);
  localStorage.setItem(LS_COLOR, name);
  syncIslandParticles();
  document.querySelectorAll('.ipal-btn[data-color]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === name);
  });
}

function applyFontTheme(name) {
  html.setAttribute('data-font-theme', name);
  localStorage.setItem(LS_FONT, name);
  document.querySelectorAll('.ipal-btn[data-font]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.font === name);
  });
}

function applyLayoutTheme(name) {
  html.setAttribute('data-layout-theme', name);
  localStorage.setItem(LS_LAYOUT, name);
  syncIslandParticles();
  if (name === 'planet' || name === 'minimal') {
    html.setAttribute('data-theme', 'light');
  } else {
    const userTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', userTheme);
  }
  document.querySelectorAll('.ilayout-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layout === name);
  });
  if (name === 'planet') {
    requestAnimationFrame(initPlanetCanvas);
  } else {
    destroyPlanetCanvas();
  }
}

/* ---- Wire up buttons ---- */
document.querySelectorAll('.ipal-btn[data-color]').forEach(btn => {
  btn.addEventListener('click', () => applyColorTheme(btn.dataset.color));
});

document.querySelectorAll('.ipal-btn[data-font]').forEach(btn => {
  btn.addEventListener('click', () => applyFontTheme(btn.dataset.font));
});

document.querySelectorAll('.ilayout-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLayoutTheme(btn.dataset.layout));
});

/* ---- Restore saved preferences on load ---- */
(function restoreIslandNavState() {
  const savedColor = localStorage.getItem(LS_COLOR) || 'aqua';
  const savedFont = localStorage.getItem(LS_FONT) || 'outfit';
  const savedLayout = localStorage.getItem(LS_LAYOUT) || 'default';
  applyColorTheme(savedColor);
  applyFontTheme(savedFont);
  applyLayoutTheme(savedLayout);
})();

// ============================================================
// 13. PLANET CANVAS â€” 3D TEXTURED GLOBE + ORBITING MOONS
// ============================================================

let _pRAF = null;

function destroyPlanetCanvas() {
  if (_pRAF) { cancelAnimationFrame(_pRAF); _pRAF = null; }
  const cv = document.getElementById('planetCanvas3D');
  if (cv) cv.remove();
  html.removeAttribute('data-planet-canvas');
}

function initPlanetCanvas() {
  destroyPlanetCanvas();
  const wrapper = document.querySelector('.avatar-wrapper');
  if (!wrapper) return;

  const S = 420, cx = S / 2, cy = S / 2, R = 108;

  const cv = document.createElement('canvas');
  cv.id = 'planetCanvas3D';
  cv.width = S; cv.height = S;
  Object.assign(cv.style, {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)', zIndex: '10',
    pointerEvents: 'none', display: 'block',
  });
  wrapper.style.position = 'relative';
  wrapper.appendChild(cv);
  html.setAttribute('data-planet-canvas', 'true');

  const ctx = cv.getContext('2d');

  // Moons â€” icy/rocky to contrast the blue Earth
  const MOONS = [
    { orbitR: 158, incl: 28, phase: 0, speed: 0.38, sz: 11, c1: '#e0e8f0', c2: '#8898a8', c3: '#2a3545' },
    { orbitR: 200, incl: -55, phase: 2.05, speed: 0.22, sz: 7.5, c1: '#d8d0c0', c2: '#888070', c3: '#302820' },
    { orbitR: 242, incl: 70, phase: 4.4, speed: 0.13, sz: 5.5, c1: '#c8d8e8', c2: '#607888', c3: '#1a2838' },
  ];

  // Land masses as (lon_deg, lat_deg, rx_deg, ry_deg, color)
  const LANDS = [
    // North America
    { lon: -100, lat: 55, rx: 20, ry: 14, col: '#3d7a3a' },
    { lon: -95, lat: 40, rx: 18, ry: 12, col: '#4a8c42' },
    { lon: -80, lat: 25, rx: 10, ry: 10, col: '#55963e' },
    // Greenland (icy)
    { lon: -42, lat: 72, rx: 10, ry: 7, col: '#c8ddd8' },
    // South America
    { lon: -58, lat: 0, rx: 12, ry: 10, col: '#2d7a32' },
    { lon: -60, lat: -30, rx: 10, ry: 14, col: '#3a7a35' },
    // Europe
    { lon: 12, lat: 52, rx: 10, ry: 8, col: '#5a9848' },
    // Africa
    { lon: 18, lat: 10, rx: 16, ry: 18, col: '#9e8230' },
    { lon: 28, lat: -20, rx: 12, ry: 10, col: '#a08535' },
    // Asia
    { lon: 60, lat: 52, rx: 22, ry: 14, col: '#4e8840' },
    { lon: 105, lat: 35, rx: 22, ry: 16, col: '#5a8e3a' },
    { lon: 80, lat: 68, rx: 16, ry: 8, col: '#4a7838' },
    // India
    { lon: 78, lat: 22, rx: 8, ry: 11, col: '#72883a' },
    // Australia
    { lon: 135, lat: -25, rx: 16, ry: 12, col: '#c09040' },
    // Antarctica
    { lon: 0, lat: -82, rx: 60, ry: 8, col: '#d8eae5' },
    // SE Asia / Japan
    { lon: 130, lat: 36, rx: 5, ry: 9, col: '#5a8840' },
  ];

  // Cloud patches (rotate slightly faster than surface)
  const CLOUDS = [
    { lon: -118, lat: 48, rx: 22, ry: 10, op: .72 },
    { lon: -62, lat: 12, rx: 20, ry: 8, op: .65 },
    { lon: 15, lat: 58, rx: 26, ry: 10, op: .68 },
    { lon: 48, lat: -8, rx: 18, ry: 7, op: .60 },
    { lon: 105, lat: 42, rx: 22, ry: 8, op: .65 },
    { lon: 162, lat: 22, rx: 20, ry: 9, op: .70 },
    { lon: -28, lat: -38, rx: 24, ry: 8, op: .62 },
    { lon: 85, lat: -52, rx: 26, ry: 8, op: .65 },
    { lon: -148, lat: 2, rx: 18, ry: 8, op: .55 },
    { lon: -5, lat: 28, rx: 16, ry: 7, op: .60 },
    { lon: 150, lat: -40, rx: 20, ry: 8, op: .62 },
  ];

  let surfPhase = 0, cloudPhase = 0, lastT = null;

  // Project a spherical blob (lon/lat) to screen ellipse
  function projectBlob(lonDeg, latDeg, rxDeg, ryDeg, phase) {
    const lon = lonDeg * Math.PI / 180 + phase;
    const lat = latDeg * Math.PI / 180;
    const z3 = R * Math.cos(lat) * Math.cos(lon);
    if (z3 < -R * 0.12) return null; // behind sphere
    const x3 = R * Math.cos(lat) * Math.sin(lon);
    const y3 = -R * Math.sin(lat);
    const frontal = Math.max(0, z3 / R);
    const pxd = R * Math.PI / 180;
    return {
      sx: cx + x3, sy: cy + y3,
      ex: rxDeg * pxd * Math.max(0.04, frontal), // width foreshortened
      ey: ryDeg * pxd,
      frontal,
    };
  }

  // ---- Earth Globe renderer ----
  function globe() {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

    // Deep ocean base
    const ocean = ctx.createRadialGradient(cx - R * .26, cy - R * .26, R * .05, cx + R * .12, cy + R * .12, R * 1.05);
    ocean.addColorStop(0, '#6ad4fa');
    ocean.addColorStop(.18, '#2ea8d8');
    ocean.addColorStop(.48, '#1472a8');
    ocean.addColorStop(.80, '#084878');
    ocean.addColorStop(1, '#031828');
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // Land masses with limb-darkening
    LANDS.forEach(l => {
      const p = projectBlob(l.lon, l.lat, l.rx, l.ry, surfPhase);
      if (!p || p.ex < 0.5) return;
      ctx.globalAlpha = Math.min(1, 0.35 + p.frontal * 0.85);
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy, Math.max(0.5, p.ex), Math.max(0.5, p.ey), 0, 0, Math.PI * 2);
      ctx.fillStyle = l.col;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Water specular glint
    const spec = ctx.createRadialGradient(cx - R * .38, cy - R * .38, 0, cx, cy, R);
    spec.addColorStop(0, 'rgba(200,242,255,.52)');
    spec.addColorStop(.22, 'rgba(160,228,255,.18)');
    spec.addColorStop(.55, 'rgba(80,200,255,.05)');
    spec.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = spec;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // Cloud layer (faster rotation)
    CLOUDS.forEach(c => {
      const p = projectBlob(c.lon, c.lat, c.rx, c.ry, cloudPhase);
      if (!p || p.ex < 0.5) return;
      ctx.globalAlpha = c.op * Math.min(1, 0.25 + p.frontal * 0.95);
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy, Math.max(0.5, p.ex), Math.max(0.5, p.ey * .65), 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Night-side shadow / terminator
    const sd = ctx.createRadialGradient(cx + R * .24, cy + R * .16, 0, cx + R * .52, cy + R * .42, R * 1.18);
    sd.addColorStop(0, 'rgba(0,0,20,0)');
    sd.addColorStop(.48, 'rgba(0,0,20,.22)');
    sd.addColorStop(1, 'rgba(0,0,20,.78)');
    ctx.fillStyle = sd;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    ctx.restore(); // end sphere clip

    // Blue atmospheric rim glow
    const atm = ctx.createRadialGradient(cx, cy, R * .88, cx, cy, R * 1.28);
    atm.addColorStop(0, 'rgba(60,150,255,0)');
    atm.addColorStop(.32, 'rgba(70,170,255,.30)');
    atm.addColorStop(.72, 'rgba(40,120,255,.10)');
    atm.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
    ctx.fillStyle = atm; ctx.fill();
  }

  // ---- Dashed orbit ellipse ----
  function orbitEllipse(orbitR, incl) {
    const ry = Math.abs(orbitR * Math.cos(incl * Math.PI / 180));
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, orbitR, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,160,255,.10)';
    ctx.lineWidth = .7; ctx.setLineDash([3, 8]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }

  // ---- Moon sphere renderer ----
  function moonSphere(x, y, r, c1, c2, c3, alpha) {
    if (r < .6) return;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .04, x, y, r);
    g.addColorStop(0, c1); g.addColorStop(.5, c2); g.addColorStop(1, c3);
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    const sp = ctx.createRadialGradient(x - r * .3, y - r * .35, 0, x, y, r);
    sp.addColorStop(0, 'rgba(255,255,255,.34)');
    sp.addColorStop(.4, 'rgba(255,255,255,.06)');
    sp.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sp; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    const sh = ctx.createRadialGradient(x + r * .3, y + r * .3, 0, x + r * .62, y + r * .62, r * 1.15);
    sh.addColorStop(0, 'rgba(0,0,0,0)');
    sh.addColorStop(.5, 'rgba(0,0,0,.34)');
    sh.addColorStop(1, 'rgba(0,0,0,.80)');
    ctx.fillStyle = sh; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  // ---- Main animation frame ----
  function frame(ts) {
    if (!document.getElementById('planetCanvas3D')) return;
    if (!lastT) lastT = ts;
    const dt = Math.min((ts - lastT) / 1000, .05);
    lastT = ts;

    surfPhase += dt * 0.28;  // surface rotation
    cloudPhase += dt * 0.38;  // clouds move faster
    MOONS.forEach(m => { m.phase += dt * m.speed * Math.PI * 2; });

    ctx.clearRect(0, 0, S, S);

    const pos = MOONS.map(m => {
      const incl = m.incl * Math.PI / 180;
      const x3 = m.orbitR * Math.cos(m.phase);
      const yr = m.orbitR * Math.sin(m.phase);
      const y3 = yr * Math.cos(incl);
      const z3 = yr * Math.sin(incl);
      const pf = 720 / (720 + z3 * .28);
      return { sx: cx + x3 * pf, sy: cy + y3 * pf, z: z3, r: m.sz * pf, m };
    });

    MOONS.forEach(m => orbitEllipse(m.orbitR, m.incl));

    const sorted = [...pos].sort((a, b) => a.z - b.z);

    sorted.filter(p => p.z < 0).forEach(p => {
      const dx = p.sx - cx, dy = p.sy - cy;
      if (Math.sqrt(dx * dx + dy * dy) > R - p.r * .4) {
        moonSphere(p.sx, p.sy, p.r, p.m.c1, p.m.c2, p.m.c3, .55);
      }
    });

    globe();

    sorted.filter(p => p.z >= 0).forEach(p => {
      moonSphere(p.sx, p.sy, p.r, p.m.c1, p.m.c2, p.m.c3, 1);
    });

    _pRAF = requestAnimationFrame(frame);
  }

  _pRAF = requestAnimationFrame(frame);
}
