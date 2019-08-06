const { Customer } = require('../models/customer');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let user = await Customer.findOne({ mobileNumber: req.body.mobileNumber });
        if (!user) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        res.status(201).send(_.pick(user, ['_id','countryCode','mobileNumber','fullName','email','gender','dob','profile','created','updated']))
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Auth Post', err.message)
    }
});
function validate(customer) {
    const schema = {
        mobileNumber: Joi.string().min(5).max(15).required(),
        countryCode: Joi.string().min(2).max(15).required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(customer, schema);
}

module.exports = router;