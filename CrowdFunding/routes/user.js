const { xx_cf_user } = require("../Models/xx_cf_user");
const { xx_cf_role } = require("../Models/xx_cf_role");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../Middleware/auth");
const upload = require("../storage/image");

router.post("/login", async (req, res, arg) => {
  let check = false;
  let user;
  if (
    req.body.email === undefined ||
    req.body.email === null ||
    req.body.email === ""
  ) {
    check = true;
    if (
      req.body.mobileNumber === undefined ||
      req.body.mobileNumber === null ||
      req.body.mobileNumber === ""
    )
      return res.status(400).send({
        status_code: 2,
        message: "Please Enter Atleast one of Email or Mobile Number",
        result: [],
      });
  }
  if (!check) {
    user = await xx_cf_user.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });
  } else {
    user = await xx_cf_user.findOne({
      mobileNumber: req.body.mobileNumber,
    });
  }
  if (!user) {
    return res.status(400).send({
      status_code: 3,
      message: "Invalid UserName or Password.",
      result: [],
    });
  }
  if (user.status === "inactive") {
    return res.status(400).send({
      status_code: 3,
      message: "The Provided User is Inactive",
      result: [],
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      status_code: 3,
      message: "Invalid UserName or Password.",
      result: [],
    });

  const role = await xx_cf_role
    .findOne({ _id: user.roleID })
    .select({ role: 1 });

  const token = user.generateAuthToken();

  let response = {
    status_code: 1,
    message: "Succesfully Logged In",
    result: [
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        role: role.role,
        roleID: user.roleID,
        image: user.image,
        dob: user.dob,
        gender: user.gender,
        status: user.status,
        created: user.created,
        updated: user.updated,
      },
    ],
  };
  res
    .header({
      "x-auth-token": token,
      "Access-Control-Expose-Headers": ["Content-Encoding", "x-auth-token"],
    })
    .status(201)
    .send(response);
});

router.post("/socialLoginValidation", async (req, res) => {
  try {
    if (
      req.body.email === undefined ||
      req.body.email === null ||
      req.body.email === ""
    )
      return res.status(400).send({
        status_code: 2,
        message: "Email is Required",
        result: [],
      });
    user = await xx_cf_user.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });

    if (!user) {
      return res.status(201).send({
        status_code: 3,
        message: "The Email you Entered does not exists.",
        result: [],
      });
    }
    if (user.status === "inactive")
      return res.status(400).send({
        status_code: 3,
        message: "The User Corresponding to the Given Email is Inactive",
        result: [],
      });

    const role = await xx_cf_role
      .findOne({ _id: user.role })
      .select({ role: 1 });

    const token = user.generateAuthToken();

    let response = {
      status_code: 1,
      message: "Email is already Registered",
      result: [
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          countryCode: user.countryCode,
          mobileNumber: user.mobileNumber,
          address: user.address,
          roleID: role._id,
          role: role.role,
          status: user.status,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
          created: user.created,
          updated: user.updated,
        },
      ],
    };
    res
      .header({
        "x-auth-token": token,
        "Access-Control-Expose-Headers": ["Content-Encoding", "x-auth-token"],
      })
      .status(201)
      .send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("email validation", err.message);
  }
});

router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    let user = await xx_cf_user.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });
    if (user)
      return res.status(400).send({
        status_code: 2,
        message: "Email is Already Registered.",
        result: [],
      });
    if (
      req.body.email === undefined ||
      req.body.email === "" ||
      req.body.email === null
    )
      return req.send({ message: "email required" });
    let mobile = await xx_cf_user.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (mobile)
      return res.status(400).send({
        status_code: 2,
        message: "Mobile Number is Already Registered.",
        result: [],
      });
    if (
      req.body.mobileNumber === undefined ||
      req.body.mobileNumber === "" ||
      req.body.mobileNumber === null
    )
      return req.send({
        status_code: 2,
        message: "mobile number required",
        result: [],
      });
    const role = await xx_cf_role.findOne({ role: "user" }).select({ _id: 1 });

    if (req.file == undefined) {
      user = new xx_cf_user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryCode: req.body.countryCode,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        gender: req.body.gender,
        dob: req.body.dob,
        roleID: role._id,
        status: "active",
        password: req.body.password,
        email: req.body.email,
      });
    } else {
      user = new xx_cf_user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryCode: req.body.countryCode,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        gender: req.body.gender,
        dob: req.body.dob,
        roleID: role._id,
        status: "active",
        password: req.body.password,
        email: req.body.email,
        image: req.file.path,
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    let response = {
      status_code: 1,
      message: "Succesfully Signed Up",
      result: [
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          countryCode: user.countryCode,
          mobileNumber: user.mobileNumber,
          address: user.address,
          role: role.role,
          roleID: user.roleID,
          status: user.status,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
          created: user.created,
          updated: user.updated,
        },
      ],
    };
    res
      .header({
        "x-auth-token": token,
        "Access-Control-Expose-Headers": ["Content-Encoding", "x-auth-token"],
      })
      .status(201)
      .send(response);
  } catch (err) {
    res.status(2).send({ status_code: 2, message: err.message, result: [] });
    console.log("Signup Post", err.message);
  }
});

router.patch(
  "/profileUpdate/:id",
  [auth, upload.single("image")],
  async (req, res) => {
    try {
      if (req.file == undefined) {
        const user = await xx_cf_user.findByIdAndUpdate(
          req.params.id,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNumber: req.body.mobileNumber,
            address: req.body.address,
            gender: req.body.gender,
            dob: req.body.dob,
            email: req.body.email,
            updated: new Date(),
          },
          { new: true }
        );

        if (!user)
          return res.status(404).send({
            status_code: 4,
            message: "The user with the given ID was not found.",
            result: [],
          });

        let response = {
          status_code: 1,
          message: "User Profile Succesfully Updated",
          result: [
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              mobileNumber: user.mobileNumber,
              address: user.address,
              roleID: user.roleID,
              status: user.status,
              image: user.image,
              dob: user.dob,
              gender: user.gender,
              created: user.created,
              updated: user.updated,
            },
          ],
        };

        res.status(200).send(response);
      } else {
        const user = await xx_cf_user.findByIdAndUpdate(
          req.params.id,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNumber: req.body.mobileNumber,
            address: req.body.address,
            gender: req.body.gender,
            dob: req.body.dob,
            email: req.body.email,
            image: req.file.path,
            updated: new Date(),
          },
          { new: true }
        );

        if (!user)
          return res.status(404).send({
            status_code: 4,
            message: "The user with the given ID was not found.",
            result: [],
          });

        let response = {
          status_code: 1,
          message: "User Profile Succesfully Updated",
          result: [
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              mobileNumber: user.mobileNumber,
              address: user.address,
              roleID: user.roleID,
              status: user.status,
              image: user.image,
              dob: user.dob,
              gender: user.gender,
              created: user.created,
              updated: user.updated,
            },
          ],
        };

        res.status(200).send(response);
      }
    } catch (err) {
      res
        .status(400)
        .send({ status_code: 2, message: err.message, result: [] });
      console.log("user Profile update", err.message);
    }
  }
);

router.post("/listAll", auth, async (req, res) => {
  try {
    let searchValue = /.*.*/;
    let sortOrder = 1;
    let pageNumber = 1;
    let pageSize = 10;
    let sortAttribute;

    if (
      req.body.searchValue != null &&
      req.body.searchValue != "" &&
      req.body.searchValue != undefined
    ) {
      searchValue = req.body.searchValue;
      searchValue = new RegExp(".*" + searchValue + ".*");
    }
    if (
      req.body.sortOrder != null &&
      req.body.sortOrder != "" &&
      req.body.sortOrder != undefined
    ) {
      sortOrder = parseInt(req.body.sortOrder);
    }
    if (
      req.body.pageNumber != null &&
      req.body.pageNumber != "" &&
      req.body.pageNumber != undefined
    ) {
      pageNumber = parseInt(req.body.pageNumber);
    }
    if (
      req.body.pageSize != null &&
      req.body.pageSize != "" &&
      req.body.pageSize != undefined
    ) {
      pageSize = parseInt(req.body.pageSize);
    }

    sortAttribute = { created: sortOrder };

    if (req.body.sortField == "firstName") {
      sortAttribute = { firstName: sortOrder };
    }
    if (req.body.sortField == "lastName") {
      sortAttribute = { lastName: sortOrder };
    }
    if (req.body.sortField == "address") {
      sortAttribute = { address: sortOrder };
    }
    if (req.body.sortField == "dob") {
      sortAttribute = { dob: sortOrder };
    }
    if (req.body.sortField == "gender") {
      sortAttribute = { gender: sortOrder };
    }
    if (req.body.sortField == "status") {
      sortAttribute = { status: sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }

    count = await xx_cf_user.find().count();

    const user = await xx_cf_user
      .aggregate([
        {
          $lookup: {
            from: "xx_cf_roles",
            localField: "roleID",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $unwind: "$role",
        },
        {
          $match: {
            $or: [
              { firstName: { $regex: searchValue, $options: "i" } },
              { lastName: { $regex: searchValue, $options: "i" } },
              { mobileNumber: { $regex: searchValue, $options: "i" } },
              { email: { $regex: searchValue, $options: "i" } },
              { gender: { $regex: searchValue, $options: "i" } },
              { status: { $regex: searchValue, $options: "i" } },
              { address: { $regex: searchValue, $options: "i" } },
            ],
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .collation({ locale: "en" })
      .sort(sortAttribute);

    if (!user)
      return res.status(404).send({
        status_code: 4,
        message: "No User Found.",
        result: [],
      });
    if (user.length == 0)
      return res.status(404).send({
        status_code: 4,
        message: "No User Found.",
        result: [],
      });
    let response = {
      status_code: 1,
      message: "List Successfully Fetched",
      totalCount: count,
      result: user,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("user Get all", err.message);
  }
});

router.get("/userDetails/:id", auth, async (req, res) => {
  try {
    const user = await xx_cf_user.findById(req.params.id).select({
      _id: 1,
      firstName: 1,
      lastName: 1,
      countryCode: 1,
      mobileNumber: 1,
      address: 1,
      gender: 1,
      dob: 1,
      email: 1,
      image: 1,
      roleID: 1,
      status: 1,
      updated: 1,
      created: 1,
    });
    if (!user)
      return res.status(404).send({
        status_code: 4,
        message: "The user with the given ID was not found.",
        result: [],
      });
    let response = {
      status_code: 1,
      message: "User Details Successfully Fetched",
      result: [
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          address: user.address,
          roleID: user.roleID,
          status: user.status,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
          created: user.created,
          updated: user.updated,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("user Get details by id", err.message);
  }
});

router.patch("/changePassword/:id", async (req, res) => {
  try {
    let password = req.body.newPassword;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const id = await xx_cf_user.findById(req.params.id);
    if (!id)
      return res.status(400).send({
        status_code: 2,
        message: "The id Provided is Invalid",
        result: [],
      });

    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      id.password
    );
    if (!validPassword)
      return res.status(400).send({
        status_code: 3,
        message: "Invalid Old Password.",
        result: [],
      });
    const user = await xx_cf_user.findByIdAndUpdate(
      req.params.id,
      {
        password: password,
        updated: new Date(),
      },
      { new: true }
    );

    if (!user)
      return res.status(404).send({
        status_code: 2,
        message: "The id Provided is Invalid",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "Password Changed Successfully",
      result: [
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          countryCode: user.countryCode,
          mobileNumber: user.mobileNumber,
          address: user.address,
          roleID: user.roleID,
          status: user.status,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
          created: user.created,
          updated: user.updated,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("change password", err.message);
  }
});

router.patch("/changeStatus/:id", auth, async (req, res) => {
  try {
    if (
      req.body.status == null ||
      req.body.status == "" ||
      req.body.status == undefined
    ) {
      return res.status(404).send({
        status_code: 2,
        message: "Please Provide a Valid Argument in Body",
        result: [],
      });
    }
    let status = req.body.status;
    status = status.toLowerCase();
    const user = await xx_cf_user.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
        updated: new Date(),
      },
      { new: true }
    );

    if (!user)
      return res.status(404).send({
        status_code: 2,
        message: "The id Provided is Invalid",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "Status Changed Successfully",
      result: [
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          countryCode: user.countryCode,
          mobileNumber: user.mobileNumber,
          address: user.address,
          roleID: user.roleID,
          status: user.status,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
          created: user.created,
          updated: user.updated,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("change status", err.message);
  }
});

module.exports = router;
