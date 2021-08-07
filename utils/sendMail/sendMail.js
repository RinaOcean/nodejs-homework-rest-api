const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { SENDGRID_API_KEY } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

const sendMail = async ({ to, subject, text, html }) => {
  const mail = {
    to,
    from: 'katerynatorkachenko@gmail.com',
    subject,
    text,
    html,
  }

  try {
    const answear = await sgMail.send(mail)
    return answear
  } catch (error) {
    console.log(error.response.body)
    throw error
  }
}

module.exports = sendMail
