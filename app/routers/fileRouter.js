const express = require("express");
const fileController = require("../controllers/fileController.js");
const auth = require('../middleware/auth.js')
const fileRouter = express.Router();
 
fileRouter.get("/", auth.getUser, fileController.getAll);
fileRouter.get('/:id', fileController.getOne)
fileRouter.post('/:id', auth.isAuth,fileController.assing)
fileRouter.post("/", auth.isAuth, auth.isAdmin, fileController.post);

 
module.exports = fileRouter;