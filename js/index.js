const navigationItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "students", label: "Students", icon: "users" },
  { id: "library", label: "Library", icon: "book", active: true },
  { id: "dualigo", label: "Dualigo", icon: "user" }
];

<<<<<<< HEAD
const popularBooks = [
  {
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
const groups = [
  {
    title: "IELTS Morning Group",
    subtitle: "Mon, Wed, Fri • 09:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "stack",
    colors: ["#8fb3ff", "#cdb4ff"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "Beginner English",
    subtitle: "Tue, Thu, Sat • 11:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "tilt",
    colors: ["#ffd1c1", "#ffe596"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "Speaking Booster",
    subtitle: "Mon, Wed, Fri • 14:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "files",
    colors: ["#d1bbff", "#f4b6ff"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
    scene: "coffee",
    colors: ["#ff9cc2", "#ffcf7b"]
  }
];

const ongoingBooks = [
  {
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "General English Teens",
    subtitle: "Daily • 16:30",
    scene: "coffee",
    colors: ["#ff9cc2", "#ffcf7b"]
  },
  {
    title: "Grammar Focus",
    subtitle: "Tue, Thu • 10:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "papers",
    colors: ["#9e81ff", "#b59bff"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "Elementary A1",
    subtitle: "Mon, Wed, Fri • 13:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "stack",
    colors: ["#8ce3ff", "#f9b9ff"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "IELTS Writing Lab",
    subtitle: "Sat, Sun • 15:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "tower",
    colors: ["#ffcdf0", "#ffd586"]
  },
  {
<<<<<<< HEAD
    title: "The book is an essential guide",
    subtitle: "This is just a general example...",
=======
    title: "Kids English Club",
    subtitle: "Weekend • 12:00",
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
    scene: "duo",
    colors: ["#b7c7ff", "#ffe28b"]
  }
];

<<<<<<< HEAD
const achievements = [
  { name: "Alex Andrew", note: "7 Day Streak", days: "7 Day", color: "linear-gradient(135deg, #67d7ff, #7f7bff)" },
  { name: "Alda Ahmed", note: "12 Study Hours", days: "12 Day", color: "linear-gradient(135deg, #ff9f85, #ff6aac)" },
  { name: "Lina Ahmed", note: "12 Day Visit", days: "12 Day", color: "linear-gradient(135deg, #7ce5bf, #63b1ff)" }
];

const sales = [
  { title: "Grow green", price: "$4.5", color: "linear-gradient(135deg, #ffb56f, #ff77a9)" },
  { title: "Raise a plant", price: "$4.0", color: "linear-gradient(135deg, #8be5ff, #7f8dff)" },
  { title: "One question", price: "$4.5", color: "linear-gradient(135deg, #c7a0ff, #ff9cc4)" },
  { title: "Unplug day", price: "$4.0", color: "linear-gradient(135deg, #ffd57d, #ff8a70)" },
  { title: "Best year", price: "$3.5", color: "linear-gradient(135deg, #7ce4bf, #6e8cff)" }
];

const navList = document.querySelector("#nav-list");
const popularGrid = document.querySelector("#popular-grid");
const ongoingGrid = document.querySelector("#ongoing-grid");
const achievementList = document.querySelector("#achievement-list");
const salesList = document.querySelector("#sales-list");
=======
const studentRanking = [
  { name: "Aziza Karimova", level: "IELTS 7.0 Track", score: "98 pts", rank: "#1", color: "linear-gradient(135deg, #67d7ff, #7f7bff)" },
  { name: "Muhammad Ali", level: "Advanced Speaking", score: "94 pts", rank: "#2", color: "linear-gradient(135deg, #ff9f85, #ff6aac)" },
  { name: "Lina Ahmed", level: "General English", score: "91 pts", rank: "#3", color: "linear-gradient(135deg, #7ce5bf, #63b1ff)" },
  { name: "Sardor Xasanov", level: "Grammar Focus", score: "89 pts", rank: "#4", color: "linear-gradient(135deg, #ffd57d, #ff8a70)" },
  { name: "Malika Noor", level: "Speaking Booster", score: "87 pts", rank: "#5", color: "linear-gradient(135deg, #c7a0ff, #ff9cc4)" }
];

const navList = document.querySelector("#nav-list");
const groupsGrid = document.querySelector("#groups-grid");
const rankingList = document.querySelector("#ranking-list");
const themeToggle = document.querySelector("#theme-toggle");

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
  if (!themeToggle) {
    return;
  }

  const savedTheme = localStorage.getItem("skillset-theme");
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("skillset-theme", nextTheme);
    applyTheme(nextTheme);
  });
}
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9

function renderNavigation() {
  navList.innerHTML = navigationItems
    .map(
      (item) => `
        <li>
<<<<<<< HEAD
          <button class="nav-link ${item.active ? "is-active" : ""}" type="button" data-nav="${item.id}">
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
            <span>${item.label}</span>
=======
          <button
            class="nav-link ${item.active ? "is-active" : ""}"
            type="button"
            data-nav="${item.id}"
            aria-label="${item.label}"
            title="${item.label}"
          >
            <svg aria-hidden="true"><use href="#icon-${item.icon}"></use></svg>
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
          </button>
        </li>
      `
    )
    .join("");

  navList.addEventListener("click", (event) => {
    const targetButton = event.target.closest(".nav-link");
    if (!targetButton) {
      return;
    }

    navList.querySelectorAll(".nav-link").forEach((button) => {
      button.classList.remove("is-active");
    });
    targetButton.classList.add("is-active");
  });
}

function createShapes(scene) {
  const shapesByScene = {
    stack: 3,
    tilt: 2,
    files: 3,
    coffee: 2,
    papers: 2,
    tower: 3,
    duo: 2,
    notes: 2
  };

  return new Array(shapesByScene[scene] || 2)
    .fill("")
    .map(() => '<span class="shape"></span>')
    .join("");
}

function renderBooks(books, target) {
  target.innerHTML = books
    .map(
      (book) => `
        <article class="book-card">
          <div
            class="book-thumb"
            data-scene="${book.scene}"
            style="--card-a:${book.colors[0]}; --card-b:${book.colors[1]};"
          >
            ${createShapes(book.scene)}
            <span class="book-badge">
              <svg aria-hidden="true"><use href="#icon-book"></use></svg>
            </span>
          </div>
          <h3>${book.title}</h3>
          <p>${book.subtitle}</p>
        </article>
      `
    )
    .join("");
}

function initialsFromName(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

<<<<<<< HEAD
function renderAchievements() {
  achievementList.innerHTML = achievements
    .map(
      (item) => `
        <article class="achievement-item">
          <div class="achievement-avatar" style="background:${item.color}">
=======
function renderRanking() {
  rankingList.innerHTML = studentRanking
    .map(
      (item) => `
        <article class="ranking-item">
          <div class="ranking-avatar" style="background:${item.color}">
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
            ${initialsFromName(item.name)}
          </div>
          <div>
            <h4>${item.name}</h4>
<<<<<<< HEAD
            <p>${item.note}</p>
          </div>
          <strong>${item.days}</strong>
        </article>
      `
    )
    .join("");
}

function renderSales() {
  salesList.innerHTML = sales
    .map(
      (item) => `
        <article class="sales-item">
          <div class="sales-avatar" style="background:${item.color}">
            ${item.title.slice(0, 1)}
          </div>
          <div>
            <h4>${item.title}</h4>
            <p>${item.price}</p>
          </div>
          <button type="button">Order</button>
=======
            <p>${item.level}</p>
          </div>
          <div class="ranking-meta">
            <strong>${item.score}</strong>
            <span>${item.rank}</span>
          </div>
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
        </article>
      `
    )
    .join("");
}

renderNavigation();
<<<<<<< HEAD
renderBooks(popularBooks, popularGrid);
renderBooks(ongoingBooks, ongoingGrid);
renderAchievements();
renderSales();
=======
renderBooks(groups, groupsGrid);
renderRanking();
setupThemeToggle();
>>>>>>> 351700ed1a3d53ea36d6d3eefcaf507a031a91a9
