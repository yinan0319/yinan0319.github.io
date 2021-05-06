const db = require('../models')
const config = require('../config/auth.config')
const jwt = require('jsonwebtoken');
const { request } = require('express');
const User = db.user;


signUp = (req,res,err)=>{
    const user = new User({
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        email:req.body.email,
        role:req.body.role,
        password:req.body.password
    })
    user.save((err,user)=>{
       if(err){
           res.status(500).send({message:err})
       }
        res.status(200).send({message:`${req.body.role} inserted successfully!`})
    })
}

signIn=(req,res,next)=>{
    User.findOne({email:req.body.email,password:req.body.password}).exec((err,user)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }
        if(!user){
           return res.status(404).send({message:"user not found"});
        }
      
        token = jwt.sign({id:user.id},config.secret,{expiresIn:86400})
        res.status(200).send({user})
    })
}

const userCont = { 
    signUp,
    signIn
}
module.exports = userCont;