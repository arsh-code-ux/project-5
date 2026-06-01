# ApexLMS - Learning Management System API

A complete REST API for a Learning Management System built with **Node.js, Express, MongoDB, and JWT Authentication**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [API Endpoints](#api-endpoints)
4. [Testing with Postman](#testing-with-postman)
5. [Database Collections](#database-collections)
6. [Authentication](#authentication)
7. [Common Errors & Solutions](#common-errors--solutions)
8. [Project Structure](#project-structure)

---

## 🎯 Project Overview

**ApexLMS** is a full-featured Learning Management System API that allows:
- ✅ User authentication (Students & Teachers)
- ✅ Course creation and management
- ✅ Student course enrollments
- ✅ Progress tracking
- ✅ Role-based access control
- ✅ JWT token-based security

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Password**: bcryptjs

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Postman (for testing)

### 1. Clone/Download Project
```bash
cd project\ 5
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
The `.env` file is already configured with:
```properties
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://simran111:simran1010@mycluster.36hc0ze.mongodb.net/?appName=MyCluster
JWT_SECRET=supersecretjwtkeyapex_lms_2026
JWT_EXPIRE=30d
```

### 4. Start the Server
```bash
npm start
```

Expected output:
```
==================================================
       ApexLMS - Learning Management Server       
==================================================
[Server Ready] Running in development mode on port 5000
[Local URL]    http://localhost:5000
==================================================
```

### 5. Verify Server is Running
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "ApexLMS Learning Management API Gateway is operational",
  "timestamp": "2026-05-25T10:03:30.762Z"
}
```

---

## 📡 API Endpoints

### 🔐 Authentication Endpoints

#### 1. Register User (Student or Teacher)
```
POST /api/auth/register
```
**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "student"
}
```
**Valid Roles**: `student`, `teacher`

**Response** (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### 2. Login User
```
POST /api/auth/login
```
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### 3. Get Current User Profile
```
GET /api/auth/profile
```
**Headers** (REQUIRED):
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "_id": "6a13e7374ae3aabe5ac53252",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2026-05-25T06:07:51.762Z"
  }
}
```

---

### 📚 Course Endpoints

#### 4. Create Course (Teacher Only)
```
POST /api/courses
```
**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
```

**Request Body**:
```json
{
  "title": "React.js Mastery",
  "description": "Learn React.js with hooks, context API, and state management",
  "category": "Web Development",
  "duration": "8 Weeks",
  "syllabus": ["React Basics", "Hooks", "State Management"]
}
```

**Valid Categories**:
- Web Development
- Mobile Apps
- Data Science
- Cybersecurity
- Design
- Other

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "6a141e764ae3aabe5ac5325e",
    "title": "React.js Mastery",
    "description": "Learn React.js...",
    "category": "Web Development",
    "duration": "8 Weeks",
    "syllabus": ["React Basics", "Hooks", "State Management"],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```

---

#### 5. Get All Courses
```
GET /api/courses
```

**Optional Query Parameters**:
```
GET /api/courses?category=Web Development
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "courses": [
    {
      "_id": "6a141e764ae3aabe5ac5325e",
      "title": "React.js Mastery",
      "description": "Learn React.js...",
      "category": "Web Development",
      "duration": "8 Weeks",
      "syllabus": ["React Basics", "Hooks"],
      "instructor": {
        "_id": "6a141e764ae3aabe5ac5325d",
        "username": "teacher001",
        "email": "teacher@example.com"
      },
      "createdAt": "2026-05-25T10:03:34.905Z"
    }
  ]
}
```

---

#### 6. Get Single Course
```
GET /api/courses/:courseId
```

Example:
```
GET /api/courses/6a141e764ae3aabe5ac5325e
```

---

#### 7. Update Course (Teacher who created it)
```
PUT /api/courses/:courseId
```

**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
```

**Request Body**:
```json
{
  "title": "Advanced React.js Mastery",
  "description": "Advanced React.js with performance optimization",
  "category": "Web Development",
  "duration": "10 Weeks",
  "syllabus": ["React Basics", "Hooks", "Performance", "Testing"]
}
```

---

#### 8. Delete Course (Teacher who created it)
```
DELETE /api/courses/:courseId
```

**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
```

---

### 📝 Enrollment Endpoints

#### 9. Enroll in Course (Student Only)
```
POST /api/enrollments
```

**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

**Request Body**:
```json
{
  "courseId": "6a141e764ae3aabe5ac5325e"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53260",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141e764ae3aabe5ac5325e",
    "progress": 0,
    "status": "active",
    "enrolledAt": "2026-05-25T10:15:20.123Z"
  }
}
```

---

#### 10. Get My Enrollments
```
GET /api/enrollments
```

**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 2,
  "enrollments": [
    {
      "_id": "6a141eb84ae3aabe5ac53260",
      "student": "6a13e7374ae3aabe5ac53252",
      "course": {
        "_id": "6a141e764ae3aabe5ac5325e",
        "title": "React.js Mastery",
        "category": "Web Development",
        "duration": "8 Weeks",
        "instructor": {
          "username": "teacher001",
          "email": "teacher@example.com"
        }
      },
      "progress": 0,
      "status": "active",
      "enrolledAt": "2026-05-25T10:15:20.123Z"
    }
  ]
}
```

---

#### 11. Update Enrollment Progress
```
PUT /api/enrollments/:enrollmentId/progress
```

**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

**Request Body**:
```json
{
  "progress": 50
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Progress updated to 50%",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53260",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141e764ae3aabe5ac5325e",
    "progress": 50,
    "status": "active"
  }
}
```

---

#### 12. Unenroll from Course
```
DELETE /api/enrollments/:enrollmentId
```

**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

---

## 🧪 Testing with Postman

### Option 1: Import Postman Collection
1. Open Postman
2. Click **"Import"** (top-left)
3. Select **`ApexLMS_Postman_Collection.json`** from project folder
4. Collection will be imported with all endpoints

### Option 2: Manual Setup
1. **Install Postman Desktop Agent** (for localhost testing)
2. **Create requests manually** with the endpoint URLs above

### Option 3: Use cURL
Run all tests automatically:
```bash
bash test_api.sh
```

This script will:
- ✅ Register student and teacher
- ✅ Create 2 courses
- ✅ Enroll student in both courses
- ✅ Update progress
- ✅ Test all endpoints
- ✅ Show summary with MongoDB storage confirmation

---

## 💾 Database Collections

### Users Collection
Stores user accounts (students and teachers)
```json
{
  "_id": ObjectId("6a13e7374ae3aabe5ac53252"),
  "username": "john_doe",
  "email": "john@example.com",
  "password": "<hashed_bcrypt_password>",
  "role": "student",
  "createdAt": ISODate("2026-05-25T06:07:51.762Z")
}
```

### Courses Collection
Stores course information
```json
{
  "_id": ObjectId("6a141e764ae3aabe5ac5325e"),
  "title": "React.js Mastery",
  "description": "Learn React.js...",
  "category": "Web Development",
  "duration": "8 Weeks",
  "syllabus": ["React Basics", "Hooks", "State Management"],
  "instructor": ObjectId("6a141e764ae3aabe5ac5325d"),
  "createdAt": ISODate("2026-05-25T10:03:34.905Z")
}
```

### Enrollments Collection
Stores student course enrollments
```json
{
  "_id": ObjectId("6a141eb84ae3aabe5ac53260"),
  "student": ObjectId("6a13e7374ae3aabe5ac53252"),
  "course": ObjectId("6a141e764ae3aabe5ac5325e"),
  "progress": 50,
  "status": "active",
  "createdAt": ISODate("2026-05-25T10:15:20.123Z")
}
```

---

## 🔒 Authentication

### Token Format
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Token Structure
JWTs are signed with the secret: `supersecretjwtkeyapex_lms_2026`

Example decoded token payload:
```json
{
  "id": "6a13e7374ae3aabe5ac53252",
  "iat": 1779689271,
  "exp": 1782281271
}
```

### Token Expiry
- Default: 30 days
- Set via `JWT_EXPIRE` in `.env`

---

## ⚠️ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Not authorized, no token provided` | Missing Bearer token | Add `Authorization: Bearer <TOKEN>` header |
| `Not authorized, invalid or expired token` | Invalid or expired JWT | Refresh token by logging in again |
| `User role 'student' is not authorized` | Student trying teacher action | Use teacher JWT token or change user role to teacher |
| `Course not found` | Invalid course ID | Use valid course ID from GET /api/courses |
| `Email is already registered` | Duplicate email | Use different email address |
| `Password must be at least 6 characters` | Weak password | Use password >= 6 characters |
| `Username must be at least 3 characters` | Username too short | Use username >= 3 characters |
| `Cloud agent error: cannot send request` | Postman Cloud → localhost | Use Postman Desktop or Desktop Agent |
| `You are already enrolled in this course` | Duplicate enrollment | Cannot enroll in same course twice |
| `Progress must be between 0 and 100` | Invalid progress value | Use number between 0-100 |

---

## 📁 Project Structure

```
project 5/
├── server.js                          # Main Express server
├── package.json                       # Dependencies
├── .env                               # Environment variables
├── TESTING_GUIDE.md                   # Complete testing guide
├── ApexLMS_Postman_Collection.json    # Postman collection for import
├── test_api.sh                        # Automated testing script
├── config/
│   └── db.js                          # MongoDB connection
├── middleware/
│   ├── auth.js                        # JWT authentication & authorization
│   ├── error.js                       # Global error handler
│   └── validator.js                  # Input validation
├── models/
│   ├── User.js                        # User schema
│   ├── Course.js                      # Course schema
│   └── Enrollment.js                  # Enrollment schema
├── routes/
│   ├── auth.js                        # Authentication routes
│   ├── courses.js                     # Course routes
│   └── enrollments.js                 # Enrollment routes
├── public/
│   ├── index.html                     # Frontend UI
│   ├── css/
│   │   └── styles.css                 # Styling
│   └── js/
│       └── app.js                     # Frontend JavaScript
└── LMS_API_Collection.json            # Original Postman collection
```

---

## 🔄 Quick Start Examples

### Example 1: Register & Create Course
```bash
# 1. Register as teacher
TEACHER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"prof_smith","email":"prof@college.com","password":"Prof@2026","role":"teacher"}')

TEACHER_TOKEN=$(echo $TEACHER | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Create course
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "title": "Full Stack Development",
    "description": "Master frontend, backend, and database development",
    "category": "Web Development",
    "duration": "12 Weeks"
  }'
```

### Example 2: Student Enrollment
```bash
# 1. Register as student
STUDENT=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice_smith","email":"alice@student.com","password":"Alice@2026","role":"student"}')

STUDENT_TOKEN=$(echo $STUDENT | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Get courses
COURSES=$(curl -s -X GET http://localhost:5000/api/courses)
COURSE_ID=$(echo $COURSES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

# 3. Enroll
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{"courseId":"'$COURSE_ID'"}'
```

---

## 📞 Support & Resources

- **API Health**: `GET /api/health`
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Postman**: https://www.postman.com
- **Node.js**: https://nodejs.org
- **Express**: https://expressjs.com
- **JWT**: https://jwt.io

---

## ✅ Data Storage Checklist

When you use the API, data is automatically saved to MongoDB:

- [x] User registration → `users` collection
- [x] Course creation → `courses` collection  
- [x] Course updates → `courses` collection (modified)
- [x] Course deletion → `courses` collection (removed)
- [x] Student enrollment → `enrollments` collection
- [x] Progress updates → `enrollments` collection (modified)
- [x] Unenrollment → `enrollments` collection (removed)

All data is persisted in MongoDB Atlas `apex_lms` database!

---

## 🎉 You're All Set!

Your ApexLMS API is ready for:
- ✅ Testing with Postman
- ✅ Frontend integration
- ✅ Production deployment
- ✅ Student & Teacher interactions

Happy coding! 🚀
