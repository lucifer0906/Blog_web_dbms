const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
        cb(null, `${base}-${Date.now()}${ext}`);
    },
});

function fileFilter(req, file, cb) {
    // accept only images
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image uploads are allowed"));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

module.exports = upload;
