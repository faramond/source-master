
const { Customer } = require('../models/customer');
let { avgRating } = require('../lib/ratings');
const express = require('express');
var async = require('async');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');


router.get('/followers', async (req, res) => {
    try {
        let con = createNewConnection();
        let ID;
        if (req.query.star != null && req.query.star != undefined && req.query.star != "") {
            ID = parseInt(req.query.star)
        }
        else {
            ID = parseInt(req.query.employee)
        }
        con.getConnection(function (err, connection) {
            if (err) {
                console.log('Mirrorstar get followers', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            var sql = " Select image,name,customer from Followers where StylistID = ?"
            connection.query(sql, [ID], async function (err, result, fields) {
                if (err) {
                    console.log('Mirrorstar get followers', err.message)
                    return res.status(400).send({ 'message': err.message });

                };

                res.status(200).send(result)



            })
            connection.release();
        });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('followers Error', err.message)
    }

});




router.get('/sorted', async (req, res) => {
    try {

        let con = createNewConnection();
        lat = parseInt(req.query.lat);
        long = parseInt(req.query.long);
        serviceType = parseInt(req.query.serviceType);
        let resultRows = []

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('Mirrorstar sort error', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            var sql = "Select * from ( select FullName as starName,avgRating, StylistID,OriPhotoDir as coverImage, PhotoDir as image, CompanyLocation.Latitude as emp_latitude , CompanyLocation.Longitude as emp_longitude, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?)) * COS(RADIANS(CompanyLocation.Latitude)) * COS(RADIANS(?- CompanyLocation.Longitude)) + SIN(RADIANS(?)) * SIN(RADIANS(CompanyLocation.Latitude)), 1.i))) AS distance_in_km from Employee , CompanyLocation where Usernm!='admin' and CompanyLocation.CompanyID=Employee.Branch_ID ) tbl order by tbl.distance_in_km ";
            var sql_1 = 'select review from Reviews where StylistID = ? '
            connection.query(sql, [lat, long, lat], async function (err, result, fields) {
                if (err) {
                    console.log('Mirrorstar sort error', err.message)
                    return res.status(400).send({ 'message': err.message });

                };



                if (result != [] && result != "" && result != null) {

                    async.forEachOf(result, function (row, j, callback) {
                        connection.query(sql_1, [result[j].StylistID], function (err, innerRow) {
                            resultRows.push(innerRow);
                            callback(null);
                        });
                    }, async function () {

                        for (i = 0; i < result.length; i++) {

                            result = JSON.stringify(result);
                            result = JSON.parse(result);
                            result[i].avgRating = parseFloat(result[i].avgRating);
                            result[i].NoOfReveiews = resultRows.length;
                        }
                    })
                }
                else {
                    res.status(400).send({ 'message': 'Mirrorstar not found' })
                }
                res.status(200).send(result);
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

        let con = createNewConnection();

        let ID = parseInt(req.query.Company_ID)
        let ID_2 = parseInt(req.query.salonid)
        let response = [];
        let resultRows = [];
        let resultRows_2 = [];

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('employee login', err.message)
                return res.status(400).send({ 'message': err.message });
            }


            var sql_3 = 'SELECT avgRating,StylistID as _id, AboutMe as bio,FullName as starName, OriPhotoDir as coverImage, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhotoDir as image from Employee where Salon_ID = ? and Branch_ID = ? and ShowinApps = ?';
            var sql_1 = 'SELECT review,reviewer,rating,image from Reviews where StylistID = ? '
            connection.query(sql_3, [ID_2, ID, 1], async function (err_3, result_3, fields) {
                if (err_3) {
                    console.log('get star by salon 1', err_3.message)
                    return res.status(400).send({ 'message': err_3.message });
                };


                if (result_3 != null && result_3 != "" && result_3 != [] && result_3 != {}) {

                    async.forEachOf(result_3, function (row, j, callback) {
                        connection.query(sql_1, [result_3[j]._id], function (err, innerRow) {
                            resultRows.push(innerRow);
                            callback(null);
                        });
                    }, async function () {
                        for (i = 0; i < result_3.length; i++) {
                            result_3 = JSON.stringify(result_3);
                            result_3 = JSON.parse(result_3);
                            result_3[i].employee = JSON.stringify(result_3[i]._id);
                            result_3[i]._id = JSON.stringify(result_3[i]._id);
                            result_3[i].followers = [];
                            result_3[i].salon = null;
                            result_3[i].posts = [];
                            result_3[i].likeCounter = 0;
                            result_3[i].likes = [];
                            result_3[i].courses = [];
                            result_3[i].events = [];
                            result_3[i].StylistID = parseInt(result_3[i]._id);
                            result_3[i].reviews = resultRows[i];
                            result_3[i].avgRating = parseFloat(result_3[i].avgRating);
                        }

                    });

                }

                var sql_4 = 'SELECT avgRating,StylistID as _id, AboutMe as bio,FullName as starName, OriPhotoDir as coverImage, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhotoDir as image from Employee where Salon_ID = ? and Branch_ID != ? and ShowinApps = ? and MultiOutlet = ?';
                connection.query(sql_4, [ID_2, ID, 1, 1], async function (err_4, result_4, fields) {
                    if (err_4) {
                        console.log('get star by salon 2', err_4.message)
                        return res.status(400).send({ 'message': err_4.message });
                    };

                    if (result_4 != null && result_4 != "" && result_4 != [] && result_4 != {}) {

                        async.forEachOf(result_4, function (row, k, callback) {
                            connection.query(sql_1, [result_4[k]._id], function (err, innerRow) {
                                resultRows_2.push(innerRow);
                                callback(null);
                            });
                        }, async function () {

                            for (i = 0; i < result_4.length; i++) {

                                result_4 = JSON.stringify(result_4);
                                result_4 = JSON.parse(result_4);
                                result_4[i].employee = JSON.stringify(result_4[i]._id);
                                result_4[i]._id = JSON.stringify(result_4[i]._id);
                                result_4[i].followers = [];
                                result_4[i].salon = null;
                                result_4[i].posts = [];
                                result_4[i].likeCounter = 0;
                                result_4[i].likes = [];
                                result_4[i].courses = [];
                                result_4[i].events = [];
                                result_4[i].reviews = resultRows_2;
                                result_4[i].StylistID = parseInt(result_4[i]._id);
                                result_4[i].avgRating = parseFloat(result_4[i].avgRating);
                            }

                        })

                    }

                    response = result_3.concat(result_4)
                    res.status(200).send(response)
                })





            })

            connection.release();

        })
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('get star by company id', err.message)
    }

});
router.get('/all', async (req, res) => {
    try {

        let con = createNewConnection();
        let resultRows = [];



        con.getConnection(function (err, connection) {
            if (err) {
                console.log('get all star', err.message)
                return res.status(400).send({ 'message': err.message });
            };


            var sql_3 = 'SELECT avgRating,StylistID as _id, AboutMe as bio,FullName as starName, OriPhotoDir as coverImage, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhotoDir as image from Employee where ShowinApps = ?';
            var sql_1 = 'SELECT review,reviewer,rating,image from Reviews where StylistID = ? '
            connection.query(sql_3, [1], async function (err_3, result_3, fields) {
                if (err_3) {
                    console.log('get all star', err_3.message)
                    return res.status(400).send({ 'message': err_3.message });
                };

                if (result_3 != null && result_3 != "" && result_3 != [] && result_3 != {}) {

                    async.forEachOf(result_3, function (row, j, callback) {
                        connection.query(sql_1, [result_3[j]._id], function (err, innerRow) {
                            resultRows.push(innerRow);
                            callback(null);
                        });
                    }, async function () {

                        for (i = 0; i < result_3.length; i++) {

                            result_3 = JSON.stringify(result_3);
                            result_3 = JSON.parse(result_3);
                            result_3[i].employee = JSON.stringify(result_3[i]._id);
                            result_3[i]._id = JSON.stringify(result_3[i]._id);
                            result_3[i].followers = [];
                            result_3[i].salon = null;
                            result_3[i].posts = [];
                            result_3[i].likeCounter = 0;
                            result_3[i].likes = [];
                            result_3[i].courses = [];
                            result_3[i].events = [];
                            result_3[i].StylistID = parseInt(result_3[i]._id);
                            result_3[i].reviews = resultRows;
                            result_3[i].avgRating = parseFloat(result_3[i].avgRating);

                        }
                    })
                    res.status(200).send(result_3)

                }
                else {
                    return res.status(404).send({ 'message': 'star not found.' });
                }
            })

            connection.release();
        })
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('get all star', err.message)
    }

});

router.get('/:id', async (req, res) => {
    try {
        let con = createNewConnection();

        ID = parseInt(req.params.id);



        con.getConnection(function (err, connection) {
            if (err) {
                console.log('get star by id', err.message)
                return res.status(400).send({ 'message': err.message });
            };


            var sql_3 = 'SELECT avgRating,StylistID as _id, AboutMe as bio,FullName as starName, OriPhotoDir as coverImage, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhotoDir as image from Employee where StylistID = ?';
            var sql_1 = 'SELECT review,reviewer,rating,image from Reviews where StylistID = ? '
            connection.query(sql_3, [ID], async function (err_3, result_3, fields) {
                if (err_3) {
                    console.log('get star by id', err_3.message)
                    return res.status(400).send({ 'message': err_3.message });
                };

                if (result_3 != null && result_3 != "" && result_3 != [] && result_3 != {}) {

                    connection.query(sql_1, [result_3[0]._id], async function (err_1, result_1, fields) {
                        if (err_1) {
                            console.log('get star by id', err_1.message)
                            return res.status(400).send({ 'message': err_1.message });
                        };

                        result_3 = JSON.stringify(result_3);
                        result_3 = JSON.parse(result_3);
                        result_3[0].employee = JSON.stringify(result_3[0]._id);
                        result_3[0]._id = JSON.stringify(result_3[0]._id);
                        result_3[0].followers = [];
                        result_3[0].salon = null;
                        result_3[0].posts = [];
                        result_3[0].likeCounter = 0;
                        result_3[0].likes = [];
                        result_3[0].courses = [];
                        result_3[0].events = [];
                        result_3[0].StylistID = parseInt(result_3[0]._id);
                        result_3[0].reviews = result_1;
                        result_3[0].avgRating = parseFloat(result_3[0].avgRating);


                        res.status(200).send(result_3)

                    })

                }
                else {
                    return res.status(200).send(result_3);
                }
            })

            connection.release();
        })

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('get star by id', err.message)
    }

});


router.get('/detail/:id', async (req, res) => {
    try {
        temp = {};
        let con = createNewConnection();

        ID = parseInt(req.params.id);
        console.log(ID)



        con.getConnection(function (err, connection) {
            if (err) {
                console.log('get star by id', err.message)
                return res.status(400).send({ 'message': err.message });
            };


            var sql_3 = 'SELECT avgRating,StylistID as _id, AboutMe as bio,FullName as starName, OriPhotoDir as coverImage, Salon_ID as salonID, Branch_ID as branchID, DeviceID as deviceID,PhotoDir as image from Employee where StylistID = ?';
            var sql_1 = 'SELECT review,reviewer,rating,image from Reviews where StylistID = ? '
            connection.query(sql_3, [ID], async function (err_3, result_3, fields) {
                if (err_3) {
                    console.log('get star by id', err_3.message)
                    return res.status(400).send({ 'message': err_3.message });
                };

                if (result_3 != null && result_3 != "" && result_3 != [] && result_3 != {}) {

                    idd = result_3[0]._id
                    connection.query(sql_1, [result_3[0]._id], async function (err_1, result_1, fields) {
                        if (err_1) {
                            console.log('get star by id', err_1.message)
                            return res.status(400).send({ 'message': err_1.message });
                        };
                        if (result_1 != null && result_1 != "" && result_1 != []) {
                            for (i = 0; i < result_1.length; i++) {
                                result_1[i].rating = JSON.stringify(parseFloat(result_1[i].rating));
                            }
                        }

                        result_3 = JSON.stringify(result_3);
                        result_3 = JSON.parse(result_3);
                        result_3[0].employee = JSON.stringify(result_3[0]._id);
                        result_3[0]._id = JSON.stringify(result_3[0]._id);
                        result_3[0].followers = [];
                        result_3[0].salon = null;
                        result_3[0].posts = [];
                        result_3[0].likeCounter = 0;
                        result_3[0].likes = [];
                        result_3[0].courses = [];
                        result_3[0].events = [];
                        result_3[0].StylistID = parseInt(result_3[0]._id);
                        result_3[0].reviews = result_1;
                        result_3[0].avgRating = parseFloat(result_3[0].avgRating);

                        temp = JSON.stringify(result_3[0]);
                        temp = JSON.parse(temp);
                        const customer = await Customer.findOne().or({ _id: req.query.customer }).select({ likedMirrorStar: 1 });
                        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
                        temp.isLiked = 'false';
                        for (i = 0; i < customer.likedMirrorStar.length; i++) {
                            if (req.params.id === customer.likedMirrorStar[i]) {
                                temp.isLiked = 'true';
                            }
                        }
                        let obj = {};
                        obj.reviews = result_1;
                        let ratings = avgRating(obj);
                        if (ratings != [] && ratings != {} && ratings != "" && ratings != null) {
                            temp.ratings = ratings;
                            res.status(200).send(temp)
                        }
                        else {
                            temp.ratings = {};
                            res.status(200).send(temp)
                        }
                    })
                }
                else {
                    return res.status(200).send({});
                }
            })

            connection.release();
        })

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});




router.get('/review/:id', async (req, res) => {
    try {

        let con = createNewConnection();
        ID = parseInt(req.params.id);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('get review star', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql_2 = 'SELECT review,reviewer,rating,image from Reviews  where StylistID = ?'
            connection.query(sql_2, [ID], function (err_2, result_2, fields) {
                if (err_2) {
                    console.log('get review star', err_2.message)
                    return res.status(400).send({ 'message': err_2.message });
                };
                if (result_2 != [] && result_2 != "" && result_2 != null) {
                    let obj = {};
                    obj.reviews = result_2;
                    let ratings = avgRating(obj);
                    if (ratings != [] && ratings != "" && ratings != {} && ratings != null) {
                        res.send(ratings).status(200);
                    }
                    else {
                        res.status(400).send({ 'message': 'can not get avg rating of star' });
                    }
                }
                else {
                    res.status(200).send({});
                }
            })
            connection.release();
        })

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('get review star', err)
    }
});




router.post('/review/:id', async (req, res) => {
    try {

        let con = createNewConnection();
        let ID = parseInt(req.params.id);


        let name = await Customer.findOne({ _id: req.query.customer }).select({ fullName: 1 });
        if (!name) return res.send({ 'message': 'customer not found: check customer _id passed' })
        let image = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1 });
        if (!image) {
            image = { profile: '' }
        }

        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('star post review', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                var sql = 'Insert Into Reviews (StylistID,review,reviewer,image,rating) Values (?,?,?,?,?)'
                connection.query(sql, [ID, req.body.reviews[0].review, name.fullName, image.profile, req.body.reviews[0].rating], function (err, result, fields) {
                    if (err) {
                        console.log('star post review', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };


                    var sql_2 = 'SELECT review,reviewer,rating,image from Reviews  where StylistID = ? '
                    connection.query(sql_2, [ID], function (err_2, result_2, fields) {
                        if (err_2) {
                            console.log('star post review', err_2.message)
                            return res.status(400).send({ 'message': err_2.message });
                        };

                        let obj = {};
                        obj.reviews = result_2;
                        let temp = avgRating(obj);

                        var sql_1 = 'Update Employee set avgRating = ? where StylistID = ?';
                        connection.query(sql_1, [temp.avgRating, ID], function (err_1, result_1, fields) {
                            if (err_1) {
                                console.log('star post review', err_1.message)
                                return res.status(400).send({ 'message': err_1.message });
                            };
                        })

                        connection.release();

                        if (result != null && result != "" && result != []) {
                            res.status(201).send(result[0])
                        }
                        else {
                            res.status(400).send({ 'message': 'unable to post review star' });
                        }

                    })
                })


            })

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('star review', err.message)
    }
});

router.patch('/likes/:id', async (req, res) => {


    try {
        let con = createNewConnection();
        con.getConnection(async function (err, connection) {
            if (err) {
                console.log('star like', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            let flag = false;
            let check = await Customer.findOne({ _id: req.query.customer }).select({ likedMirrorStar: 1 });
            if (!check) return res.status(404).send({ 'message': 'Customer not found' })

            if (check.likedMirrorStar.length != 0) {
                for (i = 0; i < check.likedMirrorStar.length; i++) {
                    if (check.likedMirrorStar.includes(req.params.id)) {

                        let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                            { $pull: { likedMirrorStar: req.params.id } }
                        );
                        if (!data) return res.status(404).send({ 'message': 'Customer not found' });

                        var sql = 'Delete from  Followers where customer = ?'
                        connection.query(sql, [req.query.customer], function (err, result, fields) {
                            if (err) {
                                console.log('star post review', err.message)
                                return res.status(400).send({ 'message': err.message });
                            }
                        })


                        result = "False";
                        res.status(200).send({ 'message': 'Mirror Star unliked', result });

                        flag = true;



                        // break;

                    }
                }
            }
            if (!flag) {
                let ID = parseInt(req.params.id);
                let check = await Customer.findOne({ _id: req.query.customer }).select({ profile: 1, fullName: 1 });
                if (!check) return res.status(404).send({ 'message': 'Customer not found in star like' })
                let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                    { $addToSet: { likedMirrorStar: req.params.id } },
                    { new: true });
                if (!data) return res.status(404).send({ 'message': 'Customer not found in star like' });

                var sql = 'Insert Into Followers (StylistID,image,customer,name) Values (?,?,?,?)'
                connection.query(sql, [ID, check.profile, req.query.customer, check.fullName], function (err, result, fields) {
                    if (err) {
                        console.log('star like', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };
                })

                result = "True";
                res.status(200).send({ 'message': 'Mirror Star liked', result });


            };
            connection.release();
        })

    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});







module.exports = router;