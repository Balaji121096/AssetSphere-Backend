const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads/purchases"
);


// =====================================================
// CREATE DIRECTORY
// =====================================================

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDirectory
        );

    },

    filename: (req, file, cb) => {

        const purchaseId =
            req.params.id;

        const timestamp =
            Date.now();

        const extension =
            path.extname(
                file.originalname
            );

        const fieldName =
            file.fieldname;

        cb(
            null,
            `${fieldName}_${purchaseId}_${timestamp}${extension}`
        );

    }

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {

    console.log("FILE INFO:", {
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".doc",
        ".docx"
    ];

    const extension =
        path.extname(file.originalname).toLowerCase();


    const allowedMimeTypes = [
        "application/pdf",

        "image/jpeg",
        "image/jpg",
        "image/png",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        // Some systems/Postman send documents as octet-stream
        "application/octet-stream"
    ];


    if (
        allowedExtensions.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype)
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF, JPG, JPEG, PNG and Word documents are allowed"
            ),
            false
        );

    }

};

// =====================================================
// MULTER
// =====================================================

const uploadPurchaseDocument =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                10 * 1024 * 1024

        }

    });


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    uploadPurchaseDocument
};