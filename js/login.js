import { adminCredentials, authStorageKey } from "../data/login_data.js";

const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#login-error");

function redirectToDashboard() {
  window.location.href = "../html/index.html";
}

function setSession() {
  localStorage.setItem(
    authStorageKey,
    JSON.stringify({
      username: adminCredentials.username,
      role: "admin",
      isAuthenticated: true
    })
  );
}

function hasActiveSession() {
  try {
    const savedSession = JSON.parse(localStorage.getItem(authStorageKey) || "null");
    return Boolean(savedSession?.isAuthenticated);
  } catch {
    return false;
  }
}

if (hasActiveSession()) {
  redirectToDashboard();
}

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    loginError.textContent = "";
    setSession();
    redirectToDashboard();
    return;
  }

  loginError.textContent = "Login yoki parol noto'g'ri.";
});
