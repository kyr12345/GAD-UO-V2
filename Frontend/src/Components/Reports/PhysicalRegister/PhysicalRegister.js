import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import axios from 'axios'
import ipfile from '../../../ip.json'
import Table from '../Table/Table'
function PhysicalRegister() {
  const [fromdate, setfromdate] = useState('')
  const [todate, settodate] = useState(new Date().toLocaleDateString('en-CA'))

  const [showdatetable, setshowdatetable] = useState(false)
  const [resultdate, setresultdate] = useState([])

  const handleDateSearch = async (event) => {
    event.preventDefault()
    const url = `http://${ipfile.ip}:3000/api/v1/dates`
    const inputs = {
      from: fromdate,
      to: todate,
    }
    const result = await axios.post(url, inputs, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    if (result.data.success) {
      setshowdatetable(true)
      setresultdate(result.data.msg)
      console.log(result)
    } else {
      setshowdatetable(false)
      alert(result.data.msg)
    }
  }

  return (
    <div>
      {/* Physical Register */}

      <h1 className="font-bold text-center mb-4 mt-8 text-2xl">
        Physical Register:
      </h1>
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
                  setshowdatetable(false)
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
                  setshowdatetable(false)
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
      {showdatetable && (
        <>
          <Table data={resultdate} />
        </>
      )}
    </div>
  )
}

export default PhysicalRegister
