const express =require("express")
const bcrypt = require("bcrypt")
const profileRoute = express.Router()
const {userAuth} = require("../middleware/auth.js")
const isFieldsAllowedForUpdate = require("../utils/isFieldsAllowedForUpdate.js")
profileRoute.get("/profile/view",userAuth,(req,res)=>{
    try{
    res.send(req.user)
    }catch(err){
        res.status(400).send(err.message)
    }
})

profileRoute.put("/profile/edit",userAuth,async(req,res)=>{
    try{
    if(isFieldsAllowedForUpdate(req.body)){
        const user = req.user
        Object.keys(req.body).forEach((data)=>user[data]=req.body[data])
        await user.save()
        res.send("User Data Upadated SuccessFully")
    }else{
        res.send("invalid Fields")
    }
    }catch(err){
        res.status(400).send(err.message)
    }
})

profileRoute.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        const {currentPassword,newPassword}=req.body
        if(currentPassword===newPassword)
        {
            throw new Error("new and old password are same please enter a new password")
        }
        const user = req.user
        const isSamePassword = await bcrypt.compare(currentPassword, user.password)
        if(isSamePassword){
            user["password"] = await bcrypt.hash(newPassword,10)
            await user.save()
            res.send("Password Updated Successfully")
        }else{
            throw new Error("Current password is not correct")
        }
    }catch(err){
        res.status(400).send(err.message)
    }    
})

module.exports={profileRoute}