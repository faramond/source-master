const { createNewConnection } = require('../lib/connection');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/blog', async (req, res) => {
    try { 
        let con = createNewConnection();
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "select BlogID as blog_id, Subject as title,BlogHeader as brief_decription, BlogDate as news_date, HeaderLocation as image_location from Blog where IsPublish=1 order by BlogDate desc";
            con.query(sql, function (err, result, fields) {
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

router.get('/blogDetails', async (req, res) => {
    try { 
        let con = createNewConnection();
        var id = parseInt(req.query.blog_id);
        temp = [];
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "select  Subject as title, BlogDate as news_date, Description as description from Blog where IsPublish=1 and BlogID=?";
            var sql_2 ="select  Location from  BlogImage where BlogID=?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
              con.query(sql_2,[id], function (err, result_2, fields_2) {
               if (err) throw err;
                console.log("fetch successful");
                if( result != null && result != [] && result != ''){
              for(i=0;i<result_2.length;i++){
                temp.push(result_2[i].Location);}
                result[0].Images = temp;
             res.send(result[0]);}
             else{
                res.send(result); 
             }
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

router.get('/', async (req, res) => {
    try { 
        let con = createNewConnection();
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "select AppBannerID as app_banner_id,CoverImg as image,Subject as title, BriefDescription as brief_description from AppBanner";
            con.query(sql, function (err, result, fields) {
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

router.get('/details', async (req, res) => {
    try { 
        let con = createNewConnection();
        var id = parseInt(req.query.app_banner_id);
        temp = [];
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "Select Subject as title,Description as description from AppBanner where AppBannerID=?";
            var sql_2 ="select ImageLoc as image from AppBannerImage where AppBannerID=?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
              con.query(sql_2,[id], function (err, result_2, fields_2) {
                if (err) throw err;
                console.log("fetch successful");
               if( result != null && result != [] && result != ''){
                for(i=0;i<result_2.length;i++){
                temp.push(result_2[i].image);}
                result[0].Images = temp;
             res.send(result[0]);}
             else{
                res.send(result);
             }
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


module.exports = router;