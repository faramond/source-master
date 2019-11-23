const { Salary } = require('../models/salary');
const mongoose = require('mongoose');
const express = require('express');
//const isodate = require('isodate');
const router = express.Router();

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

router.post('/', async (req, res) => {
    try {
        let salary = await Salary.findOne({ mobileNumber: req.body.mobileNumber });
        if (!salary) {
            salary = new Salary(req.body);
            salary = await salary.save();
        }

        else {
            salary = await Salary.findByIdAndUpdate(salary._id, {

                $addToSet: { employeeSalary: req.body.employeeSalary }
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

router.get('/check/', async (req, res) => {
    try {


        const salary = await Salary.find({ mobileNumber: req.query.mobileNumber }).select({ employeeSalary: 1 })
        let salaryList=[];
        console.log(salary);

         for(let key in salary.employeeSalary)
         {
             console.log("inside for loop");
             console.log(employeeSalary[key].dateFrom,"inside 1 for loop",employeeSalary[key].dateTo);

             /*if(employeeSalary[key].dateFrom >=(req.query.createdFrom) && employeeSalary[key].dateTo <= req.query.dateTo)
         {
             console.log("inside if loop");
             salaryList.push(employeeSalary[key])
         }*/
        }

        res.send(salary);
    }

catch (err) {
    res.send({ 'message': err.message });
    console.log('Salary statement', err.message)
}

});

module.exports = router; 




