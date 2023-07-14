const {User} = require('../models/user')
const config = process.env;
const jwt = require('jsonwebtoken')

class Auth{
    async getUser(req,res,next){
        const token = req.cookies.user
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            let exists = await User.findOne({where:{id:user.id}})
            if(exists)
                req.user = exists
            
                
        })
        }
        next()
    }
    async isAuth(req,res,next){

        const token = req.cookies.user
        if (token == null) return res.sendStatus(401)

        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            console.log(err)
      
            if (err) return res.sendStatus(403)
            let exists = await User.findOne({where:{id:user.id}})
            if(exists){
                req.user = exists
                next()
            }else{
                return res.sendStatus(403)
            }
        })
        
    }
    async isAdmin(req,res,next){
        if(!req.user.isAdmin){
            return res.send('Не авторизован')
        }
        
            next()
        
    }
}
module.exports = new Auth()