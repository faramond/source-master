const { Payment } = require('../model/payment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let suggestion = require('../model/suggestions')

// router.get('/:domainName', async (req, res) => {
//     try {
//         const payment = await Payment.find()
//         if (payment.length == 0) return res.status(404).send(suggestion.getSugestions(req.params.domainName));
//         res.send(payment);
//     }
//     catch (err) {
//         res.send({ 'message': err.message });
//         console.log('Payment Get', err.message)
//     }

// });

router.post('/', async (req, res) => {
    try {
        let payment = new Payment({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            doaminNames: req.body.doaminNames,
            mobile: req.body.mobile,
            expire: req.body.expire,
            total: req.body.total,
            email: req.body.email,
            cardNumber: req.body.cardNumber,
            nameOnTheCard:req.body.nameOnTheCard,
            cvv: req.body.cvv,
            created: new Date(),

        });
        payment = await payment.save();

        res.send(payment);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Payment Post', err.message)
    }

});
// router.patch('/:id', async (req, res) => {
//     try {
//         const domain = await Domain.findByIdAndUpdate(req.params.id,
//             {
//                 isActive: req.body.isActive,
//                 email: req.body.email,
//                 updated: new Date()


//             }, { new: true });

//         if (!domain) return res.status(404).send({ 'message': 'The Domain with the given ID was not found.' });

//         res.send(domain);
//     }
//     catch (err) {
//         res.send({ 'message': err.message });
//         console.log('Domain Patch', err.message)
//     }


//});




module.exports = router; 