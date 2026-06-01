const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token authentication guard
const protect = async (req, res, next) => {
  let token;

  // Extract Bearer token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyapex_lms_2026');

      // Bind user data (excluding select hashed password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route (user no longer exists)'
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Exception]:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, invalid or expired token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

// Role-based access control gate
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to perform this operation`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
