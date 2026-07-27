const express = require("express");
const router = express.Router();

const designationController = require("../controllers/designationController");

router.get("/", designationController.getDesignations);

module.exports = router;