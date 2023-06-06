const {File, User, Signature} = require('../models/user')
const { Op } = require("sequelize");
const sequelize = require('../config/database')
const multer = require('multer')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: files } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, files, totalPages, currentPage };
  };

class Manager{
   
    async getOne(req,res){
       
        let file = await File.findOne({
            where:{id:req.params['id']}})
        
        return res.send(file)
    }

    async getAll(req,res){
        let {page} = req.query
        let users = await User.count()
        let result
        if(req.user){
            result = await File.findAndCountAll( {
                include:[{
                    model:User,
                    where:{
                           id:{[Op.ne]:req.user.id}
                     }, required:true,
                    through:{
                        id:{[Op.ne]:req.user.id}
                    , required:true,
                    }                                              
                    
                }],
                offset: page>=1?((page-1)*10):0, limit: 10,
                order: [
                    [User, Signature, 'id', 'DESC']
                  ]})
        }else{
            result = await File.findAndCountAll( {
            include:[{
                model:User,
                through:{}
            }],
            offset: page>=1?((page-1)*10):0, limit: 10,
            order: [
                [User, Signature, 'id', 'DESC']
              ]})
        }
        let resData= getPagingData(result, page, 10)
        resData.userCount=users
        return res.send(resData)
    }

    async post(req, res){
        let file = await File.create({
            name:req.body.title,
            path:'/'+req.file.path,
            status:false
        })
        res.send(file)
    }

    async viewOne(req,res){
        if(Number.isInteger(parseInt(req.params['id']))){
            const file = await File.findOne({
              include: [
                {
                  model: User,
                  attributes: ['id', 'name', 'wallet'],
                  through: {
                    attributes: [],
                  }
                },
              ],where:{id:req.params['id']}})
            var exists =false
            if(req.user)
                exists = await req.user.hasFile(file)
            return res.render('article.hbs', {
                user:req.user,
                file:file,
                isSigned:exists
                });
        }else{
            return res.render('index.hbs', {
                api_key:process.env.API_KEY
                });
        }
        
    }
    
    async assing(req,res){
        try {
            const password = req.body.password
            console.log(password)
            console.log(req.user)
            let usr = await User.findOne({where:{id:req.user.id}})
            if(!usr)return res.send('Необходимо авторизоваться')
            let file = await File.findOne({where:{id:req.params['id']}})
            var exists = await file.hasUser(usr)
            if(exists)
                return res.status(404).send('Вы уже расписались!')
            const signature = await web3.eth.personal.sign(file.name, req.user.wallet, password )
            let result = await file.addUser(req.user, {through:{hash:signature}})
            if(result){
                return res.send('Вы успешно расписались!')
            }
            return res.status(404).send('Ошибка')
        } catch (error) {
            return res.status(404).send(error)
        }
       
    }
}
let manager = new Manager()
module.exports = manager