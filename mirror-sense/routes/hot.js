const { Salon } = require('../models/salon');
const { Customer } = require('../models/customer');
const { WhatHot } = require('../models/whatHot');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection } = require('../lib/connection');
const { createNewConnection2 } = require('../lib/connection');


router.get('/', async (req, res) => {
  try {
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('hot', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "Select offer_set.promotion_heading, offer_set.original_price, offer_set.offer_price , OfferImage.ImageLoc as promotionImageLoc ,offer_set.Offer_ID, offer_set.salon_name, offer_set.Salon_Id from OfferImage , ( select  ofr.subject as promotion_heading,ofr.OriPrice as original_price,ofr.OfferPrice as offer_price,ofr.Offer_ID, sl.salonnm as salon_name ,ofr.Salon_ID as Salon_Id from  Offer ofr,Salon sl where  (sysdate() between ofr.StartDate and ofr.EndDate) and  ofr.Salon_ID=sl.salonid and ofr.Status=0 and ofr.blnApproved=1 order by ofr.Priority )  offer_set where OfferImage.Offer_ID= offer_set.Offer_ID group by offer_set.Offer_ID";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('hot', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        res.status(200).send(result);
        connection.release();
      });


    });


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('hot', err.message)
  }

});


router.get('/details', async (req, res) => {
  try {
    let con = createNewConnection();
    let conn = await createNewConnection2();
    response = {};
    var id = parseInt(req.query.Offer_ID);
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('hot', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select  ofr.subject as deal_name,ofr.OriPrice as original_price,ofr.OfferPrice as offer_price,sl.salonnm as salon_name,sl.salonid as salon_id ,ofr.Descp as description from  Offer ofr,Salon sl where   ofr.Salon_ID=sl.salonid and ofr.Offer_ID=?";
      var sql_1 = "Select ImageLoc as Slide_Show_Image from OfferImage where Offer_ID=?";
      var sql_2 = "Select Message,OfferHighlight_ID from OfferHighlight where Offer_ID=?";
      var sql_3 = "Select OfferPackage_ID,Message from OfferPackage where Offer_ID=?";
      var sql_4 = "select cp.Company_Name,cp.Company_Address,cp.Company_Postcode,cp.Town,st.statenm,cl.Latitude,cl.Longitude   from Company_Profile cp, CompanyLocation cl, State st where cp.salonid=? and cp.State=st.statecode and cl.CompanyID=cp.Company_ID";
      connection.query(sql, [id], async function (err, result, fields) {
        if (err) {
          console.log('hot', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        if (result != [] && result != {} && result != "" && result != null) {
          response.OfferDetails = result

          const [rows, fields_4] = await conn.execute(sql_1, [id])
          if (rows != [] && rows != {} && rows != "" && rows != null) {
            response.Images = rows;
          }
          const [rows_1, fields_1] = await conn.execute(sql_2, [id])
          if (rows_1 != [] && rows_1 != {} && rows_1 != "" && rows_1 != null) {
            response.OfferHighlights = rows_1;
          }
          const [rows_2, fields_2] = await conn.execute(sql_3, [id])
          if (rows_2 != [] && rows_2 != {} && rows_2 != "" && rows_2 != null) {
            response.OfferPackage = rows_2;
          }
          const [rows_3, fields_3] = await conn.execute(sql_4, [id])
          if (rows_3 != [] && rows_3 != {} && rows_3 != "" && rows_3 != null) {
            response.Outlets = rows_3;
          }


          res.status(200).send(response);
        }
        else {
          res.status(200).send(response)
        }
        connection.release();
      });


    });


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('hot', err.message)
  }

});

router.get('/booking', async (req, res) => {
  try {
    let con = createNewConnection();
    var id = parseInt(req.query.salonid);
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('hot booking', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select subject as deal_name,OriPrice as original_price ,Offer_ID as deal_id, OfferPrice from Offer where Salon_ID=?";
      connection.query(sql, [id], function (err, result, fields) {
        if (err) {
          console.log('hot booking', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        res.status(200).send(result);
        connection.release();
      });


    });


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('hot details', err.message)
  }

});



module.exports = router;