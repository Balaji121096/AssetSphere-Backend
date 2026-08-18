const vendorDocumentModel = require("../models/vendorDocumentModel");
const fs = require("fs");


// =====================================================
// UPLOAD VENDOR DOCUMENT
// =====================================================

const uploadVendorDocument = async (req, res) => {

    try {

        const vendorId = req.params.vendorId;


        // -------------------------------------------------
        // FILE CHECK
        // -------------------------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select a PDF or image file"
            });

        }


        // -------------------------------------------------
        // DOCUMENT TYPE
        // OPTIONAL
        // DEFAULT = General
        // -------------------------------------------------

        const documentType =
            req.body.document_type || "General";


        // -------------------------------------------------
        // DOCUMENT NAME
        // OPTIONAL
        // DEFAULT = ORIGINAL FILE NAME
        // -------------------------------------------------

        const documentName =
            req.body.document_name ||
            req.file.originalname;


        // -------------------------------------------------
        // DOCUMENT DATA
        // -------------------------------------------------

        const documentData = {

            vendor_id: vendorId,

            document_type: documentType,

            document_name: documentName,

            stored_file_name:
                req.file.filename,

            original_file_name:
                req.file.originalname,

            file_path:
                req.file.path,

            mime_type:
                req.file.mimetype,

            file_size:
                req.file.size

        };


        // -------------------------------------------------
        // SAVE DATABASE
        // -------------------------------------------------

        const result =
            await vendorDocumentModel.addVendorDocument(
                documentData
            );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Vendor document uploaded successfully",

            document_id:
                result.insertId,

            data: documentData

        });


    } catch (error) {

        console.error(
            "Upload Vendor Document Error:",
            error
        );


        // -------------------------------------------------
        // DELETE UPLOADED FILE IF DATABASE FAILED
        // -------------------------------------------------

        if (req.file) {

            try {

                if (
                    fs.existsSync(
                        req.file.path
                    )
                ) {

                    fs.unlinkSync(
                        req.file.path
                    );

                }

            } catch (fileError) {

                console.error(
                    "File cleanup error:",
                    fileError
                );

            }

        }


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// GET DOCUMENTS FOR VENDOR
// =====================================================

const getVendorDocuments = async (req, res) => {

    try {

        const vendorId =
            req.params.vendorId;


        const documents =
            await vendorDocumentModel.getVendorDocuments(
                vendorId
            );


        res.json({

            success: true,

            count:
                documents.length,

            data:
                documents

        });


    } catch (error) {

        console.error(
            "Get Vendor Documents Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// GET DOCUMENT BY ID
// =====================================================

const getVendorDocumentById = async (req, res) => {

    try {

        const documentId =
            req.params.documentId;


        const document =
            await vendorDocumentModel.getVendorDocumentById(
                documentId
            );


        if (!document) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found"

            });

        }


        res.json({

            success: true,

            data:
                document

        });


    } catch (error) {

        console.error(
            "Get Vendor Document Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// DOWNLOAD / VIEW DOCUMENT
// =====================================================

const downloadVendorDocument = async (req, res) => {

    try {

        const documentId =
            req.params.documentId;


        // -------------------------------------------------
        // GET DOCUMENT
        // -------------------------------------------------

        const document =
            await vendorDocumentModel.getVendorDocumentById(
                documentId
            );


        if (!document) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found"

            });

        }


        // -------------------------------------------------
        // FILE PATH
        // -------------------------------------------------

        const filePath =
            document.file_path;


        // -------------------------------------------------
        // CHECK FILE EXISTS
        // -------------------------------------------------

        if (
            !filePath ||
            !fs.existsSync(filePath)
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Document file not found"

            });

        }


        // -------------------------------------------------
        // SEND FILE
        // -------------------------------------------------

        res.setHeader(
            "Content-Type",
            document.mime_type
        );


        res.setHeader(
            "Content-Disposition",
            `inline; filename="${document.original_file_name}"`
        );


        res.sendFile(
            filePath
        );


    } catch (error) {

        console.error(
            "Download Vendor Document Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// DELETE VENDOR DOCUMENT
// =====================================================

const deleteVendorDocument = async (req, res) => {

    try {

        const documentId =
            req.params.documentId;


        // -------------------------------------------------
        // GET DOCUMENT FIRST
        // -------------------------------------------------

        const document =
            await vendorDocumentModel.getVendorDocumentById(
                documentId
            );


        if (!document) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found"

            });

        }


        // -------------------------------------------------
        // DELETE DATABASE RECORD
        // -------------------------------------------------

        const result =
            await vendorDocumentModel.deleteVendorDocument(
                documentId
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Document not found"

            });

        }


        // -------------------------------------------------
        // DELETE PHYSICAL FILE
        // -------------------------------------------------

        try {

            if (
                document.file_path &&
                fs.existsSync(
                    document.file_path
                )
            ) {

                fs.unlinkSync(
                    document.file_path
                );

            }

        } catch (fileError) {

            console.error(
                "Physical file delete error:",
                fileError
            );

        }


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.json({

            success: true,

            message:
                "Vendor document deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Vendor Document Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    uploadVendorDocument,

    getVendorDocuments,

    getVendorDocumentById,

    downloadVendorDocument,

    deleteVendorDocument

};