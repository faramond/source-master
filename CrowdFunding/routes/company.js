const { xx_usd_company } = require("../Models/xx_usd_company");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    new_company = new xx_usd_company({
      companyName: req.body.companyName,
      legalEntityType: req.body.legalEntityType,
      VATNumber: req.body.VATNumber,
      investmentSector: req.body.investmentSector,
      website: req.body.website,
      user: req.body.userID,
    });
    await new_company.save();

    res.send(new_company);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create company", err.message);
  }
});

router.get("/listByUser/:id", async (req, res) => {
  try {
    const comp = await xx_usd_company.find({ user: req.params.id });
    if (!comp)
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

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("user Get details by id", err.message);
  }
});

module.exports = router;
