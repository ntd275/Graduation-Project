const commentRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const commentController = require('../controllers/commentController')
const notFound = require('./404')

commentRouter.use(authMiddleWare.isAuth)
commentRouter.post('/', commentController.createComment)
commentRouter.put('/:id', commentController.editComment)
commentRouter.delete('/:id', commentController.deleteComment)
commentRouter.get('/get-by-post-id/:id', commentController.getCommentByPostId)

commentRouter.use(notFound);
module.exports = commentRouter