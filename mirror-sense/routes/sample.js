const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
//const { createNewConnection } = require('../lib/connection');


async function createNewConnection2(){
  try{console.log("connection called");
  const conn = await mysql2.createConnection({
    host: "103.57.190.72",
    port: "3306",
    user: "vnsense_sa",
    password: "salonpro",
    database: "vnsense_salonpro"
  });
  return conn;
}
catch (err) {
  console.log('Sql2 Connection', err.message)
}
}



  router.get('/', async (req, res) => {
    try {
      lat= parseInt(req.query.lat);
      long=parseInt(req.query.long);

       const conn = await createNewConnection2();
      /* const conn = await mysql2.createConnection({
        host: "103.57.190.72",
        port: "3306",
        user: "vnsense_sa",
        password: "salonpro",
        database: "vnsense_salonpro"
      });*/
      
         
            var sql = "select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=?) as main_company_table order by distance_in_km";
            const [rows, fields] = await conn.execute('select ?+? as sum', [2, 2]);
    
             res.send(rows);
           
          

         
          
        
    }
    catch (err) {
      process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    //process.exit(1);
  });
        res.status(400).send({ 'message': err.message });
        console.log('Whats Hot Error', err.message)
    }

});




module.exports = router; 