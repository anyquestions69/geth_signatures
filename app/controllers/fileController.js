const {File} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const multer = require('multer')

const upload = multer({dest:"uploads"})

class Manager{
   
    async getOne(req,res){
        let file = await File.findOne({where:{id:req.params['id']}})
        return res.send(file)
    }

    async getAll(req,res){
        let file = await File.findAll()
        return res.send(file)
    }

    async post(req, res){
        let filedata = req.file;
       /*  let user = await File.create({
            name:name,
            wallet:'',
            
        }) */
        res.send(filedata)
    }

    async viewOne(req,res){
        if(Number.isInteger(parseInt(req.params['id']))){
            return res.render('article.hbs', {
                
                user:{user:req.params['id']}
                });
        }else{
            return res.render('index.hbs', {
                api_key:process.env.API_KEY
                });
        }
        
    }
    
    async assing(req,res){
        /* let usr = await User.findOne({where:{id:req.user.id}})
        if(!usr)return res.send('Необходимо авторизоваться')
        let act = await Activity.findOne({where:{id:req.params['id']}})
        let result = await usr.addActivity(act, {through:{date:new Date()}})
        console.log(result)
        if(result){
            return res.send('Вы успешно записались!')
        }
        return res.send('Ошибка') */
    }
}
let manager = new Manager()
module.exports = manager