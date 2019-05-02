const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().or([{ userName: req.query.userName }, { mobileNumber: req.query.mobileNumber }, { email: req.query.email }])
            .sort('name');
        res.send(customers);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let customer = new Customer({
            challenge: 1234,
            fullName: req.body.fullName,
            userName: req.body.userName,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password,
            email: req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            profile: req.body.profile,
            created: new Date(),

        });
        customer = await customer.save();

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Post', err.message)
    }

});
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                email: req.body.email,
                dob: req.body.dob,
                gender: req.body.gender,
                profile: req.body.profile,
                updated: new Date(),

            }, { new: true });

        if (!customer) return res.status(404).send({'message':'The customer with the given ID was not found.'});

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }


});
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer) return res.status(404).send({'message':'The customer with the given ID was not found.'});

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Delete', err.message)
    }
});



module.exports = router; 