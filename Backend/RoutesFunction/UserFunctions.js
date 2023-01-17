const bcrypt = require('bcryptjs')
const mysql = require('mysql2')
const ipfile = require('../../Frontend/src/ip.json')
const connection = mysql
  .createConnection({
    host: ipfile.host,
    user: 'root',
    password: 'S2k3c0s2@1110',
    database: 'uo',
  })
  .promise()
const FindUsername = async (username) => {
  const sqlQuery = 'SELECT *FROM USERS WHERE username=?'
  const result = await connection.query(sqlQuery, [username])
  if (result[0].length == 0) {
    return false
  }
  return true
}

const comparePassword = async (username, password) => {
  const sqlQuery = 'SELECT *FROM USERS WHERE username=?'
  const result = await connection.query(sqlQuery, [username])

  if (
    result[0].length > 0 &&
    (await bcrypt.compare(password, result[0][0].password))
  ) {
    return true
  }
  return false
}

exports.LoginUser = async (req, res) => {
  const { username, password } = req.body

  const usernamefind = await FindUsername(username)
  if (!usernamefind) {
    res.status(403).json({
      success: false,
      message: 'Enter Correct Username',
    })
  } else {
    const passwordcheck = await comparePassword(username, password)
    if (!passwordcheck) {
      res.status(403).json({
        success: false,
        message: 'Enter Correct Password',
      })
    } else {
      const selectuser = `SELECT*FROM USERS WHERE USERNAME=?`
      const result = await connection.query(selectuser, [username])

      res.status(200).json({
        success: true,
        message: 'You are logged in ',
        userData: result[0][0],
      })
    }
  }
}

exports.Register = async (req, res) => {
  const { username, password, name, email, designation } = req.body

  const usernamefind = await FindUsername(username)
  if (!usernamefind) {
    const hashpass = await bcrypt.hashSync(password, 10)
    const INSERTQuery = `INSERT INTO USERS (USERNAME,PASSWORD,name,email,designation) VALUES (?,?,?,?,?)`
    const result = await connection.query(INSERTQuery, [
      username,
      hashpass,
      name,
      email,
      designation,
    ])
    if (result[0].insertId) {
      res.status(200).json({
        success: true,
        msg: 'The User is Added Successfully',
      })
    } else {
      res.status(200).json({
        success: false,
        msg: 'The User is Not Register',
      })
    }
  } else {
    res.status(200).json({
      success: false,
      msg: 'Username Already Exists',
    })
  }
}
