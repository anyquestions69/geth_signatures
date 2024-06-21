const express = require("express");
const multer = require("multer")
const fileController = require("../controllers/fileController.js");
const auth = require('../middleware/auth.js')
const fileRouter = express.Router();
 const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads');  
    },  
    filename:(req,file,cb)=>{  
        cb(null,file.originalname);  
    }  
  });  
fileRouter.get("/", auth.getUser, fileController.getAll);
fileRouter.get("/all", auth.isAuth,auth.isAdmin, fileController.adminGetAll);
fileRouter.get('/:id', fileController.getOne)
fileRouter.post('/:id', auth.isAuth,fileController.assing)
fileRouter.post("/", auth.isAuth, auth.isAdmin, multer({storage:storage}).single("file"), fileController.post);

 
module.exports = fileRouter;