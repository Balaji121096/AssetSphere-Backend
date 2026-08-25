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
// ADMIN ONLY
// =====================================================

router.get(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUsers
);


// =====================================================
// GET USER BY ID
// ADMIN ONLY
// =====================================================

router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.getUserById
);


// =====================================================
// ADD USER
// ADMIN ONLY
// =====================================================

router.post(
    "/",
    verifyToken,
    authorizeRole("Admin"),
    userController.addUser
);


// =====================================================
// UPDATE USER
// ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.updateUser
);


// =====================================================
// DELETE USER
// ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.deleteUser
);


module.exports = router;