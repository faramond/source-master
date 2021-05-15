const { xxTinyBuzz_Language_Master_Tbl } = require("../Models/xxTinyBuzz_Language_Master_Tbl");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require('lodash');



router.post("/", async (req, res) => {
    try {

        language = new xxTinyBuzz_Language_Master_Tbl(_.pick(req.body, [
            "language_name",
            "active"
        ])
        );
        language = await language.save();
        res.send(language);
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("Language Post", err.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const language = await xxTinyBuzz_Language_Master_Tbl.find();

        res.send(language);
    } catch (err) {
        res.send({ message: err.message });
        console.log("language get", err.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const language = await xxTinyBuzz_Language_Master_Tbl.findOne({ _id: req.params.id }).select({ language_name: 1 });

        res.send(language);
    } catch (err) {
        res.send({ message: err.message });
        console.log("language get", err.message);
    }
});

module.exports = router;
