const express = require("express");

const router = express.Router();

const vendorDocumentController =
    require("../controllers/vendorDocumentController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");

const uploadVendorDocument =
    require("../middleware/vendorDocumentUpload");


// =====================================================
// GET DOCUMENTS FOR VENDOR
// =====================================================

router.get(

    "/vendor/:vendorId",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    vendorDocumentController.getVendorDocuments

);


// =====================================================
// UPLOAD DOCUMENT
// =====================================================

router.post(

    "/vendor/:vendorId",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    uploadVendorDocument.single(
        "document"
    ),

    vendorDocumentController.uploadVendorDocument

);


// =====================================================
// DOWNLOAD / VIEW DOCUMENT
// =====================================================

router.get(

    "/:documentId/download",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    vendorDocumentController.downloadVendorDocument

);


// =====================================================
// DELETE DOCUMENT
// =====================================================

router.delete(

    "/:documentId",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    vendorDocumentController.deleteVendorDocument

);


module.exports = router;