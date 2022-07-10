const express = require("express");
const router = express.Router();
const { Post, User} = require("../models");

router.get("/",(req,res)=>{
    
    if(!req.session.userId){
        console.log(req.session)
        return res.status(401).send("you need to log in first to be able to update a post!")
        
    }
    Post.findAll({
        where: {
            userId:req.session.userId,
        }
    }).then(postData=>{

        const hbsPosts = postData.map(post=>post.get({plain:true}))
        res.render("dashboard",{
            posts:hbsPosts
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "an error occured", err: err });
    });
});
router.get("/create-post", (req, res) => {
    console.log("this is my create post route")
    if(!req.session.userId){
        return res.status(401).send("you need to log in first to be able to update a post!")
    }
    res.render("createpost")

});
router.get("/update-post/:id", (req, res) => {
    if(!req.session.userId){
        return res.status(401).send("you need to log in first to be able to update a post!")
    }
    Post.findByPk(req.params.id)
    .then(singlePost => {
        console.log(singlePost)
        if(singlePost){
            const post = singlePost.get({plain:true})
            res.render("updatepost",{
                post
            })
        }else{
            res.status(400).json({message:"post not found"})
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "an error occured", err: err });
    });
    
})
module.exports = router;

