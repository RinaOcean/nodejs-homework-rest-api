const mongoose = require('mongoose')
const config = require('../config')

const db = mongoose.connect(config.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const dbConnect = mongoose.connection
dbConnect.on('error', console.error.bind(console, 'connection error:'))
dbConnect.once('open', function () {
  console.log('Database connection successful')
})

module.exports = db
