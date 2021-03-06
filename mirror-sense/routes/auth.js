const { Customer } = require('../models/customer');
const { Employee } = require('../models/employee');
const { MirrorStar } = require('../models/mirrorStar');
const { createNewConnection } = require('../lib/connection');
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

        let con = createNewConnection();

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('employee login', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql_2 = 'SELECT StylistID as _id,Gender,RegionCode,CreatedOn,DOB from Employee where Usernm = ? and  Password = ? and ShowinApps = ?'
            connection.query(sql_2, [req.body.Usernm, req.body.password, 1], function (err_2, result_2, fields) {
                if (err_2) {
                    console.log('employee login', err_2.message)
                    return res.status(400).send({ 'message': err_2.message });
                };

                if (result_2 == null || result_2 == "" || result_2 == {} || result_2 == [] || result_2.length == 0) {
                    return res.status(400).send({ 'message': 'Invalid userName or password.' });
                }

                if (req.body.deviceID != null && req.body.deviceID != undefined) {
                    var sql = 'Update Employee set DeviceID = ? where StylistID = ?';
                    connection.query(sql, [req.body.deviceID, result_2[0]._id], function (err, result, fields) {
                        if (err) {
                            console.log('emp-loyee login', err.message)
                            return res.status(400).send({ 'message': err.message });
                        }
                    })

                }

                var sql_3 = 'SELECT FullName as fullName, Email as email, HeaderImage as image, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhoneNumber as mobileNumber,Address as address,PhotoDir as profile from Employee where Usernm = ? and  Password = ? and ShowinApps = ?'
                connection.query(sql_3, [req.body.Usernm, req.body.password, 1], function (err_3, result_3, fields) {
                    if (err_3) {
                        console.log('employee login', err_3.message)
                        return res.status(400).send({ 'message': err_3.message });
                    };


                    result_3 = JSON.stringify(result_3);
                    result_3 = JSON.parse(result_3);
                    result_3[0].mirrorstar = JSON.stringify(result_2[0]._id);
                    result_3[0]._id = JSON.stringify(result_2[0]._id);
                    result_3[0].countryCode = JSON.stringify(result_2[0].RegionCode);
                    result_3[0].StylistID = result_2[0]._id;
                    result_3[0].followers = [];
                    result_3[0].created = (new Date(result_2[0].CreatedOn)).toISOString();
                    result_3[0].dob = (new Date(result_2[0].DOB)).toISOString();
                    if (result_2[0].Gender === 'M') {
                        result_3[0].gender = "male";
                    }
                    if (result_2[0].Gender === 'F') {
                        result_3[0].gender = "female";
                    }
                    res.status(201).send(result_3[0])

                })
            })
            connection.release();
        })
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
        deviceID: Joi.string()
    };

    return Joi.validate(employee, schema);
}

module.exports = router;