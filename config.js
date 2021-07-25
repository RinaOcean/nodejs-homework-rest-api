const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
const SECRET_KEY = process.env.SECRET_KEY

module.exports = { PORT, MONGO_CONNECTION_STRING, SECRET_KEY }
