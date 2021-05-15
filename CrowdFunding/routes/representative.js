const { xx_usd_representative } = require("../Models/xx_usd_representative");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    new_representative = new xx_usd_representative({
      firstName: req.body.firstName,
      lastname: req.body.lastname,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      company: req.body.companyID,
    });
    await new_representative.save();

    res.send(new_representative);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create representative", err.message);
  }
});

router.get("/listByCompany/:id", async (req, res) => {
  try {
    const comp_rep = await xx_usd_representative.find({
      company: req.params.id,
    });
    if (!comp_rep)
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

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get representative by company id", err.message);
  }
});

module.exports = router;
