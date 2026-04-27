const sectionLabels = {
  dashboard: "Dashboard",
  courses: "My Courses",
  schedule: "Schedule",
  results: "Results",
};

const upcomingLessons = [
  {
    course: "Frontend Bootcamp",
    mentor: "Aziza Karim",
    date: "28 Apr 2026",
    time: "10:00 AM",
    status: "Active",
  },
  {
    course: "English Speaking",
    mentor: "David Brown",
    date: "29 Apr 2026",
    time: "2:00 PM",
    status: "Pending",
  },
  {
    course: "UI Design Basics",
    mentor: "Nodira Usmon",
    date: "30 Apr 2026",
    time: "11:30 AM",
    status: "Review",
  },
  {
    course: "React Workshop",
    mentor: "Javohir Aliyev",
    date: "02 May 2026",
    time: "9:30 AM",
    status: "Active",
  },
];

const courseRows = [
  {
    course: "Frontend Bootcamp",
    category: "Programming",
    mentor: "Aziza Karim",
    progress: "78%",
    status: "Active",
  },
  {
    course: "English Speaking",
    category: "Language",
    mentor: "David Brown",
    progress: "64%",
    status: "Pending",
  },
  {
    course: "UI Design Basics",
    category: "Design",
    mentor: "Nodira Usmon",
    progress: "88%",
    status: "Completed",
  },
  {
    course: "React Workshop",
    category: "Programming",
    mentor: "Javohir Aliyev",
    progress: "52%",
    status: "Review",
  },
];

const scheduleRows = [
  {
    day: "Monday",
    course: "Frontend Bootcamp",
    time: "10:00 - 12:00",
    room: "Room 204",
    attendance: "Active",
  },
  {
    day: "Tuesday",
    course: "English Speaking",
    time: "14:00 - 15:30",
    room: "Room 105",
    attendance: "Pending",
  },
  {
    day: "Thursday",
    course: "UI Design Basics",
    time: "11:30 - 13:00",
    room: "Lab 02",
    attendance: "Active",
  },
  {
    day: "Saturday",
    course: "React Workshop",
    time: "09:30 - 11:00",
    room: "Room 302",
    attendance: "Review",
  },
];

const resultRows = [
  {
    subject: "Frontend Bootcamp",
    assessment: "JavaScript Quiz",
    score: "92/100",
    feedback: "Strong logic and clean code",
    status: "Completed",
  },
  {
    subject: "English Speaking",
    assessment: "Vocabulary Test",
    score: "84/100",
    feedback: "Good pronunciation, expand word bank",
    status: "Active",
  },
  {
    subject: "UI Design Basics",
    assessment: "Mobile Layout Task",
    score: "95/100",
    feedback: "Excellent visual balance",
    status: "Completed",
  },
  {
    subject: "React Workshop",
    assessment: "Mini Project Review",
    score: "Pending",
    feedback: "Submission expected by Friday",
    status: "Pending",
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
  return `<span class="status-badge ${(status || "").toLowerCase()}">${status || "-"}</span>`;
}

function renderRows(targetId, rows, columns) {
  const tbody = document.getElementById(targetId);

  tbody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          ${columns.map((column) => `<td>${column(row)}</td>`).join("")}
        </tr>`,
    )
    .join("");
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

  if (headerTitle && sectionLabels[name]) {
    headerTitle.textContent = sectionLabels[name];
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

renderRows("upcoming-lessons-tbody", upcomingLessons, [
  (row) => row.course,
  (row) => row.mentor,
  (row) => row.date,
  (row) => row.time,
  (row) => createStatusBadge(row.status),
]);

renderRows("courses-tbody", courseRows, [
  (row) => row.course,
  (row) => row.category,
  (row) => row.mentor,
  (row) => row.progress,
  (row) => createStatusBadge(row.status),
]);

renderRows("schedule-tbody", scheduleRows, [
  (row) => row.day,
  (row) => row.course,
  (row) => row.time,
  (row) => row.room,
  (row) => createStatusBadge(row.attendance),
]);

renderRows("results-tbody", resultRows, [
  (row) => row.subject,
  (row) => row.assessment,
  (row) => row.score,
  (row) => row.feedback,
  (row) => createStatusBadge(row.status),
]);

showSection("dashboard");
