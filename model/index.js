const fs = require('fs').promises
const path = require('path')
// const contacts = require('./contacts.json')

const contactsPath = path.join(__dirname, './contacts.json')

const { nanoid } = require('nanoid')

const listContacts = async () => {
  try {
    const rawContacts = await fs.readFile(contactsPath)
    const allContacts = JSON.parse(rawContacts)

    return allContacts
  } catch (error) {
    console.error(error)
  }
}

const getContactById = async (contactId) => {
  try {
    const contact = await listContacts().then((contacts) => contacts.filter(contact => contact.id === contactId))

    return contact
  } catch (error) {
    console.error(error)
  }
}

const removeContact = async (contactId) => { }

const addContact = async (body) => { }

const updateContact = async (contactId, body) => { }

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
