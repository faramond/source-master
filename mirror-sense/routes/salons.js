
const express = require('express');
const mysql2 = require('mysql2/promise');
const mysql = require('mysql');
const multer = require('multer');
const upload = require('../storage/image')
let { Salon } = require('../models/salon');
let { Customer } = require('../models/customer');
let { avgRating } = require('../lib/ratings');
let { ServiceCategory } = require('../models/serviceCategory');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');
const { createNewConnection2 } = require('../lib/connection');

/*router.get('/', async (req, res) => {

    try {
        if (req.query.company) {
            let salon = await Salon.find({ company: req.query.company }).select('salonName address.addressLine address.addressLine1 address.town address.phone geometry');
            res.status(200).send(salon);
        }
        if (!req.query.serviceType) {
            let salon = await Salon.aggregate([{ $geoNear: { near: { type: 'Point', coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)] }, spherical: true, distanceField: "dist.calculated" } }])
            res.status(200).send(salon);
        }
        else {
            let queryString = req.query
            let serviceCategory = await ServiceCategory.findOne({ serviceType: req.query.serviceType }).populate('salon');
            let salon = await Salon.aggregate([{ $geoNear: { near: { type: 'Point', coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)] }, spherical: true, distanceField: "dist.calculated" } }])
            let result = [];
            for (let i = 0; i < serviceCategory.salons.length; i++) {

                for (let i = 0; i < salon.length; i++) {
                    console.log(serviceCategory.salons[i] + '   1')

                    if (serviceCategory.salons[i].toString() === salon[i]._id.toString()) {
                        result.push(salon[i])
                        console.log(salon[i]._id + '   Final')
                        break;
                    }
                }


            }
            console.log(result);
            res.send(result).status(200);
        }


    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('Customer Get', err)
    }

});*/


router.get('/', async (req, res) => {
    try { 
        
        let con = createNewConnection();
        let conn = await createNewConnection2();
        lat= parseInt(req.query.lat);
        long=parseInt(req.query.long);
         
            con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cp.Logo, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=?) as main_company_table order by distance_in_km';
            con.query(sql,[lat,long,lat,req.query.serviceType], async function (err, result, fields) {
                if (err) throw err;
                console.log("fetch successful");
                for(i=0;i<result.length;i++){
                result[i].avgRating = '';
                result[i].NoOfReveiews = '';}
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            
            }); 
        });


          
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});


router.get('/all', async (req, res) => {
    try { 
        
        let con = createNewConnection();
        let conn = await createNewConnection2();
        lat= parseInt(req.query.lat);
        long=parseInt(req.query.long);
         
            con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = 'select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid) as main_company_table order by distance_in_km';
            var sql_1 = "Select ImageLoc as Salon_Logo from BranchImages where Branch_ID = ?";
            con.query(sql,[lat,long,lat], async function (err, result, fields) {
                if (err) throw err;
                console.log("fetch successful");

                for(i=0;i<result.length;i++){
                    var id = result[i].Company_ID;
                    const [rows, fields] =  await conn.execute(sql_1,[id])
                      result[i].logo = rows;
                      result[i].avgRating = '';
                      result[i].NoOfReveiews = '';
                }
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            
            }); 
        });


          
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});


/*router.get('/:id', async (req, res) => {
    try {
        let queryString = req.query
        let salon = await Salon.findOne({_id: req.params.id}).populate('serviceCategory');
        res.send(salon).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});*/


router.get('/services', async (req, res) => {
    try { 
        let con = createNewConnection();
        id= parseInt(req.query.company_ID);
        id_1= parseInt(req.query.ServicesTypeID); 
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=? and ServicesTypeID=?";
            con.query(sql,[id,id_1], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});

router.get('/allServices', async (req, res) => {
    try { 
        let con = createNewConnection();
        id= parseInt(req.query.company_ID);
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});

router.get('/otherBranches', async (req, res) => {
    try { 
        let con = createNewConnection();
        id= parseInt(req.query.salonid);
         
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "SELECT  Company_Name as Branch_Name,Company_Address as Branch_Address,Company_Phone as Branch_Phone, cl.Latitude as Latitude, cl.Longitude as Longitude FROM Company_Profile cp, CompanyLocation cl , Salon sl Where cp.salonid=sl.salonid and cl.CompanyID=cp.Company_ID and sl.salonid= ?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});


router.get('/:Company_ID', async (req, res) => {
    try { 
        let con = createNewConnection();
        response = {};
        id= parseInt(req.params.Company_ID);
      
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql ="SELECT Company_Name as branch_name, Company_Address as branch_address, cl.Latitude as Lat, cl.Longitude as Lon, Company_Phone as branch_phone, if(open_mon=1,concat(hour_start_mon,'-',hour_end_mon),'closed') as monday_time, if(open_tue=1,concat(hour_start_tue,'-',hour_end_tue),'closed') as tuesday_time, if(open_wed=1,concat(hour_start_wed,'-',hour_end_wed),'closed') as wednesday_time, if(open_thu=1,concat(hour_start_thu,'-',hour_end_thu),'closed') as thursday_time, if(open_fri=1,concat(hour_start_fri,'-',hour_end_fri),'closed') as friday_time, if(open_sat=1,concat(hour_start_sat,'-',hour_end_sat),'closed') as saturday_time, if(open_sun=1,concat(hour_start_sun,'-',hour_end_sun),'closed') as sunday_time FROM Company_Profile cp, CompanyLocation cl Where cp.Company_ID= cl.CompanyID and Company_ID= ? ";
            var sql_1 = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
              //response.salonDetails = result;
              con.query(sql_1,[id], function (err, result_1, fields) {
                if (err) throw err;
                console.log("fetch successful");
               result[0].image = result_1;
               result[0].ratings = [];
               result[0].review = [];
               res.send(result[0]);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            });
        });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});


router.get('/review/:Company_ID', async (req, res) => {
    try {

        const salon = await Salon.findOne({salonID: req.params.Company_ID}).select({reviews: 1});
        console.log(salon);
        let ratings = avgRating(salon);
        console.log('ratings:', ratings);
       // ratings.reviews.push(salon);
        console.log('salon:', salon.reviews);
        res.send(ratings).status(200);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Salon Get', err)
    }
});





router.post('/', async (req, res) => {
    try {
        console.log('in');
        //let salon = await Salon.find()
        //req.body.salonID = 'S' + (100 + salon.length)
        //console.log(req.body.salonID);
        data = new Salon(req.body);
        await data.save();
        res.status(201).send(data)

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.post('/review/:Company_ID', async (req, res) => {
    try {
        let name = await Customer.findOne( {_id: req.query.customer}).select({ fullName: 1});
        let image = await Customer.findOne( {_id: req.query.customer}).select({ profile: 1});

        if (!req.body.reviews[0].rating) res.status(422).send({ 'message': 'Rating is mandatory' });
        else {
            let data = await Salon.findOneAndUpdate({salonID: req.params.Company_ID}, {
                
                $addToSet: { reviews: {reviewer: name.fullName,
                    image: image.profile,
                    rating: req.body.reviews[0].rating,
                    review: req.body.reviews[0].review }} },
                { new: true },
                function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
           // console.log(data);
            // await data.save();
            res.status(201).send(data)

        }
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});

router.patch('/:id', upload.array('images', 2), async (req, res) => {
    try {
        if (!req.files) {
            let salon = await Salon.findByIdAndUpdate(req.params.id, {
                $set: req.body

            }, { new: true });

            res.status(200).send(salon)
        }
        else {
            for (let key in req.files) {
                if (req.files[key].originalname.includes('logo')) {
                    let salon = await Salon.findByIdAndUpdate(req.params.id, {
                        logo: req.files[key].path

                    }, { new: true });
                }
                else {
                    let salon = await Salon.findByIdAndUpdate(req.params.id, {
                        salonImage: req.files[key].path

                    }, { new: true });
                }
            }
            res.status(200).send({ 'message': 'files uploded' })
        }

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Company Data', err.message)
    }
});


module.exports = router;


