# ApexLMS - Thunder Client Testing Guide

## 🎯 Complete Step-by-Step Testing with Thunder Client

Thunder Client में सभी requests को यही exact bodies के साथ test करें।

---

## STEP 1️⃣: REGISTER STUDENT

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "student_demo",
  "email": "student@demo.com",
  "password": "Student@123",
  "role": "student"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "student_demo",
    "email": "student@demo.com",
    "role": "student"
  }
}
```

**💾 Database:** `users` collection में 1 document saved ✅

**⚠️ Save this token as: `STUDENT_TOKEN`**

---

## STEP 2️⃣: REGISTER TEACHER

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "teacher_demo",
  "email": "teacher@demo.com",
  "password": "Teacher@123",
  "role": "teacher"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a141e764ae3aabe5ac5325d",
    "username": "teacher_demo",
    "email": "teacher@demo.com",
    "role": "teacher"
  }
}
```

**💾 Database:** `users` collection में 2nd document saved ✅

**⚠️ Save this token as: `TEACHER_TOKEN`**

---

## STEP 3️⃣: LOGIN STUDENT (Verify Authentication)

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "student@demo.com",
  "password": "Student@123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a13e7374ae3aabe5ac53252",
    "username": "student_demo",
    "email": "student@demo.com",
    "role": "student"
  }
}
```

**💾 Database:** No new data saved (authentication only) ✅

---

## STEP 4️⃣: GET STUDENT PROFILE

**Method:** `GET`
**URL:** `http://localhost:5000/api/auth/profile`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "6a13e7374ae3aabe5ac53252",
    "username": "student_demo",
    "email": "student@demo.com",
    "role": "student",
    "createdAt": "2026-05-25T06:07:51.762Z"
  }
}
```

**💾 Database:** No new data (read only) ✅

---

## STEP 5️⃣: CREATE COURSE 1 (Teacher)

**Method:** `POST`
**URL:** `http://localhost:5000/api/courses`

**Headers:**
```
Authorization: Bearer <PASTE_TEACHER_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "React.js Mastery",
  "description": "Learn React.js with hooks, context API, and state management for building modern web applications",
  "category": "Web Development",
  "duration": "8 Weeks",
  "syllabus": [
    "React Basics",
    "JSX and Components",
    "Hooks (useState, useEffect)",
    "Context API",
    "State Management"
  ]
}
```

**Expected Response (201 Created):**
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
    "syllabus": [
      "React Basics",
      "JSX and Components",
      "Hooks (useState, useEffect)",
      "Context API",
      "State Management"
    ],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```

**💾 Database:** `courses` collection में 1st course saved ✅

**⚠️ Save Course ID: `6a141e764ae3aabe5ac5325e` as `COURSE_1_ID`**

---

## STEP 6️⃣: CREATE COURSE 2 (Teacher)

**Method:** `POST`
**URL:** `http://localhost:5000/api/courses`

**Headers:**
```
Authorization: Bearer <PASTE_TEACHER_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Python Machine Learning",
  "description": "Master machine learning with Python using Scikit-learn, TensorFlow, and Keras for building intelligent applications",
  "category": "Data Science",
  "duration": "10 Weeks",
  "syllabus": [
    "Python Basics",
    "NumPy and Pandas",
    "Data Visualization",
    "Scikit-learn",
    "TensorFlow and Keras",
    "Model Evaluation"
  ]
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "6a141ea24ae3aabe5ac5325f",
    "title": "Python Machine Learning",
    "description": "Master machine learning...",
    "category": "Data Science",
    "duration": "10 Weeks",
    "syllabus": [
      "Python Basics",
      "NumPy and Pandas",
      "Data Visualization",
      "Scikit-learn",
      "TensorFlow and Keras",
      "Model Evaluation"
    ],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:04:20.123Z"
  }
}
```

**💾 Database:** `courses` collection में 2nd course saved ✅

**⚠️ Save Course ID: `6a141ea24ae3aabe5ac5325f` as `COURSE_2_ID`**

---

## STEP 7️⃣: GET ALL COURSES

**Method:** `GET`
**URL:** `http://localhost:5000/api/courses`

**Headers:**
```
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "courses": [
    {
      "_id": "6a141e764ae3aabe5ac5325e",
      "title": "React.js Mastery",
      "description": "Learn React.js...",
      "category": "Web Development",
      "duration": "8 Weeks",
      "syllabus": ["React Basics", "JSX and Components", "Hooks", "Context API", "State Management"],
      "instructor": {
        "_id": "6a141e764ae3aabe5ac5325d",
        "username": "teacher_demo",
        "email": "teacher@demo.com"
      },
      "createdAt": "2026-05-25T10:03:34.905Z"
    },
    {
      "_id": "6a141ea24ae3aabe5ac5325f",
      "title": "Python Machine Learning",
      "description": "Master machine learning...",
      "category": "Data Science",
      "duration": "10 Weeks",
      "syllabus": ["Python Basics", "NumPy and Pandas", "Data Visualization", "Scikit-learn", "TensorFlow", "Model Evaluation"],
      "instructor": {
        "_id": "6a141e764ae3aabe5ac5325d",
        "username": "teacher_demo",
        "email": "teacher@demo.com"
      },
      "createdAt": "2026-05-25T10:04:20.123Z"
    }
  ]
}
```

**💾 Database:** No new data (read only) ✅

---

## STEP 8️⃣: GET COURSES BY CATEGORY

**Method:** `GET`
**URL:** `http://localhost:5000/api/courses?category=Web Development`

**Headers:**
```
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "courses": [
    {
      "_id": "6a141e764ae3aabe5ac5325e",
      "title": "React.js Mastery",
      "description": "Learn React.js...",
      "category": "Web Development",
      "duration": "8 Weeks",
      "syllabus": ["React Basics", "JSX and Components", "Hooks", "Context API", "State Management"],
      "instructor": {
        "_id": "6a141e764ae3aabe5ac5325d",
        "username": "teacher_demo",
        "email": "teacher@demo.com"
      },
      "createdAt": "2026-05-25T10:03:34.905Z"
    }
  ]
}
```

**💾 Database:** No new data (filtered read) ✅

---

## STEP 9️⃣: GET SINGLE COURSE

**Method:** `GET`
**URL:** `http://localhost:5000/api/courses/6a141e764ae3aabe5ac5325e`

**Headers:**
```
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "course": {
    "_id": "6a141e764ae3aabe5ac5325e",
    "title": "React.js Mastery",
    "description": "Learn React.js with hooks, context API, and state management for building modern web applications",
    "category": "Web Development",
    "duration": "8 Weeks",
    "syllabus": [
      "React Basics",
      "JSX and Components",
      "Hooks (useState, useEffect)",
      "Context API",
      "State Management"
    ],
    "instructor": {
      "_id": "6a141e764ae3aabe5ac5325d",
      "username": "teacher_demo",
      "email": "teacher@demo.com"
    },
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```

**💾 Database:** No new data (single read) ✅

---

## STEP 🔟: UPDATE COURSE

**Method:** `PUT`
**URL:** `http://localhost:5000/api/courses/6a141e764ae3aabe5ac5325e`

**Headers:**
```
Authorization: Bearer <PASTE_TEACHER_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Advanced React.js & TypeScript Mastery",
  "description": "Advanced React.js with TypeScript, hooks, context API, performance optimization, and testing for building production-ready web applications",
  "category": "Web Development",
  "duration": "10 Weeks",
  "syllabus": [
    "React Basics",
    "TypeScript with React",
    "JSX and Components",
    "Hooks (useState, useEffect, useContext, useReducer)",
    "Context API and Redux",
    "Performance Optimization",
    "Testing with Jest",
    "State Management"
  ]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "_id": "6a141e764ae3aabe5ac5325e",
    "title": "Advanced React.js & TypeScript Mastery",
    "description": "Advanced React.js with TypeScript...",
    "category": "Web Development",
    "duration": "10 Weeks",
    "syllabus": [
      "React Basics",
      "TypeScript with React",
      "JSX and Components",
      "Hooks (useState, useEffect, useContext, useReducer)",
      "Context API and Redux",
      "Performance Optimization",
      "Testing with Jest",
      "State Management"
    ],
    "instructor": "6a141e764ae3aabe5ac5325d",
    "createdAt": "2026-05-25T10:03:34.905Z"
  }
}
```

**💾 Database:** `courses` collection में course updated ✅

---

## STEP 1️⃣1️⃣: ENROLL IN COURSE 1

**Method:** `POST`
**URL:** `http://localhost:5000/api/enrollments`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "courseId": "6a141e764ae3aabe5ac5325e"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully enrolled in course: Advanced React.js & TypeScript Mastery",
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

**💾 Database:** `enrollments` collection में 1st enrollment saved ✅

**⚠️ Save Enrollment ID: `6a141eb84ae3aabe5ac53260` as `ENROLLMENT_1_ID`**

---

## STEP 1️⃣2️⃣: ENROLL IN COURSE 2

**Method:** `POST`
**URL:** `http://localhost:5000/api/enrollments`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "courseId": "6a141ea24ae3aabe5ac5325f"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully enrolled in course: Python Machine Learning",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53261",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141ea24ae3aabe5ac5325f",
    "progress": 0,
    "status": "active",
    "enrolledAt": "2026-05-25T10:16:10.456Z"
  }
}
```

**💾 Database:** `enrollments` collection में 2nd enrollment saved ✅

**⚠️ Save Enrollment ID: `6a141eb84ae3aabe5ac53261` as `ENROLLMENT_2_ID`**

---

## STEP 1️⃣3️⃣: GET MY ENROLLMENTS

**Method:** `GET`
**URL:** `http://localhost:5000/api/enrollments`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
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
        "title": "Advanced React.js & TypeScript Mastery",
        "description": "Advanced React.js with TypeScript...",
        "category": "Web Development",
        "duration": "10 Weeks",
        "instructor": {
          "_id": "6a141e764ae3aabe5ac5325d",
          "username": "teacher_demo",
          "email": "teacher@demo.com"
        }
      },
      "progress": 0,
      "status": "active",
      "enrolledAt": "2026-05-25T10:15:20.123Z"
    },
    {
      "_id": "6a141eb84ae3aabe5ac53261",
      "student": "6a13e7374ae3aabe5ac53252",
      "course": {
        "_id": "6a141ea24ae3aabe5ac5325f",
        "title": "Python Machine Learning",
        "description": "Master machine learning...",
        "category": "Data Science",
        "duration": "10 Weeks",
        "instructor": {
          "_id": "6a141e764ae3aabe5ac5325d",
          "username": "teacher_demo",
          "email": "teacher@demo.com"
        }
      },
      "progress": 0,
      "status": "active",
      "enrolledAt": "2026-05-25T10:16:10.456Z"
    }
  ]
}
```

**💾 Database:** No new data (read only) ✅

---

## STEP 1️⃣4️⃣: UPDATE PROGRESS (Course 1 - 50%)

**Method:** `PUT`
**URL:** `http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53260/progress`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "progress": 50
}
```

**Expected Response (200 OK):**
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

**💾 Database:** `enrollments` collection में enrollment updated (progress: 50) ✅

---

## STEP 1️⃣5️⃣: UPDATE PROGRESS (Course 1 - 100% Complete)

**Method:** `PUT`
**URL:** `http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53260/progress`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "progress": 100
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Progress updated to 100%",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53260",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141e764ae3aabe5ac5325e",
    "progress": 100,
    "status": "completed"
  }
}
```

**💾 Database:** `enrollments` collection में enrollment updated (progress: 100, status: completed) ✅

---

## STEP 1️⃣6️⃣: UPDATE PROGRESS (Course 2 - 75%)

**Method:** `PUT`
**URL:** `http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53261/progress`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "progress": 75
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Progress updated to 75%",
  "enrollment": {
    "_id": "6a141eb84ae3aabe5ac53261",
    "student": "6a13e7374ae3aabe5ac53252",
    "course": "6a141ea24ae3aabe5ac5325f",
    "progress": 75,
    "status": "active"
  }
}
```

**💾 Database:** `enrollments` collection में enrollment updated (progress: 75) ✅

---

## STEP 1️⃣7️⃣: UNENROLL FROM COURSE 2

**Method:** `DELETE`
**URL:** `http://localhost:5000/api/enrollments/6a141eb84ae3aabe5ac53261`

**Headers:**
```
Authorization: Bearer <PASTE_STUDENT_TOKEN_HERE>
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully unenrolled from course"
}
```

**💾 Database:** `enrollments` collection से 2nd enrollment deleted ✅

---

## STEP 1️⃣8️⃣: DELETE COURSE (Teacher deletes course)

**Method:** `DELETE`
**URL:** `http://localhost:5000/api/courses/6a141ea24ae3aabe5ac5325f`

**Headers:**
```
Authorization: Bearer <PASTE_TEACHER_TOKEN_HERE>
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Course and all matching student enrollments deleted successfully"
}
```

**💾 Database:** `courses` collection से course deleted ✅

---

## STEP 1️⃣9️⃣: SERVER HEALTH CHECK

**Method:** `GET`
**URL:** `http://localhost:5000/api/health`

**Headers:**
```
Content-Type: application/json
```

**Body:** None (leave empty)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "ApexLMS Learning Management API Gateway is operational",
  "timestamp": "2026-05-25T10:20:30.123Z"
}
```

**💾 Database:** No new data (system check only) ✅

---

## 📊 FINAL DATABASE STATE (After all tests)

```
✅ users collection:
   - Document 1: student_demo (student)
   - Document 2: teacher_demo (teacher)

✅ courses collection:
   - Document 1: Advanced React.js & TypeScript Mastery (updated)
   - (Python Machine Learning - DELETED)

✅ enrollments collection:
   - Document 1: Student → React Course (progress: 100%, status: completed)
   - (Python Machine Learning enrollment - DELETED)
```

---

## 🔑 TOKEN FORMAT FOR HEADERS

**Copy-paste this format in Thunder Client headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTNlNzM3NGFlM2FhYmU1YWM1MzI1MiIsImlhdCI6MTc3OTY4OTI3MSwi...
```

Replace the token with your actual token from registration/login response.

---

## ⚠️ IMPORTANT NOTES

1. **Token Expiry**: Tokens expire after 30 days. If you get "invalid or expired token" error, login again.
2. **Course ID & Enrollment ID**: Replace with actual IDs from responses.
3. **Authorization Header**: Always include `Bearer ` before the token.
4. **Role Check**: Only teachers can create courses, only students can enroll.
5. **Database Changes**: All modifications are saved to MongoDB Atlas in real-time.

---

## ✅ VERIFICATION CHECKLIST

After completing all 19 steps, verify in MongoDB Atlas:

- [ ] `users` collection has 2 documents (student + teacher)
- [ ] `courses` collection has course with updated data
- [ ] `enrollments` collection has 1 document (with progress 100, status completed)
- [ ] All deleted items are removed from collections

**You're all set to test! Happy testing! 🚀**
