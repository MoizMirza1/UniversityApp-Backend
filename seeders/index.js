const mongoose = require('mongoose');
require('dotenv').config();

const seedUsers = require('./seedUsers');
const seedCourses = require('./seedCourses');
const seedStudents = require('./seedStudents');
const seedDepartments = require('./seedDepartments'); 


const runSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await seedUsers();
    await seedCourses();
    await seedDepartments(); 
    await seedStudents();

    console.log('🎯 All data seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runSeeders();
