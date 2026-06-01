# MongoDB Data Storage Verification Guide

## 🔍 समस्या: Data Store नहीं हो रहा

अगर MongoDB में data नहीं दिख रहा तो ये कदम follow करो:

---

## STEP 1: MongoDB Atlas में सही Collection देखो

1. **MongoDB Atlas खोलो**: https://cloud.mongodb.com
2. **Login करो**
3. **"MyCluster" click करो**
4. **"apex_lms" database select करो**
5. **"Collections" tab देखो**

### Collections होने चाहिए:
- ✅ `users` - Student/Teacher accounts
- ✅ `courses` - Course information  
- ✅ `enrollments` - Student enrollments

---

## STEP 2: Collections को Refresh करो

**अगर data नहीं दिख रहा:**

1. MongoDB Atlas में जाओ
2. Database selection dropdown में
3. **"admin"** database select करो
4. फिर वापस **"apex_lms"** database select करो
5. यह पूरा data refresh करेगा

---

## STEP 3: Direct MongoDB Connection Test

Terminal में यह command run करो:

```bash
# Check if MongoDB is reachable
curl -X GET "https://cloud.mongodb.com/api/atlas/v1.0/groups" \
  -u "simran111:simran1010"
```

---

## STEP 4: Browser Cache Clear करो

1. **MongoDB Atlas page खोलो**
2. **Ctrl+Shift+Delete** (या Cmd+Shift+Delete Mac पर)
3. **Cache और Cookies clear करो**
4. **Page refresh करो** (F5)

---

## STEP 5: API से Direct Data Check करो

Terminal में यह command दो:

```bash
# Register new user
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"verify_user","email":"verify@test.com","password":"Verify@123","role":"student"}' \
  | grep -o '"id":"[^"]*"'

# Should return user ID
```

अगर user ID मिला तो user MongoDB में save हुआ है।

---

## STEP 6: सही Database Access करो

MongoDB Atlas में:

1. **"Data services" > "Deployments" खोलो**
2. **"MyCluster" क्लिक करो**
3. **"Collections" tab खोलो**
4. Left side में **"apex_lms"** database दिखेगा
5. Click करके देखो

---

## STEP 7: Manual Document Insert Test

MongoDB Atlas Collections tab में:

1. **"apex_lms" database expand करो**
2. **"users" collection खोलो**
3. ✅ Documents दिखें तो data save हो रहा है
4. ❌ कोई documents नहीं दिखे तो:

```bash
# Server restart करो
npm start

# नया user register करो
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test@123","role":"student"}'

# MongoDB में फिर से देखो
```

---

## COMMON ISSUES & SOLUTIONS

### ❌ समस्या: Collections tab खाली है

**समाधान:**
1. Database refresh करो (Step 2)
2. Browser cache clear करो (Step 4)
3. Server restart करो:
   ```bash
   npm start
   ```
4. नया registration करो

### ❌ समस्या: "Connection refused" error

**समाधान:**
1. `.env` file check करो - MONGO_URI सही है?
2. MongoDB Atlas credentials सही हैं?
3. IP whitelist में your IP है? (Allow access from anywhere: 0.0.0.0/0)

### ❌ समस्या: Database exists नहीं करता

**समाधान:**
1. Server से कोई data create करो
2. MongoDB automatically database create करेगा
3. Register करो (कोई भी endpoint)
4. फिर MongoDB में देखो

---

## ✅ SUCCESS VERIFICATION

जब data properly store हो तो:

```
MongoDB Atlas → MyCluster → apex_lms → Collections
├── users (Documents: 2+)
│   ├── student documents
│   └── teacher documents
├── courses (Documents: 1+)
│   └── course documents
└── enrollments (Documents: 0+)
    └── enrollment documents
```

---

## 🔧 STEP-BY-STEP VERIFICATION

### 1️⃣ Server Status Check
```bash
curl http://localhost:5000/api/health
# Should return: {"success": true, "message": "...operational..."}
```

### 2️⃣ Register New User
```bash
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"final_test","email":"final@test.com","password":"Final@123","role":"student"}')

echo $RESPONSE | grep -o '"id":"[^"]*"'
# If you see ID like "id":"6a13e7374ae3aabe5ac53252" → Data saved!
```

### 3️⃣ MongoDB Check
```
1. Open: https://cloud.mongodb.com
2. Click: MyCluster → apex_lms → Collections → users
3. Should show: 1+ documents
4. Each has: username, email, password (hashed), role, createdAt
```

---

## 📋 FINAL CHECKLIST

- [ ] MongoDB Atlas accessible
- [ ] apex_lms database exists
- [ ] Server running on port 5000
- [ ] Health check returns success
- [ ] New user registration works
- [ ] MongoDB shows new documents
- [ ] All 3 collections visible (users, courses, enrollments)

---

## 🎯 अगर अभी भी data नहीं दिख रहा:

1. **Server logs देखो** - कोई error तो नहीं?
   ```bash
   npm start
   # देखो क्या output आ रहा है
   ```

2. **MongoDB URI सही है?**
   ```bash
   cat .env | grep MONGO_URI
   ```

3. **Credentials सही हैं?**
   - Username: simran111
   - Password: simran1010

4. **Network IP whitelisted है?**
   - MongoDB Atlas → Network Access
   - Check: 0.0.0.0/0 (Allow access from anywhere)

---

## ✨ Final Solution

अगर उपरोक्त कुछ नहीं काम करता तो:

```bash
# 1. सर्वर बंद करो
Ctrl+C

# 2. Server फिर से शुरू करो
npm start

# 3. नया user register करो
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"fresh_user","email":"fresh@test.com","password":"Fresh@123","role":"student"}'

# 4. MongoDB Atlas refresh करो
# Browser में F5 दबाओ

# 5. Collections देखो
# apex_lms → Collections → users
```

**अब data दिखना चाहिए!** ✅
