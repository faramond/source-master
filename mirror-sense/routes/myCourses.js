const { MirrorStar } = require('../models/mirrorStar');
const { Courses } = require('../models/courses');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        
       let result = [];
        let course = await MirrorStar.find().or([{ _id:req.query._id}])
        .select({ courses: 1})
        for(let key in course[0].courses)
    { 
    let data = await Courses.find().or([{ _id: course[0].courses[key].toString() }])
        result.push(data)
        
    }
    res.send(result);
}
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('myCourse', err.message)
    }

});

module.exports = router; 