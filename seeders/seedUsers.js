const User = require('../models/User');

async function seedUsers() {
  try {
    await User.deleteMany();
    
    const users = [
      { name: 'Admin', email: 'admin@example.com', role: 'admin', password: 'password123' },
      { name: 'John Doe', email: 'john@example.com', role: 'student', password: 'password123' },
      // ... other users
    ];

    const result = await User.insertMany(users);
    console.log(`👥 Seeded ${result.length} users`);
    return result;
  } catch (err) {
    console.error('❌ User seeding error:', err.message);
    throw err;
  }
}

module.exports = seedUsers;