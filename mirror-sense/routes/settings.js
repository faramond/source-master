const { Setting } = require('../models/settings');
const { Payment } = require('../models/payment');
const { Salon } = require('../models/salon');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection2 } = require('../lib/connection');

let data;
let salon;
router.post('/', async (req, res) => {
    try {
        data = new Setting(req.body);
        await data.save();
        res.status(201).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});
router.get('/', async (req, res) => {
    try {
        data = await Setting.find()
        .select({ termsAndConditions: 1, aboutUS: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/aboutUS', async (req, res) => {
    try {
        data = await Setting.find()
        .select({ aboutUS: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/terms', async (req, res) => {
    try {
        data = await Setting.find()
        .select({ termsAndConditions: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/help', async (req, res) => {
    try {
        data = await Setting.find()
        .select({ help: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/privacyPolicy', async (req, res) => {
    try {
        data = await Setting.find()
        .select({ privacyPolicy: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/faq', async (req, res) => {
    try {
        faq = [];
        data = await Setting.find()
        .select({ FAQ: 1 })
        if(data != null && data != [] && data != ''){
            faq = data[0].FAQ;
        }
        res.status(200).send(faq)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});

router.get('/transaction/history/:id', async (req, res) => {
    try {
        let response;
        let historyResponse = [];
        let photo;

        let conn = await createNewConnection2();
        var sql = "Select Logo from Company_Profile where Company_ID= ?";
            data = await Payment.find().or([{ customer: req.params.id }, { employee: req.params.id }, { mirrorstar: req.params.id }])
            for (let key in data) {
         if(data[key].salon !=null) 
         {    ID= parseInt(data[key].salon);  
            salon = await Salon.findOne({salonID: data[key].salon});
            let [rows, fields] =  await conn.execute(sql,[ID]);
            if( rows != null && rows != [] && rows != ''){
                photo =rows[0].Logo;}
            if (salon != undefined) {
                response = {
                    'salonName': salon.salonName,
                    'salonId': salon.salonID,
                    'salonLogo': photo,
                    "txn_ID":data[key].txn_ID,
                    'amount': data[key].amount,
                    'currency': '$',
                    "status_code":data[key].status_code,
                    "brand":"advise",
                    "mobile":data[key].mobile,
                    'date': data[key].created
                }
                historyResponse.push(response);
            }

        }
    }
        res.status(200).send(historyResponse)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});
router.get('/transaction/history', async (req, res) => {
    try {
        data = await Payment.find({ mobile: req.query.mobile })
        for (let key in data) {
           if(data[key].salon!=null)
           { 
            salon = await Salon.findOne({ id: data[key].salon });
            if (salon != undefined) {
                response = {
                    'salonName': salon.salonName,
                    'salonId': salon.salonId,
                    'salonImage': salon.salonImage,
                    "txn_ID":data[key].txn_ID,
                    'amount': data[key].amount,
                    'currency': '$',
                    "status_code":data[key].status_code,
                    "brand":"advise",
                    "mobile":data[key].mobile,
                    'date': data[key].created
                }
                historyResponse.push(response);
            }

        }
    }
        res.status(200).send(historyResponse)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});


module.exports = router; 