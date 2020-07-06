const { Salon } = require('../models/salon');
const { Payment } = require('../models/payment');
const { Customer } = require('../models/customer');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const PDF = require('pdfkit');
const { createNewConnection2 } = require('../lib/connection');

let data;
router.post('/', async (req, res) => {
    try {
        let EducationCourseID;
        if (req.body.course) {
            EducationCourseID = parseInt(req.body.course);
        }
        else {
            EducationCourseID = parseInt(req.body.event);
        }

        if (!EducationCourseID || EducationCourseID == "" || EducationCourseID == null) {
            req.body.salon = req.body.Company_ID;
            if (!req.body.customer || req.body.customer == "") {
                res.send({ 'message': 'cusotomerId mandatory' });
            }
            if (!req.body.salon || req.body.salon == "") {
                res.send({ 'message': 'salon mandatory' });
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
                    status_code: req.body.status_code,
                    status_code: req.body.status_code,
                    order_id: req.body.order_id,
                    channel: req.body.channel,
                    chksum: req.body.chksum,
                    mp_secured_verified: req.body.mp_secured_verified,
                    mobile: req.body.mobile,
                    customer: req.body.customer,
                    booking: req.body.booking,
                    salon: req.body.salon,
                    StylistID: req.body.StylistID


                });
                await data.save();
                res.status(201).send(data)
            }
            else {
                data = new Payment(req.body);
                await data.save();
                res.status(201).send(data)
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
                status_code: req.body.status_code,
                status_code: req.body.status_code,
                order_id: req.body.order_id,
                channel: req.body.channel,
                chksum: req.body.chksum,
                mp_secured_verified: req.body.mp_secured_verified,
                mobile: req.body.mobile,
                employee: req.body.employee,
                educationCourseID: EducationCourseID,
                StylistID: req.body.StylistID


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
        res.send(response);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Payment receipt', err.message)
    }
});


module.exports = router;