import React, { useState, useEffect } from 'react'
import ipfile from '../../ip.json'

import { useNavigate } from 'react-router-dom'
import './password.css'
import axios from 'axios'
function PasswordChange() {
  const [user, setuser] = useState('')
  const [changePassword, setChangePassword] = useState('')
  const [confirmchangePassword, setconfirmChangePassword] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const users = JSON.parse(window.localStorage.getItem('ROLE_NAME'))

    if (
      !users &&
      (users.username == undefined ||
        users.username == null ||
        users.length == 0)
    ) {
      navigate('/')
    } else {
      setuser(users.username)
    }
  }, [])

  const changeThePassword = async (e) => {
    e.preventDefault()
    let err = ''
    if (changePassword !== confirmchangePassword)
      alert('Both Password Must Match')
    else {
      const input = {
        changePassword,
        user,
      }

      const requestForFile = `http://${ipfile.ip}:3000/api/v1/changepassword`
      axios
        .post(requestForFile, input, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        .then((data) => {
          if (data.data.success) {
            alert('Password Updated SuccessFully')
          } else {
            alert('Password Not Updated ')
          }
        })
        .catch((err) => {
          alert(err)
        })
    }
  }

  return (
    <>
      <div className="mainDiv">
        <div className="cardStyle">
          <form
            method="POST"
            className="bg-[#000000] p-8"
            name="signupForm"
            id="signupForm"
            onSubmit={changeThePassword}
          >
            <p className="text-white text-center"> Username : {user}</p>
            <h2 className="formTitle">Change Password</h2>

            <div className="inputDiv">
              <label className="inputLabel" for="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
              />
            </div>

            <div className="inputDiv">
              <label className="inputLabel" for="confirmPassword">
                Confirm Password
              </label>
              <input
                required
                value={confirmchangePassword}
                onChange={(e) => setconfirmChangePassword(e.target.value)}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
              />
            </div>

            <div className="buttonWrapper">
              <button
                type="submit"
                id="submitButton"
                className="submitButton pure-button pure-button-primary"
              >
                <span>Continue</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default PasswordChange
