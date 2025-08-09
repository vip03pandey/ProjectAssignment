const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middlewares/authmiddleware');
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
    console.log('Login attempt for email:', email);
    try{
        let user=await User.findOne({email});
        console.log('User found:', user ? 'Yes' : 'No');
        if(!user){
            console.log('User not found in database');
            return res.status(400).json({message:"Invalid Credentials"});
        }
        console.log('Comparing passwords...');
        const isMatch=await user.matchPassword(password);
        console.log('Password match:', isMatch);
        if(!isMatch){
            console.log('Password does not match');
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const payload={user:user._id};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7h'},(err,token)=>{
            if(err) return res.status(500).json({message:"Server Error"});
            res.status(200).json({
                success: true,
                token,
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        })
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports=router;