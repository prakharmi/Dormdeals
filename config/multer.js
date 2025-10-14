const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Define the allowed file extensions
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  // Check if the file's mimetype and originalname match the allowed types
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimetype && extname) {
    // If the file type is valid, allow the upload
    return cb(null, true);
  }
  // If the file type is invalid, reject the file
  cb(new Error("File type not supported. Please upload an image."), false);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
