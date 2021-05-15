const { xxTinyBuzz_Device_Master_Tbl } = require("../Models/xxTinyBuzz_Device_Master_Tbl");
const _ = require('lodash');
const express = require("express");
const router = express.Router();



router.post("/", async (req, res) => {
    try {

        device = new xxTinyBuzz_Device_Master_Tbl(_.pick(req.body, [
            "deviceToken",
            "country",
            "language"
        ])
        );
        device = await device.save();
        res.send(device);
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("device Post", err.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const device = await xxTinyBuzz_Device_Master_Tbl.find();

        res.send(device);
    } catch (err) {
        res.send({ message: err.message });
        console.log("device get", err.message);
    }
});

router.get("/tokens", async (req, res) => {
    try {
        const device = await xxTinyBuzz_Device_Master_Tbl.find().select({ deviceToken: 1 });

        res.send(device);
    } catch (err) {
        res.send({ message: err.message });
        console.log("device get", err.message);
    }
});

module.exports = router;
