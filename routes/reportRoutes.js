const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/assets",  verifyToken, reportController.getAllAssets);

router.get("/assigned",  verifyToken, reportController.getAssignedAssets);

router.get("/scrap",  verifyToken, reportController.getScrapAssets);

router.get("/repair",  verifyToken, reportController.getRepairAssets);

router.get("/employee-assets",  verifyToken, reportController.getEmployeeAssets);

module.exports = router;