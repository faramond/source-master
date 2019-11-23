const { MirrorStar } = require('../models/mirrorStar');
const { Events } = require('../models/events');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*router.get('/', async (req, res) => {
    try {
        //const [e];
        const  [c] = await MirrorStar.find().or([{ employee:req.query.employee }])
        .select({ events: 1, starName: 1 })
/*for(i=0;i<c.length;i++)
{
    const [d] = await Events.find().or([{ id: c[i] }])
    //e.[i]= d;
    


}
res.send([c]);

       
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('events', err.message)
    }

});*/
router.get('/', async (req, res) => {
    try {
        
       let result = [];
        
        let event = await MirrorStar.findOne().or([{ _id:req.query._id}])
        .select({ events: 1})
        for(i=0;i<event.length;i++)
   /* {
    let d = await Events.find().or([{ id: event[i].toString() }])
        result.push(d)
        
    }*/
    res.send(event);
}
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

module.exports = router; 