const User = require('../models/user.model')
const HTTP_STATUS = require('../helpers/httpStatusCodes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registration = async (req, res) => {
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
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
  }
}

module.exports = { registration }