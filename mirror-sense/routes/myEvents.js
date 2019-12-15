const { MirrorStar } = require('../models/mirrorStar');
const { Events } = require('../models/events');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
       let result = [];
        let event = await MirrorStar.find().or([{ _id:req.query._id}])
        .select({ events: 1})
        for(let key in event[0].events)
    { 
    let data = await Events.find().or([{ _id: event[0].events[key].toString() }])
        result.push(data)
        
    }
    res.send(result);
}
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

module.exports = router; 