const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

async function seedCourses() {
  try {
    // Get existing students
    const students = await User.find({ role: 'student' });
    
    if (students.length === 0) {
      throw new Error('No students found - run seedUsers first');
    }

    const availableStudentIds = students.map(s => s._id);

    // Delete existing courses
    await Course.deleteMany();
    console.log('🗑️ Deleted existing courses');

    // Course data
    const courses = [
      {
        title: 'Introduction to Programming',
        courseCode: 'CS101',
        description: 'Learn programming fundamentals with Python',
        startDate: new Date('2023-09-01'),
        duration: '3 Months',
        price: 199,
        professor: 'Dr. John Smith',
        maxStudents: 50,
        contactNumber: '+1234567890',
        students: availableStudentIds.slice(0, 2),
        likes: 120
      },
      {
        title: 'Web Development Fundamentals',
        courseCode: 'CS102',
        description: 'Build websites with HTML, CSS and JavaScript',
        startDate: new Date('2023-09-15'),
        duration: '4 Months',
        price: 249,
       professor: 'Dr. John Smith',
        maxStudents: 40,
        contactNumber: '+1234567891',
        students: availableStudentIds.slice(1, 3),
        likes: 85
      },
      {
        title: 'Database Systems',
        courseCode: 'CS201',
        description: 'Learn SQL and database design principles',
        startDate: new Date('2023-10-01'),
        duration: '3 Months',
        price: 299,
        professor: 'Dr. John Smith',
        maxStudents: 35,
        contactNumber: '+1234567892',
        students: availableStudentIds.slice(2, 4),
        likes: 75
      },
      {
        title: 'Mobile App Development',
        courseCode: 'CS301',
        description: 'Build cross-platform apps with React Native',
        startDate: new Date('2023-10-15'),
        duration: '5 Months',
        price: 399,
        professor: 'Dr. John Smith',
        maxStudents: 30,
        contactNumber: '+1234567893',
        students: availableStudentIds.slice(0, 1),
        likes: 110
      },
      {
        title: 'Data Structures & Algorithms',
        courseCode: 'CS401',
        description: 'Master fundamental computer science concepts',
        startDate: new Date('2023-11-01'),
        duration: '4 Months',
        price: 349,
        professor: 'Dr. John Smith',
        maxStudents: 45,
        contactNumber: '+1234567894',
        students: availableStudentIds.slice(3, 5),
        likes: 95
      },
      {
        title: 'Machine Learning Basics',
        courseCode: 'CS501',
        description: 'Introduction to ML concepts and applications',
        startDate: new Date('2023-11-15'),
        duration: '6 Months',
        price: 499,
       professor: 'Dr. John Smith',
        maxStudents: 25,
        contactNumber: '+1234567895',
        students: availableStudentIds.slice(1, 2),
        likes: 150
      },
      {
        title: 'Cybersecurity Fundamentals',
        courseCode: 'CS601',
        description: 'Learn essential security principles and practices',
        startDate: new Date('2023-12-01'),
        duration: '3 Months',
        price: 299,
        professor: 'Dr. John Smith',
        maxStudents: 40,
        contactNumber: '+1234567896',
        students: availableStudentIds.slice(2, 3),
        likes: 80
      },
      {
        title: 'Cloud Computing with AWS',
        courseCode: 'CS701',
        description: 'Introduction to cloud services and deployment',
        startDate: new Date('2023-12-15'),
        duration: '4 Months',
        price: 449,
        professor: 'Dr. John Smith',
        maxStudents: 30,
        contactNumber: '+1234567897',
        students: availableStudentIds.slice(3, 4),
        likes: 105
      },
      {
        title: 'DevOps Engineering',
        courseCode: 'CS801',
        description: 'CI/CD pipelines and infrastructure as code',
        startDate: new Date('2024-01-01'),
        duration: '5 Months',
        price: 399,
        professor: 'Dr. John Smith',
        maxStudents: 35,
        contactNumber: '+1234567898',
        students: availableStudentIds.slice(4, 5),
        likes: 90
      },
      {
        title: 'Blockchain Technology',
        courseCode: 'CS901',
        description: 'Introduction to blockchain and smart contracts',
        startDate: new Date('2024-01-15'),
        duration: '6 Months',
        price: 599,
        professor: 'Dr. John Smith',
        maxStudents: 20,
        contactNumber: '+1234567899',
        students: availableStudentIds.slice(0, 2),
        likes: 200
      }
    ];

    // Insert courses
    const result = await Course.insertMany(courses);
    console.log(`📚 Successfully seeded ${result.length} courses`);
    
    return result;
  } catch (err) {
    console.error('❌ Course seeding error:', err.message);
    throw err;
  }
}

// Export as CommonJS module
module.exports = seedCourses;