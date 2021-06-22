const { xx_cf_role } = require("../Models/xx_cf_role");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let value = req.body.role;
    value = value.toLowerCase();
    role = new xx_cf_role({
      role: value,
    });
    await role.save();

    res.status(201).send(role);
  } catch (err) {
    res.send({ message: err.message });
    console.log("create role", err.message);
  }
});

router.get("/listAll", auth, async (req, res) => {
  try {
    const role = await xx_cf_role.find();
    let response = {
      status_code: 1,
      message: "List of Role  Fetched Successfully",
      result: role,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get role", err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const role = await xx_cf_role.find({ _id: req.params.id });
    let response = {
      status_code: 1,
      message: "List of Role  Fetched Successfully",
      result: role,
    };

    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("get role", err.message);
  }
});

module.exports = router;
