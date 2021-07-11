const Contact = require('../model/contact.model')
const db = require('../db/connection')
const Joi = require('joi')
const HTTP_STATUS = require('../helpers/httpStatusCodes')

const listContacts = async (req, res) => {
  try {
    const result = await Contact.find()

    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      code: HTTP_STATUS.SUCCESS,
      data: result,
      message: 'OK',
    })
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'not found',
      code: HTTP_STATUS.NOT_FOUND,
      message: error.message,
    })
  }
}

const addContact = async (req, res) => {
  // const bodySchema = Joi.object({
  //   name: Joi.string().min(2).required(),
  //   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  //   phone: Joi.string().required(),
  // })
  // const { error } = bodySchema.validate(req.body)
  // if (error) {
  //   return res.status(HTTP_STATUS.BAD_REQUEST).json({
  //     status: 'bad request',
  //     code: HTTP_STATUS.BAD_REQUEST,
  //     message: error.message,
  //   })
  // }

  const body = req.body

  try {
    const result = await Contact.create(body)

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      code: HTTP_STATUS.CREATED,
      data: result,
      message: 'New contact created',
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      code: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
    })
  }
}

const getContactById = async (req, res) => {
  const id = req.params.contactId

  try {
    const result = await Contact.findOne({ _id: id })

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        code: HTTP_STATUS.NOT_FOUND,
        message: `There's no contact with id: ${id}`,
      })
    }

    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      code: HTTP_STATUS.SUCCESS,
      data: result,
      message: 'contact found',
    })
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'not found',
      code: HTTP_STATUS.NOT_FOUND,
      message: error.message,
    })
  }
}

const removeContact = async (req, res) => {
  const id = req.params.contactId

  try {
    const result = await Contact.findOneAndDelete({ _id: id })

    if (!result) {
      res.status(HTTP_STATUS.NO_CONTENT).json({
        status: 'error',
        code: HTTP_STATUS.NOT_FOUND,
        message: 'contact not found'
      })
    }
    res.json({
      message: 'contact removed'
    })
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      code: HTTP_STATUS.NOT_FOUND,
      message: error.message,
    })
  }
}

module.exports = { listContacts, addContact, getContactById, removeContact }
