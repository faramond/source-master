const { xx_usd_company } = require("../Models/xx_usd_company");
const { xx_usd_project } = require("../Models/xx_usd_project");
const { xx_usd_representative } = require("../Models/xx_usd_representative");
const express = require("express");
const router = express.Router();
const projectDoc = require("../storage/projectDoc");
var docUpload = projectDoc.fields([
  { name: "businessPlan", maxCount: 1 },
  { name: "presentation", maxCount: 1 },
  { name: "chamberOfCommerceRegistration", maxCount: 1 },
]);

/*router.post("/", docUpload, async (req, res) => {
  try {
    let companyID;
    let companyRepresentativeID;

    if (
      req.body.companyID != null &&
      req.body.companyID != "" &&
      req.body.companyID != undefined
    ) {
      console.log("if", req.body.companyID);
      companyID = req.body.companyID;
    } else {
      console.log("else", req.body.companyID);
      new_company = new xx_usd_company({
        companyName: req.body.companyName,
        legalEntityType: req.body.legalEntityType,
        VATNumber: req.body.VATNumber,
        investmentSector: req.body.investmentSector,
        website: req.body.website,
        user: req.body.userID,
      });
      await new_company.save();
      companyID = new_company._id;
    }

    if (
      req.body.companyRepresentativeID != null &&
      req.body.companyRepresentativeID != "" &&
      req.body.companyRepresentativeID != undefined
    ) {
      companyRepresentativeID = req.body.companyRepresentativeID;
    } else {
      new_representative = new xx_usd_representative({
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        company: companyID,
      });
      await new_representative.save();
      companyRepresentativeID = new_representative._id;
    }

    new_project = new xx_usd_project({
      projectName: req.body.projectName,
      projectLocation: req.body.projectLocation,
      maxFundTarget: req.body.maxFundTarget,
      minFundTarget: req.body.minFundTarget,
      timePeriod: req.body.timePeriod,
      businessPlan: req.files.businessPlan[0].path,
      presentation: req.files.presentation[0].path,
      chamberOfCommerceRegistration:
        req.files.chamberOfCommerceRegistration[0].path,
      company: companyID,
      representative: companyRepresentativeID,
    });
    await new_project.save();

    res.send(new_project);
  } catch (err) {
    res.send({ message: err.message });
    console.log("list a project", err.message);
  }
});*/

router.post("/listProject", docUpload, async (req, res) => {
  try {
    new_project = new xx_usd_project({
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
    await new_project.save();

    let response = {
      status_code: 1,
      message: "Project Listed Successfully",
      result: [
        {
          _id: new_project._id,
          projectName: new_project.projectName,
          projectLocation: new_project.projectLocation,
          maxFundTarget: new_project.maxFundTarget,
          minFundTarget: new_project.minFundTarget,
          timePeriod: new_project.timePeriod,
          businessPlan: new_project.businessPlan,
          presentation: new_project.presentation,
          chamberOfCommerceRegistration:
            new_project.chamberOfCommerceRegistration,
          status: new_project.status,
          user: new_project.user,
          company: new_project.company,
          representative: new_project.representative,
          created: new_project.created,
          updated: new_project.updated,
        },
      ],
    };

    res.send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("list a project", err.message);
  }
});

router.post("/approvedProjects", async (req, res) => {
  try {
    let searchValue = /.*.*/;
    let sortOrder = 1;
    let pageNumber = 1;
    let pageSize = 10;
    let sortAttribute;
    let count;

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
    if (req.body.sortField == "user") {
      sortAttribute = { user: sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "company") {
      sortAttribute = { company: sortOrder };
    }
    if (req.body.sortField == "representative") {
      sortAttribute = { representative: sortOrder };
    }

    if (
      req.query.userID != null &&
      req.query.userID != "" &&
      req.query.userID != undefined
    ) {
      count = await xx_usd_project.find({ status: "approved" }).count();

      project = await xx_usd_project
        .find({
          status: "approved",
          $or: [
            { projectName: searchValue },
            { projectLocation: searchValue },
            { timePeriod: searchValue },
            { status: searchValue },
            { "company.companyName": searchValue },
            { "representative.firstName": searchValue },
          ],
        })
        .select({
          _id: 1,
          projectName: 1,
          projectLocation: 1,
          maxFundTarget: 1,
          minFundTarget: 1,
          timePeriod: 1,
          businessPlan: 1,
          presentation: 1,
          chamberOfCommerceRegistration: 1,
          status: 1,
          user: 1,
          company: 1,
          representative: 1,
          updated: 1,
          created: 1,
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(sortAttribute);
      if (!project)
        return res.status(404).send({
          status_code: 4,
          message:
            "The user with the given ID was not found or there is no Approved Projects for the given User.",
          result: [],
        });
      if (project.length === 0)
        return res.status(404).send({
          status_code: 4,
          message:
            "The user with the given ID was not found or there is no Approved Projects for the given User.",
          result: [],
        });
    } else {
      count = await xx_usd_project
        .find({ status: "approved", user: req.params.userID })
        .count();

      project = await xx_usd_project
        .find({
          status: "approved",
          user: req.params.userID,
          $or: [
            { projectName: searchValue },
            { projectLocation: searchValue },
            { timePeriod: searchValue },
            { status: searchValue },
            { "company.companyName": searchValue },
            { "representative.firstName": searchValue },
          ],
        })
        .select({
          _id: 1,
          projectName: 1,
          projectLocation: 1,
          maxFundTarget: 1,
          minFundTarget: 1,
          timePeriod: 1,
          businessPlan: 1,
          presentation: 1,
          chamberOfCommerceRegistration: 1,
          status: 1,
          user: 1,
          company: 1,
          representative: 1,
          updated: 1,
          created: 1,
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
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
    }
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

router.post("/pendingProjects", async (req, res) => {
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
    if (req.body.sortField == "user") {
      sortAttribute = { user: sortOrder };
    }
    if (req.body.sortField == "updated") {
      sortAttribute = { updated: sortOrder };
    }
    if (req.body.sortField == "company") {
      sortAttribute = { company: sortOrder };
    }
    if (req.body.sortField == "representative") {
      sortAttribute = { representative: sortOrder };
    }

    count = await xx_usd_project.find({ status: "pending" }).count();

    project = await xx_usd_project
      .find({
        status: "pending",
        $or: [
          { projectName: searchValue },
          { projectLocation: searchValue },
          { timePeriod: searchValue },
          { status: searchValue },
          { "company.companyName": searchValue },
          { "representative.firstName": searchValue },
        ],
      })
      .select({
        _id: 1,
        projectName: 1,
        projectLocation: 1,
        maxFundTarget: 1,
        minFundTarget: 1,
        timePeriod: 1,
        businessPlan: 1,
        presentation: 1,
        chamberOfCommerceRegistration: 1,
        status: 1,
        user: 1,
        company: 1,
        representative: 1,
        updated: 1,
        created: 1,
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
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

router.patch("/approve/:id", async (req, res) => {
  try {
    const project = await xx_usd_project.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        updated: new Date(),
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
          businessPlan: project.businessPlan,
          presentation: project.presentation,
          chamberOfCommerceRegistration: project.chamberOfCommerceRegistration,
          status: project.status,
          user: project.user,
          company: project.company,
          representative: project.representative,
        },
      ],
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ status_code: 2, message: err.message, result: [] });
    console.log("approve project", err.message);
  }
});

module.exports = router;
