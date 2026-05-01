const textSwitcherBtn = document.getElementById("text-switcher-btn");
const heading = document.querySelector("h2");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameField = document.getElementById("usernameField");
const form = document.getElementById("form");
const formDescription = document.getElementById("formDescription");
const toastContainer = document.getElementById("toast-container");

function removeToast(toast) {
  toast.classList.remove("show");
  setTimeout(() => toast.remove(), 400);
}

function showToast(message, type = "info") {
  if (!toastContainer) {
    return;
  }

  const icons = {
    success: "&#10003;",
    error: "&#10005;",
    info: "&#9432;"
  };

  const titles = {
    success: "Success",
    error: "Error",
    info: "Notice"
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <div class="toast-body">
      <span class="toast-title">${icons[type] || icons.info} ${titles[type] || titles.info}</span>
      <span class="toast-message">${message}</span>
    </div>
    <button type="button" aria-label="Close notification">&times;</button>
    <span class="toast-progress"></span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  const closeButton = toast.querySelector("button");
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

textSwitcherBtn.addEventListener("click", function () {
  if (heading.textContent === "Login") {
    switcher(
      "Sign up",
      "Already have an account? Login",
      true,
      "Create your profile and start using the platform."
    );
  } else {
    switcher(
      "Login",
      "Don't have an account? Sign up",
      false,
      "Access your account and continue your workflow."
    );
  }
});

function switcher(title, switchText, showUsername, description) {
  form.classList.remove("form-switching");
  void form.offsetWidth;
  form.classList.add("form-switching");

  loginBtn.value = title;
  heading.textContent = title;
  textSwitcherBtn.value = switchText;
  formDescription.textContent = description;

  if (showUsername) {
    usernameField.classList.remove("is-collapsed");
  } else {
    usernameField.classList.add("is-collapsed");
  }
}

form.addEventListener("animationend", function () {
  form.classList.remove("form-switching");
});

loginBtn.addEventListener("click", function () {
  if (loginBtn.value === "Sign up") {
    register();
  } else {
    login();
  }
});

async function register() {
  try {
    if (!usernameInput.value || !emailInput.value || !passwordInput.value) {
      showToast("All fields are required", "error");
      return;
    }

    const response = await fetch("http://localhost:5500/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }

    passwordInput.value = "";
    emailInput.value = "";
    usernameInput.value = "";
    showToast(data.message || "Account created successfully!", "success");

    setTimeout(() => {
      window.location.href = "../admin/index.html";
    }, 700);
  } catch (error) {
    console.error("Network error:", error);
    showToast("Server bilan bog'lanib bo'lmadi", "error");
  }
}

async function login() {
  try {
    if (!emailInput.value || !passwordInput.value) {
      showToast("All fields are required", "error");
      return;
    }

    const response = await fetch("http://localhost:5500/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Invalid email or password", "error");
      return;
    }

    passwordInput.value = "";
    emailInput.value = "";
    showToast(data.message || "Login successful!", "success");
  } catch (error) {
    console.error("Network error:", error);
    showToast("Server bilan bog'lanib bo'lmadi", "error");
  }
}

function statusAlerts(code) {
  showToast(code, "info");
}
