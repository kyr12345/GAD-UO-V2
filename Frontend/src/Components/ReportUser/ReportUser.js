import React, { useEffect, useState } from 'react'
import ipfile from '../../ip.json'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from '@material-ui/core'
import * as XLSX from 'xlsx'
function ReportUser() {
  const [worksheet, setworksheet] = useState([])
  const navigate = useNavigate()
  let userdata = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
  useEffect(() => {
    const CheckAndFetchWorkSheet = async () => {
      if (userdata.username.length === 0) {
        navigate('/')
      } else {
        const requestForWorkSheet = `http://${ipfile.ip}:3000/api/v1/requestWorkSheet/${userdata.Designation}`

        const data = await axios.get(requestForWorkSheet, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        console.log(data.data)
        setworksheet(data.data.data)
      }
    }
    CheckAndFetchWorkSheet()
  }, [navigate, userdata.Designation, userdata.username.length])

  const handleDownload = () => {
    const printingResponse = []

    for (let i = 0; i < worksheet.length; i++) {
      let accused = ''

      for (let j = 0; j < worksheet[i].accused.length; j++) {
        accused += `${worksheet[i].accused[j]} || `
      }

      const Entry = {
        UO: worksheet[i].uo,
        FILENO: worksheet[i].fileno,
        eSarkar: worksheet[i].esarkarno,
        Department: worksheet[i].department,
        DEADLINE_DATE: worksheet[i].deadline.slice(4, 15),
        Accused: accused,
        Submission_Date:
          worksheet[i].submission_date === 'Pending'
            ? 'Pending'
            : worksheet[i].submission_date.slice(4, 15),
      }
      console.log(Entry)
      printingResponse.push(Entry)

      accused = ''
    }

    const worksheets = XLSX.utils.json_to_sheet(printingResponse)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheets, 'Reports')

    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
    XLSX.writeFile(workbook, `${userdata.username}/Worksheet.xlsx`)
  }

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
  return (
    <div>
      <div className="text-center font-bold text-4xl py-4">Reports </div>
      <div className="flex items-start px-8 mt-8 flex-col w-full">
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
                  <StyledTableCell align="center"> Case Stage</StyledTableCell>
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
                                  return (
                                    <>
                                      <li>{accused}</li>
                                      ----------
                                    </>
                                  )
                                })}
                            </ul>
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {file.casestage}
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
                    <StyledTableRow>
                      <StyledTableCell align="center"></StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                      <StyledTableCell align="center">
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
                      </StyledTableCell>
                    </StyledTableRow>
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
      </div>
    </div>
  )
}

export default ReportUser
