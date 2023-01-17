import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ipfile from '../../ip.json'
import axios from 'axios'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Link } from 'react-router-dom'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button } from '@material-ui/core'
import * as XLSX from 'xlsx'
function AdminReports() {
  const navigate = useNavigate()
  const [options, setoptions] = useState([''])
  const [selectedOption, setSelectedOption] = useState([])

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
  const [worksheet, setworksheet] = useState([])
  useEffect(() => {
    const CheckAndFetchUsers = async () => {
      const result = JSON.parse(window.localStorage.getItem('ROLE_NAME'))

      if (result.Role !== 'ADMIN') {
        navigate('/')
      } else {
        const requestForUsers = `http://${ipfile.ip}:3000/api/v1/getUsersAllocation`
        const data = await axios.get(requestForUsers, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        console.log(data.data.data)
        setoptions(data.data.data)
      }
    }
    CheckAndFetchUsers()
  }, [])

  const handleDownload = () => {
    const printingResponse = []

    if (files.length === 0) {
      const Entry = {
        Designation: selectedOption,
        Month: `${
          new Date().getMonth() + 1
        }/${new Date().getYear().toString().slice(1)}`,
        PreviousMonthPending: previouspending,
        NewCasesCurrentMonth: newcases,
        CaseSubmittedCurrentMonth: submitted,
        TotalCasePending: pending,
        /* Submission_Date:
          files[i].submission_date === 'Pending'
            ? 'Pending'
            : files[i].submission_date.slice(4, 15), */
      }

      printingResponse.push(Entry)
    } else {
      for (let i = 0; i < files.length; i++) {
        let accused = ''

        for (let j = 0; j < files[i].accused.length; j++) {
          accused += `${files[i].accused[j]} || `
        }

        const Entry = {
          Designation: selectedOption,
          Month: `${
            new Date().getMonth() + 1
          }/${new Date().getYear().toString().slice(1)}`,
          UO: files[i].uo,
          FILENO: files[i].fileno,
          eSarkar: files[i].esarkarno,
          Department: files[i].department,
          DEADLINE_DATE: files[i].deadline.slice(4, 15),
          Accused: accused,
          PreviousMonthPending: previouspending,
          NewCasesCurrentMonth: newcases,
          CaseSubmittedCurrentMonth: submitted,
          TotalCasePending: pending,

          /* Submission_Date:
            files[i].submission_date === 'Pending'
              ? 'Pending'
              : files[i].submission_date.slice(4, 15), */
        }
        console.log(Entry)
        printingResponse.push(Entry)

        accused = ''
      }
    }

    const worksheets = XLSX.utils.json_to_sheet(printingResponse)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheets, 'Reports')

    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
    XLSX.writeFile(workbook, `${selectedOption}.xlsx`)
  }

  const handleChange = async (e) => {
    console.log(e.target.value)
    setSelectedOption(e.target.value)
    const requestForFile = `http://${ipfile.ip}:3000/api/v1/requestFiles/${e.target.value}`
    console.log(requestForFile)
    const data = await axios.get(requestForFile, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })

    const requestForWorkSheet = `http://${ipfile.ip}:3000/api/v1/requestWorkSheet/${e.target.value}`

    const datas = await axios.get(requestForWorkSheet, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })

    setworksheet(datas.data.data)

    setfiles(data.data.response)
    setsubmitted(data.data.Submitted)
    setnewcases(data.data.AllocatedFiles)
    setpending(data.data.Pending)
    setpreviouspending(data.data.PreviousPending)
  }

  return (
    <div className="w-full h-full">
      <div className="text-center font-bold text-4xl mt-4">Admin Reports</div>
      <div className="flex flex-col items-start px-4 mt-8 w-full">
        <p className="font-bold">Select User</p>
        <select
          onChange={handleChange}
          value={selectedOption}
          className="w-full p-4 border-2 border-black bg-gray-2"
        >
          <option>Select</option>
          {options.length > 0 &&
            options.map((everyoption, i) => {
              return (
                <option key={everyoption.ID}>{everyoption.ALLOCATED}</option>
              )
            })}
        </select>
      </div>
      <div className="px-14  mt-10">
        <p className="font-bold mb-4">Status</p>
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
        <p className="font-bold mb-4">Pending</p>

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
                          <Link to={`/admin/Movements`}>
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

      {/*     <div className="flex items-start px-12 mt-8 flex-col w-full">
        <p className="font-bold mb-4">WorkSheet</p>
        <div className="w-full">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 700, height: 50 }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Sr.No</StyledTableCell>
                  <StyledTableCell align="center">UO.No</StyledTableCell>
                  <StyledTableCell align="center">File No</StyledTableCell>
                  <StyledTableCell align="center">eSarkar No</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Accused Name</StyledTableCell>
                  <StyledTableCell align="center">Deadline</StyledTableCell>
                  <StyledTableCell align="center">
                    Submission Date
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {worksheet.length > 0 ? (
                  <>
                    {worksheet.map((file, i) => {
                      return (
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
                            {file.submission_date !== 'Pending' ? (
                              <>
                                <p>{file.submission_date.slice(4, 15)}</p>
                              </>
                            ) : (
                              <>
                                <p>Pending</p>
                              </>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      )
                    })}
                  </>
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
      </div> */}
      <div className="flex justify-center w-full py-8">
        <Button
          onClick={handleDownload}
          variant="contained"
          style={{
            backgroundColor: '#1d6f42 ',
            color: 'white',
          }}
        >
          Export Excel
        </Button>
      </div>
    </div>
  )
}

export default AdminReports
