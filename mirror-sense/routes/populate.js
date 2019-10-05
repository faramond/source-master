const { Salon } = require('../models/salon');
const { Company } = require('../models/company');
const { ServiceCategory,createServiceCategory } = require('../models/serviceCategory');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let data;
        if (req.body.company && req.body.salon && req.body.serviceCategory) {
            let company = new Company(req.body.company);
            await company.save();
            console.log("Company Created : ", company.id);
            req.body.salon.company = req.body.salon.company === undefined ? company.id : req.body.salon.company;
            console.log(req.body.salon.id);
            let salon = new Salon(req.body.salon);
            console.log("Salon Created :",salon.id);
            await salon.save();
            req.body.serviceCategory.salon = req.body.serviceCategory.salon === undefined ? salon.id : req.body.serviceCategory.salon;
            console.log(req.body.serviceCategory.id);
            let serviceCategory = new ServiceCategory(req.body.serviceCategory);
            console.log("ServiceCategory created", serviceCategory.id);
            await serviceCategory.save();

            salon = await Salon.findByIdAndUpdate(salon.id, {
                serviceCategory: serviceCategory.id
            }, { new: true });
            data = await Salon.find().populate("company serviceCategory");
            res.status(201).send(data)

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.post('/populate', async (req, res) => {
    try {

        if (req.body.company) {
            data = new Company(req.body.company);
            await data.save();
            res.status(201).send(data)
        }
        if (req.body.salon) {
            console.log(1);
            data = new Salon(req.body.salon);
            await data.save();
            res.status(201).send(data)
            console.log(2);
        }
        if (req.body.serviceCategory) {
            // data = new ServiceCategory(req.body.serviceCategory);
            // await data.save();
            data = await createServiceCategory(req.body)
            console.log("data--- ",data)
            res.status(201).send(data)
        }

        else { res.status(422).send({ message: 'invalid schema' }); console.log(3); }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});


router.get('/', async (req, res) => {
    try {

        // console.log(req.query.mobileNumber)
        // let queryString =req.query
        // console.log('query Name:',queryString);

        const salon = await Salon.find().populate("company serviceCategory");
        res.send(salon);
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('populate Get', err.message)
    }

});

module.exports = router;
