const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
//const { con } = require('../lib/connection');









  router.get('/', async (req, res) => {
    try { var temp=null;
        lat= parseInt(req.query.lat);
        long=parseInt(req.query.long);

        var con = mysql.createConnection({
          host: "103.57.190.72",
          port: "3306",
          user: "vnsense_sa",
          password: "salonpro",
          database: "vnsense_salonpro"
        });
      
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            check=temp.toISOString();
            var sql = "select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=?) as main_company_table order by distance_in_km";
            con.query(sql,[lat,long,lat,req.query.serviceType], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Close the database connection.');
            });
            });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});




module.exports = router; 