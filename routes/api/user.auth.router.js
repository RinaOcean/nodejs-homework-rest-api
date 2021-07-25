const { Router } = require('express')
const authCtrl = require('../../controllers/user.auth.controllers')

const authRouter = Router()

authRouter.post('/users/signup', authCtrl.registration)

module.exports = authRouter
