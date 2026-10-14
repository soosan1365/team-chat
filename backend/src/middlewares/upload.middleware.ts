import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDir = path.resolve("uploads/audio");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".webm";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("audio/")) {
      callback(null, true);
    } else {
      callback(new Error("Only audio files are allowed"));
    }
  },
});