const { Customer } = require('../models/customer');
const { Employee } = require('../models/employee');
const { MirrorStar } = require('../models/mirrorStar');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { error } = validateCustomer(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let user = await Customer.findOne({ mobileNumber: req.body.mobileNumber });
        if (!user) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        if (req.body.deviceID != null && req.body.deviceID != undefined) {
            let id = await Customer.findByIdAndUpdate(user._id,
                {
                    deviceID: req.body.deviceID,
                    updated: new Date(),

                }, { new: true });

            if (!id) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });
        }

        res.status(201).send(_.pick(user, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email', 'gender', 'dob', 'profile', 'created', 'updated', 'deviceID']))
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Auth Post', err.message)
    }
});
function validateCustomer(customer) {
    const schema = {
        mobileNumber: Joi.string().min(5).max(15).required(),
        countryCode: Joi.string().min(2).max(15).required(),
        password: Joi.string().min(5).max(255).required(),
        deviceID: Joi.string()
    };

    return Joi.validate(customer, schema);
}
/*router.post('/employee', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let employee = await Employee.findOne({ mobileNumber: req.body.mobileNumber })
            .and({ countryCode: req.body.countryCode });
        if (!employee) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        const validPassword = await bcrypt.compare(req.body.password, employee.password)
        if (!validPassword) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        let star = await MirrorStar.findOne({ employee: employee._id.toString() });
        employee.mirrorstar = star._id;
        res.status(201).send(_.pick(employee, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email', 'gender', 'dob', 'profile', 'created', 'updated', 'dateOfJoining', 'address', 'mirrorstar', 'image', 'followers', 'StylistID', 'salonID', 'branchID']))
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Auth Post', err.message)
    }
});
function validate(employee) {
    const schema = {
        mobileNumber: Joi.string().min(5).max(15).required(),
        countryCode: Joi.string().min(2).max(15).required(),
        password: Joi.string().min(5).max(255).required(),
        address: Joi.string().min(5).max(100)
    };

    return Joi.validate(employee, schema);
}*/

router.post('/employee', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let employee = await Employee.findOne({ Usernm: { $regex: new RegExp(req.body.Usernm, "i") } })
        if (!employee) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        const validPassword = await bcrypt.compare(req.body.password, employee.password)
        if (!validPassword) return res.status(400).send({ 'message': 'Invalid userName or password.' });
        let star = await MirrorStar.findOne({ employee: employee._id.toString() });
        employee.mirrorstar = star._id;
        if (req.body.deviceID != null && req.body.deviceID != undefined) {
            let id = await Employee.findByIdAndUpdate(employee._id,
                {
                    deviceID: req.body.deviceID,
                    updated: new Date(),

                }, { new: true });

            if (!id) return res.status(404).send({ 'message': 'The employee with the given ID was not found.' });
        }
        res.status(201).send(_.pick(employee, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email', 'gender', 'dob', 'profile', 'created', 'updated', 'dateOfJoining', 'address', 'mirrorstar', 'image', 'followers', 'StylistID', 'salonID', 'branchID', 'deviceID']))
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Auth Post', err.message)
    }
});
function validate(employee) {
    const schema = {
        Usernm: Joi.string().required(),
        password: Joi.string().min(5).max(255).required(),
        address: Joi.string().min(5).max(100),
        deviceID: Joi.string()
    };

    return Joi.validate(employee, schema);
}

module.exports = router;