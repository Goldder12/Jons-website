import { groupsData, getGroupById } from "../data/group_data.js";
import { authStorageKey } from "../data/login_data.js";
import { findUserById, updateUser } from "../data/users_data.js";

document.addEventListener("DOMContentLoaded", () => {
    const THEME_STORAGE_KEY = "skillset-theme";
    const logoutButton = document.getElementById("logout-button");
    const profileModalElement = document.getElementById("studentProfileModal");
    const profileTrigger = document.getElementById("open-profile-modal");
    const profileTriggerImage = document.getElementById("profile-trigger-image");
    const closeProfileModalButton = document.getElementById("close-profile-modal");
    const cancelProfileModalButton = document.getElementById("cancel-profile-modal");
    const defaultStudent = {
        firstName: "John",
        lastName: "Doe",
        username: "john_doe",
        phone: "+998901234567",
        email: "john@example.com",
        groupId: "ielts-morning",
        group: "IELTS Morning Group",
        avatar: "https://i.pravatar.cc/150?img=47"
    };

    const student = loadStudentSession();
    if (!student) {
        return;
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(authStorageKey) || "null");
        } catch {
            return null;
        }
    }

    function loadStudentSession() {
        const currentUser = getCurrentUser();

        if (!currentUser?.isAuthenticated) {
            window.location.href = "../html/index.html";
            return null;
        }

        if (currentUser.role === "admin") {
            window.location.href = "../html/index.html";
            return null;
        }

        const storedUser = findUserById(currentUser.id);
        return {
            ...defaultStudent,
            ...currentUser,
            ...(storedUser || {})
        };
    }

    function syncStudentSession() {
        const nextStudent = updateUser(student);
        const sessionUser = {
            ...nextStudent,
            isAuthenticated: true,
            displayName: `${nextStudent.firstName} ${nextStudent.lastName}`.trim() || nextStudent.username
        };

        localStorage.setItem(authStorageKey, JSON.stringify(sessionUser));
    }

    function redirectToLogin() {
        window.location.href = "../html/index.html";
    }

    function setupLogout() {
        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener("click", () => {
            localStorage.removeItem(authStorageKey);
            redirectToLogin();
        });
    }

    function applyTheme(theme) {
        document.body.classList.toggle("dark-mode", theme === "dark");
    }

    function setupTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        applyTheme(savedTheme === "dark" ? "dark" : "light");

        const themeToggleBtn = document.getElementById("theme-toggle");
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener("click", () => {
                const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
                localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
                applyTheme(nextTheme);
            });
        }

        window.addEventListener("storage", (event) => {
            if (event.key === THEME_STORAGE_KEY) {
                applyTheme(event.newValue === "dark" ? "dark" : "light");
            }
        });
    }

    function setupProfileModal() {
        if (!profileModalElement || !profileTrigger || !window.bootstrap) {
            return;
        }

        const modal = new window.bootstrap.Modal(profileModalElement);
        const passwordCollapseElement = document.getElementById("changePasswordCollapse");
        const profileForm = document.getElementById("student-profile-form");
        const profileSaveAlert = document.getElementById("profile-save-alert");
        const avatarUploadInput = document.getElementById("modal-avatar-upload");
        const changePasswordForm = document.getElementById("change-password-form");
        const changePasswordButton = document.getElementById("change-password-button");
        const modalTitle = document.getElementById("studentProfileModalLabel");
        const modalFirstName = document.getElementById("modal-first-name");
        const modalLastName = document.getElementById("modal-last-name");
        const modalUsername = document.getElementById("modal-username");
        const modalPhone = document.getElementById("modal-phone");
        const modalEmail = document.getElementById("modal-email");
        const modalGroup = document.getElementById("modal-group");
        const modalAvatar = document.getElementById("modal-student-avatar");
        const modalCurrentPassword = document.getElementById("modal-current-password");
        const modalNewPassword = document.getElementById("modal-new-password");
        const modalConfirmPassword = document.getElementById("modal-confirm-password");
        const passwordCollapse = passwordCollapseElement
            ? window.bootstrap.Collapse.getOrCreateInstance(passwordCollapseElement, { toggle: false })
            : null;

        if (
            !modalTitle ||
            !modalFirstName ||
            !modalLastName ||
            !modalUsername ||
            !modalPhone ||
            !modalEmail ||
            !modalGroup ||
            !modalAvatar ||
            !modalCurrentPassword ||
            !modalNewPassword ||
            !modalConfirmPassword ||
            !(profileForm instanceof HTMLFormElement) ||
            !(avatarUploadInput instanceof HTMLInputElement) ||
            !(changePasswordForm instanceof HTMLFormElement)
        ) {
            return;
        }

        function getFullName(studentData) {
            return `${studentData.firstName} ${studentData.lastName}`.trim();
        }

        function clearProfileAlert() {
            if (!profileSaveAlert) {
                return;
            }

            const timeoutId = Number(profileSaveAlert.dataset.timeoutId || "0");
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }

            profileSaveAlert.classList.add("d-none");
            profileSaveAlert.classList.remove("alert-danger", "alert-success");
            profileSaveAlert.textContent = "Profile updated successfully.";
            delete profileSaveAlert.dataset.timeoutId;
        }

        function showProfileAlert(message, type = "success") {
            if (!profileSaveAlert) {
                return;
            }

            clearProfileAlert();
            profileSaveAlert.textContent = message;
            profileSaveAlert.classList.remove("d-none");
            profileSaveAlert.classList.add(type === "error" ? "alert-danger" : "alert-success");

            const timeoutId = window.setTimeout(() => {
                clearProfileAlert();
            }, 2600);

            profileSaveAlert.dataset.timeoutId = String(timeoutId);
        }

        function resetPasswordForm() {
            changePasswordForm.reset();
        }

        function renderStudent(studentData) {
            const fullName = getFullName(studentData);

            if (modalFirstName instanceof HTMLInputElement) {
                modalFirstName.value = studentData.firstName;
            }
            if (modalLastName instanceof HTMLInputElement) {
                modalLastName.value = studentData.lastName;
            }
            if (modalUsername instanceof HTMLInputElement) {
                modalUsername.value = studentData.username;
            }
            if (modalPhone instanceof HTMLInputElement) {
                modalPhone.value = studentData.phone;
            }

            modalTitle.textContent = fullName || studentData.username;
            modalEmail.textContent = studentData.email;
            modalEmail.href = `mailto:${studentData.email}`;
            modalGroup.textContent = studentData.group;
            profileTrigger.setAttribute("aria-label", `Open profile for ${fullName || studentData.username}`);

            if (profileTriggerImage instanceof HTMLImageElement) {
                profileTriggerImage.src = studentData.avatar;
                profileTriggerImage.alt = fullName || studentData.username;
            }

            if (modalAvatar instanceof HTMLImageElement) {
                modalAvatar.src = studentData.avatar;
                modalAvatar.alt = fullName || studentData.username;
            }
        }

        renderStudent(student);

        profileForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (
                !(modalFirstName instanceof HTMLInputElement) ||
                !(modalLastName instanceof HTMLInputElement) ||
                !(modalUsername instanceof HTMLInputElement) ||
                !(modalPhone instanceof HTMLInputElement)
            ) {
                return;
            }

            student.firstName = modalFirstName.value.trim() || defaultStudent.firstName;
            student.lastName = modalLastName.value.trim() || defaultStudent.lastName;
            student.username = modalUsername.value.trim() || defaultStudent.username;
            student.phone = modalPhone.value.trim() || defaultStudent.phone;

            syncStudentSession();
            renderStudent(student);

            showProfileAlert("Profile updated successfully.");
        });

        avatarUploadInput.addEventListener("change", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement) || !target.files || !target.files[0]) {
                return;
            }

            const [file] = target.files;
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                if (typeof reader.result !== "string") {
                    return;
                }

                student.avatar = reader.result;
                syncStudentSession();
                renderStudent(student);

                showProfileAlert("Avatar updated successfully.");
            });

            reader.readAsDataURL(file);
            target.value = "";
        });

        changePasswordForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (
                !(modalCurrentPassword instanceof HTMLInputElement) ||
                !(modalNewPassword instanceof HTMLInputElement) ||
                !(modalConfirmPassword instanceof HTMLInputElement)
            ) {
                return;
            }

            const currentPassword = modalCurrentPassword.value.trim();
            const newPassword = modalNewPassword.value.trim();
            const confirmPassword = modalConfirmPassword.value.trim();

            if (!currentPassword || !newPassword || !confirmPassword) {
                showProfileAlert("All password fields are required.", "error");
                return;
            }

            if (newPassword.length < 6) {
                showProfileAlert("New password must be at least 6 characters.", "error");
                return;
            }

            if (newPassword !== confirmPassword) {
                showProfileAlert("New password and confirm password must match.", "error");
                return;
            }

            if (changePasswordButton instanceof HTMLButtonElement) {
                changePasswordButton.disabled = true;
                changePasswordButton.textContent = "Updating...";
            }

            try {
                const response = await fetch("/api/change-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: student.id,
                        currentPassword,
                        newPassword
                    })
                });

                const result = await response.json().catch(() => ({
                    success: false,
                    message: "Failed to change password"
                }));

                if (!response.ok || !result.success) {
                    showProfileAlert(result.message || "Current password incorrect", "error");
                    return;
                }

                Object.assign(student, result.user || {});
                syncStudentSession();

                const sessionUser = {
                    ...getCurrentUser(),
                    ...(result.user || {}),
                    isAuthenticated: true,
                    displayName: getFullName({
                        ...student,
                        ...(result.user || {})
                    }) || student.username
                };

                localStorage.setItem(authStorageKey, JSON.stringify(sessionUser));
                resetPasswordForm();
                passwordCollapse?.hide();
                showProfileAlert("Password changed successfully");
            } catch {
                showProfileAlert("Unable to change password right now.", "error");
            } finally {
                if (changePasswordButton instanceof HTMLButtonElement) {
                    changePasswordButton.disabled = false;
                    changePasswordButton.textContent = "Update Password";
                }
            }
        });

        profileModalElement.addEventListener("hidden.bs.modal", () => {
            clearProfileAlert();
            resetPasswordForm();
            passwordCollapse?.hide();
            renderStudent(student);
        });

        profileTrigger.addEventListener("click", () => {
            renderStudent(student);
            modal.show();
        });

        if (closeProfileModalButton) {
            closeProfileModalButton.addEventListener("click", () => {
                modal.hide();
            });
        }

        if (cancelProfileModalButton) {
            cancelProfileModalButton.addEventListener("click", () => {
                modal.hide();
            });
        }
    }

    setupTheme();
    setupLogout();
    setupProfileModal();

    const chartCanvas = document.getElementById("performanceChart");
    if (chartCanvas) {
        const ctx = chartCanvas.getContext("2d");

        if (ctx) {
            const orangeGradient = ctx.createLinearGradient(0, 0, 0, 300);
            orangeGradient.addColorStop(0, "rgba(255, 157, 104, 0.4)");
            orangeGradient.addColorStop(1, "rgba(255, 157, 104, 0.0)");

            const pinkGradient = ctx.createLinearGradient(0, 0, 0, 300);
            pinkGradient.addColorStop(0, "rgba(255, 123, 165, 0.4)");
            pinkGradient.addColorStop(1, "rgba(255, 123, 165, 0.0)");

            new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    datasets: [
                        {
                            label: "Practice",
                            data: [15, 25, 20, 45, 60, 95, 65],
                            borderColor: "#ff7ba5",
                            backgroundColor: pinkGradient,
                            borderWidth: 3,
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#ff7ba5",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: "Theory",
                            data: [10, 15, 12, 30, 40, 60, 45],
                            borderColor: "#ff9d68",
                            backgroundColor: orangeGradient,
                            borderWidth: 2,
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#ff9d68",
                            pointBorderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: "index",
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: "#1e2025",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            padding: 12,
                            cornerRadius: 12,
                            displayColors: true,
                            callbacks: {
                                label(context) {
                                    let label = context.dataset.label || "";
                                    if (label) {
                                        label += ": ";
                                    }
                                    if (context.parsed.y !== null) {
                                        label += `${context.parsed.y}%`;
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: "#8b92a5",
                                font: {
                                    family: 'Candara, "Trebuchet MS", sans-serif',
                                    size: 13
                                }
                            }
                        },
                        y: {
                            min: 0,
                            max: 100,
                            grid: {
                                color: "rgba(0,0,0,0.04)",
                                borderDash: [5, 5],
                                drawBorder: false
                            },
                            ticks: {
                                stepSize: 40,
                                color: "#8b92a5",
                                callback(value) {
                                    return `${value}%`;
                                },
                                font: {
                                    family: 'Candara, "Trebuchet MS", sans-serif',
                                    size: 13
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    const navButtons = document.querySelectorAll(".nav-pills-custom .tab-btn");
    const sections = document.querySelectorAll(".tab-content-section");
    const mainPageTitle = document.getElementById("main-page-title");

    const tabTargetMap = {
        "tab-dashboard": "section-dashboard",
        "tab-speaking": "section-speaking",
        "tab-progress": "section-progress",
        "tab-courses": "section-courses"
    };

    navButtons.forEach((button) => {
        button.addEventListener("click", function () {
            navButtons.forEach((btn) => {
                btn.classList.remove("btn-dark");
                btn.classList.add("text-muted", "btn-nav-hover");
            });

            this.classList.remove("text-muted", "btn-nav-hover");
            this.classList.add("btn-dark");

            const targetId = tabTargetMap[this.id];
            sections.forEach((section) => {
                if (section.id === targetId) {
                    section.classList.remove("d-none");
                } else {
                    section.classList.add("d-none");
                }
            });

            if (mainPageTitle) {
                if (targetId === "section-dashboard") mainPageTitle.textContent = "Dashboard";
                if (targetId === "section-speaking") mainPageTitle.textContent = "Speaking";
                if (targetId === "section-progress") mainPageTitle.textContent = "Progress";
                if (targetId === "section-courses") mainPageTitle.textContent = "Courses";
            }
        });
    });

    const coursesGrid = document.getElementById("student-courses-grid");
    if (coursesGrid) {
        coursesGrid.innerHTML = `
            <div class="dualigo-group-list w-100">
                ${groupsData.map((group) => `
                    <article class="dualigo-group-card">
                        <div class="dualigo-group-copy">
                            <h3>${group.title}</h3>
                            <p>${group.description}</p>
                            <div class="dualigo-group-meta">
                                <span>${group.level}</span>
                                <span>${group.teacher}</span>
                                <span>${group.subtitle}</span>
                            </div>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;

        const courseCards = coursesGrid.querySelectorAll(".dualigo-group-card");
        courseCards.forEach((card, index) => {
            card.addEventListener("click", () => {
                const selectedGroup = groupsData[index];
                const group = selectedGroup ? getGroupById(selectedGroup.id) : null;
                if (!group) return;

                document.getElementById("detail-course-title").textContent = group.title;
                document.getElementById("detail-course-desc").textContent = group.description;
                document.getElementById("detail-course-teacher").textContent = group.teacher;
                document.getElementById("detail-course-level").textContent = group.level;
                document.getElementById("detail-course-schedule").textContent = group.nextLesson;
                document.getElementById("detail-course-duration").textContent = group.duration;

                const taskList = document.getElementById("detail-course-tasks");
                taskList.innerHTML = group.lessons.map((lesson) => `
                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-light px-0 py-3">
                        <div>
                            <h6 class="mb-1 text-dark fw-semibold">${lesson.title}: ${lesson.topic}</h6>
                            <span class="text-muted small"><i class="bi bi-calendar-event me-1"></i> ${lesson.schedule}</span>
                        </div>
                        <button class="btn btn-sm btn-dark rounded-pill px-3">Start Task</button>
                    </li>
                `).join("");

                sections.forEach((section) => section.classList.add("d-none"));
                document.getElementById("section-course-details").classList.remove("d-none");
                if (mainPageTitle) mainPageTitle.textContent = group.title;
            });
        });
    }

    const btnBackCourses = document.getElementById("btn-back-courses");
    if (btnBackCourses) {
        btnBackCourses.addEventListener("click", () => {
            sections.forEach((section) => section.classList.add("d-none"));
            document.getElementById("section-courses").classList.remove("d-none");
            if (mainPageTitle) mainPageTitle.textContent = "Courses";

            navButtons.forEach((button) => {
                if (button.id === "tab-courses") {
                    button.classList.add("btn-dark");
                    button.classList.remove("text-muted", "btn-nav-hover");
                } else {
                    button.classList.remove("btn-dark");
                    button.classList.add("text-muted", "btn-nav-hover");
                }
            });
        });
    }

    const searchInput = document.getElementById("courseSearch");
    const courseItems = document.querySelectorAll(".course-item");

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            const searchTerm = target.value.toLowerCase().trim();

            courseItems.forEach((item) => {
                const title = item.querySelector("h5")?.textContent?.toLowerCase() || "";
                const description = item.querySelector("p")?.textContent?.toLowerCase() || "";

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});
