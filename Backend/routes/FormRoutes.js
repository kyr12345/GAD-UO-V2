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
} = require('../RoutesFunction/FormFunctions')

router.route('/NewCaseForm').post(NewCaseForm)
router.route('/Update').post(UpdateForm)
router.route('/getFromUO/:number/:year').get(OldForm)
router.route('/getLatestAllocation').get(GetLatestAllocation)
router.route('/movement/:number/:year').get(Movement)
router.route('/newmovement').post(NewMovement)
router.route('/caseInfo').post(Cases)
router.route('/dates').post(DateSearch)

module.exports = router
