const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.get("/assets", verifyToken, authorizeRole("Admin","IT"), reportController.getAllAssets);

router.get("/assigned", verifyToken, authorizeRole("Admin","IT"), reportController.getAssignedAssets);

router.get("/scrap", verifyToken, authorizeRole("Admin","IT"), reportController.getScrapAssets);

router.get("/repair", verifyToken, authorizeRole("Admin","IT"), reportController.getRepairAssets);

router.get("/employee-assets", verifyToken, authorizeRole("Admin","IT"), reportController.getEmployeeAssets);

module.exports = router;