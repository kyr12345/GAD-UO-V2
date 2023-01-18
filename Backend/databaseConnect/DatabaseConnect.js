const mysql = require('mysql2')
const ip = require('../../Frontend/src/ip.json')
require('dotenv').config()
const connection = mysql
  .createConnection({
    host: ip.host,
    user: ip.user,
    password: ip.password,
    database: ip.database,
  })
  .promise()

module.exports = connection
