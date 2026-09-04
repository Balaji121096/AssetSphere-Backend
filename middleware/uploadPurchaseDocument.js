const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "purchases"
);


// =====================================================
// CREATE DIRECTORY IF NOT EXISTS
// =====================================================

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(
        uploadDir,
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
            uploadDir
        );

    },

    filename: (req, file, cb) => {

        const purchaseId =
            req.params.id;

        const documentType =
            req.params.type;

        const extension =
            path.extname(
                file.originalname
            );

        const timestamp =
            Date.now();

        const fileName =
            `${documentType}_${purchaseId}_${timestamp}${extension}`;

        cb(
            null,
            fileName
        );

    }

});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        "application/pdf",

        "image/jpeg",
        "image/png",
        "image/webp",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    ];


    if (
        allowedMimeTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only PDF, image, Word and Excel files are allowed"
            )
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