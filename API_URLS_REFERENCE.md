# ApexLMS - Complete API URLs Reference

## 🌐 Base URL
```
http://localhost:5000/api
```

---

## 📌 QUICK REFERENCE - All Endpoints

### 🔐 AUTHENTICATION (4 endpoints)

| # | Method | Endpoint | Purpose | Auth Required |
|---|--------|----------|---------|----------------|
| 1 | `POST` | `/auth/register` | Register new user (student/teacher) | ❌ No |
| 2 | `POST` | `/auth/login` | Login and get JWT token | ❌ No |
| 3 | `GET` | `/auth/profile` | Get current user profile | ✅ Yes |
| 4 | `GET` | `/auth/me` | Alias for profile (convenience) | ✅ Yes |

**Full URLs:**
```
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/auth/profile
GET    http://localhost:5000/api/auth/me
```

---

### 📚 COURSES (6 endpoints)

| # | Method | Endpoint | Purpose | Auth Required | Role Required |
|---|--------|----------|---------|----------------|--------------|
| 5 | `POST` | `/courses` | Create new course | ✅ Yes | Teacher |
| 6 | `GET` | `/courses` | Get all courses (with filters) | ❌ No | - |
| 7 | `GET` | `/courses/:courseId` | Get single course | ❌ No | - |
| 8 | `PUT` | `/courses/:courseId` | Update course | ✅ Yes | Teacher (creator) |
| 9 | `DELETE` | `/courses/:courseId` | Delete course | ✅ Yes | Teacher (creator) |

**Full URLs:**
```
POST   http://localhost:5000/api/courses
GET    http://localhost:5000/api/courses
GET    http://localhost:5000/api/courses?category=Web Development
GET    http://localhost:5000/api/courses/COURSE_ID
PUT    http://localhost:5000/api/courses/COURSE_ID
DELETE http://localhost:5000/api/courses/COURSE_ID
```

---

### 📝 ENROLLMENTS (4 endpoints)

| # | Method | Endpoint | Purpose | Auth Required | Role Required |
|---|--------|----------|---------|----------------|--------------|
| 10 | `POST` | `/enrollments` | Enroll in course | ✅ Yes | Student |
| 11 | `GET` | `/enrollments` | Get my enrollments | ✅ Yes | - |
| 12 | `PUT` | `/enrollments/:enrollmentId/progress` | Update progress | ✅ Yes | Student/Teacher |
| 13 | `DELETE` | `/enrollments/:enrollmentId` | Unenroll from course | ✅ Yes | Student |

**Full URLs:**
```
POST   http://localhost:5000/api/enrollments
GET    http://localhost:5000/api/enrollments
PUT    http://localhost:5000/api/enrollments/ENROLLMENT_ID/progress
DELETE http://localhost:5000/api/enrollments/ENROLLMENT_ID
```

---

### 🏥 SYSTEM (1 endpoint)

| # | Method | Endpoint | Purpose | Auth Required |
|---|--------|----------|---------|----------------|
| 14 | `GET` | `/health` | Server health check | ❌ No |

**Full URL:**
```
GET http://localhost:5000/api/health
```

---

## 📊 ENDPOINT SUMMARY TABLE

| Category | Count | Endpoints |
|----------|-------|-----------|
| Authentication | 4 | register, login, profile, me |
| Courses | 6 | create, get-all, get-one, update, delete |
| Enrollments | 4 | enroll, get-my, update-progress, unenroll |
| System | 1 | health |
| **TOTAL** | **15** | **All API operations** |

---

## 🔑 PARAMETER REFERENCE

### Authentication Parameters

**Register Request Body:**
```json
{
  "username": "string (3+ chars)",
  "email": "string (valid email)",
  "password": "string (6+ chars)",
  "role": "student|teacher"
}
```

**Login Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

### Course Parameters

**Create/Update Course Request Body:**
```json
{
  "title": "string (3+ chars)",
  "description": "string (10+ chars)",
  "category": "Web Development|Mobile Apps|Data Science|Cybersecurity|Design|Other",
  "duration": "string (e.g., '8 Weeks')",
  "syllabus": ["string", "string"] (optional)
}
```

**Query Parameters:**
```
GET /courses?category=Web Development
```

---

### Enrollment Parameters

**Enroll Request Body:**
```json
{
  "courseId": "MongoDB ObjectId"
}
```

**Update Progress Request Body:**
```json
{
  "progress": "number (0-100)"
}
```

---

## 🔐 AUTHORIZATION HEADER

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTNlNzM3NGFlM2FhYmU1YWM1MzI1MiIsImlhdCI6MTc3OTY4OTI3MSwi...
```

---

## 📥 POSTMAN COLLECTION SETUP

### Import Collection
1. Open Postman
2. File → Import
3. Select `ApexLMS_Postman_Collection.json`
4. Collection imported with all 14 endpoints

### Variables in Postman
- `{{student_token}}` - Student JWT token
- `{{teacher_token}}` - Teacher JWT token
- `{{course_id}}` - Course ID
- `{{enrollment_id}}` - Enrollment ID

### Getting Started
1. Run "Register Student" → Copy token to `{{student_token}}`
2. Run "Register Teacher" → Copy token to `{{teacher_token}}`
3. Run "Create Course" → Copy course ID to `{{course_id}}`
4. Run other endpoints using variables

---

## 🧪 CURL TESTING EXAMPLES

### 1. Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student001","email":"student@example.com","password":"Student@123","role":"student"}'
```

### 2. Create Course (as Teacher)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TEACHER_TOKEN>" \
  -d '{"title":"React Basics","description":"Learn React fundamentals","category":"Web Development","duration":"8 Weeks"}'
```

### 3. Enroll in Course (as Student)
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{"courseId":"<COURSE_ID>"}'
```

### 4. Update Progress
```bash
curl -X PUT http://localhost:5000/api/enrollments/<ENROLLMENT_ID>/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -d '{"progress":50}'
```

### 5. Get All Courses
```bash
curl -X GET http://localhost:5000/api/courses
```

### 6. Get My Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📋 RESPONSE CODES

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Successfully retrieved data |
| `201` | Created | Successfully created resource |
| `400` | Bad Request | Invalid input parameters |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | No permission (wrong role) |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Backend error |

---

## 💾 DATABASE STORAGE

All data persists in **MongoDB Atlas** (`apex_lms` database):

- **users**: Student & teacher accounts
- **courses**: Course information with instructor reference
- **enrollments**: Student enrollments with progress tracking

**Access at**: https://cloud.mongodb.com

---

## ✅ DATA FLOW VERIFICATION

### Typical User Journey
```
1. Register → User saved in 'users' collection ✅
2. Login → JWT token generated ✅
3. Create Course (Teacher) → Course saved in 'courses' collection ✅
4. Enroll (Student) → Enrollment saved in 'enrollments' collection ✅
5. Update Progress → Enrollment updated with new progress ✅
6. Unenroll → Enrollment deleted ✅
```

---

## 🚀 AUTOMATION SCRIPT

Run all tests automatically:
```bash
bash test_api.sh
```

This will:
- Register student & teacher
- Create 2 courses
- Enroll student in both
- Update progress
- Verify all data in MongoDB

---

## 🔍 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| "Port 5000 in use" | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| "MongoDB connection failed" | Check `.env` MONGO_URI, ensure MongoDB is running |
| "Token expired" | Login again to get new token |
| "No token provided" | Add `Authorization: Bearer <TOKEN>` header |
| "Course not found" | Use valid course ID from `GET /courses` |
| "Already enrolled" | Can't enroll in same course twice |
| "Role is not authorized" | Use correct JWT (teacher vs student) |

---

## 📚 RESOURCES

- **Full Documentation**: See `README.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Postman Collection**: `ApexLMS_Postman_Collection.json`
- **Test Script**: `test_api.sh`

---

## 📞 QUICK LINKS

| Resource | URL |
|----------|-----|
| Server Health | http://localhost:5000/api/health |
| MongoDB Atlas | https://cloud.mongodb.com |
| Postman | https://www.postman.com |
| Express Docs | https://expressjs.com |
| JWT Info | https://jwt.io |

---

## ✨ YOU'RE READY TO TEST!

1. ✅ Server running on port 5000
2. ✅ All 15 endpoints ready
3. ✅ MongoDB connected
4. ✅ Postman collection available
5. ✅ Test script included

**Start testing now!** 🎉
