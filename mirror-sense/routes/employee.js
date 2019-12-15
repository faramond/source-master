const { Employee } = require('../models/employee');
const { MirrorStar } = require('../models/mirrorStar');
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

/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});*/

     
router.patch('/:id', upload.single('profile'), async (req, res) => {
    try {
      
        console.log(req.file);
        if(req.file == undefined)
        {
            console.log("if");
            const employee = await MirrorStar.findByIdAndUpdate(req.params.id,
                {
                    
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    updated: new Date(),
    
                }, { new: true });
    
            if (!employee) return res.status(404).send({ 'message': 'The employee with the given ID was not found.' });
    
            res.send(employee);
        
        }
        
        const employee = await MirrorStar.findByIdAndUpdate(req.params.id,
            {
                
                email: req.body.email,
                dob: req.body.dob,
                gender: req.body.gender,
                profile: req.file.path,
                updated: new Date(),

            }, { new: true });

        if (!employee) return res.status(404).send({ 'message': 'The employee with the given ID was not found.' });
console.log('esle');
        res.send(employee);
    
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('MirrorStar Patch', err.message)
    }


});



router.get('/courseForm/', async (req, res) => {
    try {
        data = await MirrorStar.find().or([{ mobileNumber: req.query.mobileNumber }])
        .select({ fullName: 1, email: 1, mobileNumber: 1 }) 
        res.status(200).send(data);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});


router.post('/followers/:id',upload.single('image'), async (req, res) => {
    try {

        let data = await Employee.findByIdAndUpdate(req.params.id, {

            $addToSet: { followers: [{
                name: req.body.name,
                image: req.file.path
            }] }
        },
        { new: true },

    function (err, doc) {
                if (err) {
                    console.log(err);
                }
            });
        console.log(data);
        // await data.save();
        res.status(201).send(data)


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Post Data', err.message)
    }
});

module.exports = router; 