const express = require("express");

const router = express.Router();

const purchaseController =
    require("../controllers/purchaseController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET PURCHASE SUMMARY
// =====================================================

router.get(
    "/summary",
    verifyToken,
    authorizeRole("Admin", "IT"),
    purchaseController.getPurchaseSummary
);


// =====================================================
// GET ALL PURCHASES
// =====================================================

router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    purchaseController.getPurchases
);


// =====================================================
// GET PURCHASE BY ID
// =====================================================

router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    purchaseController.getPurchaseById
);


// =====================================================
// ADD PURCHASE
// =====================================================

router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    purchaseController.addPurchase
);


// =====================================================
// UPDATE PURCHASE
// =====================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    purchaseController.updatePurchase
);


// =====================================================
// DELETE PURCHASE
// =====================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    purchaseController.deletePurchase
);


module.exports = router;