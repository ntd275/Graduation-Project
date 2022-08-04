const messageRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const messageController = require('../controllers/messageController')
const notFound = require('./404')

messageRouter.use(authMiddleWare.isAuth)
messageRouter.post('/get-list', messageController.getMessageInConversation)
messageRouter.post('/create', messageController.createMessage)
messageRouter.post('/recall', messageController.recallMessage)
messageRouter.post('/call', messageController.createMessageCall)

messageRouter.use(notFound);
module.exports = messageRouter