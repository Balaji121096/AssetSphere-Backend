const db = require("../config/db");

const getAllEmployees = async () => {
    const [rows] = await db.query(`
        SELECT
            e.employee_id,
            e.employee_code,
            e.display_name,
            e.official_email,
            e.mobile_number,
            d.department_name,
            ds.designation_name,
            e.work_location,
            e.employment_type,
            e.joining_date,
            e.status
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.department_id
        LEFT JOIN designations ds
            ON e.designation_id = ds.designation_id
        ORDER BY e.employee_id ASC
    `);

    return rows;
};

module.exports = {
    getAllEmployees
};