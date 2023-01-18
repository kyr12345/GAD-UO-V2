require('./databaseConnect/DatabaseConnect')
require('dotenv').config()
const express = require('express')
const users = require('./routes/UserRoutes')
const Form = require('./routes/FormRoutes')
const shell = require('shelljs')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const app = require('./app')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const ipfile = require('../Frontend/src/ip.json')

app.use(bodyParser.json({ limit: process.env.BODY_PARSER_LIMT }))
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }))

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieparser())

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)

//CONNECT DATABASE
const connection = mysql.createConnection({
  host: ipfile.host,
  user: ipfile.user,
  password: ipfile.password,
  database: ipfile.database,
})

//ROUTES

app.use('/api/v1', users)
app.use('/api/v1', Form)

//SERVER START

connection.query('SET GLOBAL connect_timeout=280000000000')

connection.connect((err, result) => {
  if (err) {
    console.log(err)
  }

  console.log('Database Connected')
})

app.listen(3000, () => {
  console.log('start')
})

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to Uncaught Exception`)
  process.exit(1)
})
