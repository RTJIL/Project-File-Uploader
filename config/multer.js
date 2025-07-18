import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // stays in RAM for direct upload
  limits: { fileSize: 6 * 1024 * 1024 },
});
