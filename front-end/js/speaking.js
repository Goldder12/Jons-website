import { authStorageKey } from "../data/login_data.js";
import { speakingQuestions as fallbackQuestions } from "../data/speaking_questions.js";

const THEME_STORAGE_KEY = "theme";
const API_BASE_URL = resolveApiBaseUrl();
const QUESTIONS_URL = `${API_BASE_URL}/api/speaking/questions`;
const SPEAKING_UPLOAD_URL = `${API_BASE_URL}/api/speaking/upload`;

const questionSelect = document.getElementById("question-select");
const questionPreview = document.getElementById("question-preview");
const questionLevel = document.getElementById("question-level");
const startButton = document.getElementById("start-recording");
const stopButton = document.getElementById("stop-recording");
const submitRecordingButton = document.getElementById("submit-recording");
const recordedAudio = document.getElementById("recorded-audio");
const liveTranscript = document.getElementById("live-transcript");
const recordingStatus = document.getElementById("recording-status");
const uploadForm = document.getElementById("upload-form");
const submitUploadButton = document.getElementById("submit-upload");
const feedbackElement = document.getElementById("speaking-feedback");
const resultPanel = document.getElementById("result-panel");
const themeToggle = document.getElementById("theme-toggle");
const adminQuestionCard = document.getElementById("admin-question-card");
const questionForm = document.getElementById("question-form");
const submitQuestionButton = document.getElementById("submit-question");

let currentSession = null;
let questions = [];
let mediaRecorder = null;
let mediaStream = null;
let recordedChunks = [];
let recordedBlob = null;
let speechRecognition = null;
let finalTranscript = "";

function resolveApiBaseUrl() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000";
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return window.location.origin;
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function enforceAccess() {
  const session = getSession();

  if (!session?.isAuthenticated) {
    window.location.href = "./index.html";
    return null;
  }

  return session;
}

function createRequestHeaders(includeJson = false) {
  const headers = {
    "x-user-id": String(currentSession.id)
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function syncTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

function setupTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("skillset-theme");
  syncTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    localStorage.setItem("skillset-theme", nextTheme);
    syncTheme(nextTheme);
  });
}

function showFeedback(message, type = "success") {
  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.remove("d-none", "alert-success", "alert-danger");
  feedbackElement.classList.add(type === "error" ? "alert-danger" : "alert-success");
}

function clearFeedback() {
  feedbackElement?.classList.add("d-none");
  feedbackElement?.classList.remove("alert-success", "alert-danger");

  if (feedbackElement) {
    feedbackElement.textContent = "";
  }
}

function setButtonLoading(button, isLoading, normalHtml, loadingText) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? `<i class="bi bi-arrow-repeat"></i><span>${loadingText}</span>`
    : normalHtml;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Request failed");
  }

  return result;
}

async function loadQuestions() {
  try {
    const result = await requestJson(QUESTIONS_URL, {
      headers: {
        Accept: "application/json"
      }
    });

    questions = Array.isArray(result) ? result : fallbackQuestions;
  } catch {
    questions = fallbackQuestions;
  }

  renderQuestions();
}

function renderQuestions() {
  if (!questionSelect) {
    return;
  }

  questionSelect.innerHTML = questions.map((question) => `
    <option value="${question.id}">${question.level} - ${question.question}</option>
  `).join("");

  updateSelectedQuestion();
}

function getSelectedQuestion() {
  const questionId = Number(questionSelect?.value);
  return questions.find((question) => Number(question.id) === questionId) || questions[0] || null;
}

function updateSelectedQuestion() {
  const selectedQuestion = getSelectedQuestion();

  if (!selectedQuestion) {
    return;
  }

  if (questionPreview) {
    questionPreview.textContent = selectedQuestion.question;
  }

  if (questionLevel) {
    questionLevel.textContent = selectedQuestion.level;
  }
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const segment = event.results[index][0].transcript;

      if (event.results[index].isFinal) {
        finalTranscript += `${segment} `;
      } else {
        interimTranscript += segment;
      }
    }

    if (liveTranscript) {
      liveTranscript.value = `${finalTranscript}${interimTranscript}`.trim();
    }
  };

  return recognition;
}

function setRecordingState(isRecording) {
  startButton.disabled = isRecording;
  stopButton.disabled = !isRecording;
  recordingStatus.textContent = isRecording ? "Recording" : "Ready";
  recordingStatus.classList.toggle("is-recording", isRecording);
}

async function startRecording() {
  clearFeedback();
  resultPanel?.classList.add("d-none");
  recordedBlob = null;
  recordedChunks = [];
  finalTranscript = "";

  if (recordedAudio) {
    recordedAudio.classList.add("d-none");
    recordedAudio.removeAttribute("src");
  }

  if (liveTranscript) {
    liveTranscript.value = "";
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : undefined
    });

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });

      if (recordedAudio) {
        recordedAudio.src = URL.createObjectURL(recordedBlob);
        recordedAudio.classList.remove("d-none");
      }

      submitRecordingButton.disabled = false;
      mediaStream?.getTracks().forEach((track) => track.stop());
      speechRecognition?.stop();
      setRecordingState(false);
    });

    speechRecognition = setupSpeechRecognition();
    speechRecognition?.start();
    mediaRecorder.start();
    submitRecordingButton.disabled = true;
    setRecordingState(true);
  } catch (error) {
    setRecordingState(false);
    showFeedback(error.message || "Microphone access failed", "error");
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

async function submitAudio({ audioBlob, audioFile, transcript = "" }) {
  const selectedQuestion = getSelectedQuestion();

  if (!selectedQuestion) {
    throw new Error("Select a speaking question first");
  }

  const formData = new FormData();
  formData.append("userId", String(currentSession.id));
  formData.append("questionId", String(selectedQuestion.id));
  formData.append("transcript", transcript.trim());

  if (audioBlob) {
    formData.append("audio", audioBlob, `speaking-${Date.now()}.webm`);
  } else if (audioFile) {
    formData.append("audio", audioFile);
  }

  return requestJson(SPEAKING_UPLOAD_URL, {
    method: "POST",
    headers: createRequestHeaders(),
    body: formData
  });
}

function renderList(targetId, items) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  target.innerHTML = (Array.isArray(items) && items.length ? items : ["No specific items were returned."])
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderResult(result) {
  const analysis = result.analysis || {};

  document.getElementById("score-value").textContent = String(analysis.score ?? "0.0");
  document.getElementById("result-transcript").textContent = result.transcript || "";
  document.getElementById("result-fluency").textContent = analysis.fluency || "";
  document.getElementById("result-vocabulary").textContent = analysis.vocabulary || "";
  document.getElementById("result-grammar").textContent = analysis.grammar || "";
  document.getElementById("result-pronunciation").textContent = analysis.pronunciation || "";
  renderList("result-mistakes", analysis.mistakes);
  renderList("result-suggestions", analysis.suggestions);
  resultPanel?.classList.remove("d-none");
  resultPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleSubmitRecording() {
  if (!recordedBlob) {
    showFeedback("Record your answer before submitting.", "error");
    return;
  }

  clearFeedback();
  setButtonLoading(submitRecordingButton, true, '<i class="bi bi-stars"></i><span>Analyze Recording</span>', "Analyzing...");

  try {
    const result = await submitAudio({
      audioBlob: recordedBlob,
      transcript: liveTranscript?.value || ""
    });
    renderResult(result);
    showFeedback("Speaking response analyzed successfully.");
  } catch (error) {
    showFeedback(error.message || "Failed to analyze speaking response", "error");
  } finally {
    setButtonLoading(submitRecordingButton, false, '<i class="bi bi-stars"></i><span>Analyze Recording</span>', "Analyzing...");
  }
}

async function handleUpload(event) {
  event.preventDefault();
  clearFeedback();

  const audioInput = document.getElementById("audio-upload");
  const transcriptInput = document.getElementById("manual-transcript");
  const audioFile = audioInput?.files?.[0] || null;

  if (!audioFile) {
    showFeedback("Choose an audio file before submitting.", "error");
    return;
  }

  setButtonLoading(submitUploadButton, true, '<i class="bi bi-cloud-arrow-up"></i><span>Analyze Upload</span>', "Analyzing...");

  try {
    const result = await submitAudio({
      audioFile,
      transcript: transcriptInput?.value || ""
    });
    uploadForm.reset();
    renderResult(result);
    showFeedback("Uploaded response analyzed successfully.");
  } catch (error) {
    showFeedback(error.message || "Failed to analyze uploaded audio", "error");
  } finally {
    setButtonLoading(submitUploadButton, false, '<i class="bi bi-cloud-arrow-up"></i><span>Analyze Upload</span>', "Analyzing...");
  }
}

async function handleAddQuestion(event) {
  event.preventDefault();
  clearFeedback();

  const formData = new FormData(questionForm);
  const level = String(formData.get("level") || "").trim();
  const question = String(formData.get("question") || "").trim();

  if (!level || !question) {
    showFeedback("Level and question are required.", "error");
    return;
  }

  setButtonLoading(submitQuestionButton, true, '<i class="bi bi-plus-circle"></i><span>Add Question</span>', "Saving...");

  try {
    await requestJson(QUESTIONS_URL, {
      method: "POST",
      headers: createRequestHeaders(true),
      body: JSON.stringify({ level, question })
    });
    questionForm.reset();
    showFeedback("Speaking question added successfully.");
    await loadQuestions();
  } catch (error) {
    showFeedback(error.message || "Failed to add speaking question", "error");
  } finally {
    setButtonLoading(submitQuestionButton, false, '<i class="bi bi-plus-circle"></i><span>Add Question</span>', "Saving...");
  }
}

function setupRoleUi() {
  adminQuestionCard?.classList.toggle("d-none", currentSession?.role !== "admin");
}

async function init() {
  currentSession = enforceAccess();

  if (!currentSession) {
    return;
  }

  setupTheme();
  setupRoleUi();
  await loadQuestions();

  questionSelect?.addEventListener("change", updateSelectedQuestion);
  startButton?.addEventListener("click", startRecording);
  stopButton?.addEventListener("click", stopRecording);
  submitRecordingButton?.addEventListener("click", handleSubmitRecording);
  uploadForm?.addEventListener("submit", handleUpload);
  questionForm?.addEventListener("submit", handleAddQuestion);
}

init();
