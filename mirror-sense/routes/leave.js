const { Leave } = require('../models/leave');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        
        console.log(req.query.mobileNumber)
        let queryString =req.query.mobileNumber
        console.log(req.query.fullName)
        let queryStrings =req.query.fullName

        console.log('query Name:',queryString);
        console.log('query Name:',queryStrings);
        
        const leave = await Leave.find().or([{ mobileNumber:req.query.mobileNumber, fullName:req.query.fullName }]).or([{ appllied: true }])
        .select({ leaveSubject: 1, dateFrom: 1, dateTo: 1, description: 1, created: 1 })
        res.send(leave);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

router.patch('/:id', async (req, res) => {
      try {
          let leave = await Leave.findByIdAndUpdate(req.params.id,
            {
              leaveSubject: req.body.leaveSubject,
              description: req.body.description,
              dateFrom: req.body.dateFrom,
              dateTo: req.body.dateTo,
              created: new Date(),
              appllied: true
  
          }, { new: true });

          if (!leave) return res.status(404).send({ 'message': 'Details not found.' });

          res.send(leave);
      }
      catch (err) {
          res.send({ 'message': err.message });
          console.log('leave', err.message)
      }
  
    }
);

  router.post('/', async (req, res) => {
    // let emailAddress= req.body.email = null;
    //req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
     //console.log(req.body.email);
     try {
         let leave = new Leave(req.body);
         leave = await leave.save();
 
         res.send(leave);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Leave Post', err.message)
     }
 
    }
);


module.exports = router; 