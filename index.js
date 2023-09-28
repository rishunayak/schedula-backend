require("dotenv").config();
const express=require("express")
const cors=require("cors")
const { connection } = require("./config/db")
const {userRouter}=require("./route/user.routes")
const {doctorRouter}=require("./route/doctor.routes")
const {appointmentRouter}=require("./route/appointment.routes")
const {private}=require("./route/prvaite")

const app=express()



app.use(cors())
app.use(express.json())

app.use("/user",userRouter)
app.use("/doctors",doctorRouter)
app.use("/appointment",appointmentRouter)
app.use("/pvt",private)


app.get("/",(req,res)=>
{
    res.send("welcome to server")
})

app.listen(process.env.PORT,async()=>
{
   
    try
    {
        await connection
        console.log("Connected to MongoDB");  
    }
    catch(err)
    {
        console.error("Error connecting to MongoDB:", err);
    }
    console.log("server started at",process.env.PORT)
    
})