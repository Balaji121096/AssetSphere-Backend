// =====================================================
// projectModel.js - All DB queries for Project Management
// =====================================================

const db = require("../config/db");

// =====================================================
// HELPER: Log activity
// =====================================================
const logActivity = async (project_id, user_id, action_type, description) => {
    try {
        await db.query(
            "INSERT INTO project_activity (project_id, user_id, action_type, description) VALUES (?, ?, ?, ?)",
            [project_id, user_id, action_type, description]
        );
    } catch (e) {
        console.error("Activity log error:", e.message);
    }
};

// =====================================================
// PROJECTS - CRUD
// =====================================================

const createProject = async (data, user_id) => {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM projects");
    const count = rows[0].count + 1;
    const project_code = data.project_code || ("PRJ-" + count.toString().padStart(4, "0"));

    const [result] = await db.query(
        `INSERT INTO projects (project_code, project_name, description, client_department,
         manager_employee_id, start_date, expected_end_date, priority, status, objectives, notes, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [project_code, data.project_name, data.description || null, data.client_department || null,
         data.manager_employee_id || null, data.start_date || null, data.expected_end_date || null,
         data.priority || "Medium", data.status || "Planning", data.objectives || null,
         data.notes || null, user_id]
    );

    await logActivity(result.insertId, user_id, "project_created", `Project "${data.project_name}" created`);
    return { project_id: result.insertId, project_code };
};

const getAllProjects = async () => {
    const [rows] = await db.query(`
        SELECT p.*, e.display_name AS manager_name, e.employee_code AS manager_code,
               (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.project_id AND pm.status = 'Active') AS member_count,
               (SELECT COUNT(*) FROM project_tasks pt WHERE pt.project_id = p.project_id) AS task_count,
               (SELECT COUNT(*) FROM project_tasks pt WHERE pt.project_id = p.project_id AND pt.status = 'Completed') AS completed_tasks
        FROM projects p
        LEFT JOIN employees e ON p.manager_employee_id = e.employee_id
        ORDER BY p.created_at DESC
    `);
    return rows;
};

const getProjectsByEmployee = async (employee_id) => {
    const [rows] = await db.query(`
        SELECT p.*, e.display_name AS manager_name,
               pm.project_role,
               (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.project_id = p.project_id AND pm2.status = 'Active') AS member_count,
               (SELECT COUNT(*) FROM project_tasks pt WHERE pt.project_id = p.project_id) AS task_count,
               (SELECT COUNT(*) FROM project_tasks pt WHERE pt.project_id = p.project_id AND pt.status = 'Completed') AS completed_tasks
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.project_id AND pm.employee_id = ? AND pm.status = 'Active'
        LEFT JOIN employees e ON p.manager_employee_id = e.employee_id
        ORDER BY p.created_at DESC
    `, [employee_id]);
    return rows;
};

const getProjectById = async (project_id) => {
    const [rows] = await db.query(`
        SELECT p.*, e.display_name AS manager_name, e.employee_code AS manager_code,
               u.username AS created_by_username
        FROM projects p
        LEFT JOIN employees e ON p.manager_employee_id = e.employee_id
        LEFT JOIN users u ON p.created_by = u.user_id
        WHERE p.project_id = ?
    `, [project_id]);
    return rows[0];
};

const updateProject = async (project_id, data, user_id) => {
    await db.query(
        `UPDATE projects SET project_name=?, description=?, client_department=?,
         manager_employee_id=?, start_date=?, expected_end_date=?, priority=?, status=?,
         objectives=?, notes=?, actual_end_date=? WHERE project_id=?`,
        [data.project_name, data.description || null, data.client_department || null,
         data.manager_employee_id || null, data.start_date || null, data.expected_end_date || null,
         data.priority || "Medium", data.status || "Planning", data.objectives || null,
         data.notes || null, data.actual_end_date || null, project_id]
    );
    await logActivity(project_id, user_id, "project_updated", `Project details updated`);
};

const deleteProject = async (project_id) => {
    await db.query("DELETE FROM projects WHERE project_id = ?", [project_id]);
};

const getProjectStats = async (project_id) => {
    const [[stats]] = await db.query(`
        SELECT
            COUNT(*) AS total_tasks,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
            SUM(CASE WHEN status IN ('To Do','In Progress','Blocked') AND due_date < CURDATE() THEN 1 ELSE 0 END) AS overdue_tasks,
            SUM(CASE WHEN status NOT IN ('Completed','Cancelled') THEN 1 ELSE 0 END) AS pending_tasks,
            COALESCE(AVG(percent_complete), 0) AS avg_progress,
            COALESCE(SUM(estimated_hours), 0) AS total_estimated_hours
        FROM project_tasks WHERE project_id = ?
    `, [project_id]);

    const [[timeStats]] = await db.query(`
        SELECT COALESCE(SUM(total_hours), 0) AS total_logged_hours
        FROM project_time_logs WHERE project_id = ?
    `, [project_id]);

    const [[memberCount]] = await db.query(
        "SELECT COUNT(*) AS member_count FROM project_members WHERE project_id = ? AND status = 'Active'",
        [project_id]
    );

    return { ...stats, ...timeStats, ...memberCount };
};

// =====================================================
// MEMBERS
// =====================================================

const getProjectMembers = async (project_id) => {
    const [rows] = await db.query(`
        SELECT pm.*, e.display_name, e.employee_code, e.official_email,
               d.department_name, des.designation_name,
               u.username, pm.project_role, pm.assigned_date, pm.status
        FROM project_members pm
        JOIN employees e ON pm.employee_id = e.employee_id
        LEFT JOIN departments d ON e.department_id = d.department_id
        LEFT JOIN designations des ON e.designation_id = des.designation_id
        LEFT JOIN users u ON u.employee_id = e.employee_id
        WHERE pm.project_id = ?
        ORDER BY pm.created_at ASC
    `, [project_id]);
    return rows;
};

const addProjectMember = async (project_id, employee_id, project_role, added_by) => {
    await db.query(
        `INSERT INTO project_members (project_id, employee_id, project_role, assigned_date, added_by)
         VALUES (?, ?, ?, CURDATE(), ?)
         ON DUPLICATE KEY UPDATE status='Active', project_role=VALUES(project_role)`,
        [project_id, employee_id, project_role || "Member", added_by]
    );
    const [emp] = await db.query("SELECT display_name FROM employees WHERE employee_id = ?", [employee_id]);
    await logActivity(project_id, added_by, "member_added", `${emp[0]?.display_name || "Employee"} added as ${project_role || "Member"}`);
};

const removeProjectMember = async (project_id, employee_id, user_id) => {
    const [emp] = await db.query("SELECT display_name FROM employees WHERE employee_id = ?", [employee_id]);
    await db.query(
        "UPDATE project_members SET status='Inactive' WHERE project_id=? AND employee_id=?",
        [project_id, employee_id]
    );
    await logActivity(project_id, user_id, "member_removed", `${emp[0]?.display_name || "Employee"} removed from project`);
};

const isMember = async (project_id, employee_id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM project_members WHERE project_id=? AND employee_id=? AND status='Active'",
        [project_id, employee_id]
    );
    return rows.length > 0;
};

// =====================================================
// TASKS
// =====================================================

const getProjectTasks = async (project_id) => {
    const [rows] = await db.query(`
        SELECT pt.*, e.display_name AS assigned_name, e.employee_code AS assigned_code
        FROM project_tasks pt
        LEFT JOIN employees e ON pt.assigned_employee_id = e.employee_id
        WHERE pt.project_id = ?
        ORDER BY pt.created_at DESC
    `, [project_id]);
    return rows;
};

const getTaskById = async (task_id) => {
    const [rows] = await db.query(`
        SELECT pt.*, e.display_name AS assigned_name
        FROM project_tasks pt
        LEFT JOIN employees e ON pt.assigned_employee_id = e.employee_id
        WHERE pt.task_id = ?
    `, [task_id]);
    return rows[0];
};

const createTask = async (project_id, data, user_id) => {
    const [result] = await db.query(
        `INSERT INTO project_tasks (project_id, task_name, description, assigned_employee_id,
         priority, status, start_date, due_date, estimated_hours, percent_complete, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [project_id, data.task_name, data.description || null, data.assigned_employee_id || null,
         data.priority || "Medium", data.status || "To Do", data.start_date || null,
         data.due_date || null, data.estimated_hours || 0, data.percent_complete || 0, user_id]
    );
    await logActivity(project_id, user_id, "task_created", `Task "${data.task_name}" created`);
    return { task_id: result.insertId };
};

const updateTask = async (task_id, project_id, data, user_id) => {
    await db.query(
        `UPDATE project_tasks SET task_name=?, description=?, assigned_employee_id=?,
         priority=?, status=?, start_date=?, due_date=?, estimated_hours=?, actual_hours=?, percent_complete=?
         WHERE task_id=? AND project_id=?`,
        [data.task_name, data.description || null, data.assigned_employee_id || null,
         data.priority || "Medium", data.status || "To Do", data.start_date || null,
         data.due_date || null, data.estimated_hours || 0, data.actual_hours || 0,
         data.percent_complete || 0, task_id, project_id]
    );
    await logActivity(project_id, user_id, "task_updated", `Task "${data.task_name}" updated to ${data.status}`);
};

const deleteTask = async (task_id) => {
    await db.query("DELETE FROM project_tasks WHERE task_id = ?", [task_id]);
};

// =====================================================
// TIME LOGS
// =====================================================

const getTimeLogs = async (project_id, filters = {}) => {
    let query = `
        SELECT tl.*, e.display_name AS employee_name, e.employee_code,
               pt.task_name
        FROM project_time_logs tl
        JOIN employees e ON tl.employee_id = e.employee_id
        LEFT JOIN project_tasks pt ON tl.task_id = pt.task_id
        WHERE tl.project_id = ?
    `;
    const params = [project_id];

    if (filters.employee_id) { query += " AND tl.employee_id = ?"; params.push(filters.employee_id); }
    if (filters.month) { query += " AND DATE_FORMAT(tl.log_date, '%Y-%m') = ?"; params.push(filters.month); }

    query += " ORDER BY tl.log_date DESC, tl.created_at DESC";

    const [rows] = await db.query(query, params);
    return rows;
};

const createTimeLog = async (project_id, data, employee_id, user_id) => {
    // Auto-calculate hours if times given
    let total_hours = data.total_hours || 0;
    if (data.start_time && data.end_time && !total_hours) {
        const [sh, sm] = data.start_time.split(":").map(Number);
        const [eh, em] = data.end_time.split(":").map(Number);
        const mins = (eh * 60 + em) - (sh * 60 + sm) - (data.break_minutes || 0);
        total_hours = Math.max(0, mins / 60);
    }

    const [result] = await db.query(
        `INSERT INTO project_time_logs (project_id, task_id, employee_id, log_date,
         start_time, end_time, break_minutes, total_hours, work_note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [project_id, data.task_id || null, employee_id, data.log_date,
         data.start_time || null, data.end_time || null, data.break_minutes || 0,
         parseFloat(total_hours.toFixed(2)), data.work_note || null]
    );
    await logActivity(project_id, user_id, "time_logged", `Time entry added: ${total_hours.toFixed(2)}h`);
    return { log_id: result.insertId };
};

const updateTimeLog = async (log_id, data, user_id, project_id) => {
    let total_hours = data.total_hours || 0;
    if (data.start_time && data.end_time && !total_hours) {
        const [sh, sm] = data.start_time.split(":").map(Number);
        const [eh, em] = data.end_time.split(":").map(Number);
        const mins = (eh * 60 + em) - (sh * 60 + sm) - (data.break_minutes || 0);
        total_hours = Math.max(0, mins / 60);
    }
    await db.query(
        `UPDATE project_time_logs SET task_id=?, log_date=?, start_time=?, end_time=?,
         break_minutes=?, total_hours=?, work_note=? WHERE log_id=?`,
        [data.task_id || null, data.log_date, data.start_time || null, data.end_time || null,
         data.break_minutes || 0, parseFloat(total_hours.toFixed(2)), data.work_note || null, log_id]
    );
};

const deleteTimeLog = async (log_id) => {
    await db.query("DELETE FROM project_time_logs WHERE log_id = ?", [log_id]);
};

// =====================================================
// DAILY UPDATES
// =====================================================

const getProjectUpdates = async (project_id, filters = {}) => {
    let query = `
        SELECT pu.*, e.display_name AS employee_name, e.employee_code
        FROM project_updates pu
        JOIN employees e ON pu.employee_id = e.employee_id
        WHERE pu.project_id = ?
    `;
    const params = [project_id];
    if (filters.employee_id) { query += " AND pu.employee_id = ?"; params.push(filters.employee_id); }
    query += " ORDER BY pu.update_date DESC, pu.created_at DESC";
    const [rows] = await db.query(query, params);
    return rows;
};

const createUpdate = async (project_id, data, employee_id, user_id) => {
    const [result] = await db.query(
        `INSERT INTO project_updates (project_id, employee_id, update_date, tasks_worked_on,
         work_completed, work_in_progress, issues_blockers, next_planned_work, time_spent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [project_id, employee_id, data.update_date, data.tasks_worked_on || null,
         data.work_completed || null, data.work_in_progress || null,
         data.issues_blockers || null, data.next_planned_work || null, data.time_spent || 0]
    );
    await logActivity(project_id, user_id, "update_submitted", `Daily update submitted by employee`);
    return { update_id: result.insertId };
};

const updateDailyUpdate = async (update_id, data) => {
    await db.query(
        `UPDATE project_updates SET update_date=?, tasks_worked_on=?, work_completed=?,
         work_in_progress=?, issues_blockers=?, next_planned_work=?, time_spent=?
         WHERE update_id=?`,
        [data.update_date, data.tasks_worked_on || null, data.work_completed || null,
         data.work_in_progress || null, data.issues_blockers || null,
         data.next_planned_work || null, data.time_spent || 0, update_id]
    );
};

// =====================================================
// MEETINGS
// =====================================================

const getMeetings = async (project_id) => {
    const [rows] = await db.query(`
        SELECT m.*, u.username AS created_by_username, e.display_name AS created_by_name
        FROM project_meetings m
        LEFT JOIN users u ON m.created_by = u.user_id
        LEFT JOIN employees e ON u.employee_id = e.employee_id
        WHERE m.project_id = ?
        ORDER BY m.meeting_date DESC
    `, [project_id]);
    return rows;
};

const createMeeting = async (project_id, data, user_id) => {
    const [result] = await db.query(
        `INSERT INTO project_meetings (project_id, title, meeting_date, start_time, end_time,
         meeting_type, participants, agenda, meeting_notes, action_items, next_followup_date, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [project_id, data.title, data.meeting_date, data.start_time || null, data.end_time || null,
         data.meeting_type || "General", data.participants || null, data.agenda || null,
         data.meeting_notes || null, data.action_items || null, data.next_followup_date || null,
         data.status || "Upcoming", user_id]
    );
    await logActivity(project_id, user_id, "meeting_created", `Meeting "${data.title}" scheduled`);
    return { meeting_id: result.insertId };
};

const updateMeeting = async (meeting_id, project_id, data, user_id) => {
    await db.query(
        `UPDATE project_meetings SET title=?, meeting_date=?, start_time=?, end_time=?,
         meeting_type=?, participants=?, agenda=?, meeting_notes=?, action_items=?,
         next_followup_date=?, status=? WHERE meeting_id=? AND project_id=?`,
        [data.title, data.meeting_date, data.start_time || null, data.end_time || null,
         data.meeting_type || "General", data.participants || null, data.agenda || null,
         data.meeting_notes || null, data.action_items || null, data.next_followup_date || null,
         data.status || "Upcoming", meeting_id, project_id]
    );
    await logActivity(project_id, user_id, "meeting_updated", `Meeting "${data.title}" updated`);
};

const deleteMeeting = async (meeting_id) => {
    await db.query("DELETE FROM project_meetings WHERE meeting_id = ?", [meeting_id]);
};

// =====================================================
// FILES
// =====================================================

const getProjectFiles = async (project_id) => {
    const [rows] = await db.query(`
        SELECT pf.*, u.username AS uploaded_by_username, e.display_name AS uploaded_by_name
        FROM project_files pf
        LEFT JOIN users u ON pf.uploaded_by = u.user_id
        LEFT JOIN employees e ON u.employee_id = e.employee_id
        WHERE pf.project_id = ?
        ORDER BY pf.created_at DESC
    `, [project_id]);
    return rows;
};

const createFileRecord = async (project_id, fileData, user_id) => {
    const [result] = await db.query(
        `INSERT INTO project_files (project_id, file_name, file_path, file_size, file_type, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [project_id, fileData.file_name, fileData.file_path, fileData.file_size || null,
         fileData.file_type || null, user_id]
    );
    await logActivity(project_id, user_id, "file_uploaded", `File "${fileData.file_name}" uploaded`);
    return { file_id: result.insertId };
};

const deleteFile = async (file_id) => {
    const [rows] = await db.query("SELECT * FROM project_files WHERE file_id = ?", [file_id]);
    if (rows.length) await db.query("DELETE FROM project_files WHERE file_id = ?", [file_id]);
    return rows[0];
};

// =====================================================
// ACTIVITY
// =====================================================

const getActivity = async (project_id, limit = 50) => {
    const [rows] = await db.query(`
        SELECT pa.*, u.username, e.display_name
        FROM project_activity pa
        LEFT JOIN users u ON pa.user_id = u.user_id
        LEFT JOIN employees e ON u.employee_id = e.employee_id
        WHERE pa.project_id = ?
        ORDER BY pa.created_at DESC
        LIMIT ?
    `, [project_id, limit]);
    return rows;
};

// =====================================================
// DASHBOARD SUMMARY
// =====================================================

const getDashboardStats = async () => {
    const [[stats]] = await db.query(`
        SELECT
            COUNT(*) AS total_projects,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS active_projects,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_projects,
            SUM(CASE WHEN status = 'On Hold' THEN 1 ELSE 0 END) AS on_hold_projects,
            SUM(CASE WHEN status NOT IN ('Completed','Cancelled') AND expected_end_date < CURDATE() THEN 1 ELSE 0 END) AS overdue_projects
        FROM projects
    `);

    const [[taskStats]] = await db.query(`
        SELECT
            SUM(CASE WHEN due_date = CURDATE() AND status NOT IN ('Completed','Cancelled') THEN 1 ELSE 0 END) AS tasks_due_today,
            SUM(CASE WHEN due_date < CURDATE() AND status NOT IN ('Completed','Cancelled') THEN 1 ELSE 0 END) AS overdue_tasks
        FROM project_tasks
    `);

    const [[hours]] = await db.query("SELECT COALESCE(SUM(total_hours),0) AS total_hours_logged FROM project_time_logs");

    return { ...stats, ...taskStats, ...hours };
};

module.exports = {
    createProject, getAllProjects, getProjectsByEmployee, getProjectById,
    updateProject, deleteProject, getProjectStats,
    getProjectMembers, addProjectMember, removeProjectMember, isMember,
    getProjectTasks, getTaskById, createTask, updateTask, deleteTask,
    getTimeLogs, createTimeLog, updateTimeLog, deleteTimeLog,
    getProjectUpdates, createUpdate, updateDailyUpdate,
    getMeetings, createMeeting, updateMeeting, deleteMeeting,
    getProjectFiles, createFileRecord, deleteFile,
    getActivity, getDashboardStats, logActivity
};
