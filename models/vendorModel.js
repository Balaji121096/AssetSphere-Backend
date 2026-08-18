const db = require("../config/db");


// =====================================================
// GET ALL VENDORS
// =====================================================

const getAllVendors = async () => {

    const [rows] = await db.query(`

        SELECT

            vendor_id,

            vendor_code,

            vendor_name,

            contact_person,

            email,

            mobile,

            address,

            city,

            state,

            country,

            gst_number,

            status,

            created_at,

            updated_at

        FROM vendors

        ORDER BY vendor_name ASC

    `);


    return rows;

};


// =====================================================
// GET VENDOR BY ID
// =====================================================

const getVendorById = async (vendorId) => {

    const [rows] = await db.query(`

        SELECT

            vendor_id,

            vendor_code,

            vendor_name,

            contact_person,

            email,

            mobile,

            address,

            city,

            state,

            country,

            gst_number,

            status,

            created_at,

            updated_at

        FROM vendors

        WHERE vendor_id = ?

        LIMIT 1

    `, [

        vendorId

    ]);


    return rows[0] || null;

};


// =====================================================
// ADD VENDOR
// =====================================================

const addVendor = async (vendorData) => {

    const [

        result

    ] = await db.query(`

        INSERT INTO vendors

        (

            vendor_code,

            vendor_name,

            contact_person,

            email,

            mobile,

            address,

            city,

            state,

            country,

            gst_number,

            status

        )

        VALUES

        (

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            ?,

            ?

        )

    `, [

        vendorData.vendor_code,

        vendorData.vendor_name,

        vendorData.contact_person,

        vendorData.email,

        vendorData.mobile,

        vendorData.address,

        vendorData.city,

        vendorData.state,

        vendorData.country,

        vendorData.gst_number,

        vendorData.status

    ]);


    return result;

};


// =====================================================
// UPDATE VENDOR
// =====================================================

const updateVendor = async (

    vendorId,

    vendorData

) => {

    const [

        result

    ] = await db.query(`

        UPDATE vendors

        SET

            vendor_code = ?,

            vendor_name = ?,

            contact_person = ?,

            email = ?,

            mobile = ?,

            address = ?,

            city = ?,

            state = ?,

            country = ?,

            gst_number = ?,

            status = ?

        WHERE vendor_id = ?

    `, [

        vendorData.vendor_code,

        vendorData.vendor_name,

        vendorData.contact_person,

        vendorData.email,

        vendorData.mobile,

        vendorData.address,

        vendorData.city,

        vendorData.state,

        vendorData.country,

        vendorData.gst_number,

        vendorData.status,

        vendorId

    ]);


    return result;

};


// =====================================================
// DELETE VENDOR
// =====================================================

const deleteVendor = async (vendorId) => {

    const [

        result

    ] = await db.query(`

        DELETE FROM vendors

        WHERE vendor_id = ?

    `, [

        vendorId

    ]);


    return result;

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllVendors,

    getVendorById,

    addVendor,

    updateVendor,

    deleteVendor

};