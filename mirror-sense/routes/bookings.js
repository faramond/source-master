const {Booking} = require('../models/booking');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().or([{ userName: req.query.userName }, { mobileNumber: req.query.mobileNumber }])
        .and({ isServed: req.query.isServed })    
        .sort('name');
        res.send(bookings);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Get', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let booking = new Booking({
            salonName: req.body.salonName,
            locality: req.body.locality,
            appointmentDate: req.body.appointmentDate,
            modeOfPayment: req.body.modeOfPayment,
            amountToPay: req.body.amountToPay,
            userName: req.body.userName,
            mobileNumber: req.body.mobileNumber,
            created: new Date(),

        });
        booking = await booking.save();

        res.send(booking);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Post', err.message)
    }

});

router.patch('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(req.params.id,
            {
                isServed:req.body.isServed,
                updated: new Date(),

            }, { new: true });

        if (!booking) return res.status(404).send({'message':'The booking with the given _id  was not found.'});

        res.send(booking);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Patch', err.message)
    }


});

module.exports = router; 