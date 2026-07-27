const locationModel = require("../models/locationModel");

const getLocations = async (req, res) => {

    try {

        const locations = await locationModel.getAllLocations();

        res.json({
            success: true,
            count: locations.length,
            data: locations
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
    getLocations
};