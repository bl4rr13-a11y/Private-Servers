// Starfield with mouse attraction + faint animated nebulae
// Premium, subtle, slow-moving

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = 1;

// --------------------
// Stars
// --------------------
let stars = [];
const STAR_COUNT = 150;

// Mouse interaction
const mouse = {
  x: null,
  y: null,
  radius: 120,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// --------------------
// Nebulae
// --------------------
let nebulae = [];
const NEBULA_COUNT = 3; // keep low for subtlety

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// --------------------
// Resize
// --------------------
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
  nebulae = Array.from({ length: NEBULA_COUNT }, () => makeNebula());
}

// --------------------
// Star creation
// --------------------
function makeStar(initial = false) {
  const s = {
    x: rand(0, w),
    y: rand(0, h),
    ox: 0,
    oy: 0,
    r: rand(0.6, 1.8),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.006, 0.02),
    vx: rand(-0.04, 0.04),
    vy: rand(-0.03, 0.03),
  };
  s.ox = s.x;
  s.oy = s.y;
  return s;
}

// --------------------
// Nebula creation
// --------------------
function makeNebula() {
  return {
    x: rand(-w * 0.2, w * 1.2),
    y: rand(-h * 0.2, h * 1.2),
    r: rand(w * 0.35, w * 0.6),
    hue: Math.random() > 0.5 ? 260 : 210, // purple / blue
    alpha: rand(0.03, 0.06), // VERY faint
    phase: rand(0, Math.PI * 2),
    speed: rand(0.0004, 0.0008),
    vx: rand(-0.015, 0.015),
    vy: rand(-0.015, 0.015),
  };
}

// --------------------
// Draw Nebulae
// --------------------
function drawNebulae() {
  nebulae.forEach((n, i) => {
    n.phase += n.speed;
    n.x += n.vx;
    n.y += n.vy;

    const fade = (Math.sin(n.phase) + 1) * 0.5; // 0–1
    const opacity = n.alpha * fade;

    const grad = ctx.createRadialGradient(
      n.x,
      n.y,
      n.r * 0.2,
      n.x,
      n.y,
      n.r
    );

    grad.addColorStop(0, `hsla(${n.hue}, 80%, 60%, ${opacity})`);
    grad.addColorStop(0.6, `hsla(${n.hue}, 70%, 45%, ${opacity * 0.4})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();

    // Respawn if far outside
    if (
      n.x < -w || n.x > w * 2 ||
      n.y < -h || n.y > h * 2
    ) {
      nebulae[i] = makeNebula();
    }
  });
}

// --------------------
// Animation loop
// --------------------
function tick() {
  ctx.clearRect(0, 0, w, h);

  // Nebula layer (behind stars)
  drawNebulae();

  // Stars
  stars.forEach((s, i) => {
    s.phase += s.speed;
    const alpha = 0.15 + (Math.sin(s.phase) + 1) * 0.5 * 0.65;

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

    // Ease back
    s.x += (s.ox - s.x) * 0.02;
    s.y += (s.oy - s.y) * 0.02;

    if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20) {
      stars[i] = makeStar(false);
      return;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(tick);
}

// --------------------
window.addEventListener("resize", resize);
resize();
tick();
