import { authStorageKey } from "../data/login_data.js";
import {
  getUsers,
  findUserByEmail,
  findUserByEmailAndPassword,
  findUserByUsername,
  registerUser
} from "../data/users_data.js";

const authScreen = document.getElementById("auth-screen");
const adminShell = document.getElementById("admin-shell");
const loginPanel = document.getElementById("login-panel");
const registerPanel = document.getElementById("register-panel");
const showLoginButton = document.getElementById("show-login");
const showRegisterButton = document.getElementById("show-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginFeedback = document.getElementById("login-feedback");
const registerFeedback = document.getElementById("register-feedback");
const loginEmailInput = document.getElementById("login-email");

let dashboardBootPromise = null;

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  const sessionUser = {
    ...user,
    isAuthenticated: true,
    displayName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username
  };

  localStorage.setItem(authStorageKey, JSON.stringify(sessionUser));
}

function redirectToStudent() {
  window.location.href = "./student.html";
}

function redirectToAdmin() {
  window.location.href = "./index.html";
}

function setFeedback(target, message = "", type = "") {
  if (!target) {
    return;
  }

  target.textContent = message;
  target.classList.remove("is-error", "is-success");

  if (type) {
    target.classList.add(type === "error" ? "is-error" : "is-success");
  }
}

function showMode(mode) {
  const isLogin = mode === "login";

  loginPanel?.classList.toggle("d-none", !isLogin);
  registerPanel?.classList.toggle("d-none", isLogin);
  showLoginButton?.classList.toggle("is-active", isLogin);
  showRegisterButton?.classList.toggle("is-active", !isLogin);

  setFeedback(loginFeedback);
  setFeedback(registerFeedback);
}

function showAdminDashboard() {
  authScreen?.classList.add("d-none");
  adminShell?.classList.remove("d-none");

  if (!dashboardBootPromise) {
    dashboardBootPromise = import("./index.js");
  }
}

function handleInitialRoute() {
  const currentUser = getCurrentUser();

  if (!currentUser?.isAuthenticated) {
    showMode("login");
    return;
  }

  if (currentUser.role === "student") {
    redirectToStudent();
    return;
  }

  if (currentUser.role === "admin") {
    showAdminDashboard();
    return;
  }

  localStorage.removeItem(authStorageKey);
  showMode("login");
}

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    setFeedback(loginFeedback, "Email and password are required.", "error");
    return;
  }

  const matchedUser = findUserByEmailAndPassword(email, password);

  if (!matchedUser) {
    setFeedback(loginFeedback, "Invalid email or password.", "error");
    return;
  }

  setCurrentUser(matchedUser);
  setFeedback(loginFeedback);

  if (matchedUser.role === "student") {
    redirectToStudent();
    return;
  }

  showAdminDashboard();
}

function handleRegister(event) {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!firstName || !lastName || !username || !phone || !email || !password) {
    setFeedback(registerFeedback, "All fields are required.", "error");
    return;
  }

  if (findUserByEmail(email)) {
    setFeedback(registerFeedback, "This email is already registered.", "error");
    return;
  }

  if (findUserByUsername(username)) {
    setFeedback(registerFeedback, "This username is already taken.", "error");
    return;
  }

  const nextUser = registerUser({
    role: "student",
    firstName,
    lastName,
    username,
    phone,
    email,
    password,
    groupId: "ielts-morning",
    group: "IELTS Morning Group",
    avatar: "https://i.pravatar.cc/150?img=47"
  });

  setFeedback(registerFeedback, "Registration completed. You can log in now.", "success");
  registerForm.reset();
  showMode("login");

  if (loginEmailInput instanceof HTMLInputElement) {
    loginEmailInput.value = nextUser.email;
    loginEmailInput.focus();
  }
}

function setupAuthInteractions() {
  getUsers();

  showLoginButton?.addEventListener("click", () => {
    showMode("login");
  });

  showRegisterButton?.addEventListener("click", () => {
    showMode("register");
  });

  loginForm?.addEventListener("submit", handleLogin);
  registerForm?.addEventListener("submit", handleRegister);
}

setupAuthInteractions();
handleInitialRoute();
