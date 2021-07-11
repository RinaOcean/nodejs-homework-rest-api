const express = require('express')
const router = express.Router()
const contactCtrls = require('../../controllers/contact.controllers')

router.get('/', contactCtrls.listContacts)

router.get('/:contactId', contactCtrls.getContactById)

router.post('/', contactCtrls.addContact)

router.delete('/:contactId', contactCtrls.removeContact)

router.put('/:contactId', contactCtrls.updateContact)

router.patch('/:contactId/favorite', contactCtrls.updateStatusContact)

module.exports = router
