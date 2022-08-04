const conversationRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const conversationController = require('../controllers/conversationController')
const notFound = require('./404')

conversationRouter.use(authMiddleWare.isAuth)
conversationRouter.get('/', conversationController.getConversationList)
conversationRouter.post('/', conversationController.createConversation)
conversationRouter.post('/delete', conversationController.deleteConversation)

conversationRouter.use(notFound);
module.exports = conversationRouter