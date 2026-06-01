const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validator');

const router = express.Router();

// Helper function to sign JSON Web Tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyapex_lms_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student or teacher
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: userExists.email === email 
          ? 'Email is already registered' 
          : 'Username is already taken'
      });
    }

    // Default to 'student' if no valid role is supplied
    const userRole = role && ['student', 'teacher'].includes(role) ? role : 'student';

    // Create user in DB
    const user = await User.create({
      username,
      email,
      password,
      role: userRole
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials and return session token
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Select password field explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials (email not found)'
      });
    }

    // Verify bcrypt password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials (wrong password)'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get active user profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});

// Alias mapping for academic testing convenience
router.get('/me', protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
