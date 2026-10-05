// =====================================================
// projectController.js
// =====================================================

const pm = require("../models/projectModel");
const path = require("path");
const fs = require("fs");

const ADMIN_ROLES = ["Super Admin", "Admin"];
const MANAGER_ROLES = ["Super Admin", "Admin", "Manager"];

// ─── helper: check if user can access the project ───
const canAccess = async (req, project_id) => {
    const role = req.user.role;
    if (MANAGER_ROLES.includes(role)) return true;
    // Employee: must be a member
    if (req.user.employee_id) {
        return await pm.isMember(project_id, req.user.employee_id);
    }
    return false;
};

// ─── helper: check if user can manage the project ───
const canManage = (req) => MANAGER_ROLES.includes(req.user.role);

// =====================================================
// PROJECTS
// =====================================================

const getProjects = async (req, res) => {
    try {
        let projects;
        if (MANAGER_ROLES.includes(req.user.role)) {
            projects = await pm.getAllProjects();
        } else {
            if (!req.user.employee_id) return res.json({ success: true, data: [] });
            projects = await pm.getProjectsByEmployee(req.user.employee_id);
        }
        res.json({ success: true, data: projects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch projects" });
    }
};

const getProject = async (req, res) => {
    try {
        const project = await pm.getProjectById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });

        const stats = await pm.getProjectStats(req.params.id);
        res.json({ success: true, data: { ...project, stats } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch project" });
    }
};

const createProject = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        const result = await pm.createProject(req.body, req.user.user_id);
        res.status(201).json({ success: true, message: "Project created", data: result });
    } catch (err) {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ success: false, message: "Project code already exists" });
        res.status(500).json({ success: false, message: "Failed to create project" });
    }
};

const updateProject = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.updateProject(req.params.id, req.body, req.user.user_id);
        res.json({ success: true, message: "Project updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update project" });
    }
};

const deleteProject = async (req, res) => {
    try {
        if (!ADMIN_ROLES.includes(req.user.role))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.deleteProject(req.params.id);
        res.json({ success: true, message: "Project deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete project" });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const data = await pm.getDashboardStats();
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

// =====================================================
// MEMBERS
// =====================================================

const getMembers = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const data = await pm.getProjectMembers(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch members" });
    }
};

const addMember = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        const { employee_id, project_role } = req.body;
        if (!employee_id) return res.status(400).json({ success: false, message: "employee_id required" });
        await pm.addProjectMember(req.params.id, employee_id, project_role, req.user.user_id);
        res.json({ success: true, message: "Member added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to add member" });
    }
};

const removeMember = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.removeProjectMember(req.params.id, req.params.employee_id, req.user.user_id);
        res.json({ success: true, message: "Member removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to remove member" });
    }
};

// =====================================================
// TASKS
// =====================================================

const getTasks = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const data = await pm.getProjectTasks(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
};

const createTask = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        if (!req.body.task_name)
            return res.status(400).json({ success: false, message: "task_name required" });
        const data = await pm.createTask(req.params.id, req.body, req.user.user_id);
        res.status(201).json({ success: true, message: "Task created", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create task" });
    }
};

const updateTask = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        // Employees can only update their own assigned tasks
        if (req.user.role === "Employee") {
            const task = await pm.getTaskById(req.params.task_id);
            if (!task || task.assigned_employee_id !== req.user.employee_id)
                return res.status(403).json({ success: false, message: "You can only update your own tasks" });
        }
        await pm.updateTask(req.params.task_id, req.params.id, req.body, req.user.user_id);
        res.json({ success: true, message: "Task updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update task" });
    }
};

const deleteTask = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.deleteTask(req.params.task_id);
        res.json({ success: true, message: "Task deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete task" });
    }
};

// =====================================================
// TIME LOGS
// =====================================================

const getTimeLogs = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const filters = {};
        if (req.user.role === "Employee") filters.employee_id = req.user.employee_id;
        if (req.query.month) filters.month = req.query.month;
        const data = await pm.getTimeLogs(req.params.id, filters);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch time logs" });
    }
};

const createTimeLog = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        if (!req.user.employee_id)
            return res.status(400).json({ success: false, message: "No employee linked" });
        if (!req.body.log_date)
            return res.status(400).json({ success: false, message: "log_date required" });
        const data = await pm.createTimeLog(req.params.id, req.body, req.user.employee_id, req.user.user_id);
        res.status(201).json({ success: true, message: "Time logged", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to log time" });
    }
};

const updateTimeLog = async (req, res) => {
    try {
        if (!canManage(req) && req.user.role === "Employee") {
            // Employee can only edit own logs
        }
        await pm.updateTimeLog(req.params.log_id, req.body, req.user.user_id, req.params.id);
        res.json({ success: true, message: "Time log updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update time log" });
    }
};

const deleteTimeLog = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.deleteTimeLog(req.params.log_id);
        res.json({ success: true, message: "Time log deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete time log" });
    }
};

// =====================================================
// DAILY UPDATES
// =====================================================

const getUpdates = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const filters = req.user.role === "Employee" ? { employee_id: req.user.employee_id } : {};
        const data = await pm.getProjectUpdates(req.params.id, filters);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch updates" });
    }
};

const createDailyUpdate = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        if (!req.user.employee_id)
            return res.status(400).json({ success: false, message: "No employee linked" });
        if (!req.body.update_date)
            return res.status(400).json({ success: false, message: "update_date required" });
        const data = await pm.createUpdate(req.params.id, req.body, req.user.employee_id, req.user.user_id);
        res.status(201).json({ success: true, message: "Update submitted", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to submit update" });
    }
};

// =====================================================
// MEETINGS
// =====================================================

const getMeetings = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const data = await pm.getMeetings(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch meetings" });
    }
};

const createMeeting = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        if (!req.body.title || !req.body.meeting_date)
            return res.status(400).json({ success: false, message: "title and meeting_date required" });
        const data = await pm.createMeeting(req.params.id, req.body, req.user.user_id);
        res.status(201).json({ success: true, message: "Meeting created", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create meeting" });
    }
};

const updateMeeting = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.updateMeeting(req.params.meeting_id, req.params.id, req.body, req.user.user_id);
        res.json({ success: true, message: "Meeting updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update meeting" });
    }
};

const deleteMeeting = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        await pm.deleteMeeting(req.params.meeting_id);
        res.json({ success: true, message: "Meeting deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete meeting" });
    }
};

// =====================================================
// FILES
// =====================================================

const getFiles = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const data = await pm.getProjectFiles(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch files" });
    }
};

const uploadFile = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        if (!req.file)
            return res.status(400).json({ success: false, message: "No file uploaded" });
        const fileData = {
            file_name: req.file.originalname,
            file_path: "/uploads/project-files/" + req.file.filename,
            file_size: req.file.size,
            file_type: req.file.mimetype
        };
        const data = await pm.createFileRecord(req.params.id, fileData, req.user.user_id);
        res.status(201).json({ success: true, message: "File uploaded", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to upload file" });
    }
};

const downloadFile = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const files = await pm.getProjectFiles(req.params.id);
        const file = files.find(f => f.file_id === parseInt(req.params.file_id));
        if (!file) return res.status(404).json({ success: false, message: "File not found" });
        const filePath = path.join(__dirname, "..", file.file_path);
        res.download(filePath, file.file_name);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to download file" });
    }
};

const deleteFile = async (req, res) => {
    try {
        if (!canManage(req))
            return res.status(403).json({ success: false, message: "Access denied" });
        const fileRecord = await pm.deleteFile(req.params.file_id);
        if (fileRecord) {
            const fullPath = path.join(__dirname, "..", fileRecord.file_path);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        res.json({ success: true, message: "File deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete file" });
    }
};

// =====================================================
// ACTIVITY
// =====================================================

const getActivity = async (req, res) => {
    try {
        if (!(await canAccess(req, req.params.id)))
            return res.status(403).json({ success: false, message: "Access denied" });
        const data = await pm.getActivity(req.params.id);
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch activity" });
    }
};

module.exports = {
    getProjects, getProject, createProject, updateProject, deleteProject, getDashboardStats,
    getMembers, addMember, removeMember,
    getTasks, createTask, updateTask, deleteTask,
    getTimeLogs, createTimeLog, updateTimeLog, deleteTimeLog,
    getUpdates, createDailyUpdate,
    getMeetings, createMeeting, updateMeeting, deleteMeeting,
    getFiles, uploadFile, downloadFile, deleteFile,
    getActivity
};
