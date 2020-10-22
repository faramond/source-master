const { Salon } = require('../models/salon');
const { Wallet } = require('../models/wallet');
const { Customer } = require('../models/customer');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        let oldBalance = await Wallet.findOne({ mobile: req.query.mobile })

        if (!oldBalance)
            data = new Wallet(req.body);
        await data.save();
        res.status(201).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Wallet Error', err.message)
    }
});

router.patch('/:mobile', async (req, res) => {
    try {
        let balance = await Wallet.findOne({ mobile: req.params.mobile })
        let total = balance.totalBalance + req.body.addBalance
        if (balance)
            data = await Wallet.findByIdAndUpdate(balance.id, {
                oldBalance1: balance.totalBalance,
                totalBalance: total
            }, { new: true });
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Wallet Error', err.message)
    }
});

router.get('/', async (req, res) => {
    try {
        data = await Wallet.find({ mobile: req.query.mobile }).select('mobile totalBalance'),
            res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Reward Error', err.message)
    }
});

module.exports = router;