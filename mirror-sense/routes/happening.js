const { Happening } = require('../models/happening');
const { Customer } = require('../models/customer');
const upload = require('../storage/image')
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        let data = new Happening(req.body);
        await data.save();
        res.status(201).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Happening Error', err.message)
    }
});
router.get('/', async (req, res) => {
    try {
        data = await Happening.find({ type: req.query.type}).or({isActive: req.query.isActive})
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Happening Error', err.message)
    }
});

router.patch('/:id', upload.array('images', 2), async (req, res) => {
    try {
        if (!req.files) {
            let happening = await Happening.findByIdAndUpdate(req.params.id, {
                $set: req.body

            }, { new: true });

            res.status(200).send(salon)
        }
        else {
            for (let key in req.files) {
                if (req.files[key].originalname.includes('logo')) {
                    let happening = await Happening.findByIdAndUpdate(req.params.id, {
                        logo: req.files[key].path

                    }, { new: true });
                }
                else {
                    let happening = await Happening.findByIdAndUpdate(req.params.id, {
                        image: req.files[key].path

                    }, { new: true });
                }
            }
            res.status(200).send({ 'message': 'files uploded' })
        }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Happening Data', err.message)
    }
});

module.exports = router;