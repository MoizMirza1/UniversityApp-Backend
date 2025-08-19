const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');

async function seedStudents() {
  try {
    // Remove old students
    await Student.deleteMany();
    console.log("🗑️ Deleted existing students");

    const students = [];

    for (let i = 0; i < 10; i++) {
      students.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        rollNumber: `CS${faker.number.int({ min: 1000, max: 9999 })}`,
        email: faker.internet.email().toLowerCase(),
        admissionDate: faker.date.past({ years: 2 }),
        department: faker.helpers.arrayElement([
          "Computer Science",
          "Software",
          "AI",
          "Cyber Security",
        ]),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        mobileNumber: faker.phone.number("+92##########"),
        parentName: faker.person.fullName(),
        parentNumber: faker.phone.number("+92##########"),
        address: faker.location.streetAddress(),
        image: "no-photo.jpg",
        status: faker.helpers.arrayElement([
          "active",
          "graduated",
          "suspended",
        ]),
      });
    }

    const result = await Student.insertMany(students);
    console.log(`👩‍🎓 Seeded ${result.length} students`);
    return result;
  } catch (err) {
    console.error("❌ Student seeding error:", err.message);
    throw err;
  }
}

module.exports = seedStudents;
