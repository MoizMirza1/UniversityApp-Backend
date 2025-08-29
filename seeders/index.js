const mongoose = require("mongoose");
require("dotenv").config();

const seedUsers = require("./seedUsers");
const seedDepartments = require("./seedDepartments");
const seedTeachers = require('./seedTeacher')
const seedStudents = require("./seedStudents");
const seedCourses = require("./seedCourses");

const runSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await seedUsers();
    await seedDepartments();
    await seedStudents();
    await seedTeachers();   
    await seedCourses();

    console.log("🎯 All data seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runSeeders();
