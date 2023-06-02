const {User} = require('../models/user')
const config = process.env;

class Auth{
    async isAuth(req,res,next){

        const token = req.cookies.user
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            console.log(err)
      
            if (err) return res.sendStatus(403)
            let exists = await User.findOne({id:user.id})
            if(exists)
                req.user = exists
      
            next()
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