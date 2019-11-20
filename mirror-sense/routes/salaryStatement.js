const { Salary } = require('../models/salary');
const mongoose = require('mongoose');
const express = require('express');
//const isodate = require('isodate');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
        
        const salary = await Salary.find()
        .and([{ mobileNumber:req.query.mobileNumber },{created:{$gte:(req.query.createdFrom),$lte:(req.query.createdTo)}}])
        
        .select({ employeeSalary: 1 })
        res.send(salary);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salary statement', err.message)
    }

});

router.post('/', async (req, res) => {
     try {
         let salary = new Salary(req.body);
         salary = await salary.save();
 
         res.send(salary);
     }
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Salary Post', err.message)
     }
 
    }
);

module.exports = router; 