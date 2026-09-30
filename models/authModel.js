const db = require("../config/db");


// =====================================================
// LOGIN
// =====================================================

const login = async (username) => {

    const [rows] = await db.query(
        `
        SELECT
            u.user_id,
            u.employee_id,
            u.username,
            u.password,
            u.role,
            u.status,
            u.must_change_password,
            e.status AS employee_status

        FROM users u

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        WHERE u.username = ?

        LIMIT 1
        `,
        [username]
    );

    return rows[0];

};


module.exports = {
    login
};