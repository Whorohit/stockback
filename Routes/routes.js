const express=require('express')
const user=require('../models/UserModels')
const router=express.Router();
const { body, validationResult } = require('express-validator');
router.get('/api/user',async (req,res)=>{
    const email=req.header('email')
    try {
        if (!email) {
            return  res.status(401).send({ error: "Ple authenticate using a valid token",success:false})
         }
        const data= await user.find({ email: email })
        res.json(data)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message:"Internal Server Error",success:false});
    }

})

module.exports=router