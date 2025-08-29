const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');
const Department = require('../models/Department'); 

async function seedStudents() {
  try {
    // Remove old students
    await Student.deleteMany();
    console.log("🗑️ Deleted existing students");

    // ✅ Get departments
    const departments = await Department.find();
    if (departments.length === 0) {
      throw new Error("No departments found! Please seed departments first.");
    }

    // 👉 keep a map of departmentId -> count
    const counters = {};
    for (const dept of departments) {
      const count = await Student.countDocuments({ department: dept._id });
      counters[dept._id] = count; // start from existing count
    }

    const students = [];

    for (let i = 0; i < 10; i++) {
      const randomDept = faker.helpers.arrayElement(departments);
      const year = new Date().getFullYear();

      // increment local counter
      counters[randomDept._id] = (counters[randomDept._id] || 0) + 1;
      const nextNumber = String(counters[randomDept._id]).padStart(3, "0");
      const rollNumber = `${randomDept.code}-${year}-${nextNumber}`;

      const student = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        rollNumber,
        email: `${rollNumber.toLowerCase()}@example.com`,
        admissionDate: faker.date.between({ from: '2022-01-01', to: new Date() }),
        department: randomDept._id,
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        mobileNumber: faker.phone.number("03#########"),
        parentName: faker.person.fullName(),
        parentNumber: faker.phone.number("03#########"),
        address: faker.location.streetAddress(),
        image: "no-photo.jpg",
        status: faker.helpers.arrayElement(["active", "graduated", "suspended"]),
      };

      students.push(student);

      console.log(`👩‍🎓 Prepared student: ${student.rollNumber}`);
    }

    const result = await Student.insertMany(students);
    console.log(`✅ Seeded ${result.length} students`);
    return result;
  } catch (err) {
    console.error("❌ Student seeding error:", err.message);
    throw err;
  }
}

module.exports = seedStudents;
