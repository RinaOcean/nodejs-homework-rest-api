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

}

module.exports = joiSchema
