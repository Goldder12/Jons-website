const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const fssync = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "front-end");
const HTML_DIR = path.join(FRONTEND_DIR, "html");
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const BOOKS_FILE = path.join(DATA_DIR, "books.json");
const SPEAKING_QUESTIONS_FILE = path.join(DATA_DIR, "speaking_questions.json");
const SPEAKING_RESULTS_FILE = path.join(DATA_DIR, "speaking_results.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const BOOK_UPLOADS_DIR = path.join(UPLOADS_DIR, "books");
const COVER_UPLOADS_DIR = path.join(UPLOADS_DIR, "covers");
const SPEAKING_UPLOADS_DIR = path.join(UPLOADS_DIR, "speaking");
const PDF_SIZE_LIMIT = 25 * 1024 * 1024;
const COVER_SIZE_LIMIT = 6 * 1024 * 1024;
const AUDIO_SIZE_LIMIT = 30 * 1024 * 1024;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(FRONTEND_DIR));

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sanitizeText(value, maxLength = 255) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeFileReference(filePath) {
  const normalized = String(filePath || "").replace(/\\/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function sanitizeBook(book) {
  return {
    id: Number(book.id),
    title: sanitizeText(book.title, 120),
    level: sanitizeText(book.level, 40),
    description: sanitizeText(book.description, 320),
    file: sanitizeFileReference(book.file),
    cover: sanitizeFileReference(book.cover)
  };
}

async function ensureRuntimeFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(BOOK_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(COVER_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(SPEAKING_UPLOADS_DIR, { recursive: true });

  if (!fssync.existsSync(BOOKS_FILE)) {
    await fs.writeFile(BOOKS_FILE, "[]\n", "utf8");
  }

  if (!fssync.existsSync(SPEAKING_QUESTIONS_FILE)) {
    await fs.writeFile(SPEAKING_QUESTIONS_FILE, `${JSON.stringify(defaultSpeakingQuestions, null, 2)}\n`, "utf8");
  }

  if (!fssync.existsSync(SPEAKING_RESULTS_FILE)) {
    await fs.writeFile(SPEAKING_RESULTS_FILE, "[]\n", "utf8");
  }
}

const defaultSpeakingQuestions = [
  {
    id: 1,
    level: "B1",
    question: "Describe your favorite place and explain why you like it."
  },
  {
    id: 2,
    level: "B2",
    question: "Talk about a skill you would like to improve and explain your reasons."
  },
  {
    id: 3,
    level: "IELTS",
    question: "Describe a person who inspired you and explain how they influenced your life."
  },
  {
    id: 4,
    level: "IELTS",
    question: "Describe an important decision you made and explain why it was difficult."
  }
];

async function readUsers() {
  const file = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(file);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

async function readBooks() {
  const file = await fs.readFile(BOOKS_FILE, "utf8");
  const parsed = JSON.parse(file);
  return Array.isArray(parsed) ? parsed.map(sanitizeBook) : [];
}

async function writeBooks(books) {
  const normalizedBooks = books.map(sanitizeBook);
  await fs.writeFile(BOOKS_FILE, `${JSON.stringify(normalizedBooks, null, 2)}\n`, "utf8");
}

async function readSpeakingQuestions() {
  const file = await fs.readFile(SPEAKING_QUESTIONS_FILE, "utf8");
  const parsed = JSON.parse(file);

  return Array.isArray(parsed)
    ? parsed.map((item) => ({
      id: Number(item.id),
      level: sanitizeText(item.level, 24),
      question: sanitizeText(item.question, 260)
    }))
    : [];
}

async function writeSpeakingQuestions(questions) {
  await fs.writeFile(SPEAKING_QUESTIONS_FILE, `${JSON.stringify(questions, null, 2)}\n`, "utf8");
}

async function readSpeakingResults() {
  const file = await fs.readFile(SPEAKING_RESULTS_FILE, "utf8");
  const parsed = JSON.parse(file);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeSpeakingResults(results) {
  await fs.writeFile(SPEAKING_RESULTS_FILE, `${JSON.stringify(results, null, 2)}\n`, "utf8");
}

function createStorage(targetDirectory) {
  return multer.diskStorage({
    destination(_req, _file, callback) {
      callback(null, targetDirectory);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || "");
      const baseName = slugify(req.body.title || file.originalname || "library-file") || "library-file";
      callback(null, `${baseName}-${Date.now()}${extension.toLowerCase()}`);
    }
  });
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      const fieldDestination = file.fieldname === "cover" ? COVER_UPLOADS_DIR : BOOK_UPLOADS_DIR;
      callback(null, fieldDestination);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || "");
      const baseName = slugify(req.body.title || file.originalname || "library-file") || "library-file";
      callback(null, `${baseName}-${Date.now()}${extension.toLowerCase()}`);
    }
  }),
  limits: {
    fileSize: PDF_SIZE_LIMIT
  },
  fileFilter(_req, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase();

    if (file.fieldname === "pdf") {
      const isValidPdf = file.mimetype === "application/pdf" || extension === ".pdf";
      callback(isValidPdf ? null : new Error("Only PDF files are allowed for books"), isValidPdf);
      return;
    }

    if (file.fieldname === "cover") {
      const isValidImage = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) || [".jpg", ".jpeg", ".png", ".webp"].includes(extension);
      callback(isValidImage ? null : new Error("Only JPG, PNG, or WEBP images are allowed for covers"), isValidImage);
      return;
    }

    callback(new Error("Unexpected upload field"), false);
  }
});

const speakingUpload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      callback(null, SPEAKING_UPLOADS_DIR);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || "") || ".webm";
      const userId = Number(req.body.userId || req.get("x-user-id")) || "student";
      callback(null, `speaking-${userId}-${Date.now()}${extension.toLowerCase()}`);
    }
  }),
  limits: {
    fileSize: AUDIO_SIZE_LIMIT
  },
  fileFilter(_req, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const validMimeTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/m4a",
      "video/webm"
    ];
    const validExtensions = [".mp3", ".wav", ".webm", ".ogg", ".m4a", ".mp4"];
    const isValidAudio = validMimeTypes.includes(file.mimetype) || validExtensions.includes(extension);

    callback(isValidAudio ? null : new Error("Only MP3, WAV, WEBM, OGG, or M4A audio files are allowed"), isValidAudio);
  }
});

function validateRegisterPayload(payload) {
  const fields = ["firstName", "lastName", "username", "phone", "email", "password"];
  const missingField = fields.find((field) => !String(payload[field] || "").trim());

  if (missingField) {
    return `${missingField} is required`;
  }

  if (!/^\S+@\S+\.\S+$/.test(String(payload.email).trim())) {
    return "Valid email is required";
  }

  if (String(payload.password).trim().length < 5) {
    return "Password must be at least 5 characters";
  }

  return "";
}

function validateBookPayload(payload, files) {
  const title = sanitizeText(payload.title, 120);
  const level = sanitizeText(payload.level, 40);
  const description = sanitizeText(payload.description, 320);
  const externalFileUrl = sanitizeText(payload.externalFileUrl, 300);
  const coverUrl = sanitizeText(payload.coverUrl, 300);

  if (!title) {
    return "Title is required";
  }

  if (!level) {
    return "Level is required";
  }

  if (!description) {
    return "Description is required";
  }

  const uploadedPdf = Array.isArray(files?.pdf) && files.pdf[0];
  const hasExternalPdf = /^https?:\/\/.+\.pdf(?:\?.*)?$/i.test(externalFileUrl);

  if (!uploadedPdf && !hasExternalPdf) {
    return "Upload a PDF file or provide a valid external PDF URL";
  }

  if (coverUrl && !/^https?:\/\//i.test(coverUrl)) {
    return "Cover URL must be a valid http or https link";
  }

  return "";
}

function validateBookUpdatePayload(payload) {
  const title = sanitizeText(payload.title, 120);
  const level = sanitizeText(payload.level, 40);
  const description = sanitizeText(payload.description, 320);
  const externalFileUrl = sanitizeText(payload.externalFileUrl, 300);
  const coverUrl = sanitizeText(payload.coverUrl, 300);

  if (!title) {
    return "Title is required";
  }

  if (!level) {
    return "Level is required";
  }

  if (!description) {
    return "Description is required";
  }

  if (externalFileUrl && !/^https?:\/\/.+\.pdf(?:\?.*)?$/i.test(externalFileUrl)) {
    return "External PDF URL must be a valid PDF link";
  }

  if (coverUrl && !/^https?:\/\//i.test(coverUrl)) {
    return "Cover URL must be a valid http or https link";
  }

  return "";
}

async function getAuthenticatedAdmin(req) {
  const userId = Number(req.get("x-user-id"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const users = await readUsers();
  const matchedUser = users.find((user) => user.id === userId);

  if (!matchedUser || matchedUser.role !== "admin") {
    return null;
  }

  return matchedUser;
}

async function getAuthenticatedUser(req) {
  const userId = Number(req.get("x-user-id") || req.body.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const users = await readUsers();
  return users.find((user) => user.id === userId) || null;
}

function bookUploadMiddleware(req, res, next) {
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ])(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message = error instanceof multer.MulterError
      ? (error.code === "LIMIT_FILE_SIZE" ? "Uploaded file exceeds the size limit" : error.message)
      : error.message;

    res.status(400).json({
      success: false,
      message
    });
  });
}

function speakingUploadMiddleware(req, res, next) {
  speakingUpload.single("audio")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message = error instanceof multer.MulterError
      ? (error.code === "LIMIT_FILE_SIZE" ? "Audio file exceeds the size limit" : error.message)
      : error.message;

    res.status(400).json({
      success: false,
      message
    });
  });
}

async function safelyDeleteUploadedFile(filePath) {
  if (!filePath || !String(filePath).startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(__dirname, filePath.replace(/^\/+/, ""));
  if (!absolutePath.startsWith(UPLOADS_DIR)) {
    return;
  }

  try {
    await fs.unlink(absolutePath);
  } catch {
    // Ignore missing files while keeping the JSON store consistent.
  }
}

async function cleanupUploadedRequestFiles(...files) {
  await Promise.all(
    files
      .filter(Boolean)
      .map((file) => fs.unlink(file.path).catch(() => {}))
  );
}

function extractJsonObject(value) {
  const raw = String(value || "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalizeSpeakingAnalysis(analysis) {
  return {
    score: Math.max(0, Math.min(9, Number(analysis?.score) || 0)),
    fluency: sanitizeText(analysis?.fluency, 420),
    vocabulary: sanitizeText(analysis?.vocabulary, 420),
    grammar: sanitizeText(analysis?.grammar, 420),
    pronunciation: sanitizeText(analysis?.pronunciation, 420),
    mistakes: Array.isArray(analysis?.mistakes)
      ? analysis.mistakes.map((item) => sanitizeText(item, 180)).filter(Boolean).slice(0, 8)
      : [],
    suggestions: Array.isArray(analysis?.suggestions)
      ? analysis.suggestions.map((item) => sanitizeText(item, 180)).filter(Boolean).slice(0, 8)
      : []
  };
}

function createLocalSpeakingAnalysis(transcript) {
  const words = String(transcript || "").trim().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words.map((word) => word.toLowerCase().replace(/[^a-z']/g, ""))).size;
  const lexicalRatio = words.length ? uniqueWords / words.length : 0;
  const sentenceCount = Math.max(1, String(transcript || "").split(/[.!?]+/).filter((item) => item.trim()).length);
  const averageSentenceLength = words.length / sentenceCount;
  const score = Math.max(4, Math.min(7.5, 4.5 + (words.length >= 80 ? 1 : 0) + (lexicalRatio > 0.55 ? 1 : 0) + (averageSentenceLength > 10 ? 1 : 0)));

  return normalizeSpeakingAnalysis({
    score: Number(score.toFixed(1)),
    fluency: words.length >= 70
      ? "The response is developed enough to show a clear speaking flow."
      : "The response is short, so fluency is difficult to demonstrate fully.",
    vocabulary: lexicalRatio > 0.55
      ? "The vocabulary range is appropriate and avoids frequent repetition."
      : "The vocabulary range is limited and some word choices are repeated.",
    grammar: averageSentenceLength > 10
      ? "The response includes some sentence development, but accuracy should be checked carefully."
      : "The response relies on short structures and needs more grammatical variety.",
    pronunciation: "Pronunciation is estimated from the transcript only. Use clear stress, pacing, and endings while speaking.",
    mistakes: [
      "Some ideas need more specific support.",
      "Sentence variety can be improved."
    ],
    suggestions: [
      "Add examples to support each main idea.",
      "Use linking phrases such as however, as a result, and for example.",
      "Include a wider range of adjectives and topic-specific vocabulary."
    ]
  });
}

async function transcribeAudioWithOpenAI(audioFile) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for speech transcription");
  }

  const audioBuffer = await fs.readFile(audioFile.path);
  const audioBlob = new Blob([audioBuffer], {
    type: audioFile.mimetype || "application/octet-stream"
  });
  const formData = new FormData();
  formData.append("file", audioBlob, audioFile.originalname || path.basename(audioFile.path));
  formData.append("model", "whisper-1");
  formData.append("response_format", "json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: formData
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Speech transcription failed");
  }

  return sanitizeText(result?.text, 6000);
}

async function analyzeSpeakingWithOpenAI({ transcript, question, level }) {
  if (!OPENAI_API_KEY) {
    return createLocalSpeakingAnalysis(transcript);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You are an IELTS speaking examiner. Return only valid JSON with score, fluency, vocabulary, grammar, pronunciation, mistakes, and suggestions."
        },
        {
          role: "user",
          content: `Evaluate this speaking response.\nLevel: ${level}\nQuestion: ${question}\nTranscript: ${transcript}\n\nUse IELTS Speaking criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation estimated from the transcript. Return JSON only.`
        }
      ]
    })
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Speaking analysis failed");
  }

  const content = result?.choices?.[0]?.message?.content || "";
  const parsed = extractJsonObject(content);

  if (!parsed) {
    throw new Error("AI response could not be parsed");
  }

  return normalizeSpeakingAnalysis(parsed);
}

app.get("/api/books", async (_req, res) => {
  try {
    const books = await readBooks();
    return res.status(200).json(books);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to load books"
    });
  }
});

app.post("/api/books", bookUploadMiddleware, async (req, res) => {
  const uploadedPdf = Array.isArray(req.files?.pdf) ? req.files.pdf[0] : null;
  const uploadedCover = Array.isArray(req.files?.cover) ? req.files.cover[0] : null;

  try {
    const adminUser = await getAuthenticatedAdmin(req);

    if (!adminUser) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const validationError = validateBookPayload(req.body, req.files);
    if (validationError) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const books = await readBooks();
    const nextBook = sanitizeBook({
      id: books.reduce((maxId, book) => Math.max(maxId, Number(book.id) || 0), 0) + 1,
      title: req.body.title,
      level: req.body.level,
      description: req.body.description,
      file: uploadedPdf
        ? `/uploads/books/${path.basename(uploadedPdf.path)}`
        : sanitizeText(req.body.externalFileUrl, 300),
      cover: uploadedCover
        ? `/uploads/covers/${path.basename(uploadedCover.path)}`
        : (sanitizeText(req.body.coverUrl, 300) || "/img/photo_2023-03-10_05-57-29.jpg")
    });

    books.push(nextBook);
    await writeBooks(books);

    return res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      book: nextBook
    });
  } catch {
    await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

    return res.status(500).json({
      success: false,
      message: "Failed to upload book"
    });
  }
});

app.put("/api/books/:id", bookUploadMiddleware, async (req, res) => {
  const uploadedPdf = Array.isArray(req.files?.pdf) ? req.files.pdf[0] : null;
  const uploadedCover = Array.isArray(req.files?.cover) ? req.files.cover[0] : null;

  try {
    const adminUser = await getAuthenticatedAdmin(req);

    if (!adminUser) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(400).json({
        success: false,
        message: "Valid book id is required"
      });
    }

    const validationError = validateBookUpdatePayload(req.body);
    if (validationError) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const books = await readBooks();
    const bookIndex = books.findIndex((book) => Number(book.id) === bookId);

    if (bookIndex === -1) {
      await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const existingBook = books[bookIndex];
    const externalFileUrl = sanitizeText(req.body.externalFileUrl, 300);
    const coverUrl = sanitizeText(req.body.coverUrl, 300);
    const nextBook = sanitizeBook({
      ...existingBook,
      title: req.body.title,
      level: req.body.level,
      description: req.body.description,
      file: uploadedPdf
        ? `/uploads/books/${path.basename(uploadedPdf.path)}`
        : (externalFileUrl || existingBook.file),
      cover: uploadedCover
        ? `/uploads/covers/${path.basename(uploadedCover.path)}`
        : (coverUrl || existingBook.cover)
    });

    books[bookIndex] = nextBook;
    await writeBooks(books);

    if (uploadedPdf) {
      await safelyDeleteUploadedFile(existingBook.file);
    }

    if (uploadedCover) {
      await safelyDeleteUploadedFile(existingBook.cover);
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: nextBook
    });
  } catch {
    await cleanupUploadedRequestFiles(uploadedPdf, uploadedCover);

    return res.status(500).json({
      success: false,
      message: "Failed to update book"
    });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const adminUser = await getAuthenticatedAdmin(req);

    if (!adminUser) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid book id is required"
      });
    }

    const books = await readBooks();
    const bookIndex = books.findIndex((book) => Number(book.id) === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const [removedBook] = books.splice(bookIndex, 1);
    await writeBooks(books);
    await safelyDeleteUploadedFile(removedBook.file);
    await safelyDeleteUploadedFile(removedBook.cover);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully"
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book"
    });
  }
});

app.get("/api/speaking/questions", async (_req, res) => {
  try {
    const questions = await readSpeakingQuestions();
    return res.status(200).json(questions);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to load speaking questions"
    });
  }
});

app.post("/api/speaking/questions", async (req, res) => {
  try {
    const adminUser = await getAuthenticatedAdmin(req);

    if (!adminUser) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const level = sanitizeText(req.body.level, 24);
    const questionText = sanitizeText(req.body.question, 260);

    if (!level || !questionText) {
      return res.status(400).json({
        success: false,
        message: "Level and question are required"
      });
    }

    const questions = await readSpeakingQuestions();
    const nextQuestion = {
      id: questions.reduce((maxId, question) => Math.max(maxId, Number(question.id) || 0), 0) + 1,
      level,
      question: questionText
    };

    questions.push(nextQuestion);
    await writeSpeakingQuestions(questions);

    return res.status(201).json({
      success: true,
      message: "Speaking question added successfully",
      question: nextQuestion
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to add speaking question"
    });
  }
});

app.post("/api/speaking/upload", speakingUploadMiddleware, async (req, res) => {
  const audioFile = req.file || null;

  try {
    const authenticatedUser = await getAuthenticatedUser(req);

    if (!authenticatedUser) {
      await cleanupUploadedRequestFiles(audioFile);

      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const questionId = Number(req.body.questionId);
    const questions = await readSpeakingQuestions();
    const selectedQuestion = questions.find((question) => Number(question.id) === questionId);

    if (!selectedQuestion) {
      await cleanupUploadedRequestFiles(audioFile);

      return res.status(400).json({
        success: false,
        message: "Valid speaking question is required"
      });
    }

    let transcript = sanitizeText(req.body.transcript, 6000);

    if (!transcript) {
      if (!audioFile) {
        return res.status(400).json({
          success: false,
          message: "Audio file or transcript is required"
        });
      }

      transcript = await transcribeAudioWithOpenAI(audioFile);
    }

    if (!transcript) {
      await cleanupUploadedRequestFiles(audioFile);

      return res.status(422).json({
        success: false,
        message: "No speech could be transcribed from the audio"
      });
    }

    const analysis = await analyzeSpeakingWithOpenAI({
      transcript,
      question: selectedQuestion.question,
      level: selectedQuestion.level
    });
    const results = await readSpeakingResults();
    const nextResult = {
      id: results.reduce((maxId, result) => Math.max(maxId, Number(result.id) || 0), 0) + 1,
      userId: authenticatedUser.id,
      questionId: selectedQuestion.id,
      level: selectedQuestion.level,
      question: selectedQuestion.question,
      audioFile: audioFile ? `/uploads/speaking/${path.basename(audioFile.path)}` : null,
      transcript,
      analysis,
      createdAt: new Date().toISOString()
    };

    results.push(nextResult);
    await writeSpeakingResults(results);

    return res.status(200).json({
      success: true,
      transcript,
      analysis,
      result: nextResult
    });
  } catch (error) {
    await cleanupUploadedRequestFiles(audioFile);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate speaking response"
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const validationError = validateRegisterPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const users = await readUsers();
    const email = String(req.body.email).trim().toLowerCase();
    const username = String(req.body.username).trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    if (users.some((user) => user.username.toLowerCase() === username)) {
      return res.status(409).json({ success: false, message: "Username already exists" });
    }

    const nextUser = {
      id: users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1,
      role: "student",
      firstName: String(req.body.firstName).trim(),
      lastName: String(req.body.lastName).trim(),
      username: String(req.body.username).trim(),
      phone: String(req.body.phone).trim(),
      email,
      password: String(req.body.password).trim(),
      group: "IELTS Intermediate",
      avatar: "https://i.pravatar.cc/150?img=47"
    };

    users.push(nextUser);
    await writeUsers(users);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: sanitizeUser(nextUser)
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const users = await readUsers();
    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email && user.password === password
    );

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(matchedUser)
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
});

app.post("/api/change-password", async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    const currentPassword = String(req.body.currentPassword || "").trim();
    const newPassword = String(req.body.newPassword || "").trim();

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid user id is required"
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (users[userIndex].password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password incorrect"
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword
    };

    await writeUsers(users);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user: sanitizeUser(users[userIndex])
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(HTML_DIR, "index.html"));
});

app.get("/index.html", (_req, res) => {
  res.sendFile(path.join(HTML_DIR, "index.html"));
});

app.get("/student.html", (_req, res) => {
  res.sendFile(path.join(HTML_DIR, "student.html"));
});

app.get("/admin-library.html", (_req, res) => {
  res.sendFile(path.join(HTML_DIR, "admin-library.html"));
});

app.get("/speaking.html", (_req, res) => {
  res.sendFile(path.join(HTML_DIR, "speaking.html"));
});

ensureRuntimeFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Johns server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to boot Johns server", error);
    process.exit(1);
  });
