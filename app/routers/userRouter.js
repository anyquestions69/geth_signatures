const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
 
userRouter.get("/", userController.getAll);
userRouter.get('/:id', userController.getOne)

 
module.exports = userRouter;