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

process.on('uncaughtException', (error) => {
  console.log(error.message)
  console.log('Shutting Down the Server')
  process.exit(1)
})

//CONNECT DATABASE
const connection = mysql.createConnection({
  host: ipfile.ip,
  user: 'root',
  password: 'S2k3c0s2@',
  database: 'UCO',
})
/* 
connection.connect((err, result) => {
  if (err) console.log(err)

  console.log('Database Connected')
}) */

//ROUTES

app.use('/api/v1', users)
app.use('/api/v1', Form)

shell.exec('npm run client')
//SERVER START
/* app.listen(3000, () => {
  console.log('start')
}) */

/* process.on('unhandledRejection', (error) => {
  console.log(error.message)
  console.log('Shutting Down the Server')
  server.close(() => {
    process.exit(1)
  })
}) */
