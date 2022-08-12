const postRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const postController = require('../controllers/postController')
const notFound = require('./404')

postRouter.use(authMiddleWare.isAuth)
postRouter.post('/', postController.createPost)
postRouter.post('/search', postController.search)
postRouter.put('/:id', postController.editPost)
postRouter.delete('/:id', postController.deletePost)
postRouter.get('/get-post-in-profile/:id', postController.getPostListInProfile)
postRouter.get('/get-post-in-new-feed', postController.getPostListInNewFeed)
postRouter.get('/notifications', postController.getNotifications)
postRouter.get('/:id', postController.getPostById)

postRouter.use(notFound);
module.exports = postRouter