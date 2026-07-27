const employeeModel = require('../models/employeeModel');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees();

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

module.exports = {
    getAllEmployees
};