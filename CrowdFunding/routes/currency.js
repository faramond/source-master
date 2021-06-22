const { xx_cf_currency } = require("../Models/xx_cf_currency");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    currency = new xx_cf_currency({
      currency: req.body.currency,
      ISO4217Code: req.body.ISO4217Code,
      currencySign: req.body.currencySign,
    });
    await currency.save();

    res.status(201).send(currency);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create currency", err.message);
  }
});

router.post("/listAll", auth, async (req, res) => {
  try {
    let searchValue = "";
    if (
      req.body.searchValue != null &&
      req.body.searchValue != "" &&
      req.body.searchValue != undefined
    ) {
      searchValue = req.body.searchValue;
    }
    const currency = await xx_cf_currency.find({
      $or: [
        {
          currency: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
        {
          ISO4217Code: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
        {
          currencySign: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
      ],
    });
    if (!currency)
      return res.status(404).send({
        status_code: 4,
        message: "No Currency Available.",
        result: [],
      });
    if (currency.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "No Currency Available",
        result: [],
      });
    const count = await xx_cf_currency.count();
    let response = {
      status_code: 1,
      message: "List of Currency  Fetched Successfully",
      totalCount: count,
      result: currency,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get currency", err.message);
  }
});

router.post("/active", auth, async (req, res) => {
  try {
    let searchValue = "";
    if (
      req.body.searchValue != null &&
      req.body.searchValue != "" &&
      req.body.searchValue != undefined
    ) {
      searchValue = req.body.searchValue;
    }
    const currency = await xx_cf_currency.find({
      isActive: true,
      $or: [
        {
          currency: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
        {
          ISO4217Code: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
        {
          currencySign: {
            $regex: new RegExp(".*" + searchValue + ".*", "i"),
          },
        },
      ],
    });
    if (!currency)
      return res.status(404).send({
        status_code: 4,
        message: "No Currency Available.",
        result: [],
      });
    if (currency.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "No Currency Available",
        result: [],
      });
    const count = await xx_cf_currency.find({ isActive: true }).count();
    let response = {
      status_code: 1,
      message: "List of Active Currency  Fetched Successfully",
      totalCount: count,
      result: currency,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get currency", err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const currency = await xx_cf_currency.find({ _id: req.params.id });
    let response = {
      status_code: 1,
      message: " Currency  Fetched Successfully",
      result: currency,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get currency by id", err.message);
  }
});

router.patch("/changeStatus/:id", auth, async (req, res) => {
  try {
    let check = await xx_cf_currency.findOne({ _id: req.params.id });
    const currency = await xx_cf_currency.findByIdAndUpdate(
      req.params.id,
      {
        isActive: !check.isActive,
        updated: new Date(),
      },
      { new: true }
    );
    let response = {
      status_code: 1,
      message: " Currency Status Changed Successfully",
      result: [currency],
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("patch currency by id", err.message);
  }
});

module.exports = router;
