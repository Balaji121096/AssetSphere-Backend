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
// Login pannina yaarum own profile paakalaam.
// Super Admin / Admin / Manager / Viewer -> allowed
// =====================================================

router.get(
    "/profile",
    verifyToken,
    userController.getProfile
);


// =====================================================
// MY PROFILE - UPDATE
// =====================================================
// User thannoda profile information update pannalaam.
// Role / Status / Employee ID inga change panna mudiyadhu.
// =====================================================

router.put(
    "/profile",
    verifyToken,
    userController.updateProfile
);


// =====================================================
// CHANGE MY PASSWORD
// =====================================================
// Login pannina user thannoda password change pannalaam.
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
//
// Super Admin -> allowed
// Admin       -> allowed
// Manager     -> denied
// Viewer      -> denied
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
// Admin + Super Admin
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
// Admin + Super Admin
//
// Admin       -> can create users
// Super Admin -> can create users
// Manager     -> denied
// Viewer      -> denied
//
// IMPORTANT:
// Admin Super Admin role create panna koodadhu.
// Adha controller-la next step-la protect pannuvom.
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
// Admin + Super Admin
//
// Normal users -> can update
// Super Admin user -> Admin modify panna koodadhu
//
// Idha controller-la next step-la protect pannuvom.
// =====================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.updateUser
);


// =====================================================
// DELETE USER
// =====================================================
// Admin + Super Admin
//
// Normal users -> can delete
// Super Admin user -> delete panna koodadhu
//
// Idha controller-la next step-la protect pannuvom.
// =====================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin"),
    userController.deleteUser
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;