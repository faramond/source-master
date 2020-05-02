const { Customer } = require('../models/customer');
const { MirrorStar } = require('../models/mirrorStar');
const { Salon } = require('../models/salon');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload  = require('../storage/image')
const { customerUpdate } = require('../lib/uploadToSQL');
const { createNewConnection2 } = require('../lib/connection');

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
        if(req.file == undefined)
        {
            const customer = await Customer.findByIdAndUpdate(req.params.id,
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    updated: new Date(),
    
                }, { new: true });
    
            if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });
            
           // customerUpdate(customer);
            res.send(customer);
        
        }
        
        else{
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                fullName: req.body.fullName,
                email: req.body.email,
                dob: req.body.dob,
                gender: req.body.gender,
                profile: req.file.path,
                updated: new Date(),

            }, { new: true });

        if (!customer) return res.status(404).send({ 'message': 'The customer with the given ID was not found.' });
        
      //  customerUpdate(customer);
        res.send(customer);
        }
        
        
       
    
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

router.get('/favourite/:id', async (req, res) => {
    try {
        let response = [];

        const customer = await Customer.findOne().or({ _id:req.params.id }).select({likedMirrorStar: 1});
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for(i=0;i<customer.likedMirrorStar.length;i++){
            ID = customer.likedMirrorStar[i];
            const star = await MirrorStar.findOne().or({ _id:ID }).select({starName: 1,avgRating: 1,image:1});
           response.push(star);
        }
        
        res.send(response);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.get('/favouriteSalon/:id', async (req, res) => {
    try {
        let photo = [];
        var response = [];
        let conn = await createNewConnection2();
        var sql = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";

        const customer = await Customer.findOne().or({ _id:req.params.id }).select({likedSalon: 1});
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for(i=0;i<customer.likedSalon.length;i++){
            ID = parseInt(customer.likedSalon[i]);
            let salon = await Salon.findOne().or({ salonID:ID }).select({salonName: 1,avgRating: 1,salonID: 1});
            let [rows, fields] =  await conn.execute(sql,[ID]);
            if( rows != null && rows != [] && rows != ''){
                for(j=0;j<rows.length;j++){
                  photo.push(rows[j].image_location);}
                }
                else{
                    photo = [];
                }
            temp = {
                'Company_ID': salon.salonID,
                'Company_Name': salon.salonName,
                'avgRating': salon.avgRating,
                'image': photo
            }
            temp = JSON.stringify(temp);
            temp = JSON.parse(temp);
            response[i] = (temp);
           
        }
        res.send(response);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.get('/isLiked/:id', async (req, res) => {
    try {

        const customer = await Customer.findOne().or({ _id:req.params.id }).select({likedSalon: 1});
        if (!customer) return res.status(404).send({ 'message': 'Customer not found' });
        for(i=0;i<customer.likedSalon.length;i++){
           if(req.query.Company_ID === customer.likedSalon[i]){
            return res.send({'message': 'True'});}
        }
        res.send({'message': 'False'});
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});



module.exports = router; 