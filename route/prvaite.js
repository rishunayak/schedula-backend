const express=require("express")
const { authentication } = require("../middleware/Authentication")



const private=express.Router()

private.use(authentication)

private.get("/",(req,res)=>
{
    res.send("hello fff")
})

module.exports={private}