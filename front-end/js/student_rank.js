import { getStudentById } from "../data/student_rank_data.js";

const themeToggle = document.querySelector("#theme-toggle");
const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");
const student = getStudentById(studentId);
const THEME_STORAGE_KEY = "theme";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
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
  document.body.classList.toggle("dark-mode", theme === "dark");
  syncThemeToggle(theme);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("skillset-theme");
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === "skillset-theme") {
      applyTheme(event.newValue === "dark" ? "dark" : "light");
    }
  });

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    localStorage.setItem("skillset-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function toPercent(correct, wrong) {
  const total = correct + wrong;
  if (!total) {
    return 0;
  }

  return Math.round((correct / total) * 100);
}

function renderNotFound() {
  document.title = "Student not found";
  document.querySelector(".student-page").innerHTML = `
    <section class="card not-found">
      <h2>Student not found</h2>
      <p>Bu o'quvchi topilmadi yoki link xato.</p>
      <a class="back-link" href="../html/oquvchi.html">Back to students</a>
    </section>
  `;
}

function renderStudentDetails(selectedStudent) {
  document.title = `${selectedStudent.fullName} | Johns`;
  document.querySelector("#student-level").textContent = selectedStudent.groupLevel;
  document.querySelector("#student-name").textContent = selectedStudent.fullName;
  document.querySelector("#student-status").textContent = selectedStudent.status;
  document.querySelector("#student-meta").innerHTML = `
    <span>${selectedStudent.groupTitle}</span>
    <span>${selectedStudent.teacher}</span>
    <span>${selectedStudent.groupSchedule}</span>
  `;

  document.querySelector("#student-hero-stats").innerHTML = [
    { icon: "chart", value: selectedStudent.averageResult, label: "O'rtacha natija" },
    { icon: "book", value: selectedStudent.completedLessons, label: "Bajarilgan darslar" },
    { icon: "star", value: selectedStudent.streak, label: "Active streak" }
  ]
    .map(
      (item) => `
        <article class="stat-box">
          <span class="icon-wrap">
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
          </span>
          <strong>${item.value}</strong>
          <p>${item.label}</p>
        </article>
      `
    )
    .join("");

  const issueLabels = {
    wrong: "Xato bajarilgan",
    partial: "Chala bajarilgan",
    missed: "Bajarilmagan"
  };

  document.querySelector("#task-grid").innerHTML = selectedStudent.lessonIssues
    .map((issue) => {
      const relatedTask = selectedStudent.taskStats.find((task) => task.type === issue.task);
      const relatedPercent = relatedTask ? toPercent(relatedTask.correct, relatedTask.wrong) : 0;
      return `
        <article class="task-card">
          <div class="task-lesson">${issue.lesson}</div>
          <div class="task-head">
            <div>
              <h4>${issue.task}</h4>
              <p>${issue.note}</p>
            </div>
            <span class="task-state ${issue.status}">
              <svg aria-hidden="true"><use href="#icon-${issue.status === "partial" ? "book" : "close"}"></use></svg>
              ${issueLabels[issue.status] ?? "Muammo bor"}
            </span>
          </div>
          <div class="task-meta-line">
            <span>Guruh: ${selectedStudent.groupTitle}</span>
            <span>Ustoz: ${selectedStudent.teacher}</span>
            ${relatedTask ? `<span>Umumiy natija: ${relatedPercent}%</span>` : ""}
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelector("#insight-grid").innerHTML = [
    {
      title: "Kuchli tomonlari",
      text: selectedStudent.strengths.join(", "),
      value: `${selectedStudent.strengths.length} ta kuchli yo'nalish`
    },
    {
      title: "Ko'proq ishlash kerak",
      text: selectedStudent.needsWork.join(", "),
      value: `${selectedStudent.needsWork.length} ta ustuvor yo'nalish`
    },
    {
      title: "Lesson participation",
      text: `${selectedStudent.completedLessons} ta lesson teacher tomonidan yaratilgan topshiriqlar bilan yakunlangan.`,
      value: selectedStudent.streak
    },
    {
      title: "Umumiy xulosa",
      text: `${selectedStudent.fullName} ${selectedStudent.groupTitle} guruhida o'qiydi va ${selectedStudent.teacher} bilan ishlaydi.`,
      value: selectedStudent.averageResult
    }
  ]
    .map(
      (item) => `
        <article class="insight-card">
          <h4>${item.title}</h4>
          <strong>${item.value}</strong>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");

  document.querySelector("#student-summary").innerHTML = `
    <div class="summary-row"><span>Ism</span><span>${selectedStudent.firstName}</span></div>
    <div class="summary-row"><span>Familya</span><span>${selectedStudent.lastName}</span></div>
    <div class="summary-row"><span>Guruh</span><span>${selectedStudent.groupTitle}</span></div>
    <div class="summary-row"><span>Daraja</span><span>${selectedStudent.groupLevel}</span></div>
    <div class="summary-row"><span>Ustoz</span><span>${selectedStudent.teacher}</span></div>
    <div class="summary-row"><span>Status</span><span>${selectedStudent.status}</span></div>
  `;
}

function resetScrollPositions() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  const taskGrid = document.querySelector("#task-grid");
  if (taskGrid) {
    taskGrid.scrollTop = 0;
  }
}

setupThemeToggle();

if (!student) {
  renderNotFound();
} else {
  renderStudentDetails(student);
  resetScrollPositions();
}

window.addEventListener("pageshow", () => {
  resetScrollPositions();
});
