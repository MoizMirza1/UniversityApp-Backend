const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

// Generate fake users
const seedUsers = async () => {
  try {
    // Delete existing users (optional)
    await User.deleteMany({});
    console.log('Previous users deleted.');

    // Create 5 fake users
    const users = [];
    const roles = ['admin', 'student'];

    for (let i = 0; i < 5; i++) {
      const user = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password123', // Default password for all users
        role: roles[Math.floor(Math.random() * roles.length)],
      };
      users.push(user);
    }

    // Hash passwords and save to DB
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
        return user;
      })
    );

    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();