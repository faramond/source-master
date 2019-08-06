const { Customer, validate } = require('../models/customer');
const { Employee, validateEmp } = require('../models/employee');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.send(customers);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('login Get', err.message)
    }

});
router.patch('/:id', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await Customer.findByIdAndUpdate(req.params.id,
            {
                password: req.body.password,
                updated: new Date(),

            }, { new: true });

        if (!user) return res.status(404).send({ 'message': 'Login not found.' });

        res.send(user);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }
});
router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let user = await Customer.findOne({ mobileNumber: req.body.mobileNumber });
        if (user) return res.status(400).send({ 'message': 'MobileNumber already registered.' });
        req.body.email = req.body.email === undefined ? req.body.mobileNumber + '@null_email' : req.body.email;
        user = new Customer(_.pick(req.body, ['fullName', 'mobileNumber', 'countryCode', 'password', 'email']));

        // user =  new Customer({

        //     fullName: req.body.fullName,
        //     mobileNumber: req.body.mobileNumber,
        //     password: req.body.password,
        //     email: emailAddress,
        //     created: new Date(),

        // });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log(user.password);
        await user.save();
        res.status(201).send(_.pick(user, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email']));

        // const token = user.generateAuthToken();
        // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});
router.get('/employee', async (req, res) => {
    try {
        const employee = await Employee.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.send(employee);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('login Get', err.message)
    }

});
router.patch('/employee/:id', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const employee = await Employee.findByIdAndUpdate(req.params.id,
            {
                password: req.body.password,
                updated: new Date(),

            }, { new: true });

        if (!employee) return res.status(404).send({ 'message': 'Login not found.' });

        res.send(employee);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Employee Patch', err.message)
    }
});
router.post('/employee', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(
            { 'message': error.details[0].message });

        let employee= await Employee.findOne({ mobileNumber: req.body.mobileNumber });
        if (employee) return res.status(400).send({ 'message': 'MobileNumber already registered.' });
        req.body.email = req.body.email === undefined ? req.body.mobileNumber + '@null_email' : req.body.email;
        employee = new Employee(_.pick(req.body, ['fullName', 'mobileNumber', 'countryCode', 'password', 'email']));
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
        console.log(employee.password);
        await employee.save();
        res.status(201).send(_.pick(employee, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email']));


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});
module.exports = router;