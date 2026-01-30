// Put your private server links here.
// You can add as many as you want.
// "url" can be any link (Roblox private server invite link, etc.)

const links = [
  {
    name: "Server #1",
    game: "Murder Mystery 2",
    url: "https://www.roblox.com.ml/games/142823291/Murder-Mystery-2?privateServerLinkCode=77890302553169749830826013022541",
    note: "Chill / Trading",
    tag: "Active 8/10",
  },
  {
    name: "Server #2",
    game: "Da Hood",
    url: "https://www.roblox.com.ml/games/2788229376/Da-Hood?privateServerLinkCode=77890302553169749830826013022541",
    note: "Hangout / Trading",
    tag: "Active 23/40",
  },
  {
    name: "Server #3",
    game: "Blox Fruits",
    url: "https://www.roblox.com.ml/games/2753915549/Blox-Fruits?privateServerLinkCode=77890302553169749830826013022541",
    note: "Events only",
    tag: "Active 9/12",
  },
];

function safeHost(url) {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

function renderLinks() {
  const container = document.getElementById("links");
  container.innerHTML = "";

  links.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const host = safeHost(item.url);

    card.innerHTML = `
      <div class="card-inner">
        <div class="row">
          <div>
            <h3 class="title">${escapeHtml(item.name)} <span style="opacity:.65">—</span> ${escapeHtml(item.game)}</h3>
            <p class="desc">${escapeHtml(item.note || "")}</p>
          </div>
          <div class="pill">${escapeHtml(item.tag || host)}</div>
        </div>

        <div class="actions">
          <a class="btn" href="${item.url}" target="_blank" rel="noopener noreferrer">
            Launch
            <span aria-hidden="true">↗</span>
          </a>
          <button class="btn secondary" type="button" data-copy="${item.url}">
            Copy link
            <span aria-hidden="true">⧉</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Copy buttons
  container.querySelectorAll("button[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(url);
        const original = btn.textContent.trim();
        btn.textContent = "Copied ✓";
        setTimeout(() => (btn.textContent = original), 900);
      } catch {
        // fallback
        prompt("Copy this link:", url);
      }
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Compact toggle
const toggle = document.getElementById("toggleCompact");
toggle.addEventListener("click", () => {
  const root = document.documentElement;
  const compact = root.classList.toggle("compact");
  toggle.setAttribute("aria-pressed", compact ? "true" : "false");
});

renderLinks();
