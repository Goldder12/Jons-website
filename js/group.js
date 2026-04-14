    import { getGroupById } from "../data/group_data.js";

    const themeToggle = document.querySelector("#theme-toggle");
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("id");
    const group = getGroupById(groupId);

    function syncThemeToggle(theme) {
    if (!themeToggle) {
        return;
    }

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
    );
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
        const nextTheme = document.body.classList.contains("dark-theme")
        ? "light"
        : "dark";
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
    if (selectedGroup.lessons?.length) {
        return selectedGroup.lessons;
    }

    return [
        {
        title: "Lesson 1",
        topic: "Main lesson",
        schedule: selectedGroup.nextLesson,
        },
        {
        title: "Lesson 2",
        topic: "Speaking and review",
        schedule: selectedGroup.subtitle,
        },
        {
        title: "Lesson 3",
        topic: "Homework feedback",
        schedule: selectedGroup.duration,
        },
    ];
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
    document.querySelector("#group-description").textContent =
        selectedGroup.description;
    document.querySelector("#group-teacher").textContent =
        `Teacher: ${selectedGroup.teacher}`;
    document.querySelector("#group-room").textContent =
        `Room: ${selectedGroup.room}`;
    document.querySelector("#group-next-lesson").textContent =
        `Next: ${selectedGroup.nextLesson}`;

    const lessons = getLessonsForGroup(selectedGroup);

    document.querySelector("#group-stats").innerHTML = `
        <div class="hero-lessons-heading">
        <h3>Lessons</h3>
        <p>Teacher-created lessons for this group</p>
        </div>
        <div class="hero-lessons-grid">
        ${lessons
            .map(
            (lesson) => `
                <article class="lesson-card">
                <div class="lesson-card-thumb">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <strong>${lesson.title}</strong>
                <p>${lesson.topic}</p>
                <span class="lesson-card-time">${lesson.schedule}</span>
                </article>
            `,
            )
            .join("")}
        </div>
    `;

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
        `,
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
