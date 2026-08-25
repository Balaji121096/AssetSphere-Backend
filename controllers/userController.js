const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");


// =====================================================
// GET ALL USERS
// =====================================================

const getUsers = async (req, res) => {

    try {

        const users = await userModel.getAllUsers();

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

        res.json({
            success: true,
            data: users[0]
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
            employee_id,
            username,
            password,
            role,
            status
        } = req.body;

        if (
            !employee_id ||
            !username ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Employee, username and password are required"
            });
        }

        const result = await userModel.addUser({
            employee_id,
            username,
            password,
            role,
            status
        });

        res.status(201).json({

            success: true,

            message:
                "User added successfully",

            user_id:
                result.insertId

        });

    } catch (error) {

        console.error("Add User Error:", error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// UPDATE USER - ADMIN
// =====================================================

const updateUser = async (req, res) => {

    try {

        const result =
            await userModel.updateUser(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {

        console.error(
            "Update User Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        if (
            error.code === "WARN_DATA_TRUNCATED" ||
            error.code === "ER_DATA_TOO_LONG"
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid role value"
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

    console.log("=================================");
    console.log("PROFILE UPDATE REQUEST");
    console.log("PROFILE BODY:", req.body);
    console.log("PROFILE USER:", req.user);
    console.log("=================================");

    try {

        // ---------------------------------------------
        // CHECK AUTHENTICATION
        // ---------------------------------------------

        if (!req.user || !req.user.user_id) {

            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const userId = req.user.user_id;


        // ---------------------------------------------
        // GET REQUEST BODY
        // ---------------------------------------------

        const {
            username,
            role
        } = req.body;


        // ---------------------------------------------
        // USERNAME VALIDATION
        // ---------------------------------------------

        if (
            !username ||
            typeof username !== "string" ||
            !username.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        const cleanUsername =
            username.trim();


        // ---------------------------------------------
        // GET CURRENT PROFILE
        // ---------------------------------------------

        const currentProfile =
            await userModel.getProfile(userId);


        if (!currentProfile) {

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }


        // ---------------------------------------------
        // ROLE
        // ---------------------------------------------

        let cleanRole = role;


        // Frontend role send pannalana
        // existing role-a use pannuvom

        if (
            !cleanRole ||
            typeof cleanRole !== "string"
        ) {

            cleanRole =
                currentProfile.role;
        }


        cleanRole = cleanRole.trim();


        // ---------------------------------------------
        // ALLOWED ROLES
        // ---------------------------------------------

        const allowedRoles = [
            "Super Admin",
            "Admin",
            "Manager",
            "Viewer"
        ];


        if (
            !allowedRoles.includes(cleanRole)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid role value"
            });
        }


        // ---------------------------------------------
        // UPDATE DATABASE
        // ---------------------------------------------

        const result =
            await userModel.updateProfile(
                userId,
                cleanUsername,
                cleanRole
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }


        // ---------------------------------------------
        // GET UPDATED PROFILE
        // ---------------------------------------------

        const updatedProfile =
            await userModel.getProfile(userId);


        // ---------------------------------------------
        // SUCCESS RESPONSE
        // ---------------------------------------------

        return res.json({

            success: true,

            message:
                "Profile updated successfully",

            data:
                updatedProfile

        });

    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "UPDATE PROFILE ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Code:",
            error.code
        );

        console.error(
            "SQL:",
            error.sql
        );

        console.error(
            "SQL Message:",
            error.sqlMessage
        );

        console.error(
            "================================="
        );


        // ---------------------------------------------
        // DUPLICATE USERNAME
        // ---------------------------------------------

        if (
            error.code === "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Username already exists"
            });
        }


        // ---------------------------------------------
        // INVALID ROLE
        // ---------------------------------------------

        if (
            error.code === "WARN_DATA_TRUNCATED" ||
            error.code === "ER_DATA_TOO_LONG"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid role value. Check users.role column."
            });
        }


        // ---------------------------------------------
        // INTERNAL SERVER ERROR
        // ---------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {

    try {

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
                message: "User not found"
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
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {

    try {

        const result =
            await userModel.deleteUser(
                req.params.id
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
                "User deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete User Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
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
    deleteUser,
    getProfile

};