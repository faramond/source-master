const { xx_cf_company } = require("../Models/xx_cf_company");
const { xx_cf_project } = require("../Models/xx_cf_project");
const { xx_cf_currency } = require("../Models/xx_cf_currency");
const { xx_cf_representative } = require("../Models/xx_cf_representative");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../Middleware/auth");
const projectDoc = require("../storage/projectDoc");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var docUpload = projectDoc.fields([
  { name: "businessPlan", maxCount: 1 },
  { name: "presentation", maxCount: 1 },
  { name: "chamberOfCommerceRegistration", maxCount: 1 },
  { name: "project_image", maxCount: 1 },
]);

/**
 * @swagger
 * /api/v1/login:
 *  post:
 *    description: This API for authenticating users in our system
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: userCerdentials
 *      schema:
 *        $ref: '#/definitions/userCerdentials'
 *    responses:
 *        200:
 *            description: It's ok and user logged successfully
 *        400:
 *            description: It's bad request
 *        500:
 *            description: It's internal server error
 * definitions:
 *    userCerdentials:
 *        type: object
 *        required:
 *        - username
 *        - password
 *        properties:
 *            username:
 *                type: string
 *                example: ahmed123
 *            password:
 *                type: string
 *                example: admin
 *
 *
 */

router.post("/listProject", [auth, docUpload], async (req, res) => {
  try {
    let companyID;
    let representativeID;
    let project;

    if (
      req.body.companyID != null &&
      req.body.companyID != "" &&
      req.body.companyID != undefined
    ) {
      let check = await xx_cf_company.findOne({ _id: req.body.companyID });
      if (!check)
        return res
          .status(400)
          .send({ status_code: 3, message: "Invalid Company ID", result: [] });
      companyID = req.body.companyID;
    } else {
      company = new xx_cf_company({
        companyName: req.body.companyName,
        legalEntityType: req.body.legalEntityType,
        VATNumber: req.body.VATNumber,
        investmentSector: req.body.investmentSector,
        website: req.body.website,
        userID: req.body.userID,
      });
      await company.save();
      companyID = company._id;
    }

    if (
      req.body.representativeID != null &&
      req.body.representativeID != "" &&
      req.body.representativeID != undefined
    ) {
      let check = await xx_cf_representative.findOne({
        _id: req.body.representativeID,
      });
      if (!check)
        return res.status(400).send({
          status_code: 3,
          message: "Invalid Representative ID",
          result: [],
        });
      representativeID = req.body.representativeID;
    } else {
      representative = new xx_cf_representative({
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        email: req.body.email,
        countryCode: req.body.countryCode,
        mobileNumber: req.body.mobileNumber,
        companyID: companyID,
      });
      await representative.save();
      representativeID = representative._id;
    }

    let checkCurrency = await xx_cf_currency.findOne({
      _id: req.body.currencyID,
    });
    if (!checkCurrency)
      return res
        .status(400)
        .send({ status_code: 3, message: "Invalid Currency ID", result: [] });

    let count = await xx_cf_project.count();
    let temp = 1000 + count;
    let projectNumber = "CF-" + temp;

    if (Object.keys(req.files).length === 0) {
      project = new xx_cf_project({
        projectName: req.body.projectName,
        projectLocation: req.body.projectLocation,
        description: req.body.description,
        whyToInvest: req.body.whyToInvest,
        maxFundTarget: req.body.maxFundTarget,
        minFundTarget: req.body.minFundTarget,
        projectNumber: projectNumber,
        currencyID: req.body.currencyID,
        timePeriod: {
          years: req.body.years,
          months: req.body.months,
          days: req.body.days,
        },
        status: "pending",
        project_video_url: req.body.project_video_url,
        companyID: companyID,
        representativeID: representativeID,
      });
    } else if (req.files.project_image) {
      project = new xx_cf_project({
        projectName: req.body.projectName,
        projectLocation: req.body.projectLocation,
        description: req.body.description,
        whyToInvest: req.body.whyToInvest,
        maxFundTarget: req.body.maxFundTarget,
        minFundTarget: req.body.minFundTarget,
        projectNumber: projectNumber,
        currencyID: req.body.currencyID,
        timePeriod: {
          years: req.body.years,
          months: req.body.months,
          days: req.body.days,
        },
        status: "pending",
        project_video_url: req.body.project_video_url,
        project_image: req.files.project_image[0].path,
        businessPlan: req.files.businessPlan[0].path,
        presentation: req.files.presentation[0].path,
        chamberOfCommerceRegistration:
          req.files.chamberOfCommerceRegistration[0].path,
        companyID: companyID,
        representativeID: representativeID,
      });
    } else {
      project = new xx_cf_project({
        projectName: req.body.projectName,
        projectLocation: req.body.projectLocation,
        description: req.body.description,
        whyToInvest: req.body.whyToInvest,
        maxFundTarget: req.body.maxFundTarget,
        minFundTarget: req.body.minFundTarget,
        projectNumber: projectNumber,
        currencyID: req.body.currencyID,
        timePeriod: {
          years: req.body.years,
          months: req.body.months,
          days: req.body.days,
        },
        status: "pending",
        project_video_url: req.body.project_video_url,
        businessPlan: req.files.businessPlan[0].path,
        presentation: req.files.presentation[0].path,
        chamberOfCommerceRegistration:
          req.files.chamberOfCommerceRegistration[0].path,
        companyID: companyID,
        representativeID: representativeID,
      });
    }
    await project.save();

    let response = {
      status_code: 1,
      message: "Project Listed Successfully",
      result: [
        {
          _id: project._id,
          projectName: project.projectName,
          projectLocation: project.projectLocation,
          description: project.description,
          maxFundTarget: project.maxFundTarget,
          minFundTarget: project.minFundTarget,
          timePeriod: project.timePeriod,
          currencyID: project.currencyID,
          projectNumber: project.projectNumber,
          whyToInvest: project.whyToInvest,
          project_video_url: project.project_video_url,
          project_image: project.project_image,
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration: project.chamberOfCommerceRegistration,
          status: project.status,
          companyID: project.companyID,
          representativeID: project.representativeID,
          approvedDate: project.approvedDate,
          completedDate: project.completedDate,
          rejectedDate: project.rejectedDate,
          created: project.created,
          updated: project.updated,
        },
      ],
    };

    res.send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("list a project", err.message);
  }
});

router.patch("/updateProject/:id", [auth, docUpload], async (req, res) => {
  try {
    let companyID;
    let representativeID;

    let data = await xx_cf_project.findById(req.params.id).select({
      project_image: 1,
      presentation: 1,
      businessPlan: 1,
      chamberOfCommerceRegistration: 1,
    });

    let project_image = data.project_image;
    let presentation = data.presentation;
    let businessPlan = data.businessPlan;
    let chamberOfCommerceRegistration = data.chamberOfCommerceRegistration;

    if (req.files.project_image) {
      project_image = req.files.project_image[0].path;
    }
    if (req.files.presentation) {
      presentation = req.files.presentation[0].path;
    }
    if (req.files.businessPlan) {
      businessPlan = req.files.businessPlan[0].path;
    }
    if (req.files.chamberOfCommerceRegistration) {
      chamberOfCommerceRegistration =
        req.files.chamberOfCommerceRegistration[0].path;
    }

    if (
      req.body.companyID != null &&
      req.body.companyID != "" &&
      req.body.companyID != undefined
    ) {
      let check = await xx_cf_company.findOne({ _id: req.body.companyID });
      if (!check)
        return res
          .status(400)
          .send({ status_code: 3, message: "Invalid Company ID", result: [] });
      companyID = req.body.companyID;
    } else {
      company = new xx_cf_company({
        companyName: req.body.companyName,
        legalEntityType: req.body.legalEntityType,
        VATNumber: req.body.VATNumber,
        investmentSector: req.body.investmentSector,
        website: req.body.website,
        userID: req.body.userID,
      });
      await company.save();
      companyID = company._id;
    }

    if (
      req.body.representativeID != null &&
      req.body.representativeID != "" &&
      req.body.representativeID != undefined
    ) {
      let check = await xx_cf_representative.findOne({
        _id: req.body.representativeID,
      });
      if (!check)
        return res.status(400).send({
          status_code: 3,
          message: "Invalid Representative ID",
          result: [],
        });
      representativeID = req.body.representativeID;
    } else {
      representative = new xx_cf_representative({
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        email: req.body.email,
        countryCode: req.body.countryCode,
        mobileNumber: req.body.mobileNumber,
        companyID: companyID,
      });
      await representative.save();
      representativeID = representative._id;
    }

    let checkCurrency = await xx_cf_currency.findOne({
      _id: req.body.currencyID,
    });
    if (!checkCurrency)
      return res
        .status(400)
        .send({ status_code: 3, message: "Invalid Currency ID", result: [] });

    const project = await xx_cf_project.findByIdAndUpdate(
      req.params.id,
      {
        projectName: req.body.projectName,
        projectLocation: req.body.projectLocation,
        description: req.body.description,
        whyToInvest: req.body.whyToInvest,
        maxFundTarget: req.body.maxFundTarget,
        minFundTarget: req.body.minFundTarget,
        currencyID: req.body.currencyID,
        timePeriod: {
          years: req.body.years,
          months: req.body.months,
          days: req.body.days,
        },
        status: "pending",
        project_video_url: req.body.project_video_url,
        project_image: project_image,
        businessPlan: businessPlan,
        presentation: presentation,
        chamberOfCommerceRegistration: chamberOfCommerceRegistration,
        companyID: companyID,
        representativeID: representativeID,
      },
      { new: true }
    );

    let response = {
      status_code: 1,
      message: "Project Updated Successfully",
      result: [
        {
          _id: project._id,
          projectName: project.projectName,
          projectLocation: project.projectLocation,
          description: project.description,
          maxFundTarget: project.maxFundTarget,
          minFundTarget: project.minFundTarget,
          timePeriod: project.timePeriod,
          currencyID: project.currencyID,
          projectNumber: project.projectNumber,
          whyToInvest: project.whyToInvest,
          project_video_url: project.project_video_url,
          project_image: project.project_image,
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration: project.chamberOfCommerceRegistration,
          status: project.status,
          companyID: project.companyID,
          representativeID: project.representativeID,
          approvedDate: project.approvedDate,
          completedDate: project.completedDate,
          rejectedDate: project.rejectedDate,
          created: project.created,
          updated: project.updated,
        },
      ],
    };

    res.send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("update project", err.message);
  }
});

/*router.post("/listProject", docUpload, async (req, res) => {
  try {
    project = new xx_cf_project({
      projectName: req.body.projectName,
      projectLocation: req.body.projectLocation,
      maxFundTarget: req.body.maxFundTarget,
      minFundTarget: req.body.minFundTarget,
      timePeriod: req.body.timePeriod,
      businessPlan: req.files.businessPlan[0].path,
      presentation: req.files.presentation[0].path,
      chamberOfCommerceRegistration:
        req.files.chamberOfCommerceRegistration[0].path,
      status: "pending",
      user: req.body.userID,
      company: {
        companyName: req.body.companyName,
        legalEntityType: req.body.legalEntityType,
        VATNumber: req.body.VATNumber,
        investmentSector: req.body.investmentSector,
        website: req.body.website,
      },
      representative: {
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
      },
    });
    await project.save();

    let response = {
      status_code: 1,
      message: "Project Listed Successfully",
      result: [
        {
          _id: project._id,
          projectName: project.projectName,
          projectLocation: project.projectLocation,
          maxFundTarget: project.maxFundTarget,
          minFundTarget: project.minFundTarget,
          timePeriod: project.timePeriod,
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration:
            project.chamberOfCommerceRegistration,
          status: project.status,
          user: project.user,
          company: project.company,
          representative: project.representative,
          created: project.created,
          updated: project.updated,
        },
      ],
    };

    res.send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("list a project", err.message);
  }
});*/

router.get("/projectDetails/:id", async (req, res) => {
  try {
    const project = await xx_cf_project.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "xx_cf_companies",
          localField: "companyID",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $lookup: {
          from: "xx_cf_representatives",
          localField: "representativeID",
          foreignField: "_id",
          as: "representative",
        },
      },
      {
        $unwind: "$representative",
      },
      {
        $lookup: {
          from: "xx_cf_currencies",
          localField: "currencyID",
          foreignField: "_id",
          as: "currency",
        },
      },
      {
        $unwind: "$currency",
      },
    ]);
    if (!project)
      return res.status(404).send({
        status_code: 4,
        message: "Invalid Project ID.",
        result: [],
      });
    if (project.length == 0)
      return res.status(404).send({
        status_code: 4,
        message: "Invalid Project ID.",
        result: [],
      });
    let response = {
      status_code: 1,
      message: "Details of Projects Successfully Fetched",
      result: project,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("details projects fetched", err.message);
  }
});

router.post("/approvedProjects", async (req, res) => {
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

    if (req.body.sortField == "projectName") {
      sortAttribute = { projectName: sortOrder };
    }
    if (req.body.sortField == "projectLocation") {
      sortAttribute = { projectLocation: sortOrder };
    }
    if (req.body.sortField == "maxFundTarget") {
      sortAttribute = { maxFundTarget: sortOrder };
    }
    if (req.body.sortField == "minFundTarget") {
      sortAttribute = { minFundTarget: sortOrder };
    }
    if (req.body.sortField == "timePeriod") {
      sortAttribute = { timePeriod: sortOrder };
    }
    if (req.body.sortField == "companyName") {
      sortAttribute = { "company.companyName": sortOrder };
    }
    if (req.body.sortField == "investmentSector") {
      sortAttribute = { "company.investmentSector": sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "firstName") {
      sortAttribute = { "representative.firstName": sortOrder };
    }
    if (req.body.sortField == "lastName") {
      sortAttribute = { "representative.lastName": sortOrder };
    }
    if (req.body.sortField == "email") {
      sortAttribute = { "representative.email": sortOrder };
    }
    if (req.body.sortField == "mobileNumber") {
      sortAttribute = { "representative.mobileNumber": sortOrder };
    }
    if (req.body.sortField == "projectNumber") {
      sortAttribute = { projectNumber: sortOrder };
    }

    let count = await xx_cf_project.find({ status: "approved" }).count();

    const project = await xx_cf_project
      .aggregate([
        {
          $lookup: {
            from: "xx_cf_companies",
            localField: "companyID",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $lookup: {
            from: "xx_cf_representatives",
            localField: "representativeID",
            foreignField: "_id",
            as: "representative",
          },
        },
        {
          $unwind: "$representative",
        },
        {
          $lookup: {
            from: "xx_cf_currencies",
            localField: "currencyID",
            foreignField: "_id",
            as: "currency",
          },
        },
        {
          $unwind: "$currency",
        },
        {
          $match: {
            status: "approved",
            $or: [
              { projectName: { $regex: searchValue, $options: "i" } },
              { projectLocation: { $regex: searchValue, $options: "i" } },
              { pageNumber: { $regex: searchValue, $options: "i" } },
              { status: { $regex: searchValue, $options: "i" } },
              { created: { $regex: searchValue, $options: "i" } },
              {
                "company.companyName": { $regex: searchValue, $options: "i" },
              },
              {
                "company.investmentSector": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.firstName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.lastName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.email": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.mobileNumber": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
            ],
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .collation({ locale: "en" })
      .sort(sortAttribute);
    if (!project)
      return res.status(404).send({
        status_code: 4,
        message: "There is no Approved Projects Available.",
        result: [],
      });
    if (project.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "There is no Approved Projects Available.",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "List of Approved Projects Successfully Fetched",
      totalCount: count,
      result: project,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("approved projects fetched", err.message);
  }
});

/**
 * @swagger
 * /project/pendingProjects:
 *    post:
 *      description: This should return all pending projects
 */

router.post("/pendingProjects", auth, async (req, res) => {
  try {
    let searchValue = /.*.*/;
    let sortOrder = 1;
    let pageNumber = 1;
    let pageSize = 10;

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

    if (req.body.sortField == "projectName") {
      sortAttribute = { projectName: sortOrder };
    }
    if (req.body.sortField == "projectLocation") {
      sortAttribute = { projectLocation: sortOrder };
    }
    if (req.body.sortField == "maxFundTarget") {
      sortAttribute = { maxFundTarget: sortOrder };
    }
    if (req.body.sortField == "minFundTarget") {
      sortAttribute = { minFundTarget: sortOrder };
    }
    if (req.body.sortField == "timePeriod") {
      sortAttribute = { timePeriod: sortOrder };
    }
    if (req.body.sortField == "companyName") {
      sortAttribute = { "company.companyName": sortOrder };
    }
    if (req.body.sortField == "investmentSector") {
      sortAttribute = { "company.investmentSector": sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "firstName") {
      sortAttribute = { "representative.firstName": sortOrder };
    }
    if (req.body.sortField == "lastName") {
      sortAttribute = { "representative.lastName": sortOrder };
    }
    if (req.body.sortField == "email") {
      sortAttribute = { "representative.email": sortOrder };
    }
    if (req.body.sortField == "mobileNumber") {
      sortAttribute = { "representative.mobileNumber": sortOrder };
    }
    if (req.body.sortField == "projectNumber") {
      sortAttribute = { projectNumber: sortOrder };
    }

    count = await xx_cf_project.find({ status: "pending" }).count();

    project = await xx_cf_project
      .aggregate([
        {
          $lookup: {
            from: "xx_cf_companies",
            localField: "companyID",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $lookup: {
            from: "xx_cf_representatives",
            localField: "representativeID",
            foreignField: "_id",
            as: "representative",
          },
        },
        {
          $unwind: "$representative",
        },
        {
          $lookup: {
            from: "xx_cf_currencies",
            localField: "currencyID",
            foreignField: "_id",
            as: "currency",
          },
        },
        {
          $unwind: "$currency",
        },
        {
          $match: {
            status: "pending",
            $or: [
              { projectName: { $regex: searchValue, $options: "i" } },
              { projectLocation: { $regex: searchValue, $options: "i" } },
              { timePeriod: { $regex: searchValue, $options: "i" } },
              { status: { $regex: searchValue, $options: "i" } },
              { created: { $regex: searchValue, $options: "i" } },
              { projectNumber: { $regex: searchValue, $options: "i" } },
              { "company.companyName": { $regex: searchValue, $options: "i" } },
              {
                "company.investmentSector": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.firstName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.lastName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.email": { $regex: searchValue, $options: "i" },
              },
              {
                "representative.mobileNumber": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
            ],
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .collation({ locale: "en" })
      .sort(sortAttribute);
    if (!project)
      return res.status(404).send({
        status_code: 4,
        message: "There is no pending Projects Available.",
        result: [],
      });
    if (project.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "There is no pending Projects Available.",
        result: [],
      });
    let response = {
      status_code: 1,
      message: "List of Pending Projects Successfully Fetched",
      totalCount: count,
      result: project,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("pending projects fetched", err.message);
  }
});

router.post("/rejectedProjects", auth, async (req, res) => {
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

    if (req.body.sortField == "projectName") {
      sortAttribute = { projectName: sortOrder };
    }
    if (req.body.sortField == "projectLocation") {
      sortAttribute = { projectLocation: sortOrder };
    }
    if (req.body.sortField == "maxFundTarget") {
      sortAttribute = { maxFundTarget: sortOrder };
    }
    if (req.body.sortField == "minFundTarget") {
      sortAttribute = { minFundTarget: sortOrder };
    }
    if (req.body.sortField == "timePeriod") {
      sortAttribute = { timePeriod: sortOrder };
    }
    if (req.body.sortField == "companyName") {
      sortAttribute = { "company.companyName": sortOrder };
    }
    if (req.body.sortField == "investmentSector") {
      sortAttribute = { "company.investmentSector": sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "firstName") {
      sortAttribute = { "representative.firstName": sortOrder };
    }
    if (req.body.sortField == "lastName") {
      sortAttribute = { "representative.lastName": sortOrder };
    }
    if (req.body.sortField == "email") {
      sortAttribute = { "representative.email": sortOrder };
    }
    if (req.body.sortField == "mobileNumber") {
      sortAttribute = { "representative.mobileNumber": sortOrder };
    }
    if (req.body.sortField == "projectNumber") {
      sortAttribute = { projectNumber: sortOrder };
    }

    let count = await xx_cf_project.find({ status: "rejected" }).count();

    const project = await xx_cf_project
      .aggregate([
        {
          $lookup: {
            from: "xx_cf_companies",
            localField: "companyID",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $lookup: {
            from: "xx_cf_representatives",
            localField: "representativeID",
            foreignField: "_id",
            as: "representative",
          },
        },
        {
          $unwind: "$representative",
        },
        {
          $lookup: {
            from: "xx_cf_currencies",
            localField: "currencyID",
            foreignField: "_id",
            as: "currency",
          },
        },
        {
          $unwind: "$currency",
        },
        {
          $match: {
            status: "rejected",
            $or: [
              { projectName: { $regex: searchValue, $options: "i" } },
              { projectLocation: { $regex: searchValue, $options: "i" } },
              { timePeriod: { $regex: searchValue, $options: "i" } },
              { status: { $regex: searchValue, $options: "i" } },
              { projectNumber: { $regex: searchValue, $options: "i" } },
              { created: { $regex: searchValue, $options: "i" } },
              {
                "company.companyName": { $regex: searchValue, $options: "i" },
              },
              {
                "company.investmentSector": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.firstName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.lastName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.email": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.mobileNumber": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
            ],
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .collation({ locale: "en" })
      .sort(sortAttribute);
    if (!project)
      return res.status(404).send({
        status_code: 4,
        message: "There is no Rejected Projects Available.",
        result: [],
      });
    if (project.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "There is no Rejected Projects Available.",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "List of Rejected Projects Successfully Fetched",
      totalCount: count,
      result: project,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("rejected projects fetched", err.message);
  }
});

router.post("/listByUser/:id", auth, async (req, res) => {
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

    if (req.body.sortField == "projectName") {
      sortAttribute = { projectName: sortOrder };
    }
    if (req.body.sortField == "projectLocation") {
      sortAttribute = { projectLocation: sortOrder };
    }
    if (req.body.sortField == "maxFundTarget") {
      sortAttribute = { maxFundTarget: sortOrder };
    }
    if (req.body.sortField == "minFundTarget") {
      sortAttribute = { minFundTarget: sortOrder };
    }
    if (req.body.sortField == "timePeriod") {
      sortAttribute = { timePeriod: sortOrder };
    }
    if (req.body.sortField == "companyName") {
      sortAttribute = { "company.companyName": sortOrder };
    }
    if (req.body.sortField == "investmentSector") {
      sortAttribute = { "company.investmentSector": sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "firstName") {
      sortAttribute = { "representative.firstName": sortOrder };
    }
    if (req.body.sortField == "lastName") {
      sortAttribute = { "representative.lastName": sortOrder };
    }
    if (req.body.sortField == "email") {
      sortAttribute = { "representative.email": sortOrder };
    }
    if (req.body.sortField == "mobileNumber") {
      sortAttribute = { "representative.mobileNumber": sortOrder };
    }
    if (req.body.sortField == "projectNumber") {
      sortAttribute = { projectNumber: sortOrder };
    }

    let count = await xx_cf_project.aggregate([
      {
        $lookup: {
          from: "xx_cf_companies",
          localField: "companyID",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $match: {
          "company.userID": mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    const project = await xx_cf_project
      .aggregate([
        {
          $lookup: {
            from: "xx_cf_companies",
            localField: "companyID",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $lookup: {
            from: "xx_cf_representatives",
            localField: "representativeID",
            foreignField: "_id",
            as: "representative",
          },
        },
        {
          $unwind: "$representative",
        },
        {
          $lookup: {
            from: "xx_cf_currencies",
            localField: "currencyID",
            foreignField: "_id",
            as: "currency",
          },
        },
        {
          $unwind: "$currency",
        },
        {
          $match: {
            "company.userID": mongoose.Types.ObjectId(req.params.id),
            $or: [
              { projectName: { $regex: searchValue, $options: "i" } },
              { projectLocation: { $regex: searchValue, $options: "i" } },
              { status: { $regex: searchValue, $options: "i" } },
              { created: { $regex: searchValue, $options: "i" } },
              { pageNumber: { $regex: searchValue, $options: "i" } },
              {
                "company.companyName": { $regex: searchValue, $options: "i" },
              },
              {
                "company.investmentSector": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.firstName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.lastName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.email": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              {
                "representative.mobileNumber": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
            ],
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .collation({ locale: "en" })
      .sort(sortAttribute);
    if (!project)
      return res.status(404).send({
        status_code: 4,
        message: "There is no  Projects Available for The given User.",
        result: [],
      });
    if (project.length === 0)
      return res.status(404).send({
        status_code: 4,
        message: "There is no  Projects Available for The given User.",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "List of  Projects for the given User Successfully Fetched",
      totalCount: count.length,
      result: project,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log(" projects fetched by user id", err.message);
  }
});

router.patch("/approve/:id", auth, async (req, res) => {
  try {
    const project = await xx_cf_project.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        updated: new Date(),
        approvedDate: new Date(),
      },
      { new: true }
    );

    if (!project)
      return res.status(404).send({
        status_code: 2,
        message: "The User id Provided is Invalid",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "Project Approved Successfully",
      result: [
        {
          projectName: project.projectName,
          projectLocation: project.projectLocation,
          maxFundTarget: project.maxFundTarget,
          minFundTarget: project.minFundTarget,
          timePeriod: project.timePeriod,
          currencyID: project.currencyID,
          projectNumber: project.projectNumber,
          description: project.description,
          whyToInvest: project.whyToInvest,
          project_video_url: project.project_video_url,
          project_image: project.project_image,
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration: project.chamberOfCommerceRegistration,
          status: project.status,
          companyID: project.companyID,
          representativeID: project.representativeID,
          approvedDate: project.approvedDate,
          completedDate: project.completedDate,
          rejectedDate: project.rejectedDate,
          created: project.created,
          updated: project.updated,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("approve project", err.message);
  }
});

router.patch("/reject/:id", auth, async (req, res) => {
  try {
    const project = await xx_cf_project.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        updated: new Date(),
        rejectedDate: new Date(),
      },
      { new: true }
    );

    if (!project)
      return res.status(404).send({
        status_code: 2,
        message: "The User id Provided is Invalid",
        result: [],
      });

    let response = {
      status_code: 1,
      message: "Project Rejected Successfully",
      result: [
        {
          projectName: project.projectName,
          projectLocation: project.projectLocation,
          maxFundTarget: project.maxFundTarget,
          minFundTarget: project.minFundTarget,
          timePeriod: project.timePeriod,
          currencyID: project.currencyID,
          projectNumber: project.projectNumber,
          description: project.description,
          whyToInvest: project.whyToInvest,
          project_video_url: project.project_video_url,
          project_image: project.project_image,
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration: project.chamberOfCommerceRegistration,
          status: project.status,
          companyID: project.companyID,
          representativeID: project.representativeID,
          approvedDate: project.approvedDate,
          completedDate: project.completedDate,
          rejectedDate: project.rejectedDate,
          created: project.created,
          updated: project.updated,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("reject project", err.message);
  }
});

module.exports = router;
