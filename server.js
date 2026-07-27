require("dotenv").config();

const express = require("express");
require("./config/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AssetSphere Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});