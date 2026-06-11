const mongoose = require("mongoose");
const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const recommendations = await Program.aggregate([
    {
      $match: {
        country: {
          $in: student.targetCountries || [],
        },
      },
    },

    {
      $addFields: {
        matchScore: {
          $add: [
            {
              $cond: [
                {
                  $in: ["$country", student.targetCountries || []],
                },
                35,
                0,
              ],
            },

            {
              $cond: [
                {
                  $lte: [
                    "$tuitionFeeUsd",
                    student.maxBudgetUsd || 0,
                  ],
                },
                20,
                0,
              ],
            },

            {
              $cond: [
                {
                  $in: [
                    student.preferredIntake || "",
                    "$intakes",
                  ],
                },
                10,
                0,
              ],
            },

            {
              $cond: [
                {
                  $lte: [
                    "$minimumIelts",
                    student.englishTest?.score || 0,
                  ],
                },
                5,
                0,
              ],
            },

            {
              $cond: [
                {
                  $in: [
                    "$field",
                    student.interestedFields || [],
                  ],
                },
                30,
                0,
              ],
            },
          ],
        },
      },
    },

    {
      $sort: {
        matchScore: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $project: {
        title: 1,
        field: 1,
        degreeLevel: 1,
        country: 1,
        city: 1,
        tuitionFeeUsd: 1,
        universityName: 1,
        intakes: 1,
        minimumIelts: 1,
        scholarshipAvailable: 1,
        stem: 1,
        matchScore: 1,
      },
    },
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries: student.targetCountries,
        interestedFields: student.interestedFields,
      },
      recommendations,
    },
    meta: {
      implementationStatus: "mongodb-aggregation-completed",
    },
  };
}

module.exports = {
  buildProgramRecommendations,
};