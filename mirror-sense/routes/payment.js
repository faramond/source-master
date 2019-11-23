const { Salon } = require('../models/salon');
const { Payment } = require('../models/payment');
const { Customer } = require('../models/customer');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        if (!req.body.customer || req.body.customer == "") {
            res.send({ 'message': 'cusotomerId mandatory' });
        }
        if (!req.body.salon || req.body.salon == "") {
            res.send({ 'message': 'salon mandatory' });
        }
        else {
            data = new Payment(req.body);
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

module.exports = router;