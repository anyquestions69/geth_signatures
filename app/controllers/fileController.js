const {File, User, Signature} = require('../models/user')
const { Op, QueryTypes } = require("sequelize");
const sequelize = require('../config/database')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.GETH_HOST}:8545`));


const getUserPagingData = (data, page, limit, uid) => {
    const { count: totalItems, rows: files } = data;
    for(let i=0;i<files.length;i++){
        files[i].signed=0
        if(files[i].users.some(u=>u.id==uid)){
            files[i].signed=1
            continue
        }
        console.log(files[i].signed)
    }
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems/ limit);
    return { totalItems, files, totalPages, currentPage };
  };

  const getPagingData = (data, page, limit) => {
    let { count: totalItems, rows: files } = data;
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
        let {page, name} = req.query
        let users = await User.count()
        let result
        let resData
        let filter=[]
        if(name){
            filter.push({name:{
                [Op.substring]: name
            }})
        }
        if(req.user){
            result = await File.findAndCountAll( {
                include:[{
                    model:User,/* 
                    where:{
                        id:{
                            [Op.ne]:parseInt(req.user.id)
                        }
                    },
                    through:{
                        where:{
                        userId:{
                            [Op.ne]:parseInt(req.user.id)
                        }
                        }
                    },required:false */
                }],
                where:{
                    [Op.and]:[filter[0],{status:false}]
                },
                required:false,
                offset: page>=1?((page-1)*10):0, limit: 10,
                order: [
                    [ 'id', 'DESC']
                  ]})
            resData= getUserPagingData(result, page, 10, req.user.id)
            //resData= getPagingData(result, page, 10)
        }else{
            result = await File.findAndCountAll( {
            include:[{
                model:User,
                through:{}
            }],
            where:{
                [Op.and]:[filter[0],{status:false}]
            },
            offset: page>=1?((page-1)*10):0, limit: 10,
            order: [
                [ 'id', 'DESC']
              ]})
            resData= getPagingData(result, page, 10)
        }
        
        resData.userCount=users
        return res.send(resData)
    }

    async adminGetAll(req,res){
        let {page} = req.query
        let users = await User.count()
        let result
        let resData

        result = await File.findAndCountAll( {
        include:[{
            model:User,
            through:{}
        }],
        offset: page>=1?((page-1)*10):0, limit: 10,
        order: [
            [ 'id', 'DESC']
            ]})
        resData= getPagingData(result, page, 10)
        
        
        resData.userCount=users
        return res.send(resData)
    }

    async checkSignature(req,res){
        try {
            let {sig}=req.body
            let file = await File.findByPk(req.params['id'])
            if(file){
                    let result = await web3.eth.personal.ecRecover(file.name, sig)
                    let user = await User.findOne({where:{wallet:result}})
                    return res.send({user:user.name, wallet:result})
            }
        } catch (error) {
            return res.status(404).send(error)
        }
        
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
            let users = await User.count()
            if(!usr)return res.send('Необходимо авторизоваться')
            let file = await File.findOne({where:{id:req.params['id']}, include:{model:User}})
            var exists = await file.hasUser(usr)
            if(exists)
                return res.status(404).send('Вы уже расписались!')
            const signature = await web3.eth.personal.sign(file.name, req.user.wallet, password )
            let result = await file.addUser(req.user, {through:{hash:signature}})
            if(file.users.length+1==users){
                file.status=true
            }
            await file.save()
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