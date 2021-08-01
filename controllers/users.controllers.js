const User = require('../models/user.model')
const HTTP_STATUS = require('../helpers/httpStatusCodes')
const joiSchema = require('../utils/validate/joiSchema')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')

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

const updateSubscription = async (req, res) => {
  const { error } = joiSchema.updateSubscription.validate(req.body)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad request',
      message: 'subscription is required and might be \'starter\', \'pro\' or \'business\' '
    })
  }

  const currentUser = req.user
  const { subscription } = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: currentUser.id }, { subscription })

    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      message: 'users subscrtiption updated',
      responseBody: {
        email: updatedUser.email,
        subscription,
      }
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message })
  }
}

const updateAvatar = async (req, res) => {
  const { error } = joiSchema.updateAvatar.validate(req.file)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: '400 Bad request',
      message: 'avatar is required and must  have \'.jpeg\', or \'.png\' extension'
    })
  }

  const { path: tempName, originalname } = req.file
  const currentUser = req.user

  const uploadDir = path.join(process.cwd(), 'public/avatars')
  const fileName = path.join(uploadDir, originalname)
  const resizedImg = await Jimp.read(tempName)
  resizedImg.resize(250, 250)

  try {
    await User.findByIdAndUpdate({ _id: currentUser.id }, { avatarURL: fileName })

    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      message: 'users avatar updated',
      responseBody: {
        avatarURL: fileName,
      }
    })
    fs.rename(tempName, fileName)
  } catch (error) {
    fs.unlink(tempName)
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: error.message })
  }
}

module.exports = { getCurrent, updateSubscription, updateAvatar }
