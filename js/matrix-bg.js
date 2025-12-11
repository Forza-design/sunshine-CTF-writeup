// js/matrix-bg.js
// Matrix "digital rain" background for MkDocs sites.
// - respects prefers-reduced-motion
// - toggleable via window._matrixBg
// - hidden on small screens by default

(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const OPACITY = 0.12;        // overall background opacity
  const FONT_SIZE = 14;        // px
  const FRAME_INTERVAL = 55;   // ms
  const DENSITY = 0.55;        // 0..1 columns density

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '-1',
    pointerEvents: 'none',
    opacity: OPACITY.toString()
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let cols = 0, drops = [], dpr = window.devicePixelRatio || 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
    cols = Math.max(1, Math.floor(window.innerWidth / FONT_SIZE * DENSITY));
    drops = new Array(cols).fill(0);
  }

  function glyph() {
    const r = Math.random();
    if (r < 0.35) return String.fromCharCode(48 + Math.floor(Math.random()*10)); // 0-9
    if (r < 0.7) return String.fromCharCode(0x30A0 + Math.floor(Math.random()*96)); // kana-like
    return String.fromCharCode(65 + Math.floor(Math.random()*26)); // A-Z
  }

  ctx.font = `${FONT_SIZE}px monospace`;
  ctx.textBaseline = 'top';

  function draw() {
    // trail
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff9f';
    ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < cols; i++) {
      const x = i * (FONT_SIZE / DENSITY);
      const y = drops[i] * FONT_SIZE;
      ctx.fillText(glyph(), x, y);
      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += 1;
      }
    }
  }

  let timer = setInterval(draw, FRAME_INTERVAL);

  window.addEventListener('resize', () => {
    clearInterval(timer);
    resize();
    timer = setInterval(draw, FRAME_INTERVAL);
  }, { passive: true });

  resize();

  // Toggle API for user control
  window._matrixBg = {
    enable() {
      if (!timer) timer = setInterval(draw, FRAME_INTERVAL);
      canvas.style.display = '';
    },
    disable() {
      if (timer) clearInterval(timer);
      timer = null;
      canvas.style.display = 'none';
    },
    isEnabled() { return !!timer; }
  };
})();
