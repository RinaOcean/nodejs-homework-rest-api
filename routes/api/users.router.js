const { Router } = require('express')
const usersCtrl = require('../../controllers/users.controllers')
const tokenMiddleware = require('../../middlewares/jwtTokemnMiddleware')

const usersRouter = Router()

usersRouter.get('/users/current', tokenMiddleware, usersCtrl.getCurrent)
usersRouter.patch('/users', tokenMiddleware, usersCtrl.updateSubscription)

module.exports = usersRouter
