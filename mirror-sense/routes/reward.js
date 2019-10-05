const { Salon } = require('../models/salon');
const { Rewards } = require('../models/reward');
const { Customer } = require('../models/customer');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        data = new Rewards(req.body);
        await data.save();
        res.status(201).send(data)
        }
     catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Reward Error', err.message)
    }
});
router.get('/', async (req, res) => {
    try {
        data = await Rewards.find({ mobile: req.query.mobile })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Reward Error', err.message)
    }
});

module.exports = router;