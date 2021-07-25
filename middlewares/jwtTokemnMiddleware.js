const HTTP_STATUS = require('../helpers/httpStatusCodes')
const jwt = require('jsonwebtoken')
const config = require('../config')

const User = require('../models/user.model')

const jwtTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: '401 Unauthorized',
      responseBody: {
        message: 'Token is not provided'
      }
    })
  }

  try {
    // jwt.verify(token, config.JWT_SECRET_KEY)

    const user = jwt.verify(token, config.JWT_SECRET_KEY)

    const existingUser = await User.findOne({ _id: user.id })

    if (!existingUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Not authorized'
        }
      })
    }

    if (!existingUser.token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Not logged in'
        }
      })
    }
    req.user = user

    next()
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Token is invalid'
    })
  }
}

module.exports = jwtTokenMiddleware
