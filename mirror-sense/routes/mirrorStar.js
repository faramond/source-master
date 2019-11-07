const { Salon } = require('../models/salon');
const { MirrorStar } = require('../models/mirrorStar');
const upload = require('../storage/image')
let { avgRating } = require('../lib/ratings');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

let data;
router.post('/', async (req, res) => {
    try {
        if (!req.body.salon) {

            console.log('no salon ref', req.body.salonID);
            let salon = await Salon.findOne({ salonID: req.body.salonID })
            req.body.salon = salon._id
            data = new MirrorStar(req.body);
            await data.save();
            res.status(201).send(data)
        }
        else {
            data = new MirrorStar(req.body);
            await data.save();
            res.status(201).send(data)
        }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }
});


router.get('/followers', async (req, res) => {
    try {
        data = await MirrorStar.find().or([{employee: req.query.employee},{_id: req.query.star}]).select('coverImage image followers')
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});


router.post('/followers/:id', async (req, res) => {
    try {

        let data = await MirrorStar.findByIdAndUpdate(req.params.id, {

            $addToSet: { followers: req.body.followers }
        },
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
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Post Data', err.message)
    }
});


router.get('/:id', async (req, res) => {
    try {
        data = await MirrorStar.findOne().or([{ salon: req.params.id },{ employee: req.params.id }])
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});
router.get('/detail/:id', async (req, res) => {
    try {
        data = await MirrorStar.findOne({_id : req.params.id})
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});
router.get('/', async (req, res) => {
    try {
        data = await MirrorStar.find({ avgRating: { $gt: parseInt(req.query.avgRating) } })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});




router.patch('/:id', upload.array('images', 2), async (req, res) => {
    try {
        if (!req.files) {
            let mirrorStar = await MirrorStar.findByIdAndUpdate(req.params.id, {
                $set: req.body

            }, { new: true });

            res.status(200).send(salon)
        }
        else {
            for (let key in req.files) {
                if (req.files[key].originalname.includes('logo')) {
                    let mirrorStar = await MirrorStar.findByIdAndUpdate(req.params.id, {
                        logo: req.files[key].path

                    }, { new: true });
                }
                else {
                    let mirrorStar = await MirrorStar.findByIdAndUpdate(req.params.id, {
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

router.get('/review/:id', async (req, res) => {
    try {

        const mirrorStar = await MirrorStar.findOne( {_id: req.params.id}).select('reviews');
        console.log(mirrorStar);
        let ratings = avgRating(mirrorStar);
        console.log('ratings:', ratings);
        // ratings.reviews.push(salon);
        console.log('salon:', mirrorStar.reviews);
        res.send(ratings).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});


router.post('/post/:id', async (req, res) => {
    try {

        let data = await MirrorStar.findOneAndUpdate(req.params.id, {

            $addToSet: { post: req.body.post }
        },
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
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Post Data', err.message)
    }
});


router.post('/review/:id', async (req, res) => {
    try {
        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            let data = await MirrorStar.findOneAndUpdate(req.params.id, {
                
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

module.exports = router;