const mongoose=require("mongoose")
const { UserModel } = require("./User.model")
const { DoctorModel } = require("./Doctor.model")


const appointmentSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:UserModel,required:true},
    docterId:{type:mongoose.Schema.Types.ObjectId,ref:DoctorModel,required:true},
    appointmentTime:{type:String,require:true},
    appointmentDate:{type:String,require:true}
})

const AppointmentModel=mongoose.model("appointment",appointmentSchema) 

module.exports={AppointmentModel}