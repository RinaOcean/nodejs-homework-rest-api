const User = require('../models/user.model')
const HTTP_STATUS = require('../helpers/httpStatusCodes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joiSchema = require('../utils/validate/joiSchema')
const config = require('../config')
const gravatar = require('gravatar')


const registration = async (req, res) => {
  const { error } = joiSchema.registration.validate(req.body)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad Request',
      responseBody: {
        error: error.message
      },
    })
  }

  const { email, password } = req.body
  const defaultAvatarUrl = gravatar.url(email, { protocol: 'http', d: 'monsterid' })



  try {
    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: '409 Conflict',
        responseBody: {
          message: 'Email in use'
        },
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = await User.create({ email, password: hashedPassword, avatarURL: defaultAvatarUrl })

    res.status(HTTP_STATUS.CREATED).json({
      status: '201 Created',
      responseBody: {
        user: {
          email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
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

    const token = jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: '1d' })

    const currentUser = await User.findByIdAndUpdate({ _id: candidate._id }, { token })

    res.status(HTTP_STATUS.SUCCESS).json({
      status: '200 OK',
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
      responseBody: {
        error: error.message
      },
    })
  }
}

const logout = async (req, res) => {
  const user = req.user

  try {
    const currentUser = await User.findOneAndUpdate({ _id: user.id }, { token: null })

    if (!currentUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Not authorized'
        }
      })
    }

    res.status(HTTP_STATUS.NO_CONTENT).json()
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message })
  }
}

module.exports = { registration, login, logout }
