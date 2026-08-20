const express = require("express");

const router = express.Router();

const employeeController =
    require("../controllers/employeeController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// GET ALL
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.getAllEmployees
);


// GET ONE
router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.getEmployeeById
);


// ADD
router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.addEmployee
);


// UPDATE
router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.updateEmployee
);


// DELETE
router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "HR"),
    employeeController.deleteEmployee
);


module.exports = router;