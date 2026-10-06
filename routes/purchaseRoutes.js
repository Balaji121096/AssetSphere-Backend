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
} = require("../middleware/uploadPurchaseDocument");


// =====================================================
// GET PURCHASE SUMMARY
// VIEWER + MANAGER + ADMIN + IT
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
// MANAGER + ADMIN + IT
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
// VIEWER + MANAGER + ADMIN + IT
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
// MANAGER + ADMIN + IT
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
// VIEWER + MANAGER + ADMIN + IT
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
// VIEWER + MANAGER + ADMIN + IT
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
// MANAGER + ADMIN + IT
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
// MANAGER + ADMIN + IT
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
// MANAGER + ADMIN + IT
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "IT"
    ),

    purchaseController.deletePurchase
);


module.exports = router;
