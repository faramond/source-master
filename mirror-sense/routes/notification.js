const { Notification } = require('../models/notification');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        const notification = await Notification.find()
        .select({ created: 1, description: 1 })
        res.send(notification);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Notification', err.message)
    }

});
router.post('/', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let notification = new Notification(req.body);
         post = await notification.save();
 
         res.send(notification);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Notification Post', err.message)
     }
 
    }
);


module.exports = router;