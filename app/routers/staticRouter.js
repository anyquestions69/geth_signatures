const express = require("express");
const viewRouter = express.Router();
var path = require('path');
const auth = require('../middleware/auth.js')
const fileController = require('../controllers/fileController.js')
const userController = require('../controllers/userController.js')
const {User}=require('../models/user.js')
const Sequelize = require('sequelize')

viewRouter.get('/',auth.getUser,async(req,res)=>{
        return  res.render('index.hbs', {
            user:req.user
        });

})

viewRouter.get('/register',(req,res)=>{
    return res.render('register.hbs')
})
viewRouter.get('/login',(req,res)=>{
    return res.render('login.hbs')
})
viewRouter.get('/admin', auth.isAuth, auth.isAdmin,(req,res)=>{
    
    return res.render('admin.hbs',{
        user:req.user
    })
})
viewRouter.get('/files/:id',auth.getUser, fileController.viewOne)
viewRouter.get('/users/:id',auth.isAuth, userController.viewOne)



module.exports = viewRouter