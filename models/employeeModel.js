const db = require('../config/db');

const getAllEmployees = async () => {
    const [rows] = await db.query(`
        SELECT
            employee_id,
            employee_code,
            display_name,
            official_email,
            department_id,
            designation_id,
            status
        FROM employees
        ORDER BY display_name ASC
    `);

    return rows;
};

module.exports = {
    getAllEmployees
};