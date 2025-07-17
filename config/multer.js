import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log("Uploading file: ", file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const limits = {
  fileSize: 4 * 1024 * 1024,
};

export const upload = multer({ storage, limits });
