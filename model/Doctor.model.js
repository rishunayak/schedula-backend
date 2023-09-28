const mongoose=require("mongoose")


const doctorSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    dateOfBirth:{type:Date,require:true},
    phoneNumber:{type:String,required:true,unique:true},
    specialization:{type:String,required:true}, 
    isAvailable:{type:Boolean,default:false},
    address:{type:String,required:true},
    gender:{type:String,enum:["Male","Female"],require:true}
})

const DoctorModel=mongoose.model("doctor",doctorSchema) 

module.exports={DoctorModel}