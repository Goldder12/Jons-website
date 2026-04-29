const BASE_URL = "http://localhost:5500";

const sectionLabels = {
  dashboard: "Dashboard",
  orders: "Enrollments",
  products: "Courses",
  library: "Library",
  users: "Students",
};

const demoActivity = [
  {
    name: "Cleoz Armagan",
    email: "cleo.academy@gmail.com",
    role: "Academic Lead",
    joined: "5 Apr 2026",
    status: "Active",
  },
  {
    name: "Akong Rinaf Ray",
    email: "akong.rinaf@gmail.com",
    role: "Mentor",
    joined: "28 Mar 2026",
    status: "Pending",
  },
  {
    name: "Abigail Abaryo",
    email: "abigail.edu@gmail.com",
    role: "Admin",
    joined: "20 Mar 2026",
    status: "Review",
  },
  {
    name: "Chrisdila Myite",
    email: "christila@gmail.com",
    role: "Student Advisor",
    joined: "3 Feb 2026",
    status: "Active",
  },
];

const demoEnrollments = [
  {
    id: "ENR-2041",
    student: "Mahliyo Karimova",
    program: "IELTS Intensive",
    fee: "$320",
    status: "Pending",
    date: "24 Apr 2026",
  },
  {
    id: "ENR-2040",
    student: "Bekzod Tursunov",
    program: "Frontend Bootcamp",
    fee: "$410",
    status: "Active",
    date: "23 Apr 2026",
  },
  {
    id: "ENR-2038",
    student: "Shahnoza Aliyeva",
    program: "SAT Math Prep",
    fee: "$290",
    status: "Review",
    date: "22 Apr 2026",
  },
  {
    id: "ENR-2035",
    student: "Azizbek Rahimov",
    program: "Graphic Design",
    fee: "$260",
    status: "Active",
    date: "20 Apr 2026",
  },
];

const demoStudents = [
  {
    id: "STD-1001",
    name: "Madina Yusuf",
    email: "madina.yusuf@gmail.com",
    program: "English Foundation",
    joined: "12 Apr 2026",
    status: "Active",
  },
  {
    id: "STD-1002",
    name: "Jasur Eshonqulov",
    email: "jasur.dev@gmail.com",
    program: "Frontend Bootcamp",
    joined: "09 Apr 2026",
    status: "Pending",
  },
  {
    id: "STD-1003",
    name: "Sitora Mamatova",
    email: "sitora.math@gmail.com",
    program: "SAT Math Prep",
    joined: "01 Apr 2026",
    status: "Active",
  },
  {
    id: "STD-1004",
    name: "Ulugbek Norov",
    email: "ulugbek.ui@gmail.com",
    program: "UI UX Essentials",
    joined: "28 Mar 2026",
    status: "Offline",
  },
];

const navLinks = document.querySelectorAll(".nav-link[data-section]");
const sections = document.querySelectorAll(".section");
const headerTitle = document.getElementById("headerTitle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const themeToggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toast-container");
const THEME_KEY = "edu-dashboard-theme";

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
  const normalized = (status || "").toLowerCase();
  return `<span class="status-badge ${normalized}">${status || "-"}</span>`;
}

function showToast(message, type = "success") {
  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");
  const icon = document.createElement("span");
  const text = document.createElement("span");

  const icons = {
    success: "✔",
    error: "✖",
    info: "ℹ",
  };

  toast.className = `toast ${type}`;
  icon.className = "toast-icon";
  text.className = "toast-message";
  icon.textContent = icons[type] || icons.info;
  text.textContent = message;

  toast.append(icon, text);
  toastContainer.appendChild(toast);

  const timers = {
    hide: null,
    remove: null,
  };

  const startHideTimer = () => {
    timers.hide = window.setTimeout(() => {
      toast.classList.remove("show");
      timers.remove = window.setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  const clearHideTimer = () => {
    if (timers.hide) {
      window.clearTimeout(timers.hide);
      timers.hide = null;
    }

    if (timers.remove) {
      window.clearTimeout(timers.remove);
      timers.remove = null;
    }
  };

  window.setTimeout(() => {
    toast.classList.add("show");
    startHideTimer();
  }, 10);

  toast.addEventListener("mouseenter", clearHideTimer);
  toast.addEventListener("mouseleave", () => {
    clearHideTimer();
    startHideTimer();
  });
}

function renderDashboardActivity() {
  const tbody = document.getElementById("dashboard-activity-tbody");

  tbody.innerHTML = demoActivity
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.role}</td>
          <td>${item.joined}</td>
          <td>${createStatusBadge(item.status)}</td>
        </tr>`,
    )
    .join("");
}

function renderEnrollments() {
  const tbody = document.getElementById("orders-tbody");

  tbody.innerHTML = demoEnrollments
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.student}</td>
          <td>${item.program}</td>
          <td>${item.fee}</td>
          <td>${createStatusBadge(item.status)}</td>
          <td>${item.date}</td>
        </tr>`,
    )
    .join("");
}

function renderStudents() {
  const tbody = document.getElementById("users-tbody");

  tbody.innerHTML = demoStudents
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.program}</td>
          <td>${item.joined}</td>
          <td>${createStatusBadge(item.status)}</td>
        </tr>`,
    )
    .join("");
}

function setDashboardStats(courseCount = 24) {
  document.getElementById("stat-products").textContent = courseCount;
  document.getElementById("stat-orders").textContent = "2,860";
  document.getElementById("stat-revenue").textContent = "$52,000";
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

  if (headerTitle) {
    headerTitle.textContent = sectionLabels[name] || "Dashboard";
  }

  if (name === "products") {
    loadProducts();
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

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);
themeToggle.addEventListener("click", toggleTheme);

function renderProducts(products) {
  const tbody = document.getElementById("products-tbody");

  if (!Array.isArray(products) || !products.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No courses found yet.</td></tr>`;
    setDashboardStats(0);
    return;
  }

  tbody.innerHTML = products
    .map(
      (product) => `
        <tr>
          <td title="${product.id}">${product.id}</td>
          <td>${product.name || "-"}</td>
          <td>${product.category || "-"}</td>
          <td>$${Number(product.price || 0).toFixed(2)}</td>
          <td>${product.stock ?? "-"}</td>
          <td class="actions-cell">
            <button class="btn btn-edit" onclick="openEditModal('${product.id}')">Edit</button>
            <button class="btn btn-danger" onclick="openDeleteModal('${product.id}', '${(product.name || "").replace(/'/g, "\\'")}')">Delete</button>
          </td>
        </tr>`,
    )
    .join("");

  setDashboardStats(products.length);
}

async function loadProducts() {
  const tbody = document.getElementById("products-tbody");
  tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Loading courses...</td></tr>`;

  try {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load courses.");
    }

    const data = await response.json();
    renderProducts(data.data || []);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Course backend ulanmagan. Hozircha faqat dizayn tayyor.</td></tr>`;
    setDashboardStats(24);
  }
}

document
  .getElementById("addProductBtn")
  .addEventListener("click", openCreateModal);

const productModalOverlay = document.getElementById("productModalOverlay");
const productForm = document.getElementById("productForm");
const productModalTitle = document.getElementById("productModalTitle");
const productModalSubmit = document.getElementById("productModalSubmit");

function openCreateModal() {
  productModalTitle.textContent = "Add Course";
  productModalSubmit.textContent = "Create Course";
  productForm.reset();
  clearFormErrors();
  document.getElementById("productId").value = "";
  productModalOverlay.classList.add("open");
}

async function openEditModal(id) {
  productModalTitle.textContent = "Edit Course";
  productModalSubmit.textContent = "Save Changes";
  clearFormErrors();
  document.getElementById("productId").value = id;

  const response = await fetch(`${BASE_URL}/api/products/${id}`);
  const data = await response.json();
  const product = data.data;

  document.getElementById("productName").value = product.name || "";
  document.getElementById("productCategory").value = product.category || "";
  document.getElementById("productDescription").value = product.description || "";
  document.getElementById("productPrice").value = product.price ?? "";
  document.getElementById("productStock").value = product.stock ?? "";
  document.getElementById("productImageUrl").value = product.image_url || "";

  productModalOverlay.classList.add("open");
}

function closeProductModal() {
  productModalOverlay.classList.remove("open");
  productForm.reset();
  clearFormErrors();
}

document
  .getElementById("productModalClose")
  .addEventListener("click", closeProductModal);
document
  .getElementById("productModalCancel")
  .addEventListener("click", closeProductModal);
productModalOverlay.addEventListener("click", (event) => {
  if (event.target === productModalOverlay) {
    closeProductModal();
  }
});

function clearFormErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });

  document.querySelectorAll(".modal-form input, .modal-form textarea, .modal-form select").forEach((el) => {
    el.classList.remove("invalid");
  });
}

function setFieldError(fieldId, errId, message) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(errId);

  if (input) {
    input.classList.add("invalid");
  }

  if (err) {
    err.textContent = message;
  }
}

function validateProductForm() {
  clearFormErrors();
  let valid = true;

  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value.trim();
  const price = document.getElementById("productPrice").value;
  const stock = document.getElementById("productStock").value;

  if (!name) {
    setFieldError("productName", "err-name", "Course name is required.");
    valid = false;
  }

  if (!category) {
    setFieldError("productCategory", "err-category", "Category is required.");
    valid = false;
  }

  if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) {
    setFieldError("productPrice", "err-price", "Enter a valid course price.");
    valid = false;
  }

  if (stock === "" || Number.isNaN(Number(stock)) || Number(stock) < 0) {
    setFieldError("productStock", "err-stock", "Enter a valid seat count.");
    valid = false;
  }

  return valid;
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateProductForm()) {
    return;
  }

  const id = document.getElementById("productId").value;

  const formData = {
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value),
    image_url: document.getElementById("productImageUrl").value.trim(),
  };

  productModalSubmit.disabled = true;
  productModalSubmit.textContent = "Saving...";

  try {
    if (id) {
      await onUpdateProduct(id, formData);
    } else {
      await onCreateProduct(formData);
    }

    closeProductModal();
    loadProducts();
  } finally {
    productModalSubmit.disabled = false;
    productModalSubmit.textContent = id ? "Save Changes" : "Create Course";
  }
});

const deleteModalOverlay = document.getElementById("deleteModalOverlay");
let pendingDeleteId = null;

function openDeleteModal(id, name) {
  pendingDeleteId = id;
  document.getElementById("deleteProductName").textContent = name || "this course";
  deleteModalOverlay.classList.add("open");
}

function closeDeleteModal() {
  deleteModalOverlay.classList.remove("open");
  pendingDeleteId = null;
}

document
  .getElementById("deleteModalClose")
  .addEventListener("click", closeDeleteModal);
document
  .getElementById("deleteModalCancel")
  .addEventListener("click", closeDeleteModal);
deleteModalOverlay.addEventListener("click", (event) => {
  if (event.target === deleteModalOverlay) {
    closeDeleteModal();
  }
});

document
  .getElementById("deleteModalConfirm")
  .addEventListener("click", async () => {
    if (!pendingDeleteId) {
      return;
    }

    const btn = document.getElementById("deleteModalConfirm");
    btn.disabled = true;
    btn.textContent = "Deleting...";

    try {
      await onDeleteProduct(pendingDeleteId);
      closeDeleteModal();
      loadProducts();
    } finally {
      btn.disabled = false;
      btn.textContent = "Yes, Delete";
    }
  });

async function onCreateProduct(data) {
  const response = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const value = await response.json();
  showToast(value.message || "Course created successfully!", "success");
}

async function onUpdateProduct(id, data) {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const value = await response.json();
  showToast(value.message || "Course updated successfully!", "success");
}

async function onDeleteProduct(id) {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const value = await response.json();
  showToast(value.message || "Course deleted successfully!", "info");
}

const DEFAULT_BOOK_IMAGE = "default-book.png";
const DEFAULT_BOOK_PREVIEW = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
    <defs>
      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d97b41" />
        <stop offset="100%" stop-color="#c95a52" />
      </linearGradient>
    </defs>
    <rect width="480" height="600" rx="36" fill="url(#bookGradient)" />
    <rect x="34" y="34" width="412" height="532" rx="28" fill="rgba(255,255,255,0.12)" />
    <text x="52" y="118" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700">Library</text>
    <text x="52" y="210" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700">Default Book</text>
    <text x="52" y="520" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="24">John Academy</text>
  </svg>
`)}`;

const bookGrid = document.getElementById("book-grid");
const addBookBtn = document.getElementById("addBookBtn");
const bookSearchInput = document.getElementById("bookSearchInput");
const bookLevelFilter = document.getElementById("bookLevelFilter");
const bookModalOverlay = document.getElementById("bookModalOverlay");
const bookModal = document.getElementById("bookModal");
const bookForm = document.getElementById("bookForm");
const bookModalTitle = document.getElementById("bookModalTitle");
const bookModalSubmit = document.getElementById("bookModalSubmit");
const bookPdfInput = document.getElementById("bookPdf");
const bookPdfHint = document.getElementById("bookPdfHint");
const bookImageInput = document.getElementById("bookImage");
const bookImagePreview = document.getElementById("bookImagePreview");
const deleteBookModalOverlay = document.getElementById("deleteBookModalOverlay");
const deleteBookModalConfirm = document.getElementById("deleteBookModalConfirm");

let pendingBookDeleteId = null;
let currentBookImageValue = DEFAULT_BOOK_IMAGE;
let currentBookPdfValue = "";
let currentBookObjectUrl = "";

function normalizeBookLevel(level) {
  return (level || "").toUpperCase().startsWith("CEFR") ? "CEFR" : level || "IELTS";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveBookImage(image) {
  if (!image || image === DEFAULT_BOOK_IMAGE) {
    return DEFAULT_BOOK_PREVIEW;
  }

  if (image.startsWith("data:") || image.startsWith("http")) {
    return image;
  }

  return `${BASE_URL}/${image.replace(/^\/+/, "")}`;
}

function getPdfFileName(pdfPath) {
  return (pdfPath || "").split("/").pop() || "No PDF selected";
}

function updateBookPreview(src) {
  bookImagePreview.src = src || DEFAULT_BOOK_PREVIEW;
}

function resetBookObjectUrl() {
  if (currentBookObjectUrl) {
    URL.revokeObjectURL(currentBookObjectUrl);
    currentBookObjectUrl = "";
  }
}

function renderBooks(payload) {
  if (!bookGrid) {
    return;
  }

  const books = Array.isArray(payload?.data) ? payload.data : [];
  const searchValue = (bookSearchInput?.value || "").trim().toLowerCase();
  const levelValue = bookLevelFilter?.value || "All";

  const filteredBooks = books.filter((book) => {
    const matchesSearch = (book.title || "").toLowerCase().includes(searchValue);
    const matchesLevel =
      levelValue === "All" ? true : normalizeBookLevel(book.level) === levelValue;

    return matchesSearch && matchesLevel;
  });

  if (!filteredBooks.length) {
    bookGrid.innerHTML = `<div class="book-empty">No books found for the current search or level filter.</div>`;
    return;
  }

  bookGrid.innerHTML = filteredBooks
    .map(
      (book) => `
        <article
          class="panel book-card"
          data-book-card="true"
          data-book-id="${book.id}"
          data-book-title="${escapeHtml(book.title)}"
          data-book-author="${escapeHtml(book.author)}"
          data-book-level="${escapeHtml(book.level)}"
          data-book-pdf="${escapeHtml(book.pdf)}"
          data-book-image="${escapeHtml(book.image || DEFAULT_BOOK_IMAGE)}"
        >
          <img
            class="book-card-cover"
            src="${escapeHtml(resolveBookImage(book.image))}"
            alt="${escapeHtml(book.title)} cover"
            onerror="this.onerror=null;this.src='${DEFAULT_BOOK_PREVIEW}'"
          />
          <div class="book-card-body">
            <div class="book-card-copy">
              <h3>${escapeHtml(book.title)}</h3>
              <p>${escapeHtml(book.author)}</p>
            </div>

            <div class="book-card-meta">
              <span class="book-badge">${escapeHtml(book.level)}</span>
              <span class="book-badge">PDF Ready</span>
            </div>

            <div class="book-card-actions">
              <button class="btn btn-edit btn-shine book-action" type="button" data-book-action="edit">
                Edit
              </button>
              <button class="btn btn-danger btn-shine book-action" type="button" data-book-action="delete">
                Delete
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

async function loadBooks() {
  if (!bookGrid) {
    return;
  }

  bookGrid.innerHTML = `<div class="book-empty">Loading books...</div>`;

  try {
    const res = await fetch(`${BASE_URL}/api/books`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load books.");
    }

    renderBooks(data);
  } catch (error) {
    bookGrid.innerHTML = `<div class="book-empty">Book backend is not available yet.</div>`;
  }
}

function clearBookFormErrors() {
  clearFormErrors();
  bookPdfInput?.classList.remove("invalid");
}

function clearBookFormState() {
  resetBookObjectUrl();
  currentBookImageValue = DEFAULT_BOOK_IMAGE;
  currentBookPdfValue = "";
  bookForm.reset();
  document.getElementById("bookId").value = "";
  clearBookFormErrors();
  bookPdfHint.textContent = "PDF is required for new books.";
  updateBookPreview(DEFAULT_BOOK_PREVIEW);
}

function openCreateBookModal() {
  bookModalTitle.textContent = "Add Book";
  bookModalSubmit.textContent = "Create Book";
  clearBookFormState();
  bookModal.style.display = "block";
  document.getElementById("bookModalOverlay").classList.add("open");
}

function closeBookModal() {
  bookModalOverlay.classList.remove("open");
  bookModal.style.display = "none";
  clearBookFormState();
}

function openEditBookModal(trigger) {
  const card = trigger.closest("[data-book-card]");
  if (!card) {
    return;
  }

  bookModalTitle.textContent = "Edit Book";
  bookModalSubmit.textContent = "Save Changes";
  clearBookFormErrors();
  resetBookObjectUrl();
  bookForm.reset();

  document.getElementById("bookId").value = card.dataset.bookId || "";
  document.getElementById("bookTitle").value = card.dataset.bookTitle || "";
  document.getElementById("bookAuthor").value = card.dataset.bookAuthor || "";
  document.getElementById("bookLevel").value = card.dataset.bookLevel || "";
  currentBookPdfValue = card.dataset.bookPdf || "";
  currentBookImageValue = card.dataset.bookImage || DEFAULT_BOOK_IMAGE;

  bookPdfHint.textContent = `Current PDF: ${getPdfFileName(currentBookPdfValue)}`;
  updateBookPreview(resolveBookImage(currentBookImageValue));
  bookModal.style.display = "block";
  bookModalOverlay.classList.add("open");
}

function openDeleteBookModal(trigger) {
  const card = trigger.closest("[data-book-card]");
  if (!card) {
    return;
  }

  pendingBookDeleteId = card.dataset.bookId;
  document.getElementById("deleteBookName").textContent = card.dataset.bookTitle || "this book";
  deleteBookModalOverlay.classList.add("open");
}

function closeDeleteBookModal() {
  deleteBookModalOverlay.classList.remove("open");
  pendingBookDeleteId = null;
}

function setBookFieldError(fieldId, errId, message) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(errId);

  if (input) {
    input.classList.add("invalid");
  }

  if (err) {
    err.textContent = message;
  }
}

function validateBookForm() {
  clearBookFormErrors();
  let valid = true;

  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const level = document.getElementById("bookLevel").value;
  const hasPdfFile = Boolean(bookPdfInput.files?.[0]);
  const hasExistingPdf = Boolean(currentBookPdfValue);

  if (!title) {
    setBookFieldError("bookTitle", "book-err-title", "Book title is required.");
    valid = false;
  }

  if (!author) {
    setBookFieldError("bookAuthor", "book-err-author", "Author is required.");
    valid = false;
  }

  if (!level) {
    setBookFieldError("bookLevel", "book-err-level", "Please select a level.");
    valid = false;
  }

  if (!hasPdfFile && !hasExistingPdf) {
    setBookFieldError("bookPdf", "book-err-pdf", "PDF is required.");
    valid = false;
  }

  return valid;
}

function buildBookPayload() {
  const formData = new FormData();

  formData.append("title", document.getElementById("bookTitle").value.trim());
  formData.append("author", document.getElementById("bookAuthor").value.trim());
  formData.append("level", document.getElementById("bookLevel").value);

  if (bookPdfInput.files?.[0]) {
    formData.append("pdf", bookPdfInput.files[0]);
  }

  if (bookImageInput.files?.[0]) {
    formData.append("image", bookImageInput.files[0]);
  }

  return formData;
}

async function onCreateBook(data) {
  const response = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    body: data,
  });

  const value = await response.json();
  if (!response.ok) {
    throw new Error(value.message || "Failed to create book.");
  }

  showToast(value.message || "Book created successfully!", "success");
}

async function onUpdateBook(id, data) {
  const response = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "PUT",
    body: data,
  });

  const value = await response.json();
  if (!response.ok) {
    throw new Error(value.message || "Failed to update book.");
  }

  showToast(value.message || "Book updated successfully!", "success");
}

async function onDeleteBook(id) {
  const response = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "DELETE",
  });

  const value = await response.json();
  if (!response.ok) {
    throw new Error(value.message || "Failed to delete book.");
  }

  showToast(value.message || "Book deleted successfully!", "info");
}

addBookBtn?.addEventListener("click", () => {
    console.log("clicked");
    openCreateBookModal();
  });

bookSearchInput?.addEventListener("input", loadBooks);
bookLevelFilter?.addEventListener("change", loadBooks);

bookGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-book-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.bookAction;

  if (action === "edit") {
    openEditBookModal(button);
  }

  if (action === "delete") {
    openDeleteBookModal(button);
  }
});

document.getElementById("bookModalClose")?.addEventListener("click", closeBookModal);
document.getElementById("bookModalCancel")?.addEventListener("click", closeBookModal);
bookModalOverlay?.addEventListener("click", (event) => {
  if (event.target === bookModalOverlay) {
    closeBookModal();
  }
});

bookPdfInput?.addEventListener("change", () => {
  const selectedFile = bookPdfInput.files?.[0];
  bookPdfHint.textContent = selectedFile
    ? `Selected PDF: ${selectedFile.name}`
    : currentBookPdfValue
      ? `Current PDF: ${getPdfFileName(currentBookPdfValue)}`
      : "PDF is required for new books.";
});

bookImageInput?.addEventListener("change", () => {
  const file = bookImageInput.files?.[0];

  resetBookObjectUrl();

  if (!file) {
    updateBookPreview(resolveBookImage(currentBookImageValue));
    return;
  }

  currentBookObjectUrl = URL.createObjectURL(file);
  updateBookPreview(currentBookObjectUrl);
});

bookForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateBookForm()) {
    return;
  }

  const id = document.getElementById("bookId").value;
  bookModalSubmit.disabled = true;
  bookModalSubmit.textContent = "Saving...";

  try {
    const payload = buildBookPayload();

    if (id) {
      await onUpdateBook(id, payload);
    } else {
      await onCreateBook(payload);
    }

    closeBookModal();
    await loadBooks();
  } catch (error) {
    showToast(error.message || "Something went wrong while saving the book.", "error");
  } finally {
    bookModalSubmit.disabled = false;
    bookModalSubmit.textContent = id ? "Save Changes" : "Create Book";
  }
});

document.getElementById("deleteBookModalClose")?.addEventListener("click", closeDeleteBookModal);
document.getElementById("deleteBookModalCancel")?.addEventListener("click", closeDeleteBookModal);
deleteBookModalOverlay?.addEventListener("click", (event) => {
  if (event.target === deleteBookModalOverlay) {
    closeDeleteBookModal();
  }
});

deleteBookModalConfirm?.addEventListener("click", async () => {
  if (!pendingBookDeleteId) {
    return;
  }

  deleteBookModalConfirm.disabled = true;
  deleteBookModalConfirm.textContent = "Deleting...";

  try {
    await onDeleteBook(pendingBookDeleteId);
    closeDeleteBookModal();
    await loadBooks();
  } catch (error) {
    showToast(error.message || "Something went wrong while deleting the book.", "error");
  } finally {
    deleteBookModalConfirm.disabled = false;
    deleteBookModalConfirm.textContent = "Yes, Delete";
  }
});

renderDashboardActivity();
renderEnrollments();
renderStudents();
setDashboardStats();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
showSection("dashboard");

window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
