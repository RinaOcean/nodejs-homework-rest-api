const User = require('../models/user.model')
const HTTP_STATUS = require('../helpers/httpStatusCodes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joiSchema = require('../utils/validate/joiSchema')
const config = require('../config')

const registration = async (req, res) => {
  const { error } = joiSchema.registration.validate(req.body)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad Request',
      type: 'application/json',
      responseBody: {
        error: error.message
      },
    })
  }

  const { email, password } = req.body

  try {
    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: '409 Conflict',
        type: 'application/json',
        responseBody: {
          message: 'Email in use'
        },
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = await User.create({ email, password: hashedPassword })

    res.status(HTTP_STATUS.CREATED).json({
      status: '201 Created',
      type: 'application/json',
      responseBody: {
        user: {
          email, subscription: user.subscription,
        }
      }
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message })
  }
}

const login = async (req, res) => {
  const { error } = joiSchema.login.validate(req.body)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad Request',
      type: 'application/json',
      responseBody: {
        error: error.message
      },
    })
  }

  const { email, password } = req.body

  try {
    const candidate = await User.findOne({ email })

    if (!candidate) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Email or password is wrong'
        }
      })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, candidate.password)

    if (!isPasswordCorrect) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Email or password is wrong'
        }
      })
    }

    const payload = {
      email,
      id: candidate._id,
    }

    const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: '3d' })

    const currentUser = await User.findByIdAndUpdate({ _id: candidate._id }, { token })

    res.status(HTTP_STATUS.SUCCESS).json({
      status: '200 OK',
      type: 'application/json',
      responseBody: {
        token,
        user: {
          email: currentUser.email,
          subscription: currentUser.subscription
        }
      }
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad Request',
      type: 'application/json',
      responseBody: {
        error: error.message
      },
    })
  }
}

module.exports = { registration, login }
