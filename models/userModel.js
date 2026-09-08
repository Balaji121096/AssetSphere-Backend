const db = require("../config/db");
const bcrypt = require("bcryptjs");


// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async () => {

    const [rows] = await db.query(`
        SELECT
            u.user_id,
            u.employee_id,
            e.employee_code,
            e.first_name,
            e.last_name,
            e.official_email,
            u.username,
            u.role,
            u.status,
            u.must_change_password,
            u.created_at,
            u.updated_at

        FROM users u

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        ORDER BY u.user_id ASC
    `);

    return rows;
};


// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (userId) => {

    const [rows] = await db.query(
        `
        SELECT
            u.user_id,
            u.employee_id,
            e.employee_code,
            e.first_name,
            e.last_name,
            e.official_email,
            u.username,
            u.role,
            u.status,
            u.must_change_password,
            u.created_at,
            u.updated_at

        FROM users u

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        WHERE u.user_id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows;
};


// =====================================================
// GET USER BY USERNAME
// =====================================================

const getUserByUsername = async (username) => {

    const [rows] = await db.query(
        `
        SELECT
            user_id,
            employee_id,
            username,
            password,
            role,
            status,
            must_change_password

        FROM users

        WHERE username = ?

        LIMIT 1
        `,
        [username]
    );

    return rows[0];
};


// =====================================================
// ADD USER
// =====================================================

const addUser = async (user) => {

    const hashedPassword = await bcrypt.hash(
        user.password,
        10
    );

    const [result] = await db.query(
        `
        INSERT INTO users
        (
            employee_id,
            username,
            password,
            role,
            status,
            must_change_password
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            user.employee_id,
            user.username,
            hashedPassword,
            user.role || "Viewer",
            user.status || "Active",
            0
        ]
    );

    return result;
};


// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (userId, user) => {

    const [result] = await db.query(
        `
        UPDATE users
        SET
            employee_id = ?,
            username = ?,
            role = ?,
            status = ?

        WHERE user_id = ?
        `,
        [
            user.employee_id,
            user.username,
            user.role,
            user.status,
            userId
        ]
    );

    return result;
};


// =====================================================
// UPDATE MY PROFILE
// =====================================================

const updateProfile = async (
    userId,
    username
) => {

    const [result] = await db.query(
        `
        UPDATE users
        SET
            username = ?

        WHERE user_id = ?
        `,
        [
            username,
            userId
        ]
    );

    return result;
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (
    userId,
    newPassword
) => {

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    const [result] = await db.query(
        `
        UPDATE users
        SET
            password = ?,
            must_change_password = 0

        WHERE user_id = ?
        `,
        [
            hashedPassword,
            userId
        ]
    );

    return result;
};


// =====================================================
// GET PASSWORD BY USER ID
// =====================================================

const getUserPassword = async (userId) => {

    const [rows] = await db.query(
        `
        SELECT
            password

        FROM users

        WHERE user_id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows[0];
};


// =====================================================
// RESET USER PASSWORD
// =====================================================

const resetUserPassword = async (
    userId,
    temporaryPassword
) => {

    const hashedPassword = await bcrypt.hash(
        temporaryPassword,
        10
    );

    const [result] = await db.query(
        `
        UPDATE users
        SET
            password = ?,
            must_change_password = 1

        WHERE user_id = ?
        `,
        [
            hashedPassword,
            userId
        ]
    );

    return result;
};


// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (userId) => {

    const [result] = await db.query(
        `
        DELETE FROM users

        WHERE user_id = ?
        `,
        [userId]
    );

    return result;
};


// =====================================================
// GET LOGGED-IN USER PROFILE
// =====================================================

const getProfile = async (userId) => {

    const [rows] = await db.query(
        `
        SELECT
            u.user_id,
            u.employee_id,
            e.employee_code,
            e.display_name,
            e.first_name,
            e.last_name,
            e.official_email,
            e.reporting_manager_email,
            e.mobile_number,
            e.work_location,
            e.employment_type,
            e.joining_date,
            u.username,
            u.role,
            u.status,
            u.must_change_password,
            u.created_at,
            u.updated_at

        FROM users u

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        WHERE u.user_id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows[0];
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    updateProfile,
    changePassword,
    getUserPassword,
    resetUserPassword,
    deleteUser,
    getProfile

};