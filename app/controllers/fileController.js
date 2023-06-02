const {File} = require('../models/user')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
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
       
        let file = await File.findOne({where:{id:req.params['id']}})
        
        return res.send(file)
    }

    async getAll(req,res){
        let {page} = req.query
        let result= await File.findAndCountAll( {offset: page>=1?((page-1)*10):0, limit: 10})
        let resData= getPagingData(result, page, 10)
        return res.send(resData)
    }

    async post(req, res){
        let filedata = req.file;
        let file = await File.create({
            name:req.body.title,
            path:'/'+req.file.path,
            status:false
        })
        res.send(file)
    }

    async viewOne(req,res){
        if(Number.isInteger(parseInt(req.params['id']))){
            const file = await File.findOne({where:{id:req.params['id']}})
            return res.render('article.hbs', {
                user:req.user,
                file:file
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