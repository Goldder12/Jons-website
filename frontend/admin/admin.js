const BASE_URL = 'http://localhost:5500';

const sectionLabels = {
    dashboard: 'Dashboard',
    library: 'Library',
    videos: 'Video Lessons',
    listening: 'Listening Tasks',
    users: 'Students',
};

const demoActivity = [
    {
        rank: 1,
        name: 'Madina Yusuf',
        email: 'madina.yusuf@gmail.com',
        group: 'C2',
        score: 98,
    },
    {
        rank: 2,
        name: 'Jasur Eshonqulov',
        email: 'jasur.dev@gmail.com',
        group: 'C1',
        score: 96,
    },
    {
        rank: 3,
        name: 'Sitora Mamatova',
        email: 'sitora.math@gmail.com',
        group: 'B2',
        score: 94,
    },
    {
        rank: 4,
        name: 'Ulugbek Norov',
        email: 'ulugbek.ui@gmail.com',
        group: 'B1',
        score: 92,
    },
    {
        rank: 5,
        name: 'Aziza Karimova',
        email: 'aziza.karimova@gmail.com',
        group: 'A2',
        score: 90,
    },
];

const demoStudents = [
    {
        id: 'STD-1001',
        name: 'Madina Yusuf',
        email: 'madina.yusuf@gmail.com',
        program: 'English Foundation',
        joined: '12 Apr 2026',
        status: 'Active',
    },
    {
        id: 'STD-1002',
        name: 'Jasur Eshonqulov',
        email: 'jasur.dev@gmail.com',
        program: 'Frontend Bootcamp',
        joined: '09 Apr 2026',
        status: 'Pending',
    },
    {
        id: 'STD-1003',
        name: 'Sitora Mamatova',
        email: 'sitora.math@gmail.com',
        program: 'SAT Math Prep',
        joined: '01 Apr 2026',
        status: 'Active',
    },
    {
        id: 'STD-1004',
        name: 'Ulugbek Norov',
        email: 'ulugbek.ui@gmail.com',
        program: 'UI UX Essentials',
        joined: '28 Mar 2026',
        status: 'Offline',
    },
];

const videoTaskOptions = [
    { id: 1, title: 'Present Simple Quiz' },
    { id: 2, title: 'Word Matching' },
    { id: 3, title: 'Listening Section 1' },
    { id: 4, title: 'Task 2 Essay Draft' },
    { id: 5, title: 'Speaking Part 2' },
    { id: 6, title: 'Daily Reading Builder' },
];

const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('.section');
const headerTitle = document.getElementById('headerTitle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'edu-dashboard-theme';
const ACTIVE_SECTION_KEY = 'admin-active-section';
const toastContainer = document.getElementById('toast-container');

function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
}

function showToast(message, type = 'info') {
    if (!toastContainer) {
        return;
    }

    const icons = {
        success: '&#10003;',
        error: '&#10005;',
        info: '&#9432;',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <div class="toast-body">
      <span class="toast-title">${icons[type] || icons.info} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
      <span class="toast-message">${message}</span>
    </div>
    <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
    <span class="toast-progress"></span>
  `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    const closeButton = toast.querySelector('.toast-close');
    closeButton.onclick = () => removeToast(toast);

    let autoRemove = setTimeout(() => removeToast(toast), 4000);

    toast.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
    });

    toast.addEventListener('mouseleave', () => {
        autoRemove = setTimeout(() => removeToast(toast), 4000);
    });
}

window.alert = function (message) {
    showToast(String(message ?? ''), 'info');
};

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
}

function toggleTheme() {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
}

function createStatusBadge(status) {
    const normalized = (status || '').toLowerCase();
    return `<span class="status-badge ${normalized}">${status || '-'}</span>`;
}

function renderDashboardActivity() {
    const tbody = document.getElementById('dashboard-activity-tbody');

    tbody.innerHTML = demoActivity
        .map(
            (item) => `
        <tr>
          <td>${item.rank}</td>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.group}</td>
          <td>${item.score}</td>
        </tr>`
        )
        .join('');
}

function renderStudents() {
    const tbody = document.getElementById('users-tbody');

    tbody.innerHTML = demoStudents
        .map(
            (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.program}</td>
          <td>${item.joined}</td>
          <td>${createStatusBadge(item.status)}</td>
        </tr>`
        )
        .join('');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
}

function showSection(name) {
    const nextSection = document.getElementById(`section-${name}`) ? name : 'dashboard';

    sections.forEach((section) => section.classList.remove('active'));
    navLinks.forEach((link) => link.classList.remove('active'));

    const target = document.getElementById(`section-${nextSection}`);
    if (target) {
        target.classList.add('active');
    }

    const activeLink = document.querySelector(`.nav-link[data-section="${nextSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    if (headerTitle) {
        headerTitle.textContent = sectionLabels[nextSection] || 'Dashboard';
    }

    if (window.location.hash !== `#${nextSection}`) {
        window.location.hash = nextSection;
    }

    localStorage.setItem(ACTIVE_SECTION_KEY, nextSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextSection === 'library') {
        loadBooks();
    }

    if (nextSection === 'videos') {
        loadVideos();
    }

    if (nextSection === 'listening') {
        loadListeningTasks();
    }

    closeSidebar();
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(link.dataset.section);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    const saved = localStorage.getItem(ACTIVE_SECTION_KEY);
    const sectionToLoad = hash || saved || 'dashboard';
    showSection(sectionToLoad);
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
        return;
    }

    showSection(hash);
});

sidebarToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
themeToggle.addEventListener('click', toggleTheme);

function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach((el) => {
        el.textContent = '';
    });

    document
        .querySelectorAll('.modal-form input, .modal-form textarea, .modal-form select')
        .forEach((el) => {
            el.classList.remove('invalid');
        });
}

const DEFAULT_BOOK_IMAGE = 'default-book.png';
const DEFAULT_BOOK_PREVIEW = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
    <defs>
      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d97b41" />
        <stop offset="100%" stop-color="#c95a52" />
      </linearGradient>
    </defs>
    <rect width="480" height="600" rx="36" fill="url(#bookGradient)" />
    <rect x="34" y="34" width="412" height="532" rx="28" fill="rgba(255,255,255,0.12)" />
    <text x="52" y="118" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700">Library</text>
    <text x="52" y="210" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700">Default Book</text>
    <text x="52" y="520" fill="#fff7f1" font-family="Segoe UI, Arial, sans-serif" font-size="24">John Academy</text>
  </svg>
`)}`;

const bookGrid = document.getElementById('book-grid');
const addBookBtn = document.getElementById('addBookBtn');
const bookSearchInput = document.getElementById('bookSearchInput');
const bookLevelFilter = document.getElementById('bookLevelFilter');
const bookModalOverlay = document.getElementById('bookModalOverlay');
const bookForm = document.getElementById('bookForm');
const bookModalTitle = document.getElementById('bookModalTitle');
const bookModalSubmit = document.getElementById('bookModalSubmit');
const bookPdfInput = document.getElementById('bookPdf');
const bookPdfHint = document.getElementById('bookPdfHint');
const bookImageInput = document.getElementById('bookImage');
const bookImagePreview = document.getElementById('bookImagePreview');
const deleteBookModalOverlay = document.getElementById('deleteBookModalOverlay');
const deleteBookModalConfirm = document.getElementById('deleteBookModalConfirm');
const videoGrid = document.getElementById('video-grid');
const addVideoBtn = document.getElementById('addVideoBtn');
const videoModalOverlay = document.getElementById('videoModalOverlay');
const videoForm = document.getElementById('videoForm');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoModalSubmit = document.getElementById('videoModalSubmit');
const videoTypeInput = document.getElementById('videoType');
const videoLevelInput = document.getElementById('videoLevel');
const videoUploadField = document.getElementById('videoUploadField');
const videoLinkField = document.getElementById('videoLinkField');
const videoFileInput = document.getElementById('videoFile');
const videoUrlInput = document.getElementById('videoUrl');
const videoTaskSelect = document.getElementById('videoTaskId');
const videoSourceHint = document.getElementById('videoSourceHint');
const deleteVideoModalOverlay = document.getElementById('deleteVideoModalOverlay');
const deleteVideoModalConfirm = document.getElementById('deleteVideoModalConfirm');
const listeningGrid = document.getElementById('listening-grid');
const addListeningBtn = document.getElementById('addListeningBtn');
const listeningModalOverlay = document.getElementById('listeningModalOverlay');
const listeningForm = document.getElementById('listeningForm');
const listeningModalTitle = document.getElementById('listeningModalTitle');
const listeningModalSubmit = document.getElementById('listeningModalSubmit');
const listeningAudioInput = document.getElementById('listeningAudio');
const listeningLevelInput = document.getElementById('listeningLevel');
const listeningAudioHint = document.getElementById('listeningAudioHint');
const listeningVideoTypeInput = document.getElementById('listeningVideoType');
const listeningVideoUploadField = document.getElementById('listeningVideoUploadField');
const listeningVideoLinkField = document.getElementById('listeningVideoLinkField');
const listeningVideoFileInput = document.getElementById('listeningVideoFile');
const listeningVideoLinkInput = document.getElementById('listeningVideoLink');
const listeningSourceFileInput = document.getElementById('listeningSourceFile');
const analyzeListeningBtn = document.getElementById('analyzeListeningBtn');
const listeningGeneratorStatus = document.getElementById('listeningGeneratorStatus');
const listeningPreviewWrap = document.getElementById('listeningPreviewWrap');
const listeningPreviewWarning = document.getElementById('listeningPreviewWarning');
const listeningGeneratedContent = document.getElementById('listeningGeneratedContent');
const listeningGeneratedAnswers = document.getElementById('listeningGeneratedAnswers');
const listeningRenderedPreview = document.getElementById('listeningRenderedPreview');
const listeningSectionTypeInput = document.getElementById('listeningSectionType');
const listeningContentTextField = document.getElementById('listeningContentTextField');
const listeningContentImageField = document.getElementById('listeningContentImageField');
const listeningContentImageInput = document.getElementById('listeningContentImage');
const deleteListeningModalOverlay = document.getElementById('deleteListeningModalOverlay');
const deleteListeningModalConfirm = document.getElementById('deleteListeningModalConfirm');

let pendingBookDeleteId = null;
let currentBookImageValue = DEFAULT_BOOK_IMAGE;
let currentBookPdfValue = '';
let currentBookObjectUrl = '';
let pendingVideoDeleteId = null;
let pendingListeningDeleteId = null;
let generatedListeningQuestions = [];

if (window.pdfjsLib?.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function normalizeBookLevel(level) {
    return (level || '').toUpperCase().startsWith('CEFR') ? 'CEFR' : level || 'IELTS';
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatLabel(value) {
    const text = String(value || '');
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function resolveBookImage(image) {
    if (!image || image === DEFAULT_BOOK_IMAGE) {
        return DEFAULT_BOOK_PREVIEW;
    }

    if (image.startsWith('data:') || image.startsWith('http')) {
        return image;
    }

    return `${BASE_URL}/${image.replace(/^\/+/, '')}`;
}

function getPdfFileName(pdfPath) {
    return (pdfPath || '').split('/').pop() || 'No PDF selected';
}

function updateBookPreview(src) {
    bookImagePreview.src = src || DEFAULT_BOOK_PREVIEW;
}

function resetBookObjectUrl() {
    if (currentBookObjectUrl) {
        URL.revokeObjectURL(currentBookObjectUrl);
        currentBookObjectUrl = '';
    }
}

function renderBooks(payload) {
    if (!bookGrid) {
        return;
    }

    const books = Array.isArray(payload?.data) ? payload.data : [];
    const searchValue = (bookSearchInput?.value || '').trim().toLowerCase();
    const levelValue = bookLevelFilter?.value || 'All';

    const filteredBooks = books.filter((book) => {
        const matchesSearch = (book.title || '').toLowerCase().includes(searchValue);
        const matchesLevel =
            levelValue === 'All' ? true : normalizeBookLevel(book.level) === levelValue;

        return matchesSearch && matchesLevel;
    });

    if (!filteredBooks.length) {
        bookGrid.innerHTML = `<div class="book-empty">No books found for the current search or level filter.</div>`;
        return;
    }

    bookGrid.innerHTML = filteredBooks
        .map(
            (book) => `
        <article
          class="panel book-card"
          data-book-card="true"
          data-book-id="${book.id}"
          data-book-title="${escapeHtml(book.title)}"
          data-book-author="${escapeHtml(book.author)}"
          data-book-level="${escapeHtml(book.level)}"
          data-book-pdf="${escapeHtml(book.pdf)}"
          data-book-image="${escapeHtml(book.image || DEFAULT_BOOK_IMAGE)}"
        >
          <img
            class="book-card-cover"
            src="${escapeHtml(resolveBookImage(book.image))}"
            alt="${escapeHtml(book.title)} cover"
            onerror="this.onerror=null;this.src='${DEFAULT_BOOK_PREVIEW}'"
          />
          <div class="book-card-body">
            <div class="book-card-copy">
              <h3>${escapeHtml(book.title)}</h3>
              <p>${escapeHtml(book.author)}</p>
            </div>

            <div class="book-card-meta">
              <span class="book-badge">${escapeHtml(book.level)}</span>
              <span class="book-badge">PDF Ready</span>
            </div>

            <div class="book-card-actions">
              <button class="btn btn-edit btn-shine book-action" type="button" data-book-action="edit">
                Edit
              </button>
              <button class="btn btn-danger btn-shine book-action" type="button" data-book-action="delete">
                Delete
              </button>
            </div>
          </div>
        </article>
      `
        )
        .join('');
}

async function loadBooks() {
    if (!bookGrid) {
        return;
    }

    bookGrid.innerHTML = `<div class="book-empty">Loading books...</div>`;

    try {
        const res = await fetch(`${BASE_URL}/api/books`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to load books.');
        }

        renderBooks(data);
    } catch (error) {
        bookGrid.innerHTML = `<div class="book-empty">Book backend is not available yet.</div>`;
    }
}

function clearBookFormErrors() {
    clearFormErrors();
    bookPdfInput?.classList.remove('invalid');
}

function clearBookFormState() {
    resetBookObjectUrl();
    currentBookImageValue = DEFAULT_BOOK_IMAGE;
    currentBookPdfValue = '';
    bookForm.reset();
    document.getElementById('bookId').value = '';
    clearBookFormErrors();
    bookPdfHint.textContent = 'PDF is required for new books.';
    updateBookPreview(DEFAULT_BOOK_PREVIEW);
}

function openCreateBookModal() {
    bookModalTitle.textContent = 'Add Book';
    bookModalSubmit.textContent = 'Create Book';
    clearBookFormState();
    bookModalOverlay.classList.add('open');
}

function closeBookModal() {
    bookModalOverlay.classList.remove('open');
    clearBookFormState();
}

function openEditBookModal(trigger) {
    const card = trigger.closest('[data-book-card]');
    if (!card) {
        return;
    }

    bookModalTitle.textContent = 'Edit Book';
    bookModalSubmit.textContent = 'Save Changes';
    clearBookFormErrors();
    resetBookObjectUrl();
    bookForm.reset();

    document.getElementById('bookId').value = card.dataset.bookId || '';
    document.getElementById('bookTitle').value = card.dataset.bookTitle || '';
    document.getElementById('bookAuthor').value = card.dataset.bookAuthor || '';
    document.getElementById('bookLevel').value = card.dataset.bookLevel || '';
    currentBookPdfValue = card.dataset.bookPdf || '';
    currentBookImageValue = card.dataset.bookImage || DEFAULT_BOOK_IMAGE;

    bookPdfHint.textContent = `Current PDF: ${getPdfFileName(currentBookPdfValue)}`;
    updateBookPreview(resolveBookImage(currentBookImageValue));
    bookModalOverlay.classList.add('open');
}

function openDeleteBookModal(trigger) {
    const card = trigger.closest('[data-book-card]');
    if (!card) {
        return;
    }

    pendingBookDeleteId = card.dataset.bookId;
    document.getElementById('deleteBookName').textContent = card.dataset.bookTitle || 'this book';
    deleteBookModalOverlay.classList.add('open');
}

function closeDeleteBookModal() {
    deleteBookModalOverlay.classList.remove('open');
    pendingBookDeleteId = null;
}

function setBookFieldError(fieldId, errId, message) {
    const input = document.getElementById(fieldId);
    const err = document.getElementById(errId);

    if (input) {
        input.classList.add('invalid');
    }

    if (err) {
        err.textContent = message;
    }
}

function getVideoTaskTitle(taskId) {
    const task = videoTaskOptions.find((item) => Number(item.id) === Number(taskId));
    return task ? task.title : 'Task available';
}

function renderVideoTaskOptions() {
    if (!videoTaskSelect) {
        return;
    }

    videoTaskSelect.innerHTML = `
    <option value="">No linked task</option>
    ${videoTaskOptions
        .map((task) => `<option value="${task.id}">${escapeHtml(task.title)}</option>`)
        .join('')}
  `;
}

function syncVideoTypeFields() {
    const type = videoTypeInput?.value || 'upload';
    const isUpload = type === 'upload';

    videoUploadField?.classList.toggle('field-hidden', !isUpload);
    videoLinkField?.classList.toggle('field-hidden', isUpload);

    if (videoSourceHint) {
        videoSourceHint.textContent = isUpload
            ? 'Upload an MP4 or switch to a lesson link.'
            : 'Paste a complete YouTube or lesson URL.';
    }
}

function syncListeningVideoFields() {
    const type = listeningVideoTypeInput?.value || 'none';

    listeningVideoUploadField?.classList.toggle('field-hidden', type !== 'upload');
    listeningVideoLinkField?.classList.toggle('field-hidden', type !== 'link');
}

function syncListeningSectionFields() {
    const isImage = (listeningSectionTypeInput?.value || 'form') === 'image';

    listeningContentTextField?.classList.toggle('field-hidden', isImage);
    listeningContentImageField?.classList.toggle('field-hidden', !isImage);
}

function getListeningAnswersList() {
    return document
        .getElementById('listeningAnswers')
        .value.split(/\r?\n/)
        .map((answer) => answer.trim())
        .filter(Boolean);
}

function getPreviewAnswerList(value) {
    return String(value || '')
        .split(/\r?\n/)
        .map((answer) => answer.trim())
        .filter(Boolean);
}

function renderListeningPreview(
    content = '',
    questions = [],
    warningMessage = 'OCR may contain mistakes. Please review.'
) {
    generatedListeningQuestions = Array.isArray(questions) ? questions : [];

    if (
        !listeningPreviewWrap ||
        !listeningGeneratedContent ||
        !listeningRenderedPreview ||
        !listeningPreviewWarning
    ) {
        return;
    }

    const hasPreview = Boolean(content);
    listeningPreviewWrap.classList.toggle('field-hidden', !hasPreview);
    listeningPreviewWarning.classList.toggle('field-hidden', !hasPreview);

    if (!hasPreview) {
        listeningGeneratedContent.innerHTML = '';
        listeningGeneratedAnswers.value = '';
        listeningRenderedPreview.innerHTML = '';
        return;
    }

    listeningPreviewWarning.textContent = warningMessage;
    listeningGeneratedContent.innerHTML = content;
    listeningRenderedPreview.innerHTML = content;
    listeningGeneratedAnswers.value = generatedListeningQuestions
        .map((question) => question.answer || '')
        .join('\n');
}

function collectListeningAnswersForSave() {
    const previewAnswers = getPreviewAnswerList(listeningGeneratedAnswers?.value || '');
    if (previewAnswers.length) {
        return previewAnswers.map((answer, index) => ({
            id: generatedListeningQuestions[index]?.id || index + 1,
            answer,
        }));
    }

    return getListeningAnswersList().map((answer, index) => ({
        id: index + 1,
        answer,
    }));
}

function getGeneratedListeningContent() {
    return listeningGeneratedContent?.innerHTML.trim() || '';
}

function buildListeningSectionsFallback() {
    const answers = getListeningAnswersList();
    const sectionType = listeningSectionTypeInput.value;

    return [
        {
            title: document.getElementById('listeningSectionTitle').value.trim(),
            instructions: document.getElementById('listeningInstructions').value.trim(),
            type: sectionType,
            content:
                sectionType === 'image'
                    ? ''
                    : document.getElementById('listeningContent').value.trim(),
            questions: answers.map((answer, index) => ({
                id: index + 1,
                answer,
            })),
        },
    ];
}

async function requestParsedListeningStructure(file) {
    const formData = new FormData();
    formData.append('testFile', file);

    const response = await fetch(`${BASE_URL}/api/parse-listening`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze the listening worksheet.');
    }

    return data.data;
}

function renderRawTextFallback(text) {
    const escapedText = escapeHtml(text || '').replace(/\n/g, '<br />');
    renderListeningPreview(
        `<div class="listening-generated-fallback">${escapedText}</div>`,
        [{ id: 1, answer: '' }],
        'OCR fallback mode is active. Please review the extracted text, add inputs manually, and enter answers before saving.'
    );
}

function setListeningFieldError(fieldId, errId, message) {
    const input = document.getElementById(fieldId);
    const err = document.getElementById(errId);

    if (input) {
        input.classList.add('invalid');
    }

    if (err) {
        err.textContent = message;
    }
}

function validateListeningForm() {
    clearFormErrors();
    let valid = true;

    const title = document.getElementById('listeningTitle').value.trim();
    const hasAudio = Boolean(listeningAudioInput.files?.[0]);
    const videoType = listeningVideoTypeInput.value;
    const hasVideoUpload = Boolean(listeningVideoFileInput.files?.[0]);
    const videoLink = listeningVideoLinkInput.value.trim();
    const generatedContent = getGeneratedListeningContent();
    const generatedAnswers = collectListeningAnswersForSave();
    const sectionTitle = document.getElementById('listeningSectionTitle').value.trim();
    const instructions = document.getElementById('listeningInstructions').value.trim();
    const sectionType = listeningSectionTypeInput.value;
    const content = document.getElementById('listeningContent').value.trim();
    const answers = getListeningAnswersList();

    if (!title) {
        setListeningFieldError('listeningTitle', 'listening-err-title', 'Task title is required.');
        valid = false;
    }

    if (!hasAudio) {
        setListeningFieldError(
            'listeningAudio',
            'listening-err-audio',
            'Audio is required for listening task.'
        );
        showToast('Audio is required for listening task', 'error');
        valid = false;
    }

    if (videoType === 'upload' && !hasVideoUpload) {
        setListeningFieldError(
            'listeningVideoFile',
            'listening-err-video-file',
            'Please upload the optional video file.'
        );
        valid = false;
    }

    if (videoType === 'link' && !videoLink) {
        setListeningFieldError(
            'listeningVideoLink',
            'listening-err-video-link',
            'Please paste a full video link.'
        );
        valid = false;
    }

    if (generatedContent) {
        if (!generatedAnswers.length) {
            showToast(
                'Please review the parsed worksheet and add correct answers before saving.',
                'error'
            );
            valid = false;
        }
    } else {
        if (!sectionTitle) {
            setListeningFieldError(
                'listeningSectionTitle',
                'listening-err-section-title',
                'Section title is required.'
            );
            valid = false;
        }

        if (!instructions) {
            setListeningFieldError(
                'listeningInstructions',
                'listening-err-instructions',
                'Instructions are required.'
            );
            valid = false;
        }

        if (sectionType === 'image' && !hasContentImage) {
            setListeningFieldError(
                'listeningContentImage',
                'listening-err-content-image',
                'Please upload the listening worksheet image.'
            );
            valid = false;
        }

        if (sectionType !== 'image' && !content) {
            setListeningFieldError(
                'listeningContent',
                'listening-err-content',
                'Section content is required.'
            );
            valid = false;
        }

        if (!answers.length) {
            setListeningFieldError(
                'listeningAnswers',
                'listening-err-answers',
                'Provide at least one correct answer.'
            );
            valid = false;
        }
    }

    return valid;
}

function buildListeningPayload() {
    const generatedContent = getGeneratedListeningContent();
    const normalizedAnswers = collectListeningAnswersForSave();
    const sections = generatedContent ? [] : buildListeningSectionsFallback();
    const needsImageContent = sections.some((section) => section.type === 'image');

    const formData = new FormData();
    formData.append('title', document.getElementById('listeningTitle').value.trim());
    formData.append('audio', listeningAudioInput.files[0]);
    formData.append('videoType', listeningVideoTypeInput.value);
    formData.append('sections', JSON.stringify(sections));
    formData.append('content', generatedContent);
    formData.append('answers', JSON.stringify(normalizedAnswers));

    if (listeningVideoTypeInput.value === 'upload' && listeningVideoFileInput.files?.[0]) {
        formData.append('videoFile', listeningVideoFileInput.files[0]);
    }

    if (listeningVideoTypeInput.value === 'link' && listeningVideoLinkInput.value.trim()) {
        formData.append('videoLink', listeningVideoLinkInput.value.trim());
    }

    if (needsImageContent && listeningContentImageInput.files?.[0]) {
        formData.append('contentImage', listeningContentImageInput.files[0]);
    }

    return formData;
}

function clearListeningFormState() {
    listeningForm?.reset();
    clearFormErrors();
    syncListeningVideoFields();
    syncListeningSectionFields();
    generatedListeningQuestions = [];

    if (listeningPreviewWrap) {
        listeningPreviewWrap.classList.add('field-hidden');
    }

    if (listeningPreviewWarning) {
        listeningPreviewWarning.classList.add('field-hidden');
    }

    if (listeningGeneratedContent) {
        listeningGeneratedContent.innerHTML = '';
    }

    if (listeningGeneratedAnswers) {
        listeningGeneratedAnswers.value = '';
    }

    if (listeningRenderedPreview) {
        listeningRenderedPreview.innerHTML = '';
    }

    if (listeningGeneratorStatus) {
        listeningGeneratorStatus.textContent =
            'Upload a worksheet, then review the generated structure before saving.';
    }

    if (analyzeListeningBtn) {
        analyzeListeningBtn.disabled = false;
        analyzeListeningBtn.textContent = 'Analyze';
    }

    if (listeningAudioHint) {
        listeningAudioHint.textContent = 'Audio is mandatory for every listening task.';
    }
}

function openCreateListeningModal() {
    listeningModalTitle.textContent = 'Add Listening Task';
    listeningModalSubmit.textContent = 'Save Listening Task';
    clearListeningFormState();
    listeningModalOverlay.classList.add('open');
}

function closeListeningModal() {
    listeningModalOverlay.classList.remove('open');
    clearListeningFormState();
}

function openDeleteListeningModal(trigger) {
    const card = trigger.closest('[data-listening-card]');
    if (!card) {
        return;
    }

    pendingListeningDeleteId = card.dataset.listeningId;
    document.getElementById('deleteListeningName').textContent =
        card.dataset.listeningTitle || 'this task';
    deleteListeningModalOverlay.classList.add('open');
}

function closeDeleteListeningModal() {
    deleteListeningModalOverlay.classList.remove('open');
    pendingListeningDeleteId = null;
}

async function analyzeListeningSource() {
    const sourceFile = listeningSourceFileInput.files?.[0];

    if (!sourceFile) {
        setListeningFieldError(
            'listeningSourceFile',
            'listening-err-source-file',
            'Please choose a PDF, JPG, or PNG file first.'
        );
        return;
    }

    analyzeListeningBtn.disabled = true;
    analyzeListeningBtn.textContent = 'Analyzing...';
    listeningGeneratorStatus.textContent = 'Parsing worksheet on the server...';

    try {
        const parsed = await requestParsedListeningStructure(sourceFile);
        renderListeningPreview(
            parsed.content,
            parsed.questions,
            'OCR may contain mistakes. Please review the generated HTML and correct answers before saving.'
        );
        listeningGeneratorStatus.textContent =
            'Preview is ready. Review the HTML, fix inputs if needed, and add correct answers manually.';
        showToast('Listening worksheet parsed successfully.', 'success');
    } catch (error) {
        listeningGeneratorStatus.textContent =
            'Parsing failed. Please try another file or build the task manually.';
        renderListeningPreview('', []);
        showToast(error.message || 'Parsing failed.', 'error');
    } finally {
        analyzeListeningBtn.disabled = false;
        analyzeListeningBtn.textContent = 'Analyze';
    }
}

function validateBookForm() {
    clearBookFormErrors();
    let valid = true;

    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const level = document.getElementById('bookLevel').value;
    const hasPdfFile = Boolean(bookPdfInput.files?.[0]);
    const hasExistingPdf = Boolean(currentBookPdfValue);

    if (!title) {
        setBookFieldError('bookTitle', 'book-err-title', 'Book title is required.');
        valid = false;
    }

    if (!author) {
        setBookFieldError('bookAuthor', 'book-err-author', 'Author is required.');
        valid = false;
    }

    if (!level) {
        setBookFieldError('bookLevel', 'book-err-level', 'Please select a level.');
        valid = false;
    }

    if (!hasPdfFile && !hasExistingPdf) {
        setBookFieldError('bookPdf', 'book-err-pdf', 'PDF is required.');
        valid = false;
    }

    return valid;
}

function buildBookPayload() {
    const formData = new FormData();

    formData.append('title', document.getElementById('bookTitle').value.trim());
    formData.append('author', document.getElementById('bookAuthor').value.trim());
    formData.append('level', document.getElementById('bookLevel').value);

    if (bookPdfInput.files?.[0]) {
        formData.append('pdf', bookPdfInput.files[0]);
    }

    if (bookImageInput.files?.[0]) {
        formData.append('image', bookImageInput.files[0]);
    }

    return formData;
}

function renderVideos(payload) {
    if (!videoGrid) {
        return;
    }

    const videos = Array.isArray(payload?.data) ? payload.data : [];

    if (!videos.length) {
        videoGrid.innerHTML = `<div class="video-empty">No video lessons have been added yet.</div>`;
        return;
    }

    videoGrid.innerHTML = videos
        .map(
            (video) => `
        <article class="panel video-card" data-video-card="true" data-video-id="${video.id}" data-video-title="${escapeHtml(video.title)}">
          <div class="video-card-body">
            <div class="video-card-copy">
              <div class="video-card-badges">
                <span class="book-badge">${escapeHtml(video.level || 'A1')}</span>
                <span class="book-badge">${video.type === 'upload' ? 'Upload' : 'Link'}</span>
                ${video.taskId ? `<span class="book-badge">Task available</span>` : ''}
              </div>
              <h3>${escapeHtml(video.title)}</h3>
              <p class="video-card-author">${escapeHtml(video.author)}</p>
              <p class="video-card-description">${escapeHtml(video.description)}</p>
            </div>

            <div class="video-card-footer">
              <span class="video-card-task">${video.taskId ? escapeHtml(getVideoTaskTitle(video.taskId)) : 'No task attached'}</span>
              <div class="book-card-actions">
                <button class="btn btn-danger btn-shine book-action" type="button" data-video-action="delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>
      `
        )
        .join('');
}

function renderListeningTasks(payload) {
    if (!listeningGrid) {
        return;
    }

    const items = Array.isArray(payload?.data) ? payload.data : [];

    if (!items.length) {
        listeningGrid.innerHTML = `<div class="video-empty">No listening tasks have been added yet.</div>`;
        return;
    }

    listeningGrid.innerHTML = items
        .map((task) => {
            const firstSection = task.sections?.[0];
            const answerCount = task.answers?.length || firstSection?.questions?.length || 0;

            return `
        <article class="panel listening-card" data-listening-card="true" data-listening-id="${task.id}" data-listening-title="${escapeHtml(task.title)}">
          <div class="video-card-body">
            <div class="video-card-copy">
              <div class="video-card-badges">
                <span class="book-badge">${escapeHtml(task.level || 'A1')}</span>
                <span class="book-badge">Audio required</span>
                ${task.video ? `<span class="book-badge">Video attached</span>` : ''}
                <span class="book-badge">${escapeHtml(firstSection?.type || 'Section')}</span>
              </div>
              <h3>${escapeHtml(task.title)}</h3>
              <p class="video-card-description">${escapeHtml(firstSection?.instructions || 'IELTS listening section')}</p>
            </div>

            <div class="video-card-footer">
              <span class="video-card-task">${answerCount} answers • ${task.sections?.length || 0} section${task.sections?.length === 1 ? '' : 's'}</span>
              <div class="book-card-actions">
                <button class="btn btn-danger btn-shine book-action" type="button" data-listening-action="delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
        })
        .join('');
}

async function loadVideos() {
    if (!videoGrid) {
        return;
    }

    videoGrid.innerHTML = `<div class="video-empty">Loading video lessons...</div>`;

    try {
        const response = await fetch(`${BASE_URL}/api/videos`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to load videos.');
        }

        renderVideos(data);
    } catch (error) {
        videoGrid.innerHTML = `<div class="video-empty">Video backend is not available yet.</div>`;
    }
}

async function loadListeningTasks() {
    if (!listeningGrid) {
        return;
    }

    listeningGrid.innerHTML = `<div class="video-empty">Loading listening tasks...</div>`;

    try {
        const response = await fetch(`${BASE_URL}/api/listening-tasks`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to load listening tasks.');
        }

        renderListeningTasks(data);
    } catch (error) {
        listeningGrid.innerHTML = `<div class="video-empty">Listening task backend is not available yet.</div>`;
    }
}

function clearVideoFormState() {
    videoForm.reset();
    clearFormErrors();
    renderVideoTaskOptions();
    syncVideoTypeFields();
}

function openCreateVideoModal() {
    videoModalTitle.textContent = 'Add Video';
    videoModalSubmit.textContent = 'Create Video';
    clearVideoFormState();
    videoModalOverlay.classList.add('open');
}

function closeVideoModal() {
    videoModalOverlay.classList.remove('open');
    clearVideoFormState();
}

function openDeleteVideoModal(trigger) {
    const card = trigger.closest('[data-video-card]');
    if (!card) {
        return;
    }

    pendingVideoDeleteId = card.dataset.videoId;
    document.getElementById('deleteVideoName').textContent =
        card.dataset.videoTitle || 'this lesson';
    deleteVideoModalOverlay.classList.add('open');
}

function closeDeleteVideoModal() {
    deleteVideoModalOverlay.classList.remove('open');
    pendingVideoDeleteId = null;
}

function setVideoFieldError(fieldId, errId, message) {
    const input = document.getElementById(fieldId);
    const err = document.getElementById(errId);

    if (input) {
        input.classList.add('invalid');
    }

    if (err) {
        err.textContent = message;
    }
}

function validateVideoForm() {
    clearFormErrors();
    let valid = true;

    const title = document.getElementById('videoTitle').value.trim();
    const author = document.getElementById('videoAuthor').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    const level = videoLevelInput.value;
    const type = videoTypeInput.value;
    const hasUpload = Boolean(videoFileInput.files?.[0]);
    const linkValue = videoUrlInput.value.trim();

    if (!title) {
        setVideoFieldError('videoTitle', 'video-err-title', 'Video title is required.');
        valid = false;
    }

    if (!author) {
        setVideoFieldError('videoAuthor', 'video-err-author', 'Author is required.');
        valid = false;
    }

    if (!description) {
        setVideoFieldError('videoDescription', 'video-err-description', 'Description is required.');
        valid = false;
    }

    if (!level) {
        setVideoFieldError('videoLevel', 'video-err-level', 'Level is required.');
        showToast('Level is required', 'error');
        valid = false;
    }

    if (type === 'upload' && !hasUpload) {
        setVideoFieldError('videoFile', 'video-err-file', 'Please upload a video file.');
        valid = false;
    }

    if (type === 'link' && !linkValue) {
        setVideoFieldError('videoUrl', 'video-err-url', 'Please provide a video link.');
        valid = false;
    }

    return valid;
}

function buildVideoPayload() {
    const formData = new FormData();

    formData.append('title', document.getElementById('videoTitle').value.trim());
    formData.append('author', document.getElementById('videoAuthor').value.trim());
    formData.append('description', document.getElementById('videoDescription').value.trim());
    formData.append('level', videoLevelInput.value);
    formData.append('type', videoTypeInput.value);

    if (videoTaskSelect.value) {
        formData.append('taskId', videoTaskSelect.value);
    }

    if (videoTypeInput.value === 'upload' && videoFileInput.files?.[0]) {
        formData.append('videoFile', videoFileInput.files[0]);
    }

    if (videoTypeInput.value === 'link') {
        formData.append('url', videoUrlInput.value.trim());
    }

    return formData;
}

async function onCreateBook(data) {
    const response = await fetch(`${BASE_URL}/api/books`, {
        method: 'POST',
        body: data,
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to create book.');
    }

    alert(value.message);
}

async function onUpdateBook(id, data) {
    const response = await fetch(`${BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        body: data,
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to update book.');
    }

    alert(value.message);
}

async function onDeleteBook(id) {
    const response = await fetch(`${BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to delete book.');
    }

    alert(value.message);
}

async function onCreateVideo(data) {
    const response = await fetch(`${BASE_URL}/api/videos`, {
        method: 'POST',
        body: data,
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to create video.');
    }

    alert(value.message);
}

async function onDeleteVideo(id) {
    const response = await fetch(`${BASE_URL}/api/videos/${id}`, {
        method: 'DELETE',
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to delete video.');
    }

    alert(value.message);
}

async function onCreateListeningTask(data) {
    const response = await fetch(`${BASE_URL}/api/listening-tasks`, {
        method: 'POST',
        body: data,
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to create listening task.');
    }

    showToast(value.message, 'success');
}

async function onDeleteListeningTask(id) {
    const response = await fetch(`${BASE_URL}/api/listening-tasks/${id}`, {
        method: 'DELETE',
    });

    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.message || 'Failed to delete listening task.');
    }

    showToast(value.message, 'success');
}

addBookBtn?.addEventListener('click', openCreateBookModal);
addVideoBtn?.addEventListener('click', openCreateVideoModal);
addListeningBtn?.addEventListener('click', openCreateListeningModal);

bookSearchInput?.addEventListener('input', loadBooks);
bookLevelFilter?.addEventListener('change', loadBooks);

bookGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-book-action]');
    if (!button) {
        return;
    }

    const action = button.dataset.bookAction;

    if (action === 'edit') {
        openEditBookModal(button);
    }

    if (action === 'delete') {
        openDeleteBookModal(button);
    }
});

videoGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-video-action]');
    if (!button) {
        return;
    }

    if (button.dataset.videoAction === 'delete') {
        openDeleteVideoModal(button);
    }
});

listeningGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-listening-action]');
    if (!button) {
        return;
    }

    if (button.dataset.listeningAction === 'delete') {
        openDeleteListeningModal(button);
    }
});

document.getElementById('bookModalClose')?.addEventListener('click', closeBookModal);
document.getElementById('bookModalCancel')?.addEventListener('click', closeBookModal);
bookModalOverlay?.addEventListener('click', (event) => {
    if (event.target === bookModalOverlay) {
        closeBookModal();
    }
});

bookPdfInput?.addEventListener('change', () => {
    const selectedFile = bookPdfInput.files?.[0];
    bookPdfHint.textContent = selectedFile
        ? `Selected PDF: ${selectedFile.name}`
        : currentBookPdfValue
          ? `Current PDF: ${getPdfFileName(currentBookPdfValue)}`
          : 'PDF is required for new books.';
});

bookImageInput?.addEventListener('change', () => {
    const file = bookImageInput.files?.[0];

    resetBookObjectUrl();

    if (!file) {
        updateBookPreview(resolveBookImage(currentBookImageValue));
        return;
    }

    currentBookObjectUrl = URL.createObjectURL(file);
    updateBookPreview(currentBookObjectUrl);
});

videoTypeInput?.addEventListener('change', syncVideoTypeFields);
listeningVideoTypeInput?.addEventListener('change', syncListeningVideoFields);
listeningSectionTypeInput?.addEventListener('change', syncListeningSectionFields);
analyzeListeningBtn?.addEventListener('click', analyzeListeningSource);
listeningAudioInput?.addEventListener('change', () => {
    const selectedFile = listeningAudioInput.files?.[0];
    listeningAudioHint.textContent = selectedFile
        ? `Selected audio: ${selectedFile.name}`
        : 'Audio is mandatory for every listening task.';
});

listeningGeneratedContent?.addEventListener('input', () => {
    if (listeningRenderedPreview) {
        listeningRenderedPreview.innerHTML = listeningGeneratedContent.innerHTML;
    }
});

bookForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateBookForm()) {
        return;
    }

    const id = document.getElementById('bookId').value;
    bookModalSubmit.disabled = true;
    bookModalSubmit.textContent = 'Saving...';

    try {
        const payload = buildBookPayload();

        if (id) {
            await onUpdateBook(id, payload);
        } else {
            await onCreateBook(payload);
        }

        closeBookModal();
        await loadBooks();
    } catch (error) {
        alert(error.message);
    } finally {
        bookModalSubmit.disabled = false;
        bookModalSubmit.textContent = id ? 'Save Changes' : 'Create Book';
    }
});

document.getElementById('videoModalClose')?.addEventListener('click', closeVideoModal);
document.getElementById('videoModalCancel')?.addEventListener('click', closeVideoModal);
videoModalOverlay?.addEventListener('click', (event) => {
    if (event.target === videoModalOverlay) {
        closeVideoModal();
    }
});

videoForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateVideoForm()) {
        return;
    }

    videoModalSubmit.disabled = true;
    videoModalSubmit.textContent = 'Saving...';

    try {
        const payload = buildVideoPayload();
        await onCreateVideo(payload);
        closeVideoModal();
        await loadVideos();
    } catch (error) {
        alert(error.message);
    } finally {
        videoModalSubmit.disabled = false;
        videoModalSubmit.textContent = 'Create Video';
    }
});

document.getElementById('listeningModalClose')?.addEventListener('click', closeListeningModal);
document.getElementById('listeningModalCancel')?.addEventListener('click', closeListeningModal);
listeningModalOverlay?.addEventListener('click', (event) => {
    if (event.target === listeningModalOverlay) {
        closeListeningModal();
    }
});

listeningForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateListeningForm()) {
        return;
    }

    listeningModalSubmit.disabled = true;
    listeningModalSubmit.textContent = 'Saving...';

    try {
        const payload = buildListeningPayload();
        await onCreateListeningTask(payload);
        closeListeningModal();
        await loadListeningTasks();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        listeningModalSubmit.disabled = false;
        listeningModalSubmit.textContent = 'Save Listening Task';
    }
});

document.getElementById('deleteBookModalClose')?.addEventListener('click', closeDeleteBookModal);
document.getElementById('deleteBookModalCancel')?.addEventListener('click', closeDeleteBookModal);
deleteBookModalOverlay?.addEventListener('click', (event) => {
    if (event.target === deleteBookModalOverlay) {
        closeDeleteBookModal();
    }
});

deleteBookModalConfirm?.addEventListener('click', async () => {
    if (!pendingBookDeleteId) {
        return;
    }

    deleteBookModalConfirm.disabled = true;
    deleteBookModalConfirm.textContent = 'Deleting...';

    try {
        await onDeleteBook(pendingBookDeleteId);
        closeDeleteBookModal();
        await loadBooks();
    } catch (error) {
        alert(error.message);
    } finally {
        deleteBookModalConfirm.disabled = false;
        deleteBookModalConfirm.textContent = 'Yes, Delete';
    }
});

document.getElementById('deleteVideoModalClose')?.addEventListener('click', closeDeleteVideoModal);
document.getElementById('deleteVideoModalCancel')?.addEventListener('click', closeDeleteVideoModal);
deleteVideoModalOverlay?.addEventListener('click', (event) => {
    if (event.target === deleteVideoModalOverlay) {
        closeDeleteVideoModal();
    }
});

deleteVideoModalConfirm?.addEventListener('click', async () => {
    if (!pendingVideoDeleteId) {
        return;
    }

    deleteVideoModalConfirm.disabled = true;
    deleteVideoModalConfirm.textContent = 'Deleting...';

    try {
        await onDeleteVideo(pendingVideoDeleteId);
        closeDeleteVideoModal();
        await loadVideos();
    } catch (error) {
        alert(error.message);
    } finally {
        deleteVideoModalConfirm.disabled = false;
        deleteVideoModalConfirm.textContent = 'Yes, Delete';
    }
});

document
    .getElementById('deleteListeningModalClose')
    ?.addEventListener('click', closeDeleteListeningModal);
document
    .getElementById('deleteListeningModalCancel')
    ?.addEventListener('click', closeDeleteListeningModal);
deleteListeningModalOverlay?.addEventListener('click', (event) => {
    if (event.target === deleteListeningModalOverlay) {
        closeDeleteListeningModal();
    }
});

deleteListeningModalConfirm?.addEventListener('click', async () => {
    if (!pendingListeningDeleteId) {
        return;
    }

    deleteListeningModalConfirm.disabled = true;
    deleteListeningModalConfirm.textContent = 'Deleting...';

    try {
        await onDeleteListeningTask(pendingListeningDeleteId);
        closeDeleteListeningModal();
        await loadListeningTasks();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        deleteListeningModalConfirm.disabled = false;
        deleteListeningModalConfirm.textContent = 'Yes, Delete';
    }
});

renderDashboardActivity();
renderStudents();
renderVideoTaskOptions();
syncVideoTypeFields();
syncListeningVideoFields();
syncListeningSectionFields();
applyTheme(localStorage.getItem(THEME_KEY) || 'light');
