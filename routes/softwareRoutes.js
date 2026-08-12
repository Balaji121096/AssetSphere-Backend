const express = require("express");

const router = express.Router();

const softwareController = require("../controllers/softwareController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");


// GET All Software
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    softwareController.getSoftware
);


// GET Software By ID
router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    softwareController.getSoftwareById
);


// ADD Software
router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    softwareController.addSoftware
);


// UPDATE Software
router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    softwareController.updateSoftware
);


// DELETE Software
router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    softwareController.deleteSoftware
);


module.exports = router;