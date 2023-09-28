const express=require("express")
const { AppointmentModel } = require("../model/Appointment.model")
const { authentication } = require("../middleware/Authentication")

appointmentRouter=express.Router()

appointmentRouter.use(authentication)


appointmentRouter.get("/",async(req,res)=>
{
    const userId=req.userId

    try
    {
        let appointments=await AppointmentModel.find({userId}).populate("docterId") 
        res.status(200).send(appointments)
    }
    catch(err)
    {
      res.status(404).send({message:err.message})
    }
    
})

appointmentRouter.get("/:id/:date",async(req,res)=>
{
    const userId=req.userId
    const {id,date}=req.params

    try
    {
        let appointments=await AppointmentModel.find({docterId:id,appointmentDate:date})
        let arr=[]
        appointments.map((ele)=>arr.push(ele.appointmentTime))
        res.status(200).send(arr)
    }
    catch(err)
    {
      res.status(404).send({message:err.message})
    }
    
})


appointmentRouter.post("/",async(req,res)=>
{
  const {docterId,appointmentTime,appointmentDate}=req.body 

  const userId=req.userId
  console.log(req.body,userId)
  try
  {
    await AppointmentModel.create({docterId,appointmentTime,appointmentDate,userId})
    res.status(200).send({message:"Appointment Added Succesfully",status:1})
  }
  catch(err)
  {
    res.status(404).send({message:err.message})
  }  
    
})



module.exports={appointmentRouter}