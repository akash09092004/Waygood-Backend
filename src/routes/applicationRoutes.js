const express = require("express");

const {
  createApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/", listApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.patch("/:id/status", updateApplicationStatus);

module.exports = router;
