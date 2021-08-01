const { Router } = require('express')
const authCtrl = require('../../controllers/user.auth.controllers')
const tokenMiddleware = require('../../middlewares/jwtTokemnMiddleware')
const authRouter = Router()

authRouter.post('/signup', authCtrl.registration)
authRouter.post('/login', authCtrl.login)
authRouter.post('/logout', tokenMiddleware, authCtrl.logout)

module.exports = authRouter
