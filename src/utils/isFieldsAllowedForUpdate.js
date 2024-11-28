const isFieldsAllowedForUpdate=(obj)=>{
    try{
    const fieldsAllowToUpdate = ["firstName","lastName","age","about","photoURL","skills"]
    return Object.keys(obj).every((data)=>fieldsAllowToUpdate.includes(data))
    }catch(err){
        throw new Error(err.message)
    }
}

module.exports = isFieldsAllowedForUpdate