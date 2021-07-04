const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
} = require('../../model')

// const contactsList = [
//   {
//     title: 'Work',
//     text: 'Do it!',
//     done: false,
//   },
// ]

router.get('/', async (req, res, next) => {
  const contactsList = await listContacts()
  res.json({
    status: 'success',
    code: 200,
    data: { contactsList, },
    message: 'OK',
  })
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const id = +contactId
  const contact = await getContactById(id)

  if (contact.length === 0) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'not found',
    })
  } else {
    return res.json({
      status: 'success',
      code: 200,
      data: { contact },
      message: 'contact found',

    })
  }
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
