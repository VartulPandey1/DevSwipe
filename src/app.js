const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const {ConnectToDB} = require("./config")
const {userAuth} = require("./middleware/auth.js")
const user = require("./model/user.js")
const express = require("express")
const app = express();
const cors = require("cors")

app.use(cors({
    origin:"http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

const {authRoute} = require("./routes/authRoute.js")
const {profileRoute} = require("./routes/profileRoute.js")
const {connectionRoute} = require("./routes/connectionRequestRouter.js")
const userRouter = require("./routes/userRouter.js")
app.use("/",authRoute)
app.use("/",profileRoute)
app.use("/",connectionRoute)
app.use("/",userRouter)



app.put("/update",userAuth,async (req,res)=>{
    try{
        const userEmailId = req.query.emailId
        const userData = await user.findOne({emailId:userEmailId})
        if(userData)
        {
            const updateAllowedField = ["firstName","lastName","password","age","gender"]
            const fieldToUpdate = Object.keys(req.body)
            .filter((key)=>updateAllowedField.includes(key))
            .reduce((obj,key)=>{
                obj[key] = req.body[key]
                return obj
            },{})
            await user.findByIdAndUpdate(userData._id,fieldToUpdate,{runValidators:true})
            res.send("user updated successfully")
        }else{
        res.status(400).send("user not found")
        }}
    catch(err){
        res.status(403).send(err.message)}
})

app.delete("/deleteUser",async(req,res)=>{
    try{
        const userEmailId = req.query.emailId
        const userData = await user.findOne({emailId:userEmailId})
        if(userData)
        {
            await user.findByIdAndDelete(userData._id,req.body)
            res.send("user deleted successfully")
        }else{
            res.status(400).send("user not found")
        }}
    catch(err){res.send(err)}
})

ConnectToDB().then(()=>{
    console.log("connected to db")
    app.listen(5000,()=>console.log("listening at port 5000"))
}).catch((err)=>{
    console.log(err)
})
