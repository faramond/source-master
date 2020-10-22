const { Salon } = require('../models/salon');
const { MirrorStar } = require('../models/mirrorStar');
const { Customer } = require('../models/customer');
const upload = require('../storage/image')
let { avgRating } = require('../lib/ratings');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
var request = require('request');
const { createNewConnection } = require('../lib/connection');

let data;
router.post('/', async (req, res) => {
    try {
        if (!req.body.salon) {

            console.log('no salon ref', req.body.salonID);
            let salon = await Salon.findOne({ salonID: req.body.salonID })
            req.body.salon = salon._id;
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
        data = await MirrorStar.findOne().or([{ employee: req.query.employee }, { _id: req.query.star }]).select({ likes: 1 })
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('followers Error', err.message)
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

router.get('/sorted', async (req, res) => {
    try {

        let con = createNewConnection();
        lat = parseInt(req.query.lat);
        long = parseInt(req.query.long);
        serviceType = parseInt(req.query.serviceType);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('Mirrorstar sort error', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            console.log("Connected!");
            var sql = "Select * from ( select FullName as starName, StylistID, PhotoDir as image, CompanyLocation.Latitude as emp_latitude , CompanyLocation.Longitude as emp_longitude, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?)) * COS(RADIANS(CompanyLocation.Latitude)) * COS(RADIANS(?- CompanyLocation.Longitude)) + SIN(RADIANS(?)) * SIN(RADIANS(CompanyLocation.Latitude)), 1.0))) AS distance_in_km from Employee , CompanyLocation where Usernm!='admin' and CompanyLocation.CompanyID=Employee.Branch_ID ) tbl order by tbl.distance_in_km ";
            connection.query(sql, [lat, long, lat], async function (err, result, fields) {
                if (err) {
                    console.log('Mirrorstar sort error', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("fetch successful");
                console.log(result)
                if (result != [] && result != "" && result != null) {
                    for (i = 0; i < result.length; i++) {
                        var id = result[i].StylistID;
                        const star = await MirrorStar.findOne({ StylistID: id }).select({ reviews: 1, avgRating: 1 });
                        if (!star) {
                            result = JSON.stringify(result);
                            result = JSON.parse(result);
                            result[i].avgRating = 0;
                            result[i].NoOfReveiews = 0;
                        }
                        else {
                            result = JSON.stringify(result);
                            result = JSON.parse(result);
                            result[i].avgRating = star.avgRating;
                            result[i].NoOfReveiews = star.reviews.length;
                        }
                    }
                }
                else {
                    res.send({ 'message': 'Mirrorstar not found' })
                }
                res.send(result);
                connection.release();


            });
        });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Mirrorstar sort error', err.message)
    }

});

router.get('/MirrorStar', async (req, res) => {
    try {

        data = await MirrorStar.find({ branchID: req.query.Company_ID }).and([{ salonID: req.query.salonid }])
        res.status(200).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('get star by company id', err.message)
    }

});
router.get('/all', async (req, res) => {
    try {
        data = await MirrorStar.find()
        res.status(200).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});

router.get('/:id', async (req, res) => {
    try {
        data = await MirrorStar.find().or([{ salon: req.params.id }, { employee: req.params.id }])
        res.status(200).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});


router.get('/detail/:id', async (req, res) => {
    try {
        temp = {};
        data = await MirrorStar.findOne({ _id: req.params.id });
        if (data) {
            temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            const customer = await Customer.findOne().or({ _id: req.query.customer }).select({ likedMirrorStar: 1 });
            if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
            temp.isLiked = 'false';
            for (i = 0; i < customer.likedMirrorStar.length; i++) {
                if (req.params.id === customer.likedMirrorStar[i]) {
                    temp.isLiked = 'true';
                }
            }
            let ratings = avgRating(data);
            if (ratings != [] && ratings != {} && ratings != "" && ratings != null) {
                temp.ratings = ratings;
                res.status(200).send(temp)
            }
            else {
                temp.ratings = {};
                res.status(200).send(temp)
            }
        }
        else {
            res.send({ 'message': 'mirrorstar not found' });
        }

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
        console.log('image upload', err.message)
    }
});

router.get('/review/:id', async (req, res) => {
    try {

        const mirrorStar = await MirrorStar.findOne({ _id: req.params.id }).select('reviews');
        if (!mirrorStar) return res.send({ 'message': 'star not found' })
        let ratings = avgRating(mirrorStar);
        // ratings.reviews.push(salon);
        res.send(ratings).status(200);

    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});


router.post('/post/:id', async (req, res) => {
    try {

        let data = await MirrorStar.findByIdAndUpdate(req.params.id, {

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
        let name = await Customer.findOne({ _id: req.query.customer }).select({ fullName: 1 });
        if (!name) return res.send({ 'message': 'customer not found: check customer _id passed' })
        let image = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1 });
        if (!image) {
            image = { profile: '' }
        }

        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            let data = await MirrorStar.findByIdAndUpdate(req.params.id, {

                $addToSet: {
                    reviews: {
                        reviewer: name.fullName,
                        image: image.profile,
                        rating: req.body.reviews[0].rating,
                        review: req.body.reviews[0].review
                    }
                }
            },
                { new: true },
                function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
            let obj = {};
            obj.reviews = data.reviews;
            let temp = avgRating(obj);
            if (!temp) res.send({ 'message': 'can not get avgRating' })
            let mirrorStar = await MirrorStar.findByIdAndUpdate(req.params.id, {
                avgRating: temp.avgRating
            }
                , { new: true }, function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });

            res.status(201).send(data)

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('star review', err.message)
    }
});

router.patch('/likes/:id', async (req, res) => {


    try {
        let flag = false;
        let check = await MirrorStar.findOne({ _id: req.params.id }).select({ likes: 1 });
        if (!check) return res.status(404).send({ 'message': 'Mirror star not found' });

        if (check.likes.length != 0) {
            for (i = 0; i < check.likes.length; i++) {
                if ((check.likes[i].customer == req.query.customer)) {
                    let mStar = await MirrorStar.findByIdAndUpdate(req.params.id,
                        {
                            $pull: { likes: { customer: req.query.customer } },

                            $inc: { likeCounter: -1 }
                        },
                    );
                    if (!mStar) return res.status(404).send({ 'message': 'Mirror star not found' });


                    let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                        { $pull: { likedMirrorStar: req.params.id } }
                    );
                    if (!data) return res.status(404).send({ 'message': 'Customer not found' });

                    result = "False";
                    res.send({ 'message': 'Mirror Star unliked', result });

                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            let name = await Customer.findOne({ _id: req.query.customer }).select({ fullName: 1 });
            if (!name) return res.status(404).send({ 'message': 'Customer not found' });
            let image = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1 });
            let mStar = await MirrorStar.findByIdAndUpdate(req.params.id,
                {
                    $addToSet: {
                        likes: {
                            name: name.fullName,
                            image: image.profile,
                            customer: req.query.customer
                        },
                    },
                    $inc: { likeCounter: 1 }
                },

                { new: true });
            if (!mStar) return res.status(404).send({ 'message': 'Mirror Star not found' });


            let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                { $addToSet: { likedMirrorStar: req.params.id } },
                { new: true });
            if (!data) return res.status(404).send({ 'message': 'Customer not found' });

            result = "True";
            res.send({ 'message': 'Mirror Star liked', result });

        };
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});







module.exports = router;