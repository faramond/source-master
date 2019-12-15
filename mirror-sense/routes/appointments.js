const { Booking } = require('../models/booking');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        console.log(req.query.mirrorStar)
        let queryString =req.query.mirrorStar
        console.log('query Name:',queryString);
        
        const employee = await Booking.find().or([{ mirrorStar:req.query.mirrorStar, status: "requested"}])  
            .select({bookingID: 1, appointmentDate: 1, userName: 1, mobileNumber: 1, email: 1, serviceName: 1, amountToPay: 1})     
            .sort('appointmentDate');
        res.send(employee);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Bookings', err.message)
    }

});

router.patch('/accept/:id', async (req, res) => {
    try {
        let booking = await Booking.findByIdAndUpdate(req.params.id,
          {
            status: "completed"
        

        }, { new: true });

        if (!booking) return res.status(404).send({ 'message': 'Details not found.' });

        res.send(booking);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('appointments', err.message)
    }

  }
);


router.patch('/reject/:id', async (req, res) => {
    try {
        let booking = await Booking.findByIdAndUpdate(req.params.id,
          {
            status: "cancelled"
        

        }, { new: true });

        if (!booking) return res.status(404).send({ 'message': 'Details not found.' });

        res.send(booking);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('appointments', err.message)
    }

  }
);

router.get('/Completed', async (req, res) => {
    try {
        
        console.log(req.query.mirrorStar)
        let queryString =req.query.mirrorStar
        console.log('query Name:',queryString);
        
        const employee = await Booking.find().or([{ servedBy:req.query.mirrorStar }])
            .or([{ status: "completed" }]).or([{ status: "cancelled" }]) 
            .select({bookingID: 1,appointmentDate: 1, serviceName: 1, userName: 1, mobileNumber: 1, email: 1, amountToPay: 1, status: 1})     
            .sort('appointmentDate');
        res.send(employee);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Bookings', err.message)
    }

});

router.post('/', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
        console.log('in');
        let booking = await Booking.find()
         req.body.bookingID = '#' + (000000 + booking.length),
         console.log(req.body.salonID);
         req.body.status = "requested"
         let data = new Booking(req.body);
         data = await data.save();
 
         res.status(201).send(data);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Booking Post', err.message)
     }
 
    }
);



module.exports = router; 
