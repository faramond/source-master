const express = require('express');
const router = express.Router();
const { createNewConnectionMerchant } = require('../lib/connection');
var request = require('request');





router.post('/login', async (req, res) => {
    try {
        let con = createNewConnectionMerchant();

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('login merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "select Branch_ID, FullName, Email, StylistID, DeviceId from Employee where Usernm=? and Password=?";
            var sql_1 = "Update Employee SET DeviceId=?  where StylistID =?"
            connection.query(sql, [req.query.username, req.query.password], function (err, result, fields) {
                if (err) {
                    console.log('login merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");

                if (result != null && result != [] && result != '') {
                    if (req.query.DeviceId != null && req.query.DeviceId != "undefined" && req.query.DeviceId != "") {
                        connection.query(sql_1, [req.query.DeviceId, result[0].StylistID], function (err, result, fields) {
                            if (err) {
                                console.log('login merchant update deviceid', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };
                        });
                        connection.query(sql, [req.query.username, req.query.password], function (err, result, fields) {
                            if (err) {
                                console.log('login merchant', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };
                            res.send(result[0])
                        });
                    }
                    else {
                        res.send(result[0])
                    }
                }

                else {
                    res.send({ "message": "Incorrect Username or Password" })
                }
                connection.release();
            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('login merchant', err.message)
    }

});


router.get('/ongoing', async (req, res) => {
    try {
        let response = [];
        let con = createNewConnectionMerchant();
        id = parseInt(req.query.restaurantBranchID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('ongoing merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT hdr.TransactionNo as transaction_no,hdr.Salon_ID as salon_id,hdr.RestaurantBranch_ID as restaurant_branch_id , hdr.TransDate as order_date ,pay.Amount as paid_amount, pay.PaidStatus as payment_status,pay.PaymentMethod as payment_method ,sts.RecipientName as ordered_by,sts.RecipientContact as recipient_contact, sts.SelfCollectAddress as address_if_self_collected , sts.Address as delivery_address , sts.Remarks as receipent_remarks , sts.IsSelfCollect as is_self_collected FROM SO_Header hdr , SO_Payment pay , DeliveryStatus sts WHERE hdr.RestaurantBranch_ID=? and sts.ShippingStatus=1 AND hdr.TransactionNo=pay.TransactionNo and hdr.Salon_ID=pay.Salon_ID AND sts.Salon_ID=hdr.Salon_ID and sts.TransactionNo=hdr.TransactionNo order by hdr.TransactionNo";
            var sql_1 = "SELECT DISTINCT serv.ServicesName FROM SO_Details det, Services serv  where det.TransactionNo=? and det.Salon_ID=? and serv.ServicesID=det.ProductID";
            var sql_2 = "SELECT servD.AsstServicesName FROM SO_Details det ,ServicesDetails servD where det.ProductID=servD.ServicesID and det.OptionID=servD.ServicesDetailsID and det.TransactionNo=? and det.Salon_ID=?";
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('ongoing merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                if (result != [] && result != "" && result != null) {
                    let length = result.length;
                    for (let i = 0; i < result.length; i++) {
                        txnID = result[i].transaction_no;
                        salonID = result[i].salon_id;

                        connection.query(sql_1, [txnID, salonID], function (err, result_1, fields_1) {
                            if (err) {
                                console.log('ongoing merchant', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };

                            connection.query(sql_2, [txnID, salonID], function (err, result_2, fields_2) {
                                if (err) {
                                    console.log('ongoing merchant', err.message)
                                    return res.status(400).send({ 'message': err.message });
                                };



                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].mainDishes = result_1;
                                result[i].sideDishes = result_2;
                                if (result[i].payment_status = 1) {
                                    result[i].payment_status = "Paid";
                                }
                                else {
                                    result[i].payment_status = "Unpaid";
                                }
                                response.push(result[i])
                                if (response.length == length) res.send(response);
                            });
                        })
                    }

                }
                else {
                    res.send(result)
                }
                connection.release();
            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('ongoing merchant', err.message)
    }

});


router.get('/served', async (req, res) => {
    try {
        let response = [];
        let con = createNewConnectionMerchant();
        id = parseInt(req.query.restaurantBranchID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('ongoing merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT hdr.TransactionNo as transaction_no,hdr.Salon_ID as salon_id,hdr.RestaurantBranch_ID as restaurant_branch_id , hdr.TransDate as order_date ,pay.Amount as paid_amount, pay.PaidStatus as payment_status,pay.PaymentMethod as payment_method ,sts.RecipientName as ordered_by,sts.RecipientContact as recipient_contact, sts.SelfCollectAddress as address_if_self_collected , sts.Address as delivery_address , sts.Remarks as receipent_remarks , sts.IsSelfCollect as is_self_collected FROM SO_Header hdr , SO_Payment pay , DeliveryStatus sts WHERE hdr.RestaurantBranch_ID=? and sts.ShippingStatus=3 AND hdr.TransactionNo=pay.TransactionNo and hdr.Salon_ID=pay.Salon_ID AND sts.Salon_ID=hdr.Salon_ID and sts.TransactionNo=hdr.TransactionNo order by hdr.TransactionNo";
            var sql_1 = "SELECT DISTINCT serv.ServicesName FROM SO_Details det, Services serv  where det.TransactionNo=? and det.Salon_ID=? and serv.ServicesID=det.ProductID";
            var sql_2 = "SELECT servD.AsstServicesName FROM SO_Details det ,ServicesDetails servD where det.ProductID=servD.ServicesID and det.OptionID=servD.ServicesDetailsID and det.TransactionNo=? and det.Salon_ID=?";
            connection.query(sql, [id], function (err, result, fields) {
                if (err) {
                    console.log('ongoing merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");

                if (result != [] && result != "" && result != null) {
                    let length = result.length;
                    for (let i = 0; i < result.length; i++) {
                        txnID = result[i].transaction_no;
                        salonID = result[i].salon_id;

                        connection.query(sql_1, [txnID, salonID], function (err, result_1, fields_1) {
                            if (err) {
                                console.log('ongoing merchant', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };

                            connection.query(sql_2, [txnID, salonID], function (err, result_2, fields_2) {
                                if (err) {
                                    console.log('ongoing merchant', err.message)
                                    return res.status(400).send({ 'message': err.message });
                                };



                                result = JSON.stringify(result);
                                result = JSON.parse(result);
                                result[i].mainDishes = result_1;
                                result[i].sideDishes = result_2;
                                if (result[i].payment_status = 1) {
                                    result[i].payment_status = "Paid";
                                }
                                else {
                                    result[i].payment_status = "Unpaid";
                                }
                                response.push(result[i])
                                if (response.length == length) res.send(response);
                            });
                        })
                    }

                }
                else {
                    res.send(result)
                }
                connection.release();
            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('ongoing merchant', err.message)
    }

});


router.get('/mainServices', async (req, res) => {
    try {
        let con = createNewConnectionMerchant();
        id = req.query.transactionNO;
        id2 = parseInt(req.query.salonID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('mainServices merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT DISTINCT serv.ServicesName FROM SO_Details det, Services serv  where det.TransactionNo=? and det.Salon_ID=? and serv.ServicesID=det.ProductID";
            connection.query(sql, [id, id2], function (err, result, fields) {
                if (err) {
                    console.log('mainServices merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                connection.release();

                res.send(result)
            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('mainServices merchant', err.message)
    }

});


router.get('/sideDishes', async (req, res) => {
    try {
        let con = createNewConnectionMerchant();
        id = req.query.transactionNO;
        id2 = parseInt(req.query.salonID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('sideDishes merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT servD.AsstServicesName FROM SO_Details det ,ServicesDetails servD where det.ProductID=servD.ServicesID and det.OptionID=servD.ServicesDetailsID and det.TransactionNo=? and det.Salon_ID=?";
            connection.query(sql, [id, id2], function (err, result, fields) {
                if (err) {
                    console.log('sideDishes merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                connection.release();

                res.send(result)
            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('sideDishes merchant', err.message)
    }

});


router.post('/updateStatus', async (req, res) => {
    try {
        let response;
        let con = createNewConnectionMerchant();
        id = req.query.transactionNO;
        id2 = parseInt(req.query.salonID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('updateStatus merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "Select DeliveryStatusID,ShippingStatus FROM DeliveryStatus where TransactionNo=? AND Salon_ID=?";
            var sql2 = "UPDATE DeliveryStatus SET ShippingStatus=3 WHERE DeliveryStatusID=?";
            connection.query(sql, [id, id2], function (err, result, fields) {
                if (err) {
                    console.log('updateStatus merchant', err.message)
                    return res.status(400).send({ 'message': err.message });

                };

                console.log("fetch successful");
                if (result != [] && result != "" && result != null) {
                    if (result[0].ShippingStatus == 3) {
                        res.send({
                            "status": false,
                            "message": "Order Already Served"
                        })
                    }
                    else {
                        connection.query(sql2, [result[0].DeliveryStatusID], function (err, result_1, fields_1) {
                            if (err) {
                                console.log('updateStatus merchant', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };
                            console.log("fetch successful");

                            result_1 = JSON.stringify(result_1);
                            result_1 = JSON.parse(result_1);
                            if (result_1.changedRows == 1) {
                                response = {
                                    status: true
                                }
                            }
                            else {
                                response = {
                                    status: false
                                }
                            }
                            res.send(response);
                        })
                    }
                }
                else {
                    res.send({ "status": false, "message": "Not yet Delivered" })
                }
                connection.release();
            });



        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('updateStatus merchant', err.message)
    }

});

router.get('/ongoingDetails', async (req, res) => {
    try {
        let response;
        let con = createNewConnectionMerchant();
        id2 = req.query.transactionNO;
        id = parseInt(req.query.restaurantBranchID);

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('ongoing details merchant', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "SELECT hdr.TransactionNo as transaction_no,hdr.Salon_ID as salon_id,hdr.RestaurantBranch_ID as restaurant_branch_id , hdr.TransDate as order_date ,pay.Amount as paid_amount, pay.PaidStatus as payment_status,pay.PaymentMethod as payment_method ,sts.RecipientName as ordered_by,sts.RecipientContact as recipient_contact, sts.SelfCollectAddress as address_if_self_collected , sts.Address as delivery_address , sts.Remarks as receipent_remarks , sts.IsSelfCollect as is_self_collected FROM SO_Header hdr , SO_Payment pay , DeliveryStatus sts WHERE hdr.RestaurantBranch_ID=? and sts.ShippingStatus=1 AND hdr.TransactionNo=pay.TransactionNo and hdr.Salon_ID=pay.Salon_ID AND sts.Salon_ID=hdr.Salon_ID and sts.TransactionNo=hdr.TransactionNo and hdr.TransactionNo=? order by hdr.TransactionNo";
            var sql_1 = "SELECT DISTINCT serv.ServicesName FROM SO_Details det, Services serv  where det.TransactionNo=? and det.Salon_ID=? and serv.ServicesID=det.ProductID";
            var sql_2 = "SELECT servD.AsstServicesName FROM SO_Details det ,ServicesDetails servD where det.ProductID=servD.ServicesID and det.OptionID=servD.ServicesDetailsID and det.TransactionNo=? and det.Salon_ID=?";
            var sql_3 = "SELECT hdr.TransactionNo as transaction_no,hdr.Salon_ID as salon_id,hdr.RestaurantBranch_ID as restaurant_branch_id , hdr.TransDate as order_date ,pay.Amount as paid_amount, pay.PaidStatus as payment_status,pay.PaymentMethod as payment_method ,sts.RecipientName as ordered_by,sts.RecipientContact as recipient_contact, sts.SelfCollectAddress as address_if_self_collected , sts.Address as delivery_address , sts.Remarks as receipent_remarks , sts.IsSelfCollect as is_self_collected FROM SO_Header hdr , SO_Payment pay , DeliveryStatus sts WHERE hdr.RestaurantBranch_ID=? and sts.ShippingStatus=3 AND hdr.TransactionNo=pay.TransactionNo and hdr.Salon_ID=pay.Salon_ID AND sts.Salon_ID=hdr.Salon_ID and sts.TransactionNo=hdr.TransactionNo and hdr.TransactionNo=? order by hdr.TransactionNo";
            connection.query(sql, [id, id2], function (err, result, fields) {
                if (err) {
                    console.log('ongoing details merchant', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");

                if (result != [] && result != "" && result != null) {
                    response = result[0]
                    connection.query(sql_1, [response.transaction_no, response.salon_id], function (err, result_1, fields) {
                        if (err) {
                            console.log('ongoing details merchant', err.message)
                            return res.status(400).send({ 'message': err.message });
                        };
                        console.log("fetch successful");

                        connection.query(sql_2, [response.transaction_no, response.salon_id], function (err, result_2, fields) {
                            if (err) {
                                console.log('ongoing details merchant', err.message)
                                return res.status(400).send({ 'message': err.message });
                            };
                            console.log("fetch successful");
                            response = JSON.stringify(response);
                            response = JSON.parse(response);
                            response.mainDishes = result_1;
                            response.sideDishes = result_2;
                            response.isServed = false;
                            res.send(response)
                        });
                    });
                }
                else {
                    connection.query(sql_3, [id, id2], function (err, result_3, fields) {
                        if (err) {
                            console.log('ongoing details merchant', err.message)
                            return res.status(400).send({ 'message': err.message });
                        };
                        console.log("fetch successful");
                        if (result_3 != [] && result_3 != "" && result_3 != null) {
                            response = result_3[0]
                            connection.query(sql_1, [response.transaction_no, response.salon_id], function (err, result_1, fields) {
                                if (err) {
                                    console.log('ongoing details merchant', err.message)
                                    return res.status(400).send({ 'message': err.message });
                                };
                                console.log("fetch successful");

                                connection.query(sql_2, [response.transaction_no, response.salon_id], function (err, result_2, fields) {
                                    if (err) {
                                        console.log('ongoing details merchant', err.message)
                                        return res.status(400).send({ 'message': err.message });
                                    };
                                    console.log("fetch successful");
                                    response = JSON.stringify(response);
                                    response = JSON.parse(response);
                                    response.mainDishes = result_1;
                                    response.sideDishes = result_2;
                                    response.isServed = true;
                                    res.send(response)
                                });
                            });

                        }
                        else {
                            res.send({ 'message': 'Order Corresponding to Given Transaction Number Not Found' });
                        }

                    });

                }
                connection.release();

            });



        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('mainServices merchant', err.message)
    }

});

router.post('/firebase/notification', async (req, res) => {

    let Body = JSON.stringify(req.body);

    request.post({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAnOy2_XY:APA91bGtBsB_Ckg59zcMwkxTCgmr7NMt9EBC6usvvENqTNgHSH4ZIeKNYCzFm3DUZgfqMk5wzKZpnPAsM14rz14nJZHKg0rAAM8c58kXJWXPYcUVniuSWK2yJML5H5_0Uyy43WVKg97J'
        },
        url: 'https://fcm.googleapis.com/fcm/send',
        body: Body
    }, function (error, response, body) {
        body = JSON.parse(body)
        res.send(body)
    });


});



module.exports = router;