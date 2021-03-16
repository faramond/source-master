
const { Payment } = require('../models/payment');
const { Booking } = require('../models/booking');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const PDF = require('pdfkit');
const crypto = require("crypto");
const { createNewConnection2 } = require('../lib/connection');
const { createNewConnection } = require('../lib/connection');
var request = require('request');

let data;
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        let status = "Payment Failed";
        if (req.body.status == "Success") {
            status = "requested"
        }

        let EducationCourseID;
        if (req.body.course) {
            EducationCourseID = parseInt(req.body.course);
        }
        else {
            EducationCourseID = parseInt(req.body.event);
        }

        if (!EducationCourseID || EducationCourseID == "" || EducationCourseID == null) {

            if (req.body.wallet == false) {

                if (!req.body.customer || req.body.customer == "") {
                    return res.status(400).send({ 'message': 'cusotomerId mandatory' });
                }
                if (!req.body.salonid || req.body.salonid == "") {
                    return res.status(400).send({ 'message': 'salon mandatory' });
                }
            }
            if (req.body.dealID != null) {
                data = new Payment({
                    amount: req.body.amount,
                    customerName: req.body.customerName,
                    services: req.body.services,
                    dealID: req.body.dealID,
                    dealName: req.body.dealName,
                    app_code: req.body.app_code,
                    txn_ID: req.body.txn_ID,
                    pInstruction: req.body.pInstruction,
                    msgType: req.body.msgType,
                    status: req.body.status,
                    order_id: req.body.order_id,
                    channel: req.body.channel,
                    chksum: req.body.chksum,
                    mobile: req.body.mobile,
                    customer: req.body.customer,
                    booking: req.body.booking,
                    salonID: req.body.salonid,
                    branchID: req.body.Company_ID,
                    StylistID: req.body.StylistID,
                    wallet: req.body.wallet


                });
                await data.save();
                res.status(201).send(data)
            }
            else {
                data = new Payment(req.body);
                await data.save();
                res.status(201).send(data)
            }
            if (!req.body.wallet && req.body.channel != "Cash") {
                const booking = await Booking.findByIdAndUpdate({ _id: req.body.booking },
                    {
                        status: status,
                        updated: new Date(),

                    }, { new: true });

                if (!booking) console.log({ 'message': 'The booking with the given _id  was not found in booking update after payment.' });

                if (req.body.status == "Success") {
                    let bookingData = {
                        StylistID: req.body.StylistID,
                        servicesName: req.body.services,
                        userName: req.body.customerName,
                        _id: req.body.booking,
                        appointmentDate: req.body.appointmentDate
                    }
                    notification(true, bookingData)
                }
            }
        }
        else {
            data = new Payment({
                amount: req.body.amount,
                employeeName: req.body.employeeName,
                app_code: req.body.app_code,
                txn_ID: req.body.txn_ID,
                pInstruction: req.body.pInstruction,
                msgType: req.body.msgType,
                status: req.body.status,
                order_id: req.body.order_id,
                channel: req.body.channel,
                chksum: req.body.chksum,
                mobile: req.body.mobile,
                employee: req.body.employee,
                educationCourseID: EducationCourseID,
                StylistID: req.body.StylistID,
                wallet: req.body.wallet


            });
            await data.save();
            res.status(201).send(data)
        }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Payment Error', err.message)
    }
});
router.get('/', async (req, res) => {
    try {
        data = await Payment.find({ mobile: req.query.mobile })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Payment Error', err.message)
    }
});

router.get('/transactionID', async (req, res) => {
    try {
        let id = crypto.randomBytes(10).toString("hex");
        let data = await Payment.find();
        id = id + "-" + data.length;
        res.status(200).send({ TransactionID: id })
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Payment trxn id Error', err.message)
    }
});

router.post('/receipt', async (req, res) => {
    try {
        const booking = req.body.booking;
        const name = req.body.customerName;
        const amount = req.body.amount;
        const mobile = req.body.mobile;
        const txn_ID = req.body.txn_ID;
        const dealName = req.body.dealName;
        const services = req.body.services;
        const salon = req.body.salon;
        const created = req.body.created;
        const channel = req.body.modeOfPayment;
        path = 'receipt/' + name + '-' + booking + '.pdf';

        let response = [];
        let conn = await createNewConnection2();
        id = parseInt(salon);

        var sql = "SELECT Company_Name , Company_Address  FROM Company_Profile cp, CompanyLocation cl Where cp.Company_ID= cl.CompanyID and Company_ID= ? ";
        let [rows, fields] = await conn.execute(sql, [id]);

        if (rows != null && rows != '' && rows != []) {
            companyName = rows[0].Company_Name;
            companyAddress = rows[0].Company_Address;
        }

        date = created.slice(0, 10);
        time = created.slice(11, 16);

        let doc = new PDF();
        doc.pipe(fs.createWriteStream(path));

        doc.image('uploads/2020-02-05T15:47:44.694Zbackground.jpg', 0, 0, {
            width: 620,
            height: 795,
            align: 'center',
            valign: 'center'
        });


        let grad = doc.linearGradient(0, 0, 610, 700);
        grad.stop(0.5, 'white', 0.5)
            .stop(0.5, 'grey', 0.5);


        //doc.rect(0, 0, 610, 700)
        //doc.fill('grey')
        //.opacity(0.1);

        doc.font('Times-Bold')
            .fillColor('black')
            .fontSize(25)
            .text(' PAYMENT RECEIPT ', 170, 120, {
                underline: true,
                width: 350
            });

        doc.font('Times-Roman')
            .fillColor('blue')
            .fontSize(15)
            .text('"' + companyName + '"', 175, 200, {
                width: 250,
                align: 'center'
            });

        doc.font('Times-Roman')
            .fillColor('blue')
            .fontSize(12)
            .text(companyAddress, 180, 240, {
                width: 230,
                align: 'center'
            });



        doc.font('Times-Roman')
            .fillColor('black')
            .fontSize(12)
            .text('Customer Name :', 140, 300)
            .text('Amount:', 140, 330)
            .text('Mobile Number :', 140, 360)
            .text('Transaction ID :', 140, 390)
            .text('Date :', 140, 420)
            .text('Mode :', 140, 450);
        doc.font('Times-Roman')
            .fillColor('red')
            .fontSize(12)
            .text(name, 360, 300)
            .text(amount, 360, 330)
            .text(mobile, 360, 360)
            .text(txn_ID, 360, 390)
            .text(date + '  at   ' + time, 360, 420)
            .text(channel, 360, 450);


        if (dealName) {
            doc.font('Times-Roman')
                .fillColor('black')
                .fontSize(12)
                .text('Deal Name :', 140, 480);
            doc.font('Times-Roman')
                .fillColor('red')
                .fontSize(12)
                .text(dealName, 360, 480);

        }

        if (services != null && services != [] && services != '') {

            y = 480;
            doc.font('Times-Roman')
                .fillColor('black')
                .fontSize(12)
                .text('Services Taken :', 140, 480);
            for (i = 0; i < services.length; i++) {
                doc.font('Times-Roman')
                    .fillColor('red')
                    .fontSize(12)
                    .text(services[i], 360, y);
                y = y + 30;
            }

        }

        doc.font('Times-Italic')
            .fillColor('black')
            .fontSize(20)
            .text(' THANK - YOU ', 220, 650);


        doc.end();

        response.push(path)
        res.status(200).send(response);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Payment receipt', err.message)
    }
});

function notification(flag, bookingData) {

    try {
        let con = createNewConnection();

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('appointment error', err.message)
                return console.log({ 'message': err.message });

            };
            let ID = parseInt(bookingData.StylistID)
            let device;
            var sql = "Select DeviceID  from Employee where StylistID = ?"
            connection.query(sql, [ID], async function (err, result, fields) {
                if (err) {
                    console.log('appointment error', err.message)
                    return console.log({ 'message': err.message });

                };
                if (result != [] && result != "" && result != null) {
                    device = result[0].DeviceID
                }
                else {
                    console.log({ 'message': 'device id not fpound for employee in new booking notification' });
                }

                let service = "";
                let flg = true;

                for (i = 0; i < bookingData.servicesName.length; i++) {
                    if (flg) {
                        service = bookingData.servicesName[0]
                        flg = false;
                    }
                    else {
                        service = service + ", " + bookingData.servicesName[i];
                    }
                }

                let Body = {};

                if (flag) {
                    Body = {
                        "title": "New Booking Recieved: Sheduled at " + bookingData.appointmentDate,
                        "body": bookingData.userName + " Booked for " + service
                    }
                }
                else {
                    Body = {
                        "title": "Booking Sheduled at " + bookingData.appointmentDate + " is Cancelled",
                        "body": bookingData.userName + " Cancelled Booking for " + service
                    }
                }


                request.post({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'key=AAAA_ec3JCs:APA91bEPs29D2Lh0imGMIIej0n8c2-_aLll0ie52s3XbzrXFvMtaXmRYgpAGkPvmRvVrhyl2C3S5KkutNDdpsKPGny1onY5yaVpSQJGImvWRFyXeETiiQBYYl_EffQ36GhaFLyEF0YtY'
                    },
                    url: 'https://fcm.googleapis.com/fcm/send',
                    body: JSON.stringify({
                        "to": device,
                        "notification": Body,
                        "data": {
                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                            "body": {
                                "code": 100,
                                "codeTitle": "New Booking",
                                "_id": bookingData._id
                            }
                        }

                    })
                }, function (error, response, body) {
                    if (error) {
                        console.log('Booking created by customer notification', error.message)
                    }
                });

                request.post({
                    headers: { 'Content-Type': 'application/json' },
                    url: 'http://159.89.155.62:3000/mirror/api/notification',
                    body: JSON.stringify({
                        "employee": JSON.stringify(bookingData.StylistID),
                        "data": JSON.stringify({
                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                            "body": {
                                "code": 100,
                                "codeTitle": "New Booking",
                                "_id": bookingData._id
                            }
                        })

                    })
                }, function (error, response, body) {
                    if (error) {
                        console.log('Booking created by customer notification save ', error.message)
                    }
                });
            })
            connection.release();


        });




    }
    catch
    (err) {
        console.log('Bookings notification', err.message)
    }
}


module.exports = router;