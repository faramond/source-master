const { MirrorStar } = require('../models/mirrorStar');
const { Courses } = require('../models/courses');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        const  c = await MirrorStar.find().or([{ mirrorstar:req.query.mirrorstar }])
        .select({ courses: 1});
for(i=0;i<c.length;i++)
{
    const  d = await Courses.find().or([{ _id: c[i] }])
    res.send(d);

}


       
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('courses', err.message)
    }

});

module.exports = router; 