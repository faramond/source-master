
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


router.get('/:longitude/:latitude', async (req, res) => {
    try {
        console.log('in here salon by service' + req.params.id);
        let sqlString = "select * from( select cp.Company_ID, cp.Company_Name, cp.MonthlyFee, cp.Company_Address, cp.Company_Address1, cp.Company_Postcode, cp.Company_Phone, cp.Company_Email, cp.NewsletterEmail, cp.RegCode, cp.ImagePhoto, cp.Town, cp.State, cp.blnShow, cp.isHQ, cp.CurrencyID, cp.salonid, cp.createdt, cp.lastdt, cp.createby, cp.status, cp.Flag, cp.open_mon, cp.open_tue, cp.open_wed, cp.open_thu, cp.open_fri, cp.open_sat, cp.open_sun, cp.hour_start_mon, cp.hour_start_tue, cp.hour_start_wed, cp.hour_start_thu, cp.hour_start_fri, cp.hour_start_sat, cp.hour_start_sun, cp.hour_end_mon, cp.hour_end_tue, cp.hour_end_wed, cp.hour_end_thu,cp.hour_end_fri, cp.hour_end_sat, cp.hour_end_sun, cp.CalendarID,cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?)) * COS(RADIANS(cl.Latitude)) * COS(RADIANS(? - cl.Longitude)) + SIN(RADIANS(10.7607663)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, CompanyLocation cl where cl.CompanyID=cp.Company_ID ) as main_company_table order by distance_in_km;";
        mysqlCon.query(sqlString,
            [req.params.longitude,req.params.latitude], (err, rows, fields) => {
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