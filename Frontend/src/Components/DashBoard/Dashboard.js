import React, { useEffect, useState } from 'react'
import PhysicalRegister from '../Reports/PhysicalRegister/PhysicalRegister'
import { useParams } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import InwardNew from '../Inward/New/New'
import InwardOld from '../Inward/Old/Old'
import Files from '../Files/Files'
import Movements from '../Movements/Movements'
import Cases from '../Reports/Cases/Cases'
import Register from '../Register/Register'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ReportUser from '../ReportUser/ReportUser'
import CaseStageReports from '../CaseStageReports/CaseStageReports'
import AdminReports from '../AdminReports/AdminReports'
import PasswordChange from '../PasswordChange/PasswordChange'
function Dashboard() {
  const dispatch = useDispatch()
  const { newform } = useParams()

  const [showpanel, setpanel] = useState(false)
  const result = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    let userdata = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
    console.log(userdata)
    if (userdata.length == '0' || userdata.username.length === 0) {
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
            <Files />
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
        {newform && newform === 'reports' && (
          <>
            <ReportUser />
          </>
        )}
        {newform && newform === 'reportsForAdmin' && (
          <>
            <AdminReports />
          </>
        )}
        {newform && newform === 'caseStageReports' && (
          <>
            <CaseStageReports />
          </>
        )}
        {newform && newform === 'changepassword' && (
          <>
            <PasswordChange />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
