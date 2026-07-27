const categoryModel = require("../models/categoryModel");

const getCategories = async (req, res) => {

    try {

        const categories = await categoryModel.getAllCategories();

        res.json({
            success: true,
            count: categories.length,
            data: categories
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
    getCategories
};