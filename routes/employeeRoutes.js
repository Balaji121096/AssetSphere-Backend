const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// GET All Employees
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.getAllEmployees
);

module.exports = router;