const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
// 
require('../models/user_model')
const User = mongoose.model('User');
const config = require('../config.js');
const qs = require('qs');
const request = require('request');
let phoneReg = require('../lib/phone_verification')(config.API_KEY);


// https://github.com/seegno/authy-client
const Client = require('authy-client').Client;
const authy = new Client({ key: config.API_KEY });

// router.post('/', async (req, res) => {
//     try {
//         let customer = new Customer({
//             challenge: 1234,
//             fullName: req.body.fullName,
//             userName: req.body.userName,
//             mobileNumber: req.body.mobileNumber,
//             password: req.body.password,
//             email: req.body.email,
//             dob: req.body.dob,
//             gender: req.body.gender,
//             profile: req.body.profile,
//             created: new Date(),

//         });
//         customer = await customer.save();

//         res.send(customer);
//     }
//     catch (err) {
//         res.send({ 'message': err.message });
//         console.log('Customer Post', err.message)
//     }

// });

router.post('/start', (req, res) => {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;
    var via = req.body.via;

    console.log("body: ", req.body);

    if (phone_number && country_code && via) {
        phoneReg.requestPhoneVerification(phone_number, country_code, via, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Success register phone API call: ', response);
                res.status(201).json(response);
            }
        });
    } else {
        console.log('Failed in Register Phone API Call', req.body);
        res.status(500).json({ error: "Missing fields" });
    }

});

router.post('/verify', (req, res) => {
    try {
        var country_code = req.body.country_code;
        var phone_number = req.body.phone_number;
        var token = req.body.token;

        if (phone_number && country_code && token) {
            phoneReg.verifyPhoneToken(phone_number, country_code, token, function (err, response) {
                if (err) {
                    console.log('error creating phone reg request', err);
                    res.status(500).json(err);
                } else {
                    console.log('Confirm phone success confirming code: ', response);
                    // if (response.success) {
                    //     req.session.ph_verified = true;
                    // }
                    res.status(201).send(response);
                }

            });
        } else {
            console.log('Failed in Confirm Phone request body: ', req.body);
            res.status(500).json({ error: "Missing fields" });
        }
    }
    catch (er) {
        res.send({ 'message': err.message });
    }
});

/**
 * Create the initial user session.
 *
 * @param req
 * @param res
 * @param user
 */
function createSession(req, res, user) {
    req.session.regenerate(function () {
        req.session.loggedIn = true;
        req.session.user = user.id;
        req.session.username = user.username;
        req.session.msg = 'Authenticated as: ' + user.username;
        req.session.authy = false;
        req.session.ph_verified = false;
        res.status(200).json();
    });
}

module.exports = router; 