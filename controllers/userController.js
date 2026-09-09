const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// =====================================================
// GET ALL USERS
// =====================================================

const getUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        // Admin-ku Super Admin accounts show panna koodadhu
        if (req.user.role === "Admin") {
            const filteredUsers = users.filter(
                user => user.role !== "Super Admin"
            );

            return res.json({
                success: true,
                count: filteredUsers.length,
                data: filteredUsers
            });
        }

        // Super Admin - everything view pannalam
        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {
    try {
        const users = await userModel.getUserById(
            req.params.id
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const targetUser = users[0];

        // Admin Super Admin details access panna koodadhu
        if (
            req.user.role === "Admin" &&
            targetUser.role === "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin cannot access Super Admin account"
            });
        }

        res.json({
            success: true,
            data: targetUser
        });

    } catch (error) {
        console.error("Get User Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// ADD USER
// =====================================================

const addUser = async (req, res) => {
    try {
        const {
            employee_code,
            username,
            password,
            role,
            status
        } = req.body;

        // =================================================
        // REQUIRED FIELD VALIDATION
        // =================================================

        if (
            !employee_code ||
            !username ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee Code, username and password are required"
            });
        }

        const cleanEmployeeCode =
            String(employee_code).trim();

        const cleanUsername =
            String(username).trim();

        if (!cleanEmployeeCode) {
            return res.status(400).json({
                success: false,
                message: "Employee Code is required"
            });
        }

        if (!cleanUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        // =================================================
        // DEFAULT ROLE
        // =================================================

        const newRole = role || "Viewer";

        // =================================================
        // ALLOWED ROLES
        // =================================================

        const allowedRoles = [
            "Super Admin",
            "Admin",
            "Manager",
            "Viewer"
        ];

        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role value"
            });
        }

        // =================================================
        // ADMIN RESTRICTIONS
        // =================================================

        // Admin Super Admin account create panna koodadhu
        if (
            req.user.role === "Admin" &&
            newRole === "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin cannot create Super Admin"
            });
        }

        // =================================================
        // ADD USER
        // =================================================

        const result = await userModel.addUser({
            employee_code: cleanEmployeeCode,
            username: cleanUsername,
            password,
            role: newRole,
            status: status || "Active"
        });

        res.status(201).json({
            success: true,
            message: "User added successfully",
            user_id: result.insertId
        });

    } catch (error) {
        console.error("Add User Error:", error);

        // =================================================
        // EMPLOYEE NOT FOUND
        // =================================================

        if (
            error.message ===
            "Employee not found for the provided Employee Code"
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee Code not found in Employee Master"
            });
        }

        // =================================================
        // EMPLOYEE ALREADY HAS ACCOUNT
        // =================================================

        if (
            error.message ===
            "User account already exists for this employee"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A user account already exists for this Employee Code"
            });
        }

        // =================================================
        // DUPLICATE USERNAME
        // =================================================

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // =================================================
        // INVALID ENUM / DATA
        // =================================================

        if (
            error.code === "WARN_DATA_TRUNCATED" ||
            error.code === "ER_DATA_TOO_LONG"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid role or status value"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// UPDATE USER - ADMIN / SUPER ADMIN
// =====================================================

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // =================================================
        // GET TARGET USER
        // =================================================

        const users =
            await userModel.getUserById(userId);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const targetUser = users[0];

        // =================================================
        // ADMIN RESTRICTION
        // =================================================

        // Admin Super Admin account update panna koodadhu
        if (
            req.user.role === "Admin" &&
            targetUser.role === "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Admin cannot update Super Admin account"
            });
        }

        // =================================================
        // REQUEST DATA
        // =================================================

        const {
            employee_code,
            username,
            role,
            status
        } = req.body;

        // =================================================
        // EMPLOYEE CODE
        // =================================================

        const cleanEmployeeCode =
            employee_code
                ? String(employee_code).trim()
                : targetUser.employee_code;

        if (!cleanEmployeeCode) {
            return res.status(400).json({
                success: false,
                message: "Employee Code is required"
            });
        }

        // =================================================
        // USERNAME
        // =================================================

        const cleanUsername =
            username
                ? String(username).trim()
                : targetUser.username;

        if (!cleanUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        // =================================================
        // ROLE VALIDATION
        // =================================================

        const allowedRoles = [
            "Super Admin",
            "Admin",
            "Manager",
            "Viewer"
        ];

        const newRole =
            role || targetUser.role;

        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role value"
            });
        }

        // =================================================
        // ADMIN CANNOT ASSIGN SUPER ADMIN
        // =================================================

        if (
            req.user.role === "Admin" &&
            newRole === "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Admin cannot assign Super Admin role"
            });
        }

        // =================================================
        // SUPER ADMIN PROTECTION
        // =================================================

        // Existing Super Admin role remove panna koodadhu
        if (
            targetUser.role === "Super Admin" &&
            newRole !== "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Super Admin role cannot be removed"
            });
        }

        // =================================================
        // UPDATE USER
        // =================================================

        const result =
            await userModel.updateUser(
                userId,
                {
                    employee_code:
                        cleanEmployeeCode,

                    username:
                        cleanUsername,

                    role:
                        newRole,

                    status:
                        status || targetUser.status
                }
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message:
                "User updated successfully"
        });

    } catch (error) {
        console.error(
            "Update User Error:",
            error
        );

        // =================================================
        // EMPLOYEE NOT FOUND
        // =================================================

        if (
            error.message ===
            "Employee not found for the provided Employee Code"
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee Code not found in Employee Master"
            });
        }

        // =================================================
        // EMPLOYEE ALREADY ASSIGNED
        // =================================================

        if (
            error.message ===
            "Another user account already exists for this employee"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Another user account already exists for this Employee Code"
            });
        }

        // =================================================
        // DUPLICATE USERNAME
        // =================================================

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // =================================================
        // INVALID ENUM / DATA
        // =================================================

        if (
            error.code === "WARN_DATA_TRUNCATED" ||
            error.code === "ER_DATA_TOO_LONG"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid role or status value"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// UPDATE MY PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({
                success: false,
                message:
                    "User authentication required"
            });
        }

        const userId =
            req.user.user_id;

        const {
            username
        } = req.body;

        // =================================================
        // USERNAME VALIDATION
        // =================================================

        if (
            !username ||
            typeof username !== "string" ||
            !username.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Username is required"
            });
        }

        const cleanUsername =
            username.trim();

        // =================================================
        // GET CURRENT PROFILE
        // =================================================

        const currentProfile =
            await userModel.getProfile(userId);

        if (!currentProfile) {
            return res.status(404).json({
                success: false,
                message:
                    "Profile not found"
            });
        }

        // =================================================
        // USER OWN PROFILE
        // =================================================

        const result =
            await userModel.updateProfile(
                userId,
                cleanUsername,
                currentProfile.role
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Profile not found"
            });
        }

        // =================================================
        // GET UPDATED PROFILE
        // =================================================

        const updatedProfile =
            await userModel.getProfile(userId);

        res.json({
            success: true,
            message:
                "Profile updated successfully",
            data:
                updatedProfile
        });

    } catch (error) {
        console.error(
            "Update Profile Error:",
            error
        );

        if (
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Username already exists"
            });
        }

        if (
            error.code === "WARN_DATA_TRUNCATED" ||
            error.code === "ER_DATA_TOO_LONG"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid role value"
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({
                success: false,
                message:
                    "User authentication required"
            });
        }

        const userId =
            req.user.user_id;

        const {
            current_password,
            new_password
        } = req.body;

        if (
            !current_password ||
            !new_password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required"
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters"
            });
        }

        const user =
            await userModel.getUserPassword(
                userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                current_password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect"
            });
        }

        await userModel.changePassword(
            userId,
            new_password
        );

        res.json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


// =====================================================
// RESET USER PASSWORD - SUPER ADMIN ONLY
// =====================================================

const resetPassword = async (req, res) => {
    try {
        // =================================================
        // AUTHENTICATION CHECK
        // =================================================

        if (!req.user || !req.user.user_id) {
            return res.status(401).json({
                success: false,
                message:
                    "User authentication required"
            });
        }

        // =================================================
        // SUPER ADMIN ONLY
        // =================================================

        if (req.user.role !== "Super Admin") {
            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can reset passwords"
            });
        }

        const targetUserId =
            req.params.id;

        // =================================================
        // TARGET USER CHECK
        // =================================================

        const users =
            await userModel.getUserById(
                targetUserId
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const targetUser = users[0];

        // =================================================
        // GENERATE TEMPORARY PASSWORD
        // =================================================

        const temporaryPassword =
            crypto
                .randomBytes(6)
                .toString("base64url");

        // =================================================
        // RESET PASSWORD
        // must_change_password = 1
        // =================================================

        await userModel.resetUserPassword(
            targetUserId,
            temporaryPassword
        );

        // =================================================
        // RESPONSE
        // =================================================

        res.json({
            success: true,
            message:
                `Password reset successfully for ${targetUser.username}`,
            temporary_password:
                temporaryPassword,
            must_change_password:
                true
        });

    } catch (error) {
        console.error(
            "Reset Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
    try {
        const userId =
            req.params.id;

        // =================================================
        // GET TARGET USER
        // =================================================

        const users =
            await userModel.getUserById(
                userId
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const targetUser =
            users[0];

        // =================================================
        // SUPER ADMIN PROTECTION
        // =================================================

        if (
            targetUser.role === "Super Admin"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Super Admin account cannot be deleted"
            });
        }

        // =================================================
        // DELETE
        // =================================================

        const result =
            await userModel.deleteUser(
                userId
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        res.json({
            success: true,
            message:
                "User deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete User Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


// =====================================================
// GET MY PROFILE
// =====================================================

const getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({
                success: false,
                message:
                    "User authentication required"
            });
        }

        const profile =
            await userModel.getProfile(
                req.user.user_id
            );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Profile not found"
            });
        }

        res.json({
            success: true,
            data:
                profile
        });

    } catch (error) {
        console.error(
            "Get Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    updateProfile,
    changePassword,
    resetPassword,
    deleteUser,
    getProfile
};