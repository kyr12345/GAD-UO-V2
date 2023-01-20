import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import axios from 'axios'
import AllFiles from '../Inward/Departments.json'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ipfile from '../../ip.json'
import Paper from '@mui/material/Paper'
/* 
import { Button } from '@material-ui/core' */
import { Button } from '@mui/material'
import * as XLSX from 'xlsx'
function CaseStageReports() {
  const url = `http://${ipfile.ip}:3000/api/v1/CaseStageReports`
  const [fromdate, setfromdate] = useState('')

  const [todate, settodate] = useState(new Date().toLocaleDateString('en-CA'))

  const [showreports, setshowreports] = useState(false)

  const [reports, setreports] = useState([])

  useEffect(() => {
    AllFiles['AllFiles'].sort()
  }, [])

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

  const handleDownload = () => {
    const printingResponse = []

    for (let i = 0; i < reports.length; i++) {
      let eachAllotment = {}

      eachAllotment['Designation'] = reports[i].Allot

      for (let j = 0; j < reports[i].stages.length; j++) {
        console.log(reports[i].stages[j].stage)
        const allotment = reports[i].stages[j].stage
        eachAllotment[allotment] = reports[i].stages[j].count
      }

      printingResponse.push(eachAllotment)
    }
    const worksheets = XLSX.utils.json_to_sheet(printingResponse)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheets, 'Reports')

    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
    XLSX.writeFile(workbook, `Reports.xlsx`)
  }

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

    if (data.data.success) {
      setshowreports(true)

      let datas = data.data.data

      if (datas.length > 0) {
        for (let j = 0; j < datas.length; j++) {
          if (datas[j].stages.length > 0) {
            for (let i = 0; i < AllFiles['AllFiles'].length; i++) {
              if (
                datas[j].stages.findIndex(
                  (entry) => entry.stage === AllFiles['AllFiles'][i],
                ) == '-1'
              ) {
                datas[j].stages.push({
                  stage: AllFiles['AllFiles'][i],
                  count: 0,
                })
              }
            }
            datas[j].stages.sort((a, b) =>
              a.stage > b.stage ? 1 : b.stage > a.stage ? -1 : 0,
            )
          } else {
            const stageUpdate = []

            for (let k = 0; k < AllFiles['AllFiles'].length; k++) {
              stageUpdate.push({
                stage: AllFiles['AllFiles'][k],
                count: 0,
              })
            }

            datas[j].stages = stageUpdate
          }
        }
      } else {
        console.log('fone')
      }
      setreports(datas)
    }
  }

  return (
    <div>
      <p className="font-bold text-xl text-center my-4">Case Stage Reports</p>

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

      {showreports && reports.length > 0 && (
        <div className="px-16 mt-8">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 700, height: 50 }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  {AllFiles['AllFiles'].length > 0 &&
                    AllFiles['AllFiles'].map((stage) => {
                      return (
                        <>
                          <StyledTableCell align="center">
                            {stage}
                          </StyledTableCell>
                        </>
                      )
                    })}
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length > 0 &&
                  reports.map((report, i) => {
                    return (
                      <StyledTableRow key={i + 1}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {report.Allot}
                        </StyledTableCell>

                        {report.stages.map((everystage) => (
                          <StyledTableCell>{everystage.count}</StyledTableCell>
                        ))}
                      </StyledTableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
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
      )}
    </div>
  )
}

export default CaseStageReports
