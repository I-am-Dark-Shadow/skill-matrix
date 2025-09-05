import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Multer instance with storage and file size limit (e.g., 5MB)
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});