const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

async function init() {
  const db = await open({
    filename: path.join(__dirname, '../../../vehicle_rental.db'),
    driver: sqlite3.Database
  });

  console.log('Running schema.sql...');
  const schema = fs.readFileSync(path.join(__dirname, '../../../schema.sql'), 'utf-8');
  await db.exec(schema);

  console.log('Running sample_data.sql...');
  const sampleData = fs.readFileSync(path.join(__dirname, '../../../sample_data.sql'), 'utf-8');
  await db.exec(sampleData);

  console.log('Database initialized successfully!');
  await db.close();
}

init().catch(console.error);
