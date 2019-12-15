const { Salary } = require('../models/salary');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const salaryS  = require('../storage/salarySlip');

    router.get('/', async (req, res) => {
        try {
    
    
            const salary = await Salary.find({ mobileNumber: req.query.mobileNumber }).select({ employeeSalary: 1 })
            let salaryList=[];
            console.log(salary);

            // for(let key in salary.employeeSalary)
            // {
            //     console.log("inside for loop");
            //     console.log(employeeSalary[key].dateFrom,"inside 1 for loop",employeeSalary[key].dateTo);

            //     if(employeeSalary[key].dateFrom >=(req.query.createdFrom) && employeeSalary[key].dateTo <= req.query.dateTo)
            // {
            //     console.log("inside if loop");
            //     salaryList.push(employeeSalary[key])
            // }
            // }

            res.send(salary);
        }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salary statement', err.message)
    }

});

router.post('/',salaryS.single('salarySlip'), async (req, res) => {
console.log(req);
    try {
        let salary = await Salary.findOne({ mobileNumber: req.body.mobileNumber });
        if (!salary) {
            salary = new Salary({
             employeeName: req.body.employeeName,
             employeeSalary: [{
                 amount: req.body.amount,
                 dateFrom: req.body.dateFrom,
                 dateTo: req.body.dateTo,
                salarySlip: req.file.path
            }],
            mobileNumber: req.body.mobileNumber,
            countryCode: req.body.countryCode,
            email: req.body.email,
            profile: req.body.profile,
            updated: req.body.updated
            });
            salary = await salary.save();
        }

        else {
            salary = await Salary.findByIdAndUpdate(salary._id, {

                $addToSet: { employeeSalary: [{
                    amount: req.body.amount,
                    dateFrom: req.body.dateFrom,
                    dateTo: req.body.dateTo,
                    salarySlip: req.file.path
               }], }
            },
                { new: true },
                function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
      res.send(salary);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salary Post', err.message)
    }

}
);



router.patch('/:id', salaryS.single('salarySlip'), async (req, res) => {
    try {
        let salary = await Salary.findByIdAndUpdate(req.params.id, {

            $addToSet: { employeeSalary: [{
                amount: req.body.amount,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                salarySlip: req.file.path
           }], }

           }, { new: true});
           if (!salary) return res.status(404).send({ 'message': 'statement not found.' });

        res.send(salary);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});


router.get('/check/', async (req, res) => {
    try {

        console.log("shuru");
        const salary = await Salary.find({ mobileNumber: req.query.mobileNumber }).select({ employeeSalary: 1 })
        let salaryList=[];
        console.log(salary);

         //for(let key in salary[0].employeeSalary)
         for(i=0;i<salary.length;i++)
         {
             console.log("inside for loop");
             console.log(req.body.dateFrom+"T00:00:00.000Z","loop");
            
             let data1 = salary[0].employeeSalary[i].dateFrom;
             let data2 = req.body.dateFrom+"T00:00:00.000Z"; 
             console.log(data2,data1,"g");
             if(data1 == data2) //&& salary[0].employeeSalary[i].dateTo <= (req.query.dateTo))
         {
             console.log("inside if loop");
             salaryList.push(salary[0].employeeSalary[i])
         };
        };
        console.log(salaryList,"outside if loop");
        res.send(salaryList);
    }

catch (err) {
    res.send({ 'message': err.message });
    console.log('Salary statement', err.message)
}

});

module.exports = router; 




