const { Notification } = require('../models/notification');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const moment = require("moment");


router.get('/', async (req, res) => {
    try {
        let notification = {};

        if (req.query.customer != null && req.query.customer != undefined) {
            notification = await Notification.find().or({ customer: req.query.customer });
        }
        else if (req.query.employee != null && req.query.employee != undefined) {
            notification = await Notification.find().or({ employee: req.query.employee });
        }
        else {
            return res.status(400).send({ 'message': 'pass atleast one of customer or employee' })
        }
        if (notification != [] && notification != null && notification != "") {
            notification = JSON.stringify(notification);
            notification = JSON.parse(notification);
            for (i = 0; i < notification.length; i++) {
                notification[i].timeStamp = moment(notification[i].created).fromNow();
                notification[i].data = JSON.parse(notification[i].data)
            }
            res.status(200).send(notification);
        }
        else {
            return res.send({ 'message': 'no notification found' })
        }
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Notification', err.message)
    }

});
router.post('/', async (req, res) => {
    try {
        let notification = new Notification(req.body);
        post = await notification.save();

        res.status(200).send(notification);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Notification Post', err.message)
    }

}
);


module.exports = router;