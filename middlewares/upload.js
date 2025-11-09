const multer = require("multer");

function fileFilter(req, file, cb) {
    // accept only images
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image uploads are allowed"));
    }
}

// Use in-memory storage; the controller will upload the buffer to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

module.exports = upload;
