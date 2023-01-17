import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import ipfile from '../../ip.json'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Link } from 'react-router-dom'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
function Files() {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1F2937',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  const [files, setfiles] = useState([])
  const [newcases, setnewcases] = useState('')
  const [submitted, setsubmitted] = useState('')
  const [pending, setpending] = useState('')
  const [previouspending, setpreviouspending] = useState('')

  const handleUpdate = (uo) => {
    window.localStorage.setItem(
      'UO',
      JSON.stringify({
        UO: uo,
      }),
    )
  }

  const navigate = useNavigate()
  useEffect(() => {
    const CheckAndFetch = async () => {
      let userdata = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
      if (userdata.username.length === 0) {
        navigate('/')
      } else {
        const requestForFile = `http://${ipfile.ip}:3000/api/v1/requestFiles/${userdata.Designation}`

        const data = await axios.get(requestForFile, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        console.log(data.data)

        setfiles(data.data.response)
        setsubmitted(data.data.Submitted)
        setnewcases(data.data.AllocatedFiles)
        setpending(data.data.Pending)
        setpreviouspending(data.data.PreviousPending)
      }
    }
    CheckAndFetch()
  }, [])

  return (
    <div className="flex flex-col  h-full w-full ">
      <div className="px-14 mt-10">
        <p className="font-bold">Status</p>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700, height: 50 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  Previous Month Pending
                </StyledTableCell>
                <StyledTableCell align="center">
                  New Cases Recieved
                </StyledTableCell>
                <StyledTableCell align="center">
                  Submitted Cases This Month
                </StyledTableCell>
                <StyledTableCell align="center">
                  Currently Pending Cases
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow key="one">
                <StyledTableCell component="th" scope="row" align="center">
                  {previouspending}
                </StyledTableCell>
                <StyledTableCell align="center">{newcases}</StyledTableCell>
                <StyledTableCell align="center">{submitted}</StyledTableCell>
                <StyledTableCell align="center">{pending}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex flex-col mt-24 px-14 items-start">
        <p className="font-bold mb-8">Pending</p>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr.No</StyledTableCell>
                <StyledTableCell align="center">UO.No</StyledTableCell>
                <StyledTableCell align="center">File No</StyledTableCell>
                <StyledTableCell align="center">eSarkar No</StyledTableCell>
                <StyledTableCell align="center">Department</StyledTableCell>
                <StyledTableCell align="center">Accused Name</StyledTableCell>
                <StyledTableCell align="center">Deadline</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.length > 0 ? (
                files.map((file, i) => {
                  return (
                    <>
                      <StyledTableRow key={i + 1}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {i + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {file.uo}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {file.fileno}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {file.esarkarno}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {file.department}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <ul>
                            {file.accused.length > 0 &&
                              file.accused.map((accused) => {
                                return <li>{accused}</li>
                              })}
                          </ul>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {file.deadline.slice(4, 15)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Link to={`Movements`}>
                            <button
                              className="bg-[#1F2937] text-white p-2 rounded-xl"
                              onClick={() => {
                                window.localStorage.setItem('UO', file.uo)
                              }}
                            >
                              Update
                            </button>
                          </Link>
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  )
                })
              ) : (
                <>
                  <StyledTableRow>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center">
                      No Files Allocated
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Files
