const express = require("express");

const router = express.Router();

const softwareController = require("../controllers/softwareController");

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");


// =========================================================
// GET ALL SOFTWARE
// =========================================================

router.get(
    "/",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    softwareController.getSoftware
);


// =========================================================
// GET SOFTWARE EXPIRY ALERTS
// =========================================================

router.get(
    "/expiry-alerts",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    softwareController.getExpiryAlerts
);


// =========================================================
// GET SOFTWARE SUMMARY (total qty, total cost, avg cost)
// Query params: ?month=MM&year=YYYY (both optional)
// =========================================================

router.get(
    "/summary",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    softwareController.getSoftwareSummary
);


// =========================================================
// GET SOFTWARE BY ID
// =========================================================

router.get(
    "/:id",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    softwareController.getSoftwareById
);


// =========================================================
// ADD SOFTWARE
// =========================================================

router.post(
    "/",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),
    softwareController.addSoftware
);


// =========================================================
// UPDATE SOFTWARE
// =========================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),
    softwareController.updateSoftware
);


// =========================================================
// DELETE SOFTWARE
// =========================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),
    softwareController.deleteSoftware
);


module.exports = router;