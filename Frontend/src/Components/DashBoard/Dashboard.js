import React, { useEffect, useState } from 'react'
import PhysicalRegister from '../Reports/PhysicalRegister/PhysicalRegister'
import { useParams } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import InwardNew from '../Inward/New/New'
import InwardOld from '../Inward/Old/Old'
import Movements from '../Movements/Movements'
import Cases from '../Reports/Cases/Cases'
import Register from '../Register/Register'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import image from './home.png'
import { useDispatch } from 'react-redux'

function Dashboard() {
  const dispatch = useDispatch()
  const { newform } = useParams()
  const [showpanel, setpanel] = useState(false)
  const result = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    const userdata = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
    if (userdata.username.length === 0) {
      navigate('/')
    }
  }, [])

  return (
    <div
      className="grid grid-cols-9"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div className="col-span-2 bg-[#1F2937]">
        <SideBar />
      </div>
      <div className="col-span-7   max-h-[100] bg-[#eeeeee]">
        {newform === undefined && (
          <>
            <div className="w-full h-full bg-[#ffffff]">
              <div className="h-full flex items-start  pr-36  ">
                <img src={image} />
              </div>
            </div>
          </>
        )}

        {newform && newform === 'NewInward' && (
          <>
            <InwardNew />
          </>
        )}
        {newform && newform === 'OldInward' && (
          <>
            <InwardOld />
          </>
        )}
        {newform && newform === 'Movements' && (
          <>
            <Movements />
          </>
        )}
        {newform && newform === 'Cases' && (
          <>
            <Cases />
          </>
        )}
        {newform && newform === 'PhysicalRegister' && (
          <>
            <PhysicalRegister />
          </>
        )}
        {newform && newform === 'signup' && (
          <>
            <Register />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
