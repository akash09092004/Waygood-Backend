const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const config = require("../config");

const generateToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    targetCountries,
    interestedFields,
    preferredIntake,
    maxBudgetUsd,
    englishTest,
  } = req.body;

  const existingUser = await Student.findOne({ email });

  if (existingUser) {
    throw new HttpError(400, "User already exists");
  }

  const student = await Student.create({
    fullName,
    email,
    password,
    targetCountries,
    interestedFields,
    preferredIntake,
    maxBudgetUsd,
    englishTest,
    profileComplete: true,
  });

  const token = generateToken(student._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      role: student.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isMatch = await student.comparePassword(password);

  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = generateToken(student._id);

  res.json({
    success: true,
    token,
    data: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      role: student.role,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id)
    .select("-password");

  if (!student) {
    throw new HttpError(404, "User not found");
  }

  res.json({
    success: true,
    data: student,
  });
});

module.exports = {
  register,
  login,
  me,
};