const BASE_URL = "http://localhost:5500";

const sectionLabels = {
  dashboard: "Dashboard",
  assignments: "Assignments",
  results: "Results",
  library: "Library",
};

const videoLessons = [
  {
    title: "React Components Basics",
    teacher: "Aziza Karim",
    note: "Frontend Bootcamp, 28 daqiqalik video dars",
    link: "https://www.youtube.com/watch?v=SqcY0GlETPk",
  },
  {
    title: "JavaScript DOM Practice",
    teacher: "Aziza Karim",
    note: "Uyga vazifaga tayyorlovchi amaliy dars",
    link: "https://www.youtube.com/watch?v=5fb2aPlgoys",
  },
  {
    title: "English Speaking Shadowing",
    teacher: "David Brown",
    note: "Speaking uchun talaffuz va repetition mashqi",
    link: "https://www.youtube.com/watch?v=n4NVPg2kHv4",
  },
  {
    title: "UI Layout Principles",
    teacher: "Nodira Usmon",
    note: "Dizayn joylashuvi va spacing bo'yicha video",
    link: "https://www.youtube.com/watch?v=HThA0kF7GQo",
  },
  {
    title: "Flexbox and Grid Review",
    teacher: "Javohir Aliyev",
    note: "Responsive sahifa uchun takrorlash darsi",
    link: "https://www.youtube.com/watch?v=3YW65K6LcIA",
  },
  {
    title: "Homework Walkthrough",
    teacher: "Aziza Karim",
    note: "Oxirgi vazifalarni qanday bajarish bo'yicha ko'rsatma",
    link: "https://www.youtube.com/watch?v=1PnVor36_40",
  },
];

const tasks = [
  {
    id: 1,
    title: "Present Simple Quiz",
    description: "Choose the correct tense form in 10 multiple-choice grammar questions.",
    type: "grammar",
    questions: 10,
    deadline: "Deadline: 30 Apr",
    progress: 100,
  },
  {
    id: 2,
    title: "Word Matching",
    description: "Match new academic words with their meanings in a Duolingo-style exercise.",
    type: "vocabulary",
    questions: 12,
    deadline: "Deadline: 1 May",
    progress: 100,
  },
  {
    id: 3,
    title: "Listening Section 1",
    description: "Listen to the short conversation and answer the follow-up questions.",
    type: "listening",
    questions: 8,
    deadline: "Deadline: 2 May",
    progress: 100,
  },
  {
    id: 4,
    title: "Task 2 Essay Draft",
    description: "Write a short opinion essay using the feedback from your last mock test.",
    type: "writing",
    questions: 1,
    deadline: "Deadline: 3 May",
    progress: 45,
  },
  {
    id: 5,
    title: "Speaking Part 2",
    description: "Record a two-minute answer and practice fluency around one cue-card topic.",
    type: "speaking",
    questions: 1,
    deadline: "Deadline: 4 May",
    progress: 100,
  },
  {
    id: 6,
    title: "Daily Reading Builder",
    description: "Complete a short passage and identify main ideas, headings, and keywords.",
    type: "vocabulary",
    questions: 6,
    deadline: "Deadline: 5 May",
    progress: 0,
  },
];

const backlogRows = [
  {
    title: "Navbar responsive fix",
    detail: "Mobil holatda menu joylashuvi xato bo'lib qolgan",
    status: "Chala bajarilgan",
  },
  {
    title: "Essay correction",
    detail: "Grammar xatolari tuzatilishi kerak",
    status: "Xato bajarilgan",
  },
  {
    title: "Flexbox homework",
    detail: "Cards orasidagi spacing noto'g'ri",
    status: "Qayta topshirish",
  },
  {
    title: "JS condition task",
    detail: "Logic qismi to'liq ishlamayapti",
    status: "Chala bajarilgan",
  },
];

const completedTasks = [
  {
    taskId: 1,
    title: "Present Simple Quiz",
    type: "grammar",
    skill: "writing",
    score: 85,
    feedback: "Good grammar usage",
    status: "Completed",
  },
  {
    taskId: 2,
    title: "Word Matching",
    type: "vocabulary",
    skill: "reading",
    score: 90,
    feedback: "Strong vocabulary",
    status: "Completed",
  },
  {
    taskId: 3,
    title: "Listening Section 1",
    type: "listening",
    skill: "listening",
    score: 75,
    feedback: "Good attention to key details",
    status: "Completed",
  },
  {
    taskId: 5,
    title: "Speaking Part 2",
    type: "speaking",
    skill: "speaking",
    score: 78,
    feedback: "Fluency is improving steadily",
    status: "Completed",
  },
];

const navLinks = document.querySelectorAll(".nav-link[data-section]");
const sections = document.querySelectorAll(".section");
const headerTitle = document.getElementById("headerTitle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const metricCards = document.querySelectorAll(".metric-action");
const backlogList = document.getElementById("backlog-list");
const toggleBacklogBtn = document.getElementById("toggleBacklogBtn");
const themeToggle = document.getElementById("themeToggle");
const goAssignmentsBtn = document.getElementById("goAssignmentsBtn");
const tasksGrid = document.getElementById("tasks-grid");
const libraryGrid = document.getElementById("library-grid");
const librarySearch = document.getElementById("library-search");
const libraryFilters = document.querySelectorAll("[data-library-filter]");
const THEME_KEY = "edu-dashboard-theme";

const DEFAULT_BOOK_IMAGE = "default-book.png";
const DEFAULT_BOOK_PREVIEW = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
    <defs>
      <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d97b41" />
        <stop offset="100%" stop-color="#c95a52" />
      </linearGradient>
    </defs>
    <rect width="480" height="600" rx="36" fill="url(#coverGradient)" />
    <rect x="34" y="34" width="412" height="532" rx="28" fill="rgba(255,255,255,0.12)" />
    <text x="52" y="118" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700">Library</text>
    <text x="52" y="210" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700">Digital Book</text>
    <text x="52" y="520" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="24">Student Access</text>
  </svg>
`)}`;

let backlogExpanded = false;
let activeLibraryCategory = "All";
let latestCompletedTaskId = null;
const resultsState = {
  normalizedTasks: [],
  skillPercentages: {},
  skillBands: {},
  overallBand: null,
  cefrLevel: "A2",
  bestSkill: null,
  weakSkill: null,
};

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
}

function createStatusBadge(status) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `<span class="status-badge ${normalized}">${status || "-"}</span>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeBookLevel(level) {
  return (level || "").toUpperCase().startsWith("CEFR") ? "CEFR" : level || "IELTS";
}

function resolveBookImage(image) {
  if (!image || image === DEFAULT_BOOK_IMAGE) {
    return DEFAULT_BOOK_PREVIEW;
  }

  if (image.startsWith("http") || image.startsWith("data:")) {
    return image;
  }

  return `${BASE_URL}/${image.replace(/^\/+/, "")}`;
}

function resolveBookPdf(pdf) {
  if (!pdf) {
    return "#";
  }

  if (pdf.startsWith("http")) {
    return pdf;
  }

  return `${BASE_URL}/${pdf.replace(/^\/+/, "")}`;
}

function renderRows(targetId, rows, columns) {
  const tbody = document.getElementById(targetId);

  tbody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          ${columns.map((column) => `<td>${column(row)}</td>`).join("")}
        </tr>`,
    )
    .join("");
}

function mapTaskTypeToSkill(type) {
  const skillMap = {
    grammar: "writing",
    vocabulary: "reading",
    listening: "listening",
    writing: "writing",
    speaking: "speaking",
  };

  return skillMap[type] || "reading";
}

function formatLabel(value) {
  const text = String(value || "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getTaskResult(taskId) {
  return completedTasks.find((item) => Number(item.taskId) === Number(taskId)) || null;
}

function getTaskStatus(task) {
  if (getTaskResult(task.id)) {
    return "Completed";
  }

  if (Number(task.progress || 0) > 0) {
    return "In Progress";
  }

  return "Pending";
}

function createTaskStatusBadge(status) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="status-badge ${normalized}">${status}</span>`;
}

function groupTasksBySkill(tasks = []) {
  return tasks.reduce(
    (groups, task) => {
      const skill = String(task.skill || "").toLowerCase();

      if (groups[skill]) {
        groups[skill].push(task);
      }

      return groups;
    },
    {
      reading: [],
      listening: [],
      writing: [],
      speaking: [],
    },
  );
}

function getCEFRLevel(overall) {
  if (overall === null) {
    return "A2";
  }

  if (overall >= 8) {
    return "C2";
  }

  if (overall >= 7) {
    return "C1";
  }

  if (overall >= 5.5) {
    return "B2";
  }

  if (overall >= 4) {
    return "B1";
  }

  return "A2";
}

function createCEFRBadge(level) {
  return `<span class="cefr-badge ${String(level || "").toLowerCase()}">${level}</span>`;
}

function getStrongestWeakestScores(scores) {
  const entries = Object.entries(scores).filter(([, value]) => typeof value === "number" && !Number.isNaN(value));

  if (!entries.length) {
    return { bestSkill: null, weakSkill: null };
  }

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  return {
    bestSkill: sorted[0],
    weakSkill: sorted[sorted.length - 1],
  };
}

function calculateSkillPercentages(items = []) {
  const groupedTasks = groupTasksBySkill(items);

  return Object.fromEntries(
    Object.entries(groupedTasks).map(([skill, skillTasks]) => {
      if (!skillTasks.length) {
        return [skill, null];
      }

      const total = skillTasks.reduce((sum, task) => sum + Number(task.score || 0), 0);
      return [skill, Number((total / skillTasks.length).toFixed(1))];
    }),
  );
}

function convertToBand(score) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return null;
  }

  return Number(((score / 100) * 9).toFixed(1));
}

function calculateOverallBand(skillPercentages) {
  const skillBands = Object.values(skillPercentages)
    .map((score) => convertToBand(score))
    .filter((score) => typeof score === "number" && !Number.isNaN(score));

  if (!skillBands.length) {
    return null;
  }

  const total = skillBands.reduce((sum, score) => sum + score, 0);
  return Number((total / skillBands.length).toFixed(2));
}

function getScoreClass(score) {
  if (score >= 90) {
    return "score-excellent";
  }

  if (score >= 75) {
    return "score-good";
  }

  if (score >= 50) {
    return "score-medium";
  }

  return "score-low";
}

function createPercentScore(score, isBest = false) {
  const scoreText = typeof score === "number" ? `${score}%` : "-";
  const scoreClass = typeof score === "number" ? getScoreClass(score) : "";
  const progressWidth = typeof score === "number" ? `${Math.max(0, Math.min(score, 100))}%` : "0%";

  return `
    <div class="result-score ${isBest ? "top-skill" : ""}">
      <div class="result-score-line ${scoreClass}">
        <strong>${scoreText}</strong>
      </div>
      <div class="result-progress ${scoreClass}">
        <span style="width: ${progressWidth}"></span>
      </div>
    </div>
  `;
}

function getNormalizedCompletedTasks() {
  return completedTasks.map((task, index) => ({
    ...task,
    __entryId: task.__entryId || `${task.taskId || "task"}-${index}`,
    skill: String(task.skill || mapTaskTypeToSkill(task.type)).toLowerCase(),
  }));
}

function recalculateResults() {
  resultsState.normalizedTasks = getNormalizedCompletedTasks();
  resultsState.skillPercentages = calculateSkillPercentages(resultsState.normalizedTasks);
  resultsState.skillBands = Object.fromEntries(
    Object.entries(resultsState.skillPercentages).map(([skill, score]) => [skill, convertToBand(score)]),
  );
  resultsState.overallBand = calculateOverallBand(resultsState.skillPercentages);
  resultsState.cefrLevel = getCEFRLevel(resultsState.overallBand);
}

function updateBestAndWeak() {
  const { bestSkill, weakSkill } = getStrongestWeakestScores(resultsState.skillPercentages);
  resultsState.bestSkill = bestSkill;
  resultsState.weakSkill = weakSkill;
}

function renderSummaryCards() {
  const summary = document.getElementById("results-summary");
  if (!summary) {
    return;
  }

  const orderedSkills = ["reading", "listening", "writing", "speaking"];

  summary.innerHTML = `
    <div class="results-summary-grid">
      ${orderedSkills
        .map((skill) => {
          const percentage = resultsState.skillPercentages[skill];
          const band = resultsState.skillBands[skill];
          const scoreClass = typeof percentage === "number" ? getScoreClass(percentage) : "";
          const isBest = resultsState.bestSkill && resultsState.bestSkill[0] === skill;
          const isWeak = resultsState.weakSkill && resultsState.weakSkill[0] === skill;

          return `
            <article class="result-summary-card ${scoreClass} ${isBest ? "best-card" : ""} ${isWeak ? "weak-card" : ""}">
              <div class="result-summary-head">
                <span>${formatLabel(skill)}</span>
                ${isBest ? `<span class="task-tag">Best</span>` : isWeak ? `<span class="task-tag">Weak</span>` : ""}
              </div>
              <strong>${typeof percentage === "number" ? `${percentage}%` : "-"}</strong>
              <span>${typeof band === "number" ? band.toFixed(1) : "-"} band</span>
            </article>
          `;
        })
        .join("")}
      <article class="result-summary-card overall-card">
        <div class="result-summary-head">
          <span>Overall</span>
          ${createCEFRBadge(resultsState.cefrLevel)}
        </div>
        <strong>${resultsState.overallBand !== null ? resultsState.overallBand.toFixed(2) : "-"}</strong>
        <span>${completedTasks.length} completed tasks</span>
      </article>
    </div>
  `;
}

function renderTaskTable() {
  const tbody = document.getElementById("results-tbody");
  if (!tbody) {
    return;
  }

  const rows = [...resultsState.normalizedTasks].reverse();

  tbody.innerHTML = rows
    .map((task) => `
      <tr class="${task.__entryId === latestCompletedTaskId ? "new-task" : ""}">
        <td>
          <span class="task-tag ${resultsState.bestSkill && resultsState.bestSkill[0] === task.skill ? "top-tag" : ""}">${formatLabel(task.skill)}</span>
        </td>
        <td>
          <div class="result-task-copy">
            <strong>${escapeHtml(task.title)}</strong>
            <span>${formatLabel(task.type)}</span>
          </div>
        </td>
        <td>${createPercentScore(Number(task.score || 0), resultsState.bestSkill && resultsState.bestSkill[0] === task.skill)}</td>
        <td>${escapeHtml(task.feedback || "-")}</td>
        <td>${createStatusBadge(task.status || "Completed")}</td>
      </tr>
    `)
    .join("");
}

function renderTaskResults() {
  recalculateResults();
  updateBestAndWeak();
  renderSummaryCards();
  renderTaskTable();
}

function addCompletedTask(task) {
  const completedTask = {
    ...task,
    __entryId: task.__entryId || `${task.taskId || "task"}-${Date.now()}`,
  };

  completedTasks.push(completedTask);
  latestCompletedTaskId = completedTask.__entryId;

  recalculateResults();
  updateBestAndWeak();
  renderSummaryCards();
  renderTaskTable();
  renderAssignments();
  renderTasks();

  const resultsSection = document.getElementById("section-results");
  resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    if (latestCompletedTaskId === completedTask.__entryId) {
      latestCompletedTaskId = null;
      renderTaskTable();
    }
  }, 1200);
}

function getTaskCompletionScore(task) {
  const scoreMap = {
    grammar: 85,
    vocabulary: 90,
    listening: 75,
    writing: 78,
    speaking: 82,
  };

  return scoreMap[task.type] ?? 80;
}

function getTaskCompletionFeedback(task, score) {
  if (score >= 90) {
    return `Excellent ${task.type} performance`;
  }

  if (score >= 75) {
    return `Strong ${task.type} progress`;
  }

  if (score >= 50) {
    return `Solid effort, keep improving ${task.type}`;
  }

  return `Needs more practice in ${task.type}`;
}

function buildCompletedTaskFromTask(task) {
  const score = getTaskCompletionScore(task);

  return {
    taskId: task.id,
    title: task.title,
    type: task.type,
    skill: mapTaskTypeToSkill(task.type),
    score,
    feedback: getTaskCompletionFeedback(task, score),
    status: "Completed",
  };
}

function renderTasks() {
  if (!tasksGrid) {
    return;
  }

  tasksGrid.innerHTML = tasks
    .map((task) => {
      const skill = mapTaskTypeToSkill(task.type);
      const status = getTaskStatus(task);
      const progress = Math.max(0, Math.min(Number(task.progress || 0), 100));
      const buttonLabel = status === "Completed" ? "Review Task" : "Start Task";

      return `
        <article class="task-card">
          <div class="task-card-top">
            <div class="task-card-copy">
              <h3>${escapeHtml(task.title)}</h3>
              <p>${escapeHtml(task.description)}</p>
            </div>
            ${createTaskStatusBadge(status)}
          </div>

          <div class="task-card-meta">
            <span class="task-tag">${formatLabel(task.type)}</span>
            <span class="task-tag">${formatLabel(skill)}</span>
            <span class="task-deadline">${escapeHtml(task.deadline)}</span>
          </div>

          <div class="task-progress">
            <div class="task-progress-row">
              <span>${task.questions ? `${task.questions} questions` : "Practice task"}</span>
              <strong>${progress}%</strong>
            </div>
            <div class="result-progress">
              <span style="width: ${progress}%"></span>
            </div>
          </div>

          <button class="lesson-link task-card-button" type="button" data-task-id="${task.id}">
            ${buttonLabel}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderVideoLessons() {
  const container = document.getElementById("video-lessons-list");

  container.innerHTML = videoLessons
    .map(
      (lesson) => `
        <div class="lesson-item">
          <div class="lesson-item-copy">
            <strong>${lesson.title}</strong>
            <span>${lesson.teacher}</span>
            <span>${lesson.note}</span>
          </div>
          <a class="lesson-link" href="${lesson.link}" target="_blank" rel="noreferrer">Video darsni ochish</a>
        </div>`,
    )
    .join("");
}

function renderAssignments() {
  const container = document.getElementById("assignment-list");
  const summaryTasks = tasks.slice(0, 3);

  container.innerHTML = summaryTasks
    .map(
      (task) => `
        <div class="task-item">
          <div class="task-item-copy">
            <strong>${task.title}</strong>
            <span>${task.description}</span>
            <div class="task-meta">
              <span class="task-tag">${formatLabel(task.type)}</span>
              <span>${task.deadline}</span>
            </div>
          </div>
          <a class="task-link" href="#" data-open-section="assignments">Vazifaga o'tish</a>
        </div>`,
    )
    .join("");

  document.getElementById("stat-assignment-count").textContent = String(tasks.length);
  document.getElementById("stat-backlog-count").textContent = String(
    tasks.filter((task) => getTaskStatus(task) !== "Completed").length,
  );
}

function renderBacklog() {
  backlogList.innerHTML = backlogRows
    .map(
      (task) => `
        <div class="task-item">
          <div class="task-item-copy">
            <strong>${task.title}</strong>
            <span>${task.detail}</span>
          </div>
          <span class="task-tag">${task.status}</span>
        </div>`,
    )
    .join("");
}

function renderBooks(payload) {
  if (!libraryGrid) {
    return;
  }

  const books = Array.isArray(payload?.data) ? payload.data : [];
  const searchValue = (librarySearch?.value || "").trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      activeLibraryCategory === "All" ? true : normalizeBookLevel(book.level) === activeLibraryCategory;
    const matchesSearch = (book.title || "").toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  if (!filteredBooks.length) {
    libraryGrid.innerHTML = `
      <div class="library-empty">
        Hech qanday kitob topilmadi. Boshqa nom yoki kategoriya bilan qayta urinib ko'ring.
      </div>
    `;
    return;
  }

  libraryGrid.innerHTML = filteredBooks
    .map(
      (book) => `
        <article class="panel library-card">
          <img class="library-card-cover" src="${escapeHtml(resolveBookImage(book.image))}" alt="${escapeHtml(book.title)} cover" />
          <div class="library-card-body">
            <div class="library-card-copy">
              <h3>${escapeHtml(book.title)}</h3>
              <p>${escapeHtml(book.author)}</p>
            </div>

            <div class="library-card-meta">
              <span class="library-badge">${escapeHtml(book.level)}</span>
              <span class="library-badge">PDF</span>
            </div>

            <div class="library-card-actions">
              <button class="lesson-link library-action" type="button" data-library-read="${escapeHtml(book.pdf)}">
                Read
              </button>
              <a class="task-link library-action" href="${escapeHtml(resolveBookPdf(book.pdf))}" download>
                Download
              </a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

async function loadBooks() {
  if (!libraryGrid) {
    return;
  }

  libraryGrid.innerHTML = `
    <div class="library-empty">
      Kitoblar yuklanmoqda...
    </div>
  `;

  try {
    const res = await fetch(`${BASE_URL}/api/books`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load books.");
    }

    renderBooks(data);
  } catch (error) {
    libraryGrid.innerHTML = `
      <div class="library-empty">
        Kutubxona backend bilan ulanmagan.
      </div>
    `;
  }
}

function setLibraryCategory(category) {
  activeLibraryCategory = category;

  libraryFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.libraryFilter === category);
  });

  loadBooks();
}

function setBacklogExpanded(expanded) {
  backlogExpanded = expanded;
  backlogList.classList.toggle("collapsed", !expanded);
  toggleBacklogBtn.textContent = expanded ? "Yopish" : "Hammasini ko'rish";
}

function scrollToPanel(id, expandBacklog = false) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  if (expandBacklog) {
    setBacklogExpanded(true);
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
}

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
}

function showSection(name) {
  sections.forEach((section) => section.classList.remove("active"));
  navLinks.forEach((link) => link.classList.remove("active"));

  const target = document.getElementById(`section-${name}`);
  if (target) {
    target.classList.add("active");
  }

  const activeLink = document.querySelector(`.nav-link[data-section="${name}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }

  if (headerTitle && sectionLabels[name]) {
    headerTitle.textContent = sectionLabels[name];
  }

  if (name === "library") {
    loadBooks();
  }

  closeSidebar();
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.section);
  });
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-section]");
  if (!trigger) {
    return;
  }

  event.preventDefault();
  showSection(trigger.dataset.openSection);
});

metricCards.forEach((card) => {
  card.addEventListener("click", () => {
    const target = card.dataset.target;
    const shouldExpandBacklog = card.dataset.expandBacklog === "true";
    scrollToPanel(target, shouldExpandBacklog);
  });
});

toggleBacklogBtn.addEventListener("click", () => {
  setBacklogExpanded(!backlogExpanded);
});

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);
themeToggle.addEventListener("click", toggleTheme);
goAssignmentsBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  showSection("assignments");
});

if (librarySearch) {
  librarySearch.addEventListener("input", loadBooks);
}

libraryFilters.forEach((button) => {
  button.addEventListener("click", () => {
    setLibraryCategory(button.dataset.libraryFilter || "All");
  });
});

libraryGrid?.addEventListener("click", (event) => {
  const readButton = event.target.closest("[data-library-read]");
  if (!readButton) {
    return;
  }

  const pdfPath = readButton.dataset.libraryRead;
  if (!pdfPath) {
    return;
  }

  window.open(`${BASE_URL}/${pdfPath}`, "_blank", "noopener");
});

tasksGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-id]");
  if (!button) {
    return;
  }

  const task = tasks.find((item) => Number(item.id) === Number(button.dataset.taskId));
  if (!task) {
    return;
  }

  if (!getTaskResult(task.id)) {
    task.progress = 100;
    addCompletedTask(buildCompletedTaskFromTask(task));
  }

  showSection("results");
});

renderVideoLessons();
renderAssignments();
renderBacklog();
renderTasks();
setBacklogExpanded(false);
applyTheme(localStorage.getItem(THEME_KEY) || "light");
renderTaskResults();

showSection("dashboard");
