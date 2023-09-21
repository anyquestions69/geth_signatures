const express = require('express')
require("dotenv").config();
const multer = require('multer')
const fileRouter = require('./routers/fileRouter.js')
const userRouter = require('./routers/userRouter.js')
const authRouter = require('./routers/authRouter.js')
const viewRouter = require('./routers/staticRouter.js')
const hbs = require('hbs')
var cookieParser = require('cookie-parser');
const jsonParser = express.json();
const api = express.Router()
var cors = require('cors')


const app = express()


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, req.body.title+'.'+file.mimetype.split('/')[1]);
    }
});
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "application/pdf"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }

 
app.use(multer({storage:storageConfig, fileFilter: fileFilter, dest:"uploads"}).single("file"));


app.set("view engine", "hbs");
app.set("views", __dirname+"/views/templates")
hbs.registerPartials(__dirname + "/views/templates/partials");

app.use(cors({origin:'*'}))  
app.use(cookieParser());
app.use(jsonParser)
app.use("/static",express.static(__dirname + "/views/static"))
app.use("/uploads",express.static(__dirname + "/uploads"))


api.use('/users', userRouter)
api.use('/files', fileRouter)
api.use('/auth', authRouter)

app.use('/api', api)
app.use('/', viewRouter)

app.listen(3000,()=>{
    console.log('works')
})