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
            const employee = await Employee.findByIdAndUpdate(req.params.id,
                {
                    
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    updated: new Date(),
    
                }, { new: true });
    
            if (!employee) return res.status(404).send({ 'message': 'The employee with the given ID was not found.' });
    
            res.send(employee);
        
        }
        
        const employee = await Employee.findByIdAndUpdate(req.params.id,
            {
                
                email: req.body.email,
                dob: req.body.dob,
                gender: req.body.gender,
                profile: req.file.path,
                updated: new Date(),

            }, { new: true });

        if (!employee) return res.status(404).send({ 'message': 'The employee with the given ID was not found.' });
console.log('esle');
        res.send(customer);
    
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Patch', err.message)
    }


});
router.get('/appointment', async (req, res) => {
    try {
        
        console.log(req.query.servedBy)
        let queryString =req.query.servedBy
        console.log('query Name:',queryString);
        
        const employee = await Booking.find().or([{ isServed: false, cancelled: false }]).or([{ servedBy:req.query.servedBy }])  
            .select({appointmentDate: 1, userName: 1, mobileNumber: 1, email: 1, amountToPay: 1})     
            .sort('appointmentDate');
        res.send(employee);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Bookings', err.message)
    }

});

router.get('/appointmentCompleted', async (req, res) => {
    try {
        
        console.log(req.query.servedBy)
        let queryString =req.query.servedBy
        console.log('query Name:',queryString);
        
        const employee = await Booking.find().or([{ servedBy:req.query.servedBy }])
            .or([{ isServed: true },{ cancelled: true }]) 
            .select({appointmentDate: 1, service: 1, userName: 1, mobileNumber: 1, email: 1, amountToPay: 1, cancelled: 1, isServed: 1 })     
            .sort('appointmentDate');
        res.send(employee);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Bookings', err.message)
    }

});

router.post('/booking', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let booking = new Booking(req.body);
         booking = await booking.save();
 
         res.status(201).send(booking);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Booking Post', err.message)
     }
 
    }
);








router.get('/leave', async (req, res) => {
    try {
        
        console.log(req.query.mobileNumber)
        let queryString =req.query.mobileNumber
        console.log('query Name:',queryString);
        
        const leave = await Leave.find().or([{ mobileNumber:req.query.mobileNumber }])
        .select({ leaveSubject: 1, dateFrom: 1, dateTo: 1, description: 1, created: 1 })
        res.send(leave);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

router.patch('/leave/:id', async (req, res) => {
      try {
          let leave = await Leave.findByIdAndUpdate(req.params.id,
            {
              leaveSubject: req.body.leaveSubject,
              description: req.body.description,
              dateFrom: req.body.dateFrom,
              dateTo: req.body.dateTo,
              created: new Date(),
  
          }, { new: true });

          if (!leave) return res.status(404).send({ 'message': 'Details not found.' });

          res.send(leave);
      }
      catch (err) {
          res.send({ 'message': err.message });
          console.log('leave', err.message)
      }
  
    }
);

  router.post('/leave', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let leave = new Leave(req.body);
         leave = await leave.save();
 
         res.send(leave);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Leave Post', err.message)
     }
 
    }
);








router.get('/post', async (req, res) => {
    try {
        
        console.log(req.query.mobileNumber)
        let queryString =req.query.mobileNumber
        console.log('query Name:',queryString);
        
        const post = await Post.find().or([{ mobileNumber:req.query.mobileNumber }])
        .select({ fullName: 1, image: 1, created: 1, description: 1, photos: 1 })
        res.send(post);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Post', err.message)
    }

});
router.patch('/post/:id', upload.single('image'), async (req, res) => {
   // req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let post = await Leave.findByIdAndUpdate(req.params.id,
            {
             fullName: req.body.fullName,
             description: req.body.description,
             image: req.file.path,
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

router.delete('/post/:id', async (req, res) => {
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


router.post('/post', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let post = new Post(req.body);
         post = await post.save();
 
         res.send(post);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Post Post', err.message)
     }
 
    }
);

router.get('/notification', async (req, res) => {
    try {
        
        const notification = await Notification.find()
        .select({ created: 1, description: 1 })
        res.send(notification);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Notification', err.message)
    }

});
router.post('/notification', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let notification = new Notification(req.body);
         post = await notification.save();
 
         res.send(notification);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Notification Post', err.message)
     }
 
    }
);


module.exports = router; 