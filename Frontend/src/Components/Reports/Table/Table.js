import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { Button } from '@material-ui/core'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import * as XLSX from 'xlsx'

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.FileDetails.UO}
        </TableCell>
        <TableCell align="center">{row.FileDetails.fileno}</TableCell>
        <TableCell align="center">{row.FileDetails.eSarkar}</TableCell>
        <TableCell align="center">{row.FileDetails.Department}</TableCell>
        <TableCell align="center">{row.FileDetails.Sub}</TableCell>
        <TableCell align="center">
          <ol>
            {row.Accused &&
              row.Accused.map((accused) => {
                return (
                  <>
                    <li> {accused.CUC === 'Yes' && <>{accused.NAME}</>} </li>
                  </>
                )
              })}
          </ol>
        </TableCell>
        <TableCell align="center">{row.FileDetails.Stage}</TableCell>
        <TableCell align="center">
          {row.FileDetails.DEADLINE &&
          row.FileDetails.DEADLINE.slice(0, 4) == 9999
            ? '-----'
            : row.FileDetails.DEADLINE.slice(0, 10)}{' '}
        </TableCell>
        <TableCell align="center" style={{ width: '200px' }}>
          <ol>
            {row.Movements &&
              row.Movements.map((historyRow) => {
                return (
                  <>
                    <li>
                      {' '}
                      {historyRow.MOVTO} ({historyRow.MOVTDATE.slice(4, 16)})
                    </li>
                  </>
                )
              })}
          </ol>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Accused
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {/*  <TableCell>AID</TableCell>
                    <TableCell>DID</TableCell> */}
                    <TableCell align="center">SATHI</TableCell>
                    <TableCell align="center">NAME</TableCell>
                    <TableCell align="center">DOR</TableCell>
                    <TableCell align="center">DESIGNATION</TableCell>
                    <TableCell align="center">CUC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Accused.length > 0 &&
                    row.Accused.map((historyRow) => (
                      <TableRow key={historyRow.DID}>
                        {/*                <TableCell component="th" scope="row">
                          {historyRow.AID}
                        </TableCell>
                        <TableCell>{historyRow.DID}</TableCell> */}
                        <TableCell align="center">{historyRow.SATHI}</TableCell>
                        <TableCell align="center">{historyRow.NAME}</TableCell>
                        <TableCell align="center">{historyRow.DOR}</TableCell>
                        <TableCell align="center">
                          {historyRow.DESIGNATION}
                        </TableCell>
                        <TableCell align="center">{historyRow.CUC}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Movements
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>MOVTDATE</TableCell>
                    <TableCell align="center">MOVTO</TableCell>
                    <TableCell align="center">REMARKS</TableCell>
                    <TableCell align="center">UO</TableCell>
                    <TableCell align="center">DATE_TIME</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row &&
                    row.Movements.map((historyRow) => (
                      <TableRow key={historyRow.MID}>
                        <TableCell>
                          {historyRow.MOVTDATE.slice(4, 15)}
                        </TableCell>
                        <TableCell align="center">{historyRow.MOVTO}</TableCell>
                        <TableCell align="center">
                          {historyRow.Remarks}
                        </TableCell>
                        <TableCell align="center">{historyRow.UO}</TableCell>
                        <TableCell align="center">
                          {historyRow.date_time.slice(4, 15)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function CollapsibleTable({ data }) {
  const handleDownload = () => {
    const printingResponse = []

    for (let i = 0; i < data.length; i++) {
      let movements = ''
      let accused = ''
      for (let j = 0; j < data[i].Movements.length; j++) {
        if (j == 0) {
          movements += `${data[i].Movements[j].MOVTO} (${data[i].Movements[
            j
          ].MOVTDATE.slice(4, 15)})`
        } else {
          movements += `|| ${data[i].Movements[j].MOVTO} (${data[i].Movements[
            j
          ].MOVTDATE.slice(4, 15)})`
        }
      }

      for (let j = 0; j < data[i].Accused.length; j++) {
        if (data[i].Accused[j].CUC == 'Yes' && j == 0) {
          accused += `${data[i].Accused[j].NAME}`
        } else if (data[i].Accused[j].CUC == 'Yes') {
          accused += ` || ${data[i].Accused[j].NAME} `
        }
        /*  
      else if (data[i].Accused[j].CUC == 'No' && j == 0) {
          accused += `-------`
        } else {
          accused += '||  ----  '
        } */
      }

      const Entry = {
        UO: data[i].FileDetails.UO,
        FILENO: data[i].FileDetails.fileno,
        eSarkar: data[i].FileDetails.eSarkar,
        Department: data[i].FileDetails.Department,
        Subject: data[i].FileDetails.Sub,
        CaseStage: data[i].FileDetails.Stage,
        DEADLINE_DATE:
          data[i].FileDetails.DEADLINE.slice(11, 16) == 9999
            ? '----'
            : data[i].FileDetails.DEADLINE.slice(4, 16),
        Movements: movements,
        Accused: accused,
      }
      printingResponse.push(Entry)
      movements = ''
      accused = ''
    }
    console.log(printingResponse)
    const worksheet = XLSX.utils.json_to_sheet(printingResponse)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports')

    let buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
    XLSX.writeFile(workbook, 'Reports.xlsx')
  }

  return (
    <>
      <TableContainer component={Paper} id="pdfdiv">
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>UO NO</TableCell>
              <TableCell align="center">File No</TableCell>
              <TableCell align="center">Esarkar</TableCell>
              <TableCell align="center">Department</TableCell>
              <TableCell align="center">Subject</TableCell>
              <TableCell align="center">Accused</TableCell>
              <TableCell align="center">Case Stage</TableCell>
              <TableCell align="center">Deadline Date</TableCell>
              <TableCell align="center">Movements</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 &&
              data.map((row, index) => <Row key={index} row={row} />)}
          </TableBody>
        </Table>
        <div className="flex justify-center py-8">
          <Button
            onClick={handleDownload}
            variant="contained"
            style={{ backgroundColor: '#1d6f42 ', color: 'white' }}
          >
            Export Excel
          </Button>
        </div>
      </TableContainer>
    </>
  )
}
