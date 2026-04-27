import { groupsData } from "../data/group_data.js";
import { initSidebar } from "./sidebar.js";

const navigationItems = [
  { id: "home", label: "Home", icon: "home", href: "../html/index.html" },
  { id: "students", label: "Students", icon: "users", href: "../html/oquvchi.html" },
  { id: "library", label: "Library", icon: "book", href: "../html/library.html" }
];

const navList = document.querySelector("#nav-list");
const topNav = document.querySelector("#top-nav");
const bottomNav = document.querySelector("#bottom-nav");
const themeToggle = document.querySelector("#theme-toggle");
const studentList = document.querySelector("#student-list");
const studentsCount = document.querySelector("#students-count");
const studentSearch = document.querySelector("#student-search");
const studentSummary = document.querySelector("#student-summary");
const studentLimitSelect = document.querySelector("#student-limit-select");
const studentLimitTrigger = document.querySelector("#student-limit-trigger");
const studentLimitValue = document.querySelector("#student-limit-value");
const studentLimitMenu = document.querySelector("#student-limit-menu");
const THEME_STORAGE_KEY = "theme";

let selectedLimit = "15";

const avatarThemesCount = 6;

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
  document.body.classList.toggle("dark-mode", theme === "dark");
  syncThemeToggle(theme);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("skillset-theme");
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === "skillset-theme") {
      applyTheme(event.newValue === "dark" ? "dark" : "light");
    }
  });

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    localStorage.setItem("skillset-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function renderNavigation() {
  const sidebarMarkup = navigationItems
    .map(
      (item) => `
        <li>
          <a
            class="nav-link ${item.id === "students" ? "is-active" : ""}"
            href="${item.href ?? "#"}"
            data-nav="${item.id}"
            aria-label="${item.label}"
            title="${item.label}"
          >
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
            <span class="nav-label">${item.label}</span>
          </a>
        </li>
      `
    )
    .join("");

  const compactMarkup = navigationItems
    .map(
      (item) => `
        <a
          class="nav-item ${item.id === "students" ? "is-active active" : ""}"
          href="${item.href ?? "#"}"
          data-nav="${item.id}"
          aria-label="${item.label}"
          title="${item.label}"
        >
          <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
          <span>${item.label}</span>
        </a>
      `
    )
    .join("");

  if (!navList && !topNav && !bottomNav) {
    return;
  }

  if (navList) {
    navList.innerHTML = sidebarMarkup;
  }

  if (topNav) {
    topNav.innerHTML = compactMarkup;
  }

  if (bottomNav) {
    bottomNav.innerHTML = compactMarkup;
  }
}

function initialsFromName(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function scoreToNumber(score) {
  return Number.parseInt(score, 10) || 0;
}

function createStudentData() {
  const students = groupsData.flatMap((group) =>
    group.students.map((student) => ({
      id: `${group.id}-${student.name.toLowerCase().replaceAll(" ", "-")}`,
      name: student.name,
      status: student.status,
      score: student.score,
      scoreValue: scoreToNumber(student.score),
      group: group.title,
      level: group.level,
      teacher: group.teacher
    }))
  );

  return students
    .sort((left, right) => right.scoreValue - left.scoreValue)
    .map((student, index) => ({
      ...student,
      rank: index + 1,
      themeIndex: (index % avatarThemesCount) + 1
    }));
}

const studentsData = createStudentData();

function createSummaryCards() {
  const activeStudents = studentsData.length;
  const strongStudents = studentsData.filter((student) => student.scoreValue >= 90).length;
  const groupsCount = new Set(studentsData.map((student) => student.group)).size;
  const avgScore = Math.round(
    studentsData.reduce((total, student) => total + student.scoreValue, 0) / Math.max(activeStudents, 1)
  );

  const summaryItems = [
    { icon: "users", value: activeStudents, label: "Aktiv o'quvchi" },
    { icon: "star", value: strongStudents, label: "90+ ball olganlar" },
    { icon: "book", value: groupsCount, label: "Faol guruh" },
    { icon: "chart", value: `${avgScore}%`, label: "O'rtacha natija" }
  ];

  studentSummary.innerHTML = summaryItems
    .map(
      (item) => `
        <article class="summary-card">
          <span class="icon-wrap">
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
          </span>
          <strong>${item.value}</strong>
          <p>${item.label}</p>
        </article>
      `
    )
    .join("");
}

function createStudentCard(student) {
  return `
    <a class="student-card" href="../html/student_rank.html?id=${student.id}" data-theme="${student.themeIndex}" data-score="${student.scoreValue}">
      <div class="student-avatar">
        ${initialsFromName(student.name)}
      </div>

      <div class="student-info">
        <h4>${student.name}</h4>
        <div class="student-meta">
          <span>${student.group}</span>
          <span>${student.level}</span>
          <span>${student.teacher}</span>
        </div>
      </div>

      <div class="student-progress">
        <strong>${student.score}</strong>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-bar"></div>
        </div>
        <p>${student.status}</p>
      </div>

      <div class="student-rank">
        <strong>#${student.rank}</strong>
        <span>Reyting</span>
      </div>
    </a>
  `;
}

function renderStudents(students) {
  const visibleStudents = selectedLimit === "all"
    ? students
    : students.slice(0, Number.parseInt(selectedLimit, 10));

  studentsCount.textContent = `${visibleStudents.length} / ${students.length} ta o'quvchi`;

  if (!visibleStudents.length) {
    studentList.innerHTML = '<div class="empty-state">Qidiruv bo\'yicha o\'quvchi topilmadi.</div>';
    return;
  }

  studentList.innerHTML = visibleStudents.map(createStudentCard).join("");
}

function getFilteredStudents() {
  const query = studentSearch.value.trim().toLowerCase();

  if (!query) {
    return studentsData;
  }

  return studentsData.filter((student) =>
    [student.name, student.group, student.level, student.teacher, student.status]
      .some((value) => value.toLowerCase().includes(query))
  );
}

function setupSearch() {
  studentSearch.addEventListener("input", () => {
    renderStudents(getFilteredStudents());
  });
}

function setupLimitSelect() {
  function closeMenu() {
    studentLimitSelect.classList.remove("is-open");
    studentLimitTrigger.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    studentLimitSelect.classList.add("is-open");
    studentLimitTrigger.setAttribute("aria-expanded", "true");
  }

  studentLimitTrigger.addEventListener("click", () => {
    const isOpen = studentLimitSelect.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  studentLimitMenu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-limit-value]");
    if (!option) {
      return;
    }

    selectedLimit = option.getAttribute("data-limit-value") ?? "15";
    studentLimitValue.textContent = option.textContent?.trim() || "15";

    studentLimitMenu.querySelectorAll(".custom-select-option").forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });

    closeMenu();
    renderStudents(getFilteredStudents());
  });

  document.addEventListener("click", (event) => {
    if (studentLimitSelect.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

renderNavigation();
createSummaryCards();
renderStudents(studentsData);
setupSearch();
setupLimitSelect();
setupThemeToggle();
initSidebar();
