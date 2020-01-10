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
        req.body.salon = req.body.Company_ID;
        if (!req.body.customer || req.body.customer == "") {
            res.send({ 'message': 'cusotomerId mandatory' });
        }
        if (!req.body.salon || req.body.salon == "") {
            res.send({ 'message': 'salon mandatory' });
        }
        if(req.body.dealID != null){
            data = new Payment({
               amount :  req.body.amount,
               customerName : req.body.customerName,
               services : req.body.services,
               dealID : req.body.dealID,
               dealName : req.body.dealName,
               app_code : req.body.app_code,
               txn_ID : req.body.txn_ID,
               pInstruction : req.body.pInstruction,
               msgType : req.body.msgType,
               status_code : req.body.status_code,
               status_code : req.body.status_code,
               order_id : req.body.order_id,
               channel : req.body.channel,
               chksum : req.body.chksum,
               mp_secured_verified : req.body.mp_secured_verified,
               mobile : req.body.mobile,
               customer : req.body.customer,
               booking : req.body.booking,
               salon : req.body.salon,
               StylistID : req.body.StylistID

               
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