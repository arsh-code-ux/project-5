# ApexLMS - Complete Testing Guide

## 🔧 Server Setup
- **Server Running**: http://localhost:5000
- **Database**: MongoDB Atlas (apex_lms)
- **Environment**: Development mode

---

## 📌 API BASE URL
```
http://localhost:5000/api
```

---

## 1️⃣ AUTHENTICATION ENDPOINTS

### 1. Register Student
**URL**: `POST /api/auth/register`
```
http://localhost:5000/api/auth/register
```
**Body** (JSON):
```json
{
  "username": "student001",
  "email": "student@example.com",
  "password": "Student@123",
  "role": "student"
}
```
**Response** (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "student001",
    "email": "student@example.com",
    "role": "student"
  }
}
```
**Stored in DB**: ✅ Users Collection

---

### 2. Register Teacher
**URL**: `POST /api/auth/register`
```
http://localhost:5000/api/auth/register
```
**Body** (JSON):
```json
{
  "username": "teacher001",
  "email": "teacher@example.com",
  "password": "Teacher@123",
  "role": "teacher"
}
```
**Response** (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a141e764ae3aabe5ac5325d",
    "username": "teacher001",
    "email": "teacher@example.com",
    "role": "teacher"
  }
}
```
**Stored in DB**: ✅ Users Collection

---

### 3. Login User (Student/Teacher)
**URL**: `POST /api/auth/login`
```
http://localhost:5000/api/auth/login
```
**Body** (JSON):
```json
{
  "email": "student@example.com",
  "password": "Student@123"
}
```
**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "student001",
    "email": "student@example.com",
    "role": "student"
  }
}
```
**Stored in DB**: ❌ (No new data, just authentication)

---

### 4. Get Current User Profile
**URL**: `GET /api/auth/profile`
```
http://localhost:5000/api/auth/profile
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
    "username": "student001",
    "email": "student@example.com",
    "role": "student",
    "createdAt": "2026-05-25T06:07:51.762Z"
  }
}
```
**Stored in DB**: ❌ (Read only)

---

## 2️⃣ COURSES ENDPOINTS

### 5. Create Course (Teacher Only)
**URL**: `POST /api/courses`
```
http://localhost:5000/api/courses
```
**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
Content-Type: application/json
```
**Body** (JSON):
```json
{
  "title": "Advanced JavaScript",
  "description": "Master async/await, closures, prototypes, and advanced JavaScript concepts for professional development",
  "category": "Web Development",
  "duration": "8 Weeks",
  "syllabus": [
    "JavaScript Fundamentals",
    "Async Programming",
    "Closures & Scope",
    "ES6+ Features"
  ]
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
    "title": "Advanced JavaScript",
    "description": "Master async/await...",
    "category": "Web Development",
    "duration": "8 Weeks",
    "syllabus": ["JavaScript Fundamentals", "Async Programming", "Closures & Scope", "ES6+ Features"],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```
**Stored in DB**: ✅ Courses Collection

---

### 6. Get All Courses
**URL**: `GET /api/courses`
```
http://localhost:5000/api/courses
```
**Optional Query** (Filter by category):
```
http://localhost:5000/api/courses?category=Web Development
```
**Headers**: (Optional) Authorization token
**Response** (200 OK):
```json
{
  "success": true,
  "count": 2,
  "courses": [
    {
      "_id": "6a141e764ae3aabe5ac5325e",
      "title": "Advanced JavaScript",
      "description": "Master async/await...",
      "category": "Web Development",
      "duration": "8 Weeks",
      "syllabus": ["JavaScript Fundamentals", "Async Programming"],
      "instructor": {
        "_id": "6a141e764ae3aabe5ac5325d",
        "username": "teacher001",
        "email": "teacher@example.com"
      },
      "createdAt": "2026-05-25T10:03:34.905Z"
    },
    {
      "_id": "6a141ea24ae3aabe5ac5325f",
      "title": "Python for Data Science",
      "description": "Learn Python programming with Pandas...",
      "category": "Data Science",
      "duration": "10 Weeks",
      "syllabus": [],
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
**Stored in DB**: ❌ (Read only)

---

### 7. Get Single Course
**URL**: `GET /api/courses/:id`
```
http://localhost:5000/api/courses/6a141e764ae3aabe5ac5325e
```
**Headers**: (Optional) Authorization token
**Response** (200 OK):
```json
{
  "success": true,
  "course": {
    "_id": "6a141e764ae3aabe5ac5325e",
    "title": "Advanced JavaScript",
    "description": "Master async/await...",
    "category": "Web Development",
    "duration": "8 Weeks",
    "syllabus": ["JavaScript Fundamentals", "Async Programming"],
    "instructor": {
      "_id": "6a141e764ae3aabe5ac5325d",
      "username": "teacher001",
      "email": "teacher@example.com"
    },
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```
**Stored in DB**: ❌ (Read only)

---

### 8. Update Course (Teacher who created it)
**URL**: `PUT /api/courses/:id`
```
http://localhost:5000/api/courses/6a141e764ae3aabe5ac5325e
```
**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
Content-Type: application/json
```
**Body** (JSON):
```json
{
  "title": "Advanced JavaScript & TypeScript",
  "description": "Master async/await, closures, prototypes, and advanced JavaScript with TypeScript",
  "category": "Web Development",
  "duration": "10 Weeks",
  "syllabus": [
    "JavaScript Fundamentals",
    "TypeScript Basics",
    "Async Programming",
    "Design Patterns"
  ]
}
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "_id": "6a141e764ae3aabe5ac5325e",
    "title": "Advanced JavaScript & TypeScript",
    "description": "Master async/await...",
    "category": "Web Development",
    "duration": "10 Weeks",
    "syllabus": [
      "JavaScript Fundamentals",
      "TypeScript Basics",
      "Async Programming",
      "Design Patterns"
    ],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```
**Stored in DB**: ✅ Courses Collection (Updated)

---

### 9. Delete Course (Teacher who created it)
**URL**: `DELETE /api/courses/:id`
```
http://localhost:5000/api/courses/6a141e764ae3aabe5ac5325e
```
**Headers** (REQUIRED):
```
Authorization: Bearer <TEACHER_JWT_TOKEN>
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Course and all matching student enrollments deleted successfully"
}
```
**Stored in DB**: ✅ Courses & Enrollments deleted from Collection

---

## 3️⃣ ENROLLMENT ENDPOINTS

### 10. Enroll Student in Course
**URL**: `POST /api/enrollments`
```
http://localhost:5000/api/enrollments
```
**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
Content-Type: application/json
```
**Body** (JSON):
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
    "enrolledAt": "2026-05-25T10:15:20.123Z",
    "progress": 0,
    "status": "active"
  }
}
```
**Stored in DB**: ✅ Enrollments Collection

---

### 11. Get Student Enrollments
**URL**: `GET /api/enrollments`
```
http://localhost:5000/api/enrollments
```
**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```
**Response** (200 OK):
```json
{
  "success": true,
  "count": 1,
  "enrollments": [
    {
      "_id": "6a141eb84ae3aabe5ac53260",
      "student": "6a13e7374ae3aabe5ac53252",
      "course": {
        "_id": "6a141e764ae3aabe5ac5325e",
        "title": "Advanced JavaScript",
        "description": "Master async/await...",
        "category": "Web Development",
        "duration": "8 Weeks",
        "instructor": {
          "_id": "6a141e764ae3aabe5ac5325d",
          "username": "teacher001",
          "email": "teacher@example.com"
        }
      },
      "enrolledAt": "2026-05-25T10:15:20.123Z",
      "progress": 0,
      "status": "active"
    }
  ]
}
```
**Stored in DB**: ❌ (Read only)

---

### 12. Update Enrollment Progress
**URL**: `PUT /api/enrollments/:id/progress`
```
http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53260/progress
```
**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
Content-Type: application/json
```
**Body** (JSON):
```json
{
  "progress": 45
}
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Enrollment progress updated",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53260",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141e764ae3aabe5ac5325e",
    "enrolledAt": "2026-05-25T10:15:20.123Z",
    "progress": 45,
    "status": "active"
  }
}
```
**Stored in DB**: ✅ Enrollments Collection (Updated)

---

### 13. Unenroll from Course
**URL**: `DELETE /api/enrollments/:id`
```
http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53260
```
**Headers** (REQUIRED):
```
Authorization: Bearer <STUDENT_JWT_TOKEN>
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully unenrolled from course"
}
```
**Stored in DB**: ✅ Enrollments Collection (Deleted)

---

## 4️⃣ HEALTH CHECK

### 14. Server Health Status
**URL**: `GET /api/health`
```
http://localhost:5000/api/health
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "ApexLMS Learning Management API Gateway is operational",
  "timestamp": "2026-05-25T06:03:30.762Z"
}
```
**Stored in DB**: ❌ (System check only)

---

## 📊 DATABASE STORAGE SUMMARY

| Operation | Endpoint | Method | Stored? | Collection |
|-----------|----------|--------|---------|-----------|
| Register User | `/api/auth/register` | POST | ✅ | users |
| Login | `/api/auth/login` | POST | ❌ | - |
| Get Profile | `/api/auth/profile` | GET | ❌ | - |
| Create Course | `/api/courses` | POST | ✅ | courses |
| Get Courses | `/api/courses` | GET | ❌ | - |
| Get Course by ID | `/api/courses/:id` | GET | ❌ | - |
| Update Course | `/api/courses/:id` | PUT | ✅ | courses |
| Delete Course | `/api/courses/:id` | DELETE | ✅ | courses |
| Enroll in Course | `/api/enrollments` | POST | ✅ | enrollments |
| Get Enrollments | `/api/enrollments` | GET | ❌ | - |
| Update Progress | `/api/enrollments/:id` | PUT | ✅ | enrollments |
| Unenroll | `/api/enrollments/:id` | DELETE | ✅ | enrollments |
| Health Check | `/api/health` | GET | ❌ | - |

---

## 🔐 Authentication Header Format
```
Authorization: Bearer <JWT_TOKEN>
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTNlNzM3NGFlM2FhYmU1YWM1MzI1MiIsImlhdCI6MTc3OTY4OTI3MSwi
ZXhwIjoxNzgyMjgxMjcxfQ.AZXendpCY98FUjva0ISdQsC-6audc4fSq2RVTJADGCA
```

---

## ✅ Quick Testing Steps

### Step 1: Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student001","email":"student@example.com","password":"Student@123","role":"student"}'
```

### Step 2: Register Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teacher001","email":"teacher@example.com","password":"Teacher@123","role":"teacher"}'
```

### Step 3: Create Course (as Teacher)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TEACHER_TOKEN>" \
  -d '{"title":"React Mastery","description":"Learn React.js with hooks and state management","category":"Web Development","duration":"8 Weeks"}'
```

### Step 4: Enroll in Course (as Student)
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{"courseId":"<COURSE_ID>"}'
```

### Step 5: Check MongoDB
Visit MongoDB Atlas → `apex_lms` database → Collections to see stored data

---

## 🐛 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Not authorized, no token provided` | Missing Bearer token | Add `Authorization: Bearer <TOKEN>` header |
| `User role 'student' is not authorized` | Student trying teacher action | Use teacher token or change role to teacher |
| `Course not found` | Invalid course ID | Get courses list and use valid ID |
| `Email is already registered` | Duplicate email | Use different email address |
| `Password must be at least 6 characters` | Weak password | Use password >= 6 chars |
| `Cloud agent error: cannot send request` | Postman Cloud accessing localhost | Download Postman Desktop Agent |

---

## 📞 Support
All data is stored in MongoDB Atlas `apex_lms` database with 3 collections:
- **users** - Student & Teacher accounts
- **courses** - Course information with instructor reference
- **enrollments** - Student enrollments with progress tracking

