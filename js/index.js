import { groupsData } from "../data/group_data.js";
import { authStorageKey } from "../data/login_data.js";

const navigationItems = [
  { id: "home", label: "Home", icon: "home", href: "../html/index.html" },
  { id: "students", label: "Students", icon: "users", href: "../html/oquvchi.html" },
  { id: "dualigo", label: "Dualigo", icon: "book", href: "../html/dualigo.html" }
];

const studentRanking = [
  { name: "Aziza Karimova", level: "IELTS 7.0 Track", score: "98 pts", rank: "#1", color: "linear-gradient(135deg, #67d7ff, #7f7bff)" },
  { name: "Muhammad Ali", level: "Advanced Speaking", score: "94 pts", rank: "#2", color: "linear-gradient(135deg, #ff9f85, #ff6aac)" },
  { name: "Lina Ahmed", level: "General English", score: "91 pts", rank: "#3", color: "linear-gradient(135deg, #7ce5bf, #63b1ff)" },
  { name: "Sardor Xasanov", level: "Grammar Focus", score: "89 pts", rank: "#4", color: "linear-gradient(135deg, #ffd57d, #ff8a70)" },
  { name: "Malika Noor", level: "Speaking Booster", score: "87 pts", rank: "#5", color: "linear-gradient(135deg, #c7a0ff, #ff9cc4)" }
];

const navList = document.querySelector("#nav-list");
const groupsGrid = document.querySelector("#groups-grid");
const rankingList = document.querySelector("#ranking-list");
const themeToggle = document.querySelector("#theme-toggle");
const groupsPrevButton = document.querySelector("#groups-prev-button");
const groupsNextButton = document.querySelector("#groups-next-button");
const adminChip = document.querySelector("#admin-chip");
const logoutButton = document.querySelector("#logout-button");

function redirectToLogin() {
  window.location.href = "../html/login.html";
}

function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function setupAdminSession() {
  const adminSession = getAdminSession();

  if (!adminSession?.isAuthenticated) {
    redirectToLogin();
    return false;
  }

  if (adminChip) {
    adminChip.textContent = `${adminSession.username} | admin`;
  }

  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem(authStorageKey);
    redirectToLogin();
  });

  return true;
}

function syncThemeToggle(theme) {
  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  syncThemeToggle(theme);
}

function setupThemeToggle() {
  if (!themeToggle) {
    return;
  }

  const savedTheme = localStorage.getItem("skillset-theme");
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("skillset-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function renderNavigation() {
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  const activeNavByPage = {
    "": "home",
    "index.html": "home",
    "dualigo.html": "dualigo"
  };
  const activeNavId = activeNavByPage[currentPage] ?? "home";

  navList.innerHTML = navigationItems
    .map(
      (item) => `
        <li>
          <a
            class="nav-link ${item.id === activeNavId ? "is-active" : ""}"
            href="${item.href ?? "#"}"
            data-nav="${item.id}"
            aria-label="${item.label}"
            title="${item.label}"
          >
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
          </a>
        </li>
      `
    )
    .join("");
}

function createShapes(scene) {
  const shapesByScene = {
    stack: 3,
    tilt: 2,
    files: 3,
    coffee: 2,
    papers: 2,
    tower: 3,
    duo: 2,
    notes: 2
  };

  return new Array(shapesByScene[scene] || 2)
    .fill("")
    .map(() => '<span class="shape"></span>')
    .join("");
}

function renderGroups(groups, target) {
  target.innerHTML = groups
    .map(
      (group) => `
        <a class="book-card group-card-link" href="../html/group.html?id=${group.id}">
          <div
            class="book-thumb"
            data-scene="${group.scene}"
            style="--card-a:${group.colors[0]}; --card-b:${group.colors[1]};"
          >
            ${createShapes(group.scene)}
            <span class="book-badge">
              <svg aria-hidden="true"><use href="#icon-book"></use></svg>
            </span>
          </div>
          <h3>${group.title}</h3>
          <p>${group.subtitle}</p>
        </a>
      `
    )
    .join("");

  updateGroupCarouselButtons();
}

function getGroupCarouselStep() {
  const firstCard = groupsGrid.querySelector(".group-card-link");

  if (!firstCard) {
    return 0;
  }

  const gridStyles = window.getComputedStyle(groupsGrid);
  const gap = Number.parseFloat(gridStyles.columnGap) || 14;
  return firstCard.getBoundingClientRect().width + gap;
}

function updateGroupCarouselButtons() {
  if (!groupsPrevButton || !groupsNextButton) {
    return;
  }

  const maxScrollLeft = groupsGrid.scrollWidth - groupsGrid.clientWidth;
  const hasOverflow = maxScrollLeft > 4;

  groupsPrevButton.disabled = !hasOverflow || groupsGrid.scrollLeft <= 4;
  groupsNextButton.disabled = !hasOverflow || groupsGrid.scrollLeft >= maxScrollLeft - 4;
}

function setupGroupCarousel() {
  if (!groupsGrid || !groupsPrevButton || !groupsNextButton) {
    return;
  }

  function slideGroups(direction) {
    const step = getGroupCarouselStep();

    if (!step) {
      return;
    }

    groupsGrid.scrollBy({
      left: step * direction,
      behavior: "smooth"
    });
  }

  groupsPrevButton.addEventListener("click", () => {
    slideGroups(-1);
  });

  groupsNextButton.addEventListener("click", () => {
    slideGroups(1);
  });

  groupsGrid.addEventListener("scroll", updateGroupCarouselButtons);
  window.addEventListener("resize", updateGroupCarouselButtons);
  updateGroupCarouselButtons();
}

function initialsFromName(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderRanking() {
  rankingList.innerHTML = studentRanking
    .map(
      (item) => `
        <article class="ranking-item">
          <div class="ranking-avatar" style="background:${item.color}">
            ${initialsFromName(item.name)}
          </div>
          <div>
            <h4>${item.name}</h4>
            <p>${item.level}</p>
          </div>
          <div class="ranking-meta">
            <strong>${item.score}</strong>
            <span>${item.rank}</span>
          </div>
        </article>
      `
    )
    .join("");
}

if (setupAdminSession()) {
  renderNavigation();
  renderGroups(groupsData, groupsGrid);
  renderRanking();
  setupGroupCarousel();
  setupThemeToggle();
}
