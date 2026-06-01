const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Load models
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://simran111:simran1010@mycluster.36hc0ze.mongodb.net/apex_lms?appName=MyCluster';

    console.log(`\nConnecting to MongoDB Atlas database...\nURI: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('\x1b[32m[Connected] Database connection established successfully.\x1b[0m');

    // Clear existing data in LMS collections
    console.log('\nCleaning existing collections to prevent duplicate key constraints...');
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    console.log('\x1b[32m[Cleared] User, Course, and Enrollment collections are empty.\x1b[0m');

    // Create teacher and student accounts
    console.log('\nSeeding Users (Student & Teacher with bcrypt encryption)...');
    
    // Note: Mongoose User.create automatically executes pre-save bcrypt hashing hooks
    const teacher = await User.create({
      username: 'profsmith',
      email: 'smith@example.com',
      password: 'Password123',
      role: 'teacher'
    });

    const student = await User.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123',
      role: 'student'
    });

    console.log(`\x1b[32m[Users Added]\x1b[0m`);
    console.log(`  - Teacher : Email: \x1b[1msmith@example.com\x1b[22m | Pass: \x1b[1mPassword123\x1b[22m`);
    console.log(`  - Student : Email: \x1b[1mjohn@example.com\x1b[22m  | Pass: \x1b[1mPassword123\x1b[22m`);

    // Create courses authored by profsmith
    console.log('\nSeeding Course Catalog (Linked to Instructor profsmith)...');
    
    const course1 = await Course.create({
      title: 'Introduction to Mongoose ODM',
      description: 'Learn schemas, compound modeling, references validations, and query populate operations in MongoDB using Mongoose.',
      category: 'Web Development',
      duration: '6 Weeks',
      syllabus: [
        'Setup & Database Connects',
        'Defining Schemas & Pre-save Hooks',
        'CRUD operations and Document population',
        'Compound validations and unique indexes'
      ],
      instructor: teacher._id
    });

    const course2 = await Course.create({
      title: 'Responsive CSS Design & Flexbox',
      description: 'Master beautiful, modern, high-fidelity flexbox layouts, CSS custom properties, grid systems, and glassmorphic dashboard styling.',
      category: 'Design',
      duration: '4 Weeks',
      syllabus: [
        'CSS Custom Properties & flexbox models',
        'Building Glassmorphic Card Containers',
        'Mobile Viewports & Fluid Layouts'
      ],
      instructor: teacher._id
    });

    const course3 = await Course.create({
      title: 'Full-Stack Express Development',
      description: 'Design highly secure Node.js backend services, custom logging middlewares, JWT session authentication, and centralized error exception interceptors.',
      category: 'Web Development',
      duration: '8 Weeks',
      syllabus: [
        'Express Routers & HTTP verb handlers',
        'JWT Auth protection and Role gates',
        'Central Exception Interceptors & Validation Middlewares'
      ],
      instructor: teacher._id
    });

    console.log(`\x1b[32m[Courses Added]\x1b[0m`);
    console.log(`  - Course 1: "${course1.title}"`);
    console.log(`  - Course 2: "${course2.title}"`);
    console.log(`  - Course 3: "${course3.title}"`);

    // Create course registrations and progress tracking for student johndoe
    console.log('\nSeeding Course Enrollments & Progress Metrics for Student johndoe...');
    
    const enrollment1 = await Enrollment.create({
      student: student._id,
      course: course1._id,
      progress: 45,
      status: 'active'
    });

    const enrollment2 = await Enrollment.create({
      student: student._id,
      course: course2._id,
      progress: 100,
      status: 'completed'
    });

    console.log(`\x1b[32m[Enrollments Added]\x1b[0m`);
    console.log(`  - student "johndoe" enrolled in "${course1.title}" -> Progress: \x1b[1m45%\x1b[22m (Status: active)`);
    console.log(`  - student "johndoe" enrolled in "${course2.title}" -> Progress: \x1b[1m100%\x1b[22m (Status: completed)`);

    console.log('\n\x1b[36m==================================================\x1b[0m');
    console.log('\x1b[32m\x1b[1m       ApexLMS Database Seeding Successful!       \x1b[22m\x1b[0m');
    console.log('\x1b[36m==================================================\x1b[0m\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m[Seeder Failed] Error occurred during database seed:\x1b[0m', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
