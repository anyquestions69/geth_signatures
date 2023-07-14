const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const auth = require('../middleware/auth.js')
 

userRouter.get('/:id/delete', auth.isAuth, auth.isAdmin, userController.deleteAccount)
userRouter.get("/", userController.getAll);
userRouter.get('/:id', userController.getOne)
userRouter.put('/', auth.isAuth, userController.update)

 
module.exports = userRouter;