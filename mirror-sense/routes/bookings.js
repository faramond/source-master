const {Booking} = require('../models/booking');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().or([{ userName: req.query.userName }, { mobileNumber: req.query.mobileNumber }])
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
            isServed: req.body.isServed,
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

module.exports = router; 