
const express = require('express');
const mysql = require('mysql')
var mysqlCon = require('../startup/mysqlCon');
const router = express.Router();

router.get('/service/:id', async (req, res) => {
    try {
        console.log('in here' + req.params.id);

        mysqlCon.query('select * from Salon where ServicesTypeID= ? ',
            [req.params.id], (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);
            }

        )

    }
    catch (err) {
        res.send(err.message)
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log('in here salon by service' + req.params.id);
        let sqlString = "select sa.salonnm,cp.Company_Address,cp.Company_Address1,cp.ImagePhoto,cp.Company_Phone,cp.hour_end_fri,cp.hour_end_mon,cp.hour_end_sat,cp.hour_end_sun,cp.hour_end_thu,cp.hour_end_tue,cp.hour_end_wed,cp.hour_start_fri,cp.hour_start_mon,cp.hour_start_sat,cp.hour_start_sun,cp.hour_start_thu,cp.hour_start_tue,cp.hour_start_wed,cp.open_fri,cp.open_mon,cp.open_sat,cp.open_sun,cp.open_thu,cp.open_tue,cp.open_wed from Salon sa, Company_Profile cp where sa.salonid = cp.salonid and sa.salonid=?";
        mysqlCon.query(sqlString,
            [req.params.id], (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);
            }
        )
    }

    catch (err) {
        res.send(err.message)
    }

});



module.exports = router; 