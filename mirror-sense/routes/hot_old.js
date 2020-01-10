const { Salon } = require('../models/salon');
const { Customer } = require('../models/customer');
const { WhatHot } = require('../models/whatHot');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        if (!req.body.salon) {
            
            console.log('no salon ref',req.body.salonID);
            let salon = await Salon.findOne({salonID:req.body.salonID})
            req.body.salon = salon._id
            data = new WhatHot(req.body);
            await data.save();
            res.status(201).send(data)
        }
       else {
        data = new WhatHot(req.body);
        await data.save();
        res.status(201).send(data)
        }
        
   }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }
});
router.get('/:salon', async (req, res) => {
    try {
        data = await WhatHot.find({ salon: req.params.salon })
        res.status(201).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }
});

module.exports = router;