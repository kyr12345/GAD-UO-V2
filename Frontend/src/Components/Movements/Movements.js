import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import JSONfile from '../Inward/Departments.json'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Old from '../Inward/Old/Old'
import ipfile from '../../ip.json'
function Movements() {
  /* const result = useSelector((state) => state.user.currentUser) */
  const result = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
  const UONUMBER = window.localStorage.getItem('UO')

  const [UO, SETUO] = useState('')
  const [esarkarno, setesarkarno] = useState('')
  const [showold, setshowold] = useState(false)
  const [showmovement, setmovement] = useState(false)
  const [shownewmovement, setnewmovement] = useState(false)
  const [MovementEntry, setMovementEntry] = useState([])
  const [newmovement, setselectmovement] = useState('')
  const [newmovementdate, setnewmovementdate] = useState(
    new Date().toISOString().substr(0, 10),
  )
  const [remarks, setremarks] = useState('')
  const [FileEntry, setFileEntry] = useState({})
  const [user, setuser] = useState('')
  const request = `http://${ipfile.ip}:3000/api/v1/movement`

  useEffect(() => {
    if (result) {
      setuser(result.username)
    }
    if (UONUMBER.length > 0) {
      SETUO(UONUMBER)

      const handler = document.getElementById('buttonSubmit')

      setTimeout(() => {
        window.localStorage.setItem('UO', '')
        handler.click()
      }, 100)
    }
  }, [result, newmovementdate])

  const handleMovement = async (event) => {
    event.preventDefault()
    const MovementEntryLength = MovementEntry.length
    const inputs = {
      UO: UO.length > 0 ? UO : FileEntry.UO,
      newmovement,
      newmovementdate,
      remarks,
      fileid: FileEntry.FID,
      user,
      designation: MovementEntry[MovementEntryLength - 1].MOVTO,
    }
    let err = ''
    if (newmovement.length === 0) {
      err += 'Select The New Movement'
    }

    if (err.length > 0) {
      alert(err)
    } else {
      const result = await axios.post(
        `http://${ipfile.ip}:3000/api/v1/newmovement`,
        inputs,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      )

      if (result.data.success) {
        alert('Movements Added')
        handleMovementTable(event)
        setshowold(true)
        setremarks('')
        setselectmovement('')
        setnewmovement(false)

        console.log(result)
      } else {
        alert(result.data.msg)
      }
    }
  }

  const handleMovementTable = async (event) => {
    event.preventDefault()
    let input = {}
    let err = ''
    if (esarkarno.length === 0) {
      input = {
        search: UO,
        state: 1,
      }
    } else {
      input = {
        search: esarkarno,
        state: 2,
      }
    }

    if (err.length === 0) {
      const result = await axios.post(request, input, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      console.log(result)
      if (!result.data.success) {
        setmovement(false)
        alert(result.data.msg)
      } else {
        setMovementEntry(result.data.Movement)
        setFileEntry(result.data.File)
        setmovement(true)
      }
    } else {
      alert(err)
    }
  }

  const handleNewMovement = (event) => {
    setnewmovement(!shownewmovement)
  }

  return (
    <>
      <h1 className="text-center font-bold text-2xl mt-16">MOVEMENTS</h1>
      <form onSubmit={handleMovementTable} method="GET">
        <div className="flex flex-col px-8 py-8 align-items-center justify-center">
          <h4 className="font-bold">Enter UO Number:</h4>
          <TextField
            onChange={(e) => {
              setesarkarno('')
              SETUO(e.target.value)
              setmovement(false)
              setnewmovement(false)
            }}
            value={UO}
            required
            className="w-full bg-white border-2 "
            placeholder="Enter  UO Number"
          />
        </div>
        <h2 className="text-center font-bold">OR</h2>
        <div className="flex flex-col px-8 py-8 align-items-center justify-center">
          <h4 className="font-bold">Enter eSarkarno Number:</h4>
          <TextField
            onChange={(e) => {
              setesarkarno(e.target.value)
              SETUO('')
              setmovement(false)
              setnewmovement(false)
            }}
            value={esarkarno}
            required
            className="w-full bg-white border-2 "
            placeholder="Enter  eSarkarno Number"
          />
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleMovementTable}
            variant="contained"
            sx={{ backgroundColor: 'blue', color: 'white' }}
            endIcon={<SendIcon />}
            id="buttonSubmit"
          >
            Submit
          </Button>
        </div>
      </form>
      {/* Old */}
      {showmovement && (
        <Old
          show={false}
          uonumber={
            UO.length > 0 ? UO : FileEntry.UO.length > 0 ? FileEntry.UO : ''
          }
          secondbtn={false}
          heading="View Inward"
          showAccused={false}
          form={true}
        />
      )}

      {/* PREVIOUS MOVEMENT TABLE */}

      {showmovement && (
        <>
          <div className="text-center font-bold text-xl mt-10">
            Previous Movement Table
          </div>
          <div className="flex flex-col">
            <div className="mt-6 text-xl text-center">
              <span className="font-bold text-xl ">FILE NO:</span>{' '}
              {FileEntry.fileno}({FileEntry.eSarkar})
            </div>
            <div className="overflow-x-auto ">
              <div className="py-4 inline-block w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-center">
                    <thead className="border-b bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          MOVEMENT DATE
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          MOVE TO
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MovementEntry &&
                        MovementEntry.map((movement) => {
                          return (
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {movement.MOVTDATE.slice(4, 15)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {movement.MOVTO}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {movement.Remarks}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {shownewmovement && (
        <>
          <form onSubmit={handleMovement} method="POST">
            <div className="grid lg:grid-cols-3 place-items-center grid-cols-1 border-2 py-6 mx-2 mt-4">
              <div className="mt-6 ">
                <div className="font-bold">New Movement To</div>
                <select
                  className="border-2 rounded-xl p-2 mt-2 bg-white"
                  value={newmovement}
                  onChange={(event) => setselectmovement(event.target.value)}
                >
                  <option>Select</option>
                  {JSONfile['movements'].map((move) => {
                    return (
                      <option value={move.name} key={move.id}>
                        {move.name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <div className="font-bold my-4">Select The Movement Date</div>
                <input
                  type="date"
                  className="border-2 rounded-xl p-2"
                  placeholder="Select The Movement Date"
                  value={newmovementdate}
                  onChange={(e) => setnewmovementdate(e.target.value)}
                />
              </div>
              <div>
                <div className="font-bold my-4">Enter The Remarks</div>
                <input
                  type="text"
                  className="border-2 text-center rounded-xl p-2"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setremarks(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: 'blue', color: 'white' }}
                endIcon={<SendIcon />}
              >
                Submit
              </Button>
            </div>
          </form>
        </>
      )}
      {showmovement && (
        <div className="flex justify-center my-8">
          <Button
            onClick={handleNewMovement}
            variant="contained"
            sx={{ backgroundColor: 'blue', color: 'white' }}
            endIcon={<SendIcon />}
          >
            New Movement
          </Button>
        </div>
      )}
    </>
  )
}

export default Movements
