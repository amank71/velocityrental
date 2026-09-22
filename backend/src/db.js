const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Standard MySQL pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vehicle_rental',
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') || process.env.DB_HOST.includes('tidbcloud') ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

module.exports = { pool };
