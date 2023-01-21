import React, { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import ipfile from '../../../ip.json'
import TextField from '@mui/material/TextField'
import JSONfile from '../Departments.json'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import { useSelector } from 'react-redux'
import MenuItem from '@mui/material/MenuItem'
import TextareaAutosize from '@mui/base/TextareaAutosize'

import axios from 'axios'
function InwardOld({
  uonumber = '',
  show = true,
  showAccused = true,
  secondbtn = true,
  heading = 'Submit',
}) {
  /*   const result = useSelector((state) => state.user.currentUser) */
  const result = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
  const [UO, SETUO] = useState('')
  const [esarkar, setesarkar] = useState('')
  if (uonumber === '') uonumber = UO
  const request = `http://${ipfile.ip}:3000/api/v1/getFromUO`
  const UpdateRequest = `http://${ipfile.ip}:3000/api/v1/Update`
  const [Other, SetOther] = useState('')
  const [position, setposition] = useState(false)
  const [showalert, setalert] = useState(false)
  const [filedetails, setfiledetails] = useState({})
  const [accuseddetails, setaccusedDetails] = useState([])
  const [Attachment, setAttachment] = useState('')
  const [showalertContent, setalertContent] = useState('')
  const [department, setdepartments] = useState('')
  const [fileno, setfileno] = useState('')
  const [esarkarno, setesarkarno] = useState('')
  const [user, setuser] = useState('')
  const [subject, setsubject] = useState('')
  const [filetype, setfiletype] = useState('')
  const [CaseStage, setCaseStage] = useState('')
  const [Allotment, setAllotment] = useState('')
  const [date, setDate] = useState('')
  const [fields, setFields] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()

    let input = {}

    if (esarkarno.length === 0) {
      input = {
        search: UO.trim(),
        state: 1,
      }
    } else {
      input = {
        search: esarkar.trim(),
        state: 2,
      }
    }

    axios
      .post(request, input, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then((result) => {
        console.log(result)
        if (result.data.success) {
          console.log(result)
          if (result.data.Data.Accused_Details) {
            const values = [...fields]

            const n = result.data.Data.Accused_Details.length

            for (let i = 0; i < n; i++) {
              if (result.data.Data.Accused_Details[i].CUC === 'Yes') {
                delete result.data.Data.Accused_Details[i].CUC
                result.data.Data.Accused_Details[i].Consideration = true
              } else {
                delete result.data.Data.Accused_Details[i].CUC
                result.data.Data.Accused_Details[i].Consideration = false
              }

              values.push(result.data.Data.Accused_Details[i])
            }
            console.log(values)
            setFields(values)
          }
          setfiledetails(result.data.Data.FileDetails)
          setesarkarno(result.data.Data.FileDetails.eSarkar)
          setfileno(result.data.Data.FileDetails.fileno)
          setdepartments(result.data.Data.FileDetails.Department)
          setsubject(result.data.Data.FileDetails.Sub)
          setfiletype(result.data.Data.FileDetails.FType)
          setCaseStage(result.data.Data.FileDetails.Stage)
          setAllotment(result.data.Data.FileDetails.Allot)
          setAttachment(result.data.Data.FileDetails.ATTACHMENT)
          setposition(true)
        } else {
          alert(result.data.msg)
        }
      })
      .catch((err) => {
        alert(err)
      })
  }

  useEffect(() => {
    if (result) {
      setuser(result.username)
    }
  }, [result, CaseStage])

  const handleChangeInput = (i, event) => {
    const values = [...fields]
    const { name, value } = event.target
    console.log(value)
    if (name === 'Consideration') {
      values[i][name] = !values[i][name]
    } else {
      values[i][name] = value
    }

    setFields(values)

    console.log(fields)
  }

  const handleAddInput = () => {
    const values = [...fields]
    values.push({
      NAME: '',
      DESIGNATION: '',
      CLASS: '',
      DOR: '',
      SATHI: '',
      /*  CPF: '', */
      Consideration: false,
    })
    setFields(values)
  }

  const handleRemoveInput = (i) => {
    const values = [...fields]
    console.log(values)
    values.splice(i, 1)
    setFields(values)
  }
  let err = ''
  const handleUpdateForm = (e) => {
    e.preventDefault()
    const inputs = {
      fileno,
      esarkarno,
      department,
      subject,
      filetype,
      Attachment,
      CaseStage,
      Allotment,
      date,
      user,
      Other,
      fileid: filedetails.FID,
      fields,
    }
    console.log(inputs)
    if (subject.length === 0) {
      err += 'Enter Subject\n'
    }
    if (CaseStage === 'Other') {
      if (Other.length === 0) {
        err += 'Entry Other Value\n'
      }
    }

    if (CaseStage.length === 0) {
      err += 'Select Case Stage\n'
    }
    if (fields.length > 0) {
      console.log(fields)
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].NAME.length === 0)
          err += `Enter The Name of Accused In ${i + 1} Entry\n`
        if (fields[i].DESIGNATION.length === 0)
          err += `Enter The Designation of Accused In ${i + 1} Entry\n`
        if (fields[i].CLASS.length === 0)
          err += `Select The Class of Accused In ${i + 1} Entry\n`
        if (fields[i].DOR.length === 0)
          err += `Select The DOR of Accused In ${i + 1} Entry\n`
      }
      console.log(err)
    }
    if (err.length !== 0) {
      alert(err)
    } else {
      axios
        .post(UpdateRequest, inputs, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        .then((result) => {
          console.log(result)
          if (result.data.success) {
            setposition(false)
            SETUO('')
            setalert(true)
            setalertContent(
              `The New UO number for the file is  ${result.data.UO} `,
            )
          } else {
            alert(result.data)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  useEffect(() => {
    setTimeout(() => {
      if (showalert) {
        setalert(false)
      }
    }, 10000)
  }, [showalert])
  const handleCaseStage = (event) => {
    setCaseStage(event.target.value)
  }
  return (
    <>
      {show && (
        <>
          <h3 className="text-2xl text-center font-bold">Inward</h3>
          <h3 className="text-2xl font-bold text-center mt-8">Old Case Form</h3>
        </>
      )}

      <form onSubmit={handleSubmit} method="GET">
        {show && (
          <>
            <div className="flex flex-col mt-4 px-4 align-items-center justify-center">
              <h4 className="font-bold">Enter The UO Number:</h4>
              <TextField
                onChange={(e) => {
                  SETUO(e.target.value)
                  setFields([])
                  setposition(false)
                  setesarkar('')
                }}
                value={UO}
                className="w-full bg-white"
                placeholder="Enter The UO Number"
              />
            </div>
            <div className="flex flex-col mt-4 px-4 align-items-center justify-center">
              <h4 className="font-bold">Enter eSarkar Number:</h4>
              <TextField
                onChange={(e) => {
                  setesarkar(e.target.value)
                  setFields([])
                  SETUO('')
                  setposition(false)
                }}
                value={esarkar}
                className="w-full bg-white"
                placeholder="Enter The eSarkar Number"
              />
            </div>
          </>
        )}

        <div className="flex justify-center mt-4">
          <Button type="submit" color="primary" variant="contained">
            {heading}
          </Button>
        </div>
      </form>

      {showalert && (
        <Alert
          sx={{
            width: '100%',
            backgroundColor: '#2B3338',
            color: 'white',
          }}
        >
          {showalertContent}
        </Alert>
      )}
      {position && (
        <>
          <div className="flex flex-col justify-around mt-4 align-items-center">
            <form>
              <div className="px-14">
                <div className="flex justify-between mt-8 items-center ">
                  <div className="flex flex-col align-items-center justify-center">
                    <h4 className="font-bold text-xl">File No</h4>
                    <TextField
                      onChange={(e) => {
                        setfileno(e.target.value)
                      }}
                      value={fileno}
                      id="outlined-required"
                      placeholder="File No"
                      className="bg-gray-200"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <h4 className="font-bold text-xl">eSarkar No</h4>
                    <TextField
                      onChange={(e) => setesarkarno(e.target.value)}
                      value={esarkarno}
                      id="outlined-required"
                      placeholder="eSarkar No"
                      disabled
                      className="bg-gray-200"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">Department </h4>
                    <TextField
                      id="outlined-select-currency"
                      select
                      placeholder="Select"
                      value={department}
                      disabled
                      className="w-full bg-gray-200"
                    >
                      {JSONfile['departments'].map((option) => {
                        if (option.ID !== 'item1') {
                          return (
                            <MenuItem key={option.ID} value={option.Department}>
                              {option.Department}
                            </MenuItem>
                          )
                        }
                      })}
                    </TextField>
                  </div>
                </div>

                <div className="flex justify-center border-2 mt-8 items-center">
                  <div className="w-full">
                    <h4 className="font-bold text-xl">Subject</h4>
                    <TextareaAutosize
                      className="w-full bg-white p-4"
                      style={{
                        //backgroundColor: '#F0F4F8',
                        border: '2px solid gray',
                      }}
                      onChange={(e) => setsubject(e.target.value)}
                      minRows="5"
                      value={subject}
                      id="outlined-required"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div className="flex  items-center mb-8 justify-between">
                  <div>
                    <h4 className="font-bold text-xl">File Type</h4>
                    <TextField
                      id="outlined-select-currency"
                      select
                      placeholder="Select"
                      value={filetype}
                      className="w-full bg-gray-200"
                      disabled
                    >
                      {JSONfile['file'].map((element) => {
                        return (
                          <MenuItem key={element.id} value={element.name}>
                            {element.name}
                          </MenuItem>
                        )
                      })}
                    </TextField>
                  </div>
                  <div className="my-4">
                    <h4 className="font-bold text-xl">Case Stage</h4>
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-full bg-white">
                        {filetype === '' && (
                          <>
                            <TextField
                              id="outlined-select-currency"
                              select
                              label="Case Stage"
                              className="w-full"
                              value={CaseStage}
                              onChange={handleCaseStage}
                              helperText="First Select File Type"
                            ></TextField>
                          </>
                        )}
                        {filetype && filetype === 'Suspension' && (
                          <>
                            <TextField
                              id="outlined-select-currency"
                              select
                              //label="Select"
                              className="w-full"
                              value={CaseStage}
                              onChange={handleCaseStage}
                            >
                              {JSONfile['Suspension'].map((element) => {
                                return (
                                  <MenuItem key="10" value={element}>
                                    {element}
                                  </MenuItem>
                                )
                              })}
                            </TextField>
                          </>
                        )}
                        {filetype && filetype === 'Prosecution' && (
                          <>
                            <TextField
                              id="outlined-select-currency"
                              select
                              //label="Select"
                              className="w-full"
                              value={CaseStage}
                              onChange={handleCaseStage}
                            >
                              <MenuItem key="7" value="Approval of Prosecution">
                                Approval of Prosecution
                              </MenuItem>

                              <MenuItem key="8" value="Other">
                                Other
                              </MenuItem>
                            </TextField>
                          </>
                        )}
                        {filetype && filetype === 'Department Inquiry' && (
                          <>
                            <TextField
                              id="outlined-select-currency"
                              select
                              className="w-full"
                              //label="Select"
                              value={CaseStage}
                              onChange={handleCaseStage}
                            >
                              {JSONfile['DepartmentInquiry'].map((member) => {
                                return (
                                  <MenuItem key="9" value={member}>
                                    {member}
                                  </MenuItem>
                                )
                              })}
                            </TextField>
                          </>
                        )}
                      </div>

                      {CaseStage && CaseStage === 'Other' && (
                        <div className="w-full mt-4">
                          <TextField
                            onChange={(e) => {
                              SetOther(e.target.value)
                              console.log(Other)
                            }}
                            style={{ width: 'auto' }}
                            value={Other}
                            required
                            id="outlined-required"
                            label="Enter Case Stage"
                            className="bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <h4 className="font-bold text-xl">Deadline Date</h4>
                    <input
                      className="border-2 text-black  border-gray-400 p-4 rounded-xl "
                      type="date"
                      name="deadline_date"
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value)
                      }}
                      id="deadline"
                    />
                  </div>
                </div>

                <div className="flex  justify-around items-center  text-xl">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-center ">Alloted To </h3>
                    <div className="flex items-center justify-center w-full">
                      <div className="mr-5">
                        <input
                          id="outlined-select-currency"
                          className="w-full  text-center  p-4 rounded-xl border-2  bg-gray-200 border-black"
                          value={filedetails.Allot}
                          placeholder="Select Case Stage"
                          type="text"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-center w-full">
                      Attachments{' '}
                    </h3>
                    <TextField
                      onChange={(e) => {
                        setAttachment(e.target.value)
                      }}
                      style={{
                        marginTop: '3px',
                        padding: '2px',
                        borderRadius: '10%',
                      }}
                      placeholder="Attachment"
                      value={Attachment}
                      required
                      id="outlined-required"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {showAccused && (
                <>
                  <div className="mb-4 mt-4  ">
                    <p className="font-bold text-center text-xl mt-4">
                      Accused
                    </p>
                    {fields.length > 0 &&
                      fields.map((input, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className="maindiv grid grid-cols-6 place-items-center  mt-4  px-4"
                            >
                              {JSONfile['accused'].map((name) => {
                                return (
                                  <div className="form-group flex flex-col align-items-center justify-center">
                                    <div className="font-bold">{name}</div>
                                    {name === 'Name' && (
                                      <>
                                        <TextField
                                          required
                                          sx={{
                                            border: '2px',
                                            borderRadius: '10px',
                                          }}
                                          className="bg-white"
                                          type="text"
                                          name="NAME"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          placeholder="Name"
                                          id="Name"
                                          value={input.NAME}
                                        />
                                      </>
                                    )}

                                    {name === 'Designation' && (
                                      <>
                                        <TextField
                                          required
                                          className="border-2 w-40 border-gray-400 rounded-xl text-center bg-white"
                                          type="text"
                                          name="DESIGNATION"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          placeholder="Designation"
                                          id="Designation"
                                          value={input.DESIGNATION}
                                        />
                                      </>
                                    )}

                                    {name === 'Class' && (
                                      <>
                                        <select
                                          name="CLASS"
                                          className="border-2 border-gray-400 p-4 w-40 text-center bg-white"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          value={input.CLASS}
                                        >
                                          <option>Select</option>
                                          <option>1</option>
                                          <option>2</option>
                                          <option>3</option>
                                          <option>4</option>
                                        </select>
                                      </>
                                    )}
                                    {name === 'DOR' && (
                                      <>
                                        <input
                                          required
                                          className="border-2 p-4 border-gray-400 "
                                          type="date"
                                          name="DOR"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          value={input.DOR}
                                          id="DOR"
                                        />
                                      </>
                                    )}

                                    {name === 'SATHI' && (
                                      <>
                                        <TextField
                                          className="bg-white"
                                          type="text"
                                          name="SATHI"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          placeholder="SATHI"
                                          id="SATHI"
                                          value={input.SATHI}
                                        />
                                      </>
                                    )}
                                    {/*   {name === 'CPF' && (
                                      <>
                                        <TextField
                                          className="border-2 w-40 border-gray-400 rounded-xl text-center"
                                          type="text"
                                          name="CPF"
                                          onChange={(event) => {
                                            handleChangeInput(index, event)
                                          }}
                                          placeholder="CPF"
                                          id="CPF"
                                          value={input.CPF}
                                        />
                                      </>
                                    )} */}
                                    {name === 'Consideration' &&
                                      input.Consideration === true && (
                                        <div className="flex justify-center">
                                          <input
                                            type="checkbox"
                                            name="Consideration"
                                            style={{
                                              width: '35px',
                                              height: '35px',
                                            }}
                                            onChange={(e) => {
                                              handleChangeInput(index, e)
                                            }}
                                            checked
                                          />
                                        </div>
                                      )}

                                    {name === 'Consideration' &&
                                      input.Consideration === false && (
                                        <>
                                          <div className="flex justify-center">
                                            <input
                                              type="checkbox"
                                              name="Consideration"
                                              style={{
                                                width: '35px',
                                                height: '35px',
                                              }}
                                              onChange={(e) => {
                                                handleChangeInput(index, e)
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                                type="button"
                                className="bg-gray-400 text-black  font-semibold p-2"
                                onClick={() => handleRemoveInput(index)}
                              >
                                Remove Accused
                              </button>
                            </div>
                          </>
                        )
                      })}

                    <div className="flex justify-center my-4">
                      <button
                        type="button"
                        className="bg-gray-400 text-black  font-semibold p-2"
                        onClick={() => handleAddInput()}
                      >
                        Add Member
                      </button>
                    </div>
                  </div>
                </>
              )}

              {secondbtn && (
                <>
                  <div className="flex justify-center mb-8 mt-4">
                    <Button
                      onClick={handleUpdateForm}
                      variant="contained"
                      sx={{ backgroundColor: 'blue', color: 'white' }}
                      endIcon={<SendIcon />}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default InwardOld
