const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName : {type :String,required:true,validate(value){
        if(value.length<4)
        {throw new Error("Name length must be greater than 3 letter")}
    }},
    lastName : {type:String},
    emailId : {type:String, required:true, match: /.+\@.+\..+/},
    password : {type:String, required:true},
    age : {type:Number , min: 10, max:120},
    about :{type:String},
    photoURL : {type:String},
    skills:{type:[String]},
    gender :{type:String,
        validate(value){
        if(!['male','female','other'].includes(value.toLowerCase()))
        {
            throw new Error("Not a valid gender");    
        }
    }},
},
{
    timestamps:true
}
)

const userModel = mongoose.model("User",userSchema)

module.exports = userModel