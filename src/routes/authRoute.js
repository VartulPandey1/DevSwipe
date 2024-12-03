const express = require("express")
const bcrypt = require('bcrypt');
const authRoute = express.Router()
const jwt = require("jsonwebtoken")
const user = require("../model/user")

authRoute.post("/signup",async(req,res,next)=>{
    try{
    const userEmailId = req.body.emailId
    const foundUserData = await user.findOne({emailId:userEmailId})
    if(foundUserData){
        res.status(400).send("email id already exist in DB")
    }else{
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const newUser = new user(req.body);
    const token = await jwt.sign({_id:newUser._id},"secretKey")
    newUser.save().then(()=>{
        res.cookie("token",token)
        res.send("user added")
    }).catch((err)=>{
        res.status(400).send(err.message)
    })}}
    catch(err){
        res.status(400).send(err.message)
    }
})

authRoute.post("/login",async(req,res,next)=>{
    try
    {
        const {emailId,password} = req.body
        const searchedUserData =await user.findOne({emailId:emailId})
        if(!searchedUserData)
        {
            throw new Error("Email id not found")
        }
        const isPasswordMatched = await bcrypt.compare(password,searchedUserData.password)
        if(isPasswordMatched){
            const token = await jwt.sign({_id:searchedUserData._id},"secretKey")
            res.cookie("token",token)
            res.status(201).send("login Successfull")
        }else{
            throw new Error("user not found")
        }
    }
    catch(err){
        res.status(400).send("err = "+err.message)
    }

})

authRoute.get("/logout",(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now())
    }).send("logout successfull")
})

module.exports = {authRoute}