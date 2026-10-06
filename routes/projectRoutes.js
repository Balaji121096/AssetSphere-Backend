const express = require("express");
const router = express.Router();
const pc = require("../controllers/projectController");
const verifyToken = require("../middleware/authMiddleware");
const { uploadProjectFile } = require("../middleware/projectUpload");

router.use(verifyToken);

// Dashboard
router.get("/stats", pc.getDashboardStats);
router.get("/roles", pc.getProjectRoles);
router.post("/roles", pc.createProjectRole);

// Projects
router.get("/", pc.getProjects);
router.post("/", pc.createProject);
router.get("/:id", pc.getProject);
router.put("/:id", pc.updateProject);
router.delete("/:id", pc.deleteProject);

// Members
router.get("/:id/members", pc.getMembers);
router.post("/:id/members", pc.addMember);
router.put("/:id/members/:employee_id", pc.updateMember);
router.delete("/:id/members/:employee_id", pc.removeMember);

// Tasks
router.get("/:id/tasks", pc.getTasks);
router.post("/:id/tasks", pc.createTask);
router.put("/:id/tasks/:task_id", pc.updateTask);
router.delete("/:id/tasks/:task_id", pc.deleteTask);

// Time Logs
router.get("/:id/timelogs", pc.getTimeLogs);
router.post("/:id/timelogs", pc.createTimeLog);
router.put("/:id/timelogs/:log_id", pc.updateTimeLog);
router.delete("/:id/timelogs/:log_id", pc.deleteTimeLog);

// Daily Updates
router.get("/:id/updates", pc.getUpdates);
router.post("/:id/updates", pc.createDailyUpdate);
router.put("/:id/updates/:update_id", pc.updateDailyUpdate);

// Meetings
router.get("/:id/meetings", pc.getMeetings);
router.post("/:id/meetings", pc.createMeeting);
router.put("/:id/meetings/:meeting_id", pc.updateMeeting);
router.delete("/:id/meetings/:meeting_id", pc.deleteMeeting);

// Files
router.get("/:id/files", pc.getFiles);
router.post("/:id/files", uploadProjectFile.single("file"), pc.uploadFile);
router.get("/:id/files/:file_id/download", pc.downloadFile);
router.get("/:id/files/:file_id/view", pc.viewFile);
router.delete("/:id/files/:file_id", pc.deleteFile);

// Activity
router.get("/:id/activity", pc.getActivity);

module.exports = router;




