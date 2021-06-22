const { xx_cf_project } = require("../Models/xx_cf_project");
const { xx_cf_user } = require("../Models/xx_cf_user");
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const users = await xx_cf_user.countDocuments();
    const projects = await xx_cf_project.countDocuments();
    const pendingprojects = await xx_cf_project
      .find({ status: "pending" })
      .countDocuments();
    const approvedprojects = await xx_cf_project
      .find({ status: "approved" })
      .countDocuments();
    const rejectedprojects = await xx_cf_project
      .find({ status: "rejected" })
      .countDocuments();
    const completedprojects = await xx_cf_project
      .find({ status: "completed" })
      .countDocuments();

    let response = [
      {
        totalUsers: users,
        totalProjects: projects,
        totalPendingProjects: pendingprojects,
        totalApprovedProjects: approvedprojects,
        totalRejectedProjects: rejectedprojects,
        totalCompletedProjects: completedprojects,
      },
    ];
    res.status(200).send({
      status_code: 1,
      message: "Stats Fetched Successfully",
      result: response,
    });
  } catch (err) {
    res.status(400).send({ status_code: 4, message: err.msg, result: [] });
    console.log("stats fetched", err.message);
  }
});

module.exports = router;
