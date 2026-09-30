const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads/ticket-attachments"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9-_]/g, "_");
        const fileName = `${Date.now()}-${name}${extension}`;
        cb(null, fileName);
    }
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".txt", ".doc", ".docx"];
    
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type for attachment"));
    }
};

const uploadTicketAttachment = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { uploadTicketAttachment };
