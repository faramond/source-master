const { Setting } = require('../models/settings');
const { Payment } = require('../models/payment');
const { Salon } = require('../models/salon');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});


router.get('/transaction/history/:id', async (req, res) => {
    try {
        let response;
        let historyResponse = [],
            data = await Payment.find().or([{ customer: req.params.id }, { employee: req.params.id }, { mirrorstar: req.params.id }, { salon: req.params.id }])
        console.log(data);
            for (let key in data) {
         if(data[key].salon !=null) 
         {      
            salon = await Salon.findOne({_id: data[key].salon.toString()});
            console.log(salon);
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