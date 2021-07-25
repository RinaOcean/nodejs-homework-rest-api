const User = require('../models/user.model')
const HTTP_STATUS = require('../helpers/httpStatusCodes')

const getCurrent = async (req, res) => {
  const user = req.user

  try {
    const currentUser = await User.findById({ _id: user.id })

    if (!currentUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        responseBody: {
          message: 'Not authorized'
        }
      })
    }

    res.status(HTTP_STATUS.SUCCESS).json({
      status: '200 OK',
      responseBody: {
        email: currentUser.email,
        subscription: currentUser.subscription,
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

module.exports = getCurrent
