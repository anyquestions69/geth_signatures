const {User} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
class Manager{
   
    async getOne(req,res){
        let user = await User.findOne({where:{id:req.params['id']}})
        return res.send(user)
    }

    async getAll(req,res){
        let users = await User.findAll()
        return res.send(users)
    }

    async register(req, res){
        let {name, password} = req.query
        let user = await User.create({
            name:name,
            wallet:'',
            
        })
        const token = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        
        res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
    }

    async login(req,res){
        let {name, password} = req.query
        let user = await User.create({
            name:name,
            wallet:'',
            
        })
    }

    async viewOne(req,res){
        if(Number.isInteger(parseInt(req.params['id']))){
            return res.render('user.hbs', {
                
                user:{user:req.params['id']}
                });
        }else{
            return res.render('index.hbs', {
                api_key:process.env.API_KEY,
                group:group
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