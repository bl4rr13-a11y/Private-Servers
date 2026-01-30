// Starfield: random dots fade in/out + gentle drift, looping.
// Uses canvas to keep it smooth and lightweight.

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = 1;
let stars = [];
const STAR_COUNT = 140;

function resize() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Rebuild stars for new size
  stars = Array.from({ length: STAR_COUNT }, () => makeStar(true));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeStar(initial = false) {
  const base = {
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.6, 1.8),
    // opacity cycles
    phase: rand(0, Math.PI * 2),
    speed: rand(0.006, 0.02),
    // drift
    vx: rand(-0.04, 0.04),
    vy: rand(-0.03, 0.03),
  };

  if (!initial) {
    // spawn from a random edge sometimes
    const edge = Math.floor(rand(0, 4));
    if (edge === 0) { base.x = rand(0, w); base.y = -5; }
    if (edge === 1) { base.x = w + 5; base.y = rand(0, h); }
    if (edge === 2) { base.x = rand(0, w); base.y = h + 5; }
    if (edge === 3) { base.x = -5; base.y = rand(0, h); }
  }

  return base;
}

function tick() {
  ctx.clearRect(0, 0, w, h);

  // subtle vignette
  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // stars
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.phase += s.speed;

    // fade in/out loop
    const a = 0.15 + (Math.sin(s.phase) + 1) * 0.5 * 0.65;

    // drift
    s.x += s.vx;
    s.y += s.vy;

    // wrap / respawn
    const out = s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h + 10;
    if (out) stars[i] = makeStar(false);

    // draw star
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }

  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);
resize();
tick();
