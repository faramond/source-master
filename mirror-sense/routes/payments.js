const { Payment } = require('../models/payment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {


        const payment = await Payment
            .find().or([{ mobile: req.query.mobile }, { mirrorstar: req.body.mirrorstar }])
            .and({ created: { $gte: (req.query.createdFrom), $lte: ((req.query.createdTo) + "T23:59:59.000Z") } })
            .select({ order_id: 1, customerName: 1, created: 1, amount: 1, channel: 1, service: 1 })
        res.status(200).send(payment);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('payment', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let payment = new Payment(req.body);
        payment = await payment.save();

        res.status(201).send(payment);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('payment', err.message)
    }

}
);

module.exports = router; 