const { xx_cf_company } = require("../Models/xx_cf_company");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    new_company = new xx_cf_company({
      companyName: req.body.companyName,
      legalEntityType: req.body.legalEntityType,
      VATNumber: req.body.VATNumber,
      investmentSector: req.body.investmentSector,
      website: req.body.website,
      userID: req.body.userID,
    });
    await new_company.save();

    res.status(201).send(new_company);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create company", err.message);
  }
});

router.get("/listByUser/:id", auth, async (req, res) => {
  try {
    const comp = await xx_cf_company.find({ userID: req.params.id });
    if (!comp)
      return res.status(404).send({
        status_code: 4,
        message: "No Company found for the Given User.",
        result: [],
      });
    if (comp.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "No Company found for the Given User.",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "List of Company Fetched Successfully",
      result: comp,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("company Get list by user id", err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const comp = await xx_cf_company.find({ _id: req.params.id });
    if (!comp)
      return res.status(404).send({
        status_code: 4,
        message: "Company Not Found.",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "Company Details Fetched Successfully",
      result: comp,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("company Get details by id", err.message);
  }
});

module.exports = router;
