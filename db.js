import mysql from 'mysql2';

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           
    password: 'admin',      
    database: 'blog'        
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


export default db;
