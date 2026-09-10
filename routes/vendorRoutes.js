const express = require("express");

const router = express.Router();

const vendorController =
    require("../controllers/vendorController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET ALL VENDORS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    vendorController.getVendors
);


// =====================================================
// GET VENDOR BY ID
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    vendorController.getVendorById
);


// =====================================================
// ADD VENDOR
// MANAGER + ADMIN + IT
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    vendorController.addVendor
);


// =====================================================
// UPDATE VENDOR
// MANAGER + ADMIN + IT
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    vendorController.updateVendor
);


// =====================================================
// DELETE VENDOR
// MANAGER + ADMIN + IT
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    vendorController.deleteVendor
);


module.exports = router;