const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Department = require("../models/Department");
const User = require("../models/User");

async function seedTeachers() {
  try {
    // Remove old teachers
    await Teacher.deleteMany();
    console.log("🗑️ Deleted existing teachers");

    const departments = await Department.find();
    if (departments.length === 0) {
      throw new Error("No departments found! Please seed departments first.");
    }

    const teachers = [];

    for (let i = 0; i < 5; i++) {
      const randomDept = faker.helpers.arrayElement(departments);

      const plainPassword = "teacher123";
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      // Create linked User
      const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: "teacher",
        password: hashedPassword,
      });

      // Create Teacher
      const teacher = await Teacher.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: user.email,
        password: hashedPassword,
        designation: faker.helpers.arrayElement([
          "Lecturer",
          "Assistant Professor",
          "Associate Professor",
          "Professor",
        ]),
        department: randomDept._id,
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        mobileNumber: faker.phone.number("03#########"),
        dob: faker.date.past({ years: 30, refDate: new Date("2000-01-01") }),
        joiningDate: faker.date.between({
          from: "2015-01-01",
          to: new Date(),
        }),
        image: "no-photo.jpg",
        userId: user._id,
      });

      teachers.push(teacher);
      console.log(`👨‍🏫 Created teacher: ${teacher.firstName} ${teacher.lastName}`);
    }

    console.log(`👨‍🏫 Seeded ${teachers.length} teachers`);
    return teachers;
  } catch (err) {
    console.error("❌ Teacher seeding error:", err.message);
    throw err;
  }
}

module.exports = seedTeachers;
