const db = require("../config/db");

const getAllDepartments = async () => {
    const [rows] = await db.query(`
        SELECT
            department_id,
            department_name,
            department_code,
            status
        FROM departments
        ORDER BY department_name ASC
    `);

    return rows;
};

module.exports = {
    getAllDepartments
};