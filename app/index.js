const express = require('express')
require("dotenv").config();
const multer = require('multer')
//const groupRouter = require('./routers/groupRouter.js')
const userRouter = require('./routers/userRouter.js')
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
        cb(null, file.originalname);
    }
});
// определение фильтра
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }
 
app.use(multer({storage:storageConfig, fileFilter: fileFilter, dest:"uploads"}).single("filedata"));


app.set("view engine", "hbs");
app.set("views", __dirname+"/views/templates")
hbs.registerPartials(__dirname + "/views/templates/partials");

app.use(cors({origin:'*'}))  
app.use(cookieParser());
app.use(jsonParser)
app.use("/static",express.static(__dirname + "/views/static"))


api.use('/users', userRouter)


app.use('/api', api)
app.use('/', viewRouter)

app.listen(80,()=>{
    console.log('works')
})