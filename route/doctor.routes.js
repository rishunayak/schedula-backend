const express=require("express")
const twilio=require('twilio');
const Redis = require('ioredis');
const { DoctorModel } = require("../model/Doctor.model")



const doctorRouter=express.Router()

const redis = new Redis({
    password: process.env.redisPassword,
    host: process.env.redisHost,
    port: process.env.redisPort,
  });

const client = twilio(process.env.accountSid, process.env.authToken);


doctorRouter.get("/",async(req,res)=>
{
    let {page=1,search}=req.query

    const searchRegex = new RegExp(search, 'i');

    let totalPage = await DoctorModel.countDocuments({ name: searchRegex });  
    totalPage=Math.ceil(totalPage/10)

    try
    {
        const doctor=await DoctorModel.find({ name: searchRegex }).limit(9)
         .skip((page-1)*9)
         .limit(9);
         res.status(200).send({totalPage,doctor,currentPage:page})  
    }
    catch(err)
    {
        req.status(404).send({message:err.message})
    }
})

doctorRouter.get("/:id",async(req,res)=>
{
    const id=req.params.id


    try
    {
        let current=await DoctorModel.findOne({_id:id})
        res.status(200).send(current)
    }
    catch(err)
    {
        console.log(err)
        res.status(404).send({message:err})
    }
    
})

doctorRouter.post("/login",async(req,res)=>
{
    const {phoneNumber}=req.body
    
    try
    {
        const existingUser=await DoctorModel.findOne({phoneNumber})
       
        if(!existingUser)
        {
         return  res.status(404).send({message:"User is not registered"})
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

       try
       {
         await client.messages.create({body: `Your Login verification code is: ${verificationCode}`,to: ("+91"+phoneNumber),from: '+12409497176'}); 
         const redisKey = `verificationCode:${phoneNumber}`;
         await redis.set(redisKey, verificationCode, 'EX', 300);
         res.status(200).send({message:"Verification code sent successfully.",phoneNumber:phoneNumber})
       }
       catch(error)
       {
         res.status(500).send({ message: "Twilio Server Error" });
       }  
    }
    catch(err)
    {
        res.status(404).send({message:err.message})
    }
    
})

module.exports={doctorRouter}