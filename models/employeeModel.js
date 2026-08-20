const db = require("../config/db");

// GET ALL EMPLOYEES
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
            e.status,
            e.department_id,
            e.designation_id
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.department_id
        LEFT JOIN designations ds
            ON e.designation_id = ds.designation_id
        ORDER BY e.employee_id ASC
    `);

    return rows;
};


// ADD EMPLOYEE
const addEmployee = async (employee) => {

    const [result] = await db.query(`
        INSERT INTO employees
        (
            employee_code,
            display_name,
            official_email,
            mobile_number,
            department_id,
            designation_id,
            work_location,
            employment_type,
            joining_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        employee.employee_code,
        employee.display_name,
        employee.official_email,
        employee.mobile_number || null,
        employee.department_id || null,
        employee.designation_id || null,
        employee.work_location || null,
        employee.employment_type || null,
        employee.joining_date || null,
        employee.status || "Active"
    ]);

    return result;
};


// GET EMPLOYEE BY ID
const getEmployeeById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            employee_id,
            employee_code,
            display_name,
            official_email,
            mobile_number,
            department_id,
            designation_id,
            work_location,
            employment_type,
            joining_date,
            status
        FROM employees
        WHERE employee_id = ?
    `, [id]);

    return rows[0];
};


// UPDATE EMPLOYEE
const updateEmployee = async (id, employee) => {

    const [result] = await db.query(`
        UPDATE employees
        SET
            employee_code = ?,
            display_name = ?,
            official_email = ?,
            mobile_number = ?,
            department_id = ?,
            designation_id = ?,
            work_location = ?,
            employment_type = ?,
            joining_date = ?,
            status = ?
        WHERE employee_id = ?
    `, [
        employee.employee_code,
        employee.display_name,
        employee.official_email,
        employee.mobile_number || null,
        employee.department_id || null,
        employee.designation_id || null,
        employee.work_location || null,
        employee.employment_type || null,
        employee.joining_date || null,
        employee.status || "Active",
        id
    ]);

    return result;
};


// DELETE EMPLOYEE
const deleteEmployee = async (id) => {

    const [result] = await db.query(`
        DELETE FROM employees
        WHERE employee_id = ?
    `, [id]);

    return result;
};


module.exports = {
    getAllEmployees,
    addEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};