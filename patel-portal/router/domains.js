const { Domain } = require('../model/domain');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let suggestion = require('../model/suggestions')

router.get('/:domainName', async (req, res) => {
    try {
        let domainName= req.params.domainName;
        let regex = new RegExp('.*' + req.params.domainName + '.*');
        console.log(regex);
        const domains = await Domain.find({ domainName: { $regex: regex, $options: 'i' } });
        
        if (domains.length === 0) 
        {
            return res.status(200).send(suggestion.getNewSugestions(req.params.domainName));
        res.send(domains);
        };
        let existingDomain = [];
        for (let key in domains)
         {
            existingDomain.push(domains[key].domainName);
        }
      
      existingDomain.push();

        return res.send(suggestion.getexistingDomainSugestions(req.params.domainName,existingDomain,domainName))
    }
 //    ,req.params.domainName+'patel.com')
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let domain = new Domain({
            domainName: req.body.domainName,
            price: req.body.price,
            currancy: req.body.currancy,
            isActive: req.body.isActive,
            email: req.body.email,
            created: new Date(),

        });
        domain = await domain.save();

        res.send(domain);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Domain Post', err.message)
    }

});
router.patch('/:id', async (req, res) => {
    try {
        const domain = await Domain.findByIdAndUpdate(req.params.id,
            {
                isActive: req.body.isActive,
                email: req.body.email,
                updated: new Date()


            }, { new: true });

        if (!domain) return res.status(404).send({ 'message': 'The Domain with the given ID was not found.' });

        res.send(domain);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Domain Patch', err.message)
    }


});




module.exports = router; 