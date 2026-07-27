const vendorModel = require("../models/vendorModel");

const getVendors = async (req, res) => {

    try {

        const vendors = await vendorModel.getAllVendors();

        res.json({
            success: true,
            count: vendors.length,
            data: vendors
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
    getVendors
};