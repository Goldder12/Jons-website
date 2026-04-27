const BASE_URL = "http://localhost:5501";

const sectionLabels = {
  dashboard: "Dashboard",
  orders: "Enrollments",
  products: "Courses",
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

function createStatusBadge(status) {
  const normalized = (status || "").toLowerCase();
  return `<span class="status-badge ${normalized}">${status || "-"}</span>`;
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

  document.querySelectorAll(".modal-form input, .modal-form textarea").forEach((el) => {
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
  alert(value.message);
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
  alert(value.message);
}

async function onDeleteProduct(id) {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const value = await response.json();
  alert(value.message);
}

renderDashboardActivity();
renderEnrollments();
renderStudents();
setDashboardStats();
showSection("dashboard");

window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
