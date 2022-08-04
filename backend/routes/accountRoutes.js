const accountRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const accountController = require('../controllers/accountController')
const notFound = require('./404')

accountRouter.use(authMiddleWare.isAuth)
accountRouter.get('/:id', accountController.getAccountById)
accountRouter.put('/:id', accountController.editAccount)
accountRouter.post("/change-password", accountController.changePassword)

accountRouter.use(notFound);
module.exports = accountRouter