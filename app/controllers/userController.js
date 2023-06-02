const {User} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
var Web3 = require('web3');
var net = require('net');
var web3 = new Web3(new Web3.providers.IpcProvider(__dirname+'/../../data/geth.ipc', net));

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
        let {name, password} = req.body
        let re = /(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})/g
        if(re.test(name) | re.test(password))
            return res.status(401).send('Не пытайтесь взломать нас')
        const wallet = await web3.eth.personal.newAccount(password)
        let user = await User.create({
            name:name,
            wallet:wallet,
            
        })
        const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
    }

    async login(req,res){
        let {wallet, password} = req.body
        let re=/^0x[a-fA-F0-9]{40}$/g
        if(!re.test(wallet))
            return res.status(401).send('Введите валидный адрес кошелька')
        let user = await User.findOne({where:{
           wallet:wallet
        }
        })
        let auth = await web3.eth.personal.unlockAccount(user.wallet, password)
        if(auth){
            const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
            
            return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(auth)
        }else{
            return res.send(404)
        }
    }

    async viewOne(req,res){
        if(Number.isInteger(parseInt(req.params['id']))){
            return res.render('user.hbs', {
                
                user:req.user
                });
        }else{
            return res.render('index.hbs', {
                
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