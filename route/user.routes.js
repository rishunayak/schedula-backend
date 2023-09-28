const express=require("express")
const jwt=require("jsonwebtoken")
const Redis = require('ioredis');
const twilio=require('twilio');
const { UserModel } = require("../model/User.model");


const userRouter=express.Router()


const redis = new Redis({
  password: process.env.redisPassword,   
  host: process.env.redisHost,
  port: process.env.redisPort,
});

const client = twilio(process.env.accountSid,process.env.authToken); 



userRouter.post('/register', async (req, res) => {
    const { name, email, phoneNumber,dob} = req.body;
    try 
    {
        const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
     
        if (existingUser) 
        {
          return res.status(200).send({ message: 'User with this email or phone number already exists.',status:0});
        }
  
      try 
      {
        await UserModel.create({name, email, phoneNumber,dob})
        res.status(201).send({ message: 'User Register Successfull',status:1});
      } 
      catch (error) 
      {
      
        res.status(500).send({ message: error.message,status:0});
      }
    } catch (error) {
      res.status(500).send({ message: error.message ,status:0}); 
    }
  });





  userRouter.post("/login",async(req,res)=>
 {
  
    const {phoneNumber}=req.body

    try
    {

       const existingUser=await UserModel.findOne({phoneNumber})
       
       if(!existingUser)
       {
        return  res.status(200).send({message:"User is not registered"})
       }
       
       const verificationCode = Math.floor(100000 + Math.random() * 900000);

       try
       {
         await client.messages.create({body: `Your Login verification code is: ${verificationCode}`,to: ("+91"+phoneNumber),from: '+12562911148'}); 
         const redisKey = `verificationCode:${phoneNumber}`;
         await redis.set(redisKey, verificationCode, 'EX', 300);
         res.status(200).send({message:"Verification code sent successfully.",phoneNumber:phoneNumber,status:1})
       }
       catch(error)
       {
         res.status(500).send({ message: "Twilio Server Error" });
       }   

    }
    catch(error)
    {

       res.status(500).send({message:"Server Error"})
    }
     
})

userRouter.post("/verify-login",async(req,res)=>
{
  const { phoneNumber , otp } = req.body;
  const redisKey = `verificationCode:${phoneNumber}`;
  const storedVerificationCode = await redis.get(redisKey);

   if(storedVerificationCode === otp)
   {
      let userData= await UserModel.findOne({phoneNumber})
      const token=jwt.sign({id:userData._id},"auth") 
      console.log(token,"login")
      return res.status(200).send({token:token,message:"Login Successfull",user:userData,status:1})
      
   }
   res.status(200).send({message:"Wrong Otp"})
})


userRouter.patch("/",async(req,res)=>
{
    const userId=req.userId

    try
    {
         await UserModel.findByIdAndUpdate({userId},{...req.body})
         res.status(200).send({message:"Profile Updated Successfull"})
    }
    catch(err)
    {
      return res.status(404).send({message:err.message})
    }
})

module.exports={userRouter}