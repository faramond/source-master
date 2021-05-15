const { xxTinyBuzz_Content } = require("../Models/TinyBuzz_Content");
const { xxTinyBuzz_Category } = require("../Models/TinyBuzz_Category");
const { xxTinyBuzz_User } = require("../Models/TinyBuzz_user");
const { xxTinyBuzz_Language_Master_Tbl } = require("../Models/xxTinyBuzz_Language_Master_Tbl");
const { xxTinyBuzz_Country_Master_Tbl } = require("../Models/xxTinyBuzz_Country_Master_Tbl");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const app = express();
const multer = require("multer");
const upload = require("../storage/image");
const moment = require("moment");
var request = require('request');

router.post("/", upload.array("images"), async (req, res) => {
  console.log(req.body.country_ID, "check")
  try {
    if (req.body.category_ID == "undefined" || req.body.category_ID == null) {
      return res.send({ "message": "categary id required" })
    }
    if (req.body.country_ID == "undefined" || req.body.country_ID == null) {
      return res.send({ "message": "country id required" })
    }
    if (req.body.language_ID == "undefined" || req.body.language_ID == null) {
      return res.send({ "message": "language id required" })
    }

    const data2 = await xxTinyBuzz_User.findOne({ email: req.body.created_by })
    console.log(data2);
    let news = await xxTinyBuzz_Content.find();
    if (news != [] && news != "" && news != null) {
      let key = [news.length - 1];
      let serial = news[key].newsID;
      serial++;
      req.body.newsID = 0000 + serial;
    } else {
      req.body.newsID = 0000;
    }
    if (req.files == undefined) {
      let content = new xxTinyBuzz_Content({
        newsID: req.body.newsID,
        news_description: req.body.news_description,
        news_title: req.body.news_title,
        news_source: req.body.news_source,
        image_source: req.body.image_source,
        created_by: req.body.created_by,
        updated_by: req.body.updated_by,
        category_ID: req.body.category_ID,
        language_ID: req.body.language_ID,
        country_ID: req.body.country_ID,
        news_url: req.body.news_url,
        creator: data2.fullname,
        isBreaking: req.body.isBreaking,
        isApproved: req.body.isBreaking
      });
      content = await content.save();
      res.send(content);
    } else {
      pics = [];
      for (i = 0; i < req.files.length; i++) pics.push(req.files[i].path);

      let content = new xxTinyBuzz_Content({
        newsID: req.body.newsID,
        news_description: req.body.news_description,
        news_title: req.body.news_title,
        news_source: req.body.news_source,
        image_source: req.body.image_source,
        created_by: req.body.created_by,
        images: pics,
        updated_by: req.body.updated_by,
        category_ID: req.body.category_ID,
        language_ID: req.body.language_ID,
        country_ID: req.body.country_ID,
        news_url: req.body.news_url,
        creator: data2.fullname,
        isBreaking: req.body.isBreaking,
        isApproved: req.body.isBreaking
      });
      content = await content.save();
      res.send(content);
      if (req.body.isBreaking == "true") {

        const country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content.country_ID }).select({ country_name: 1 })
        const language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content.language_ID }).select({ language: 1 })

        request.post({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAA8QfTdnA:APA91bFthOoZZlrYid1h2wh5UZuonEMFyLqgdeM6OAczFfsahPXUhFggHU1ku4X3ImlppoLjUxOReCHYdbrc0ESbRnd3Gqy9u2cs9S8c8-gzoYd5r-nNEdLi5pxnSl5WWZB-m3pyZyDt'
          },
          url: 'https://fcm.googleapis.com/fcm/send',
          body: JSON.stringify({
            "to": "/topics/" + country.country_name + "-" + language.language,
            "notification": {
              "image": "http://104.154.104.32:3000/" + content.images[0],
              "title": content.news_title
            },
            "data": content

          })
        }, function (error, response, body) {
          body = JSON.parse(body)
        });
      }
    }
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.post("/category", async (req, res) => {
  try {
    let category = new xxTinyBuzz_Category({
      category_name: req.body.name,
    });

    category = await category.save();
    res.send(category);
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.get("/category", async (req, res) => {
  try {
    const category = await xxTinyBuzz_Category.find();

    res.send(category);
  } catch (err) {
    res.send({ message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const content = await xxTinyBuzz_Content.find();

    res.send(content);
  } catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});


router.get("/news/pending", async (req, res) => {
  try {
    content = [];

    if (req.query.country == "undefined" || req.query.country == null) {
      content = await xxTinyBuzz_Content
        .find()
        .and([{ isApproved: false }])
        .sort({ created: -1 })
    }
    else {
      content = await xxTinyBuzz_Content
        .find()
        .and([{ country_ID: req.query.country }])
        .and([{ isApproved: false }])
        .sort({ created: -1 })
    }
    if (content != [] && content != null && content != "") {
      for (i = 0; i < content.length; i++) {

        let language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1 });
        let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
        let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
        let date = content[i].created;

        let duration = moment(date).fromNow();
        content[i] = JSON.stringify(content[i]);
        content[i] = JSON.parse(content[i]);
        content[i].timeStamp = duration;
        content[i].language_name = language.language_name;
        content[i].country_name = country.country_name;
        content[i].category_name = category.category_name;
      }
      res.send(content);
    }
    else {
      res.send({ "message": "no news found" })
    }

  }
  catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});

router.get("/news/approved", async (req, res) => {
  try {
    content = [];

    if (req.query.country == "undefined" || req.query.country == null) {
      content = await xxTinyBuzz_Content
        .find()
        .and([{ isApproved: true }])
        .sort({ created: -1 })
    }
    else {
      content = await xxTinyBuzz_Content
        .find()
        .and([{ country_ID: req.query.country }])
        .and([{ isApproved: true }])
        .sort({ created: -1 })
    }
    if (content != [] && content != null && content != "") {
      for (i = 0; i < content.length; i++) {

        let language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1 });
        let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
        let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
        let date = content[i].created;

        let duration = moment(date).fromNow();
        content[i] = JSON.stringify(content[i]);
        content[i] = JSON.parse(content[i]);
        content[i].timeStamp = duration;
        content[i].language_name = language.language_name;
        content[i].country_name = country.country_name;
        content[i].category_name = category.category_name;
      }
      res.send(content);
    }
    else {
      res.send({ "message": "no news found" })
    }

  }
  catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});



router.get("/news/:user", async (req, res) => {
  try {

    if (req.query.category == "All Buzz" || req.query.category == "undefined" || req.query.category == null || req.query.category == "5efd92c7328e6312e782a127") {
      console.log("kl")
      const content = await xxTinyBuzz_Content
        .find()
        .or([{ created_by: req.params.user }])
        //.and([{ country_ID: req.query.country }])
        //.and([{ language_ID: req.query.language }])
        .sort({ created: -1 })
      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {

          let language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
          let date = content[i].created;

          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;
          if (content[i].isApproved) {
            content[i].isApproved = "Approved";
          }
          else {
            content[i].isApproved = "Pending"
          }
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
    else {
      const content = await xxTinyBuzz_Content
        .find()
        .or([{ created_by: req.params.user }])
        .and([{ category_ID: req.query.category }])
        //.and([{ country_ID: req.query.country }])
        //.and([{ language_ID: req.query.language }])
        .sort({ created: -1 });

      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {

          let Language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1, language: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
          let date = content[i].created;
          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = Language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
  } catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});


router.get("/news/:user/:category", async (req, res) => {
  try {
    if (req.params.category == "all") {
      const content = await xxTinyBuzz_Content
        .find()
        .or([{ created_by: req.params.user }]);

      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {
          let language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });

          let date = content[i].created;
          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;

        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
    else {
      const content = await xxTinyBuzz_Content
        .find()
        .or([{ created_by: req.params.user }])
        .and([{ category_name: req.params.category }]);

      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {
          let date = content[i].created;
          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
  } catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});

router.get("/news", async (req, res) => {
  try {
    let d1 = new Date(req.query.date)
    d1.setTime(d1.getTime() - (48 * 60 * 60 * 1000));
    console.log(req.query.category, req.query.language, req.query.country)

    if (req.query.category == "All Buzz" || req.query.category == "undefined" || req.query.category == null || req.query.category == "5efd92c7328e6312e782a127") {
      const content = await xxTinyBuzz_Content
        .find()
        .and([{ country_ID: req.query.country }])
        .and([{ language_ID: req.query.language }])
        .and([{ isApproved: true }])
        .sort({ created: -1 })
      console.log(content.length, "con")
      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {

          let language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
          let date = content[i].created;

          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
    else if (req.query.date == "undefined" || req.query.date == null) {
      const content = await xxTinyBuzz_Content
        .find()
        .and([{ category_ID: req.query.category }])
        .and([{ country_ID: req.query.country }])
        .and([{ language_ID: req.query.language }])
        .and([{ isApproved: true }])
        .sort({ created: -1 });

      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {

          let Language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1, language: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
          let date = content[i].created;
          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = Language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
    else {
      const content = await xxTinyBuzz_Content
        .find()
        .and([{ category_ID: req.query.category }])
        .and([{ country_ID: req.query.country }])
        .and([{ language_ID: req.query.language }])
        .and([{ isApproved: true }])
        .or([{ created: { $gte: (d1) } }])
        .sort({ created: -1 });

      if (content != [] && content != null && content != "") {
        for (i = 0; i < content.length; i++) {

          let Language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: content[i].language_ID }).select({ language_name: 1, language: 1 });
          let country = await xxTinyBuzz_Country_Master_Tbl.findOne({ _id: content[i].country_ID }).select({ country_name: 1 });
          let category = await xxTinyBuzz_Category.findOne({ _id: content[i].category_ID }).select({ category_name: 1 });
          let date = content[i].created;
          let duration = moment(date).fromNow();
          content[i] = JSON.stringify(content[i]);
          content[i] = JSON.parse(content[i]);
          content[i].timeStamp = duration;
          content[i].language_name = Language.language_name;
          content[i].country_name = country.country_name;
          content[i].category_name = category.category_name;
        }
        res.send(content);
      }
      else {
        res.send({ "message": "no news found" })
      }
    }
  } catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});



router.get("/currentCategory", async (req, res) => {
  try {
    let categoryID = [];
    let category = [];
    let d1 = new Date(req.query.date)
    d1.setTime(d1.getTime() - (48 * 60 * 60 * 1000));

    console.log(req.query.language, req.query.country, "kk")

    const content = await xxTinyBuzz_Content
      .find()
      .and([{ isApproved: true }])
      //.and([{ country_ID: req.query.country }])
      // .and([{ language_ID: req.query.language }])
      .or([{ created: { $gte: (d1) } }])

    if (content != [] && content != null && content != "") {
      for (i = 0; i < content.length; i++) {
        if (!categoryID.includes(JSON.parse(JSON.stringify(content[i].category_ID)))) {
          categoryID.push(JSON.parse(JSON.stringify(content[i].category_ID)))
        }
      }
    }
    const data = await xxTinyBuzz_Category.find();
    if (data != [] && data != null && data != "") {
      for (i = 0; i < data.length; i++) {
        if (categoryID.includes(JSON.parse(JSON.stringify(data[i]._id)))) {
          category.push(data[i])
        }
      }
    }

    res.send(category);



  } catch (err) {
    res.send({ message: err.message });
    console.log("news get", err.message);
  }
});

router.patch("/:id", upload.array("images"), async (req, res) => {
  try {
    const data_1 = await xxTinyBuzz_Category.findOne()
      .or([{ _id: req.body.category_ID }]);
    let pics = [];
    if (req.body.unchanged) {
      let data = JSON.parse(req.body.unchanged);
      for (i = 0; i < data.length; i++) pics.push(data[i]);
    }

    if (req.files != undefined) {
      for (i = 0; i < req.files.length; i++) pics.push(req.files[i].path);
    }

    const data = await xxTinyBuzz_Content
      .findOne()
      .or([{ newsID: req.params.id }]);
    if (data) {

      let content = await xxTinyBuzz_Content.findByIdAndUpdate(
        data._id,
        {
          news_description: req.body.news_description,
          news_title: req.body.news_title,
          news_source: req.body.news_source,
          image_source: req.body.image_source,
          images: pics,
          updated_by: req.body.updated_by,
          category_ID: req.body.category_ID,
          category_name: data_1.category_name,
          language_ID: req.body.language_ID,
          country_ID: req.body.country_ID,
          news_url: req.body.news_url,
          isBreaking: req.body.isBreaking,
          isApproved: req.body.isBreaking
        },
        { new: true }
      );

      if (!content) return res.status(404).send({ message: "News not found." });

      res.send(content);
    } else {
      res.send({ message: "The news with the given newsID was not found." });
    }
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.patch("/approve/:id", async (req, res) => {
  try {
    let content = await xxTinyBuzz_Content.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true
      },
      { new: true }
    );
    if (!content) return res.status(404).send({ message: "News not found." });

    res.send(content);
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const data = await xxTinyBuzz_Content
      .findOne()
      .or([{ newsID: req.params.id }]);
    if (data) {
      const content = await xxTinyBuzz_Content.findByIdAndRemove(data._id);

      if (!content)
        return res
          .status(404)
          .send({ message: "The news with the given newsID was not found." });

      res.send(content);
    } else {
      res.send({ message: "The news with the given newsID was not found." });
    }
  } catch (err) {
    res.send({ message: err.message });
  }
});

module.exports = router;
