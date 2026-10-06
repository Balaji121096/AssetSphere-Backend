const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// MY PROFILE - GET
// ALL LOGGED-IN USERS
// =====================================================

router.get(
    "/profile",

    verifyToken,

    userController.getProfile
);


// =====================================================
// MY PROFILE - UPDATE
// ALL LOGGED-IN USERS
// =====================================================

router.put(
    "/profile",

    verifyToken,

    userController.updateProfile
);


// =====================================================
// CHANGE MY PASSWORD
// ALL LOGGED-IN USERS
// =====================================================

router.put(
    "/password",

    verifyToken,

    userController.changePassword
);


// =====================================================
// GET ALL USERS
// VIEWER + MANAGER + ADMIN
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    userController.getUsers
);


// =====================================================
// GET USER BY ID
// VIEWER + MANAGER + ADMIN
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    userController.getUserById
);


// =====================================================
// ADD USER
// MANAGER + ADMIN
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    userController.addUser
);


// =====================================================
// UPDATE USER
// MANAGER + ADMIN
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    userController.updateUser
);


// =====================================================
// RESET USER PASSWORD
// SUPER ADMIN ONLY
// =====================================================

router.put(
    "/:id/reset-password",

    verifyToken,

    authorizeRole("Super Admin"),

    userController.resetPassword
);


// =====================================================
// DELETE USER
// MANAGER + ADMIN
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin"
    ),

    userController.deleteUser
);


// =====================================================
// SYNC EMPLOYEES
// SUPER ADMIN ONLY
// =====================================================

router.post(
    "/sync-employees",

    verifyToken,

    authorizeRole("Super Admin"),

    userController.syncEmployeeUsers
);


module.exports = router;
