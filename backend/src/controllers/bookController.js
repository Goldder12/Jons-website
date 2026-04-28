import fs from "fs";
import path from "path";
import { books } from "../data/db.js";

const DEFAULT_BOOK_IMAGE = "default-book.png";

function removeUploadedFile(filePath) {
  if (!filePath || filePath === DEFAULT_BOOK_IMAGE || !filePath.startsWith("uploads/")) {
    return;
  }

  const absolutePath = path.resolve(filePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

export function getBooks(req, res) {
  return res.status(200).json({
    message: "Books fetched successfully!",
    data: books,
  });
}

export function createBook(req, res) {
  const title = req.body.title?.trim();
  const author = req.body.author?.trim();
  const level = req.body.level?.trim();
  const pdfFile = req.files?.pdf?.[0];
  const imageFile = req.files?.image?.[0];

  if (!title || !author || !level || !pdfFile) {
    if (pdfFile) {
      removeUploadedFile(`uploads/books/${pdfFile.filename}`);
    }

    if (imageFile) {
      removeUploadedFile(`uploads/covers/${imageFile.filename}`);
    }

    return res.status(400).json({ message: "Title, author, level, and PDF file are required!" });
  }

  const newBook = {
    id: books.length ? Math.max(...books.map((book) => Number(book.id) || 0)) + 1 : 1,
    title,
    author,
    level,
    pdf: `uploads/books/${pdfFile.filename}`,
    image: imageFile ? `uploads/covers/${imageFile.filename}` : DEFAULT_BOOK_IMAGE,
  };

  books.push(newBook);

  return res.status(201).json({
    message: "Book created successfully!",
    data: newBook,
  });
}

export function updateBook(req, res) {
  const id = Number(req.params.id);
  const existingBook = books.find((book) => Number(book.id) === id);

  if (!existingBook) {
    const pdfFile = req.files?.pdf?.[0];
    const imageFile = req.files?.image?.[0];

    if (pdfFile) {
      removeUploadedFile(`uploads/books/${pdfFile.filename}`);
    }

    if (imageFile) {
      removeUploadedFile(`uploads/covers/${imageFile.filename}`);
    }

    return res.status(404).json({ message: "Book not found!" });
  }

  const title = req.body.title?.trim();
  const author = req.body.author?.trim();
  const level = req.body.level?.trim();
  const pdfFile = req.files?.pdf?.[0];
  const imageFile = req.files?.image?.[0];

  if (!title || !author || !level) {
    if (pdfFile) {
      removeUploadedFile(`uploads/books/${pdfFile.filename}`);
    }

    if (imageFile) {
      removeUploadedFile(`uploads/covers/${imageFile.filename}`);
    }

    return res.status(400).json({ message: "Title, author, and level are required!" });
  }

  if (pdfFile) {
    removeUploadedFile(existingBook.pdf);
    existingBook.pdf = `uploads/books/${pdfFile.filename}`;
  }

  if (imageFile) {
    removeUploadedFile(existingBook.image);
    existingBook.image = `uploads/covers/${imageFile.filename}`;
  } else if (!existingBook.image) {
    existingBook.image = DEFAULT_BOOK_IMAGE;
  }

  existingBook.title = title;
  existingBook.author = author;
  existingBook.level = level;

  return res.status(200).json({
    message: "Book updated successfully!",
    data: existingBook,
  });
}

export function deleteBook(req, res) {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex((book) => Number(book.id) === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found!" });
  }

  const [book] = books.splice(bookIndex, 1);
  removeUploadedFile(book.pdf);
  removeUploadedFile(book.image);

  return res.status(200).json({ message: "Book deleted successfully!" });
}
