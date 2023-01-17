import React, { useState } from 'react'
import JSONfile from '../../Inward/Departments.json'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import Table from '../Table/Table'
import ipfile from '../../../ip.json'
function Cases() {
  const [values, setvalues] = useState('')

  const [showsearchtable, setshowsearchtable] = useState(false)
  const [department, setdepartments] = useState('Any')

  const [resultsearch, setsearch] = useState([])

  const handleSearch = async (event) => {
    event.preventDefault()
    const url = `http://${ipfile.ip}:3000/api/v1/caseInfo`
    console.log(department, values)
    const result = await axios.post(
      url,
      { value: values, department },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      },
    )
    console.log(result)

    if (result.data.success) {
      setshowsearchtable(true)
      setsearch(result.data.msg)
    } else {
      alert(result.data.msg)
      setshowsearchtable(false)
    }
  }

  const handleChange = (event) => {
    setdepartments(event.target.value)
  }
  return (
    <>
      <h1 className="font-bold text-2xl text-center mt-16 mb-4">Case Search</h1>

      <form onSubmit={handleSearch} method="POST" className=" pr-4 w-full">
        <div className="mb-6 ml-4 ">
          <h4 className="font-bold text-xl">Department </h4>
          <select
            id="outlined-select-currency"
            select
            value={department}
            onChange={handleChange}
            className="w-full py-4 px-2 rounded-xl bg-white overflow-y-wrap"
            placeholder="Select Department"
          >
            {JSONfile['departments'].map((option) => (
              <option key={option.ID} value={option.Department}>
                {option.Department}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-4 rounded-xl">
          <TextField
            onChange={(e) => {
              setvalues(e.target.value)
              setshowsearchtable(false)
            }}
            value={values}
            required
            sx={{ borderRadius: '10px' }}
            className="w-full  bg-white"
            label="Search (UO Number/Name/Subject/SATHI/eSarkar No)"
          />
        </div>
        <div className="flex justify-center my-4">
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: 'blue', color: 'white' }}
            endIcon={<SendIcon />}
          >
            Search
          </Button>
        </div>
      </form>

      {showsearchtable && (
        <>
          <Table data={resultsearch} />
        </>
      )}
    </>
  )
}

export default Cases
