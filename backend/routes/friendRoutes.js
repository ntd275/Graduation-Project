const friendRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const friendController = require("../controllers/friendController")
const notFound = require('./404')

friendRouter.use(authMiddleWare.isAuth)
friendRouter.get('/friend-list/:id', friendController.getFriendList)
friendRouter.get('/suggest-list', friendController.getSuggestFriend)
friendRouter.post('/unfriend', friendController.unFriend)

friendRouter.use(notFound);
module.exports = friendRouter