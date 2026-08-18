const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "vendor-documents"
);

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

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const baseName =
            path
                .basename(
                    file.originalname,
                    path.extname(file.originalname)
                )
                .replace(
                    /[^a-zA-Z0-9-_]/g,
                    "_"
                );

        const uniqueName =
            `${Date.now()}-${baseName}${extension}`;

        cb(
            null,
            uniqueName
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


    const extension =
        path
            .extname(
                file.originalname
            )
            .toLowerCase();


    const mimeType =
        (file.mimetype || "")
            .toLowerCase();


    // Accept if either MIME type OR extension is valid
    const isValidMimeType =
        allowedMimeTypes.includes(
            mimeType
        );


    const isValidExtension =
        allowedExtensions.includes(
            extension
        );


    if (
        isValidMimeType ||
        isValidExtension
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only PDF, JPG, JPEG and PNG files are allowed"
            )
        );

    }

};


// =====================================================
// MULTER
// =====================================================

const uploadVendorDocument =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                10 * 1024 * 1024

        }

    });


module.exports =
    uploadVendorDocument;