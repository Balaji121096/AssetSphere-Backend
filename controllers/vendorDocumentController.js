const vendorDocumentModel = require("../models/vendorDocumentModel");
const fs = require("fs");
const path = require("path");

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
        // DOCUMENT TYPE & NAME
        // -------------------------------------------------
        const documentType = req.body.document_type || "General";
        const documentName = req.body.document_name || req.file.originalname;

        // -------------------------------------------------
        // GENERATE UNIQUE FILENAME & METADATA
        // -------------------------------------------------
        const extension = path.extname(req.file.originalname).toLowerCase();
        const baseName = path
            .basename(req.file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, "_");
        const storedFileName = `${Date.now()}-${baseName}${extension}`;
        const filePath = `/uploads/vendor-documents/${storedFileName}`;

        const documentData = {
            vendor_id: vendorId,
            purchase_id: req.body.purchase_id || null,
            document_type: documentType,
            document_name: documentName,
            stored_file_name: storedFileName,
            original_file_name: req.file.originalname,
            file_path: filePath,
            mime_type: req.file.mimetype,
            file_size: req.file.size,
            file_data: req.file.buffer // In-memory buffer for Aiven MySQL BLOB storage
        };

        // -------------------------------------------------
        // SAVE DATABASE
        // -------------------------------------------------
        const result = await vendorDocumentModel.addVendorDocument(documentData);

        // Return without raw binary buffer in response
        const { file_data, ...responseMetadata } = documentData;

        res.status(201).json({
            success: true,
            message: "Vendor document uploaded successfully",
            document_id: result.insertId,
            data: {
                ...responseMetadata,
                document_id: result.insertId
            }
        });
    } catch (error) {
        console.error("Upload Vendor Document Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// =====================================================
// GET DOCUMENTS FOR VENDOR
// =====================================================

const getVendorDocuments = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const documents = await vendorDocumentModel.getVendorDocuments(vendorId);

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error("Get Vendor Documents Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

const getVendorDocumentById = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const document = await vendorDocumentModel.getVendorDocumentById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // Strip file_data from json response
        const { file_data, ...safeDoc } = document;

        res.json({
            success: true,
            data: safeDoc
        });
    } catch (error) {
        console.error("Get Vendor Document Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// =====================================================
// DOWNLOAD / VIEW DOCUMENT
// =====================================================

const downloadVendorDocument = async (req, res) => {
    try {
        const documentId = req.params.documentId;

        // -------------------------------------------------
        // GET DOCUMENT
        // -------------------------------------------------
        const document = await vendorDocumentModel.getVendorDocumentById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // -------------------------------------------------
        // 1. SERVE FROM DATABASE BLOB (Vercel Serverless Compatible)
        // -------------------------------------------------
        if (document.file_data) {
            res.setHeader("Content-Type", document.mime_type || "application/octet-stream");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${document.original_file_name || document.stored_file_name}"`
            );
            return res.send(document.file_data);
        }

        // -------------------------------------------------
        // 2. FALLBACK TO LOCAL DISK FILE (For historical local files)
        // -------------------------------------------------
        const filePath = document.file_path;
        if (filePath && fs.existsSync(filePath)) {
            res.setHeader("Content-Type", document.mime_type || "application/octet-stream");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${document.original_file_name || document.stored_file_name}"`
            );
            return res.sendFile(filePath);
        }

        return res.status(404).json({
            success: false,
            message: "Document file not found"
        });
    } catch (error) {
        console.error("Download Vendor Document Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// =====================================================
// DELETE VENDOR DOCUMENT
// =====================================================

const deleteVendorDocument = async (req, res) => {
    try {
        const documentId = req.params.documentId;

        // -------------------------------------------------
        // GET DOCUMENT FIRST
        // -------------------------------------------------
        const document = await vendorDocumentModel.getVendorDocumentById(documentId);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // -------------------------------------------------
        // DELETE DATABASE RECORD
        // -------------------------------------------------
        const result = await vendorDocumentModel.deleteVendorDocument(documentId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // -------------------------------------------------
        // DELETE PHYSICAL FILE (SAFE FALLBACK)
        // -------------------------------------------------
        try {
            if (document.file_path && fs.existsSync(document.file_path)) {
                fs.unlinkSync(document.file_path);
            }
        } catch (fileError) {
            console.warn("Physical file delete skipped/warning:", fileError.message);
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------
        res.json({
            success: true,
            message: "Vendor document deleted successfully"
        });
    } catch (error) {
        console.error("Delete Vendor Document Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
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
