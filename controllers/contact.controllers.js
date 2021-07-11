const Contact = require('../model/contact.model')
const db = require('../db/connection')
// const Joi = require('joi')
const HTTP_STATUS = require('../helpers/httpStatusCodes')
const joiSchema = require('../utils/validate/joiSchema')

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
  const { error } = joiSchema.addContact.validate(req.body)

  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'bad request',
      code: HTTP_STATUS.BAD_REQUEST,
      message: 'email should ends with \'com\' or \'net\', phone should be in (XXX) XXX-XXXX format',
    })
  }

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
    await Contact.findOneAndDelete({ _id: id })

    res.json({
      message: 'contact removed'
    })
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      code: HTTP_STATUS.NOT_FOUND,
      message: 'not found',
    })
  }
}

const updateContact = async (req, res) => {
  const { error } = joiSchema.updateContact.validate(req.body)

  if (error) {
    return res.status(400).json({
      status: 'bad request',
      code: 400,
      message: 'email should ends with \'com\' or \'net\', phone should be in (XXX) XXX-XXXX format',
    })
  }

  const body = req.body

  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing fields'
    })
  }

  const id = req.params.contactId

  try {
    const result = await Contact.findOneAndUpdate({ _id: id }, { ...body }, { new: true })

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        code: HTTP_STATUS.NOT_FOUND,
        message: 'not found'
      })
    }

    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      code: HTTP_STATUS.SUCCESS,
      data: result,
      message: 'contact updated'
    })
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message })
  }
}

const updateStatusContact = async (req, res) => {
  const id = req.params.contactId
  const favorite = req.body.favorite
  const body = req.body

  if (Object.keys(body).length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'missing field favorite' })
  }

  try {
    const result = await Contact.findByIdAndUpdate({ _id: id }, { favorite: favorite }, { new: true })

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'not found' })
    }
    res.status(HTTP_STATUS.SUCCESS).json({
      status: 'success',
      code: HTTP_STATUS.SUCCESS,
      data: result,
      message: 'Contact status was updated',
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message })
  }
}

module.exports = { listContacts, addContact, getContactById, removeContact, updateContact, updateStatusContact }
