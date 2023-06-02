const express = require("express");
const groupController = require("../controllers/groupController.js");
const groupRouter = express.Router();
 
groupRouter.get('/cat/show', groupController.getActCat)
groupRouter.get('/dst/show', groupController.getDistrics)
groupRouter.get("/", groupController.getGroups);
groupRouter.get('/:id', groupController.getOne)

 
module.exports = groupRouter;