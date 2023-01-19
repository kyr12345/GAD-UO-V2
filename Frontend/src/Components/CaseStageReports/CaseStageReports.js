import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import axios from 'axios'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ipfile from '../../ip.json'
import Paper from '@mui/material/Paper'
import { Button } from '@mui/material'
function CaseStageReports() {
  const url = `http://${ipfile.ip}:3000/api/v1/dates`
  const [fromdate, setfromdate] = useState('')

  const [todate, settodate] = useState(new Date().toLocaleDateString('en-CA'))

  const [showreports, setshowreports] = useState(false)

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

  const handleDateSearch = async (e) => {
    e.preventDefault()
    const input = {
      from: fromdate,
      to: todate,
    }
    const data = await axios.post(url, input, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    console.log(data)
  }

  return (
    <div>
      <p>Case Stage Reports</p>

      <form onSubmit={handleDateSearch} method="POST">
        <div className="flex flex-col align-items-center ">
          <div className="flex justify-around mt-8">
            <div className="flex flex-col justify-between items-start">
              <span className="font-semibold mr-4">From </span>
              <input
                type="date"
                value={fromdate}
                onChange={(e) => {
                  setfromdate(e.target.value)
                }}
                className="p-2 bg-white border-2 border-black rounded-md"
              />
            </div>

            <div className="flex flex-col justify-between items-start">
              <span className="font-semibold mr-4">To </span>

              <input
                type="date"
                value={todate.length > 0 ? todate : new Date().toISOString()}
                onChange={(e) => {
                  settodate(e.target.value)
                }}
                className="p-2 bg-white border-2 border-black rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: 'blue', color: 'white' }}
          >
            Search
          </Button>
        </div>
      </form>

      {showreports && (
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
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                ></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default CaseStageReports
