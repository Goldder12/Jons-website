const BASE_URL = "http://localhost:5500";

const sectionLabels = {
  dashboard: "Dashboard",
  assignments: "Assignments",
  results: "Results",
  videos: "Video Lessons",
  listening: "Listening",
  library: "Library",
};

const defaultTasks = [
  {
    id: 1,
    title: "Present Simple Quiz",
    description: "Choose the correct tense form in 10 multiple-choice grammar questions.",
    level: "A1",
    type: "grammar",
    questions: 10,
    deadline: "Deadline: 30 Apr",
    status: "completed",
    startedAt: null,
    progress: 100,
    resultScore: 85,
    resultFeedback: "Good grammar usage",
  },
  {
    id: 2,
    title: "Word Matching",
    description: "Match new academic words with their meanings in a Duolingo-style exercise.",
    level: "A2",
    type: "vocabulary",
    questions: 12,
    deadline: "Deadline: 1 May",
    status: "completed",
    startedAt: null,
    progress: 100,
    resultScore: 90,
    resultFeedback: "Strong vocabulary",
  },
  {
    id: 3,
    title: "Listening Section 1",
    description: "Listen to the short conversation and answer the follow-up questions.",
    level: "B1",
    type: "listening",
    questions: 8,
    deadline: "Deadline: 2 May",
    status: "in_progress",
    startedAt: Date.now() - (60 * 60 * 1000),
    progress: 52,
  },
  {
    id: 4,
    title: "Task 2 Essay Draft",
    description: "Write a short opinion essay using the feedback from your last mock test.",
    level: "B2",
    type: "writing",
    questions: 1,
    deadline: "Deadline: 3 May",
    status: "not_started",
    startedAt: null,
    progress: 0,
  },
  {
    id: 5,
    title: "Speaking Part 2",
    description: "Record a two-minute answer and practice fluency around one cue-card topic.",
    level: "C1",
    type: "speaking",
    questions: 1,
    deadline: "Deadline: 4 May",
    status: "completed",
    startedAt: null,
    progress: 100,
    resultScore: 78,
    resultFeedback: "Fluency is improving steadily",
  },
  {
    id: 6,
    title: "Daily Reading Builder",
    description: "Complete a short passage and identify main ideas, headings, and keywords.",
    level: "C2",
    type: "vocabulary",
    questions: 6,
    deadline: "Deadline: 5 May",
    status: "not_started",
    startedAt: null,
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
const videoLessonsList = document.getElementById("video-lessons-list");
const studentVideoGrid = document.getElementById("student-video-grid");
const videoPlayerOverlay = document.getElementById("videoPlayerOverlay");
const videoPlayer = document.getElementById("videoPlayer");
const videoPlayerClose = document.getElementById("videoPlayerClose");
const videoPlayerTitle = document.getElementById("videoPlayerTitle");
const studentListeningGrid = document.getElementById("student-listening-grid");
const listeningWorkspacePanel = document.getElementById("listeningWorkspacePanel");
const listeningWorkspaceTitle = document.getElementById("listeningWorkspaceTitle");
const listeningWorkspaceSubtitle = document.getElementById("listeningWorkspaceSubtitle");
const listeningStatusChip = document.getElementById("listeningStatusChip");
const listeningTimerChip = document.getElementById("listeningTimerChip");
const listeningAudioPlayer = document.getElementById("listeningAudioPlayer");
const listeningAudioMessage = document.getElementById("listeningAudioMessage");
const listeningMediaActions = document.getElementById("listeningMediaActions");
const listeningAudioTimeline = document.getElementById("listeningAudioTimeline");
const listeningLockBanner = document.getElementById("listeningLockBanner");
const listeningSections = document.getElementById("listeningSections");
const listeningAnswerForm = document.getElementById("listeningAnswerForm");
const closeListeningTaskBtn = document.getElementById("closeListeningTaskBtn");
const submitListeningAnswersBtn = document.getElementById("submitListeningAnswersBtn");
const cefrCards = document.querySelectorAll(".cefr-card");
const levelContentGrid = document.getElementById("level-content");
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const THEME_KEY = "edu-dashboard-theme";
const ACTIVE_SECTION_KEY = "student-active-section";
const SELECTED_LEVEL_KEY = "student-selected-level";
const TASKS_STORAGE_KEY = "student-tasks";
const LISTENING_SUBMISSIONS_KEY = "student-listening-submissions";
const TASK_SESSION_LIMIT = 3 * 60 * 60 * 1000;
const LISTENING_TIMER_SECONDS = 30 * 60;
const toastContainer = document.getElementById("toast-container");

function removeToast(toast) {
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 300);
}

function showToast(message, type = "info") {
  if (!toastContainer) {
    return;
  }

  const icons = {
    success: "&#10003;",
    error: "&#10005;",
    info: "&#9432;",
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-body">
      <span class="toast-title">${icons[type] || icons.info} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
      <span class="toast-message">${message}</span>
    </div>
    <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
    <span class="toast-progress"></span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);

  const closeButton = toast.querySelector(".toast-close");
  closeButton.onclick = () => removeToast(toast);

  let autoRemove = setTimeout(() => removeToast(toast), 4000);

  toast.addEventListener("mouseenter", () => {
    clearTimeout(autoRemove);
  });

  toast.addEventListener("mouseleave", () => {
    autoRemove = setTimeout(() => removeToast(toast), 4000);
  });
}

window.alert = function (message) {
  showToast(String(message ?? ""), "info");
};

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
let selectedCefrLevel = localStorage.getItem(SELECTED_LEVEL_KEY) || "A1";
let videosState = [];
let listeningTasksState = [];
let tasks = [];
let completedTasks = [];
let listeningSubmissions = {};
const listeningState = {
  activeTaskId: null,
  answers: {},
  audioReady: false,
  audioPlayedOnce: false,
  audioFailed: false,
  timerSeconds: LISTENING_TIMER_SECONDS,
  timerId: null,
  strictMode: true,
};
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

function resolveVideoUrl(url) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http") || url.startsWith("blob:")) {
    return url;
  }

  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
}

function resolveListeningAsset(path) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function loadListeningSubmissions() {
  const saved = localStorage.getItem(LISTENING_SUBMISSIONS_KEY);
  if (!saved) {
    return {};
  }

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveListeningSubmissions() {
  localStorage.setItem(LISTENING_SUBMISSIONS_KEY, JSON.stringify(listeningSubmissions));
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

function cloneTask(task) {
  return {
    ...task,
    status: task.status || "not_started",
    startedAt: task.startedAt ?? null,
    progress: Number(task.progress || 0),
    resultScore: task.resultScore ?? null,
    resultFeedback: task.resultFeedback || "",
  };
}

function saveTasksState() {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksState() {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!savedTasks) {
    return defaultTasks.map(cloneTask);
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return defaultTasks.map(cloneTask);
    }

    return defaultTasks.map((task) => {
      const persistedTask = parsedTasks.find((item) => Number(item.id) === Number(task.id));
      return cloneTask({ ...task, ...persistedTask });
    });
  } catch (error) {
    return defaultTasks.map(cloneTask);
  }
}

function formatLabel(value) {
  const text = String(value || "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getSelectedLevel() {
  return CEFR_LEVELS.includes(selectedCefrLevel) ? selectedCefrLevel : "A1";
}

function matchesLevel(item, level = getSelectedLevel()) {
  return !item?.level || item.level === level;
}

function getVisibleTasks() {
  return tasks.filter((task) => matchesLevel(task));
}

function getVisibleVideos() {
  return videosState.filter((video) => matchesLevel(video));
}

function getVisibleListeningTasks() {
  return listeningTasksState.filter((task) => matchesLevel(task));
}

function updateCefrCardState() {
  const activeLevel = getSelectedLevel();

  cefrCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.level === activeLevel);
  });
}

function getLevelContentItems(level = getSelectedLevel()) {
  const taskItems = tasks
    .filter((task) => matchesLevel(task, level))
    .map((task) => ({
      id: task.id,
      kind: "task",
      title: task.title,
      description: task.description,
      level: task.level,
      meta: `${formatLabel(task.type)} • ${task.deadline}`,
      buttonLabel:
        task.status === "completed"
          ? "Show Result"
          : getTaskState(task) === "continue"
            ? "Continue Task"
            : "Start Task",
    }));

  const videoItems = videosState
    .filter((video) => matchesLevel(video, level))
    .map((video) => ({
      id: video.id,
      kind: "video",
      title: video.title,
      description: video.description,
      level: video.level,
      meta: `${video.author} • ${video.type === "upload" ? "Upload" : "Link"}`,
      buttonLabel: "Open Video",
    }));

  const listeningItems = listeningTasksState
    .filter((task) => matchesLevel(task, level))
    .map((task) => {
      const firstSection = task.sections?.[0];
      return {
        id: task.id,
        kind: "listening",
        title: task.title,
        description: firstSection?.instructions || "Listen carefully and complete the answer sheet.",
        level: task.level,
        meta: `${firstSection?.title || "IELTS Listening"} • ${task.answers?.length || firstSection?.questions?.length || 0} questions`,
        buttonLabel: "Open Listening",
      };
    });

  return [...taskItems, ...videoItems, ...listeningItems];
}

function renderLevelContent(level = getSelectedLevel()) {
  if (!levelContentGrid) {
    return;
  }

  const items = getLevelContentItems(level);

  if (!items.length) {
    levelContentGrid.innerHTML = `
      <div class="level-empty">
        No tasks or lessons are available for ${escapeHtml(level)} yet.
      </div>
    `;
    return;
  }

  levelContentGrid.innerHTML = items
    .map(
      (item) => `
        <article class="level-content-card">
          <div class="level-content-meta">
            <span class="task-tag">${escapeHtml(item.level || level)}</span>
            <span class="task-tag">${escapeHtml(formatLabel(item.kind))}</span>
          </div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description || "No description available.")}</p>
          <div class="level-content-meta">
            <span>${escapeHtml(item.meta || "")}</span>
          </div>
          <button class="lesson-link" type="button" data-level-item="${item.kind}" data-level-id="${item.id}">
            ${escapeHtml(item.buttonLabel)}
          </button>
        </article>
      `,
    )
    .join("");
}

function showLevelContent(level) {
  const nextLevel = CEFR_LEVELS.includes(level) ? level : "A1";
  selectedCefrLevel = nextLevel;
  localStorage.setItem(SELECTED_LEVEL_KEY, nextLevel);
  updateCefrCardState();
  renderLevelContent(nextLevel);
  renderAssignments();
  renderTasks();
  renderVideoLessons();
  renderVideoLessonCards();
  renderListeningTaskCards();
}

function getTaskState(task) {
  if (task.status === "completed") {
    return "completed";
  }

  if (task.status === "in_progress") {
    const diff = Date.now() - Number(task.startedAt || 0);

    if (diff <= TASK_SESSION_LIMIT) {
      return "continue";
    }

    return "reset";
  }

  return "start";
}

function getTaskResult(taskId) {
  return completedTasks.find((item) => Number(item.taskId) === Number(taskId)) || null;
}

function getTaskStatus(task) {
  if (task.status === "completed") {
    return "Completed";
  }

  if (task.status === "in_progress") {
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

function renderTaskCards() {
  const container = document.getElementById("results-cards");
  if (!container) {
    return;
  }

  const rows = [...resultsState.normalizedTasks].reverse();

  container.innerHTML = rows
    .map((task) => `
      <article class="result-mobile-card ${task.__entryId === latestCompletedTaskId ? "new-task" : ""}">
        <div class="result-mobile-content">
          <div class="result-mobile-row">
            <span class="result-mobile-label">Skill</span>
            <span class="task-tag ${resultsState.bestSkill && resultsState.bestSkill[0] === task.skill ? "top-tag" : ""}">${formatLabel(task.skill)}</span>
          </div>
          <div class="result-mobile-row">
            <span class="result-mobile-label">Task</span>
            <div class="result-task-copy">
              <strong>${escapeHtml(task.title)}</strong>
              <span>${formatLabel(task.type)}</span>
            </div>
          </div>
          <div class="result-mobile-row">
            <span class="result-mobile-label">Score</span>
            <div class="result-mobile-score">
              ${createPercentScore(Number(task.score || 0), resultsState.bestSkill && resultsState.bestSkill[0] === task.skill)}
            </div>
          </div>
          <div class="result-mobile-row">
            <span class="result-mobile-label">Feedback</span>
            <span class="result-mobile-text">${escapeHtml(task.feedback || "-")}</span>
          </div>
          <div class="result-mobile-row">
            <span class="result-mobile-label">Status</span>
            ${createStatusBadge(task.status || "Completed")}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderTaskResults() {
  recalculateResults();
  updateBestAndWeak();
  renderSummaryCards();
  renderTaskTable();
  renderTaskCards();
}

function buildCompletedTaskFromTask(task) {
  const score = Number(task.resultScore ?? getTaskCompletionScore(task));
  const feedback = task.resultFeedback || getTaskCompletionFeedback(task, score);

  return {
    taskId: task.id,
    title: task.title,
    type: task.type,
    skill: mapTaskTypeToSkill(task.type),
    score,
    feedback,
    status: "Completed",
  };
}

function syncCompletedTasksFromTasks() {
  completedTasks = tasks
    .filter((task) => task.status === "completed")
    .map((task) => buildCompletedTaskFromTask(task));
}

function resetTask(taskId, options = {}) {
  const task = tasks.find((item) => Number(item.id) === Number(taskId));
  if (!task) {
    return null;
  }

  task.status = "not_started";
  task.startedAt = null;
  task.progress = 0;

  if (!options.keepResult) {
    task.resultScore = null;
    task.resultFeedback = "";
  }

  if (!options.skipPersist) {
    saveTasksState();
  }

  return task;
}

function startTask(taskId) {
  const task = tasks.find((item) => Number(item.id) === Number(taskId));
  if (!task) {
    return;
  }

  task.status = "in_progress";
  task.startedAt = Date.now();
  task.progress = Math.max(Number(task.progress || 0), 18);

  saveTasksState();
  syncCompletedTasksFromTasks();
  renderAssignments();
  renderTasks();
  renderLevelContent();
  renderTaskResults();
}

function continueTask(taskId) {
  const task = tasks.find((item) => Number(item.id) === Number(taskId));
  if (!task) {
    return;
  }

  const nextState = getTaskState(task);

  if (nextState === "reset") {
    resetTask(taskId);
    syncCompletedTasksFromTasks();
    renderAssignments();
    renderTasks();
    renderLevelContent();
    renderTaskResults();
    return;
  }

  task.status = "in_progress";
  task.startedAt = Date.now();
  task.progress = Math.min(100, Math.max(Number(task.progress || 0), 30) + 38);

  if (task.progress >= 100) {
    completeTask(taskId);
    return;
  }

  saveTasksState();
  syncCompletedTasksFromTasks();
  renderAssignments();
  renderTasks();
  renderLevelContent();
  renderTaskResults();
}

function completeTask(taskId) {
  const task = tasks.find((item) => Number(item.id) === Number(taskId));
  if (!task) {
    return;
  }

  task.status = "completed";
  task.startedAt = null;
  task.progress = 100;
  task.resultScore = getTaskCompletionScore(task);
  task.resultFeedback = getTaskCompletionFeedback(task, task.resultScore);

  saveTasksState();
  syncCompletedTasksFromTasks();
  addCompletedTask(buildCompletedTaskFromTask(task));
}

function normalizeTaskStates() {
  let didResetExpiredTask = false;

  tasks.forEach((task) => {
    if (getTaskState(task) === "reset") {
      resetTask(task.id, { skipPersist: true });
      didResetExpiredTask = true;
    }
  });

  if (didResetExpiredTask) {
    saveTasksState();
  }

  syncCompletedTasksFromTasks();
}

function addCompletedTask(task) {
  const completedTask = {
    ...task,
    __entryId: task.__entryId || `${task.taskId || "task"}-${Date.now()}`,
  };

  completedTasks = completedTasks.filter((item) => Number(item.taskId) !== Number(completedTask.taskId));
  completedTasks.push(completedTask);
  latestCompletedTaskId = completedTask.__entryId;

  recalculateResults();
  updateBestAndWeak();
  renderSummaryCards();
  renderTaskTable();
  renderTaskCards();
  renderAssignments();
  renderTasks();
  renderLevelContent();

  const resultsSection = document.getElementById("section-results");
  resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    if (latestCompletedTaskId === completedTask.__entryId) {
      latestCompletedTaskId = null;
      renderTaskTable();
      renderTaskCards();
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

function createTaskAction(task, state) {
  if (state === "completed") {
    return `
      <div class="task-card-actions">
        <span class="completed-badge">&#10003; Completed</span>
        <button class="task-action btn-result" type="button" data-task-action="result" data-task-id="${task.id}">
          Show Result
        </button>
      </div>
    `;
  }

  if (state === "continue") {
    return `
      <div class="task-card-actions">
        <button class="task-action btn-continue" type="button" data-task-action="continue" data-task-id="${task.id}">
          Continue
        </button>
      </div>
    `;
  }

  return `
    <div class="task-card-actions">
      <button class="task-action btn-start" type="button" data-task-action="start" data-task-id="${task.id}">
        Start
      </button>
    </div>
  `;
}

function renderTasks() {
  if (!tasksGrid) {
    return;
  }

  normalizeTaskStates();
  const visibleTasks = getVisibleTasks();

  if (!visibleTasks.length) {
    tasksGrid.innerHTML = `<div class="video-empty">No tasks for ${escapeHtml(getSelectedLevel())} yet.</div>`;
    return;
  }

  tasksGrid.innerHTML = visibleTasks
    .map((task) => {
      const skill = mapTaskTypeToSkill(task.type);
      let state = getTaskState(task);
      const status = getTaskStatus(task);
      const progress = Math.max(0, Math.min(Number(task.progress || 0), 100));
      const isActive = state === "continue";

      if (state === "reset") {
        resetTask(task.id);
        state = "start";
      }

      return `
        <article class="task-card ${isActive ? "is-active-task" : ""}" data-task-card="${task.id}">
          <div class="task-card-top">
            <div class="task-card-copy">
              <h3>${escapeHtml(task.title)}</h3>
              <p>${escapeHtml(task.description)}</p>
            </div>
            ${createTaskAction(task, state)}
          </div>

          <div class="task-card-meta">
            <span class="task-tag">${escapeHtml(task.level || getSelectedLevel())}</span>
            <span class="task-tag">${formatLabel(task.type)}</span>
            <span class="task-tag">${formatLabel(skill)}</span>
            <span class="task-tag">${status}</span>
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
        </article>
      `;
    })
    .join("");
}

function getVideoTask(taskId) {
  if (!taskId) {
    return null;
  }

  return tasks.find((task) => Number(task.id) === Number(taskId)) || null;
}

function openVideoPlayer(video) {
  if (!videoPlayer || !videoPlayerOverlay) {
    return;
  }

  videoPlayer.pause();
  videoPlayer.src = resolveVideoUrl(video.url);
  videoPlayer.load();
  videoPlayerTitle.textContent = video.title || "Video Lesson";
  videoPlayerOverlay.classList.add("open");
}

function closeVideoPlayer() {
  if (!videoPlayer || !videoPlayerOverlay) {
    return;
  }

  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  videoPlayerOverlay.classList.remove("open");
}

function openVideoLesson(videoId) {
  const lesson = videosState.find((video) => Number(video.id) === Number(videoId));
  if (!lesson) {
    return;
  }

  if (lesson.type === "link") {
    window.open(lesson.url, "_blank", "noopener");
    return;
  }

  openVideoPlayer(lesson);
}

function renderVideoLessons() {
  if (!videoLessonsList) {
    return;
  }

  const lessons = getVisibleVideos();
  document.getElementById("stat-video-count").textContent = String(lessons.length);

  if (!lessons.length) {
    videoLessonsList.innerHTML = `
      <div class="lesson-item">
        <div class="lesson-item-copy">
          <strong>No video lessons for ${escapeHtml(getSelectedLevel())}</strong>
          <span>Your teacher has not uploaded a lesson for this CEFR level yet.</span>
        </div>
      </div>
    `;
    return;
  }

  videoLessonsList.innerHTML = lessons
    .slice(0, 4)
    .map((lesson) => {
      const linkedTask = getVideoTask(lesson.taskId);
      const isLinkedTaskVisible = linkedTask && matchesLevel(linkedTask);

      return `
        <div class="lesson-item">
          <div class="lesson-item-copy">
            <strong>${escapeHtml(lesson.title)}</strong>
            <span>${escapeHtml(lesson.author)}</span>
            <span>${escapeHtml(lesson.description)}</span>
          </div>
          <div class="lesson-item-actions">
            <button class="lesson-link" type="button" data-video-open="${lesson.id}">Video darsni ochish</button>
            ${isLinkedTaskVisible ? `<button class="task-link" type="button" data-video-task="${linkedTask.id}">Start Task</button>` : ""}
          </div>
        </div>`;
    })
    .join("");
}

function renderVideoLessonCards() {
  if (!studentVideoGrid) {
    return;
  }

  const lessons = getVisibleVideos();

  if (!lessons.length) {
    studentVideoGrid.innerHTML = `<div class="video-empty">No video lessons for ${escapeHtml(getSelectedLevel())} right now.</div>`;
    return;
  }

  studentVideoGrid.innerHTML = lessons
    .map((lesson) => {
      const linkedTask = getVideoTask(lesson.taskId);
      const isLinkedTaskVisible = linkedTask && matchesLevel(linkedTask);

      return `
        <article class="student-video-card">
          <div class="student-video-card-body">
            <div class="student-video-card-copy">
              <div class="student-video-card-badges">
                <span class="task-tag">${escapeHtml(lesson.level || getSelectedLevel())}</span>
                <span class="task-tag">${lesson.type === "upload" ? "Upload" : "Link"}</span>
                ${isLinkedTaskVisible ? `<span class="task-tag">Task available</span>` : ""}
              </div>
              <h3>${escapeHtml(lesson.title)}</h3>
              <p class="student-video-author">${escapeHtml(lesson.author)}</p>
              <p class="student-video-description">${escapeHtml(lesson.description)}</p>
            </div>

            <div class="student-video-actions">
              <button class="lesson-link" type="button" data-video-open="${lesson.id}">Video darsni ochish</button>
              ${isLinkedTaskVisible ? `<button class="task-link" type="button" data-video-task="${linkedTask.id}">Start Task</button>` : ""}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadVideos() {
  if (videoLessonsList) {
    videoLessonsList.innerHTML = `
      <div class="lesson-item">
        <div class="lesson-item-copy">
          <strong>Loading lessons...</strong>
          <span>Please wait while we fetch your videos.</span>
        </div>
      </div>
    `;
  }

  if (studentVideoGrid) {
    studentVideoGrid.innerHTML = `<div class="video-empty">Loading video lessons...</div>`;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/videos`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load videos.");
    }

    videosState = Array.isArray(data.data) ? data.data : [];
    renderVideoLessons();
    renderVideoLessonCards();
    renderLevelContent();
  } catch (error) {
    videosState = [];

    if (videoLessonsList) {
      videoLessonsList.innerHTML = `
        <div class="lesson-item">
          <div class="lesson-item-copy">
            <strong>Video backend is not available</strong>
            <span>Try again after the server starts.</span>
          </div>
        </div>
      `;
    }

    if (studentVideoGrid) {
      studentVideoGrid.innerHTML = `<div class="video-empty">Video backend is not available right now.</div>`;
    }

    document.getElementById("stat-video-count").textContent = "0";
  }
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function resetListeningTimer() {
  if (listeningState.timerId) {
    window.clearInterval(listeningState.timerId);
    listeningState.timerId = null;
  }

  listeningState.timerSeconds = LISTENING_TIMER_SECONDS;
  if (listeningTimerChip) {
    listeningTimerChip.textContent = formatTimer(listeningState.timerSeconds);
  }
}

function startListeningTimer() {
  if (listeningState.timerId) {
    return;
  }

  listeningState.timerId = window.setInterval(() => {
    listeningState.timerSeconds = Math.max(0, listeningState.timerSeconds - 1);

    if (listeningTimerChip) {
      listeningTimerChip.textContent = formatTimer(listeningState.timerSeconds);
    }

    if (listeningState.timerSeconds === 0) {
      window.clearInterval(listeningState.timerId);
      listeningState.timerId = null;
      showToast("Listening time is over. Please submit your answers.", "info");
    }
  }, 1000);
}

function getListeningTaskById(taskId) {
  return listeningTasksState.find((task) => Number(task.id) === Number(taskId)) || null;
}

function getListeningTaskSubmission(taskId) {
  return listeningSubmissions[String(taskId)] || null;
}

function getListeningTaskStatus(taskId) {
  const submission = getListeningTaskSubmission(taskId);
  if (submission?.submittedAt) {
    return "Submitted";
  }

  if (listeningState.activeTaskId === Number(taskId)) {
    return "In Progress";
  }

  return "Ready";
}

function isListeningUnlocked() {
  if (!listeningState.audioReady || listeningState.audioFailed) {
    return false;
  }

  return listeningState.strictMode ? listeningState.audioPlayedOnce : true;
}

function updateListeningTimeline() {
  if (!listeningAudioTimeline || !listeningAudioPlayer) {
    return;
  }

  const duration = Number(listeningAudioPlayer.duration || 0);
  const currentTime = Number(listeningAudioPlayer.currentTime || 0);
  const width = duration ? `${(currentTime / duration) * 100}%` : "0%";
  listeningAudioTimeline.style.width = width;
}

function updateListeningLockState() {
  const activeTask = getListeningTaskById(listeningState.activeTaskId);
  const unlocked = isListeningUnlocked();
  const hasAudio = Boolean(activeTask?.audio);
  const inputs = listeningSections?.querySelectorAll("input[data-listening-answer], input[data-question]") || [];

  inputs.forEach((input) => {
    input.disabled = !unlocked;
  });

  if (submitListeningAnswersBtn) {
    submitListeningAnswersBtn.disabled = !unlocked || !hasAudio;
  }

  if (!activeTask) {
    return;
  }

  if (!hasAudio) {
    listeningStatusChip.textContent = "No audio";
    listeningAudioMessage.textContent = "No audio available";
    listeningLockBanner.textContent = "This listening task has no playable audio, so answering is disabled.";
    listeningLockBanner.classList.remove("field-hidden");
    return;
  }

  if (listeningState.audioFailed) {
    listeningStatusChip.textContent = "Audio failed";
    listeningAudioMessage.textContent = "No audio available";
    listeningLockBanner.textContent = "Audio failed to load. Please try again later.";
    listeningLockBanner.classList.remove("field-hidden");
    return;
  }

  if (!listeningState.audioReady) {
    listeningStatusChip.textContent = "Loading audio";
    listeningAudioMessage.textContent = "Audio is loading...";
    listeningLockBanner.textContent = "Please wait for the audio to load.";
    listeningLockBanner.classList.remove("field-hidden");
    return;
  }

  if (!listeningState.audioPlayedOnce && listeningState.strictMode) {
    listeningStatusChip.textContent = "Listen first";
    listeningAudioMessage.textContent = "Press play once to unlock the answer sheet.";
    listeningLockBanner.textContent = "Please play the IELTS audio once before answering.";
    listeningLockBanner.classList.remove("field-hidden");
    return;
  }

  listeningStatusChip.textContent = "Listening started";
  listeningAudioMessage.textContent = "Audio is ready. You can answer now.";
  listeningLockBanner.classList.add("field-hidden");
}

function renderListeningWorkspace() {
  const activeTask = getListeningTaskById(listeningState.activeTaskId);

  if (!activeTask || !listeningWorkspacePanel || !listeningSections) {
    return;
  }

  const firstSection = activeTask.sections?.[0];
  listeningWorkspacePanel.classList.remove("field-hidden");
  listeningWorkspaceTitle.textContent = activeTask.title || "Listening Task";
  listeningWorkspaceSubtitle.textContent = firstSection?.instructions || "Complete every answer while the audio is playing.";
  listeningMediaActions.innerHTML = activeTask.video
    ? `<button class="lesson-link" type="button" id="openListeningVideoBtn">Open Support Video</button>`
    : "";

  if (activeTask.content) {
    listeningSections.innerHTML = `
      <article class="listening-section-card">
        <div class="listening-section-head">
          <div>
            <h3>${escapeHtml(activeTask.title || "Listening Task")}</h3>
            <p>${escapeHtml(firstSection?.instructions || "OCR may contain mistakes. Complete every answer carefully.")}</p>
          </div>
          <span class="task-tag">Form</span>
        </div>
        <div class="listening-content-block listening-generated-html">${activeTask.content}</div>
      </article>
    `;

    listeningSections.querySelectorAll("[data-question]").forEach((input) => {
      const answerKey = String(input.dataset.question);
      input.value = listeningState.answers[answerKey] || "";
      input.placeholder = "Type your answer";
    });
  } else {
    listeningSections.innerHTML = (activeTask.sections || [])
      .map((section, sectionIndex) => `
      <article class="listening-section-card">
        <div class="listening-section-head">
          <div>
            <h3>${escapeHtml(section.title || `Part ${sectionIndex + 1}`)}</h3>
            <p>${escapeHtml(section.instructions || "")}</p>
          </div>
          <span class="task-tag">${escapeHtml(formatLabel(section.type || "form"))}</span>
        </div>

        ${section.type === "image"
          ? `<div class="listening-content-image-wrap">
              <img class="listening-content-image" src="${escapeHtml(resolveListeningAsset(section.content))}" alt="${escapeHtml(section.title || "Listening worksheet")}" />
            </div>`
          : `<div class="listening-content-block">${escapeHtml(section.content || "").replace(/\n/g, "<br />")}</div>`}

        <div class="listening-question-list">
          ${(section.questions || [])
            .map((question) => {
              const answerKey = String(question.id);
              const currentValue = listeningState.answers[answerKey] || "";

              return `
                <label class="listening-question-item">
                  <span>Question ${question.id}</span>
                  <input
                    type="text"
                    data-listening-answer="${question.id}"
                    value="${escapeHtml(currentValue)}"
                    placeholder="Type your answer"
                  />
                </label>
              `;
            })
            .join("")}
        </div>
      </article>
    `)
      .join("");
  }

  document.getElementById("openListeningVideoBtn")?.addEventListener("click", () => {
    const task = getListeningTaskById(listeningState.activeTaskId);
    if (!task?.video) {
      return;
    }

    if (task.video.startsWith("http")) {
      window.open(task.video, "_blank", "noopener");
      return;
    }

    openVideoPlayer({
      title: `${task.title} Support Video`,
      url: task.video,
    });
  });

  updateListeningLockState();
}

function closeListeningTask() {
  listeningState.activeTaskId = null;
  listeningState.answers = {};
  listeningState.audioReady = false;
  listeningState.audioPlayedOnce = false;
  listeningState.audioFailed = false;

  resetListeningTimer();

  if (listeningAudioPlayer) {
    listeningAudioPlayer.pause();
    listeningAudioPlayer.removeAttribute("src");
    listeningAudioPlayer.load();
  }

  if (listeningAudioTimeline) {
    listeningAudioTimeline.style.width = "0%";
  }

  if (listeningWorkspacePanel) {
    listeningWorkspacePanel.classList.add("field-hidden");
  }
}

function openListeningTask(taskId) {
  const task = getListeningTaskById(taskId);
  if (!task) {
    return;
  }

  listeningState.activeTaskId = Number(task.id);
  listeningState.answers = { ...(getListeningTaskSubmission(task.id)?.answers || {}) };
  listeningState.audioReady = false;
  listeningState.audioPlayedOnce = false;
  listeningState.audioFailed = false;

  resetListeningTimer();
  renderListeningWorkspace();
  showSection("listening");

  if (!task.audio) {
    updateListeningLockState();
    showToast("No audio available", "error");
    return;
  }

  listeningAudioPlayer.pause();
  listeningAudioPlayer.src = resolveListeningAsset(task.audio);
  listeningAudioPlayer.load();
  updateListeningLockState();
}

function renderListeningTaskCards() {
  if (!studentListeningGrid) {
    return;
  }

  const items = getVisibleListeningTasks();

  if (!items.length) {
    studentListeningGrid.innerHTML = `<div class="video-empty">No listening tasks for ${escapeHtml(getSelectedLevel())} yet.</div>`;
    return;
  }

  studentListeningGrid.innerHTML = items
    .map((task) => {
      const firstSection = task.sections?.[0];
      const answerCount = task.answers?.length || firstSection?.questions?.length || 0;
      const status = getListeningTaskStatus(task.id);

      return `
        <article class="student-video-card">
          <div class="student-video-card-body">
            <div class="student-video-card-copy">
              <div class="student-video-card-badges">
                <span class="task-tag">${escapeHtml(task.level || getSelectedLevel())}</span>
                <span class="task-tag">Audio required</span>
                <span class="task-tag">${escapeHtml(formatLabel(firstSection?.type || "form"))}</span>
                ${task.video ? `<span class="task-tag">Video attached</span>` : ""}
              </div>
              <h3>${escapeHtml(task.title)}</h3>
              <p class="student-video-author">${escapeHtml(firstSection?.title || "IELTS Listening")}</p>
              <p class="student-video-description">${escapeHtml(firstSection?.instructions || "Write your answers clearly while you listen.")}</p>
            </div>

            <div class="student-video-actions">
              <span class="task-tag">${escapeHtml(status)}</span>
              <span class="student-listening-meta">${answerCount} questions</span>
              <button class="lesson-link" type="button" data-listening-open="${task.id}">Open Listening Task</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadListeningTasks() {
  if (studentListeningGrid) {
    studentListeningGrid.innerHTML = `<div class="video-empty">Loading listening tasks...</div>`;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/listening-tasks`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load listening tasks.");
    }

    listeningTasksState = Array.isArray(data.data) ? data.data : [];
    renderListeningTaskCards();
    renderLevelContent();
  } catch (error) {
    listeningTasksState = [];

    if (studentListeningGrid) {
      studentListeningGrid.innerHTML = `<div class="video-empty">Listening task backend is not available right now.</div>`;
    }
  }
}

function renderAssignments() {
  const container = document.getElementById("assignment-list");
  const visibleTasks = getVisibleTasks();
  const summaryTasks = visibleTasks.slice(0, 3);

  if (!summaryTasks.length) {
    container.innerHTML = `
      <div class="task-item">
        <div class="task-item-copy">
          <strong>No tasks for ${escapeHtml(getSelectedLevel())}</strong>
          <span>Your teacher has not assigned a task for this CEFR level yet.</span>
        </div>
      </div>
    `;
    document.getElementById("stat-assignment-count").textContent = "0";
    document.getElementById("stat-backlog-count").textContent = "0";
    return;
  }

  container.innerHTML = summaryTasks
    .map(
      (task) => `
        <div class="task-item">
          <div class="task-item-copy">
            <strong>${task.title}</strong>
            <span>${task.description}</span>
            <div class="task-meta">
              <span class="task-tag">${escapeHtml(task.level || getSelectedLevel())}</span>
              <span class="task-tag">${formatLabel(task.type)}</span>
              <span>${task.deadline}</span>
            </div>
          </div>
          <a class="task-link" href="#" data-open-section="assignments">Vazifaga o'tish</a>
        </div>`,
    )
    .join("");

  document.getElementById("stat-assignment-count").textContent = String(visibleTasks.length);
  document.getElementById("stat-backlog-count").textContent = String(
    visibleTasks.filter((task) => getTaskStatus(task) !== "Completed").length,
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

function scrollToPanel(id) {
  const target = document.getElementById(id);
  if (!target) {
    return;
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
  const nextSection = document.getElementById(`section-${name}`) ? name : "dashboard";

  if (nextSection !== "listening" && listeningState.activeTaskId) {
    closeListeningTask();
  }

  sections.forEach((section) => section.classList.remove("active"));
  navLinks.forEach((link) => link.classList.remove("active"));

  const target = document.getElementById(`section-${nextSection}`);
  if (target) {
    target.classList.add("active");
  }

  const activeLink = document.querySelector(`.nav-link[data-section="${nextSection}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }

  if (headerTitle && sectionLabels[nextSection]) {
    headerTitle.textContent = sectionLabels[nextSection];
  }

  if (window.location.hash !== `#${nextSection}`) {
    window.location.hash = nextSection;
  }

  localStorage.setItem(ACTIVE_SECTION_KEY, nextSection);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (nextSection === "library") {
    loadBooks();
  }

  if (nextSection === "videos" || nextSection === "dashboard") {
    loadVideos();
  }

  if (nextSection === "listening") {
    loadListeningTasks();
  }

  closeSidebar();
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.section);
  });
});

cefrCards.forEach((card) => {
  card.addEventListener("click", () => {
    showLevelContent(card.dataset.level);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  const saved = localStorage.getItem(ACTIVE_SECTION_KEY);
  const sectionToLoad = hash || saved || "dashboard";
  showSection(sectionToLoad);
});

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    return;
  }

  showSection(hash);
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
    scrollToPanel(target);
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

document.addEventListener("click", (event) => {
  const videoOpenButton = event.target.closest("[data-video-open]");
  if (videoOpenButton) {
    openVideoLesson(videoOpenButton.dataset.videoOpen);
    return;
  }

  const videoTaskButton = event.target.closest("[data-video-task]");
  if (!videoTaskButton) {
    return;
  }

  showSection("assignments");
});

levelContentGrid?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-level-item]");
  if (!actionButton) {
    return;
  }

  const { levelItem, levelId } = actionButton.dataset;

  if (levelItem === "video") {
    openVideoLesson(levelId);
    return;
  }

  if (levelItem === "listening") {
    openListeningTask(levelId);
    return;
  }

  const task = tasks.find((item) => Number(item.id) === Number(levelId));
  if (!task) {
    showSection("assignments");
    return;
  }

  if (task.status === "completed") {
    showSection("results");
    return;
  }

  if (getTaskState(task) === "continue") {
    continueTask(task.id);
  } else {
    startTask(task.id);
  }

  showSection("assignments");
});

document.addEventListener("click", (event) => {
  const listeningButton = event.target.closest("[data-listening-open]");
  if (!listeningButton) {
    return;
  }

  openListeningTask(listeningButton.dataset.listeningOpen);
});

tasksGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-action]");
  if (!button) {
    return;
  }

  const task = tasks.find((item) => Number(item.id) === Number(button.dataset.taskId));
  if (!task) {
    return;
  }

  if (button.dataset.taskAction === "start") {
    startTask(task.id);
    return;
  }

  if (button.dataset.taskAction === "continue") {
    continueTask(task.id);
    return;
  }

  if (button.dataset.taskAction === "result") {
    showSection("results");
  }
});

listeningAnswerForm?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-listening-answer], [data-question]");
  if (!input) {
    return;
  }

  const answerKey = input.dataset.listeningAnswer || input.dataset.question;
  listeningState.answers[answerKey] = input.value;
});

listeningAnswerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const activeTask = getListeningTaskById(listeningState.activeTaskId);
  if (!activeTask) {
    return;
  }

  if (!isListeningUnlocked()) {
    showToast("Please load and play the audio before submitting.", "error");
    return;
  }

  listeningSubmissions[String(activeTask.id)] = {
    answers: { ...listeningState.answers },
    submittedAt: Date.now(),
  };
  saveListeningSubmissions();
  renderListeningTaskCards();
  showToast("Listening answers submitted for review.", "success");
  showSection("listening");
});

closeListeningTaskBtn?.addEventListener("click", closeListeningTask);

listeningAudioPlayer?.addEventListener("canplay", () => {
  listeningState.audioReady = true;
  listeningState.audioFailed = false;
  updateListeningLockState();
});

listeningAudioPlayer?.addEventListener("play", () => {
  if (!listeningState.audioPlayedOnce) {
    listeningState.audioPlayedOnce = true;
    showToast("Listening started", "info");
  }

  startListeningTimer();
  updateListeningLockState();
});

listeningAudioPlayer?.addEventListener("pause", updateListeningLockState);
listeningAudioPlayer?.addEventListener("timeupdate", updateListeningTimeline);
listeningAudioPlayer?.addEventListener("loadedmetadata", updateListeningTimeline);
listeningAudioPlayer?.addEventListener("ended", updateListeningLockState);
listeningAudioPlayer?.addEventListener("error", () => {
  listeningState.audioFailed = true;
  listeningState.audioReady = false;
  updateListeningLockState();
  showToast("Audio failed to load", "error");
});

videoPlayerClose?.addEventListener("click", closeVideoPlayer);
videoPlayerOverlay?.addEventListener("click", (event) => {
  if (event.target === videoPlayerOverlay) {
    closeVideoPlayer();
  }
});

tasks = loadTasksState();
listeningSubmissions = loadListeningSubmissions();
normalizeTaskStates();
saveTasksState();
selectedCefrLevel = getSelectedLevel();
updateCefrCardState();
renderAssignments();
renderBacklog();
renderTasks();
renderLevelContent();
setBacklogExpanded(false);
applyTheme(localStorage.getItem(THEME_KEY) || "light");
renderTaskResults();
renderListeningTaskCards();
