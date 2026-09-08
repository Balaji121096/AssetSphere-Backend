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
// =====================================================

router.get(
    "/profile",
    verifyToken,
    userController.getProfile
);


// =====================================================
// MY PROFILE - UPDATE
// =====================================================

router.put(
    "/profile",
    verifyToken,
    userController.updateProfile
);


// =====================================================
// CHANGE MY PASSWORD
// =====================================================

router.put(
    "/password",
    verifyToken,
    userController.changePassword
);


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUsers
);


// =====================================================
// GET USER BY ID
// =====================================================

router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUserById
);


// =====================================================
// ADD USER
// =====================================================

router.post(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    userController.addUser
);


// =====================================================
// UPDATE USER
// =====================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
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
// =====================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.deleteUser
);


module.exports = router;