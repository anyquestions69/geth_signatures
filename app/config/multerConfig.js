const multer = require("multer")
const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads');  
    },  
    filename:(req,file,cb)=>{  
        cb(null,Date.now()+".pdf");  
    }  
  });  
  module.exports= multer({storage:storage})