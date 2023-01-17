import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button } from '@material-ui/core'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import ipfile from '../../ip.json'
/* import processeNV from '../../../.env' */
const Login = () => {
  const dispatch = useDispatch()
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const navigate = useNavigate()
  const HandleSubmit = async (e) => {
    e.preventDefault()

    let err = ''

    if (username.length === 0) err += 'Enter The UserName \n'
    if (password.length === 0) err += 'Enter The Password \n'

    if (err.length > 0) {
      alert(err)
      err = ''
    } else {
      axios
        .post(
          `http://${ipfile.ip}:3000/api/v1/login`,
          { username, password },
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          },
        )
        .then((result) => {
          if (result.data.success) {
            /* dispatch({
              type: 'SET_USER',
              payload: {
                currentUser: result.data.userData,
              },
            }) */

            window.localStorage.setItem(
              'ROLE_NAME',
              JSON.stringify({
                username: result.data.userData.username,
                Role: result.data.userData.ROLE,
                Designation: result.data.userData.designation,
              }),
            )
            const datas = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
            console.log(datas.username)
            navigate('/admin')
          } else {
            alert(result.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message)
        })
    }
  }

  const paperStyle = {
    padding: 20,
    height: '70vh',
    width: 400,
    margin: '20px auto',
  }
  const avatarStyle = {
    backgroundColor: '#1bbd7e',
    width: '100px',
    height: '100px',
  }
  const btnstyle = { margin: '50px 0' }
  return (
    <div className=" my-20  ">
      <Grid>
        <Paper style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <img
                src="https://wallpapercave.com/wp/wp3478342.jpg"
                alt="image"
              />
            </Avatar>
          </Grid>
          <h2 className="font-bold mt-4 text-center">LOG IN</h2>
          <TextField
            label="Username"
            placeholder="Enter username"
            fullWidth
            style={{ marginTop: '45px' }}
            onChange={(e) => setusername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            style={{ marginTop: '45px' }}
            onChange={(e) => setpassword(e.target.value)}
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
            Log in
          </Button>
        </Paper>
      </Grid>
    </div>
  )
}

export default Login
