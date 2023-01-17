import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import axios from 'axios'
import ipfile from '../../ip.json'
const Register = () => {
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [email, setemail] = useState('')
  const [name, setname] = useState('')
  const [designation, setdesignation] = useState('')

  const HandleSubmit = async (e) => {
    e.preventDefault()

    let err = ''
    if (name.length === 0) err += 'Enter The Name\n'
    if (email.length === 0) err += 'Enter The Email\n'
    if (username.length === 0) err += 'Enter The Username \n'
    if (designation.length === 0) err += 'Enter The Designation \n'

    if (password.length === 0) err += 'Enter The Password\n'

    if (err.length !== 0) alert(err)
    else {
      axios
        .post(
          `http://${ipfile.ip}:3000/api/v1/register`,
          { username, password, email, name, designation },
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          },
        )
        .then((result) => {
          if (result.data.success) {
            alert('User Registered Successfully')
          } else {
            alert(result.data.msg)
          }
        })
        .catch((error) => {
          console.log(error.response.data)
        })
    }
  }

  const paperStyle = {
    padding: 20,
    height: '70vh',
    width: 400,
    margin: '60px auto',
  }

  const avatarStyle = {
    backgroundColor: '#1bbd7e',
    width: '100px',
    height: '100px',
  }
  const btnstyle = { margin: '24px 0' }
  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <img src="https://wallpapercave.com/wp/wp3478342.jpg" />
          </Avatar>

          <h2>Register New User</h2>
        </Grid>

        <TextField
          label="Name"
          placeholder="Enter Name"
          fullWidth
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
          style={{ marginTop: '15px' }}
        />
        <TextField
          label="Email"
          placeholder="Enter Email"
          fullWidth
          onChange={(e) => setemail(e.target.value)}
          required
          value={email}
          style={{ marginTop: '15px' }}
        />
        <TextField
          label="Username"
          placeholder="Enter username"
          fullWidth
          onChange={(e) => setusername(e.target.value)}
          value={username}
          style={{ marginTop: '15px' }}
          required
        />

        <TextField
          label="Password"
          placeholder="Enter password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
          style={{ marginTop: '15px' }}
        />
        <TextField
          label="Designation"
          placeholder="Enter Designation"
          fullWidth
          onChange={(e) => setdesignation(e.target.value)}
          value={designation}
          style={{ marginTop: '15px' }}
          required
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={btnstyle}
          onClick={HandleSubmit}
          fullWidth
        >
          REGISTER
        </Button>
      </Paper>
    </Grid>
  )
}

export default Register
