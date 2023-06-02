const express = require("express");
const viewRouter = express.Router();
var path = require('path');
//const visit = require('../middleware/visitor.js')
const groupController = require('../controllers/groupController.js')
const {Group}=require('../models/user.js')
const Sequelize = require('sequelize')

viewRouter.get('/',async(req,res)=>{
    let result = await Group.findAll({attributes: [
               
        [Sequelize.fn('DISTINCT', Sequelize.col('cat_1')) ,'cat_1'],


    ]})
    let dst = await Group.findAll({attributes: [
               
        [Sequelize.fn('DISTINCT', Sequelize.col('district')) ,'district'],


    ]})
        return  res.render('index.hbs', {
            
            select:result,
            district:dst
            });

})
viewRouter.get('/test',(req,res)=>{
    return res.render('test.hbs',{
        api_key:process.env.API_KEY,
        host:process.env.HOST
    })
})
viewRouter.get('/groups/:id', groupController.viewOne)



module.exports = viewRouter