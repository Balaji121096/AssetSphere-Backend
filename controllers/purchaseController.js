const fs = require("fs");
const path = require("path");

const purchaseModel =
    require("../models/purchaseModel");


// =====================================================
// GET ALL PURCHASES
// =====================================================

const getPurchases = async (req, res) => {

    try {

        const purchases =
            await purchaseModel.getAllPurchases();

        res.json({
            success: true,
            count: purchases.length,
            data: purchases
        });

    } catch (error) {

        console.error(
            "Get Purchases Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// GET PURCHASE BY ID
// =====================================================

const getPurchaseById = async (req, res) => {

    try {

        const purchases =
            await purchaseModel.getPurchaseById(
                req.params.id
            );

        if (purchases.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }

        res.json({
            success: true,
            data: purchases[0]
        });

    } catch (error) {

        console.error(
            "Get Purchase Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// ADD PURCHASE
// =====================================================

const addPurchase = async (req, res) => {

    try {

        const result =
            await purchaseModel.addPurchase(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Purchase added successfully",
            purchase_id: result.insertId
        });

    } catch (error) {

        console.error(
            "Add Purchase Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "PO Number already exists"
            });

        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// UPDATE PURCHASE
// =====================================================

const updatePurchase = async (req, res) => {

    try {

        const result =
            await purchaseModel.updatePurchase(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }

        res.json({
            success: true,
            message: "Purchase updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Purchase Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "PO Number already exists"
            });

        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// DELETE PURCHASE
// =====================================================

const deletePurchase = async (req, res) => {

    try {

        const purchaseId =
            req.params.id;


        // -------------------------------------------------
        // GET EXISTING DOCUMENTS FIRST
        // -------------------------------------------------

        const purchases =
            await purchaseModel.getPurchaseById(
                purchaseId
            );


        if (purchases.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        const purchase =
            purchases[0];


        // -------------------------------------------------
        // DELETE PURCHASE FROM DATABASE
        // -------------------------------------------------

        const result =
            await purchaseModel.deletePurchase(
                purchaseId
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        // -------------------------------------------------
        // DELETE PO FILE
        // -------------------------------------------------

        if (purchase.po_document) {

            deletePhysicalFile(
                purchase.po_document
            );

        }


        // -------------------------------------------------
        // DELETE INVOICE FILE
        // -------------------------------------------------

        if (purchase.invoice_document) {

            deletePhysicalFile(
                purchase.invoice_document
            );

        }


        res.json({
            success: true,
            message: "Purchase deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Purchase Error:",
            error
        );

        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Purchase cannot be deleted because it is referenced by another record"
            });

        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// PURCHASE SUMMARY
// =====================================================

const getPurchaseSummary = async (req, res) => {

    try {

        const summary =
            await purchaseModel.getPurchaseSummary();

        res.json({
            success: true,
            data: summary
        });

    } catch (error) {

        console.error(
            "Purchase Summary Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// UPLOAD / REPLACE PURCHASE DOCUMENT
// =====================================================

const uploadPurchaseDocument = async (
    req,
    res
) => {

    try {

        const purchaseId =
            req.params.id;

        const documentType =
            req.params.type;


        // -------------------------------------------------
        // VALIDATE DOCUMENT TYPE
        // -------------------------------------------------

        if (
            documentType !== "po" &&
            documentType !== "invoice"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid document type. Use po or invoice"
            });

        }


        // -------------------------------------------------
        // CHECK FILE
        // -------------------------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Please upload a document"
            });

        }


        // -------------------------------------------------
        // CHECK PURCHASE
        // -------------------------------------------------

        const purchases =
            await purchaseModel.getPurchaseById(
                purchaseId
            );


        if (purchases.length === 0) {

            // Uploaded file belongs to no purchase,
            // so remove it.
            deletePhysicalFile(
                req.file.path
            );

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        const purchase =
            purchases[0];


        // -------------------------------------------------
        // GET OLD DOCUMENT
        // -------------------------------------------------

        const oldDocuments =
            await purchaseModel.getPurchaseDocument(
                purchaseId,
                documentType
            );


        const oldDocument =
            oldDocuments.length > 0
                ? oldDocuments[0].document
                : null;


        // -------------------------------------------------
        // NEW FILE PATH
        // -------------------------------------------------

        const documentPath =
            req.file.path;


        // -------------------------------------------------
        // UPDATE DATABASE
        // -------------------------------------------------

        const result =
            await purchaseModel.updatePurchaseDocument(
                purchaseId,
                documentType,
                documentPath
            );


        if (result.affectedRows === 0) {

            // DB update failed.
            // Remove newly uploaded file.
            deletePhysicalFile(
                documentPath
            );

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        // -------------------------------------------------
        // DELETE OLD FILE
        // -------------------------------------------------

        if (
            oldDocument &&
            oldDocument !== documentPath
        ) {

            deletePhysicalFile(
                oldDocument
            );

        }


        res.json({

            success: true,

            message:
                documentType === "po"
                    ? "PO document uploaded successfully"
                    : "Invoice document uploaded successfully",

            document: documentPath

        });

    } catch (error) {

        console.error(
            "Upload Purchase Document Error:",
            error
        );


        // If something failed after multer uploaded
        // the new file, remove it.
        if (req.file?.path) {

            deletePhysicalFile(
                req.file.path
            );

        }


        res.status(500).json({
            success: false,
            message:
                "Failed to upload purchase document"
        });

    }

};


// =====================================================
// GET PURCHASE DOCUMENT
// =====================================================

const getPurchaseDocument = async (
    req,
    res
) => {

    try {

        const purchaseId =
            req.params.id;

        const documentType =
            req.params.type;


        // -------------------------------------------------
        // VALIDATE TYPE
        // -------------------------------------------------

        if (
            documentType !== "po" &&
            documentType !== "invoice"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid document type. Use po or invoice"
            });

        }


        // -------------------------------------------------
        // GET DOCUMENT
        // -------------------------------------------------

        const rows =
            await purchaseModel.getPurchaseDocument(
                purchaseId,
                documentType
            );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        const documentPath =
            rows[0].document;


        if (!documentPath) {

            return res.status(404).json({
                success: false,
                message:
                    documentType === "po"
                        ? "PO document not found"
                        : "Invoice document not found"
            });

        }


        // -------------------------------------------------
        // RESOLVE FILE PATH
        // -------------------------------------------------

        const filePath =
            path.isAbsolute(documentPath)
                ? documentPath
                : path.resolve(
                    process.cwd(),
                    documentPath
                );


        // -------------------------------------------------
        // CHECK FILE EXISTS
        // -------------------------------------------------

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({
                success: false,
                message:
                    "Document file not found on server"
            });

        }


        // -------------------------------------------------
        // SEND FILE
        // -------------------------------------------------

        res.sendFile(
            filePath
        );

    } catch (error) {

        console.error(
            "Get Purchase Document Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve document"
        });

    }

};


// =====================================================
// DELETE PURCHASE DOCUMENT
// =====================================================

const deletePurchaseDocument = async (
    req,
    res
) => {

    try {

        const purchaseId =
            req.params.id;

        const documentType =
            req.params.type;


        // -------------------------------------------------
        // VALIDATE TYPE
        // -------------------------------------------------

        if (
            documentType !== "po" &&
            documentType !== "invoice"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid document type. Use po or invoice"
            });

        }


        // -------------------------------------------------
        // GET CURRENT DOCUMENT
        // -------------------------------------------------

        const rows =
            await purchaseModel.getPurchaseDocument(
                purchaseId,
                documentType
            );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        const documentPath =
            rows[0].document;


        if (!documentPath) {

            return res.status(404).json({
                success: false,
                message:
                    "Document not found"
            });

        }


        // -------------------------------------------------
        // DELETE FROM DATABASE
        // -------------------------------------------------

        const result =
            await purchaseModel.deletePurchaseDocument(
                purchaseId,
                documentType
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }


        // -------------------------------------------------
        // DELETE PHYSICAL FILE
        // -------------------------------------------------

        deletePhysicalFile(
            documentPath
        );


        res.json({

            success: true,

            message:
                documentType === "po"
                    ? "PO document deleted successfully"
                    : "Invoice document deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Purchase Document Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete document"
        });

    }

};


// =====================================================
// DELETE PHYSICAL FILE
// =====================================================

const deletePhysicalFile = (
    filePath
) => {

    try {

        if (!filePath) {
            return;
        }


        const absolutePath =
            path.isAbsolute(filePath)
                ? filePath
                : path.resolve(
                    process.cwd(),
                    filePath
                );


        if (
            fs.existsSync(
                absolutePath
            )
        ) {

            fs.unlinkSync(
                absolutePath
            );

            console.log(
                "Deleted file:",
                absolutePath
            );

        }

    } catch (error) {

        console.error(
            "Physical File Delete Error:",
            error
        );

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getPurchases,

    getPurchaseById,

    addPurchase,

    updatePurchase,

    deletePurchase,

    getPurchaseSummary,

    uploadPurchaseDocument,

    getPurchaseDocument,

    deletePurchaseDocument

};