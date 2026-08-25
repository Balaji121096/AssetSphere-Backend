const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");
const locationRoutes = require("./routes/locationRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const assetRoutes = require("./routes/assetRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const softwareRoutes = require("./routes/softwareRoutes");
const vendorDocumentRoutes = require("./routes/vendorDocumentRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// =====================================================
// USER ROUTES
// =====================================================

const userRoutes = require("./routes/userRoutes");


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.send("🚀 AssetSphere Backend Running...");

});


// =====================================================
// EMPLOYEE API
// =====================================================

app.use(
    "/api/employees",
    employeeRoutes
);


// =====================================================
// DEPARTMENT API
// =====================================================

app.use(
    "/api/departments",
    departmentRoutes
);


// =====================================================
// DESIGNATION API
// =====================================================

app.use(
    "/api/designations",
    designationRoutes
);


// =====================================================
// LOCATION API
// =====================================================

app.use(
    "/api/locations",
    locationRoutes
);


// =====================================================
// VENDOR API
// =====================================================

app.use(
    "/api/vendors",
    vendorRoutes
);


// =====================================================
// CATEGORY API
// =====================================================

app.use(
    "/api/categories",
    categoryRoutes
);


// =====================================================
// DASHBOARD API
// =====================================================

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// =====================================================
// REPORT API
// =====================================================

app.use(
    "/api/reports",
    reportRoutes
);


// =====================================================
// AUTH API
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// USER API
// =====================================================

app.use(
    "/api/users",
    userRoutes
);


// =====================================================
// ASSET API
// =====================================================

app.use(
    "/api/assets",
    assetRoutes
);


// =====================================================
// SOFTWARE API
// =====================================================

app.use(
    "/api/software",
    softwareRoutes
);


// =====================================================
// VENDOR DOCUMENT API
// =====================================================

app.use(
    "/api/vendor-documents",
    vendorDocumentRoutes
);


// =====================================================
// PURCHASE API
// =====================================================

app.use(
    "/api/purchases",
    purchaseRoutes
);


// =====================================================
// TEMPORARY TEST ROUTE
// =====================================================

app.post("/test", (req, res) => {

    res.json({

        success: true,

        message: "POST is working"

    });

});


// =====================================================
// 404 API HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: `Route not found: ${req.method} ${req.originalUrl}`

    });

});


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server running on Port ${PORT}`
    );

});