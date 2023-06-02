const express = require("express");
const fileController = require("../controllers/fileController.js");
const fileRouter = express.Router();
 
fileRouter.get("/", fileController.getAll);
fileRouter.get('/:id', fileController.getOne)
fileRouter.post("/", fileController.post);

 
module.exports = fileRouter;