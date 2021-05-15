const { xxTinyBuzz_Content } = require("../Models/TinyBuzz_Content");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();




router.get("/", async (req, res) => {
    try {
        let response = []

        const total = await xxTinyBuzz_Content.find();

        const sports = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec2313819b81c7ea30b7d7e" }]);

        const politics = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec7d277116c296be83aa27a" }]);

        const technology = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb712086129b217906a213" }]);

        const business = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb711086129b217906a212" }]);

        const entertainment = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb713286129b217906a214" }]);

        const education = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb714386129b217906a215" }]);

        const automobile = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716186129b217906a217" }]);

        const international = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb715286129b217906a216" }]);

        const science = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716d86129b217906a218" }]);

        const fashion = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb718686129b217906a21a" }]);

        const travel = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb717586129b217906a219" }]);

        const miscellaneous = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71a086129b217906a21b" }]);

        const coronaVirus = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71b186129b217906a21c" }]);

        response.push({ 'Key': 'All', 'value': total.length });
        response.push({ 'Key': 'Sports', 'value': sports.length });
        response.push({ 'Key': 'Politics', 'value': politics.length });
        response.push({ 'Key': 'Business', 'value': business.length });
        response.push({ 'Key': 'Technology', 'value': technology.length });
        response.push({ 'Key': 'Entertainment', 'value': entertainment.length });
        response.push({ 'Key': 'Education', 'value': education.length });
        response.push({ 'Key': 'International', 'value': international.length });
        response.push({ 'Key': 'Automobile', 'value': automobile.length });
        response.push({ 'Key': 'Science', 'value': science.length });
        response.push({ 'Key': 'Travel', 'value': travel.length });
        response.push({ 'Key': 'Fashion', 'value': fashion.length });
        response.push({ 'Key': 'Miscellaneous', 'value': miscellaneous.length });
        response.push({ 'Key': 'Corona Virus', 'value': coronaVirus.length });



        res.send(response);
    } catch (err) {
        res.send({ message: err.message });
        console.log("language get", err.message);
    }
});


router.get("/24hr", async (req, res) => {
    try {
        let d1 = new Date()
        d1.setTime(d1.getTime() - (24 * 60 * 60 * 1000));
        let response = []

        const day = await xxTinyBuzz_Content.find().or([{ created: { $gte: (d1) } }]);

        const sports24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec2313819b81c7ea30b7d7e" }]).or([{ created: { $gte: (d1) } }]);

        const politics24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec7d277116c296be83aa27a" }]).or([{ created: { $gte: (d1) } }]);

        const technology24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb712086129b217906a213" }]).or([{ created: { $gte: (d1) } }]);

        const business24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb711086129b217906a212" }]).or([{ created: { $gte: (d1) } }]);

        const entertainment24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb713286129b217906a214" }]).or([{ created: { $gte: (d1) } }]);

        const education24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb714386129b217906a215" }]).or([{ created: { $gte: (d1) } }]);

        const automobile24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716186129b217906a217" }]).or([{ created: { $gte: (d1) } }]);

        const international24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb715286129b217906a216" }]).or([{ created: { $gte: (d1) } }]);

        const science24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716d86129b217906a218" }]).or([{ created: { $gte: (d1) } }]);

        const fashion24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb718686129b217906a21a" }]).or([{ created: { $gte: (d1) } }]);

        const travel24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb717586129b217906a219" }]).or([{ created: { $gte: (d1) } }]);

        const miscellaneous24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71a086129b217906a21b" }]).or([{ created: { $gte: (d1) } }]);

        const coronaVirus24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71b186129b217906a21c" }]).or([{ created: { $gte: (d1) } }]);

        response.push({ 'Key': 'All', 'value': day.length });
        response.push({ 'Key': 'Sports', 'value': sports24.length });
        response.push({ 'Key': 'Politics', 'value': politics24.length });
        response.push({ 'Key': 'Business', 'value': business24.length });
        response.push({ 'Key': 'Technology', 'value': technology24.length });
        response.push({ 'Key': 'Entertainment', 'value': entertainment24.length });
        response.push({ 'Key': 'Education', 'value': education24.length });
        response.push({ 'Key': 'International', 'value': international24.length });
        response.push({ 'Key': 'Automobile', 'value': automobile24.length });
        response.push({ 'Key': 'Science', 'value': science24.length });
        response.push({ 'Key': 'travel', 'value': travel24.length });
        response.push({ 'Key': 'Fashion', 'value': fashion24.length });
        response.push({ 'Key': 'Miscellaneous', 'value': miscellaneous24.length });
        response.push({ 'Key': 'Corona Virus', 'value': coronaVirus24.length });



        res.send(response);
    } catch (err) {
        res.send({ message: err.message });
        console.log("language get 24hr", err.message);
    }
});


router.get("/perDay", async (req, res) => {
    try {
        let d1 = new Date(req.query.date);
        let d2 = new Date(req.query.date);
        d2 = d2.setDate(d2.getDate() + 1);

        let response = [];

        const sports24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec2313819b81c7ea30b7d7e" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const politics24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5ec7d277116c296be83aa27a" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const technology24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb712086129b217906a213" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const business24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb711086129b217906a212" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const entertainment24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb713286129b217906a214" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const education24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb714386129b217906a215" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const automobile24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716186129b217906a217" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const international24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb715286129b217906a216" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const science24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb716d86129b217906a218" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const fashion24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb718686129b217906a21a" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const travel24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb717586129b217906a219" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const miscellaneous24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71a086129b217906a21b" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        const coronaVirus24 = await xxTinyBuzz_Content.find().and([{ category_ID: "5edb71b186129b217906a21c" }]).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);

        response.push({ 'Key': 'Sports', 'value': sports24.length });
        response.push({ 'Key': 'Politics', 'value': politics24.length });
        response.push({ 'Key': 'Business', 'value': business24.length });
        response.push({ 'Key': 'Technology', 'value': technology24.length });
        response.push({ 'Key': 'Entertainment', 'value': entertainment24.length });
        response.push({ 'Key': 'Education', 'value': education24.length });
        response.push({ 'Key': 'International', 'value': international24.length });
        response.push({ 'Key': 'Automobile', 'value': automobile24.length });
        response.push({ 'Key': 'Science', 'value': science24.length });
        response.push({ 'Key': 'travel', 'value': travel24.length });
        response.push({ 'Key': 'Fashion', 'value': fashion24.length });
        response.push({ 'Key': 'Miscellaneous', 'value': miscellaneous24.length });
        response.push({ 'Key': 'Corona Virus', 'value': coronaVirus24.length });





        res.send(response);
    } catch (err) {
        res.send({ message: err.message });
        console.log("per day", err.message);
    }
});

router.get("/count", async (req, res) => {
    try {
        let d1 = new Date(req.query.date);
        let d2 = new Date(req.query.date);
        let d3 = new Date(req.query.date);
        d2 = d2.setDate(d2.getDate() + 1);
        d3 = d3.setDate(d3.getDate() - 1);

        let response = [];

        const today = await xxTinyBuzz_Content.find().and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);
        const yesterday = await xxTinyBuzz_Content.find().and([{ created: { $gte: (d3) } }, { created: { $lte: (d1) } }]);
        const total = await xxTinyBuzz_Content.find();
        const notApproved24 = await xxTinyBuzz_Content.find().and({ isApproved: false }).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);
        const notApprovedYesterday = await xxTinyBuzz_Content.find().and({ isApproved: false }).and([{ created: { $gte: (d3) } }, { created: { $lte: (d1) } }]);
        const notApproved = await xxTinyBuzz_Content.find().and({ isApproved: false });
        const approved24 = await xxTinyBuzz_Content.find().and({ isApproved: true }).and([{ created: { $gte: (d1) } }, { created: { $lte: (d2) } }]);
        const approvedYesterday = await xxTinyBuzz_Content.find().and({ isApproved: true }).and([{ created: { $gte: (d3) } }, { created: { $lte: (d1) } }]);
        const approved = await xxTinyBuzz_Content.find().and({ isApproved: true });

        response.push({ 'Key': 'Number of News Posted Today', 'value': today.length });
        response.push({ 'Key': 'Number of News Posted Yesterday', 'value': yesterday.length });
        response.push({ 'Key': 'Total Number of News Posted', 'value': total.length });
        response.push({ 'Key': 'Number of Today\'\s News Pending for Approval ', 'value': notApproved24.length });
        response.push({ 'Key': 'Number of Yesterday\'\s News Pending for Approval ', 'value': notApprovedYesterday.length });
        response.push({ 'Key': 'Total Number of  News Pending for Approval ', 'value': notApproved.length });
        response.push({ 'Key': 'Number of News Approved Today', 'value': approved24.length });
        response.push({ 'Key': 'Number of News Approved Yesterday', 'value': approvedYesterday.length });
        response.push({ 'Key': 'Total Number of News Approved', 'value': approved.length });

        res.send(response);
    } catch (err) {
        res.send({ message: err.message });
        console.log("count", err.message);
    }
});




module.exports = router;
