const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedUsers() {
  try {
    // Remove all old users
    await User.deleteMany();

    const roles = ['admin', 'student','teacher'];
    const users = [];

    for (let i = 0; i < 5; i++) {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: roles[Math.floor(Math.random() * roles.length)],
        password: hashedPassword,
      });
    }

    const result = await User.insertMany(users);
    console.log(`👥 Seeded ${result.length} users`);
    return result;
  } catch (err) {
    console.error('❌ User seeding error:', err.message);
    throw err;
  }
}

module.exports = seedUsers;
