const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../storage/image')
const { customerUpdate } = require('../lib/uploadToSQL');
const { createNewConnection2 } = require('../lib/connection');

router.get('/', async (req, res) => {
    try {

        console.log(req.query.mobileNumber)
        let queryString = req.query
        console.log('query Name:', queryString);

        const customers = await Customer.find().or([{ mobileNumber: req.query.mobileNumber }, { email: req.query.email }])
            .sort('name');
        res.status(200).send(customers);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.post('/', async (req, res) => {
    // let emailAddress= req.body.email = null;
    req.body.email = req.body.email === undefined ? req.body.mobileNumber + '@null_email' : req.body.email;
    console.log(req.body.email);
    try {
        let customer = new Customer({
            challenge: 1234,
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            countryCode: req.body.countryCode,
            password: req.body.password,
            email: req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            profile: req.body.profile,
            deviceID: req.body.deviceID,
            created: new Date(),

        });
        customer = await customer.save();

        res.status(201).send(customer);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Post', err.message)
    }

});
router.patch('/:id', upload.single('profile'), async (req, res) => {
    try {
        if (req.file == undefined) {
            const customer = await Customer.findByIdAndUpdate(req.params.id,
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    updated: new Date(),

                }, { new: true });

            if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

            // customerUpdate(customer);
            res.status(200).send(customer);

        }

        else {
            const customer = await Customer.findByIdAndUpdate(req.params.id,
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    profile: req.file.path,
                    updated: new Date(),

                }, { new: true });

            if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

            //  customerUpdate(customer);
            res.status(200).send(customer);
        }




    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }


});
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

        res.status(200).send(customer);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Delete', err.message)
    }
});

router.get('/favourite/:id', async (req, res) => {
    try {
        let response = [];
        let conn = await createNewConnection2();


        var sql = "Select FullName as starName,avgRating,  PhotoDir as image from Employee where StylistID = ?"
        const customer = await Customer.findOne().or({ _id: req.params.id }).select({ likedMirrorStar: 1 });
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for (i = 0; i < customer.likedMirrorStar.length; i++) {
            ID = customer.likedMirrorStar[i];

            let [rows, fields] = await conn.execute(sql, [ID]);

            if (rows != [] && rows != "" && rows != null) {
                rows = JSON.stringify(rows);
                rows = JSON.parse(rows);
                rows[0]._id = ID;
                rows[0].avgRating = parseFloat(rows[0].avgRating)
                response.push(rows[0]);
            }
        }

        res.status(200).send(response);

    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.get('/favouriteSalon/:id', async (req, res) => {
    try {
        let photo = "";
        var response = [];
        let conn = await createNewConnection2();
        var sql = "Select Logo ,Company_ID, Company_Name, avgRating  from Company_Profile  where Company_ID= ?";

        const customer = await Customer.findOne().or({ _id: req.params.id }).select({ likedSalon: 1 });
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for (i = 0; i < customer.likedSalon.length; i++) {
            ID = parseInt(customer.likedSalon[i]);
            let [rows, fields] = await conn.execute(sql, [ID]);
            if (rows != null && rows != [] && rows != '') {

                temp = JSON.stringify(rows[0]);
                temp = JSON.parse(temp);
                temp.avgRating = parseFloat(temp.avgRating)
            }
            response[i] = (temp);

        }
        res.status(200).send(response);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.get('/isLiked/:id', async (req, res) => {
    try {

        const customer = await Customer.findOne().or({ _id: req.params.id }).select({ likedSalon: 1 });
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for (i = 0; i < customer.likedSalon.length; i++) {
            if (req.query.Company_ID === customer.likedSalon[i]) {
                return res.send({ 'message': 'True' });
            }
        }
        res.status(200).send({ 'message': 'False' });
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});



module.exports = router; 