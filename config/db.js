
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

let sslCA;

if (process.env.DB_SSL_CA_BASE64) {
  sslCA = Buffer.from(
    process.env.DB_SSL_CA_BASE64,
    "base64"
  ).toString("utf8");
} else {
  const caPath = path.join(__dirname, "ca.pem");
  sslCA = fs.readFileSync(caPath, "utf8");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: sslCA,
    rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Aiven MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
  }
})();

module.exports = pool;
