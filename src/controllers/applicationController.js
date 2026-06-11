const Application = require("../models/Application");
const Program = require("../models/Program");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;

  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  const { student, program, intake } = req.body;

  const existing = await Application.findOne({
    student,
    program,
    intake,
  });

  if (existing) {
    throw new HttpError(
      400,
      "Student has already applied for this program and intake"
    );
  }

  const programData = await Program.findById(program);

  if (!programData) {
    throw new HttpError(404, "Program not found");
  }

  const application = await Application.create({
    student,
    program,
    university: programData.university,
    destinationCountry: programData.country,
    intake,
    status: "submitted",
    timeline: [
      {
        status: "submitted",
        note: "Application submitted",
      },
    ],
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

const allowedTransitions = {
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["accepted", "rejected"],
  accepted: [],
  rejected: [],
};

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city");

  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  res.json({
    success: true,
    data: application,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  const allowed =
    allowedTransitions[application.status] || [];

  if (!allowed.includes(status)) {
    throw new HttpError(
      400,
      `Invalid status transition from ${application.status} to ${status}`
    );
  }

  application.status = status;

  application.timeline.push({
    status,
    note: note || `Application moved to ${status}`,
  });

  await application.save();

  res.json({
    success: true,
    data: application,
  });
});

module.exports = {
  createApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
};