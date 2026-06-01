const express = require('express');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validator');

const router = express.Router();

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Teacher only)
 */
router.post('/', protect, authorize('teacher'), validateCourse, async (req, res, next) => {
  try {
    const { title, description, category, duration, syllabus } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      duration,
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      instructor: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/courses
 * @desc    Get all courses (with optional category search)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course specification
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'username email');
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course specifications
 * @access  Private (Teacher who authored the course)
 */
router.put('/:id', protect, authorize('teacher'), validateCourse, async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Secure Gate: Check if active teacher is the original author of the course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You are not authorized to update courses authored by other instructors'
      });
    }

    const { title, description, category, duration, syllabus } = req.body;

    course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        duration,
        syllabus: Array.isArray(syllabus) ? syllabus : []
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Remove a course from database
 * @access  Private (Teacher who authored the course)
 */
router.delete('/:id', protect, authorize('teacher'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Secure Gate: Verify instructor is the original author
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You are not authorized to delete courses authored by other instructors'
      });
    }

    // Delete course
    await Course.findByIdAndDelete(req.params.id);

    // Clean up associated enrollments
    const Enrollment = require('../models/Enrollment');
    await Enrollment.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Course and all matching student enrollments deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
