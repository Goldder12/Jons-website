import { authStorageKey } from "../data/login_data.js";
import { initResponsiveNav } from "./responsive-nav.js";

const THEME_STORAGE_KEY = "theme";
const searchInput = document.getElementById("library-search");
const filterGroup = document.getElementById("filter-group");
const libraryGrid = document.getElementById("library-grid");
const emptyState = document.getElementById("empty-state");
const bookCount = document.getElementById("book-count");
const activeLevel = document.getElementById("active-level");
const themeToggle = document.getElementById("theme-toggle");
const logoutButton = document.getElementById("logout-button");
const studentName = document.getElementById("student-name");
const studentGroup = document.getElementById("student-group");
const modalTitle = document.getElementById("bookViewerTitle");
const modalDownloadLink = document.getElementById("modal-download-link");
const modalFrame = document.getElementById("book-viewer-frame");
const modalElement = document.getElementById("bookViewerModal");
const feedbackElement = document.getElementById("library-feedback");
const adminPanel = document.getElementById("admin-library-panel");
const adminUploadToggle = document.getElementById("admin-upload-toggle");
const adminUploadForm = document.getElementById("admin-upload-form");
const adminUploadSubmit = document.getElementById("admin-upload-submit");
const adminUploadReset = document.getElementById("admin-upload-reset");

let activeFilter = "All";
let viewerModal = null;
let books = [];
let currentSession = null;
const API_BASE_URL = resolveApiBaseUrl();
const API_BOOKS_URL = `${API_BASE_URL}/api/books`;

function resolveApiBaseUrl() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000";
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return window.location.origin;
}

function resolveAssetUrl(resourcePath) {
  const value = String(resourcePath || "").trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function redirectTo(url) {
  window.location.href = url;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function ensureAuthenticatedSession() {
  const session = getSession();

  if (!session?.isAuthenticated) {
    redirectTo("../html/index.html");
    return null;
  }

  return session;
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

function showFeedback(message, type = "success") {
  if (!feedbackElement) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.classList.remove("d-none", "alert-success", "alert-danger");
  feedbackElement.classList.add(type === "error" ? "alert-danger" : "alert-success");
}

function clearFeedback() {
  if (!feedbackElement) {
    return;
  }

  feedbackElement.classList.add("d-none");
  feedbackElement.classList.remove("alert-success", "alert-danger");
  feedbackElement.textContent = "";
}

function updateHeader(session) {
  const isAdmin = session.role === "admin";

  if (studentName) {
    studentName.textContent = session.displayName || session.username || (isAdmin ? "Admin" : "Student");
  }

  if (studentGroup) {
    studentGroup.textContent = isAdmin ? "Admin access" : (session.group || "English learner");
  }
}

function setupLogout() {
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem(authStorageKey);
    redirectTo("../html/index.html");
  });
}

function configureRoleNavigation(session) {
  const isAdmin = session.role === "admin";
  const dashboardHref = isAdmin ? "../html/index.html" : "../html/student.html";
  const secondaryHref = isAdmin ? "../html/oquvchi.html" : "../html/students_dualigo.html";
  const secondaryIcon = isAdmin ? "bi-people" : "bi-chat-square-text";
  const secondaryLabel = isAdmin ? "Students" : "Duolingo";

  document.querySelectorAll('[data-nav-item="dashboard"]').forEach((item) => {
    item.setAttribute("href", dashboardHref);
    item.setAttribute("title", "Dashboard");
  });

  document.querySelectorAll('[data-nav-item="duolingo"]').forEach((item) => {
    item.setAttribute("href", secondaryHref);
    item.setAttribute("title", secondaryLabel);

    const icon = item.querySelector("i");
    if (icon) {
      icon.className = `bi ${secondaryIcon}`;
    }

    const label = item.querySelector("span");
    if (label) {
      label.textContent = secondaryLabel;
    }
  });

  document.querySelectorAll('[data-nav-item="profile"]').forEach((item) => {
    item.classList.toggle("d-none", isAdmin);
  });
}

function createRequestHeaders() {
  const headers = {};

  if (currentSession?.id) {
    headers["x-user-id"] = String(currentSession.id);
  }

  return headers;
}

function createBookCard(book) {
  const safeTitle = escapeHtml(book.title);
  const safeLevel = escapeHtml(book.level);
  const safeDescription = escapeHtml(book.description);
  const safeCover = escapeHtml(resolveAssetUrl(book.cover));
  const safeFile = escapeHtml(resolveAssetUrl(book.file));
  const deleteButton = currentSession?.role === "admin"
    ? `
        <button class="book-card__action book-card__action--delete" type="button" data-book-delete="${book.id}">
          <i class="bi bi-trash3"></i>
          Delete
        </button>
      `
    : "";

  return `
    <article class="book-card">
      <div class="book-card__cover">
        <img src="${safeCover}" alt="${safeTitle} cover" loading="lazy">
      </div>

      <div class="book-card__meta">
        <span class="book-card__level">${safeLevel}</span>
        <h3 class="book-card__title">${safeTitle}</h3>
        <p class="book-card__description">${safeDescription}</p>
      </div>

      <div class="book-card__actions">
        <button class="book-card__action book-card__action--read" type="button" data-book-read="${book.id}">
          <i class="bi bi-book-half"></i>
          Read
        </button>
        <a class="book-card__action book-card__action--download" href="${safeFile}" download>
          <i class="bi bi-download"></i>
          Download
        </a>
        ${deleteButton}
      </div>
    </article>
  `;
}

function getFilteredBooks() {
  const query = searchInput?.value.trim().toLowerCase() || "";

  return books.filter((book) => {
    const matchesLevel = activeFilter === "All" || book.level === activeFilter;
    const matchesQuery = !query || book.title.toLowerCase().includes(query);
    return matchesLevel && matchesQuery;
  });
}

function renderBooks() {
  const visibleBooks = getFilteredBooks();

  if (bookCount) {
    bookCount.textContent = String(visibleBooks.length);
  }

  if (activeLevel) {
    activeLevel.textContent = activeFilter;
  }

  libraryGrid.innerHTML = visibleBooks.map(createBookCard).join("");
  emptyState?.classList.toggle("d-none", visibleBooks.length > 0);

  libraryGrid.querySelectorAll("[data-book-read]").forEach((button) => {
    button.addEventListener("click", () => {
      const bookId = Number(button.getAttribute("data-book-read"));
      const selectedBook = books.find((item) => item.id === bookId);

      if (!selectedBook || !viewerModal) {
        return;
      }

      const bookUrl = resolveAssetUrl(selectedBook.file);
      modalTitle.textContent = selectedBook.title;
      modalDownloadLink.href = bookUrl;
      modalDownloadLink.setAttribute("download", "");
      modalFrame.src = `${bookUrl}#toolbar=1&navpanes=0`;
      viewerModal.show();
    });
  });

  libraryGrid.querySelectorAll("[data-book-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const bookId = Number(button.getAttribute("data-book-delete"));
      if (!Number.isInteger(bookId)) {
        return;
      }

      await deleteBook(bookId);
    });
  });
}

async function fetchBooks() {
  clearFeedback();

  const response = await fetch(API_BOOKS_URL, {
    headers: {
      Accept: "application/json"
    }
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result && typeof result === "object" && "message" in result
      ? result.message
      : "Failed to load books";
    throw new Error(message || "Failed to load books");
  }

  books = Array.isArray(result)
    ? result
    : (Array.isArray(result?.books) ? result.books : []);
  renderBooks();
}

async function deleteBook(bookId) {
  if (currentSession?.role !== "admin") {
    return;
  }

  const confirmed = window.confirm("Delete this book from the library?");
  if (!confirmed) {
    return;
  }

  clearFeedback();

  try {
    const response = await fetch(`${API_BOOKS_URL}/${bookId}`, {
      method: "DELETE",
      headers: {
        ...createRequestHeaders(),
        Accept: "application/json"
      }
    });

    const result = await response.json().catch(() => ({
      success: false,
      message: "Failed to delete book"
    }));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete book");
    }

    books = books.filter((book) => book.id !== bookId);
    renderBooks();
    showFeedback(result.message || "Book deleted successfully");
  } catch (error) {
    showFeedback(error.message || "Unable to delete book right now", "error");
  }
}

function setupFilters() {
  filterGroup?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level]");

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    activeFilter = button.dataset.level || "All";
    filterGroup.querySelectorAll("[data-level]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderBooks();
  });
}

function setupSearch() {
  searchInput?.addEventListener("input", () => {
    renderBooks();
  });
}

function setupViewerModal() {
  if (!modalElement || !window.bootstrap) {
    return;
  }

  viewerModal = new window.bootstrap.Modal(modalElement);
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalFrame.src = "about:blank";
    modalTitle.textContent = "Book title";
    modalDownloadLink.href = "#";
  });
}

function setupAdminPanel() {
  if (currentSession?.role !== "admin" || !adminPanel || !(adminUploadForm instanceof HTMLFormElement)) {
    return;
  }

  adminPanel.classList.remove("d-none");
  adminUploadToggle?.classList.remove("d-none");

  adminUploadToggle?.addEventListener("click", () => {
    adminPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  adminUploadReset?.addEventListener("click", () => {
    clearFeedback();
  });

  adminUploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!(adminUploadSubmit instanceof HTMLButtonElement)) {
      return;
    }

    const formData = new FormData(adminUploadForm);
    adminUploadSubmit.disabled = true;
    adminUploadSubmit.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Saving...';

    try {
      const response = await fetch(API_BOOKS_URL, {
        method: "POST",
        headers: createRequestHeaders(),
        body: formData
      });

      const result = await response.json().catch(() => ({
        success: false,
        message: "Failed to upload book"
      }));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to upload book");
      }

      adminUploadForm.reset();
      showFeedback(result.message || "Book uploaded successfully");
      await fetchBooks();
    } catch (error) {
      showFeedback(error.message || "Unable to upload the book right now", "error");
    } finally {
      adminUploadSubmit.disabled = false;
      adminUploadSubmit.innerHTML = '<i class="bi bi-upload me-2"></i>Save Book';
    }
  });
}

async function init() {
  currentSession = ensureAuthenticatedSession();
  if (!currentSession) {
    return;
  }

  configureRoleNavigation(currentSession);
  updateHeader(currentSession);
  setupTheme();
  setupLogout();
  initResponsiveNav({ profileTriggerSelector: currentSession.role === "student" ? "#open-profile-modal" : null });
  setupViewerModal();
  setupFilters();
  setupSearch();
  setupAdminPanel();

  try {
    await fetchBooks();
  } catch (error) {
    showFeedback(error.message || "Unable to load library books", "error");
  }
}

init();
