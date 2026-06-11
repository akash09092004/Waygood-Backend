require("dotenv").config();

const connectDatabase = require("../config/database");
const Application = require("../models/Application");
const Program = require("../models/Program");
const Student = require("../models/Student");
const University = require("../models/University");
const seedData = require("../data/seedData");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await connectDatabase();

    console.log("Cleaning old data...");

    await Promise.all([
      Application.deleteMany({}),
      Program.deleteMany({}),
      Student.deleteMany({}),
      University.deleteMany({}),
    ]);

    console.log("Inserting Universities...");

    const universities = await University.insertMany(
      seedData.universities
    );

    const universityByName = {};

    universities.forEach((university) => {
      universityByName[university.name] = university;
    });

    console.log("Inserting Programs...");

    const programs = await Program.insertMany(
      seedData.programs.map((program) => ({
        ...program,
        university: universityByName[program.universityName]._id,
      }))
    );

    const programByTitle = {};

    programs.forEach((program) => {
      programByTitle[program.title] = program;
    });

    console.log("Inserting Students...");

    const students = await Student.create(seedData.students);

    const studentByEmail = {};

    students.forEach((student) => {
      studentByEmail[student.email] = student;
    });

    console.log("Inserting Applications...");

    const applications = seedData.applications.map((application) => {
      const student = studentByEmail[application.studentEmail];
      const program = programByTitle[application.programTitle];
      const university = universityByName[program.universityName];

      return {
        student: student._id,
        program: program._id,
        university: university._id,
        destinationCountry: program.country,
        intake: application.intake,
        status: application.status,
        timeline: application.timeline,
      };
    });

    await Application.insertMany(applications);

    console.log("================================");
    console.log("Seed completed successfully!");
    console.log(`Universities: ${universities.length}`);
    console.log(`Programs: ${programs.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Applications: ${applications.length}`);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  }
}

seed(); 