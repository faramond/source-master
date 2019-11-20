const { Payment } = require('../models/payment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
        
        const payment = await Payment.find()
        .and([{ mobile:req.query.mobile },{created:{$gte:(req.query.createdFrom),$lte:(req.query.createdTo)}}])
        
        .select({ order_id: 1, employeeName: 1, created: 1, amount: 1, channel: 1})
        res.send(payment);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('payment', err.message)
    }

});

router.post('/', async (req, res) => {
     try {
         let payment = new Payment(req.body);
         payment = await payment.save();
 
         res.send(payment);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('payment', err.message)
     }
 
    }
);

module.exports = router; 