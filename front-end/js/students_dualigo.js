import { authStorageKey, studentCredentials } from "../data/login_data.js";
import { dualigoPromptsData } from "../data/dualigo_prompts_data.js";
import { getGroupById } from "../data/group_data.js";
import { initResponsiveNav } from "./responsive-nav.js";

const PROMPT_STORAGE_KEY = "dualigo-group-prompts";
const ROUND_TIME = 30;

const studentName = document.querySelector("#student-name");
const studentGroup = document.querySelector("#student-group");
const teacherName = document.querySelector("#teacher-name");
const roundStatus = document.querySelector("#round-status");
const timerText = document.querySelector("#timer-text");
const timerFill = document.querySelector("#timer-fill");
const scoreText = document.querySelector("#score-text");
const scoreNote = document.querySelector("#score-note");
const wordCount = document.querySelector("#word-count");
const wordsGrid = document.querySelector("#words-grid");
const answerZone = document.querySelector("#answer-zone");
const feedbackBox = document.querySelector("#feedback-box");
const solutionText = document.querySelector("#solution-text");
const nextPromptButton = document.querySelector("#next-prompt");
const clearAnswerButton = document.querySelector("#clear-answer");
const checkAnswerButton = document.querySelector("#check-answer");
const startRoundButton = document.querySelector("#start-round");
const restartRoundButton = document.querySelector("#restart-round");
const challengeTitle = document.querySelector("#challenge-title");
const themeToggle = document.querySelector("#theme-toggle");
const THEME_STORAGE_KEY = "theme";

let prompts = [];
let currentPromptIndex = 0;
let solvedCount = 0;
let currentWords = [];
let selectedWordIds = [];
let timeLeft = ROUND_TIME;
let timerId = null;
let roundLocked = false;
let roundStarted = false;

function redirectTo(url) {
  window.location.href = url;
}

function normalizeTargetPage(redirectTo, fallbackPage) {
  if (typeof redirectTo !== "string" || !redirectTo.trim()) {
    return fallbackPage;
  }

  const normalized = redirectTo.replace(/\\/g, "/").split("/").filter(Boolean).pop();
  return normalized || fallbackPage;
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function ensureStudentSession() {
  const session = getSession();

  if (!session?.isAuthenticated) {
    redirectTo("../html/index.html");
    return null;
  }

  if (session.role !== "student") {
    const targetPage = normalizeTargetPage(session.redirectTo, "index.html");
    redirectTo(`../html/${targetPage}`);
    return null;
  }

  return {
    displayName: session.displayName || studentCredentials.displayName,
    groupId: session.groupId || studentCredentials.groupId
  };
}

function createPromptStore() {
  return dualigoPromptsData.reduce((store, entry) => {
    store[entry.groupId] = Array.isArray(entry.prompts) ? [...entry.prompts] : [];
    return store;
  }, {});
}

function getStoredPrompts() {
  try {
    const seeded = createPromptStore();
    const saved = JSON.parse(localStorage.getItem(PROMPT_STORAGE_KEY) || "{}");

    if (!saved || typeof saved !== "object") {
      return seeded;
    }

    Object.entries(saved).forEach(([groupId, groupPrompts]) => {
      if (Array.isArray(groupPrompts)) {
        seeded[groupId] = groupPrompts.filter(Boolean);
      }
    });

    return seeded;
  } catch {
    return createPromptStore();
  }
}

function syncThemeToggle(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");

  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

function setupTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("skillset-theme");
  syncThemeToggle(savedTheme === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    localStorage.setItem("skillset-theme", nextTheme);
    syncThemeToggle(nextTheme);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === "skillset-theme") {
      syncThemeToggle(event.newValue === "dark" ? "dark" : "light");
    }
  });
}

function shuffleWords(words) {
  const shuffled = [...words];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function tokenizePrompt(prompt) {
  return prompt
    .trim()
    .split(/\s+/)
    .map((word, index) => ({ id: `${index}-${word}`, text: word }));
}

function normalizeSentence(sentence) {
  return sentence.replace(/\s+/g, " ").trim().toLowerCase();
}

function getCurrentPrompt() {
  return prompts[currentPromptIndex] || "";
}

function getSelectedWords() {
  return selectedWordIds
    .map((wordId) => currentWords.find((word) => word.id === wordId))
    .filter(Boolean);
}

function getAvailableWords() {
  return currentWords.filter((word) => !selectedWordIds.includes(word.id));
}

function renderAnswerZone() {
  const selectedWords = getSelectedWords();
  answerZone.innerHTML = "";
  answerZone.classList.toggle("is-empty", selectedWords.length === 0);

  selectedWords.forEach((word) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "answer-chip";
    chip.textContent = word.text;
    chip.disabled = roundLocked || !roundStarted;
    chip.addEventListener("click", () => {
      selectedWordIds = selectedWordIds.filter((wordId) => wordId !== word.id);
      renderBoard();
    });
    answerZone.appendChild(chip);
  });
}

function renderWordBank() {
  const availableWords = getAvailableWords();
  wordsGrid.innerHTML = "";

  availableWords.forEach((word) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "word-chip";
    chip.textContent = word.text;
    chip.disabled = roundLocked || !roundStarted;
    chip.addEventListener("click", () => {
      selectedWordIds = [...selectedWordIds, word.id];
      renderBoard();
    });
    wordsGrid.appendChild(chip);
  });
}

function renderBoard() {
  renderAnswerZone();
  renderWordBank();
}

function setFeedback(message, type = "") {
  feedbackBox.textContent = message;
  feedbackBox.className = "feedback-box";

  if (type) {
    feedbackBox.classList.add(type);
  }
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerUI() {
  const width = `${(timeLeft / ROUND_TIME) * 100}%`;
  timerText.textContent = roundStarted ? `${timeLeft}s` : "Ready";
  timerFill.style.transition = roundStarted ? "width 1s linear, background 0.2s ease" : "none";
  timerFill.style.width = width;

  if (timeLeft <= 10) {
    timerFill.style.background = "linear-gradient(90deg, #ff6f6f, #ff9b6a)";
  } else {
    timerFill.style.background = "linear-gradient(90deg, var(--timer-start), var(--timer-end))";
  }
}

function setRoundReadyState() {
  stopTimer();
  roundStarted = false;
  timeLeft = ROUND_TIME;
  startRoundButton.disabled = roundLocked;
  clearAnswerButton.disabled = true;
  checkAnswerButton.disabled = true;
  updateTimerUI();
  renderBoard();
}

function lockRound(message, type = "") {
  roundLocked = true;
  stopTimer();
  setFeedback(message, type);
  solutionText.textContent = getCurrentPrompt();
  startRoundButton.disabled = true;
  nextPromptButton.disabled = false;
  clearAnswerButton.disabled = true;
  checkAnswerButton.disabled = true;
  renderBoard();
}

function handleTimeExpired() {
  lockRound("Vaqt tugadi. To'g'ri javob o'ng tomonda ko'rsatildi.", "is-error");
}

function startTimer() {
  stopTimer();
  roundStarted = true;
  timeLeft = ROUND_TIME;
  startRoundButton.disabled = true;
  clearAnswerButton.disabled = false;
  checkAnswerButton.disabled = false;
  updateTimerUI();
  renderBoard();

  timerId = window.setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();

    if (timeLeft <= 0) {
      handleTimeExpired();
    }
  }, 1000);
}

function updateHeader(group) {
  const student = ensureStudentSession();
  if (!student) {
    return;
  }

  studentName.textContent = student.displayName;
  studentGroup.textContent = group ? `${group.title} · ${group.level}` : "Group not found";
  teacherName.textContent = group?.teacher || "Teacher not found";
  roundStatus.textContent = `Prompt ${Math.min(currentPromptIndex + 1, prompts.length)} / ${prompts.length}`;
  scoreText.textContent = `${solvedCount} / ${prompts.length} solved`;
  scoreNote.textContent = prompts.length
    ? "To'g'ri yechilgan promptlar shu yerda hisoblanadi."
    : "Bu guruh uchun hozircha prompt topilmadi.";
}

function buildRound() {
  const prompt = getCurrentPrompt();

  if (!prompt) {
    roundLocked = true;
    currentWords = [];
    selectedWordIds = [];
    challengeTitle.textContent = "No prompts available";
    wordCount.textContent = "0 words";
    startRoundButton.disabled = true;
    nextPromptButton.disabled = true;
    clearAnswerButton.disabled = true;
    checkAnswerButton.disabled = true;
    solutionText.textContent = "Teacher hali bu guruhga prompt yozmagan.";
    setFeedback("Bu guruh uchun hozircha inglizcha gap topilmadi.", "is-error");
    renderBoard();
    stopTimer();
    return;
  }

  const originalWords = tokenizePrompt(prompt);
  let shuffledWords = shuffleWords(originalWords);
  let attempts = 0;

  while (
    shuffledWords.map((word) => word.text).join(" ") === originalWords.map((word) => word.text).join(" ") &&
    attempts < 5
  ) {
    shuffledWords = shuffleWords(originalWords);
    attempts += 1;
  }

  currentWords = shuffledWords;
  selectedWordIds = [];
  roundLocked = false;
  challengeTitle.textContent = "Arrange the teacher sentence";
  wordCount.textContent = `${originalWords.length} words`;
  solutionText.textContent = "Javob hozircha yashirin.";
  nextPromptButton.disabled = true;
  setFeedback("Start ni bosing, keyin so'zlarni yig'ishni boshlaysiz.");
  setRoundReadyState();
}

function goToRound(index) {
  currentPromptIndex = index;
  buildRound();
  const student = ensureStudentSession();
  if (!student) {
    return;
  }
  updateHeader(getGroupById(student.groupId));
}

function handleCheckAnswer() {
  if (roundLocked || !roundStarted) {
    return;
  }

  const selectedSentence = getSelectedWords().map((word) => word.text).join(" ");
  const isCorrect = normalizeSentence(selectedSentence) === normalizeSentence(getCurrentPrompt());

  if (isCorrect) {
    solvedCount += 1;
    scoreText.textContent = `${solvedCount} / ${prompts.length} solved`;
    lockRound("Ajoyib! Gap to'g'ri yig'ildi.", "is-success");
    return;
  }

  setFeedback("Hali to'g'ri emas. So'z tartibini yana tekshirib ko'ring.", "is-error");
}

function handleNextPrompt() {
  if (currentPromptIndex + 1 >= prompts.length) {
    roundLocked = true;
    roundStarted = false;
    startRoundButton.disabled = true;
    nextPromptButton.disabled = true;
    clearAnswerButton.disabled = true;
    checkAnswerButton.disabled = true;
    challengeTitle.textContent = "All prompts completed";
    setFeedback("Bugungi barcha Dualigo promptlari tugadi. Yaxshi ishladingiz!", "is-success");
    solutionText.textContent = "Yangi prompt qo'shilsa shu yerda davom etasiz.";
    stopTimer();
    renderBoard();
    return;
  }

  goToRound(currentPromptIndex + 1);
}

function setupActions() {
  clearAnswerButton?.addEventListener("click", () => {
    if (roundLocked || !roundStarted) {
      return;
    }

    selectedWordIds = [];
    renderBoard();
    setFeedback("Tanlov tozalandi. Qaytadan yig'ishingiz mumkin.");
  });

  checkAnswerButton?.addEventListener("click", handleCheckAnswer);
  nextPromptButton?.addEventListener("click", handleNextPrompt);
  startRoundButton?.addEventListener("click", () => {
    if (roundLocked || roundStarted) {
      return;
    }

    startTimer();
    setFeedback("Timer boshlandi. So'zlarni tartib bilan yig'ing.");
  });
  restartRoundButton?.addEventListener("click", () => goToRound(currentPromptIndex));
}

function init() {
  const student = ensureStudentSession();
  if (!student) {
    return;
  }

  setupTheme();
  initResponsiveNav();
  setupActions();

  const group = getGroupById(student.groupId);
  const promptStore = getStoredPrompts();
  prompts = promptStore[student.groupId] ?? [];

  updateHeader(group);
  goToRound(0);
}

init();
