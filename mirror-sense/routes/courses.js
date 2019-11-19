const { Courses } = require('../models/courses');
const { MirrorStar } = require('../models/mirrorStar');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = require('../storage/image');



router.get('/', async (req, res) => {
    try {
        
        const courses = await Courses.find().sort('dateFrom');
        res.send(courses);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('courses', err.message)
    }

});

router.post('/',upload.single('image'), async (req, res) => {
     console.log(req);

     console.log(req.file);
     try {
         let courses = new Courses({
            courseName : req.body.courseName,
            dateFrom : req.body.dateFrom,
            dateTo : req.body.dateTo,
            address : req.body.address,
            description: req.body.description,
            price: req.body.price,
            image: req.file.path
         });
         courses = await courses.save();
 
         res.send(courses);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('courses Post', err.message)
     }
 
    }
);

router.patch('/:id', async (req, res) => {
      try {
          let course = await Courses.findByIdAndUpdate(req.params.id,
             {
                $addToSet: { registeredEmployee: req.body.registeredEmployee }
  
             }, { new: true});
             if (!course) return res.status(404).send({ 'message': 'Course not found.' });
  
          res.send(course);
      }
      catch (err) {
          res.send({ 'message': err.message });
          console.log('course', err.message)
      } 
    });
      
      

      router.patch('/register/:id', async (req, res) => {
       try {
        let mirrorstar = await MirrorStar.findByIdAndUpdate(req.params.id,
           {
              $addToSet: { courses: req.body.courses }

           }, { new: true});
           if (!mirrorstar) return res.status(404).send({ 'message': 'mirrorstar not found.' });

        res.send(mirrorstar);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('mirrorstar', err.message)
    }

  
  });

module.exports = router;