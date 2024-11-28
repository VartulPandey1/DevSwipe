const mongoose = require("mongoose")

const ConnectToDB = async() => {
   return await mongoose.connect("mongodb://localhost:27017/ETinder")
}

module.exports.ConnectToDB = ConnectToDB