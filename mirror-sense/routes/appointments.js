const { Booking } = require('../models/booking');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
var request = require('request');
let { bookingUpdate } = require('../lib/uploadToSQL');
const { createNewConnection } = require('../lib/connection');


router.get('/', async (req, res) => {
    try {

        console.log(req.query.mirrorStar)
        let queryString = req.query.mirrorStar
        console.log('query Name:', queryString);

        const employee = await Booking.find().or([{ mirrorStar: req.query.mirrorStar, status: "requested" }])
            .or([{ mirrorStar: req.query.mirrorStar, status: "accepted" }])
            .select({ bookingID: 1, appointmentDate: 1, userName: 1, mobileNumber: 1, email: 1, servicesName: 1, dealName: 1, amountToPay: 1, startTime: 1, endTime: 1 })
            .sort('appointmentDate');
        res.status(200).send(employee);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Employee Bookings', err.message)
    }

});
router.get('/details/:id', async (req, res) => {
    try {

        const employee = await Booking.findOne().or([{ _id: req.params.id }])
            .select({ bookingID: 1, appointmentDate: 1, userName: 1, mobileNumber: 1, email: 1, servicesName: 1, dealName: 1, amountToPay: 1, status: 1, startTime: 1, endTime: 1 })
        res.status(200).send(employee);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Employee Bookings detail', err.message)
    }

});

router.patch('/accept/:id', async (req, res) => {
    try {
        let con = createNewConnection();
        let booking = await Booking.findByIdAndUpdate(req.params.id,
            {
                status: "accepted",
                isServed: false


            }, { new: true });

        if (!booking) return res.status(404).send({ 'message': 'Details not found.' });

        res.send(booking);

        bookingUpdate(false, true, booking.AppID);

        notification(0, booking);

    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('appointments accept error', err.message)
    }

}
);

router.patch('/complete/:id', async (req, res) => {
    try {
        let con = createNewConnection();
        let booking = await Booking.findByIdAndUpdate(req.params.id,
            {
                status: "completed",
                isServed: true


            }, { new: true });

        if (!booking) return res.status(404).send({ 'message': 'Details not found.' });

        res.status(200).send(booking);

        bookingUpdate(true, true, booking.AppID);

        notification(1, booking);

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('appointments accept error', err.message)
    }

}
);

router.patch('/reject/:id', async (req, res) => {
    try {
        let con = createNewConnection();
        let booking = await Booking.findByIdAndUpdate(req.params.id,
            {
                status: "cancelled"


            }, { new: true });

        if (!booking) return res.status(404).send({ 'message': 'Details not found.' });

        res.status(200).send(booking);

        bookingUpdate(false, false, booking.AppID);

        notification(2, booking)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('appointments reject error', err.message)
    }

}
);

router.get('/Completed', async (req, res) => {
    try {

        console.log(req.query.mirrorStar)
        let queryString = req.query.mirrorStar
        console.log('query Name:', queryString);

        const employee = await Booking.find().and([{ mirrorStar: req.query.mirrorStar }])
            .or([{ status: "completed" }]).or([{ status: "cancelled" }])
            .select({ bookingID: 1, appointmentDate: 1, servicesName: 1, userName: 1, mobileNumber: 1, email: 1, amountToPay: 1, status: 1, startTime: 1, endTime: 1 })
            .sort({ appointmentDate: -1 });
        res.status(200).send(employee);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
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
        res.status(400).send({ 'message': err.message });
        console.log('Booking Post', err.message)
    }

}
);

async function notification(flag, booking) {
    try {
        let con = createNewConnection();

        let device = await Customer.findOne({ _id: booking.customer }).select({ deviceID: 1 })
        if (!device) console.log({ 'message': 'device id not found for customer in employee cancel notification' });

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('appointment error', err.message)
                return console.log({ 'message': err.message });

            };
            let ID = parseInt(booking.StylistID)
            let name;
            var sql = "Select FullName as fullName from Employee where StylistID = ?"
            connection.query(sql, [ID], async function (err, result, fields) {
                if (err) {
                    console.log('appointment error', err.message)
                    return console.log({ 'message': err.message });

                };
                if (result != [] && result != "" && result != null) {
                    name = result[0].fullName
                }
                else {
                    console.log({ 'message': 'employee name not found for customer in employee accept notification' });
                }
                let service = "";
                let flg = true;

                if (booking.servicesName != null && booking.servicesName != []) {
                    for (i = 0; i < booking.servicesName.length; i++) {
                        if (flg) {
                            service = booking.servicesName[0];
                            flg = false;
                        }
                        else {
                            service = service + ', ' + booking.servicesName[i];
                        }
                    }
                }

                let Body = {}
                if (flag == 0) {
                    Body = {
                        "title": "Booking Accepted: Sheduled at " + booking.appointmentDate,
                        "body": name + " Accepted Your Booking for " + service
                    }
                } else if (flag == 1) {
                    Body = {
                        "title": "Booking Sheduled at " + booking.appointmentDate + " is Completed",
                        "body": name + " Completed Your Booking for " + service
                    }
                }
                else if (flag == 2) {
                    Body = {
                        "title": "Booking Sheduled at " + booking.appointmentDate + " is Cancelled",
                        "body": name + " Cancelled Your Booking for " + service
                    }
                }

                request.post({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'key=AAAA4V-xqus:APA91bERGoHwrAtQ8AFr_9hKVkVowiAxFi8qJVLxcMxXR2KBDjdsIY6NQEw-TY8TWoBKmj-VvhnUHKlGD8oeTo-uOH67AAVCQHrx_3eNI8Z-NBMQFTbQJcTDjtd11KGTH8l-Ph01Oqdi'
                    },
                    url: 'https://fcm.googleapis.com/fcm/send',
                    body: JSON.stringify({
                        "to": device.deviceID,
                        "notification": Body,
                        "data": {
                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                            "body": {
                                "code": 103,
                                "codeTitle": "Booking Cancelled by Employee",
                                "_id": booking._id
                            }
                        }

                    })
                }, function (error, response, body) {
                    if (error) {
                        console.log('Booking acanceeld by employee notification', error.message)
                    }
                });

                request.post({
                    headers: { 'Content-Type': 'application/json' },
                    url: 'http://159.89.155.62:3000/mirror/api/notification',
                    body: JSON.stringify({
                        "customer": booking.customer,
                        "data": JSON.stringify({
                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                            "body": {
                                "code": 103,
                                "codeTitle": "Booking Cancelled by Employee",
                                "_id": booking._id
                            }
                        })

                    })
                }, function (error, response, body) {
                    if (error) {
                        console.log('Booking reject by employee notification save ', error.message)
                    }
                });
            })
            connection.release();


        });

    }
    catch (err) {
        console.log('Appointment notification error', err.message)
    }
}



module.exports = router; 
