import fs from "fs";
import path from "path";
import multer from "multer";

const testsDirectory = path.resolve("uploads/tests");

if (!fs.existsSync(testsDirectory)) {
  fs.mkdirSync(testsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, testsDirectory);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeBaseName = path
      .basename(file.originalname || "worksheet", extension)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    callback(null, `${Date.now()}-${safeBaseName || "worksheet"}${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";

    if (!isImage && !isPdf) {
      callback(new Error("Only PDF, JPG, and PNG files are allowed."));
      return;
    }

    callback(null, true);
  },
});

export const uploadListeningSource = upload.single("testFile");
