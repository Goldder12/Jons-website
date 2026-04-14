import { adminCredentials, studentCredentials, authStorageKey } from "../data/login_data.js";

const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#login-error");

const supportedCredentials = [adminCredentials, studentCredentials];

function normalizeTargetPage(redirectTo, fallbackPage) {
  if (typeof redirectTo !== "string" || !redirectTo.trim()) {
    return fallbackPage;
  }

  const normalized = redirectTo.replace(/\\/g, "/").split("/").filter(Boolean).pop();
  return normalized || fallbackPage;
}

function redirectToDashboard(redirectTo = "index.html") {
  const targetPage = normalizeTargetPage(redirectTo, "index.html");
  window.location.href = `./html/${targetPage}`;
}

function setSession(user) {
  localStorage.setItem(
    authStorageKey,
    JSON.stringify({
      username: user.username,
      role: user.role,
      displayName: user.displayName ?? user.username,
      groupId: user.groupId ?? null,
      redirectTo: user.redirectTo,
      isAuthenticated: true
    })
  );
}

function getActiveSession() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || "null");
  } catch {
    return null;
  }
}

const activeSession = getActiveSession();

if (activeSession?.isAuthenticated) {
  redirectToDashboard(activeSession.redirectTo);
}

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const matchedUser = supportedCredentials.find(
    (user) => user.username === username && user.password === password
  );

  if (matchedUser) {
    loginError.textContent = "";
    setSession(matchedUser);
    redirectToDashboard(matchedUser.redirectTo);
    return;
  }

  loginError.textContent = "Login yoki parol noto'g'ri.";
});
