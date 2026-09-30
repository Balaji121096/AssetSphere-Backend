
const db = require("../config/db");

const createTicket = async (ticketData) => {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM tickets");
    const count = rows[0].count + 1;
    const ticketNumber = "TKT-" + count.toString().padStart(4, "0");

    const query = `
        INSERT INTO tickets
        (ticket_number, employee_id, asset_id, category, subject, description, priority, status, attachment_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Open', ?)
    `;

    const [result] = await db.query(query, [
        ticketNumber,
        ticketData.employee_id,
        ticketData.asset_id || null,
        ticketData.category || "IT",
        ticketData.subject,
        ticketData.description,
        ticketData.priority || "Medium",
        ticketData.attachment_path || null
    ]);

    // Initial history
    await db.query(
        "INSERT INTO ticket_status_history (ticket_id, changed_by, old_status, new_status) VALUES (?, ?, NULL, 'Open')",
        [result.insertId, ticketData.user_id]
    );

    return { ticket_id: result.insertId, ticket_number: ticketNumber };
};

const getTicketsByEmployee = async (employee_id) => {
    const query = `
        SELECT t.*, a.asset_name, a.asset_code 
        FROM tickets t
        LEFT JOIN hardware_assets a ON t.asset_id = a.asset_id
        WHERE t.employee_id = ?
        ORDER BY t.created_at DESC
    `;
    const [rows] = await db.query(query, [employee_id]);
    return rows;
};

const getAllTickets = async () => {
    const query = `
        SELECT t.*, e.display_name AS employee_name, e.employee_code, a.asset_name, a.asset_code, a1.display_name AS assigned_name
        FROM tickets t
        JOIN employees e ON t.employee_id = e.employee_id
        LEFT JOIN departments d ON e.department_id = d.department_id
        LEFT JOIN hardware_assets a ON t.asset_id = a.asset_id
        LEFT JOIN employees a1 ON t.assigned_to = a1.employee_id
        ORDER BY t.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

const getTicketById = async (ticket_id) => {
    const query = `
        SELECT t.*, e.display_name AS employee_name, e.employee_code, d.department_name AS department, 
               a.asset_name, a.asset_code, a.brand, a.model, a1.display_name AS assigned_name
        FROM tickets t
        JOIN employees e ON t.employee_id = e.employee_id
        LEFT JOIN departments d ON e.department_id = d.department_id
        LEFT JOIN hardware_assets a ON t.asset_id = a.asset_id
        LEFT JOIN employees a1 ON t.assigned_to = a1.employee_id
        WHERE t.ticket_id = ?
    `;
    const [rows] = await db.query(query, [ticket_id]);
    return rows[0];
};

const getAssetsByEmployee = async (employee_id) => {
    const query = `
        SELECT asset_id, asset_code, asset_name, brand, model, asset_type
        FROM hardware_assets
        WHERE current_employee_id = ? AND asset_status = 'Assigned'
        ORDER BY asset_code ASC
    `;
    const [rows] = await db.query(query, [employee_id]);
    return rows;
};

const updateTicketStatus = async (ticket_id, status, user_id) => {
    // Get old status
    const [oldRows] = await db.query("SELECT status FROM tickets WHERE ticket_id = ?", [ticket_id]);
    const oldStatus = oldRows[0].status;

    await db.query("UPDATE tickets SET status = ? WHERE ticket_id = ?", [status, ticket_id]);

    await db.query(
        "INSERT INTO ticket_status_history (ticket_id, changed_by, old_status, new_status) VALUES (?, ?, ?, ?)",
        [ticket_id, user_id, oldStatus, status]
    );
};


const updateTicketPriority = async (ticket_id, priority, user_id) => {
    // Get old priority
    const [oldRows] = await db.query("SELECT priority FROM tickets WHERE ticket_id = ?", [ticket_id]);
    const oldPriority = oldRows[0].priority;

    await db.query("UPDATE tickets SET priority = ? WHERE ticket_id = ?", [priority, ticket_id]);

    await db.query(
        "INSERT INTO ticket_status_history (ticket_id, changed_by, old_status, new_status) VALUES (?, ?, ?, ?)",
        [ticket_id, user_id, `Priority: ${oldPriority}`, `Priority: ${priority}`]
    );
};

const assignTicket = async (ticket_id, assigned_to_employee_id, user_id) => {
    await db.query("UPDATE tickets SET assigned_to = ?, status = 'Assigned' WHERE ticket_id = ?", [assigned_to_employee_id, ticket_id]);
    
    // Add history for assignment
    await db.query(
        "INSERT INTO ticket_status_history (ticket_id, changed_by, old_status, new_status) VALUES (?, ?, 'Open/Unassigned', 'Assigned')",
        [ticket_id, user_id]
    );
};

const addComment = async (ticket_id, user_id, comment_text) => {
    await db.query(
        "INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)",
        [ticket_id, user_id, comment_text]
    );
};

const getTicketTimeline = async (ticket_id) => {
    // Get comments
    const [comments] = await db.query(`
        SELECT c.*, u.username, u.role, e.display_name 
        FROM ticket_comments c
        JOIN users u ON c.user_id = u.user_id
        LEFT JOIN employees e ON u.employee_id = e.employee_id
        WHERE c.ticket_id = ?
        ORDER BY c.created_at ASC
    `, [ticket_id]);

    // Get status history
    const [history] = await db.query(`
        SELECT h.*, u.username, u.role, e.display_name
        FROM ticket_status_history h
        JOIN users u ON h.changed_by = u.user_id
        LEFT JOIN employees e ON u.employee_id = e.employee_id
        WHERE h.ticket_id = ?
        ORDER BY h.created_at ASC
    `, [ticket_id]);

    return { comments, history };
};

const getTicketStats = async () => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
            SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed
        FROM tickets
    `);
    return rows[0];
};

module.exports = {
    createTicket,
    getTicketsByEmployee,
    getAllTickets,
    getTicketById,
    getAssetsByEmployee,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    addComment,
    getTicketTimeline,
    getTicketStats
};
