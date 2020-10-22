
const express = require('express');
let { Customer } = require('../models/customer');
let { avgRating } = require('../lib/ratings');
const router = express.Router();
var async = require('async');
const { createNewConnection } = require('../lib/connection');




router.get('/servicesType', async (req, res) => {
    try {
        let con = createNewConnection();
        console.log("chala")

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('service type get error', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql = "SELECT ServicesTypeID, ServicesType, Image from ServicesType where DisplayInApp =?";
            connection.query(sql, [1], function (err, result, fields) {
                if (err) {
                    console.log('other branches', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                res.status(200).send(result);
                connection.release();
            });


        });


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('other branches', err.message)
    }

});


router.get('/serviceDisplay', async (req, res) => {
    try {
        let con = createNewConnection();
        lat = parseInt(req.query.lat);
        long = parseInt(req.query.long);
        let response = [];

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('service type get error', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql = "SELECT ServicesTypeID,ServicesType  from ServicesType where DisplayInApp =?";
            connection.query(sql, [1], function (err, result, fields) {
                if (err) {
                    console.log('other branches', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                if (result != [] && result != "" && result != null) {

                    let resultRows = []
                    let resultRows_1 = [];
                    var sql_2 = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cp.avgRating , cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=? and sl.ShowAppointment =1 and sl.status=0 and cp.blnShow=1 and cp.status=0) as main_company_table order by distance_in_km';
                    var sql_1 = 'select review from Reviews where BranchID = ? '
                    async.forEachOf(result, function (row_1, i, callback) {
                        connection.query(sql_2, [lat, long, lat, result[i].ServicesTypeID], async function (err_2, innerRow_1) {
                            if (err_2) {
                                console.log('Bookings', err_2.message)
                                return res.status(400).send({ 'message': err_2.message });

                            };
                            resultRows_1.push(innerRow_1);
                            callback(null);
                        });



                        if (resultRows_1 != [] && resultRows_1 != "" && resultRows_1 != null) {

                            async.forEachOf(resultRows_1, function (row, j, callback) {

                                async.forEachOf(resultRows_1[j], function (row, k, callback) {
                                    connection.query(sql_1, [resultRows_1[j][k].Company_ID], function (err, innerRow) {
                                        resultRows.push(innerRow);
                                        callback(null);
                                    });
                                }, async function () {
                                    for (i = 0; i < resultRows_1[j].length; i++) {

                                        resultRows_1 = JSON.stringify(resultRows_1);
                                        resultRows_1 = JSON.parse(resultRows_1);
                                        resultRows_1[j][k].avgRating = parseFloat(resultRows_1[j][k].avgRating);
                                        resultRows_1[j][k].NoOfReveiews = resultRows[i].length;

                                        response.push({
                                            ServicesTypeID: result[j].ServicesTypeID,
                                            ServicesType: result[j].ServicesType,
                                            salons: resultRows_1[j]

                                        })


                                    }


                                })
                            }, async function () {
                                // res.status(200).send(resultRows_1);
                            })
                        }
                        else {
                            // res.status(200).send(resultRows_1);
                        }
                    }, async function () {
                        for (i = 0; i < resultRows_1.length; i++) {
                            response.push({
                                ServicesTypeID: result[i].ServicesTypeID,
                                ServicesType: result[i].ServicesType,
                                salons: resultRows_1[i]

                            })
                        }

                        res.status(200).send(response);

                    });

                }


                connection.release();
            });


        });


    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('other branches', err.message)
    }

});





router.get('/', async (req, res) => {
    try {

        if (req.query.serviceType) {

            let con = createNewConnection();
            lat = parseInt(req.query.lat);
            long = parseInt(req.query.long);
            serviceType = parseInt(req.query.serviceType);

            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('Bookings', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("Connected!");
                // let flag = true;

                //  if (req.query.serviceType == 1) {
                //if (flag) {
                //  flag = false
                let resultRows = []
                var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cp.avgRating , cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=? and sl.ShowAppointment =1 and sl.status=0 and cp.blnShow=1 and cp.status=0) as main_company_table order by distance_in_km';
                var sql_1 = 'select review from Reviews where BranchID = ? '
                connection.query(sql, [lat, long, lat, serviceType], async function (err, result, fields) {
                    if (err) {
                        console.log('Bookings', err.message)
                        return res.status(400).send({ 'message': err.message });

                    };
                    console.log("fetch successful");

                    if (result != [] && result != "" && result != null) {

                        async.forEachOf(result, function (row, j, callback) {
                            connection.query(sql_1, [result[j].Company_ID], function (err, innerRow) {
                                resultRows.push(innerRow);
                                callback(null);
                            });
                        }, async function () {
                            for (i = 0; i < result.length; i++) {

                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = parseFloat(result[i].avgRating);
                                result[i].NoOfReveiews = resultRows[i].length;


                            }

                            res.status(200).send(result);
                        })
                    }
                    else {
                        res.status(200).send(result);
                    }
                    // flag = true;
                });

                //  }
                /* }
                 else if (req.query.serviceType == 2) {
                     let resultRows = []
                     var sql_2 = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cp.avgRating , cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=? and sl.ShowAppointment =1 and sl.status=0 and cp.blnShow=1 and cp.status=0) as main_company_table order by distance_in_km';
                     var sql_1 = 'select review from Reviews where BranchID = ?';
                     connection.query(sql_2, [lat, long, lat, 2], async function (err_2, result_2, fields) {
                         if (err_2) {
                             console.log('Bookings', err_2.message)
                             return res.status(400).send({ 'message': err_2.message });
 
                         };
                         console.log("fetch successful");
 
                         if (result_2 != [] && result_2 != "" && result_2 != null && result_2.length != 0) {
 
                             async.forEachOf(result_2, function (row, j, callback) {
                                 connection.query(sql_1, [result_2[j].Company_ID], function (err, innerRow) {
                                     resultRows.push(innerRow);
                                     callback(null);
                                 });
                             }, async function () {
 
                                 for (l = 0; l < result_2.length; l++) {
 
                                     result_2 = JSON.stringify(result_2);
                                     result_2 = JSON.parse(result_2);
                                     result_2[l].avgRating = parseFloat(result_2[l].avgRating);
                                     result_2[l].NoOfReveiews = resultRows[l].length;
 
                                 }
 
                                 res.send(result_2);
                             })
                         }
                         else {
                             res.send({ 'message': 'Branches not found' })
                         }
                     });
                 }
                 else if (req.query.serviceType == 3) {
                     let resultRows = []
                     var sql_3 = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cp.avgRating , cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=? and sl.ShowAppointment =1 and sl.status=0 and cp.blnShow=1 and cp.status=0) as main_company_table order by distance_in_km';
                     var sql_1 = 'select review from Reviews where BranchID = ?';
                     connection.query(sql_3, [lat, long, lat, 3], async function (err_3, result_3, fields) {
                         if (err_3) {
                             console.log('Bookings', err_3.message)
                             return res.status(400).send({ 'message': err_3.message });
 
                         };
                         console.log("fetch successful");
 
                         if (result_3 != [] && result_3 != "" && result_3 != null && result_3.length != 0) {
 
                             async.forEachOf(result_3, function (row, j, callback) {
                                 connection.query(sql_1, [result_3[j].Company_ID], function (err, innerRow) {
                                     resultRows.push(innerRow);
                                     callback(null);
                                 });
                             }, async function () {
 
                                 for (k = 0; k < result_3.length; k++) {
 
                                     result_3 = JSON.stringify(result_3);
                                     result_3 = JSON.parse(result_3);
                                     result_3[k].avgRating = parseFloat(result_3[k].avgRating);
                                     result_3[k].NoOfReveiews = resultRows[k].length;
                                 }
 
                                 res.send(result_3);
                             })
                         }
                         else {
                             res.send({ 'message': 'Branches not found' })
                         }
                     });
                }*/

                connection.release();



            });
        }

        else {
            let con = createNewConnection();
            lat = parseInt(req.query.lat);
            long = parseInt(req.query.long);
            let resultRows = [];

            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('Bookings', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("Connected!");
                var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cp.avgRating , cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ShowAppointment =1 and sl.status=0 and cp.blnShow=1 and cp.status=0 ) as main_company_table order by distance_in_km';
                var sql_1 = 'select review from Reviews where BranchID = ?';
                connection.query(sql, [lat, long, lat], async function (err, result, fields) {
                    if (err) {
                        console.log('Bookings', err.message)
                        return res.status(400).send({ 'message': err.message });

                    };
                    console.log("fetch successful");
                    if (result != [] && result != "" && result != null) {

                        async.forEachOf(result, function (row, j, callback) {
                            connection.query(sql_1, [result[j].Company_ID], function (err, innerRow) {
                                resultRows.push(innerRow);
                                callback(null);
                            });
                        }, async function () {
                            for (i = 0; i < result.length; i++) {

                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].avgRating = parseFloat(result[i].avgRating);
                                result[i].NoOfReveiews = resultRows[i].length;



                            }
                            res.status(200).send(result);
                        })

                    }
                    else {
                        res.status(200).send(result);
                    }
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


router.get('/services', async (req, res) => {
    try {

        if (req.query.ServicesTypeID) {
            let con = createNewConnection();
            id = parseInt(req.query.salonid);
            id_1 = parseInt(req.query.ServicesTypeID);
            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('serfvices', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=? and ServicesTypeID=?";
                connection.query(sql, [id, id_1], function (err, result, fields) {
                    if (err) {
                        console.log('serfvices', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };

                    res.status(200).send(result);
                    connection.release();
                });


            });
        }
        else {
            let con = createNewConnection();
            id = parseInt(req.query.salonid);
            con.getConnection(function (err, connection) {
                if (err) {
                    console.log('serfvices', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=?";
                connection.query(sql, [id], function (err, result, fields) {
                    if (err) {
                        console.log('serfvices', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };

                    res.status(200).send(result);
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

            var sql = "SELECT  Company_ID as Branch_ID,Company_Name as Branch_Name,Company_Address as Branch_Address,Company_Phone as Branch_Phone, cl.Latitude as Latitude, cl.Longitude as Longitude FROM Company_Profile cp, CompanyLocation cl , Salon sl Where cp.salonid=sl.salonid and cl.CompanyID=cp.Company_ID and sl.salonid= ?";
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('other branches', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                res.status(200).send(result);
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

            var sql = "SELECT Company_Name as branch_name, Company_Address as branch_address,salonid,avgRating as avgRate, cl.Latitude as Lat, cl.Longitude as Lon, Company_Phone as branch_phone, if(open_mon=1,concat(hour_start_mon,'-',hour_end_mon),'closed') as monday_time, if(open_tue=1,concat(hour_start_tue,'-',hour_end_tue),'closed') as tuesday_time, if(open_wed=1,concat(hour_start_wed,'-',hour_end_wed),'closed') as wednesday_time, if(open_thu=1,concat(hour_start_thu,'-',hour_end_thu),'closed') as thursday_time, if(open_fri=1,concat(hour_start_fri,'-',hour_end_fri),'closed') as friday_time, if(open_sat=1,concat(hour_start_sat,'-',hour_end_sat),'closed') as saturday_time, if(open_sun=1,concat(hour_start_sun,'-',hour_end_sun),'closed') as sunday_time FROM Company_Profile cp, CompanyLocation cl Where cp.Company_ID= cl.CompanyID and Company_ID= ? ";
            var sql_1 = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
            var sql_2 = 'select review from Reviews where BranchID = ?';
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('saloon details', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                if (result != null && result != [] && result != '') {
                    connection.query(sql_1, [id], async function (err, result_1, fields) {
                        if (err) {
                            console.log('saloon details', err.message)
                            return res.status(400).send({ 'message': err.message });
                        };

                        connection.query(sql_2, [id], async function (err_2, result_2, fields) {
                            if (err_2) {
                                console.log('Bookings', err_2.message)
                                return res.status(400).send({ 'message': err_2.message });

                            };

                            result = JSON.stringify(result);
                            result = JSON.parse(result);
                            result[0].avgRatings = parseFloat(result[0].avgRate);
                            if (result_1 != null && result_1 != [] && result_1 != '') {
                                result[0].image = result_1;
                            }
                            result[0].NoOfReview = result_2.length;

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

                            res.status(200).send(result[0]);



                        })
                        connection.release();
                    });
                }
                else {
                    res.status(200).send(result[0]);
                }
            });


        });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('saloon  details', err.message)
    }

});







router.post('/review/:Company_ID', async (req, res) => {
    try {
        let con = createNewConnection();
        let BranchID = parseInt(req.params.Company_ID);

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
                    console.log('saloon details', err.message)
                    return res.status(400).send({ 'message': err.message });
                };

                var sql = 'Insert Into Reviews (BranchID,review,reviewer,image,rating) Values (?,?,?,?,?)'
                connection.query(sql, [BranchID, req.body.reviews[0].review, name.fullName, image.profile, req.body.reviews[0].rating], function (err, result, fields) {
                    if (err) {
                        console.log('saloon details', err.message)
                        return res.status(400).send({ 'message': err.message });
                    };


                    var sql_2 = 'SELECT review,reviewer,rating,image from Reviews  where BranchID = ? '
                    connection.query(sql_2, [BranchID], function (err_2, result_2, fields) {
                        if (err_2) {
                            console.log('saloon details', err_2.message)
                            return res.status(400).send({ 'message': err_2.message });
                        };

                        let obj = {};
                        obj.reviews = result_2;
                        let temp = avgRating(obj);

                        var sql_1 = 'Update Company_Profile set avgRating = ? where Company_ID = ?';
                        connection.query(sql_1, [temp.avgRating, BranchID], function (err_1, result_1, fields) {
                            if (err_1) {
                                console.log('saloon details', err_1.message)
                                return res.status(400).send({ 'message': err_1.message });
                            };
                        })

                        connection.release();

                        if (result != null && result != "" && result != []) {
                            res.status(201).send(result[0])
                        }
                        else {
                            res.status(400).send({ 'message': 'unable to post review' });
                        }

                    })
                })


            })

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('saloon review', err.message)
    }
});

router.patch('/likes/:Company_ID', async (req, res) => {


    try {
        let flag = false;
        let check = await Customer.findOne({ _id: req.query.customer }).select({ likedSalon: 1 });
        if (!check) return res.status(404).send({ 'message': 'Customer not found' })

        if (check.likedSalon.length != 0) {
            if (check.likedSalon.includes(req.params.Company_ID)) {

                let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                    { $pull: { likedSalon: req.params.Company_ID } }
                );
                if (!data) return res.status(404).send({ 'message': 'Customer not found' });
                result = "False";
                res.status(200).send({ 'message': 'Salon unliked', result });

                flag = true;
            }

        }
        if (!flag) {
            let data = await Customer.findByIdAndUpdate({ _id: req.query.customer },
                { $addToSet: { likedSalon: req.params.Company_ID } },
                { new: true });
            if (!data) return res.status(404).send({ 'message': 'Customer not found' });
            result = "True";
            res.status(200).send({ 'message': 'Salon liked', result });


        };
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
    }

});

router.get('/review/:Company_ID', async (req, res) => {
    try {
        let con = createNewConnection();
        ID = parseInt(req.params.Company_ID)

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('saloon details', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql_2 = 'SELECT review,reviewer,rating,image from Reviews where BranchID = ? '
            connection.query(sql_2, [ID], function (err_2, result_2, fields) {
                if (err_2) {
                    console.log('saloon details', err_2.message)
                    return res.status(400).send({ 'message': err_2.message });
                };
                if (result_2 != [] && result_2 != "" && result_2 != null) {
                    let obj = {};
                    obj.reviews = result_2;
                    let ratings = avgRating(obj);
                    if (ratings != [] && ratings != "" && ratings != {} && ratings != null) {
                        res.status(200).send(ratings.reviews).status(200);
                    }
                    else {
                        res.status(400).send({ 'message': 'can not get avg rating' });
                    }
                }
                else {
                    res.status(200).send(result_2);
                }
            })
            connection.release();
        })

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Salon Review Get', err)
    }
});

router.get('/rating/:Company_ID', async (req, res) => {
    try {
        let con = createNewConnection();
        ID = parseInt(req.params.Company_ID)

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('saloon details', err.message)
                return res.status(400).send({ 'message': err.message });
            };

            var sql_2 = 'SELECT review,reviewer,rating,image from Reviews where BranchID = ?'
            connection.query(sql_2, [ID], function (err_2, result_2, fields) {
                if (err_2) {
                    console.log('saloon details', err_2.message)
                    return res.status(400).send({ 'message': err_2.message });
                };

                if (result_2 != [] && result_2 != "" && result_2 != null) {
                    let obj = {};
                    obj.reviews = result_2;
                    let ratings = avgRating(obj);
                    res.status(200).send(ratings).status(200);
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
        console.log('Salon Rating Get', err)
    }
});

module.exports = router;


