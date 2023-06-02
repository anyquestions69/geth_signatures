/* const {User, Visitor} = require('../models/user')
const config = process.env;
const IP = require('ip');

class Visit{
    async newUser(req,res,next){
        req.ip_addr = IP.address()
        if(req.user){
            req.newUser = false
            next()
        }else{
            const visitor = await Visitor.findOne({where:{ip:req.ip_addr}})
            if(!visitor){
                req.newUser = true
                const newUser = await Visitor.create({
                    ip:req.ip_addr
                  });
            }else{
                req.newUser = false
            }
            next()
        }
    }
}
module.exports = new Visit() */