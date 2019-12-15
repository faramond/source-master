const { Leave } = require('../models/leave');
const { LeaveType } = require('../models/leaveType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    try {console.log(req,"a");
        let data = [];
         const leave = await Leave.find().or([{ mobileNumber:req.query.mobileNumber }])
        .select({ leaveDetails: 1 });
        console.log(leave,"b");
        for(i=(leave[0].leaveDetails.length-1);i>=0;i--)
        data.push(leave[0].leaveDetails[i]);console.log("c");
        res.send(data);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

  router.post('/', async (req, res) => {
    try {
       
        let listdata = await LeaveType.find().select({ leaveTypeList: 1 });

            temp = listdata[0].leaveTypeList;
            for(i=0;i<temp.length;i++)
            {
               if(temp[i]._id == req.query._id) 
               req.body.leaveDetails[0].leaveType = temp[i].list;
            }  


        let leave = await Leave.findOne({ mobileNumber: req.body.mobileNumber });
        if (!leave) {
            leave = new Leave(req.body);
            leave = await leave.save();
        }

        else {
                let data = await Leave.findOne({ mobileNumber: req.body.mobileNumber }).select({ leaveDetails: 1 });
                temp = data.leaveDetails;
                var flag = true;
                for(i=0;i<temp.length;i++){
                  var d1 = new Date(temp[i].dateFrom);
                  var d2 = new Date(temp[i].dateTo);
                  var d3 = new Date(req.body.leaveDetails[0].dateFrom +"T00:00:00.000Z");
                  var d4 = new Date(req.body.leaveDetails[0].dateTo +"T00:00:00.000Z");
                if(((d3.getTime() >= d1.getTime()) && (d3.getTime() <= d2.getTime())) || ((d4.getTime() >= d1.getTime()) && (d4.getTime() <= d2.getTime())))
               { 
                res.send({ 'message': 'leave is already applied for the given dates' });
                flag = false;
                break;
                }
            }
            if(flag)
             {
                     leave = await Leave.findByIdAndUpdate(leave._id, {
                
                    $addToSet: { leaveDetails: req.body.leaveDetails }
                       },
                      { new: true },
                      function (err, doc) {
                      if (err) {
                      console.log(err);
                      }
                  });
    
    
                 res.send(leave);
            }
                 
    }
}
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave Post', err.message)
    }

}
);

router.post('/leaveTypeList', async (req, res) => {
    try {
        let leaveType = await LeaveType.find();
    if (!leaveType) {
        
       
            leaveType = new LeaveType(req.body);console.log(leaveType,"b");
            leaveType = await leaveType.save();
   }
    else {
      
              
        leaveType = await LeaveType.findByIdAndUpdate(leaveType[0]._id, {
            
            $addToSet: { leaveTypeList: req.body.leaveTypeList }
        },
            { new: true },
            function (err, doc) {
                if (err) {
                    console.log(err);
                }
            });
    }
          

        res.send(leaveType);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});

    router.get('/leaveTypeList', async (req, res) => {
        try {
              const leave = await LeaveType.find()
            .select({ leaveTypeList: 1 })
            res.send(leave[0].leaveTypeList);
        }
        
        catch (err) {
            res.send({ 'message': err.message });
            console.log('Leave type', err.message)
        }
    
    });




module.exports = router; 