const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    dob:{type:String,require:true},
    phoneNumber:{type:String,required:true,unique:true},
})

const UserModel=mongoose.model("user",userSchema)  

module.exports={UserModel}