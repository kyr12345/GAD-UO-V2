const express = require('express')
const router = express.Router()
const {
  NewCaseForm,
  OldForm,
  UpdateForm,
  Movement,
  NewMovement,
  Cases,
  DateSearch,
  GetLatestAllocation,
  GetFileOnDesignation,
  GetWorkSheetOnDesignation,
  UsersAllocation,
} = require('../RoutesFunction/FormFunctions')

router.route('/getFromUO/:number/:year').get(OldForm)
router.route('/getLatestAllocation').get(GetLatestAllocation)
router.route('/requestFiles/:designation').get(GetFileOnDesignation)
router.route('/requestWorkSheet/:designation').get(GetWorkSheetOnDesignation)
router.route('/getUsersAllocation').get(UsersAllocation)
router.route('/movement/:number/:year').get(Movement)
router.route('/newmovement').post(NewMovement)
router.route('/caseInfo').post(Cases)
router.route('/dates').post(DateSearch)
router.route('/NewCaseForm').post(NewCaseForm)
router.route('/Update').post(UpdateForm)
module.exports = router
