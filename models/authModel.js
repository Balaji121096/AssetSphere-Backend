const db = require("../config/db");

const login = async (username) => {

    const [rows] = await db.query(`
        SELECT
            user_id,
            employee_id,
            username,
            password,
            role,
            status
        FROM users
        WHERE username = ?
    `, [username]);

    return rows[0];

};

module.exports = {
    login
};