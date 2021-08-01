const multer = require('multer')
const path = require('path')

const tempDir = path.join(process.cwd(), 'tmp')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir)
  },
  filename: (req, file, cb) => {
    const ext = path.parse(file.originalname).ext
    cb(null, Date.now() + ext)
  },
  limits: {
    fileSize: 10000
  },

})

const uploadMiddleware = multer({ storage })

module.exports = uploadMiddleware
