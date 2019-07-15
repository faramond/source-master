const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = require('../storage/image')
// const storage= dis
const storage = 

router.get('/', async (req, res) => {
    try {
        
        console.log(req.query.mobileNumber)
        let queryString =req.query
        console.log('query Name:',queryString);
        
        const customers = await Customer.find().or([{ mobileNumber:req.query.mobileNumber },{ email: req.query.email }])
            .sort('name');
        res.send(customers);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.post('/', async (req, res) => {
   // let emailAddress= req.body.email = null;
   req.body.email= req.body.email===undefined?req.body.mobileNumber+'@null_email':req.body.email;
    console.log(req.body.email);
    try {
        let customer = new Customer({
            challenge: 1234,
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            countryCode: req.body.countryCode,
            password: req.body.password,
            email:req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            profile: req.body.profile,
            created: new Date(),

        });
        customer = await customer.save();

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Post', err.message)
    }

});
router.patch('/:id', upload.single('profile'), async (req, res) => {
    try {
      
        console.log(req.file);
        if(req.file == undefined)
        {
            console.log("if");
            const customer = await Customer.findByIdAndUpdate(req.params.id,
                {
                    
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    updated: new Date(),
    
                }, { new: true });
    
            if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });
    
            res.send(customer);
        
        }
        
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                
                email: req.body.email,
                dob: req.body.dob,
                gender: req.body.gender,
                profile: req.file.path,
                updated: new Date(),

            }, { new: true });

        if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });
console.log('esle');
        res.send(customer);
    
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Patch', err.message)
    }


});
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });

        res.send(customer);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Delete', err.message)
    }
});



module.exports = router; 