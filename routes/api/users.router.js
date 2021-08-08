const { Router } = require('express')
const usersCtrl = require('../../controllers/users.controllers')
const tokenMiddleware = require('../../middlewares/jwtTokenMiddleware')
const uploadMiddleware = require('../../middlewares/uploadMiddleware')
const usersRouter = Router()

usersRouter.get('/users/current', tokenMiddleware, usersCtrl.getCurrent)
usersRouter.patch('/users', tokenMiddleware, usersCtrl.updateSubscription)
usersRouter.patch('/users/avatars', tokenMiddleware, uploadMiddleware.single('avatar'), usersCtrl.updateAvatar)


module.exports = usersRouter
