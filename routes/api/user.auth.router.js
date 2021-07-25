const { Router } = require('express')
const authCtrl = require('../../controllers/user.auth.controllers')

const authRouter = Router()

authRouter.post('/signup', authCtrl.registration)
authRouter.post('/login', authCtrl.login)

module.exports = authRouter
