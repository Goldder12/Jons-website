import { groupsData } from "../data/group_data.js";
import { dualigoPromptsData } from "../data/dualigo_prompts_data.js";

const navigationItems = [
  { id: "home", label: "Home", icon: "home", href: "../html/index.html" },
  { id: "students", label: "Students", icon: "users", href: "../html/oquvchi.html" },
  { id: "dualigo", label: "Dualigo", icon: "book", href: "../html/dualigo.html" }
];

const navList = document.querySelector("#nav-list");
const themeToggle = document.querySelector("#theme-toggle");
const groupList = document.querySelector("#dualigo-group-list");
const groupCount = document.querySelector("#group-count");
const searchInput = document.querySelector("#dualigo-search");
const PROMPT_STORAGE_KEY = "dualigo-group-prompts";

function createPromptStore() {
  return dualigoPromptsData.reduce((store, entry) => {
    store[entry.groupId] = Array.isArray(entry.prompts) ? [...entry.prompts] : [];
    return store;
  }, {});
}

function getStoredPrompts() {
  try {
    const storedPrompts = localStorage.getItem(PROMPT_STORAGE_KEY);
    const parsedPrompts = JSON.parse(storedPrompts ?? "{}");
    const seededPrompts = createPromptStore();

    if (!parsedPrompts || typeof parsedPrompts !== "object") {
      return seededPrompts;
    }

    Object.entries(parsedPrompts).forEach(([groupId, prompts]) => {
      seededPrompts[groupId] = Array.isArray(prompts) ? prompts.filter(Boolean) : seededPrompts[groupId] ?? [];
    });

    return seededPrompts;
  } catch (error) {
    return createPromptStore();
  }
}

function saveStoredPrompt(groupId, promptItems) {
  const promptStore = getStoredPrompts();
  promptStore[groupId] = promptItems;
  localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(promptStore));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function syncThemeToggle(theme) {
  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  syncThemeToggle(theme);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("skillset-theme");
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("skillset-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function renderNavigation() {
  navList.innerHTML = navigationItems
    .map(
      (item) => `
        <li>
          <a
            class="nav-link ${item.id === "dualigo" ? "is-active" : ""}"
            href="${item.href ?? "#"}"
            data-nav="${item.id}"
            aria-label="${item.label}"
            title="${item.label}"
          >
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
            <span class="nav-label">${item.label}</span>
          </a>
        </li>
      `
    )
    .join("");
}

function createGroupCard(group) {
  const savedPrompts = getStoredPrompts();
  const prompts = savedPrompts[group.id] ?? [];
  const promptItems = prompts.length
    ? prompts
        .map(
          (prompt, index) => `
            <li class="dualigo-prompt-item">
              <span>${escapeHtml(prompt)}</span>
              <button class="dualigo-delete-button" type="button" data-delete-prompt="${group.id}" data-prompt-index="${index}">
                O'chirish
              </button>
            </li>
          `
        )
        .join("")
    : '<li class="dualigo-prompt-empty">Hali gap qo\'shilmagan.</li>';
  const promptSummary = prompts.length
    ? `${prompts.length} ta qo'shilgan gap`
    : "Qo'shilgan gaplar yo'q";

  return `
    <article class="dualigo-group-card">
      <div class="dualigo-group-copy">
        <h3>${group.title}</h3>
        <p>${group.description}</p>
        <div class="dualigo-group-meta">
          <span>${group.level}</span>
          <span>${group.teacher}</span>
          <span>${group.subtitle}</span>
          <span>${group.studentsCount} students</span>
        </div>
      </div>
      <div class="dualigo-prompt-builder is-open" data-prompt-builder="${group.id}">
        <label class="dualigo-prompt-label" for="dualigo-prompt-${group.id}">Mos gap yoki so'z birikmasi yozing</label>
        <textarea
          class="dualigo-prompt-input"
          id="dualigo-prompt-${group.id}"
          data-prompt-input="${group.id}"
          placeholder="Masalan: Beginner English guruhi uchun oddiy salomlashish va kundalik so'zlar..."
          rows="4"
        ></textarea>
        <details class="dualigo-prompt-dropdown ${prompts.length ? "" : "is-empty"}">
          <summary class="dualigo-prompt-summary">${promptSummary}</summary>
          <ul class="dualigo-prompt-list" data-prompt-list="${group.id}">
            ${promptItems}
          </ul>
        </details>
        <div class="dualigo-prompt-footer">
          <p class="dualigo-prompt-note">Keyinchalik shu matn asosida o'quvchilar o'z guruhi va darajasiga mos ishlaydi.</p>
          <button class="dualigo-save-button" type="button" data-save-prompt="${group.id}">Matn yaratish</button>
        </div>
      </div>
    </article>
  `;
}

function renderGroups(groups) {
  groupCount.textContent = `${groups.length} groups`;

  if (!groups.length) {
    groupList.innerHTML = '<div class="empty-state">Hech qanday guruh topilmadi.</div>';
    return;
  }

  groupList.innerHTML = groups.map(createGroupCard).join("");
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    renderGroups(getFilteredGroups());
  });
}

function setupPromptComposer() {
  groupList.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-prompt]");
    if (saveButton) {
      const groupId = saveButton.getAttribute("data-save-prompt");
      const promptInput = groupList.querySelector(`[data-prompt-input="${groupId}"]`);

      if (!promptInput) {
        return;
      }

      const prompt = promptInput.value.trim();
      if (!prompt) {
        promptInput.focus();
        return;
      }

      const prompts = getStoredPrompts();
      const groupPrompts = prompts[groupId] ?? [];
      groupPrompts.push(prompt);
      saveStoredPrompt(groupId, groupPrompts);
      renderGroups(getFilteredGroups());

      const nextInput = groupList.querySelector(`[data-prompt-input="${groupId}"]`);
      nextInput?.focus();
      saveButton.textContent = "Qo'shildi";

      window.setTimeout(() => {
        const refreshedButton = groupList.querySelector(`[data-save-prompt="${groupId}"]`);
        if (refreshedButton) {
          refreshedButton.textContent = "Matn yaratish";
        }
      }, 1200);

      return;
    }

    const deleteButton = event.target.closest("[data-delete-prompt]");
    if (!deleteButton) {
      return;
    }

    const groupId = deleteButton.getAttribute("data-delete-prompt");
    const promptIndex = Number.parseInt(deleteButton.getAttribute("data-prompt-index") ?? "-1", 10);
    const prompts = getStoredPrompts();
    const groupPrompts = prompts[groupId] ?? [];

    if (promptIndex < 0 || promptIndex >= groupPrompts.length) {
      return;
    }

    groupPrompts.splice(promptIndex, 1);
    saveStoredPrompt(groupId, groupPrompts);
    renderGroups(getFilteredGroups());
  });
}

function getFilteredGroups() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    return groupsData;
  }

  return groupsData.filter((group) => {
    return [
      group.title,
      group.teacher,
      group.level,
      group.subtitle
    ].some((value) => value.toLowerCase().includes(query));
  });
}

renderNavigation();
renderGroups(groupsData);
setupSearch();
setupPromptComposer();
setupThemeToggle();
