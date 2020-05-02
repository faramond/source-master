const { Customer } = require('../models/customer');
const { MirrorStar } = require('../models/mirrorStar');
const { Salon } = require('../models/salon');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection2 } = require('../lib/connection');
var request = require('request');



router.get('/', async (req, res) => {
    try {
        response = [];
        ID = req.query.id;
        let conn = await createNewConnection2();
        var sql = "select Branch_ID, CreatedOn from Customer where AppID =?";
        let [rows, fields] =  await conn.execute(sql,[ID]);
        console.log(rows,"r");

        for(i=0;i<rows.length;i++){
            id = parseInt(rows[i].Branch_ID);
            CreatedOn = (rows[i].CreatedOn);
            var sql_1 ="SELECT Company_Name as branch_name, Company_Address as branch_address,Company_ID, logo  FROM Company_Profile  Where  Company_ID= ? ";
            let [rows_1, fields_1] =  await conn.execute(sql_1,[id]);
            rows_1[0].DateOfMembership = CreatedOn;
            response[i] = rows_1[0];


        }

        
        res.send(response);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});

router.get('/details', async (req, res) => {
    try {
        let conn = await createNewConnection2();
        var prepaidBalance = "0.00";
        var pointBalance;
        var packageName = "";
        var salonName;
        ID = req.query.id;
        id = (req.query.salon_id);
        url = 'https://vn.linearsense.com/getPointBalance.php?id=' + ID;
        url_1 = 'https://vn.linearsense.com/getPrepaidBalance.php?id=' + ID;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
    
                let  body_updated= JSON.parse(body);
                for(i=0;i<body_updated.length;i++){console.log(body_updated[i].salon_id,id,"id")
                    if(body_updated[i].salon_id === id ){
                        pointBalance = body_updated[i].POINT.point_bal;
                        salonName = body_updated[i].salon_name;
                        console.log(pointBalance,"po")
                        break;
                        
                    }

                }
                

             }
             
          request(url_1, async function (error_1, response_1, body_1) {
          if (!error_1 && response.statusCode == 200) {

            let  body_1_updated= JSON.parse(body_1);
            for(i=0;i<body_1_updated.length;i++){
                if(body_1_updated[i].salon_id === id ){
                   // prepaidBalance = body_1_updated[i].PREPAID;
                   // packageName = body_1_updated[i].PREPAID;
                    break;
                }
            }
          }
          id = parseInt(req.query.salon_id);
          var sql = "select CreatedOn from Customer where AppID =? and Salon_ID =?";
          let [rows, fields] =  await conn.execute(sql,[ID,id]);

          response = {
            'Company_Name': salonName,
            'Package Name': packageName,
            'Prepaid Balance': prepaidBalance,
            'Point Balance' : pointBalance,
            'Date' : rows[0].CreatedOn,
        }
        console.log(response);
           
        res.send(response);
           })
         })

        

        
       
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err.message)
    }

});




module.exports = router;