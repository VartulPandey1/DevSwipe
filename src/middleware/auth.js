const jwt = require("jsonwebtoken")
const User = require("../model/user")
const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(token){
            const {_id} = await jwt.verify(token,"secretKey")
            const user = await User.findById(_id)
            if(user){
                req.user = user
                next()
            }else{
                throw new Error("User not found")
            }
        }else{
            throw new Error("Token not valid")
        }
    }catch(err){
        res.status(401).send(err.message)
    }
}

module.exports = {userAuth}