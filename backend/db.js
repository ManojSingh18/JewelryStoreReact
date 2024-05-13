// Import the MySQL2 module and database configuration
const mysql = require('mysql2');
const dbconfig = require('./config/db.config');

// Create the MySQL2 connection
const connection = mysql.createConnection({
    host: dbconfig.HOST,
    user: dbconfig.USER,
    password: dbconfig.PASSWORD,
    database: dbconfig.DB
});

// Connect to the MySQL server and handle errors
connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the application on connection errors
    } else {
        console.log('Successfully connected to the database.');
    }
});

// Export the connection object
module.exports = connection;
