import { getGroupById } from "../data/group_data.js";
const navigationItems = [
  { id: "home", label: "Home", icon: "home", href: "../html/index.html" },
  { id: "students", label: "Students", icon: "users" },
  { id: "groups", label: "Groups", icon: "book" },
  { id: "dualigo", label: "Dualigo", icon: "user", href: "../html/dualigo.html" }
];

const navList = document.querySelector("#nav-list");
const themeToggle = document.querySelector("#theme-toggle");

function renderNavigation() {
  if (!navList) return;
  navList.innerHTML = navigationItems
    .map(
      (item) => `
        <li>
          <a
            class="nav-link ${item.id === "groups" ? "is-active" : ""}"
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

const params = new URLSearchParams(window.location.search);
const groupId = params.get("id");
const group = getGroupById(groupId);
const LESSON_TASK_OPTIONS = [
  "Video",
  "Listening",
  "Writing",
  "Reading",
  "Speaking",
  "Vocabulary",
  "Grammar",
  "Quiz"
];

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

function initialsFromName(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getLessonsForGroup(selectedGroup) {
  const baseLessons = selectedGroup.lessons?.length
    ? selectedGroup.lessons
    : [
        { title: "Lesson 1", topic: "Main lesson", schedule: selectedGroup.nextLesson },
        { title: "Lesson 2", topic: "Speaking and review", schedule: selectedGroup.subtitle },
        { title: "Lesson 3", topic: "Homework feedback", schedule: selectedGroup.duration }
      ];

  return [...getStoredLessons(selectedGroup.id), ...baseLessons];
}

function getLessonStorageKey(selectedGroupId) {
  return `johns-group-lessons:${selectedGroupId}`;
}

function getStoredLessons(selectedGroupId) {
  try {
    const storedLessons = localStorage.getItem(getLessonStorageKey(selectedGroupId));
    const parsedLessons = JSON.parse(storedLessons ?? "[]");
    return Array.isArray(parsedLessons) ? parsedLessons : [];
  } catch (error) {
    return [];
  }
}

function saveStoredLessons(selectedGroupId, lessons) {
  localStorage.setItem(getLessonStorageKey(selectedGroupId), JSON.stringify(lessons));
}

function createLessonCard(lesson) {
  const lessonCard = document.createElement("article");
  lessonCard.className = "lesson-card";

  const lessonThumb = document.createElement("div");
  lessonThumb.className = "lesson-card-thumb";
  lessonThumb.innerHTML = "<span></span><span></span><span></span>";

  const lessonTitle = document.createElement("strong");
  lessonTitle.textContent = lesson.title;

  const lessonTopic = document.createElement("p");
  lessonTopic.textContent = lesson.topic;

  const lessonTime = document.createElement("span");
  lessonTime.className = "lesson-card-time";
  lessonTime.textContent = lesson.schedule;

  lessonCard.append(lessonThumb, lessonTitle, lessonTopic);

  if (lesson.tasks?.length) {
    const taskList = document.createElement("div");
    taskList.className = "lesson-task-list";

    lesson.tasks.forEach((task) => {
      const taskChip = document.createElement("span");
      taskChip.className = "lesson-task-chip";
      taskChip.textContent = task;
      taskList.appendChild(taskChip);
    });

    lessonCard.appendChild(taskList);
  }

  lessonCard.appendChild(lessonTime);
  return lessonCard;
}

function renderLessons(selectedGroup) {
  const lessonHost = document.querySelector("#group-stats");
  const selectedTasks = [];

  lessonHost.innerHTML = `
    <div class="hero-lessons-heading">
      <div class="hero-lessons-copy">
        <h3>Lessons</h3>
        <p>Teacher-created lessons for this group</p>
      </div>
      <div class="hero-lessons-actions">
        <button class="lesson-create-toggle" id="lesson-create-toggle" type="button" aria-expanded="false">
          Create lesson
        </button>
      </div>
    </div>
    <div class="lesson-builder" id="lesson-builder" hidden>
      <div class="lesson-builder-copy">
        <strong>New lesson</strong>
        <p>Tasklarni tanlang, kerak bolsa nom bering va OK ni bosing.</p>
      </div>
      <label class="lesson-builder-label" for="lesson-title-input">Lesson name</label>
      <input
        class="lesson-builder-input"
        id="lesson-title-input"
        type="text"
        placeholder="Masalan: Lesson 4"
      >
      <div class="lesson-builder-label">Selected tasks</div>
      <div class="lesson-builder-dropzone is-empty" id="selected-task-list">Task tanlang</div>
      <div class="lesson-builder-label">Available tasks</div>
      <div class="lesson-builder-options" id="task-option-list"></div>
      <div class="lesson-builder-actions">
        <button class="lesson-builder-secondary" id="lesson-cancel-button" type="button">Cancel</button>
        <button class="lesson-builder-primary" id="lesson-save-button" type="button">OK</button>
      </div>
    </div>
    <div class="lesson-carousel-row">
      <div class="lesson-carousel-controls" aria-label="Lesson carousel controls">
        <button class="lesson-carousel-button" id="lesson-prev-button" type="button" aria-label="Previous lesson">
          &larr;
        </button>
        <button class="lesson-carousel-button" id="lesson-next-button" type="button" aria-label="Next lesson">
          &rarr;
        </button>
      </div>
    </div>
    <div class="hero-lessons-viewport">
      <div class="hero-lessons-grid" id="hero-lessons-grid"></div>
    </div>
  `;

  const lessonGrid = document.querySelector("#hero-lessons-grid");
  const prevButton = document.querySelector("#lesson-prev-button");
  const nextButton = document.querySelector("#lesson-next-button");
  const createToggle = document.querySelector("#lesson-create-toggle");
  const builder = document.querySelector("#lesson-builder");
  const titleInput = document.querySelector("#lesson-title-input");
  const selectedTaskList = document.querySelector("#selected-task-list");
  const taskOptionList = document.querySelector("#task-option-list");
  const cancelButton = document.querySelector("#lesson-cancel-button");
  const saveButton = document.querySelector("#lesson-save-button");

  function getLessonStep() {
    const firstCard = lessonGrid.querySelector(".lesson-card");

    if (!firstCard) {
      return 0;
    }

    const gridStyles = window.getComputedStyle(lessonGrid);
    const gap = Number.parseFloat(gridStyles.columnGap) || 12;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateCarouselButtons() {
    const maxScrollLeft = lessonGrid.scrollWidth - lessonGrid.clientWidth;
    const hasOverflow = maxScrollLeft > 4;

    prevButton.disabled = !hasOverflow || lessonGrid.scrollLeft <= 4;
    nextButton.disabled = !hasOverflow || lessonGrid.scrollLeft >= maxScrollLeft - 4;
  }

  function slideLessons(direction) {
    const step = getLessonStep();

    if (!step) {
      return;
    }

    lessonGrid.scrollBy({
      left: step * direction,
      behavior: "smooth"
    });
  }

  function renderLessonGrid() {
    lessonGrid.innerHTML = "";
    getLessonsForGroup(selectedGroup).forEach((lesson) => {
      lessonGrid.appendChild(createLessonCard(lesson));
    });
    updateCarouselButtons();
  }

  function renderSelectedTasks() {
    selectedTaskList.innerHTML = "";
    selectedTaskList.classList.remove("is-warning");
    selectedTaskList.classList.toggle("is-empty", selectedTasks.length === 0);

    if (!selectedTasks.length) {
      selectedTaskList.textContent = "Task tanlang";
      return;
    }

    selectedTasks.forEach((task) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "selected-task-chip";
      button.textContent = task;
      button.setAttribute("aria-label", `${task} taskini olib tashlash`);
      button.addEventListener("click", () => {
        const taskIndex = selectedTasks.indexOf(task);
        if (taskIndex >= 0) {
          selectedTasks.splice(taskIndex, 1);
          renderSelectedTasks();
          renderTaskOptions();
        }
      });
      selectedTaskList.appendChild(button);
    });
  }

  function renderTaskOptions() {
    taskOptionList.innerHTML = "";

    LESSON_TASK_OPTIONS.forEach((task) => {
      const isSelected = selectedTasks.includes(task);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "task-option-chip";
      button.textContent = task;
      button.classList.toggle("is-active", isSelected);
      button.disabled = isSelected;
      button.addEventListener("click", () => {
        if (selectedTasks.includes(task)) {
          return;
        }

        selectedTasks.push(task);
        renderSelectedTasks();
        renderTaskOptions();
      });
      taskOptionList.appendChild(button);
    });
  }

  function resetBuilder(keepOpen = false) {
    selectedTasks.length = 0;
    titleInput.value = "";
    renderSelectedTasks();
    renderTaskOptions();

    if (!keepOpen) {
      builder.hidden = true;
      createToggle.setAttribute("aria-expanded", "false");
    }
  }

  createToggle.addEventListener("click", () => {
    const willOpen = builder.hidden;
    builder.hidden = !willOpen;
    createToggle.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      titleInput.focus();
      return;
    }

    resetBuilder();
  });

  cancelButton.addEventListener("click", () => {
    resetBuilder();
  });

  prevButton.addEventListener("click", () => {
    slideLessons(-1);
  });

  nextButton.addEventListener("click", () => {
    slideLessons(1);
  });

  lessonGrid.addEventListener("scroll", updateCarouselButtons);
  window.addEventListener("resize", updateCarouselButtons);

  saveButton.addEventListener("click", () => {
    if (!selectedTasks.length) {
      selectedTaskList.classList.add("is-warning");
      return;
    }

    selectedTaskList.classList.remove("is-warning");

    const existingCustomLessons = getStoredLessons(selectedGroup.id);
    const lessonNumber = getLessonsForGroup(selectedGroup).length + 1;
    const lessonTitle = titleInput.value.trim() || `Lesson ${lessonNumber}`;
    const newLesson = {
      title: lessonTitle,
      topic: `${selectedTasks.length} ta task tanlandi`,
      schedule: selectedGroup.nextLesson,
      tasks: [...selectedTasks]
    };

    existingCustomLessons.unshift(newLesson);
    saveStoredLessons(selectedGroup.id, existingCustomLessons);
    renderLessonGrid();
    resetBuilder();
  });

  renderLessonGrid();
  renderSelectedTasks();
  renderTaskOptions();
  updateCarouselButtons();
}

function renderNotFound() {
  document.title = "Group not found";
  document.querySelector(".group-page").innerHTML = `
    <section class="card section-card">
      <div class="section-heading">
        <h2>Group not found</h2>
      </div>
      <p>This group does not exist or the link is invalid.</p>
      <a class="back-link" href="../html/index.html">Back to dashboard</a>
    </section>
  `;
}

function renderGroupDetails(selectedGroup) {
  document.title = `${selectedGroup.title} | Johns`;
  document.querySelector("#group-level").textContent = selectedGroup.level;
  document.querySelector("#group-title").textContent = selectedGroup.title;
  document.querySelector("#group-description").textContent = selectedGroup.description;
  document.querySelector("#group-teacher").textContent = `Teacher: ${selectedGroup.teacher}`;
  document.querySelector("#group-room").textContent = `Room: ${selectedGroup.room}`;
  document.querySelector("#group-next-lesson").textContent = `Next: ${selectedGroup.nextLesson}`;

  renderLessons(selectedGroup);

  document.querySelector("#group-students").innerHTML = selectedGroup.students
    .map(
      (student) => `
        <article class="student-item">
          <div class="student-avatar">${initialsFromName(student.name)}</div>
          <div>
            <h4>${student.name}</h4>
            <p>${student.status}</p>
          </div>
          <div class="student-score">
            <strong>${student.score}</strong>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#group-summary").innerHTML = `
    <div class="summary-row"><span>Level</span><span>${selectedGroup.level}</span></div>
    <div class="summary-row"><span>Teacher</span><span>${selectedGroup.teacher}</span></div>
    <div class="summary-row"><span>Schedule</span><span>${selectedGroup.subtitle}</span></div>
    <div class="summary-row"><span>Next lesson</span><span>${selectedGroup.nextLesson}</span></div>
  `;
}

setupThemeToggle();

if (!group) {
  renderNotFound();
} else {
  renderGroupDetails(group);
}
renderNavigation();
