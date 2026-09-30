const db = require("../config/db");


// =====================================================
// GET COMPANY SETTINGS
// =====================================================

const getCompanySettings = async () => {

    const [rows] = await db.query(`
        SELECT
            company_id,
            company_name,
            company_code,
            address,
            city,
            state,
            country,
            pincode,
            phone,
            email,
            website,
            logo,
            gst_number,
            cin,
            pan,
            created_at,
            updated_at
        FROM company_settings
        ORDER BY company_id ASC
        LIMIT 1
    `);

    return rows.length > 0 ? rows[0] : null;
};


// =====================================================
// UPDATE COMPANY SETTINGS
// =====================================================

const updateCompanySettings = async (data) => {

    const {
        company_name,
        company_code,
        address,
        city,
        state,
        country,
        pincode,
        phone,
        email,
        website,
        logo,
        gst_number,
        cin,
        pan
    } = data;


    const existing =
        await getCompanySettings();


    if (!existing) {

        const [result] = await db.query(
            `
            INSERT INTO company_settings (
                company_name,
                company_code,
                address,
                city,
                state,
                country,
                pincode,
                phone,
                email,
                website,
                logo,
                gst_number,
                cin,
                pan
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                company_name,
                company_code,
                address,
                city,
                state,
                country,
                pincode,
                phone,
                email,
                website,
                logo,
                gst_number,
                cin,
                pan
            ]
        );


        return {
            company_id: result.insertId,
            ...data
        };

    }


    await db.query(
        `
        UPDATE company_settings
        SET
            company_name = ?,
            company_code = ?,
            address = ?,
            city = ?,
            state = ?,
            country = ?,
            pincode = ?,
            phone = ?,
            email = ?,
            website = ?,
            logo = ?,
            gst_number = ?,
            cin = ?,
            pan = ?
        WHERE company_id = ?
        `,
        [
            company_name,
            company_code,
            address,
            city,
            state,
            country,
            pincode,
            phone,
            email,
            website,
            logo,
            gst_number,
            cin,
            pan,
            existing.company_id
        ]
    );


    return await getCompanySettings();

};


module.exports = {
    getCompanySettings,
    updateCompanySettings
};