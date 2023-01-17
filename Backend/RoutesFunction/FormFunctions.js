const mysql = require('mysql2')
const connection = mysql
  .createConnection({
    host: 'localhost',
    user: 'root',
    password: 'S2k3c0s2@1110',
    database: 'uo',
  })
  .promise()
const AccusedEntryQuery = `INSERT INTO ACCUSED (SATHI,NAME,DOR,USER,DATE_TIME) VALUES (?,?,?,?,?)`

const CheckAccusedEntry = `SELECT*FROM ACCUSED WHERE SATHI=?`
const Accused_Designation_Entry = `INSERT INTO ACCUSED_DESIGNATION (DESIGNATION,USER,FID,AID,CLASS,CUC,DATE_TIME) VALUES (?,?,?,?,?,?,?)`
const Movement_Entry = `INSERT INTO movements (FID,UO,MOVTO,MOVTDATE,REMARKS,USER,DATE_TIME) VALUES (?,?,?,?,?,?,?)`

exports.GetLatestAllocation = async (req, res) => {
  const Query = `select*from allocation  ORDER BY COUNT ;`
  const response = await connection.query(Query)
  console.log(response[0])
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
  console.log(AllocationList)
  /* Deleted New One */

  for (let i = 0; i < AllocationList.length; i++) {
    if (AllocationPersons.indexOf(AllocationList[i].ALLOCATED) === -1) {
      AllocationList.splice(i, 1)
    }
  }

  console.log(AllocationList)

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
    console.log(date)
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
    console.log(AccusedDetails)
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
  console.log(fields)
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
  console.log(fields)
  if (InsertResult[0].insertId) {
    /* FID */
    insertid = InsertResult[0].insertId
    console.log(insertid)
    if (fields.length > 0) {
      fields.map(async (accused) => {
        if (accused.Consideration === 'false') accused.Consideration = 'No'
        else accused.Consideration = 'Yes'

        console.log(accused.Consideration)

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
          console.log('Third')

          if (executed[0].length === 0) {
            const AccusedEntry = `INSERT INTO ACCUSED (SATHI,NAME,DOR,USER,DATE_TIME) VALUES (?,?,?,?,?)`
            const executedValue = await connection.query(AccusedEntry, [
              accused.SATHI,

              accused.NAME,
              accused.DOR,
              user,
              dates,
            ])
            console.log('Third->first')

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
          console.log('Last Else')
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
  const { UO, newmovement, newmovementdate, remarks, fileid, user } = req.body
  const result = await connection.query(QueryForMovement, [
    fileid,
    UO,
    newmovement,
    newmovementdate,
    remarks,
    user,
    date,
  ])
  console.log(result)
  if (result[0].insertId) {
    res.status(200).json({
      success: true,

      msg: 'Movement Added',
    })
  }
}

exports.Cases = async (req, res) => {
  const { value, department } = req.body

  /*   if (value.indexOf('/') <= -1) {
    const MovementAndFileResponse = []

    const QuerySearchWithRegex = `SELECT*FROM FILETABLES WHERE UO=?`

    const response = await connection.query(QuerySearchWithRegex, [value])

    if (response[0].length > 0) {
      response[0][0].DATE_TIME = response[0][0].DATE_TIME + 1

      const FileQuery = `SELECT*FROM MOVEMENTS WHERE FID=?`
      const AccusedQuery = `SELECT*FROM ACCUSED_DESIGNATION INNER JOIN ACCUSED ON ACCUSED_DESIGNATION.AID=ACCUSED.AID WHERE ACCUSED_DESIGNATION.FID=?`
      const responseMovement = await connection.query(FileQuery, [
        response[0][0].FID,
      ])
      const responseAccused = await connection.query(AccusedQuery, [
        response[0][0].FID,
      ])
      for (let i = 0; i < responseMovement[0].length; i++) {
        responseMovement[0][i].MOVTDATE = responseMovement[0][i].MOVTDATE + 1
        responseMovement[0][i].date_time = responseMovement[0][i].date_time + 1
      }

      MovementAndFileResponse.push({
        FileDetails: response[0][0],
        Movement: responseMovement[0],
        Accused: responseAccused[0],
      })

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
    } else {
      res.status(200).json({
        success: false,
        msg: 'Case Does Not With this UO',
      })
    }
  } else {
  } */

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
  console.log(response[0])

  for (let i = 0; i < response[0].length; i++) {
    response[0][i].DATE_TIME = response[0][i].DATE_TIME + 1
    response[0][i].DEADLINE = response[0][i].DEADLINE + 1
  }
  console.log(response[0])
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
  console.log(response[0])
  const MovementAndFileResponse = []
  for (let i = 0; i < response[0].length; i++) {
    response[0][i].date_time = response[0][i].date_time + 1
    response[0][i].MOVTDATE = response[0][i].MOVTDATE + 1
  }
  console.log('------------------------------')

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

    console.log('------------------------------')
    console.log(FileDetailsonMovemet[0][0])

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

    console.log('------------------------------')
    console.log(responseAccused[0])

    MovementAndFileResponse.push({
      FileDetails: FileDetailsonMovemet[0][0],
      Movements: MovementsFromTable[0],
      Accused: responseAccused[0],
    })

    console.log('------------------------------')
    console.log(MovementAndFileResponse)
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
