const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'csc317db',
    password: 'm0nday427'
});

module.exports = db.promise();