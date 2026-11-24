const multer = require("multer");
const path = require("path");

// =====================================================
// STORAGE - MEMORY STORAGE (Vercel Serverless Compatible)
// =====================================================
// Memory storage keeps file buffer in memory so Vercel's
// read-only filesystem is never touched.
const storage = multer.memoryStorage();

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
    // Allowed MIME types
    const allowedMimeTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    // Allowed file extensions
    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const mimeType = (file.mimetype || "").toLowerCase();

    // Accept if either MIME type OR extension is valid
    const isValidMimeType = allowedMimeTypes.includes(mimeType);
    const isValidExtension = allowedExtensions.includes(extension);

    if (isValidMimeType || isValidExtension) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed"));
    }
};

// =====================================================
// MULTER
// =====================================================

const uploadVendorDocument = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
});

module.exports = uploadVendorDocument;
