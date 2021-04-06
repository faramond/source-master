const { createNewConnection } = require('../lib/connection');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/blog', async (req, res) => {
  try {
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('blog', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select BlogID as blog_id, Subject as title,BlogHeader as brief_decription, BlogDate as news_date, HeaderLocation as image_location from Blog where IsPublish=1 order by BlogDate desc";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('blog', err.message)
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
    console.log('blog', err.message)
  }

});

router.get('/blogSearch', async (req, res) => {
  try {
    let keyword = req.query.keyword;
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('blog', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select BlogID as blog_id, Subject as title,BlogHeader as brief_decription, BlogDate as news_date, HeaderLocation as image_location from Blog where IsPublish=1 and subject LIKE  '%" + keyword + "%' order by BlogDate desc";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('blog', err.message)
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
    console.log('blog search', err.message)
  }

});

router.get('/blogDetails', async (req, res) => {
  try {
    let con = createNewConnection();
    var id = parseInt(req.query.blog_id);
    temp = [];
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('blog details', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select  Subject as title, BlogDate as news_date, Description as description from Blog where IsPublish=1 and BlogID=?";
      var sql_2 = "select  Location from  BlogImage where BlogID=?";
      connection.query(sql, [id], function (err, result, fields) {
        if (err) {
          console.log('blog details', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        connection.query(sql_2, [id], function (err, result_2, fields_2) {
          if (err) {
            console.log('blog details', err.message)
            return res.status(400).send({ 'message': err.message });
          };
          console.log("fetch successful");
          if (result != null && result != [] && result != '') {
            if (result_2 != null && result_2 != [] && result_2 != '') {
              for (i = 0; i < result_2.length; i++) {
                temp.push(result_2[i].Location);
              }
              result[0].Images = temp;
            }
            else {
              result[0].Images = [];
            }
            res.status(200).send(result[0]);
          }
          else {
            res.status(200).send(result);
          }
          connection.release();
        });


      });
    });


  }

  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('blog details', err.message)
  }

});

router.get('/', async (req, res) => {
  try {
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('happening', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select AppBannerID as app_banner_id,CoverImg as image,Subject as title, BriefDescription as brief_description from AppBanner";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('happening', err.message)
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
    console.log('happening', err.message)
  }

});

router.get('/happeningSearch', async (req, res) => {
  try {
    let keyword = req.query.keyword;
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('happening search', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "select AppBannerID as app_banner_id,CoverImg as image,Subject as title, BriefDescription as brief_description from AppBanner where Subject LIKE '%" + keyword + "%'";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('happening', err.message)
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
    console.log('happening search', err.message)
  }

});

router.get('/details', async (req, res) => {
  try {
    let con = createNewConnection();
    var id = parseInt(req.query.app_banner_id);
    temp = [];
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('happening details', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "Select Subject as title,Description as description from AppBanner where AppBannerID=?";
      var sql_2 = "select ImageLoc as image from AppBannerImage where AppBannerID=?";
      connection.query(sql, [id], function (err, result, fields) {
        if (err) {
          console.log('happening details', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        connection.query(sql_2, [id], function (err, result_2, fields_2) {
          if (err) {
            console.log('happening details', err.message)
            return res.status(400).send({ 'message': err.message });
          };
          console.log("fetch successful");
          if (result != null && result != [] && result != '') {
            if (result_2 != null && result_2 != [] && result_2 != '') {
              for (i = 0; i < result_2.length; i++) {
                temp.push(result_2[i].image);
              }
              result[0].Images = temp;
            }
            else {
              result[0].Images = [];
            }
            res.status(200).send(result[0]);
          }
          else {
            res.status(200).send(result);
          }
          connection.release();
        });


      });
    });


  }

  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('happening details', err.message)
  }

});


module.exports = router;