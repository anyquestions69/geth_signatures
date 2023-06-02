const express = require("express");
const viewRouter = express.Router();
var path = require('path');
const auth = require('../middleware/auth.js')
const fileController = require('../controllers/fileController.js')
const {User}=require('../models/user.js')
const Sequelize = require('sequelize')

viewRouter.get('/',auth.getUser,async(req,res)=>{
   console.log(req.user)
        return  res.render('index.hbs', {
            user:req.user
        });

})
viewRouter.get('/test',(req,res)=>{
    return res.render('test.hbs',{
        api_key:process.env.API_KEY,
        host:process.env.HOST
    })
})
viewRouter.get('/register',(req,res)=>{
    return res.render('register.hbs')
})
viewRouter.get('/login',(req,res)=>{
    return res.render('login.hbs')
})
viewRouter.get('/admin',(req,res)=>{
    return res.render('admin.hbs')
})
viewRouter.get('/files/:id',auth.getUser, fileController.viewOne)



module.exports = viewRouter