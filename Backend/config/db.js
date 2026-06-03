const mysql = require("mysql2/promise");
require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_DATABASE'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const db_connect = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE,

  port: Number(process.env.DB_PORT),

  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

console.log("✓ MySQL Connection Pool created");

module.exports = db_connect;