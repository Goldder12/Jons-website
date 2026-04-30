import fs from "fs";
import path from "path";
import { createWorker } from "tesseract.js";

function cleanupUploadedFile(filePath) {
  if (!filePath) {
    return;
  }

  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

function normalizeExtractedText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractTextFromImage(filePath) {
  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(filePath);
    return normalizeExtractedText(result?.data?.text || "");
  } finally {
    await worker.terminate();
  }
}

async function extractTextFromPdf(filePath) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const buffer = fs.readFileSync(filePath);
  const pdf = await getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    pages.push(pageText);
  }

  return normalizeExtractedText(pages.join("\n\n"));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseListeningText(rawText) {
  const lines = normalizeExtractedText(rawText).split("\n");
  let questionId = 1;
  const questions = [];

  const registerQuestion = () => {
    const id = questionId;
    questionId += 1;
    questions.push({ id });
    return `<input data-question="${id}" />`;
  };

  const htmlLines = lines.map((line) => {
    let output = escapeHtml(line);

    output = output.replace(/_{3,}/g, () => registerQuestion());
    output = output.replace(/\((\d{1,3})\)\s*_{0,}/g, (_match, numberText) => {
      const id = Number(numberText) || questionId;
      if (!questions.some((question) => question.id === id)) {
        questions.push({ id });
      }
      questionId = Math.max(questionId, id + 1);
      return `<input data-question="${id}" />`;
    });

    output = output.replace(/(^|\s)(\d{1,3})\.\s+/g, (match, prefix, numberText) => {
      const id = Number(numberText) || questionId;
      if (!questions.some((question) => question.id === id)) {
        questions.push({ id });
      }
      questionId = Math.max(questionId, id + 1);
      return `${prefix}<strong class="question-marker">${id}.</strong> `;
    });

    return output.trim() ? `<p>${output}</p>` : "";
  });

  const dedupedQuestions = questions
    .sort((a, b) => a.id - b.id)
    .filter((question, index, array) => index === 0 || array[index - 1].id !== question.id);

  if (!dedupedQuestions.length) {
    const fallbackInputs = Array.from({ length: 3 }, () => ({ id: questionId++ }));
    const fallbackHtml = `
      <div class="listening-generated-fallback">
        ${htmlLines.join("")}
        <p>Please add answer inputs manually if OCR missed the blank spaces.</p>
      </div>
    `;

    return {
      content: fallbackHtml,
      questions: fallbackInputs,
    };
  }

  return {
    content: htmlLines.join(""),
    questions: dedupedQuestions,
  };
}

export async function parseListening(req, res) {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ message: "Worksheet file is required." });
  }

  const storedPath = `uploads/tests/${uploadedFile.filename}`;

  try {
    const rawText = uploadedFile.mimetype === "application/pdf"
      ? await extractTextFromPdf(uploadedFile.path)
      : await extractTextFromImage(uploadedFile.path);

    if (!rawText) {
      cleanupUploadedFile(uploadedFile.path);
      return res.status(422).json({
        message: "No readable text was found in the uploaded worksheet.",
      });
    }

    const parsed = parseListeningText(rawText);
    cleanupUploadedFile(uploadedFile.path);

    return res.status(200).json({
      message: "Listening worksheet parsed successfully!",
      data: {
        rawText,
        content: parsed.content,
        questions: parsed.questions,
        file: storedPath,
      },
    });
  } catch (error) {
    cleanupUploadedFile(uploadedFile.path);

    return res.status(500).json({
      message: error.message || "Failed to parse listening worksheet.",
    });
  }
}
