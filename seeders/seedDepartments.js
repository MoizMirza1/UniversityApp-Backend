const Department = require("../models/Department");

async function seedDepartments() {
  try {
    // Remove old departments
    await Department.deleteMany();
    console.log("🗑️ Deleted existing departments");

    const departments = [
      { 
        name: "Computer Science", 
        code: "CS", 
        headOfDepartment: "Dr. Ali Khan", 
        maxStudents: 100,
        departmentDetails: "Focuses on programming, algorithms, and computer systems."
      },
      { 
        name: "Software Engineering", 
        code: "SE", 
        headOfDepartment: "Dr. Sara Ahmed", 
        maxStudents: 100,
        departmentDetails: "Covers software development lifecycle, methodologies, and project management."
      },
      { 
        name: "Artificial Intelligence", 
        code: "AI", 
        headOfDepartment: "Dr. Omar Raza", 
        maxStudents: 100,
        departmentDetails: "Specializes in AI, ML, NLP, and robotics."
      },
      { 
        name: "Cyber Security", 
        code: "CY", 
        headOfDepartment: "Dr. Hina Malik", 
        maxStudents: 100,
        departmentDetails: "Focus on network security, cryptography, and ethical hacking."
      },
      { 
        name: "Data Science", 
        code: "DS", 
        headOfDepartment: "Dr. Imran Qureshi", 
        maxStudents: 100,
        departmentDetails: "Focuses on data analysis, statistics, and visualization."
      },
      { 
        name: "Information Technology", 
        code: "IT", 
        headOfDepartment: "Dr. Nadia Khan", 
        maxStudents: 100,
        departmentDetails: "Covers IT infrastructure, networking, and systems management."
      },
    ];

    const result = await Department.insertMany(departments);
    console.log(`🏫 Seeded ${result.length} departments`);
    return result;
  } catch (err) {
    console.error("❌ Department seeding error:", err.message);
    throw err;
  }
}

module.exports = seedDepartments;
