const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const auth = require('../middleware/auth.js')
 
userRouter.post("/register", userController.register);
userRouter.post('/login', userController.login)
userRouter.get('/logout', auth.isAuth, userController.logout)

 
module.exports = userRouter;