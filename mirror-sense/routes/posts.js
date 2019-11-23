const { Employee } = require('../models/employee');
const { Booking } = require('../models/booking');
const { Salary } = require('../models/salary');
const { Post } = require('../models/post');
const { Leave } = require('../models/leave');
const { Notification } = require('../models/notification');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = require('../storage/image');

let data;
router.get('/', async (req, res) => {
    try {
        
        console.log(req.query.mobileNumber)
        let queryString =req.query.mobileNumber
        console.log('query Name:',queryString);
        
        const post = await Post.find().or([{ mobileNumber:req.query.mobileNumber },{ mirrorstar:req.query.mirrorstar },{ employee:req.query.employee }])
        .select({ fullName: 1, image: 1, created: 1, description: 1, photos: 1 })
        res.send(post);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Post', err.message)
    }

});
router.patch('/:id', upload.array('photos'), async (req, res) => {
   // req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);

     console.log(req.files);
     try {
         let post = await Post.findByIdAndUpdate(req.params.id,
            {
             fullName: req.body.fullName,
             description: req.body.description,
             photos: req.files,
             created: new Date()
 
            }, { new: true});
            if (!post) return res.status(404).send({ 'message': 'Post not found.' });
 
         res.send(post);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('post', err.message)
     }
 
 });

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post) return res.status(404).send({ 'message': 'The post with the given ID was not found.' });

        res.send(post);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Post Delete', err.message)
    }
});


router.post('/',upload.array('photos'), async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     console.log(req);

     console.log(req.file);
     console.log(req.files);
     try {
         let post = new Post({
            fullName : req.file.fullName,
            description: req.file.description,
            mirrorstar:req.file.mirrorstar,
            photos: req.files
         });
         post = await post.save();
 
         res.send(post);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Post Post', err.message)
     }
 
    }
);

module.exports = router;