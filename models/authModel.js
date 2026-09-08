const db = require("../config/db");


// =====================================================
// LOGIN
// =====================================================

const login = async (username) => {

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


module.exports = {
    login
};