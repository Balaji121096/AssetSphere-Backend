const employeeModel = require("../models/employeeModel");


// ===============================
// GET ALL EMPLOYEES
// ===============================
const getAllEmployees = async (req, res) => {

    try {

        const employees =
            await employeeModel.getAllEmployees();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// ===============================
// GET EMPLOYEE BY ID
// ===============================
const getEmployeeById = async (req, res) => {

    try {

        const employee =
            await employeeModel.getEmployeeById(
                req.params.id
            );

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// ===============================
// ADD EMPLOYEE
// ===============================
const addEmployee = async (req, res) => {

    try {

        const result =
            await employeeModel.addEmployee(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employee_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to add employee"
        });

    }

};


// ===============================
// UPDATE EMPLOYEE
// ===============================
const updateEmployee = async (req, res) => {

    try {

        const result =
            await employeeModel.updateEmployee(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update employee"
        });

    }

};


// ===============================
// DELETE EMPLOYEE
// ===============================
const deleteEmployee = async (req, res) => {

    try {

        const result =
            await employeeModel.deleteEmployee(
                req.params.id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Employee cannot be deleted. It may be linked to other records."
        });

    }

};


// ===============================
// EXPORT
// ===============================
module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};