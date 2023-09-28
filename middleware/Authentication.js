const jwt=require("jsonwebtoken")


const authentication=(req,res,next)=>
{
    const token=req.headers?.authorization?.split(" ")[1]
    console.log(token)
    jwt.verify(token,"auth",(err,decorded)=>
    {
        console.log(err,decorded)
         
        if(err)
        {
           console.log(token,'err')
            res.status(200).send({message:"login Frist"})
        }
        else
        { 
            req.userId=decorded.id 
            next()
        }
    })
}

module.exports={authentication}