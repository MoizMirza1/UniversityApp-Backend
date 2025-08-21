const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');
const Department = require('../models/Department'); // ✅ import Department

async function seedStudents() {
  try {
    // Remove old students
    await Student.deleteMany();
    console.log("🗑️ Deleted existing students");

    // ✅ Get departments from DB
    const departments = await Department.find();
    if (departments.length === 0) {
      throw new Error("No departments found! Please seed departments first.");
    }

    const students = [];

    for (let i = 0; i < 10; i++) {
      const randomDept = faker.helpers.arrayElement(departments);

      students.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        rollNumber: `${randomDept.code}-${faker.number.int({ min: 100, max: 999 })}`, // ✅ uses department code
        email: faker.internet.email().toLowerCase(),
        admissionDate: faker.date.past({ years: 2 }),
        department: randomDept._id, // ✅ use ObjectId instead of string
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
