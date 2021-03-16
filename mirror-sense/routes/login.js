const { Customer, validate } = require('../models/customer');
const { Employee, validateEmp } = require('../models/employee');
const { Wallet } = require('../models/wallet');
const { MirrorStar } = require('../models/mirrorStar');
const { Salon } = require('../models/salon');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');
let { getEmployee } = require('../lib/uploadToSQL');
let { customerUpload } = require('../lib/uploadToSQL');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().or([{ mobileNumber: req.query.mobileNumber }])
            .sort('name');
        res.status(200).send(customers);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
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

        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }
});
router.post('/', async (req, res) => {
    try {
        // const { error } = validate(req.body);
        // if (error) return res.status(400).send(
        //  { 'message': error.details[0].message });

        let user = await Customer.findOne({ mobileNumber: req.body.mobileNumber });
        if (user) return res.status(400).send({ 'message': 'MobileNumber already registered.' });
        req.body.email = req.body.email === undefined ? req.body.mobileNumber + '@null_email' : req.body.email;
        user = new Customer(_.pick(req.body, ['fullName', 'mobileNumber', 'countryCode', 'password', 'email', 'deviceID']));

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
        try {
            let oldBalance = await Wallet.findOne({ mobile: req.body.countryCode + req.body.mobileNumber })
            let walletData = {
                "mobile": req.body.countryCode + req.body.mobileNumber,
                "addBalance": 0,
                "oldBalance1": 0,
                "totalBalance": 0,
                "cusomter": user._id
            }
            if (!oldBalance)
                data = new Wallet(walletData);
            await data.save();
            console.log(req.body.mobileNumber, ' wallet created')
        }
        catch (err) {
            res.status(400).send({ 'message': "Wallet" + err.message });
            console.log('Wallet Error', err.message)
        }
        res.status(201).send(_.pick(user, ['_id', 'countryCode', 'mobileNumber', 'fullName', 'email', 'deviceID']));

        //customerUpload(user, async function(result){

        //  const customer = await Customer.findByIdAndUpdate(user._id,
        //      {

        //        AccountNo: result.insertId

        //    }, { new: true });

        //  if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

        //   });
        // const token = user.generateAuthToken();
        // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Login Post', err.message)
    }
});


router.patch('/employee/:id', async (req, res) => {
    try {

        let con = createNewConnection();

        let ID = parseInt(req.params.id)

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('employee login', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql_2 = 'Update Employee set password = ? where StylistID = ?'
            connection.query(sql_2, [req.body.password, ID], function (err_2, result_2, fields) {
                if (err_2) {
                    console.log('employee login', err_2.message)
                    return res.status(400).send({ 'message': err_2.message });
                };

                if (result_2 != null && result_2 != "" && result_2 != [] && result_2 != {}) {
                    if (result_2.affectedRows != 0) {

                        var sql_3 = 'SELECT Gender as gender,Usernm, Password as password,DateReg as dateReg,UpdatedOn, AboutMe as bio,RegionCode as countryCode,CreatedOn as created,DOB as dob,FullName as fullName, Email as email, HeaderImage as image, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhoneNumber as mobileNumber,Address as address,PhotoDir as profile from Employee where StylistID = ?';
                        connection.query(sql_3, [ID], function (err_3, result_3, fields) {
                            if (err_3) {
                                console.log('employee login', err_3.message)
                                return res.status(400).send({ 'message': err_3.message });
                            };

                            if (result_3 != null && result_3 != "" && result_3 != [] && result_3 != {}) {


                                result_3 = JSON.stringify(result_3);
                                result_3 = JSON.parse(result_3);
                                result_3[0].mirrorstar = req.params.id;
                                result_3[0]._id = req.params.id;
                                result_3[0].countryCode = JSON.stringify(result_3[0].countryCode);
                                result_3[0].StylistID = parseInt(req.params.id);
                                result_3[0].followers = [];
                                result_3[0].salonName = null;
                                result_3[0].salon = null;
                                result_3[0].speciality = [];
                                result_3[0].likeCounter = 0;
                                result_3[0].likes = [];
                                result_3[0].dateReg = (new Date(result_3[0].dateReg)).toISOString();
                                result_3[0].UpdatedOn = (new Date(result_3[0].UpdatedOn)).toISOString();
                                result_3[0].created = (new Date(result_3[0].created)).toISOString();
                                result_3[0].dob = (new Date(result_3[0].dob)).toISOString();
                                if (result_3[0].gender === 'M') {
                                    result_3[0].gender = "male";
                                }
                                if (result_3[0].gender === 'F') {
                                    result_3[0].gender = "female";
                                }
                                res.status(201).send(result_3[0])
                            }
                            else {
                                return res.status(404).send({ 'message': 'Employee Login not found.' });
                            }

                        })

                    }
                    else {
                        return res.status(404).send({ 'message': 'Employee Login not found.' });
                    }
                }
                else {
                    return res.status(404).send({ 'message': 'Employee Login not found.' });
                }



            })

            connection.release();
        })

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Employee Patch', err.message)
    }
});

module.exports = router;