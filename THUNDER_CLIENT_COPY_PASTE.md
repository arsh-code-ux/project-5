# THUNDER CLIENT - ALL 19 REQUESTS IN ORDER

## Copy-Paste Reference for Thunder Client

---

### ✅ STEP 1: REGISTER STUDENT

```
Method:  POST
URL:     http://localhost:5000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "username": "student_demo",
  "email": "student@demo.com",
  "password": "Student@123",
  "role": "student"
}

✅ SAVE: Copy "token" value → STUDENT_TOKEN
✅ DATABASE: 1 document saved in 'users' collection
```

---

### ✅ STEP 2: REGISTER TEACHER

```
Method:  POST
URL:     http://localhost:5000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "username": "teacher_demo",
  "email": "teacher@demo.com",
  "password": "Teacher@123",
  "role": "teacher"
}

✅ SAVE: Copy "token" value → TEACHER_TOKEN
✅ DATABASE: 1 document saved in 'users' collection (total: 2)
```

---

### ✅ STEP 3: LOGIN STUDENT

```
Method:  POST
URL:     http://localhost:5000/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "student@demo.com",
  "password": "Student@123"
}

✅ VERIFY: Login works, get new token
✅ DATABASE: No new data
```

---

### ✅ STEP 4: GET STUDENT PROFILE

```
Method:  GET
URL:     http://localhost:5000/api/auth/profile
Headers: 
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body: (empty)

✅ VERIFY: Profile loaded with user details
✅ DATABASE: No new data
```

---

### ✅ STEP 5: CREATE COURSE 1 (REACT)

```
Method:  POST
URL:     http://localhost:5000/api/courses
Headers:
  - Authorization: Bearer TEACHER_TOKEN
  - Content-Type: application/json

Body:
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

✅ SAVE: Copy "_id" value → COURSE_1_ID
✅ DATABASE: 1 course saved in 'courses' collection
```

---

### ✅ STEP 6: CREATE COURSE 2 (PYTHON ML)

```
Method:  POST
URL:     http://localhost:5000/api/courses
Headers:
  - Authorization: Bearer TEACHER_TOKEN
  - Content-Type: application/json

Body:
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

✅ SAVE: Copy "_id" value → COURSE_2_ID
✅ DATABASE: 2 courses saved in 'courses' collection
```

---

### ✅ STEP 7: GET ALL COURSES

```
Method:  GET
URL:     http://localhost:5000/api/courses
Headers: Content-Type: application/json

Body: (empty)

✅ VERIFY: See both courses in response (count: 2)
✅ DATABASE: No new data
```

---

### ✅ STEP 8: GET COURSES BY CATEGORY

```
Method:  GET
URL:     http://localhost:5000/api/courses?category=Web Development
Headers: Content-Type: application/json

Body: (empty)

✅ VERIFY: See only React course (count: 1)
✅ DATABASE: No new data
```

---

### ✅ STEP 9: GET SINGLE COURSE

```
Method:  GET
URL:     http://localhost:5000/api/courses/COURSE_1_ID
Headers: Content-Type: application/json

Body: (empty)

✅ VERIFY: Full React course details shown
✅ DATABASE: No new data
```

---

### ✅ STEP 10: UPDATE COURSE

```
Method:  PUT
URL:     http://localhost:5000/api/courses/COURSE_1_ID
Headers:
  - Authorization: Bearer TEACHER_TOKEN
  - Content-Type: application/json

Body:
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

✅ VERIFY: Course updated with new title and content
✅ DATABASE: Course updated in 'courses' collection
```

---

### ✅ STEP 11: ENROLL IN COURSE 1

```
Method:  POST
URL:     http://localhost:5000/api/enrollments
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body:
{
  "courseId": "COURSE_1_ID"
}

✅ SAVE: Copy "_id" value → ENROLLMENT_1_ID
✅ DATABASE: 1 enrollment saved in 'enrollments' collection
```

---

### ✅ STEP 12: ENROLL IN COURSE 2

```
Method:  POST
URL:     http://localhost:5000/api/enrollments
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body:
{
  "courseId": "COURSE_2_ID"
}

✅ SAVE: Copy "_id" value → ENROLLMENT_2_ID
✅ DATABASE: 2 enrollments saved in 'enrollments' collection
```

---

### ✅ STEP 13: GET MY ENROLLMENTS

```
Method:  GET
URL:     http://localhost:5000/api/enrollments
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body: (empty)

✅ VERIFY: See both enrollments with courses (count: 2)
✅ DATABASE: No new data
```

---

### ✅ STEP 14: UPDATE PROGRESS - 50%

```
Method:  PUT
URL:     http://localhost:5000/api/enrollments/ENROLLMENT_1_ID/progress
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body:
{
  "progress": 50
}

✅ VERIFY: Progress updated to 50%
✅ DATABASE: Enrollment updated with progress: 50
```

---

### ✅ STEP 15: COMPLETE COURSE - 100%

```
Method:  PUT
URL:     http://localhost:5000/api/enrollments/ENROLLMENT_1_ID/progress
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body:
{
  "progress": 100
}

✅ VERIFY: Progress 100%, status changed to "completed"
✅ DATABASE: Enrollment updated with progress: 100, status: "completed"
```

---

### ✅ STEP 16: UPDATE COURSE 2 PROGRESS - 75%

```
Method:  PUT
URL:     http://localhost:5000/api/enrollments/ENROLLMENT_2_ID/progress
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body:
{
  "progress": 75
}

✅ VERIFY: Progress updated to 75%
✅ DATABASE: Enrollment updated with progress: 75, status: "active"
```

---

### ✅ STEP 17: UNENROLL FROM COURSE 2

```
Method:  DELETE
URL:     http://localhost:5000/api/enrollments/ENROLLMENT_2_ID
Headers:
  - Authorization: Bearer STUDENT_TOKEN
  - Content-Type: application/json

Body: (empty)

✅ VERIFY: Successfully unenrolled message
✅ DATABASE: Enrollment deleted (1 enrollment remains)
```

---

### ✅ STEP 18: DELETE COURSE 2

```
Method:  DELETE
URL:     http://localhost:5000/api/courses/COURSE_2_ID
Headers:
  - Authorization: Bearer TEACHER_TOKEN
  - Content-Type: application/json

Body: (empty)

✅ VERIFY: Course deleted message
✅ DATABASE: Course deleted from 'courses' collection (1 course remains)
```

---

### ✅ STEP 19: SERVER HEALTH CHECK

```
Method:  GET
URL:     http://localhost:5000/api/health
Headers: Content-Type: application/json

Body: (empty)

✅ VERIFY: Server operational message
✅ DATABASE: No new data
```

---

## 📊 FINAL DATABASE STATE

After all 19 steps:

```
✅ users collection (2 documents)
   - student_demo
   - teacher_demo

✅ courses collection (1 document)
   - Advanced React.js & TypeScript (UPDATED)
   - (Python ML DELETED)

✅ enrollments collection (1 document)
   - Student → React Course (100% complete)
   - (Python ML enrollment DELETED)
```

---

## 🎯 COPY-PASTE CHECKLIST

- [ ] Step 1:  Register Student → Save STUDENT_TOKEN
- [ ] Step 2:  Register Teacher → Save TEACHER_TOKEN
- [ ] Step 3:  Login Student
- [ ] Step 4:  Get Profile
- [ ] Step 5:  Create Course 1 → Save COURSE_1_ID
- [ ] Step 6:  Create Course 2 → Save COURSE_2_ID
- [ ] Step 7:  Get All Courses
- [ ] Step 8:  Filter by Category
- [ ] Step 9:  Get Single Course
- [ ] Step 10: Update Course
- [ ] Step 11: Enroll Course 1 → Save ENROLLMENT_1_ID
- [ ] Step 12: Enroll Course 2 → Save ENROLLMENT_2_ID
- [ ] Step 13: Get My Enrollments
- [ ] Step 14: Update Progress 50%
- [ ] Step 15: Complete Course 100%
- [ ] Step 16: Update Progress 75%
- [ ] Step 17: Unenroll
- [ ] Step 18: Delete Course
- [ ] Step 19: Health Check

**All 19 steps completed! ✅**
