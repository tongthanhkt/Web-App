//This file has all the function for each key feature.
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


//MYSQL
const mysql = require('mysql');
const database = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
    multipleStatements: true
});

function GetProfile(id) {
    database.query('Select *from Staff where StaffID = ?', [id], async (error, results) => {
        return results;
    })
}