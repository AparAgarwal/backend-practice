// Setting up file uploads via multer

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// using disk storage for storing the files on our server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // To make sure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${unique}${ext}`)
  }
})

const fileFilter = function (req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only JPEG, PNG and WEBP images are allowed"));
  }
  cb(null, true);
};

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
}).single('image');
