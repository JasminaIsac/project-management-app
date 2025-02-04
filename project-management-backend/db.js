// db.js

// Import the Pool class from the 'pg' module
const { Pool } = require('pg');

// Load environment variables from a .env file
require('dotenv').config();

// Create a new pool instance with the database configuration
const pool = new Pool({
  user: process.env.DB_USER,       // Database username
  host: process.env.DB_HOST,       // Database host
  database: process.env.DB_NAME,   // Database name
  password: process.env.DB_PASSWORD,// Database password
  port: process.env.DB_PORT,       // Database port, typically 5432
});

// Export the pool instance for use in other files
module.exports = pool;