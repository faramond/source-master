const { Events } = require('../models/events');
const { MirrorStar } = require('../models/mirrorStar');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = require('../storage/image');



router.get('/', async (req, res) => {
    try {
        
        const events = await Events.find().sort('dateFrom');
        res.send(events);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('events', err.message)
    }

});

router.post('/',upload.single('image'), async (req, res) => {
     console.log(req);

     console.log(req.file);
     try {
         let events = new Events({
            courseName : req.body.courseName,
            dateFrom : req.body.dateFrom,
            dateTo : req.body.dateTo,
            venue : req.body.venue,
            address : req.body.address,
            description: req.body.description,
            price: req.body.price,
            image: req.file.path
         });
         events = await events.save();
 
         res.send(events);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('events Post', err.message)
     }
 
    }
);


router.patch('/:id', async (req, res) => {
    try {
        let event = await Events.findByIdAndUpdate(req.params.id,
           {
              $addToSet: { registeredEmployee: req.body.registeredEmployee }

           }, { new: true});
           if (!event) return res.status(404).send({ 'message': 'event not found.' });

        res.send(event);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('event', err.message)
    } 
  });
    
    

    router.patch('/register/:id', async (req, res) => {
     try {
      let mirrorstar = await MirrorStar.findByIdAndUpdate(req.params.id,
         {
            $addToSet: { events: req.body.events }

         }, { new: true});
         if (!mirrorstar) return res.status(404).send({ 'message': 'mirrorstar not found.' });

      res.send(mirrorstar);
  }
  catch (err) {
      res.send({ 'message': err.message });
      console.log('mirrorstar', err.message)
  }


});

router.get('/s', async (req, res) => {
    try {
        

        
        const event = await MirrorStar.find({_id: request.params._id})
        
        res.send(event);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

module.exports = router;