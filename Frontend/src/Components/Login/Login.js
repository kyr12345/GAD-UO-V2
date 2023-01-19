import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button } from '@material-ui/core'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import emblem from '../DashBoard/home1.png'
import ipfile from '../../ip.json'

const Login = () => {
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
            console.log(result.data)
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
                Designation: result.data.userData.Designation,
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
    padding: 40,
    height: '60vh',
    width: 400,
    margin: '20px ',
    backgroundColor: '#090013',
    color: 'white',
  }
  const avatarStyle = {
    backgroundColor: '#1bbd7e',
    width: '100px',
    height: '100px',
  }
  const btnstyle = { margin: '50px 0' }
  return (
    <div className="  w-full mt-8 grid grid-cols-2 place-items-center">
      <div className="   h-full ">
        <img src={emblem} alt="sdas" className="h-full   " />
      </div>
      <div className=" my-20 grid place-items-center">
        <Grid>
          <Paper style={paperStyle}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <img
                  src="https://wallpapercave.com/wp/wp3478342.jpg"
                  alt="sds"
                />
              </Avatar>
            </Grid>
            <form onSubmit={HandleSubmit} method="POST">
              <h2 className="font-bold mb-4  text-center">LOG IN</h2>
              <div className="mt-8">
                <p>UserName</p>
                <TextField
                  placeholder="Enter username"
                  fullWidth
                  style={{
                    marginTop: '15px',
                    backgroundColor: 'white',
                    paddingLeft: '6px',
                  }}
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8">
                <p>Password</p>
                <TextField
                  placeholder="Enter password"
                  type="password"
                  fullWidth
                  style={{
                    marginTop: '15px',
                    backgroundColor: 'white',
                    paddingLeft: '6px',
                  }}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={btnstyle}
                fullWidth
              >
                Log in
              </Button>
            </form>
          </Paper>
        </Grid>
      </div>
    </div>
  )
}

export default Login
