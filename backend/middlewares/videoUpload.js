const multer = require('multer')
const path = require('path')

const videoDir = path.join('./public/videos')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, videoDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const checkFileType = (req, file, callback) => {
    const fileTypes = /mp4|wmv|avi|3gb|webm|mov/
    let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    let mimetype = fileTypes.test(file.mimetype)

    if (extname && mimetype) {
        return callback(null, true)
    }

    return callback('Error: Video only!', false)
}

const uploadVideo = multer({
    storage: storage,
    limits: {
        fileSize: 200 * 1024 * 1024
    },
    fileFilter: checkFileType
}).single('video')

module.exports = uploadVideo