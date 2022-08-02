const express = require('express');
const router = express.Router();
const {User,Post} = require('../../models');
const bcrypt = require("bcrypt");

router.get("/",(req,res)=>{
    User.findAll({
        include:[Post]
    }).then(dbUsers=>{
        if(dbUsers.length){
            res.json(dbUsers)
        } else {
            res.status(404).json({message:"No users found!"})
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({message:"an error occured",err:err})
    })
})

router.post("/",(req,res)=>{
    console.log("username =", req.body.username);
    console.log("password =", req.body.password);
    User.create({
        username:req.body.username,
        password:req.body.password,
    }).then(newUser=>{
        console.log(newUser);
        req.session.save(()=>{
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;

            res.json(newUser);
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({message:"an error occured",err:err})
    })
})

router.post("/login",(req,res)=>{
    User.findOne({
        where:{
            username:req.body.username
        }
    }).then(foundUser=>{
    
        if(!foundUser){
            res.status(401).json({message:"incorrect email or password"})
            return;
        } 
        const isValidPassword = foundUser.checkPassword(req.body.password)
        if(!isValidPassword) {
            res.status(400).json({message:"Invalid password"})
            return;
        } 
        req.session.save(() =>{
            req.session.userId = foundUser.id;
            req.session.username = foundUser.username;
            req.session.loggedIn = true;

            res.status(200).json({message: "Success!"})
        });
    }).catch(err=> {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;