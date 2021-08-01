const Joi = require('joi')

const joiSchema = {
  addContact: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().pattern(/^(\(\d{3}\))(\s)\d{3}(-)\d{4}$/).required(),
  }),

  updateContact: Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().pattern(/^(\(\d{3}\))(\s)\d{3}(-)\d{4}$/),
  }),

  registration: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(4).required(),
  }),

  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(4).required()
  }),

  updateSubscription: Joi.object({
    subscription: Joi.string().required()
  }),
  updateAvatar: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid('image/png', 'image/jpeg'),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    size: Joi.number(),

  }).required()

}

module.exports = joiSchema
