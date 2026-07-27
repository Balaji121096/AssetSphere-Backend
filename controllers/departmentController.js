const departmentModel = require("../models/departmentModel");

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentModel.getAllDepartments();

        res.json({
            success: true,
            count: departments.length,
            data: departments
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
    getDepartments
};