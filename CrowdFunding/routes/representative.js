const { xx_cf_representative } = require("../Models/xx_cf_representative");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    new_representative = new xx_cf_representative({
      firstName: req.body.firstName,
      lastname: req.body.lastname,
      email: req.body.email,
      countryCode: req.body.countryCode,
      mobileNumber: req.body.mobileNumber,
      companyID: req.body.companyID,
    });
    await new_representative.save();

    res.status(201).send(new_representative);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create representative", err.message);
  }
});

router.get("/listByCompany/:id", auth, async (req, res) => {
  try {
    const comp_rep = await xx_cf_representative.find({
      companyID: req.params.id,
    });
    if (!comp_rep)
      return res.status(404).send({
        status_code: 4,
        message: "No Representative found for the Given Company.",
        result: [],
      });
    if (comp_rep.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "No Representative found for the Given Company.",
        result: [],
      });
    let response = {
      status_code: 1,
      message:
        "List of Representative for the given Company Fetched Successfully",
      result: comp_rep,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get representative by company id", err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const comp_rep = await xx_cf_representative.find({
      _id: req.params.id,
    });
    if (!comp_rep)
      return res.status(404).send({
        status_code: 4,
        message: "Representative Not Found",
        result: [],
      });
    let response = {
      status_code: 1,
      message: "Representative Details Fetched Successfully",
      result: comp_rep,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get representative  id", err.message);
  }
});
module.exports = router;
