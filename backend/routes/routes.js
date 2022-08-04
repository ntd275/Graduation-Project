const notFound = require('./404')
const authRoute = require('./authRoutes');
const likeRouter = require('./likeRoutes');
const postRouter = require('./postRoutes');
const utilsRouter = require('./utilsRoutes');
const commentRouter = require('./commentRoutes');
const shareRouter = require('./shareRoutes');
const accountRouter = require('./accountRoutes');
const friendRequestRouter = require('./friendRequestRoutes');
const friendRouter = require('./friendRoutes');
const conversationRouter = require('./conversationRoutes');
const messageRouter = require('./messageRoutes');

module.exports = (app) => {
  app.use('/auth', authRoute)
  app.use('/utils', utilsRouter)
  app.use('/post', postRouter)
  app.use('/like', likeRouter)
  app.use('/comment', commentRouter)
  app.use('/share', shareRouter)
  app.use("/account", accountRouter)
  app.use("/friend-request", friendRequestRouter)
  app.use('/friend', friendRouter)
  app.use("/conversation", conversationRouter)
  app.use("/message", messageRouter)
  app.use(notFound);
};
