const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createpool({
    host: process.env.DB_HOST,
    User: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitforconnections: true,
    connectionlimit: 10,
    queuelimit:0
});

module.exports = pool;