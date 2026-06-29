function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, animId;
  let particles = [];
  let gridLines = [];
  let dataLines = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }

  // ── GRID ──────────────────────────────────────
  function buildGrid() {
    gridLines = [];
    const spacing = 60;
    for (let x = 0; x < W; x += spacing) gridLines.push({ type: 'v', pos: x });
    for (let y = 0; y < H; y += spacing) gridLines.push({ type: 'h', pos: y });
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth   = 0.5;
    gridLines.forEach(l => {
      ctx.beginPath();
      if (l.type === 'v') { ctx.moveTo(l.pos, 0); ctx.lineTo(l.pos, H); }
      else                { ctx.moveTo(0, l.pos); ctx.lineTo(W, l.pos); }
      ctx.stroke();
    });
  }

  // ── PARTICLES ─────────────────────────────────
  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.2,
      vy:    (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      red:   Math.random() > 0.85,
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red
        ? `rgba(192,57,43,${p.alpha})`
        : `rgba(232,232,232,${p.alpha})`;
      ctx.fill();
    });
  }

  // ── DATA LINES ────────────────────────────────
  function createDataLine() {
    const vertical = Math.random() > 0.5;
    return {
      vertical,
      x:       vertical ? Math.random() * W : -200,
      y:       vertical ? -200 : Math.random() * H,
      length:  Math.random() * 120 + 60,
      speed:   Math.random() * 0.6 + 0.2,
      alpha:   Math.random() * 0.15 + 0.05,
      red:     Math.random() > 0.7,
      life:    0,
      maxLife: Math.random() * 300 + 200,
    };
  }

  function initDataLines() {
    dataLines = [];
    for (let i = 0; i < 12; i++) dataLines.push(createDataLine());
  }

  function drawDataLines() {
    dataLines.forEach((l, i) => {
      l.life++;
      if (l.life > l.maxLife) dataLines[i] = createDataLine();

      const fade = l.life < 30
        ? l.life / 30
        : l.life > l.maxLife - 30
          ? (l.maxLife - l.life) / 30
          : 1;

      const color = l.red
        ? `rgba(192,57,43,${l.alpha * fade})`
        : `rgba(26,111,168,${l.alpha * fade})`;

      const grad = l.vertical
        ? ctx.createLinearGradient(l.x, l.y, l.x, l.y + l.length)
        : ctx.createLinearGradient(l.x, l.y, l.x + l.length, l.y);

      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      if (l.vertical) {
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y + l.length);
        l.y += l.speed;
        if (l.y > H + 200) { l.y = -200; l.x = Math.random() * W; l.life = 0; }
      } else {
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + l.length, l.y);
        l.x += l.speed;
        if (l.x > W + 200) { l.x = -200; l.y = Math.random() * H; l.life = 0; }
      }
      ctx.stroke();
    });
  }

  // ── CORNER GLOW ───────────────────────────────
  function drawGlow() {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
    g.addColorStop(0, 'rgba(192,57,43,0.04)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 400, 400);
  }

  // ── LOOP ──────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGlow();
    drawGrid();
    drawDataLines();
    drawParticles();
    animId = requestAnimationFrame(loop);
  }

  // ── INIT ──────────────────────────────────────
  function init() {
    resize();
    initParticles();
    initDataLines();
    loop();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initParticles();
    loop();
  });

  init();
}

document.addEventListener('DOMContentLoaded', initBackground);