
const express = require('express');
const mysql = require('mysql')
var mysqlCon = require ('../startup/mysqlCon');
const router = express.Router();

router.get('/service/:id', async(req, res) => {
    console.log('in here' + req.params.id);
   
    mysqlCon.query('select * from Salon where ServicesTypeID= ? ',
        [req.params.id], (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        }
    )
   
 
});


module.exports = router; 