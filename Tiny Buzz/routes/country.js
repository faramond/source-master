const { xxTinyBuzz_Country_Master_Tbl } = require("../Models/xxTinyBuzz_Country_Master_Tbl");
const _ = require('lodash');
const express = require("express");
const router = express.Router();



router.post("/", async (req, res) => {
    try {

        country = new xxTinyBuzz_Country_Master_Tbl(_.pick(req.body, [
            "country_name",
            "active"
        ])
        );
        country = await country.save();
        res.send(country);
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("country Post", err.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const country = await xxTinyBuzz_Country_Master_Tbl.find().and({active: true});

        res.send(country);
    } catch (err) {
        res.send({ message: err.message });
        console.log("country get", err.message);
    }
});

router.get("/all", async (req, res) => {
    try {
        const country = await xxTinyBuzz_Country_Master_Tbl.find()

        res.send(country);
    } catch (err) {
        res.send({ message: err.message });
        console.log("country get all", err.message);
    }
});

router.patch("/:country", async (req, res) => {
    try {
        const data = await xxTinyBuzz_Country_Master_Tbl.findOne({_id: req.params.country});
        const country = await xxTinyBuzz_Country_Master_Tbl.findByIdAndUpdate(
            req.params.country,{
                active: !data.active
            },
        { new: true }
        )

        res.send(country);
    } catch (err) {
        res.send({ message: err.message });
        console.log("country patch", err.message);
    }
});
module.exports = router;
