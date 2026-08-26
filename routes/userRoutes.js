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
// Username மட்டும் user update பண்ணலாம்.
// Role / Status / Employee ID change இங்கே allowed இல்லை.

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
// Admin + Super Admin

router.get(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUsers
);


// =====================================================
// GET USER BY ID
// =====================================================
// Admin + Super Admin

router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUserById
);


// =====================================================
// ADD USER
// =====================================================
// ONLY Super Admin
// Account create + initial role assign

router.post(
    "/",
    verifyToken,
    authorizeRole("Super Admin"),
    userController.addUser
);


// =====================================================
// UPDATE USER
// =====================================================
// ONLY Super Admin
// Role / Status / Employee / Username change

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Super Admin"),
    userController.updateUser
);


// =====================================================
// DELETE USER
// =====================================================
// ONLY Super Admin

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Super Admin"),
    userController.deleteUser
);


module.exports = router;