const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "neya1227",
    database: "library_db"
});

connection.connect((err) => {
    if (err) {
        console.error('Database Connection Failed:', err);
        return;
    }

    console.log('MySQL Connected');
});

module.exports = connection;