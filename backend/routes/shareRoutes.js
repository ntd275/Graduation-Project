const shareRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const shareController = require('../controllers/shareController')
const notFound = require('./404')

shareRouter.use(authMiddleWare.isAuth)
shareRouter.post('/get-share-by-post-id', shareController.getShareInPost)

shareRouter.use(notFound);
module.exports = shareRouter