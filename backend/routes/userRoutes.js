const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup',async(req,res)=>{
    const {name,email,password,role} = req.body;
    try{
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });     
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
})

router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const payload={user:user._id};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7h'},(err,token)=>{
            if(err) return res.status(500).json({message:"Server Error"});
            res.status(200).json({user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },token});
        })
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports=router;