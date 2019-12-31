const { Salary } = require('../models/salary');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const salaryS  = require('../storage/salarySlip');




router.post('/',salaryS.single('salarySlip'), async (req, res) => {
console.log(req);
    try {
        let salary = await Salary.findOne().or([{ mobileNumber: req.body.mobileNumber },{mirrorstar: req.body.mirrorstar}]);
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


router.get('/', async (req, res) => {
    try {

        console.log("shuru");
        const salary = await Salary.find({ mobileNumber: req.query.mobileNumber }).select({ employeeSalary: 1 })
        let salaryList=[];
        console.log(salary);

         for(let key in salary[0].employeeSalary)
         
         {
             console.log("inside for loop");
             console.log(req.query.dateFrom+"T00:00:00.000Z","loop");
            
             let data1 = new Date(salary[0].employeeSalary[key].dateFrom);
             let data2 = new Date(req.query.dateFrom+"T00:00:00.000Z"); 
             let data3 = new Date(salary[0].employeeSalary[key].dateTo);
             let data4 = new Date(req.query.dateTo+"T00:00:00.000Z"); 
             console.log(data2,data1,"g");
             if((data1.getTime() >= data2.getTime()) && (data3.getTime() <= data4.getTime()))
         {
             console.log("inside if loop");
             salaryList.push(salary[0].employeeSalary[key])
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




