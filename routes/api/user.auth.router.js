const { Router } = require('express')
const authCtrl = require('../../controllers/user.auth.controllers')
const tokenMiddleware = require('../../middlewares/jwtTokenMiddleware')
const authRouter = Router()

authRouter.post('/signup', authCtrl.registration)
authRouter.post('/login', authCtrl.login)
authRouter.post('/logout', tokenMiddleware, authCtrl.logout)
authRouter.get('/verify/:verificationToken', authCtrl.verification)
authRouter.post('/verify', authCtrl.repeatVerification)

module.exports = authRouter
