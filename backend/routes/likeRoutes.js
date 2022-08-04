const likeRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const likeController = require("../controllers/likeController")
const notFound = require('./404')

likeRouter.use(authMiddleWare.isAuth)
likeRouter.post('/like', likeController.like)
likeRouter.post('/unlike', likeController.unLike)
likeRouter.post('/get-like', likeController.getLikeInPost)

likeRouter.use(notFound);
module.exports = likeRouter