const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Add timestamp to file name to prevent name collisions
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1633029141234.jpg
  },
});

// File filter to allow only image files
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true); // File type is valid
    }
    cb(new Error('Only images are allowed!')); // Reject invalid file type
  },
});

module.exports = upload;
