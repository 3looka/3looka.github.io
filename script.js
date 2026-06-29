function initMain() {

  // ── CLOCK ─────────────────────────────────────
  function updateClock() {
    const el = document.getElementById('status-time');
    if (!el) return;
    const now = new Date();
    const h   = String(now.getHours()).padStart(2, '0');
    const m   = String(now.getMinutes()).padStart(2, '0');
    const s   = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── FOOTER YEAR ───────────────────────────────
  const fyEl = document.getElementById('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  // ── TYPING EFFECT ─────────────────────────────
  function typeText(el, text, speed = 40) {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }

  const typingEl = document.querySelector('.typing-target');
  if (typingEl) {
    const text = typingEl.dataset.text || '';
    setTimeout(() => typeText(typingEl, text), 400);
  }

  // ── COUNTER ANIMATION ─────────────────────────
  function animateCount(el, target, duration = 1500) {
    let start     = 0;
    const step    = target / (duration / 16);
    const timer   = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    setTimeout(() => animateCount(el, target), 600);
  });

  // ── REVEAL ON SCROLL ──────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── STACK BARS ON SCROLL ──────────────────────
  const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stack-fill').forEach(bar => {
          const w = bar.dataset.width || 0;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        stackObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const stackSection = document.getElementById('stack');
  if (stackSection) stackObserver.observe(stackSection);

  // ── ACTIVE NAV ON SCROLL ──────────────────────
  const sections = document.querySelectorAll('.module');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  // ── MAGNETIC BUTTONS ──────────────────────────
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });

  // ── SMOOTH SCROLL ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── NAVBAR SCROLL SHADOW ──────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // ── CURSOR GLOW ───────────────────────────────
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

}