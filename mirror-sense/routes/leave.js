const { Leave } = require('../models/leave');
const { LeaveType } = require('../models/leaveType');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');



/*router.get('/', async (req, res) => {
    try {
        let data = [];
         const leave = await Leave.find().or([{ mobileNumber:req.query.mobileNumber }])
        .select({ leaveDetails: 1 });
        if(leave != [] && leave != null && leave != ""){
        for(i=(leave[0].leaveDetails.length-1);i>=0;i--)
        data.push(leave[0].leaveDetails[i]);console.log("c");
        res.send(data);}
        else{
            res.send('not yet applioed');
        }
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});*/

router.get('/', async (req, res) => {
    try {
        let con = createNewConnection();
        let ID = parseInt(req.query.StylistID);
        con.getConnection(function (err, connection) {
            if (err) {
                console.log('leave get', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "Select LeaveSlot, LeaveReason, LeaveRemarks,SubmissionDate,LeaveTypeID, LeaveFrom, LeaveTo, ApprovalStatus, ApprovalRemarks, ApprovalBy, ApprovalDate from LeaveTransaction where StylistID = ?";
            connection.query(sql, [ID], function (err, result, fields) {
                if (err) {
                    console.log('leave get', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                connection.release();
                if (result) {
                    res.status(200).send(result);
                }
                else {
                    res.status(200).send(result);
                }
            });


        });

    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});

/* router.post('/', async (req, res) => {
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
);*/

router.post('/', async (req, res) => {
    try {
        let con = createNewConnection();
        let Reason = req.body.reason;
        let Remarks = req.body.remarks;
        let LeaveSlot = parseInt(req.body.leaveSlot);
        let date = new Date();
        let from = req.body.from;
        let to = req.body.to;
        let LeaveTypeID = parseInt(req.body.LeaveTypeID);
        let Leaveday = parseInt(req.body.LeaveDay);

        let stylist = parseInt(req.body.StylistID);
        let salon = parseInt(req.body.salonID);
        let branch = parseInt(req.body.branchID);
        var SubmissionDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
        let fromDate = new Date(from).toISOString().slice(0, 19).replace('T', ' ');
        let toDate = new Date(to).toISOString().slice(0, 19).replace('T', ' ');

        var flag = true;

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('leave post', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "INSERT INTO LeaveTransaction ( LeaveSlot, LeaveDay, LeaveReason, LeaveRemarks, SubmissionDate, StylistID, Salon_ID, Branch_ID,LeaveFrom,LeaveTo,LeaveTypeID) VALUES ( ?,?,?,?,?,?,?,?,?,?,?)";
            var sql1 = "Select LeaveFrom,LeaveTo from LeaveTransaction where StylistID = ?";
            connection.query(sql1, [stylist], function (err_1, result_1, fields_1) {
                if (err) {
                    console.log('leave post', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                if (result_1 != [] && result_1 != null && result_1 != "") {

                    for (i = 0; i < result_1.length; i++) {
                        var d1 = new Date(result_1[i].LeaveFrom);
                        var d2 = new Date(result_1[i].LeaveTo);
                        var d3 = new Date(req.body.from + "T00:00:00.000Z");
                        var d4 = new Date(req.body.to + "T00:00:00.000Z");
                        if (((d3.getTime() >= d1.getTime()) && (d3.getTime() <= d2.getTime())) || ((d4.getTime() >= d1.getTime()) && (d4.getTime() <= d2.getTime()))) {
                            res.status(201).send({ 'message': 'leave is already applied for the given dates' });
                            flag = false;
                            break;
                        }
                    }
                }
                if (flag) {

                    connection.query(sql, [LeaveSlot, Leaveday, Reason, Remarks, SubmissionDate, stylist, salon, branch, fromDate, toDate, LeaveTypeID], function (err, result, fields) {
                        if (err) {
                            console.log('leave post', err.message)
                            return res.status(400).send({ 'message': err.message });
                        };
                        console.log("fetch successful");
                        result = JSON.stringify(result);
                        result = JSON.parse(result);
                        result.message = "success";
                        res.status(201).send(result);
                    });

                }



                connection.release();
            });
        });




    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
    }

});








router.post('/leaveTypeList', async (req, res) => {
    try {
        let leaveType = await LeaveType.find();
        if (!leaveType) {


            leaveType = new LeaveType(req.body); console.log(leaveType, "b");
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


        res.status(201).send(leaveType);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});

/* router.get('/leaveTypeList', async (req, res) => {
     try {
           const leave = await LeaveType.find()
         .select({ leaveTypeList: 1 })
         res.send(leave[0].leaveTypeList);
     }
     
     catch (err) {
         res.send({ 'message': err.message });
         console.log('Leave type', err.message)
     }
 
 });*/

router.get('/leaveTypeList', async (req, res) => {
    try {
        let con = createNewConnection();
        con.getConnection(function (err, connection) {
            if (err) {
                console.log('leave type', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql = "Select LeaveTypeID,LeaveDesc from LeaveType where Status = 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('leave type', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");
                res.status(200).send(result)
                connection.release();
            });
        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave type', err.message)
    }

});




module.exports = router; 