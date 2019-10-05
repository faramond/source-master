const {Setting} = require('../models/settings');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        data = new Setting(req.body);
        await data.save();
        res.status(201).send(data)
        }
     catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});
router.get('/', async (req, res) => {
    try {
        data = await Setting.find()
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Setting Error', err.message)
    }
});


module.exports = router; 