const db = require("../config/db");


// =====================================================
// GENERATE TICKET NUMBER
// =====================================================

const generateTicketNumber = async () => {

    const [rows] = await db.query(`
        SELECT ticket_number
        FROM tickets
        ORDER BY ticket_id DESC
        LIMIT 1
    `);

    let nextNumber = 1;

    if (rows.length > 0) {

        const lastNumber =
            parseInt(
                rows[0].ticket_number.replace("TKT-", ""),
                10
            );

        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    return `TKT-${String(nextNumber).padStart(6, "0")}`;
};


// =====================================================
// GET ALL TICKETS
// =====================================================

const getAllTickets = async () => {

    const [rows] = await db.query(`
        SELECT
            t.ticket_id,
            t.ticket_number,

            t.employee_id,

            e.employee_code,
            e.display_name,
            e.official_email,

            t.assigned_to,

            au.username AS assigned_username,

            t.category,
            t.subject,
            t.description,
            t.priority,
            t.status,

            t.created_at,
            t.updated_at

        FROM tickets t

        LEFT JOIN employees e
            ON t.employee_id = e.employee_id

        LEFT JOIN users au
            ON t.assigned_to = au.user_id

        ORDER BY t.ticket_id DESC
    `);

    return rows;
};


// =====================================================
// GET TICKET BY ID
// =====================================================

const getTicketById = async (ticketId) => {

    const [rows] = await db.query(
        `
        SELECT
            t.ticket_id,
            t.ticket_number,

            t.employee_id,

            e.employee_code,
            e.display_name,
            e.official_email,

            t.assigned_to,

            au.username AS assigned_username,

            t.category,
            t.subject,
            t.description,
            t.priority,
            t.status,

            t.created_at,
            t.updated_at

        FROM tickets t

        LEFT JOIN employees e
            ON t.employee_id = e.employee_id

        LEFT JOIN users au
            ON t.assigned_to = au.user_id

        WHERE t.ticket_id = ?

        LIMIT 1
        `,
        [ticketId]
    );

    return rows[0];
};


// =====================================================
// GET TICKETS BY EMPLOYEE
// =====================================================

const getTicketsByEmployee = async (employeeId) => {

    const [rows] = await db.query(
        `
        SELECT
            t.ticket_id,
            t.ticket_number,
            t.employee_id,

            e.employee_code,
            e.display_name,

            t.assigned_to,
            au.username AS assigned_username,

            t.category,
            t.subject,
            t.description,
            t.priority,
            t.status,

            t.created_at,
            t.updated_at

        FROM tickets t

        LEFT JOIN employees e
            ON t.employee_id = e.employee_id

        LEFT JOIN users au
            ON t.assigned_to = au.user_id

        WHERE t.employee_id = ?

        ORDER BY t.ticket_id DESC
        `,
        [employeeId]
    );

    return rows;
};


// =====================================================
// CREATE TICKET
// =====================================================

const createTicket = async (
    employeeId,
    ticket
) => {

    const ticketNumber =
        await generateTicketNumber();

    const [result] = await db.query(
        `
        INSERT INTO tickets
        (
            ticket_number,
            employee_id,
            category,
            subject,
            description,
            priority,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Open')
        `,
        [
            ticketNumber,
            employeeId,
            ticket.category || "Other",
            ticket.subject,
            ticket.description,
            ticket.priority || "Medium"
        ]
    );

    return {
        insertId: result.insertId,
        ticketNumber
    };
};


// =====================================================
// UPDATE TICKET
// =====================================================

const updateTicket = async (
    ticketId,
    ticket
) => {

    const [result] = await db.query(
        `
        UPDATE tickets

        SET
            category = ?,
            subject = ?,
            description = ?,
            priority = ?

        WHERE ticket_id = ?
        `,
        [
            ticket.category,
            ticket.subject,
            ticket.description,
            ticket.priority,
            ticketId
        ]
    );

    return result;
};


// =====================================================
// ASSIGN TICKET
// =====================================================

const assignTicket = async (
    ticketId,
    userId
) => {

    const [result] = await db.query(
        `
        UPDATE tickets

        SET
            assigned_to = ?,
            status = 'In Progress'

        WHERE ticket_id = ?
        `,
        [
            userId,
            ticketId
        ]
    );

    return result;
};


// =====================================================
// UPDATE STATUS
// =====================================================

const updateTicketStatus = async (
    ticketId,
    newStatus,
    changedBy
) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [ticketRows] = await connection.query(
            `
            SELECT status
            FROM tickets
            WHERE ticket_id = ?
            FOR UPDATE
            `,
            [ticketId]
        );

        if (ticketRows.length === 0) {

            await connection.rollback();

            return {
                affectedRows: 0
            };
        }

        const oldStatus =
            ticketRows[0].status;


        await connection.query(
            `
            UPDATE tickets

            SET status = ?

            WHERE ticket_id = ?
            `,
            [
                newStatus,
                ticketId
            ]
        );


        await connection.query(
            `
            INSERT INTO ticket_status_history
            (
                ticket_id,
                changed_by,
                old_status,
                new_status
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                ticketId,
                changedBy,
                oldStatus,
                newStatus
            ]
        );


        await connection.commit();

        return {
            affectedRows: 1,
            oldStatus,
            newStatus
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};


// =====================================================
// DELETE TICKET
// =====================================================

const deleteTicket = async (
    ticketId
) => {

    const [result] = await db.query(
        `
        DELETE FROM tickets

        WHERE ticket_id = ?
        `,
        [ticketId]
    );

    return result;
};


// =====================================================
// ADD COMMENT
// =====================================================

const addComment = async (
    ticketId,
    userId,
    comment
) => {

    const [result] = await db.query(
        `
        INSERT INTO ticket_comments
        (
            ticket_id,
            user_id,
            comment
        )
        VALUES (?, ?, ?)
        `,
        [
            ticketId,
            userId,
            comment
        ]
    );

    return result;
};


// =====================================================
// GET COMMENTS
// =====================================================

const getComments = async (
    ticketId
) => {

    const [rows] = await db.query(
        `
        SELECT

            c.comment_id,
            c.ticket_id,

            c.user_id,

            u.username,
            u.role,

            e.display_name,

            c.comment,
            c.created_at

        FROM ticket_comments c

        LEFT JOIN users u
            ON c.user_id = u.user_id

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        WHERE c.ticket_id = ?

        ORDER BY c.comment_id ASC
        `,
        [ticketId]
    );

    return rows;
};


// =====================================================
// GET STATUS HISTORY
// =====================================================

const getStatusHistory = async (
    ticketId
) => {

    const [rows] = await db.query(
        `
        SELECT

            h.history_id,
            h.ticket_id,

            h.changed_by,

            u.username,

            e.display_name,

            h.old_status,
            h.new_status,

            h.created_at

        FROM ticket_status_history h

        LEFT JOIN users u
            ON h.changed_by = u.user_id

        LEFT JOIN employees e
            ON u.employee_id = e.employee_id

        WHERE h.ticket_id = ?

        ORDER BY h.history_id ASC
        `,
        [ticketId]
    );

    return rows;
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllTickets,
    getTicketById,
    getTicketsByEmployee,

    createTicket,
    updateTicket,

    assignTicket,
    updateTicketStatus,

    deleteTicket,

    addComment,
    getComments,

    getStatusHistory
};
