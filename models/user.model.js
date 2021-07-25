const { Schema, model, SchemaTypes } = require('mongoose')

const user = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'bussiness'],
    default: 'starter',
  },
  token: {
    type: String,
    default: null
  },
})

const User = model('users', user)

module.exports = User
