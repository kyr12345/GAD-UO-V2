import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import JSONfile from '../Departments.json'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import ipfile from '../../../ip.json'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useNavigate } from 'react-router-dom'
function InwardNew() {
  const navigate = useNavigate()
  const requestForSubmit = `http://${ipfile.ip}:3000/api/v1/NewCaseForm`
  /*   const result = useSelector((state) => state.user.currentUser)
   */
  const result = JSON.parse(window.localStorage.getItem('ROLE_NAME'))
  let consideration = 0
  const [department, setdepartments] = React.useState('')
  const [fileno, setfileno] = useState('')
  const [esarkarno, setesarkarno] = useState('')
  const [subject, setsubject] = useState('')
  const [filetype, setfiletype] = useState('')
  const [CaseStage, setCaseStage] = useState('')
  const [user, setuser] = useState('')
  const [showalert, setalert] = useState(false)
  const [Other, SetOther] = useState('')
  const [Attachment, setAttachment] = useState('')
  const [showalertContent, setalertContent] = useState('')
  const [Allotment, setAllotment] = useState([])
  const [index, setindex] = useState(0)
  const [date, setDate] = useState('')
  let err = ''
  const [fields, setFields] = useState([
    {
      NAME: '',
      DESIGNATION: '',
      CLASS: '',
      DOR: '',
      SATHI: '',
      Consideration: false,
    },
  ])
  const fetchAllocation = async () => {
    const result = await axios.get(
      `http://${ipfile.ip}:3000/api/v1/getLatestAllocation`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      },
    )
    if (result.data.success) {
      console.log(result.data.result)
      setAllotment(result.data.result)

      /*         if (Allotment.length > 0)
          setSelectedAllotment(Allotment[index]['ALLOCATED']) */
    }
  }
  useEffect(() => {
    if (result) {
      setuser(result.username)
      fetchAllocation()
    }
  }, [])

  const handleChange = (event) => {
    setdepartments(event.target.value)
  }

  const handleFileType = (event) => {
    setfiletype(event.target.value)
  }

  const handleCaseStage = (event) => {
    setCaseStage(event.target.value)
  }

  const handleAllotment = (event) => {
    setAllotment(event.target.value)
  }

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
      /* CPF: '', */
      Consideration: false,
    })
    setFields(values)
  }
  useEffect(() => {
    setTimeout(() => {
      if (showalert) {
        setalert(false)
      }
    }, 10000)
  }, [showalert])
  const handleRemoveInput = (i) => {
    const values = [...fields]
    console.log(values)
    values.splice(i, 1)
    setFields(values)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    console.log(Other)
    const inputs = {
      fileno: fileno.trim(),
      esarkarno: esarkarno.trim(),
      department,
      subject,
      filetype,
      CaseStage,
      Allotment: Allotment[index].ALLOCATED,
      user,
      date,
      fields,
      Other,
      Attachment,
    }
    console.log(inputs)

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].Consideration === true) consideration++
    }

    if (consideration === 0)
      err += 'Select Atleast One Accused In Consideration'
    else if (consideration > 0) consideration = 0
    if (fileno.length === 0) {
      err += 'Entry File No\n'
    }
    if (CaseStage === 'Other') {
      if (Other.length === 0) {
        err += 'Entry Other Value\n'
      }
    }
    if (subject.length === 0) {
      err += 'Enter Subject\n'
    }
    if (CaseStage.length === 0) {
      err += 'Select Case Stage\n'
    }
    if (esarkarno.length === 0) {
      err += 'Entry eSarkar No\n'
    }

    if (department.length === 0) {
      err += 'Select Department\n'
    }

    if (filetype.length === 0) {
      err += 'Select File Type\n'
    }

    if (Allotment.length === 0) {
      err += 'Select The Allotment\n'
    }
    if (fields.length === 0) err += `Enter The Accused Details`
    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        console.log(fields[i])
        if (fields[i].NAME.length === 0)
          err += `Enter The Name of Accused In ${i + 1} Entry\n`
        if (fields[i].DESIGNATION.length === 0)
          err += `Enter The Designation of Accused In ${i + 1} Entry\n`
        if (fields[i].CLASS.length === 0)
          err += `Select The Class of Accused In ${i + 1} Entry\n`
        if (fields[i].DOR.length === 0)
          err += `Select The DOR of Accused In ${i + 1} Entry\n`
      }
    }

    if (err.length !== 0) {
      alert(err)
      err = ''
    } else {
      axios
        .post(requestForSubmit, inputs, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
        .then((result) => {
          console.log(result.data)
          if (result.data.success) {
            setalert(true)

            setalertContent(
              'The File Is Generated With UO Number ' + result.data.UO,
            )
            setfileno('')
            setdepartments('')
            setCaseStage('')
            setindex(0)
            fetchAllocation()
            setfiletype('')
            setAttachment('')
            setDate('')
            setsubject('')
            setesarkarno('')
            SetOther('')
            setFields([])
          } else {
            alert(result.data.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  const handleSkip = (e) => {
    e.preventDefault()
    console.log(index)
    console.log(Allotment.length)
    if (index + 1 < Allotment.length) setindex(index + 1)
    else setindex(0)
  }

  return (
    <div className="flex flex-col justify-around  align-items-center">
      <h3 className="text-2xl py-4 font-bold text-center">Inward</h3>
      <h3 className="text-2xl py-4 font-bold text-center">New Case Form </h3>
      <form onSubmit={handleFormSubmit} method="POST">
        <div className="">
          <div className="px-14">
            <div className="flex justify-between mt-8 items-center ">
              <div className="flex flex-col align-items-center justify-center">
                <h4 className="font-bold text-xl">File No</h4>
                <TextField
                  onChange={(e) => setfileno(e.target.value)}
                  value={fileno}
                  id="outlined-required"
                  className="bg-white"
                  placeholder="File No"
                />
              </div>
              <div className="flex flex-col items-start justify-center">
                <h4 className="font-bold text-xl">eSarkar No</h4>
                <TextField
                  onChange={(e) => setesarkarno(e.target.value)}
                  value={esarkarno}
                  id="outlined-required"
                  className="bg-white"
                  placeholder="eSarkar No"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl">Department </h4>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={department}
                  onChange={handleChange}
                  className="w-full bg-white"
                  placeholder="Select Department"
                >
                  {JSONfile['departments'].map((option) => {
                    if (option.id !== 'item1') {
                      return (
                        <MenuItem key={option.id} value={option.Department}>
                          {option.Department}
                        </MenuItem>
                      )
                    }
                  })}
                </TextField>
              </div>
            </div>

            <div className="flex justify-center  mt-8 items-center">
              <div className="w-full">
                <h4 className="font-bold text-xl">Subject</h4>
                <TextareaAutosize
                  className="w-full"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid gray',
                    padding: '16px',
                  }}
                  onChange={(e) => setsubject(e.target.value)}
                  minRows="5"
                  placeholder="Subject"
                  value={subject}
                  id="outlined-required"
                />
              </div>
            </div>

            <div className="flex  items-center mb-8 justify-between">
              <div>
                <h4 className="font-bold text-xl">File Type</h4>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={filetype}
                  onChange={handleFileType}
                  className="w-full bg-white"
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
                  <div className="w-full">
                    {filetype === '' && (
                      <>
                        <TextField
                          id="outlined-select-currency"
                          select
                          className="w-full bg-white"
                          value={CaseStage}
                          onChange={handleCaseStage}
                        ></TextField>
                      </>
                    )}
                    {filetype && filetype === 'Suspension' && (
                      <>
                        <TextField
                          id="outlined-select-currency"
                          select
                          className="w-full bg-white"
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
                          label="Select"
                          className="w-full bg-white"
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
                          className="w-full bg-white"
                          label="Select"
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
                  className="border-2 text-black bg-white border-gray-400 p-4 rounded-xl "
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

            <div className="flex justify-around">
              <div className="flex  justify-center items-center  text-xl">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="font-bold text-center  w-full">Alloted To </h3>

                  <div className="mr-5">
                    <input
                      id="outlined-select-currency"
                      className="w-full  text-center  p-4 rounded-xl border-2 border-black"
                      value={Allotment.length > 0 && Allotment[index].ALLOCATED}
                      placeholder="Select Case Stage"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="click"
                    color="primary"
                    className="text-white bg-blue-400 p-2  mt-8  px-4"
                    variant="contained"
                    onClick={handleSkip}
                  >
                    SKIP
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h3 className="font-bold text-center w-full">Attachments </h3>
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

          <div className="mb-4 mt-4  ">
            <p className="font-bold text-center text-xl mt-4">Accused</p>
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
                          <div className="form-group flex flex-col items-around  justify-center">
                            <div className="font-bold">{name}</div>
                            {name === 'Name' && (
                              <>
                                <TextField
                                  sx={{ border: '2px', borderRadius: '10px' }}
                                  type="text"
                                  name="NAME"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
                                  placeholder="Name"
                                  id="Name"
                                  className="bg-white"
                                />
                              </>
                            )}

                            {name === 'Designation' && (
                              <>
                                <TextField
                                  className="border-2 w-40 border-gray-400 bg-white rounded-xl text-center"
                                  type="text"
                                  name="DESIGNATION"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
                                  placeholder="Designation"
                                  id="Designation"
                                />
                              </>
                            )}

                            {name === 'Class' && (
                              <>
                                <select
                                  name="CLASS"
                                  className="border-2 border-gray-400 bg-white p-4 w-40 text-center"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
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
                                  className="border-2 p-4 bg-white border-gray-400 "
                                  type="date"
                                  name="DOR"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
                                  id="DOR"
                                />
                              </>
                            )}
                            {name === 'SATHI' && (
                              <>
                                <TextField
                                  type="text"
                                  name="SATHI"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
                                  placeholder="SATHI"
                                  id="SATHI"
                                  className="bg-white"
                                />
                              </>
                            )}
                            {/* {name === 'CPF' && (
                              <>
                                <TextField
                                  className="border-2 w-40 border-gray-400 bg-white rounded-xl text-center"
                                  type="text"
                                  name="CPF"
                                  onChange={(event) => {
                                    handleChangeInput(index, event)
                                  }}
                                  placeholder="CPF"
                                  id="CPF"
                                  
                                />
                              </>
                            )} */}
                            {name === 'Consideration' && (
                              <>
                                <div className="flex justify-center items-center">
                                  <input
                                    type="checkbox"
                                    name="Consideration"
                                    style={{ width: '35px', height: '35px' }}
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
                className="bg-gray-400 text-black font-semibold p-2 mr-2 "
                onClick={() => handleAddInput()}
              >
                Add Member
              </button>
            </div>
          </div>
          <div className="flex my-8 justify-center">
            <Button type="submit" color="primary" variant="contained">
              REGISTER
            </Button>
          </div>
        </div>
      </form>
      {showalert && (
        <Alert
          sx={{ width: '100%', backgroundColor: '#2B3338', color: 'white' }}
        >
          {showalertContent}
        </Alert>
      )}
    </div>
  )
}

export default InwardNew
