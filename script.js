/* ============================================================
   script.js — Portfolio Interactivity
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
// 2. NAVBAR — SCROLL SHRINK + ACTIVE LINK
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
// 5. PARTICLE CANVAS — HERO BACKGROUND
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

// Mouse interaction — attract particles
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
// 7. SCROLL REVEAL — IntersectionObserver
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
    e.preventDefault();
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

    if (!valid) return;

    // Simulate send
    sendBtn.disabled = true;
    sendBtn.querySelector('.btn-send-text').textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      sendBtn.disabled = false;
      sendBtn.querySelector('.btn-send-text').textContent = 'Send Message';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1500);
  });
}

// ============================================================
// 10. GLASS TILE — DYNAMIC MOUSE GLOW EFFECT
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
// 12. PORTFOLIO THEME SWITCHER
// ============================================================
const THEME_KEY = 'portfolio-visual-theme';

// Particle color map per theme
const PARTICLE_COLORS = {
  'dark-aqua': ['#00e5ff', '#7c3aed'],
  'anime': ['#ff6eb4', '#c084fc'],
  'glassmorphism': ['#818cf8', '#a78bfa'],
  'elevated': ['#f97316', '#3b82f6'],
  'light': ['#0284c7', '#6d28d9'],
  'nature': ['#22c55e', '#eab308'],
  'colorful': ['#f97316', '#4ecdc4', '#ec4899', '#a855f7'],
  'threed': ['#60a5fa', '#f472b6'],
  'minimal': ['#555555', '#888888'],
};

let current3DCleanups = [];

function apply3DTilt() {
  document.querySelectorAll('.glass-tile').forEach(tile => {
    const onMove = (e) => {
      const r = tile.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform =
        `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(14px)`;
    };
    const onLeave = () => {
      tile.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    };
    tile.addEventListener('mousemove', onMove);
    tile.addEventListener('mouseleave', onLeave);
    current3DCleanups.push(() => {
      tile.removeEventListener('mousemove', onMove);
      tile.removeEventListener('mouseleave', onLeave);
      tile.style.transform = '';
    });
  });
}

function remove3DTilt() {
  current3DCleanups.forEach(fn => fn());
  current3DCleanups = [];
}

function syncParticleColors(themeName) {
  const cols = PARTICLE_COLORS[themeName] || PARTICLE_COLORS['dark-aqua'];
  particles.forEach(p => {
    p.color = cols[Math.floor(Math.random() * cols.length)];
  });
}

function applyPortfolioTheme(themeName, baseTheme) {
  // Set portfolio theme attribute
  html.setAttribute('data-portfolio-theme', themeName);

  // Set base dark/light mode
  html.setAttribute('data-theme', baseTheme);
  localStorage.setItem('portfolio-theme', baseTheme);

  // Update particle colors
  syncParticleColors(themeName);

  // Handle 3D tilt
  if (themeName === 'threed') {
    apply3DTilt();
  } else {
    remove3DTilt();
  }

  // Update active button
  document.querySelectorAll('.theme-card').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themePick === themeName);
  });

  // Persist
  localStorage.setItem(THEME_KEY, themeName);
}

// Wire up theme cards
document.querySelectorAll('.theme-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const pick = btn.dataset.themePick;
    const base = btn.dataset.baseTheme || 'dark';
    applyPortfolioTheme(pick, base);
  });
});

// Restore saved portfolio theme on load
(function () {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && saved !== 'dark-aqua') {
    const btn = document.querySelector(`[data-theme-pick="${saved}"]`);
    const base = btn ? (btn.dataset.baseTheme || 'dark') : 'dark';
    applyPortfolioTheme(saved, base);
  } else {
    syncParticleColors('dark-aqua');
  }
})();

