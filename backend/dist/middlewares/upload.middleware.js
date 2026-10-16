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
        }
        else {
            callback(new Error("Only audio files are allowed"));
        }
    },
});
const attachmentDir = path.resolve("uploads/attachments");
fs.mkdirSync(attachmentDir, { recursive: true });
const attachmentStorage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, attachmentDir);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);
        callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    },
});
export const uploadAttachment = multer({
    storage: attachmentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "text/plain",
            "application/zip",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("File type not allowed"));
        }
    },
});
//# sourceMappingURL=upload.middleware.js.map