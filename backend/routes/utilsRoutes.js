const utilsRouter = require('express').Router()
const uploadImage = require('../middlewares/imageUpload')
const uploadVideo = require('../middlewares/videoUpload')
const utilsController = require('../controllers/utilsController')
const authMiddleWare = require('../middlewares/authentication')
const notFound = require('./404')

utilsRouter.use(authMiddleWare.isAuth)
utilsRouter.post('/upload-image', uploadImage, utilsController.uploadImage);
utilsRouter.post('/upload-video', uploadVideo, utilsController.uploadVideo);

utilsRouter.use(notFound);
module.exports = utilsRouter