const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
 const customers = await Customer.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.send(customers);    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('login Get', err.message)
    }

});
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                password:req.body.password,
                updated: new Date(),

            },{ new: true });

        if (!customer) return res.status(404).send({'message':'The customer with the given mobile was not found.'});

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }


});
module.exports = router;