const {User, File} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.DB_HOST}:8545`));

User.findOne({where:{name:"Администратор"}}).then(async(user)=>{
    if(!user){
    let wall = await web3.eth.personal.newAccount("61kafAdmin")
    let admin = await User.create({
        name:"Администратор",
        wallet:wall,
        isAdmin:true
    })
}
})

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
            let {name, password,repass} = req.body
            if(name)
                if(name.replace(' ','')=='')
                    return res.status(401).send('Заполните ФИО')
            let re = /(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})/g
            if(re.test(name) | re.test(password))
                return res.status(401).send('Не пытайтесь взломать нас')
            if(repass!=password)
                return res.status(401).send('Пароли не совпадают')
            const wallet = await web3.eth.personal.newAccount(password)
            let exists = await User.findOne({where:{name:name}})
            if(exists)
                return res.status(401).send('Пользователь с таким именем уже существует. Попросите администратора удалить Ваш старый аккаунт прежде чем создавать новый.')
            let user = await User.create({
                name:name,
                wallet:wallet,
                
            })
            const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
            return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(user.wallet)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }

    async login(req,res){
        try{
            let {wallet, password} = req.body
            /* let re=/^0x[a-fA-F0-9]{40}$/g
            if(!re.test(wallet))
                return res.status(401).send({error:'Введите валидный адрес кошелька'}) */
            let user = await User.findOne({where:{name:wallet}})
            if(!user)
                user = await User.findOne({where:{wallet:wallet}})
            if(!user)
                return res.status(401).send({error:'Такого кошелька не существует'})
            let auth = await web3.eth.personal.unlockAccount(user.wallet, password)
            if(auth){
                const token = jwt.sign({id:user.id, admin:user.isAdmin}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
               
                return res.cookie('user',token, { maxAge: 900000, httpOnly: true }).send(auth)
            }else{
                return res.status(404).send({error:'Неверный пароль'})
            }
        }catch(e){
            return res.status(404).send({error:'Неверный пароль'})
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

    async update(req,res){
        try {
            let {name, password} = req.body
            if(name){
                if(name.replace(' ','')=='')
                    return res.status(401).send('Заполните ФИО')
            }
            let re = /(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})/g
            if(re.test(name) | re.test(password))
                return res.status(401).send('Не пытайтесь взломать нас')
            
            let auth = await web3.eth.personal.unlockAccount(req.user.wallet, password)
            if(auth){
                let usr = await User.update({name:name},{where:{id:req.user.id}})
                return res.send(usr)
            }else{
                return res.status(404).send('Неверный пароль')
            }
        } catch (error) {
            return res.status(404).send('Неверный пароль')
        }
    }
    async deleteAccount(req,res){
        let user = await User.destroy({where:{id:req.params['id']}})
        await web3.eth.accounts.wallet.remove(user.wallet)
        return res.redirect('/admin')
    }
    
    
}
let manager = new Manager()
module.exports = manager