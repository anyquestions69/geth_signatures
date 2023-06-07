const {User, File} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
var Web3 = require('web3');
var net = require('net');
var web3 = new Web3(new Web3.providers.IpcProvider(__dirname+'/../../data/geth.ipc', net));

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, users, totalPages, currentPage };
  };

class Manager{
   
    async getOne(req,res){
        let user = await User.findOne({where:{id:req.params['id']}})
        return res.send(user)
    }

    async getAll(req,res){
        let page=req.query.page
        var limit =5
        let result= await User.findAndCountAll( {offset: page>=1?((page-1)*2):0, limit: limit})
        let resData= getPagingData(result, page, limit)
        return res.send(resData)
    }

    async register(req, res){
        try{
            let {name, password} = req.body
            let re = /(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})/g
            if(re.test(name) | re.test(password))
                return res.status(401).send('Не пытайтесь взломать нас')
            const wallet = await web3.eth.personal.newAccount(password)
            let exists = await User.findOne({where:{name:name}})
            if(exists)
                return res.status(401).send('Пользователь с таким именем уже существует. Попросите администратора удалить Ваш старый аккаунт прежде чем создавать новый.')
            let user = await User.create({
                name:name,
                wallet:wallet,
                
            })
            const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
            return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user)
        }catch(e){
            return res.status(404).send(e)
        }
    }

    async login(req,res){
        try{
            let {wallet, password} = req.body
            let re=/^0x[a-fA-F0-9]{40}$/g
            if(!re.test(wallet))
                return res.status(401).send('Введите валидный адрес кошелька')
            let user = await User.findOne({where:{
            wallet:wallet
            }
            })
            if(!user)
                return res.status(401).send('Такого кошелька не существует')
            let auth = await web3.eth.personal.unlockAccount(user.wallet, password)
            if(auth){
                const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
                
                return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(auth)
            }else{
                return res.send(404)
            }
        }catch(e){
            return res.status(404).send(e)
        }
    }

    async logout(req,res){
        return res.clearCookie("user").redirect('/');
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

    
    
}
let manager = new Manager()
module.exports = manager