const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const designationRoutes = require("./routes/designationRoutes");
const locationRoutes = require("./routes/locationRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const assetRoutes = require("./routes/assetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('🚀 AssetSphere Backend Running...');
});

// Employee API
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);

// Temporary Test Route
app.post("/test", (req, res) => {
    res.json({
        success: true,
        message: "POST is working"
    });
});

// Assets API
app.use("/api/assets", assetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});