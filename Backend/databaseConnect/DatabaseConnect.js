const mysql = require('mysql2')
const ipfile = require('../../Frontend/src/ip.json')
require('dotenv').config()
const connection = mysql
  .createConnection({
    host: ipfile.host,
    user: 'root',
    password: 'S2k3c0s2@1110',
    database: 'uo',
  })
  .promise()

module.exports = connection
