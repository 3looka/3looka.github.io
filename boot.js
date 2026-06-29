const BOOT_LINES = [
  { text: '> Initializing core system...', type: 'ok',   delay: 0   },
  { text: '> Loading kernel modules...', type: 'ok',   delay: 300 },
  { text: '> Mounting file systems...', type: 'ok',   delay: 500 },
  { text: '> Checking dependencies...', type: 'ok',   delay: 700 },
  { text: '> Loading identity module...', type: 'ok',   delay: 900 },
  { text: '> Loading projects module...', type: 'ok',   delay: 1050 },
  { text: '> Loading stack module...', type: 'ok',   delay: 1200 },
  { text: '> Loading journey module...', type: 'ok',   delay: 1350 },
  { text: '> Loading contact module...', type: 'ok',   delay: 1500 },
  { text: '> Connecting to network...', type: 'ok',   delay: 1650 },
  { text: '> Running diagnostics...', type: 'warn',  delay: 1800 },
  { text: '> All systems nominal.', type: 'ok',   delay: 2000 },
  { text: '> STATUS: ONLINE', type: 'ok',   delay: 2200 },
];

function runBoot() {
  const bootScreen = document.getElementById('boot-screen');
  const bootLines  = document.getElementById('boot-lines');
  const bootBar    = document.getElementById('boot-bar');
  const bootStatus = document.getElementById('boot-status');

  document.body.classList.add('booting');

  BOOT_LINES.forEach((line, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `boot-line ${line.type}`;
      el.textContent = line.text;
      bootLines.appendChild(el);

      const progress = Math.round(((i + 1) / BOOT_LINES.length) * 100);
      bootBar.style.width = progress + '%';
      bootStatus.textContent = progress < 100
        ? `LOADING... ${progress}%`
        : 'SYSTEM READY';
    }, line.delay);
  });

  const totalTime = BOOT_LINES[BOOT_LINES.length - 1].delay + 600;

  setTimeout(() => {
    bootScreen.classList.add('hide');
    document.body.classList.remove('booting');

    const canvas    = document.getElementById('bg-canvas');
    const statusBar = document.getElementById('status-bar');
    const navbar    = document.getElementById('navbar');

    canvas.classList.add('visible');
    statusBar.classList.add('visible');
    navbar.classList.add('visible');

    setTimeout(() => {
      bootScreen.style.display = 'none';
      if (typeof initMain === 'function') initMain();
    }, 800);

  }, totalTime);
}

document.addEventListener('DOMContentLoaded', runBoot);