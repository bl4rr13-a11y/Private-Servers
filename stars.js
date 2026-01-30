// Starfield with mouse attraction
// Stars gently pull toward the cursor when nearby, then drift back

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = 1;
let stars = [];
const STAR_COUNT = 150;

// Mouse tracking
const mouse = {
  x: null,
  y: null,
  radius: 120, // attraction distance
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

function resize() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = window.innerWidth;
  h = window.innerHeight;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from({ length: STAR_COUNT }, () => makeStar(true));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeStar(initial = false) {
  const star = {
    x: rand(0, w),
    y: rand(0, h),
    ox: 0, // original offset (for smooth return)
    oy: 0,
    r: rand(0.6, 1.8),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.006, 0.02),
    vx: rand(-0.04, 0.04),
    vy: rand(-0.03, 0.03),
  };

  star.ox = star.x;
  star.oy = star.y;

  if (!initial) {
    const edge = Math.floor(rand(0, 4));
    if (edge === 0) { star.x = rand(0, w); star.y = -10; }
    if (edge === 1) { star.x = w + 10; star.y = rand(0, h); }
    if (edge === 2) { star.x = rand(0, w); star.y = h + 10; }
    if (edge === 3) { star.x = -10; star.y = rand(0, h); }

    star.ox = star.x;
    star.oy = star.y;
  }

  return star;
}

function tick() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];

    s.phase += s.speed;
    const alpha = 0.15 + (Math.sin(s.phase) + 1) * 0.5 * 0.65;

    // Base drift
    s.ox += s.vx;
    s.oy += s.vy;

    // Mouse attraction
    if (mouse.x !== null) {
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.6;
        s.x += dx * force * 0.04;
        s.y += dy * force * 0.04;
      }
    }

    // Ease back to original drift position
    s.x += (s.ox - s.x) * 0.02;
    s.y += (s.oy - s.y) * 0.02;

    // Respawn if out of bounds
    if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20) {
      stars[i] = makeStar(false);
      continue;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);
resize();
tick();
