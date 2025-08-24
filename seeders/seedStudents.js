const { faker } = require('@faker-js/faker');
const Student = require('../models/Student');
const Department = require('../models/Department'); 
const AppError = require('../utils/appError');

// ✅ Use the same roll number generator as in controller
async function generateRollNumber(departmentId) {
  const department = await Department.findById(departmentId);
  if (!department) throw new AppError("Invalid department ID", 400);

  const year = new Date().getFullYear();
  const count = await Student.countDocuments({
    department: departmentId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)
    }
  });

  const nextNumber = String(count + 1).padStart(3, "0");
  return `${department.code}-${year}-${nextNumber}`;
}

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

  const rollNumber = await generateRollNumber(randomDept._id);

  const student = await Student.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    rollNumber,
    email: `${rollNumber.toLowerCase()}@example.com`, // unique email
    admissionDate: faker.date.between({ from: '2022-01-01', to: new Date() }),
    department: randomDept._id,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    mobileNumber: faker.phone.number("03#########"),
    parentName: faker.person.fullName(),
    parentNumber: faker.phone.number("03#########"),
    address: faker.location.streetAddress(),
    image: "no-photo.jpg",
    status: faker.helpers.arrayElement(["active", "graduated", "suspended"]),
  });

  console.log(`👩‍🎓 Created student: ${student.rollNumber}`);
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
