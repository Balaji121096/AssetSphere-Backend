const express = require("express");

const router = express.Router();

const employeeController =
    require("../controllers/employeeController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET ALL EMPLOYEES
// VIEWER + MANAGER + ADMIN + HR
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    employeeController.getAllEmployees
);


// =====================================================
// GET ONE EMPLOYEE
// VIEWER + MANAGER + ADMIN + HR
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    employeeController.getEmployeeById
);


// =====================================================
// ADD EMPLOYEE
// MANAGER + ADMIN + HR
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    employeeController.addEmployee
);


// =====================================================
// UPDATE EMPLOYEE
// MANAGER + ADMIN + HR
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    employeeController.updateEmployee
);


// =====================================================
// DELETE EMPLOYEE
// MANAGER + ADMIN + HR
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    employeeController.deleteEmployee
);


module.exports = router;