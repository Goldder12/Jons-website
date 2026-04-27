import { authStorageKey } from "../data/login_data.js";

const THEME_STORAGE_KEY = "theme";
const createForm = document.getElementById("create-book-form");
const createSubmit = document.getElementById("create-submit");
const editForm = document.getElementById("edit-book-form");
const editSubmit = document.getElementById("edit-submit");
const editModalElement = document.getElementById("editBookModal");
const tableBody = document.getElementById("admin-books-table-body");
const feedbackElement = document.getElementById("admin-library-feedback");
const emptyState = document.getElementById("admin-empty-state");
const bookCount = document.getElementById("admin-book-count");
const themeToggle = document.getElementById("theme-toggle");

const API_BASE_URL = resolveApiBaseUrl();
const API_BOOKS_URL = `${API_BASE_URL}/api/books`;

let books = [];
let currentSession = null;
let editModal = null;

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

function enforceAdminAccess() {
  const session = getSession();

  if (!session?.isAuthenticated) {
    window.location.href = "./index.html";
    return null;
  }

  if (session.role !== "admin") {
    window.location.href = "./student.html";
    return null;
  }

  return session;
}

function createRequestHeaders() {
  return {
    "x-user-id": String(currentSession.id)
  };
}

function setLoading(button, isLoading, label, loadingLabel) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? `<i class="bi bi-arrow-repeat"></i><span>${loadingLabel}</span>`
    : label;
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

function validateCreateForm(formData) {
  const requiredFields = ["title", "level", "description"];
  const missingField = requiredFields.find((field) => !String(formData.get(field) || "").trim());
  const pdf = formData.get("pdf");
  const cover = formData.get("cover");

  if (missingField) {
    return "Title, level, and description are required.";
  }

  if (!(pdf instanceof File) || !pdf.name) {
    return "PDF file is required.";
  }

  if (!(cover instanceof File) || !cover.name) {
    return "Cover image is required.";
  }

  return "";
}

function validateEditForm(formData) {
  const requiredFields = ["title", "level", "description"];
  const missingField = requiredFields.find((field) => !String(formData.get(field) || "").trim());

  return missingField ? "Title, level, and description are required." : "";
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Request failed");
  }

  return result;
}

async function fetchBooks() {
  const result = await requestJson(API_BOOKS_URL, {
    headers: {
      Accept: "application/json"
    }
  });

  books = Array.isArray(result)
    ? result
    : (Array.isArray(result?.books) ? result.books : []);
  renderBooks();
}

function renderBooks() {
  if (!tableBody) {
    return;
  }

  if (bookCount) {
    bookCount.textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;
  }

  emptyState?.classList.toggle("d-none", books.length > 0);

  tableBody.innerHTML = books.map((book) => {
    const safeTitle = escapeHtml(book.title);
    const safeLevel = escapeHtml(book.level);
    const safeDescription = escapeHtml(book.description);
    const coverUrl = escapeHtml(resolveAssetUrl(book.cover));
    const fileUrl = escapeHtml(resolveAssetUrl(book.file));

    return `
      <tr>
        <td>
          <div class="admin-book-info">
            <img class="admin-book-cover" src="${coverUrl}" alt="${safeTitle} cover" loading="lazy">
            <div>
              <p class="admin-book-title">${safeTitle}</p>
              <p class="admin-book-description">${safeDescription}</p>
            </div>
          </div>
        </td>
        <td><span class="admin-level-pill">${safeLevel}</span></td>
        <td>
          <a class="btn admin-action-btn admin-action-btn--view" href="${fileUrl}" target="_blank" rel="noopener">
            <i class="bi bi-file-earmark-pdf"></i>
            <span>Open</span>
          </a>
        </td>
        <td>
          <div class="admin-row-actions">
            <button class="btn admin-action-btn admin-action-btn--edit" type="button" data-edit-book="${book.id}">
              <i class="bi bi-pencil-square"></i>
              <span>Edit</span>
            </button>
            <button class="btn admin-action-btn admin-action-btn--delete" type="button" data-delete-book="${book.id}">
              <i class="bi bi-trash3"></i>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  tableBody.querySelectorAll("[data-edit-book]").forEach((button) => {
    button.addEventListener("click", () => openEditModal(Number(button.getAttribute("data-edit-book"))));
  });

  tableBody.querySelectorAll("[data-delete-book]").forEach((button) => {
    button.addEventListener("click", () => deleteBook(Number(button.getAttribute("data-delete-book"))));
  });
}

async function createBook(event) {
  event.preventDefault();
  clearFeedback();

  if (!(createForm instanceof HTMLFormElement)) {
    return;
  }

  const formData = new FormData(createForm);
  const validationError = validateCreateForm(formData);

  if (validationError) {
    showFeedback(validationError, "error");
    return;
  }

  setLoading(createSubmit, true, '<i class="bi bi-cloud-arrow-up"></i><span>Upload Book</span>', "Uploading...");

  try {
    const result = await requestJson(API_BOOKS_URL, {
      method: "POST",
      headers: createRequestHeaders(),
      body: formData
    });

    createForm.reset();
    showFeedback(result.message || "Book uploaded successfully");
    await fetchBooks();
  } catch (error) {
    showFeedback(error.message || "Failed to upload book", "error");
  } finally {
    setLoading(createSubmit, false, '<i class="bi bi-cloud-arrow-up"></i><span>Upload Book</span>', "Uploading...");
  }
}

function openEditModal(bookId) {
  const book = books.find((item) => Number(item.id) === bookId);

  if (!book || !(editForm instanceof HTMLFormElement)) {
    return;
  }

  editForm.reset();
  editForm.elements.namedItem("id").value = book.id;
  editForm.elements.namedItem("title").value = book.title;
  editForm.elements.namedItem("level").value = book.level;
  editForm.elements.namedItem("description").value = book.description;
  editModal?.show();
}

async function updateBook(event) {
  event.preventDefault();
  clearFeedback();

  if (!(editForm instanceof HTMLFormElement)) {
    return;
  }

  const formData = new FormData(editForm);
  const bookId = Number(formData.get("id"));
  const validationError = validateEditForm(formData);

  if (!Number.isInteger(bookId) || bookId <= 0) {
    showFeedback("Valid book id is required.", "error");
    return;
  }

  if (validationError) {
    showFeedback(validationError, "error");
    return;
  }

  const pdf = formData.get("pdf");
  const cover = formData.get("cover");

  if (pdf instanceof File && !pdf.name) {
    formData.delete("pdf");
  }

  if (cover instanceof File && !cover.name) {
    formData.delete("cover");
  }

  setLoading(editSubmit, true, '<i class="bi bi-save2"></i><span>Save Changes</span>', "Saving...");

  try {
    const result = await requestJson(`${API_BOOKS_URL}/${bookId}`, {
      method: "PUT",
      headers: createRequestHeaders(),
      body: formData
    });

    editModal?.hide();
    showFeedback(result.message || "Book updated successfully");
    await fetchBooks();
  } catch (error) {
    showFeedback(error.message || "Failed to update book", "error");
  } finally {
    setLoading(editSubmit, false, '<i class="bi bi-save2"></i><span>Save Changes</span>', "Saving...");
  }
}

async function deleteBook(bookId) {
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return;
  }

  const book = books.find((item) => Number(item.id) === bookId);
  const confirmed = window.confirm(`Delete "${book?.title || "this book"}" permanently?`);

  if (!confirmed) {
    return;
  }

  clearFeedback();

  try {
    const result = await requestJson(`${API_BOOKS_URL}/${bookId}`, {
      method: "DELETE",
      headers: {
        ...createRequestHeaders(),
        Accept: "application/json"
      }
    });

    showFeedback(result.message || "Book deleted successfully");
    await fetchBooks();
  } catch (error) {
    showFeedback(error.message || "Failed to delete book", "error");
  }
}

async function init() {
  currentSession = enforceAdminAccess();

  if (!currentSession) {
    return;
  }

  setupTheme();
  editModal = editModalElement && window.bootstrap
    ? new window.bootstrap.Modal(editModalElement)
    : null;

  createForm?.addEventListener("submit", createBook);
  editForm?.addEventListener("submit", updateBook);

  try {
    await fetchBooks();
  } catch (error) {
    showFeedback(error.message || "Failed to load books", "error");
  }
}

init();
