const friendRequestRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const friendRequestController = require("../controllers/friendRequestController")
const notFound = require('./404')

friendRequestRouter.use(authMiddleWare.isAuth)
friendRequestRouter.get('/send', friendRequestController.getSendFriendRequestList)
friendRequestRouter.get('/', friendRequestController.getFriendRequestList)
friendRequestRouter.post('/', friendRequestController.sendFriendRequest)
friendRequestRouter.post('/delete', friendRequestController.cancelFriendRequest)
friendRequestRouter.post('/accept', friendRequestController.acceptFriendRequest)
friendRequestRouter.post('/refuse', friendRequestController.refuseFriendRequest)

friendRequestRouter.use(notFound);
module.exports = friendRequestRouter