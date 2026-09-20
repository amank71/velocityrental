const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDatabase() {
  try {
    console.log("Connecting to MySQL...");
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });

    console.log("Creating database...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS vehicle_rental;`);
    await connection.query(`USE vehicle_rental;`);

    console.log("Reading schema...");
    const schema = fs.readFileSync(path.join(__dirname, '../../mysql_schema.sql'), 'utf-8');
    console.log("Running schema...");
    await connection.query(schema);

    console.log("Reading sample data...");
    const sample = fs.readFileSync(path.join(__dirname, '../../sample_data.sql'), 'utf-8');
    console.log("Running sample data...");
    await connection.query(sample);

    console.log("Done! Database is fully set up.");
    await connection.end();
  } catch (err) {
    console.error("Error setting up DB:", err);
  }
}

importDatabase();
