const express = require('express')
const router = express.Router()
const { LoginUser, Register } = require('../RoutesFunction/UserFunctions')

router.route('/login').post(LoginUser)
router.route('/register').post(Register)
/* router.route('/update/password').put(updatePassword)
router.route('/update/profile').put(updateProfile)
router.route('/logout').post(Logout) */

module.exports = router
