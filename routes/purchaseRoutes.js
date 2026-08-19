const express = require("express");

const router = express.Router();

const purchaseController =
    require("../controllers/purchaseController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");

const {
    uploadPurchaseDocument
} = require("../middleware/uploadMiddleware");


// =====================================================
// GET PURCHASE SUMMARY
// =====================================================

router.get(
    "/summary",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.getPurchaseSummary
);


// =====================================================
// UPLOAD / REPLACE PURCHASE DOCUMENT
// =====================================================

router.post(
    "/:id/document/:type",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    uploadPurchaseDocument.single("file"),

    purchaseController.uploadPurchaseDocument
);


// =====================================================
// VIEW / DOWNLOAD PURCHASE DOCUMENT
// =====================================================

router.get(
    "/:id/document/:type",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.getPurchaseDocument
);


// =====================================================
// DELETE PURCHASE DOCUMENT
// =====================================================

router.delete(
    "/:id/document/:type",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.deletePurchaseDocument
);


// =====================================================
// GET ALL PURCHASES
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.getPurchases
);


// =====================================================
// GET PURCHASE BY ID
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.getPurchaseById
);


// =====================================================
// ADD PURCHASE
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.addPurchase
);


// =====================================================
// UPDATE PURCHASE
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.updatePurchase
);


// =====================================================
// DELETE PURCHASE
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    purchaseController.deletePurchase
);


module.exports = router;