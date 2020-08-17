
const express = require('express');
const upload = require('../storage/image')
let { Salon } = require('../models/salon');
let { Customer } = require('../models/customer');
let { avgRating } = require('../lib/ratings');
let { ServiceCategory } = require('../models/serviceCategory');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');
const { createNewConnection2 } = require('../lib/connection');
var request = require('request');

/*router.get('/', async (req, res) => {

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

                for (let i = 0; i < salon.length; i++) {
                    console.log(serviceCategory.salons[i] + '   1')

                    if (serviceCategory.salons[i].toString() === salon[i]._id.toString()) {
                        result.push(salon[i])
                        console.log(salon[i]._id + '   Final')
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

});*/


router.get('/', async (req, res) => {
    try {

        if (req.query.serviceType) {

            let con = createNewConnection();
            let conn = await createNewConnection2();
            lat = parseInt(req.query.lat);
            long = parseInt(req.query.long);
            serviceType = parseInt(req.query.serviceType);

            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('Bookings', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("Connected!");
                var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=?) as main_company_table order by distance_in_km';
                connection.query(sql, [lat, long, lat, serviceType], async function (err, result, fields) {
                    if (err) {
                        console.log('Bookings', err.message)
                        return res.status(400).send({ 'message': err.message });

                    };
                    console.log("fetch successful");
                    if (result != [] && result != "" && result != null) {
                        for (i = 0; i < result.length; i++) {
                            var id = result[i].Company_ID;
                            const salon = await Salon.findOne({ salonID: id }).select({ reviews: 1, avgRating: 1 });
                            if (!salon) {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = 0;
                                result[i].NoOfReveiews = 0;
                            }
                            else {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = salon.avgRating;
                                result[i].NoOfReveiews = salon.reviews.length;
                            }
                        }
                    }
                    else {
                        res.send({ 'message': 'Branches not found' })
                    }
                    res.send(result);
                    connection.release();


                });
            });
        }

        else {
            let con = createNewConnection();
            let conn = await createNewConnection2();
            lat = parseInt(req.query.lat);
            long = parseInt(req.query.long);

            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('Bookings', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("Connected!");
                var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid ) as main_company_table order by distance_in_km';
                connection.query(sql, [lat, long, lat], async function (err, result, fields) {
                    if (err) {
                        console.log('Bookings', err.message)
                        return res.status(400).send({ 'message': err.message });

                    };
                    console.log("fetch successful");
                    if (result != [] && result != "" && result != null) {
                        for (i = 0; i < result.length; i++) {
                            var id = result[i].Company_ID;
                            const salon = await Salon.findOne({ salonID: id }).select({ reviews: 1, avgRating: 1 });
                            if (!salon) {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = 0;
                                result[i].NoOfReveiews = 0;
                            }
                            else {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = salon.avgRating;
                                result[i].NoOfReveiews = salon.reviews.length;
                            }
                        }
                    }
                    else {
                        res.send({ 'message': 'Branches not found' })
                    }
                    res.send(result);
                    connection.release();

                });
            });
        }




    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});

router.post('/sync', async (req, res) => {
    try {
        let con = createNewConnection();
        let conn = await createNewConnection2();
        lat = parseInt(req.query.lat);
        long = parseInt(req.query.long);

        const salon = await Salon.find();
        con.getConnection(function (err, connection) {
            if (err) {
                console.log('saloon sync', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = 'select * from Company_Profile';
            connection.query(sql, async function (err, result, fields) {
                if (err) {
                    console.log('saloon sync', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                if (result != [] && result != "" && result != null) {
                    for (i = 0; i < result.length; i++) {
                        var id = result[i].Company_ID;
                        if (salon != [] && salon != "" && salon != null) {
                            flag = false;
                            for (j = 0; j < salon.length; j++) {
                                if (salon[j].branchID == id) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                req.body.salonName = result[i].Company_Name;
                                req.body.address = result[i].Company_Address;
                                req.body.logo = result[i].Logo;
                                req.body.salonID = result[i].salonid;
                                req.body.branchID = result[i].Company_ID;
                                data = new Salon(req.body);
                                await data.save();
                            }
                        }

                        else {
                            req.body.salonName = result[i].Company_Name;
                            req.body.address = result[i].Company_Address;
                            req.body.logo = result[i].Logo;
                            req.body.salonID = result[i].salonid;
                            req.body.branchID = result[i].Company_ID;
                            data = new Salon(req.body);
                            await data.save();
                        }
                    }
                    if (salon != [] && salon != "" && salon != null) {
                        for (k = 0; k < salon.length; k++) {
                            var ID = salon[k].branchID;
                            flag_1 = false;
                            for (l = 0; l < result.length; l++) {
                                if (result[l].Company_ID == ID) {
                                    flag_1 = true;
                                    break;
                                }
                            }
                            if (!flag_1) {
                                var data_ = await Salon.findByIdAndDelete(salon[k]._id)
                            }

                        }
                    }
                    res.send({ 'message': 'Branches Synced' })
                }
                else {
                    res.send({ 'message': 'No branches found' })
                }

                connection.release();


            });
        });
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon sync', err)
    }
});

/*router.get('/:id', async (req, res) => {
    try {
        let queryString = req.query
        let salon = await Salon.findOne({_id: req.params.id}).populate('serviceCategory');
        res.send(salon).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});*/


router.get('/services', async (req, res) => {
    try {
        if (req.query.ServicesTypeID) {
            let con = createNewConnection();
            id = parseInt(req.query.company_ID);
            id_1 = parseInt(req.query.ServicesTypeID);
            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('serfvices', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("Connected!");
                var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=? and ServicesTypeID=?";
                connection.query(sql, [id, id_1], function (err, result, fields) {
                    if (err) {
                        console.log('serfvices', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };
                    console.log("fetch successful");
                    res.send(result);
                    connection.release();
                });


            });
        }
        else {
            let con = createNewConnection();
            id = parseInt(req.query.company_ID);
            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('serfvices', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("Connected!");
                var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=?";
                connection.query(sql, [id], function (err, result, fields) {
                    if (err) {
                        console.log('serfvices', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };
                    console.log("fetch successful");
                    res.send(result);
                    connection.release();
                });


            });
        }


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('services', err.message)
    }

});


router.get('/otherBranches', async (req, res) => {
    try {
        let con = createNewConnection();
        id = parseInt(req.query.salonid);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('other branches', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT  Company_ID as Branch_ID,Company_Name as Branch_Name,Company_Address as Branch_Address,Company_Phone as Branch_Phone, cl.Latitude as Latitude, cl.Longitude as Longitude FROM Company_Profile cp, CompanyLocation cl , Salon sl Where cp.salonid=sl.salonid and cl.CompanyID=cp.Company_ID and sl.salonid= ?";
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('other branches', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                res.send(result);
                connection.release();
            });


        });


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('other branches', err.message)
    }

});


router.get('/:Company_ID', async (req, res) => {
    try {
        let con = createNewConnection();
        response = {};
        id = parseInt(req.params.Company_ID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('saloon details', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT Company_Name as branch_name, Company_Address as branch_address,salonid, cl.Latitude as Lat, cl.Longitude as Lon, Company_Phone as branch_phone, if(open_mon=1,concat(hour_start_mon,'-',hour_end_mon),'closed') as monday_time, if(open_tue=1,concat(hour_start_tue,'-',hour_end_tue),'closed') as tuesday_time, if(open_wed=1,concat(hour_start_wed,'-',hour_end_wed),'closed') as wednesday_time, if(open_thu=1,concat(hour_start_thu,'-',hour_end_thu),'closed') as thursday_time, if(open_fri=1,concat(hour_start_fri,'-',hour_end_fri),'closed') as friday_time, if(open_sat=1,concat(hour_start_sat,'-',hour_end_sat),'closed') as saturday_time, if(open_sun=1,concat(hour_start_sun,'-',hour_end_sun),'closed') as sunday_time FROM Company_Profile cp, CompanyLocation cl Where cp.Company_ID= cl.CompanyID and Company_ID= ? ";
            var sql_1 = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('saloon details', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                //response.salonDetails = result;
                if (result != null && result != [] && result != '') {
                    connection.query(sql_1, [id], async function (err, result_1, fields) {
                        if (err) {
                            console.log('saloon details', err.message)
                            return res.status(400).send({ 'message': err.message });
                        };
                        console.log("fetch successful");
                        const salon = await Salon.findOne({ salonID: id }).select({ reviews: 1, avgRating: 1 });
                        if (!salon) {
                            if (result_1 != null && result_1 != [] && result_1 != '') {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[0].image = result_1;
                                result[0].avgRatings = 0;
                                result[0].NoOfReview = 0;
                                {
                                    const customer = await Customer.findOne().or({ _id: req.query.customer }).select({ likedSalon: 1 });
                                    if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
                                    result[0].isLiked = 'false';
                                    for (i = 0; i < customer.likedSalon.length; i++) {
                                        if (req.params.Company_ID === customer.likedSalon[i]) {
                                            result[0].isLiked = 'true';
                                        }
                                    }
                                }

                                res.send(result[0]);
                            }
                            else {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[0].avgRatings = 0;
                                result[0].NoOfReview = 0;
                                return res.send(result[0]);
                            }
                        }
                        if (salon) {
                            if (result_1 != null && result_1 != [] && result_1 != '') {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[0].image = result_1;
                                result[0].avgRatings = salon.avgRating;
                                result[0].NoOfReview = salon.reviews.length;
                                {
                                    const customer = await Customer.findOne().or({ _id: req.query.customer }).select({ likedSalon: 1 });
                                    if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
                                    result[0].isLiked = 'false';
                                    for (i = 0; i < customer.likedSalon.length; i++) {
                                        if (req.params.Company_ID === customer.likedSalon[i]) {
                                            result[0].isLiked = 'true';
                                        }
                                    }
                                }

                                res.send(result[0]);
                            }
                            else {
                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[0].avgRatings = salon.avgRating;
                                result[0].NoOfReview = salon.reviews.length;
                                return res.send(result[0]);
                            }
                        }
                        connection.release();
                    });
                }
                else {
                    res.send({ 'message': 'Saloon Details Not Found' })
                }
            });


        });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('saloon  details', err.message)
    }

});






router.post('/', async (req, res) => {
    try {
        console.log('in');
        //let salon = await Salon.find()
        //req.body.salonID = 'S' + (100 + salon.length)
        //console.log(req.body.salonID);
        data = new Salon(req.body);
        await data.save();
        res.status(201).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.post('/review/:Company_ID', async (req, res) => {
    try {
        let name = await Customer.findOne({ _id: req.query.customer }).select({ fullName: 1 });
        if (!name) return res.send({ 'message': 'customer not found: check customer _id passed' })
        let image = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1 });
        if (!image) {
            image = { profile: '' }
        }

        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            let data = await Salon.findOneAndUpdate({ salonID: req.params.Company_ID }, {

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
            let salonRating = await Salon.findOneAndUpdate({ salonID: req.params.Company_ID }, {
                avgRating: temp.avgRating
            }
                , { new: true },
                function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });

            res.status(201).send(data)

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('saloon review', err.message)
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

router.patch('/likes/:Company_ID', async (req, res) => {


    try {
        let flag = false;
        let check = await Salon.findOne({ salonID: req.params.Company_ID }).select({ likes: 1 });
        if (!check) return res.status(404).send({ 'message': 'Salon not found' })

        if (check.likes.length != 0) {
            for (i = 0; i < check.likes.length; i++) {
                if ((check.likes[i].customer == req.query.customer)) {
                    let salonData = await Salon.findOneAndUpdate({ salonID: req.params.Company_ID },
                        {
                            $pull: { likes: { customer: req.query.customer } },

                            $inc: { likeCounter: -1 }
                        },
                    );
                    if (!salonData) return res.status(404).send({ 'message': 'Salon not found' });


                    let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                        { $pull: { likedSalon: req.params.Company_ID } }
                    );
                    if (!data) return res.status(404).send({ 'message': 'Customer not found' });
                    result = "False";
                    res.send({ 'message': 'Salon unliked', result });

                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            let name = await Customer.findOne({ _id: req.query.customer }).select({ fullName: 1 });
            if (!name) return res.status(404).send({ 'message': 'Customer not found' });
            let image = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1 });
            let salonData = await Salon.findOneAndUpdate({ salonID: req.params.Company_ID },
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
            if (!salonData) return res.status(404).send({ 'message': 'Salon not found' });


            let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                { $addToSet: { likedSalon: req.params.Company_ID } },
                { new: true });
            if (!data) return res.status(404).send({ 'message': 'Customer not found' });
            result = "True";
            res.send({ 'message': 'Salon liked', result });


        };
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});

router.get('/review/:Company_ID', async (req, res) => {
    try {
        const salon = await Salon.findOne({ salonID: req.params.Company_ID }).select('reviews');
        if (salon != [] && salon != "" && salon != {} && salon != null) {
            let ratings = avgRating(salon);
            if (ratings != [] && ratings != "" && ratings != {} && ratings != null) {
                res.send(ratings.reviews).status(200);
            }
            else {
                res.send({ 'message': 'can not get avg rating' });
            }
        }
        else {
            res.send({ 'message': 'salon not found' });
        }

    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Review Get', err)
    }
});

router.get('/rating/:Company_ID', async (req, res) => {
    try {
        const salon = await Salon.findOne({ salonID: req.params.Company_ID }).select('reviews');
        if (salon != [] && salon != "" && salon != {} && salon != null) {
            let ratings = avgRating(salon);
            res.send(ratings).status(200);
        }
        else {
            res.send({ 'message': 'salon not found' });
        }


    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Rating Get', err)
    }
});

module.exports = router;


