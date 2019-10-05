
const express = require('express');
const mysql = require('mysql')
const multer = require('multer');
const upload = require('../storage/image')
let { Salon } = require('../models/salon');
let { avgRating } = require('../lib/ratings');
let { ServiceCategory } = require('../models/serviceCategory');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        if (req.query.company) {
            let salon = await Salon.find({ company: req.query.company }).select('salonName address.addressLine address.addressLine1 address.town address.phone geometry');
            res.status(200).send(salon);
        }
        if (!req.query.serviceType) {
            let salon = await Salon.aggregate([{ $geoNear: { near: { type: 'Point', coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)] }, spherical: true, distanceField: "dist.calculated" } }])
            res.status(200).send(salon);
        }
        else {
            let queryString = req.query
            let serviceCategory = await ServiceCategory.findOne({ serviceType: req.query.serviceType }).populate('salon');
            let salon = await Salon.aggregate([{ $geoNear: { near: { type: 'Point', coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)] }, spherical: true, distanceField: "dist.calculated" } }])
            let result = [];
            for (let i = 0; i < serviceCategory.salons.length; i++) {

                for (let j = 0; j < salon.length; j++) {
                    console.log(serviceCategory.salons[i] + '   1')

                    if (serviceCategory.salons[i].toString() === salon[j]._id.toString()) {
                        result.push(salon[j])
                        console.log(salon[j]._id + '   Final')
                        break;
                    }
                }


            }
            console.log(result);
            res.send(result).status(200);
        }


    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err)
    }

});

router.get('/:id', async (req, res) => {
    try {
        let queryString = req.query
        let salon = await Salon.findOne().populate('serviceCategory');
        res.send(salon).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});

router.get('/review/:id', async (req, res) => {
    try {

        const salon = await Salon.findOne().select('reviews');
        console.log(salon);
        let ratings = avgRating(salon);
        console.log('ratings:', ratings);
       // ratings.reviews.push(salon);
        console.log('salon:', salon.reviews);
        res.send(ratings).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});





router.post('/', async (req, res) => {
    try {
        console.log('in');
        let salon = await Salon.find()
        req.body.salonID = 'S' + (100 + salon.length)
        console.log(req.body.salonID);
        data = new Salon(req.body);
        await data.save();
        res.status(201).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.post('/review/:id', async (req, res) => {
    try {
        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            let data = await Salon.findOneAndUpdate(req.params.id, {
                
                $addToSet: { reviews: req.body.reviews } },
                { new: true },
                function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
            console.log(data);
            // await data.save();
            res.status(201).send(data)

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.patch('/:id', upload.array('images', 2), async (req, res) => {
    try {
        if (!req.files) {
            let salon = await Salon.findByIdAndUpdate(req.params.id, {
                $set: req.body

            }, { new: true });

            res.status(200).send(salon)
        }
        else {
            for (let key in req.files) {
                if (req.files[key].originalname.includes('logo')) {
                    let salon = await Salon.findByIdAndUpdate(req.params.id, {
                        logo: req.files[key].path

                    }, { new: true });
                }
                else {
                    let salon = await Salon.findByIdAndUpdate(req.params.id, {
                        salonImage: req.files[key].path

                    }, { new: true });
                }
            }
            res.status(200).send({ 'message': 'files uploded' })
        }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});


module.exports = router;


