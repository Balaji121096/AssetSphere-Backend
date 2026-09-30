const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

        const employeeId = result.insertId;

        // Auto-create user account if Active
        const status = req.body.status || "Active";
        if (status === "Active") {
            const username = req.body.official_email;
            if (username) {
                // Generate a random password
                const tempPassword = crypto.randomBytes(6).toString("base64url");
                const hashedPassword = await bcrypt.hash(tempPassword, 10);
                
                try {
                    await employeeModel.createEmployeeUser(employeeId, username, hashedPassword);
                    console.log(`Auto-created user for employee ${employeeId}. Username: ${username}, Temp Password: ${tempPassword}`);
                } catch (userError) {
                    console.error("Failed to auto-create user:", userError);
                    // We don't fail the employee creation if user creation fails
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employee_id: employeeId
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

        const employeeId = req.params.id;
        const result =
            await employeeModel.updateEmployee(
                employeeId,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        // Sync user status
        const status = req.body.status || "Active";
        try {
            await employeeModel.syncEmployeeUserStatus(employeeId, status);
        } catch (syncError) {
            console.error("Failed to sync user status:", syncError);
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