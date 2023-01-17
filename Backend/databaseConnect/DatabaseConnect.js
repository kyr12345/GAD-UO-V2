const mysql = require('mysql2')
require('dotenv').config()
const connection = mysql
  .createConnection({
    host: 'localhost',
    user: 'root',
    password: 'S2k3c0s2@1110',
    database: 'uo',
  })
  .promise()

module.exports = connection
