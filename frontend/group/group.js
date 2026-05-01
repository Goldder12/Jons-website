const THEME_KEY = "edu-dashboard-theme";

const groupCatalog = {
  A1: {
    level: "A1",
    title: "A1 Beginner Group",
    description: "Starter level learners focused on basic grammar, vocabulary, and first speaking practice.",
    studentsCount: 18,
    mentor: "Malika Rahimova",
    lessonsPerWeek: 3,
    room: "Room 101",
    status: "Active",
    focus: "Alphabet review, greetings, present simple, and confidence-building speaking tasks.",
  },
  A2: {
    level: "A2",
    title: "A2 Elementary Group",
    description: "Elementary learners building stronger sentence patterns, reading confidence, and listening routine.",
    studentsCount: 20,
    mentor: "Javohir Tursunov",
    lessonsPerWeek: 3,
    room: "Room 102",
    status: "Active",
    focus: "Daily routines, question forms, short writing, and controlled conversation tasks.",
  },
  B1: {
    level: "B1",
    title: "B1 Intermediate Group",
    description: "Intermediate communication group with balanced grammar, speaking, and comprehension practice.",
    studentsCount: 16,
    mentor: "Dilnoza Karimova",
    lessonsPerWeek: 4,
    room: "Room 201",
    status: "Active",
    focus: "Opinion speaking, paragraph writing, past and future forms, and classroom discussion.",
  },
  B2: {
    level: "B2",
    title: "B2 Upper-Intermediate Group",
    description: "Upper-intermediate learners improving fluency, accuracy, and exam-oriented communication skills.",
    studentsCount: 14,
    mentor: "Bekzod Islomov",
    lessonsPerWeek: 4,
    room: "Room 202",
    status: "Active",
    focus: "Argument building, listening detail, extended speaking, and correction-driven review.",
  },
  C1: {
    level: "C1",
    title: "C1 Advanced Group",
    description: "Advanced fluency group with deeper writing structure, nuanced vocabulary, and fast-paced discussion.",
    studentsCount: 12,
    mentor: "Nigina Qodirova",
    lessonsPerWeek: 5,
    room: "Room 301",
    status: "Active",
    focus: "Academic vocabulary, presentation speaking, essay structure, and advanced listening analysis.",
  },
  C2: {
    level: "C2",
    title: "C2 Mastery Group",
    description: "Mastery and expert-level group for high-precision speaking, writing, and exam excellence.",
    studentsCount: 10,
    mentor: "Sardor Yuldashev",
    lessonsPerWeek: 5,
    room: "Room 302",
    status: "Active",
    focus: "High-level debate, refined writing, idiomatic control, and advanced feedback cycles.",
  },
};

const defaultLessons = {
  A1: [
    {
      id: "a1-1",
      title: "Alphabet and Greetings",
      date: "2026-05-03",
      time: "09:00",
      teacher: "Malika Rahimova",
      description: "Introducing greetings, self-introduction phrases, and alphabet pronunciation.",
    },
  ],
  A2: [
    {
      id: "a2-1",
      title: "Daily Routine Practice",
      date: "2026-05-04",
      time: "11:00",
      teacher: "Javohir Tursunov",
      description: "Talking about habits, time expressions, and present simple reinforcement.",
    },
  ],
  B1: [
    {
      id: "b1-1",
      title: "Past Experience Discussion",
      date: "2026-05-05",
      time: "14:00",
      teacher: "Dilnoza Karimova",
      description: "Speaking tasks around life experiences and past simple versus present perfect review.",
    },
  ],
  B2: [
    {
      id: "b2-1",
      title: "Opinion Essay Structure",
      date: "2026-05-06",
      time: "15:30",
      teacher: "Bekzod Islomov",
      description: "Planning and structuring a clear opinion essay with linking and support sentences.",
    },
  ],
  C1: [
    {
      id: "c1-1",
      title: "Advanced Listening Analysis",
      date: "2026-05-07",
      time: "16:00",
      teacher: "Nigina Qodirova",
      description: "Listening for implication, attitude, and subtle meaning in longer audio material.",
    },
  ],
  C2: [
    {
      id: "c2-1",
      title: "Debate and Precision Speaking",
      date: "2026-05-08",
      time: "17:00",
      teacher: "Sardor Yuldashev",
      description: "High-precision speaking practice with argument defense and vocabulary refinement.",
    },
  ],
};

const themeToggle = document.getElementById("themeToggle");
const lessonModalOverlay = document.getElementById("lessonModalOverlay");
const openLessonModalBtn = document.getElementById("openLessonModalBtn");
const lessonModalClose = document.getElementById("lessonModalClose");
const lessonModalCancel = document.getElementById("lessonModalCancel");
const lessonForm = document.getElementById("lessonForm");
const lessonList = document.getElementById("lessonList");
const lessonCountChip = document.getElementById("lessonCountChip");

const urlParams = new URLSearchParams(window.location.search);
const groupLevel = (urlParams.get("level") || "A1").toUpperCase();
const groupData = groupCatalog[groupLevel] || groupCatalog.A1;
const lessonsStorageKey = `group-lessons-${groupData.level}`;

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

function getLessons() {
  const savedLessons = localStorage.getItem(lessonsStorageKey);
  if (savedLessons) {
    return JSON.parse(savedLessons);
  }

  const seedLessons = defaultLessons[groupData.level] || [];
  localStorage.setItem(lessonsStorageKey, JSON.stringify(seedLessons));
  return seedLessons;
}

function saveLessons(lessons) {
  localStorage.setItem(lessonsStorageKey, JSON.stringify(lessons));
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Date not set";
  }

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderGroupDetails() {
  document.title = `${groupData.level} Group`;
  document.getElementById("groupTitle").textContent = `${groupData.level} Group`;
  document.getElementById("groupLevelBadge").textContent = groupData.level;
  document.getElementById("groupHeroTitle").textContent = groupData.title;
  document.getElementById("groupDescription").textContent = groupData.description;
  document.getElementById("studentsCount").textContent = groupData.studentsCount;
  document.getElementById("lessonsPerWeek").textContent = groupData.lessonsPerWeek;
  document.getElementById("mentorName").textContent = groupData.mentor;
  document.getElementById("roomName").textContent = groupData.room;
  document.getElementById("groupStatus").textContent = groupData.status;
  document.getElementById("groupFocusText").textContent = groupData.focus;
}

function renderLessons() {
  const lessons = getLessons();
  lessonCountChip.textContent = `${lessons.length} Lesson${lessons.length === 1 ? "" : "s"}`;

  if (!lessons.length) {
    lessonList.innerHTML = `<div class="lesson-empty">No lessons created for this group yet.</div>`;
    return;
  }

  lessonList.innerHTML = lessons
    .map(
      (lesson) => `
        <article class="lesson-card" data-lesson-id="${lesson.id}">
          <div class="lesson-card-header">
            <div>
              <h3 class="lesson-card-title">${lesson.title}</h3>
              <p class="lesson-card-subtitle">${formatDate(lesson.date)} at ${lesson.time} • ${lesson.teacher}</p>
            </div>
            <button class="btn btn-danger" type="button" data-delete-lesson="${lesson.id}">Delete</button>
          </div>
          <div class="lesson-meta">
            <span class="lesson-badge">${groupData.level}</span>
            <span class="lesson-badge">${groupData.room}</span>
          </div>
          <p class="lesson-card-description">${lesson.description || "No description added."}</p>
        </article>
      `,
    )
    .join("");
}

function openLessonModal() {
  lessonModalOverlay.classList.add("open");
}

function closeLessonModal() {
  lessonModalOverlay.classList.remove("open");
  lessonForm.reset();
}

function createLesson(payload) {
  const lessons = getLessons();
  const newLesson = {
    id: `${groupData.level.toLowerCase()}-${Date.now()}`,
    ...payload,
  };

  lessons.push(newLesson);
  saveLessons(lessons);
  renderLessons();
}

function deleteLesson(id) {
  const lessons = getLessons().filter((lesson) => lesson.id !== id);
  saveLessons(lessons);
  renderLessons();
}

themeToggle.addEventListener("click", toggleTheme);
openLessonModalBtn.addEventListener("click", openLessonModal);
lessonModalClose.addEventListener("click", closeLessonModal);
lessonModalCancel.addEventListener("click", closeLessonModal);

lessonModalOverlay.addEventListener("click", (event) => {
  if (event.target === lessonModalOverlay) {
    closeLessonModal();
  }
});

lessonForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("lessonTitle").value.trim();
  const date = document.getElementById("lessonDate").value;
  const time = document.getElementById("lessonTime").value;
  const teacher = document.getElementById("lessonTeacher").value.trim();
  const description = document.getElementById("lessonDescription").value.trim();

  if (!title || !date || !time || !teacher) {
    return;
  }

  createLesson({ title, date, time, teacher, description });
  closeLessonModal();
});

lessonList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-lesson]");
  if (!deleteButton) {
    return;
  }

  deleteLesson(deleteButton.dataset.deleteLesson);
});

renderGroupDetails();
renderLessons();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
