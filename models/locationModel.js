const db = require("../config/db");

const getAllLocations = async () => {
    const [rows] = await db.query(`
        SELECT
            location_id,
            location_code,
            location_name,
            city,
            state,
            country,
            status
        FROM office_locations
        ORDER BY location_name ASC
    `);

    return rows;
};

module.exports = {
    getAllLocations
};