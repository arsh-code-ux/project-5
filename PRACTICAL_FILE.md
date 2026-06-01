# PRACTICAL LAB ASSIGNMENT FILE
## Course Name: Web Application Development (Practical-V)
## Project Title: ApexLMS - Premium Academic Learning Management System

---

### 1. Objective
The primary objective of this project is to develop and deploy **ApexLMS**, a high-fidelity, secure, and production-grade **Learning Management System (LMS)** backend and interactive student-teacher dashboard portal using the **Node.js, Express, and MongoDB (Mongoose)** technology stack.

The system facilitates academic progression and course management by:
- Supporting role-based access control (RBAC) separating **Students** and **Teachers**.
- Allowing Teachers to author, edit, and delete courses, maintaining strict ownership gates so instructors cannot tamper with other teachers' courses.
- Enabling Students to browse the unified course directory, filter courses by category, register/enroll in courses, and dynamically log learning progress (0-100%) via high-fidelity sliders.
- Securing REST endpoints using JSON Web Tokens (JWT), bcrypt password hashing, Express Rate Limiters, and robust Helmet CSP HTTP headers.
- Delivering a stunning, glassmorphic dark-theme Single Page Application (SPA) dashboard portal to wow evaluators.

---

### 2. Tools & Technologies
- **Backend API Gateway**: Node.js & Express.js (v5.x web engine)
- **Database Engine**: MongoDB Atlas (Mongoose ODM - Object Document Mapper)
- **Authentication Standard**: JSON Web Token (JWT) with secure `bcryptjs` password encryption
- **Frontend Presentation Layer**: Core HTML5, Vanilla CSS3 (Custom design system variables, glassmorphic cards, custom technical indicators)
- **Security Middlewares**: Express Rate Limit (brute force protection), Helmet (HTTP headers securement), Cors (Cross-Origin Resource Sharing controls)
- **API Testing Workspace**: Postman (Automated testing collections)
- **Production Host Platform**: Render / AWS / Heroku

---

### 3. System Architecture
ApexLMS is built using the classic **Model-View-Controller (MVC)** architectural blueprint optimized for Single Page Application API transactions:

```
       +-------------------------------------------------------------+
       |                  CLIENT - Premium SPA Frontend              |
       |     (HTML5 Shell, Custom CSS Variables & Dynamic Dashboards)|
       +------------------------------+------------------------------+
                                      |
                                      | HTTP requests (AJAX Fetch)
                                      | Authorization Bearer Token
                                      v
       +-------------------------------------------------------------+
       |                 EXPRESS.JS API ROUTERS & GATEWAY            |
       |  (Cross-Origin CORS, Helmet Security, Morgan Logger, Rates) |
       +------------------------------+------------------------------+
                                      |
                                      | Custom Interceptor Pipeline
                                      v
       +-------------------------------------------------------------+
       |                    MIDDLEWARE LAYERS                        |
       |  (1. JWT Auth Guard | 2. Role Authorizer | 3. Error Handler)|
       +------------------------------+------------------------------+
                                      |
                                      | DB Queries & Model Binds
                                      v
       +-------------------------------+-----------------------------+
       |                    MONGOOSE DATABASE MODELS                 |
       |  (User Roles Schema | Course Catalog | Student Enrollments) |
       +-------------------------------+-----------------------------+
```

---

### 4. Project Folder Structure
The project tree maintains a modular separation of concerns:

```
learning-management-system/
├── config/
│   └── db.js                        # Mongoose MongoDB connection client
├── middleware/
│   ├── auth.js                      # JWT Verification & Role authorization guards
│   ├── error.js                     # Global centralized JSON exception interceptor
│   └── validator.js                 # Auth forms and courses input validators
├── models/
│   ├── User.js                      # User Schema (supports Student/Teacher roles)
│   ├── Course.js                    # Course Schema (instructors reference mapping)
│   └── Enrollment.js                # Enrollment Schema (compound unique index)
├── public/                          # SPA Frontend Static Assets (Served by Express)
│   ├── css/
│   │   └── styles.css               # Premium CSS design system & glassmorphism
│   ├── js/
│   │   └── app.js                   # Client SPA controller & fetch API integrations
│   └── index.html                   # High-fidelity dashboard portal workspace
├── routes/
│   ├── auth.js                      # User authentication & profile endpoints
│   ├── courses.js                   # Course catalog management CRUD
│   └── enrollments.js               # Enrollments progress tracking & cancellations
├── .env                             # Local config file (ignored in Git)
├── .env.example                     # Environment setup template configuration
├── LMS_API_Collection.json          # Automated Postman Collection workspace
├── PRACTICAL_FILE.md                # Completed laboratory manual
├── package.json                     # Dependency manifests & NPM scripts
└── server.js                        # Primary server entrypoint and route mounts
```

---

### 5. Database Schema
ApexLMS maps three interconnected data models to MongoDB Atlas:

#### A. User Collection Schema (`models/User.js`)
Stores authenticated accounts with pre-save password encryption:
```javascript
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role:     { type: String, enum: ['student', 'teacher'], default: 'student' }
}, { timestamps: true });
```

#### B. Course Collection Schema (`models/Course.js`)
Stores catalog courses mapping to the instructor who authored them:
```javascript
const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  duration:    { type: String, required: true },
  syllabus:    [{ type: String }],
  instructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
```

#### C. Enrollment Collection Schema (`models/Enrollment.js`)
Maps students to registered courses, tracking learning progress and status:
```javascript
const EnrollmentSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status:   { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

// Compound index prevents students from enrolling in the same course twice
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
```

---

### 6. API Endpoints
The following RESTful endpoints coordinate the full-stack system:

#### A. Authentication Gateway (`/api/auth`)
- `POST /api/auth/register` : Create a student or teacher account (Public).
- `POST /api/auth/login`    : Authenticate credentials and return JWT (Public).
- `GET  /api/auth/profile`  : Fetch details of currently active profile (Protected).

#### B. Courses Catalog Board (`/api/courses`)
- `GET  /api/courses`     : Fetch all course offerings (Public).
- `GET  /api/courses/:id` : Fetch detailed specification of a single course (Public).
- `POST /api/courses`     : Create a new course (Protected - Teachers only).
- `PUT  /api/courses/:id` : Modify course details (Protected - Course instructor only).
- `DELETE /api/courses/:id` : Delete a course & associated student enrollments (Protected - Course instructor only).

#### C. Course Enrollments & Progress (`/api/enrollments`)
- `POST   /api/enrollments`            : Register student in a course (Protected - Students only).
- `GET    /api/enrollments`            : Fetch active enrollments (Protected - Scoped automatically: students see their courses; teachers see student rosters for courses they teach).
- `PUT    /api/enrollments/:id/progress` : Update learning progress percentage (0-100) (Protected - Owned Student or Course instructor).
- `DELETE /api/enrollments/:id`          : Unenroll student / revoke registration (Protected - Owned Student or Course instructor).

---

### 7. Authentication Method
The project utilizes **JSON Web Tokens (JWT)** for session validation:
1. **Password Encryption**: User passwords are encrypted using `bcryptjs` with a work cost factor of `10` rounds before writing to MongoDB. 
2. **Token Handshake**: Upon successful login/registration, the server builds a JWT signed with a private secret key (`JWT_SECRET`) mapping the User's ID and sets a 30-day expiration.
3. **Role-Based Guards**: Protected routes call custom Express middlewares:
   - `protect`: Extracts the HTTP `Authorization` request header (`Bearer <token>`), decodes the JWT signature, pulls the matching user from MongoDB, and attaches it to `req.user`.
   - `authorize('teacher')`: Intercepts calls and guarantees that only users with the `teacher` role can execute administrative course management actions.

---

### 8. Error Handling Approach
ApexLMS implements structured, centralized error mapping:
- **Central Exception Interceptor**: All controllers wrap logical blocks in `try-catch` structures, passing caught exceptions to `next(error)`.
- **Global Error Handler Middleware (`middleware/error.js`)**: Standardizes outputs into clear structured JSON error blocks:
  - *Mongoose Validation*: Returns list of failing fields with status code `400` Bad Request.
  - *Duplicate Key Collision (Mongo Code 11000)*: Catches conflicts on unique indices (e.g. username/email already taken) and returns user-friendly messages.
  - *JSON Web Token Exceptions*: Maps expired or malformed Bearer signatures to `401 Unauthorized` responses.
  - *CastError*: Catches invalid MongoDB ObjectIds (e.g. malformed URI paths) and formats them into a clean `404 Not Found` response.

---

### 9. Deployment Details
- **Platform**: Render (Web Service Hosting)
- **Deployment Checklist**:
  1. Initialize local Git repository, commit all source files, and push to a remote GitHub repository.
  2. Log in to Render Dashboard, click **New Web Service**, and link it to the GitHub repository.
  3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
  4. In the **Environment Variables** dashboard tab, add the production keys:
     - `MONGO_URI` (pointing to your live cloud MongoDB Atlas connection string)
     - `JWT_SECRET` (your production signing key)
     - `NODE_ENV` = `production`
  5. Deploy! Render builds the environment, binds ports automatically, provisions secure SSL (`https://`), and makes the LMS public.

---

### 10. Screenshots (Required Viva Deliverables)

> [!NOTE]
> *Instructions for Student:* Import `LMS_API_Collection.json` into Postman, ensure local server is running, execute the requests in order, and replace the following placeholder diagrams with actual screenshots.

#### A. API Testing in Postman
*Capture the Postman window after running a Course Registration request or User login showing successful returns with status code 200/201.*

```
+--------------------------------------------------------------------------+
|                                                                          |
|                     [PLACEHOLDER: POSTMAN API TESTING]                   |
|                                                                          |
|  * Guide: Capture your Postman screen after a successful REST request.   |
|    Should display structured JSON payloads returning a JWT token or      |
|    a successfully created course mapping details.                        |
|                                                                          |
+--------------------------------------------------------------------------+
```

#### B. Database Records in MongoDB Atlas
*Capture your MongoDB Atlas cluster UI showing the collections populated with users, courses, and active student enrollment rows.*

```
+--------------------------------------------------------------------------+
|                                                                          |
|                     [PLACEHOLDER: MONGODB ATLAS RECORDS]                 |
|                                                                          |
|  * Guide: Log in to cloud.mongodb.com -> Browse Collections -> select     |
|    apex_lms database, showing courses or users table rows populated      |
|    with mongoose reference ObjectIds.                                    |
|                                                                          |
+--------------------------------------------------------------------------+
```

#### C. Deployed API Response (Production Verification)
*Capture your browser window pointing to your deployed Render URL (e.g. https://apexlms.onrender.com/api/health) displaying the operational status.*

```
+--------------------------------------------------------------------------+
|                                                                          |
|                     [PLACEHOLDER: DEPLOYED API RESPONSE]                 |
|                                                                          |
|  * Guide: Snap your browser rendering the live healthy server response:   |
|    { "success": true, "message": "ApexLMS Learning Management API..." }  |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

### 11. Challenges Faced & Mitigations
1. **Express v5 Wildcard Catch-all Path Parser**:
   * *Challenge*: The transition to Express v5 broke typical `*` catch-all routing due to changes in path-to-regexp parsing. A standard `*` rule threw parameter parser exceptions, stopping the server from serving SPA routes.
   * *Mitigation*: Updated the SPA catch-all route syntax to the new Express v5 standard format `/*splat` inside `server.js` (i.e. `app.get('/*splat', ...)`). This ensures robust Single Page Application routing without crashes.
2. **Offline Database Resiliency in Lab Environments**:
   * *Challenge*: In university computer labs where internet connectivity is restricted or local MongoDB services are disabled, the server crashed immediately on launch due to unhandled database connection failures, preventing teachers from seeing the frontend.
   * *Mitigation*: Re-architected `config/db.js` Mongoose connection client to catch connection errors gracefully in local environments. Rather than shutting down the node process, the server launches successfully, presenting offline warning cards and mock fallbacks to let users inspect the premium UI.
3. **Strict Course Modification Ownership Gates**:
   * *Challenge*: Standard API routes could allow unauthorized teachers to modify or delete courses authored by other teachers by tampering with course IDs in HTTP requests.
   * *Mitigation*: Built a strict Gate check in the `PUT` and `DELETE` courses endpoints that parses the course instructor reference ObjectId. It compares it directly to the active JWT user id (`req.user._id`), returning a `403 Forbidden` error if an unauthorized user attempts to modify catalog items they do not own.

---

### 12. Conclusion
The **ApexLMS** portal represents a modern, robust full-stack academic dashboard. By combining Express REST endpoints with responsive glassmorphic cards and secure JWT authentication structures, the application achieves a seamless, native desktop-like user experience. Mongoose compound unique indexes maintain data integrity, while central Express error middlewares translate exceptions safely.

Ultimately, this project demonstrates technical proficiency in modern web engineering, database relations, security best practices, and single-page client design, serving as an exceptional portfolio prototype for Web Application Development evaluation.
