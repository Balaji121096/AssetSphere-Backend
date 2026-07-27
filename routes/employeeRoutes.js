const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');

// GET All Employees
router.get('/', employeeController.getAllEmployees);

module.exports = router;