const mysql = require('mysql2')
const ipfile = require('../../Frontend/src/ip.json')
const connection = mysql
  .createConnection({
    host: ipfile.host,
    user: 'root',
    password: 'S2k3c0s2@1110',
    database: 'uo',
  })
  .promise()
const AccusedEntryQuery = `INSERT INTO ACCUSED (SATHI,NAME,DOR,USER,DATE_TIME) VALUES (?,?,?,?,?)`

const CheckAccusedEntry = `SELECT*FROM ACCUSED WHERE SATHI=?`
const Accused_Designation_Entry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,CLASS,CUC,DATE_TIME) VALUES (?,?,?,?,?,?,?)`
const Movement_Entry = `INSERT INTO movements (FID,UO,MOVTO,MOVTDATE,REMARKS,USER,DATE_TIME) VALUES (?,?,?,?,?,?,?)`

/* get latest allocation */

exports.GetLatestAllocation = async (req, res) => {
  const Query = `select*from allocation  ORDER BY COUNT ;`
  const response = await connection.query(Query)

  const AllocationPersons = ['US-1', 'US-2', 'SO-2', 'SO-3', 'DYSO-1', 'DYSO-4']

  const AllocationList = response[0]
  /* Added New Person */
  for (let i = 0; i < AllocationPersons.length; i++) {
    if (
      response[0].find(
        (respon) => respon.ALLOCATED === AllocationPersons[i],
      ) === undefined
    ) {
      AllocationList.push({ ALLOCATED: AllocationPersons[i], COUNT: 0 })
    }
  }

  /* Deleted New One */

  for (let i = 0; i < AllocationList.length; i++) {
    if (AllocationPersons.indexOf(AllocationList[i].ALLOCATED) === -1) {
      AllocationList.splice(i, 1)
    }
  }

  res.status(200).json({
    success: true,
    result: AllocationList,
  })
}

exports.NewCaseForm = async (req, res) => {
  //Query For Table

  const FileSelectionquery = `SELECT*FROM FILETABLES WHERE FILENO=?`
  const datequery = `SELECT*FROM FILETABLES WHERE YEAR(DATE_TIME)=?`
  const FiletableEntryQuery = `INSERT INTO FILETABLES (FILENO,eSarkar,DEPARTMENT,SUB,FTYPE,STAGE,ALLOT,USER,DATE_TIME,UO,DEADLINE,Attachment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`

  const UpdateCount = `UPDATE ALLOCATION SET COUNT=COUNT+1 WHERE ALLOCATED=?`
  const CheckAllotment = `SELECT*FROM ALLOCATION WHERE ALLOCATED=?`
  const InsertInAllotment = `INSERT INTO ALLOCATION (ALLOCATED,COUNT) VALUES(?,0)`
  let {
    fileno,
    esarkarno,
    department,
    subject,
    filetype,
    CaseStage,
    Allotment,
    Attachment,
    date,
    fields,
    user,
    Other,
  } = req.body

  if (Allotment) {
    const AllocationResponse = await connection.query(CheckAllotment, [
      Allotment,
    ])
    if (AllocationResponse[0].length == 0) {
      const response = await connection.query(InsertInAllotment, [Allotment])
      if (response[0].insertId) {
      } else {
        res.status(200).json({
          success: false,
          msg: 'Not Been Allocated',
        })
      }
    }
  }

  if (date.length === 0) {
    let dt = new Date()
    const newDate = new Date(dt.setFullYear(9999))
    date = newDate
  }

  let insertid
  let accusedEntry
  if (CaseStage === 'Other') CaseStage = Other

  const dates = new Date()
  const result = await connection.query(datequery, [dates.getFullYear()])

  const UO = `${result[0].length + 1}/${dates.getFullYear()}`

  const AllocationCount = await connection.query(UpdateCount, [Allotment])

  const Fileresult = await connection.query(FileSelectionquery, [fileno])

  if (Fileresult[0].length == 0) {
    const insertQueryResult = await connection.query(FiletableEntryQuery, [
      fileno,
      esarkarno,
      department,
      subject,
      filetype,
      CaseStage,
      Allotment,
      user,
      dates,
      UO,
      date,
      Attachment,
    ])

    insertid = insertQueryResult[0].insertId

    fields.map(async (accused) => {
      if (accused.Consideration == 'false') accused.Consideration = 'No'
      else accused.Consideration = 'Yes'

      if (accused.SATHI.length !== 0) {
        const Presence = await connection.query(
          CheckAccusedEntry,
          accused.SATHI.toLowerCase(),
        )

        if (Presence[0].length === 0) {
          const accusedEntry = await connection.query(AccusedEntryQuery, [
            accused.SATHI,
            accused.NAME,
            accused.DOR,
            user,
            dates,
          ])
          const Accused_DEntry = await connection.query(
            Accused_Designation_Entry,
            [
              accused.DESIGNATION,
              user,
              insertid,
              accusedEntry[0].insertId,
              accused.CLASS,
              accused.Consideration,
              dates,
            ],
          )
        } else {
          const Accused_DEntry = await connection.query(
            Accused_Designation_Entry,
            [
              accused.DESIGNATION,
              user,
              insertid,
              Presence[0][0].AID,
              accused.CLASS,
              accused.Consideration,
              dates,
            ],
          )
        }
      } else {
        const accusedEntry = await connection.query(AccusedEntryQuery, [
          accused.SATHI,

          accused.NAME,
          accused.DOR,
          user,
          dates,
        ])

        const Accused_DEntry = await connection.query(
          Accused_Designation_Entry,
          [
            accused.DESIGNATION,
            user,
            insertid,
            accusedEntry[0].insertId,
            accused.CLASS,
            accused.Consideration,
            dates,
          ],
        )
      }
      /* Under Consideration */
    })

    /* const CurrentDate = dates.toISOString().slice(0, 10) */

    const EntryInMovementTable = await connection.query(Movement_Entry, [
      insertid,
      UO,
      Allotment,
      dates,
      'First Movement',
      user,
      new Date(),
    ])
    if (EntryInMovementTable[0].insertId) {
      res.status(200).json({
        msg: 'File IS Entered Successfully',
        success: true,
        UO,
      })
    } else {
      const deleteQuery = `DELETE FROM FILETABLES WHERE FILENO=?`
      const quertExecute = await connection.query(deleteQuery, [insertid])

      fields.map(async () => {
        const deleteAccusedDesignation = await connection.query(
          `DELETE FROM ACCUSED_DESIGNATION WHERE FID=?`,
          [insertid],
        )
      })
      res.status(200).json({
        success: false,
        msg: 'There is Some Error in the Data Enter Again',
      })
    }
  } else {
    res.status(200).json({
      msg: 'File Already Exist',
      success: false,
    })
  }
}

exports.OldForm = async (req, res) => {
  const year = req.params.year
  const numbers = req.params.number
  const uo = `${numbers}/${year}`
  const EntryFromUoTable = await connection.query(
    `SELECT*FROM FILETABLES WHERE UO="${uo}"`,
  )

  if (EntryFromUoTable[0].length > 0) {
    const FileEntryDetails = EntryFromUoTable[0][0]
    const FID = EntryFromUoTable[0][0].FID

    const query = `SELECT*FROM ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID WHERE ACCUSED_DESIGNATION.FID=?`

    const AccusedEntry = await connection.query(query, [FID])
    const AccusedDetails = AccusedEntry[0]

    const Alldata = {}
    if (AccusedDetails.length > 0) {
      Alldata.FileDetails = FileEntryDetails
      Alldata.Accused_Details = AccusedDetails
      res.status(200).json({
        success: true,
        msg: 'The UO is Found',
        Data: Alldata,
      })
    } else {
      Alldata.FileDetails = FileEntryDetails
      res.status(200).json({
        success: false,
        msg: 'Data Found Click One more Time',
        Data: Alldata,
      })
    }
  } else {
    res.status(200).json({
      success: false,
      msg: 'File With UO Does Not Exists',
    })
  }
}

exports.UpdateForm = async (req, res) => {
  const dates = new Date()
  const datequery = `SELECT*FROM FILETABLES WHERE YEAR(DATE_TIME)=?`
  const EntryFromFiletableQuery = `SELECT*FROM FILETABLES WHERE FID=?`
  const InsertFileTableQuery = `INSERT INTO FILETABLES (FILENO,eSarkar,Department,Sub,Ftype,Stage,Allot,DATE_TIME, user,UO,DEADLINE,Attachment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  const result = await connection.query(datequery, [dates.getFullYear()])

  const UO = `${result[0].length + 1}/${dates.getFullYear()}`
  let {
    fileno,
    esarkarno,
    department,
    subject,
    filetype,
    CaseStage,
    Allotment,
    date,
    user,
    Other,
    fields,
    Attachment,
  } = req.body
  if (CaseStage === 'Other') CaseStage = Other

  if (date.length == 0) {
    let dt = new Date()
    const newDate = new Date(dt.setFullYear(dt.getFullYear() + 100))
    date = newDate
  }

  let insertid
  let accusedEntry
  let accused_designation_Entry
  const InsertResult = await connection.query(InsertFileTableQuery, [
    fileno,
    esarkarno,
    department,
    subject,
    filetype,
    CaseStage,
    Allotment,
    dates,
    user,
    UO,
    date,
    Attachment,
  ])

  if (InsertResult[0].insertId) {
    /* FID */
    insertid = InsertResult[0].insertId

    if (fields.length > 0) {
      fields.map(async (accused) => {
        if (accused.Consideration === 'false') accused.Consideration = 'No'
        else accused.Consideration = 'Yes'

        if (accused.AID >= '0' && accused.SATHI.length > 0) {
          /* UPDATE AND SET THE AID AND SATHI */
          const updateQuery = 'UPDATE ACCUSED SET SATHI=? WHERE AID=?'
          const executed = await connection.query(updateQuery, [
            accused.SATHI,
            accused.AID,
          ])

          const excusedEntry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,DATE_TIME,CLASS,CUC) VALUES(?,?,?,?,?,?,?)`

          const accused_designation_Entry = await connection.query(
            excusedEntry,
            [
              accused.DESIGNATION,
              user,
              insertid,
              accused.AID,
              dates,
              accused.CLASS,
              accused.Consideration,
            ],
          )
        } else if (accused.SATHI.length > 0) {
          /* if sathi is provided */
          const PresenceOfAccused = `SELECT* FROM ACCUSED WHERE SATHI=?`
          const executed = await connection.query(PresenceOfAccused, [
            accused.SATHI,
          ])

          if (executed[0].length === 0) {
            const AccusedEntry = `INSERT INTO ACCUSED (SATHI,NAME,DOR,USER,DATE_TIME) VALUES (?,?,?,?,?)`
            const executedValue = await connection.query(AccusedEntry, [
              accused.SATHI,

              accused.NAME,
              accused.DOR,
              user,
              dates,
            ])

            const excusedDesignationEntry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,DATE_TIME,CLASS,CUC) VALUES(?,?,?,?,?,?,?)`

            const accused_designation_Entry = await connection.query(
              excusedDesignationEntry,
              [
                accused.DESIGNATION,
                user,
                insertid,
                executedValue[0].insertId,
                dates,
                accused.CLASS,
                accused.Consideration,
              ],
            )
          } else {
            const excusedDesignationEntry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,DATE_TIME,CLASS,CUC) VALUES(?,?,?,?,?,?,?)`

            const accused_designation_Entry = await connection.query(
              excusedDesignationEntry,
              [
                accused.DESIGNATION,
                user,
                insertid,
                executed[0][0].insertId,
                dates,
                accused.CLASS,
                accused.Consideration,
                accused.AID,
              ],
            )
          }
        } else if (accused.AID && accused.SATHI.length === 0) {
          const excusedDesignationEntry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,DATE_TIME,CLASS,CUC) VALUES(?,?,?,?,?,?,?)`

          const accused_designation_Entry = await connection.query(
            excusedDesignationEntry,
            [
              accused.DESIGNATION,
              user,
              insertid,
              accused.AID,
              dates,
              accused.CLASS,
              accused.Consideration,
            ],
          )
        } else {
          /* if sathi is not provided */
          const EntryAccused = `INSERT INTO ACCUSED (SATHI,NAME,DOR,USER,DATE_TIME) VALUES (?,?,?,?,?)`
          const executed = await connection.query(EntryAccused, [
            accused.SATHI,

            accused.NAME,
            accused.DOR,
            user,
            dates,
          ])

          const excusedDesignationEntry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,DATE_TIME,CLASS,CUC) VALUES(?,?,?,?,?,?,?)`

          const accused_designation_Entry = await connection.query(
            excusedDesignationEntry,
            [
              accused.DESIGNATION,
              user,
              insertid,
              executed[0].insertId,
              dates,
              accused.CLASS,
              accused.Consideration,
            ],
          )
        }
      })

      /* Movement Entry */

      const EntryInMovementTable = await connection.query(Movement_Entry, [
        insertid,
        UO,
        Allotment,
        dates,
        'First Movement',
        user,
        dates,
      ])
      if (EntryInMovementTable[0].insertId) {
        res.status(200).json({
          msg: 'File IS Entered Successfully',
          success: true,
          UO,
        })
      } else {
        const deleteQuery = `DELETE FROM FILETABLES WHERE FID=?`
        const quertExecute = await connection.query(deleteQuery, [insertid])

        fields.map(async () => {
          const deleteAccusedDesignation = await connection.query(
            `DELETE FROM ACCUSED_DESIGNATION WHERE FID=?`,
            [insertid],
          )
        })
        res.status(200).json({
          success: false,
          msg: 'There is Some Error in the Data Enter Again',
        })
      }
    }
  } else {
    res.status(200).json({
      success: false,
      msg: 'Data is Not Added Try Again',
    })
  }
}

exports.Movement = async (req, res) => {
  const FindFromFileQuery = `SELECT*FROM MOVEMENTS WHERE UO=?`
  const year = req.params.year
  const numbers = req.params.number
  const response = []
  const uo = `${numbers}/${year}`
  const EntryFromMovement = await connection.query(FindFromFileQuery, [uo])

  if (EntryFromMovement[0].length > 0) {
    const entryfromFiletables = await connection.query(
      `SELECT*FROM FILETABLES WHERE FID=${EntryFromMovement[0][0].FID}`,
    )
    for (let i = 0; i < EntryFromMovement[0].length; i++) {
      const answer = {
        MID: EntryFromMovement[0][i].MID,
        FID: EntryFromMovement[0][i].FID,
        UO: EntryFromMovement[0][i].UO,
        MOVTO: EntryFromMovement[0][i].MOVTO,
        MOVTDATE: EntryFromMovement[0][i].MOVTDATE + 1,
        Remarks: EntryFromMovement[0][i].Remarks,
        User: EntryFromMovement[0][i].User,
        date_time: EntryFromMovement[0][i].date_time + 1,
      }
      response.push(answer)
    }

    res.status(200).json({
      success: true,
      msg: 'Movement Found',
      Movement: response,
      File: entryfromFiletables[0][0],
    })
  } else {
    res.status(200).json({
      success: false,
      msg: 'Movement For This UO do not Exists ',
    })
  }
}

exports.NewMovement = async (req, res) => {
  const date = new Date()
  const QueryForMovement = `INSERT INTO MOVEMENTS (FID,UO,MOVTO,MOVTDATE,REMARKS,User,DATE_TIME) VALUES (?,?,?,?,?,?,?)`
  const UpdateQuery = `UPDATE movements set confirmation=? , SUBMISSION=? WHERE UO=? AND MOVTO=?`
  const {
    UO,
    newmovement,
    newmovementdate,
    remarks,
    fileid,
    user,
    designation,
  } = req.body
  const result = await connection.query(QueryForMovement, [
    fileid,
    UO,
    newmovement,
    newmovementdate,
    remarks,
    user,
    date,
  ])

  if (result[0].insertId) {
    const previousEntryCompletion = await connection.query(UpdateQuery, [
      'YES',
      date,
      UO,
      designation,
    ])

    res.status(200).json({
      success: true,
      msg: 'Movement Added',
    })
  }
}

exports.Cases = async (req, res) => {
  const { value, department } = req.body

  const MovementAndFileResponse = []
  let QuerySearchWithRegex
  if (department !== 'Any') {
    QuerySearchWithRegex = `SELECT*FROM FILETABLES INNER JOIN ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID ON FILETABLES.FID=ACCUSED_DESIGNATION.FID  WHERE ((FILETABLES.department REGEXP"${department}") AND (FILETABLES.Sub REGEXP "${value}" OR FILETABLES.Sub REGEXP "${value.toLowerCase()}" OR ACCUSED.NAME REGEXP "${value}" OR ACCUSED.NAME REGEXP "${value.toLowerCase()}" OR FILETABLES.FILENO REGEXP "${value}" OR FILETABLES.ESARKAR REGEXP "${value}" OR FILETABLES.UO="${value}" OR ACCUSED.SATHI="${value}"))`
  } else {
    QuerySearchWithRegex = `SELECT*FROM FILETABLES INNER JOIN ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID ON FILETABLES.FID=ACCUSED_DESIGNATION.FID  WHERE (FILETABLES.Sub REGEXP "${value}" OR ACCUSED.NAME REGEXP "${value}" OR FILETABLES.FILENO REGEXP "${value}" OR FILETABLES.ESARKAR REGEXP "${value}" OR FILETABLES.UO="${value}" OR ACCUSED.SATHI="${value}")`
  }

  const response = await connection.query(QuerySearchWithRegex)

  response[0] = response[0].filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.FID === value.FID),
  )

  for (let i = 0; i < response[0].length; i++) {
    response[0][i].DATE_TIME = response[0][i].DATE_TIME + 1
    response[0][i].DEADLINE = response[0][i].DEADLINE + 1
  }

  for (let i = 0; i < response[0].length; i++) {
    const FileQuery = `SELECT*FROM MOVEMENTS WHERE FID=?`
    const AccusedQuery = `SELECT*FROM ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID WHERE ACCUSED_DESIGNATION.FID=?`
    const responseMovement = await connection.query(FileQuery, [
      response[0][i].FID,
    ])

    for (let i = 0; i < responseMovement[0].length; i++) {
      responseMovement[0][i].MOVTDATE = responseMovement[0][i].MOVTDATE + 1
      responseMovement[0][i].date_time = responseMovement[0][i].date_time + 1
    }

    const responseAccused = await connection.query(AccusedQuery, [
      response[0][i].FID,
    ])

    MovementAndFileResponse.push({
      FileDetails: response[0][i],
      Movements: responseMovement[0],
      Accused: responseAccused[0],
    })
  }

  if (MovementAndFileResponse.length > 0) {
    res.status(200).json({
      success: true,
      msg: MovementAndFileResponse,
    })
  } else {
    res.status(200).json({
      success: false,
      msg: 'No Data Found',
    })
  }
}

exports.DateSearch = async (req, res) => {
  const { from, to } = req.body

  const QuerySearchWithDate = `SELECT*FROM MOVEMENTS WHERE MOVEMENTS.MOVTDATE>="${from}" and MOVEMENTS.MOVTDATE<="${to}" order BY FID`

  const response = await connection.query(QuerySearchWithDate)

  const MovementAndFileResponse = []
  for (let i = 0; i < response[0].length; i++) {
    response[0][i].date_time = response[0][i].date_time + 1
    response[0][i].MOVTDATE = response[0][i].MOVTDATE + 1
  }

  const FileDetails = []

  for (let i = 0; i < response[0].length; i++) {
    const FileQuery = `SELECT*FROM Filetables WHERE FID=?`
    const AccusedQuery = `SELECT*FROM ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID WHERE ACCUSED_DESIGNATION.FID=?`
    const MovementsOfFile = `SELECT*FROM MOVEMENTS WHERE UO="${response[0][i].UO}" `
    if (
      FileDetails.findIndex((data) => data.FID === response[0][i].FID) != -1
    ) {
      continue
    }

    const FileDetailsonMovemet = await connection.query(FileQuery, [
      response[0][i].FID,
    ])

    FileDetailsonMovemet[0][0].DATE_TIME =
      FileDetailsonMovemet[0][0].DATE_TIME + 1
    FileDetailsonMovemet[0][0].DEADLINE =
      FileDetailsonMovemet[0][0].DEADLINE + 1
    FileDetails.push(FileDetailsonMovemet[0][0])

    /* ACCUSED */

    const responseAccused = await connection.query(AccusedQuery, [
      response[0][i].FID,
    ])

    for (let i = 0; i < responseAccused[0].length; i++) {
      responseAccused[0][i].DATE_TIME = responseAccused[0][i].DATE_TIME + 1
    }

    const MovementsFromTable = await connection.query(MovementsOfFile)

    for (let i = 0; i < MovementsFromTable[0].length; i++) {
      MovementsFromTable[0][i].date_time =
        MovementsFromTable[0][i].date_time + 1
      MovementsFromTable[0][i].MOVTDATE = MovementsFromTable[0][i].MOVTDATE + 1
    }

    MovementAndFileResponse.push({
      FileDetails: FileDetailsonMovemet[0][0],
      Movements: MovementsFromTable[0],
      Accused: responseAccused[0],
    })
  }

  if (MovementAndFileResponse.length > 0) {
    res.status(200).json({
      success: true,
      msg: MovementAndFileResponse,
    })
  } else {
    res.status(200).json({
      success: false,
      msg: 'No Data Found',
    })
  }
}

exports.GetFileOnDesignation = async (req, res) => {
  const eachFileMovements = []
  const responseMovement = []
  const deadlineFile = []
  let CurrentMonthCaseAllocation = 0
  let CurrentMonthCaseSubmitted = 0
  let AllPending = 0
  let PreviousMonthPending = 0
  const designation = req.params.designation.toUpperCase()

  const QueryForMovement = `SELECT*FROM MOVEMENTS WHERE (MOVTO=? AND CONFIRMATION="NO") `

  const responseMovements = await connection.query(QueryForMovement, [
    designation,
  ])

  /* ------------------ */

  //CurrentMonth Case Allocation and Submission

  let date = new Date()
  let firstDayCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

  let lastDayCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  let prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0)
  let prevMonthFirstDate = new Date(
    date.getFullYear() - (date.getMonth() > 0 ? 0 : 1),
    (date.getMonth() - 1 + 12) % 12,
    1,
  )
  /* AND CONFIRMATION="NO" */
  const QueryForCurrentMonthCasesAllocated = `SELECT * FROM MOVEMENTS  WHERE MOVTO=?  AND MOVTDATE>=? AND MOVTDATE<=?`
  const QueryForCurrentMonthCasesSubmitted = `SELECT * FROM MOVEMENTS  WHERE MOVTO=? AND CONFIRMATION="YES" AND MOVTDATE>=? AND MOVTDATE<=?`

  const QueryForAllPendingCases = `SELECT * FROM MOVEMENTS  WHERE MOVTO=? AND CONFIRMATION="NO"`

  const QueryForAllPreviousMonthPendingCases = `SELECT * FROM MOVEMENTS  WHERE MOVTO=? AND CONFIRMATION="NO" AND MOVTDATE>=? AND MOVTDATE<=?`

  const valueofCurrentMonthAllocation = await connection.query(
    QueryForCurrentMonthCasesAllocated,
    [designation, firstDayCurrentMonth, lastDayCurrentMonth],
  )
  const valueofCurrentMonthSubmitted = await connection.query(
    QueryForCurrentMonthCasesSubmitted,
    [designation, firstDayCurrentMonth, lastDayCurrentMonth],
  )
  const valueofAllPending = await connection.query(QueryForAllPendingCases, [
    designation,
  ])

  const valueofPreviousMonthPending = await connection.query(
    QueryForAllPreviousMonthPendingCases,
    [designation, prevMonthFirstDate, prevMonthLastDate],
  )

  CurrentMonthCaseAllocation = valueofCurrentMonthAllocation[0].length
  CurrentMonthCaseSubmitted = valueofCurrentMonthSubmitted[0].length
  AllPending = valueofAllPending[0].length
  PreviousMonthPending = valueofPreviousMonthPending[0].length
  /* ------------------ */

  /* All files */

  /*   if (responseMovements[0].length !== 0) {

    
   
    for (let i = 0; i < responseMovements[0].length; i++) {
      const data = await connection.query(QueryForMovement, [responseMovements[0][i].FID])

      if (data[0].length > 0) {
        data[0][0].MOVTDATE = data[0][0].MOVTDATE + 1
        data[0][0].date_time = data[0][0].date_time + 1
        eachFileMovements.push(data[0][0])
      }
    }
  }

  if (eachFileMovements.length !== 0) {

    for (let i = 0; i < eachFileMovements.length; i++) {
      if (eachFileMovements[i].MOVTO == designation) {
        responseMovement.push(eachFileMovements[i])
      }
    }
  } */

  /* details of each FILE MOVEMENT */
  if (responseMovements[0].length > 0) {
    const queryForData = `SELECT* FROM FILETABLES INNER JOIN ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID ON FILETABLES.FID=ACCUSED_DESIGNATION.FID WHERE FILETABLES.UO=? `

    let accused = []

    for (let i = 0; i < responseMovements[0].length; i++) {
      const data = await connection.query(queryForData, [
        responseMovements[0][i].UO,
      ])

      for (let j = 0; j < data[0].length; j++) {
        accused.push(data[0][j].NAME)
      }
      if (data[0].length > 0) {
        deadlineFile.push({
          uo: data[0][0].UO,
          esarkarno: data[0][0].eSarkar,
          department: data[0][0].Department,
          fileno: data[0][0].fileno,
          accused,
          deadline: data[0][0].DEADLINE,
        })
      }
      accused = []
    }
  }

  deadlineFile.sort((a, b) => a.deadline - b.deadline)
  for (let i = 0; i < deadlineFile.length; i++) {
    deadlineFile[i].deadline = deadlineFile[i].deadline + 1
  }

  res.status(200).json({
    response: deadlineFile,
    AllocatedFiles: CurrentMonthCaseAllocation,
    Submitted: CurrentMonthCaseSubmitted,
    Pending: AllPending,
    PreviousPending: PreviousMonthPending,
  })
}

exports.GetWorkSheetOnDesignation = async (req, res) => {
  const designation = req.params.designation

  const Response = []
  /* MOVEMENTS ON DESIGNATION */
  const QueryForWorkSheet = `SELECT*FROM MOVEMENTS WHERE MOVTO=? ORDER BY CONFIRMATION `
  const data = await connection.query(QueryForWorkSheet, [designation])
  console.log(data[0])
  /* details of each UO */
  if (data[0].length > 0) {
    const queryForData = `SELECT* FROM FILETABLES INNER JOIN ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID ON FILETABLES.FID=ACCUSED_DESIGNATION.FID WHERE FILETABLES.UO=?`

    let accused = []

    for (let i = 0; i < data[0].length; i++) {
      const datas = await connection.query(queryForData, [data[0][i].UO])

      for (let j = 0; j < datas[0].length; j++) {
        accused.push(datas[0][j].NAME)
      }

      if (datas[0].length > 0) {
        Response.push({
          uo: datas[0][0].UO,
          esarkarno: datas[0][0].eSarkar,
          department: datas[0][0].Department,
          fileno: datas[0][0].fileno,
          accused,
          deadline: datas[0][0].DEADLINE,
          status: data[0][i].CONFIRMATION,
          submission_date:
            data[0][i].SUBMISSION === null
              ? 'Pending'
              : data[0][i].SUBMISSION + 1,
        })
      }
      accused = []
    }
    Response.sort((a, b) => a.deadline - b.deadline)
    for (let i = 0; i < Response.length; i++) {
      Response[i].deadline = Response[i].deadline + 1
    }
  }

  res.status(200).json({
    data: Response,
  })
}

exports.UsersAllocation = async (req, res) => {
  const QueryForUsers = `SELECT*FROM ALLOCATION`
  const data = await connection.query(QueryForUsers)
  console.log(data[0])
  res.status(200).json({
    data: data[0],
  })
}
