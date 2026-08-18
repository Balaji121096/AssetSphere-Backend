const db = require("../config/db");


// =====================================================
// ADD VENDOR DOCUMENT
// =====================================================

const addVendorDocument = async (documentData) => {

    const {

        vendor_id,

        document_type,

        document_name,

        stored_file_name,

        original_file_name,

        file_path,

        mime_type,

        file_size

    } = documentData;


    const [result] = await db.query(

        `
        INSERT INTO vendor_documents
        (
            vendor_id,
            document_type,
            document_name,
            stored_file_name,
            original_file_name,
            file_path,
            mime_type,
            file_size
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [

            vendor_id,

            document_type,

            document_name,

            stored_file_name,

            original_file_name,

            file_path,

            mime_type,

            file_size

        ]

    );


    return result;

};


// =====================================================
// GET ALL DOCUMENTS FOR VENDOR
// =====================================================

const getVendorDocuments = async (vendorId) => {

    const [rows] = await db.query(

        `
        SELECT

            document_id,

            vendor_id,

            document_type,

            document_name,

            stored_file_name,

            original_file_name,

            file_path,

            mime_type,

            file_size,

            uploaded_at,

            updated_at

        FROM vendor_documents

        WHERE vendor_id = ?

        ORDER BY uploaded_at DESC
        `,

        [vendorId]

    );


    return rows;

};


// =====================================================
// GET DOCUMENT BY ID
// =====================================================

const getVendorDocumentById = async (documentId) => {

    const [rows] = await db.query(

        `
        SELECT

            document_id,

            vendor_id,

            document_type,

            document_name,

            stored_file_name,

            original_file_name,

            file_path,

            mime_type,

            file_size,

            uploaded_at,

            updated_at

        FROM vendor_documents

        WHERE document_id = ?

        LIMIT 1
        `,

        [documentId]

    );


    return rows.length > 0
        ? rows[0]
        : null;

};


// =====================================================
// DELETE DOCUMENT
// =====================================================

const deleteVendorDocument = async (documentId) => {

    const [result] = await db.query(

        `
        DELETE FROM vendor_documents

        WHERE document_id = ?
        `,

        [documentId]

    );


    return result;

};


module.exports = {

    addVendorDocument,

    getVendorDocuments,

    getVendorDocumentById,

    deleteVendorDocument

};