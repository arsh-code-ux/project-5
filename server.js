const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- TRUST PROXY (Required for Render, Heroku, etc.) ---
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARES ---
// Set security HTTP headers (adjust content security policy to allow CSS fonts and fetch CDN frameworks)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'"]
      }
    }
  })
);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming body payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- REQUEST LOGGING ---
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// --- RATE LIMITING ---
// Restrict requests to protect backend resources from brute force or DDoS in lab trials
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 300, // Limit each IP to 300 requests per 10 minutes
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 10 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip rate limiting for health check
    return req.path === '/api/health';
  }
});
app.use('/api/', limiter);

// --- MOUNT API ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));

// Server health check gateway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ApexLMS Learning Management API Gateway is operational',
    timestamp: new Date()
  });
});

// --- GLOBAL EXCEPTION INTERCEPTOR ---
app.use(errorHandler);

// --- SERVER BIND PORT ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n\x1b[36m==================================================\x1b[0m`);
  console.log(`\x1b[35m       ApexLMS - Learning Management Server       \x1b[0m`);
  console.log(`\x1b[36m==================================================\x1b[0m`);
  console.log(`\x1b[32m[Server Ready] Running in \x1b[1m${process.env.NODE_ENV || 'development'}\x1b[22m mode on port \x1b[1m${PORT}\x1b[22m\x1b[0m`);
  console.log(`\x1b[34m[Local URL]    http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m==================================================\x1b[0m\n`);
});

// Graceful rejection handles
process.on('unhandledRejection', (err, promise) => {
  console.error(`\x1b[31m[Unhandled Rejection Detected] Error:\x1b[0m ${err.message}`);
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
