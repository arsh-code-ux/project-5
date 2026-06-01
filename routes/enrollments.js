const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/enrollments
 * @desc    Enroll a student in a course
 * @access  Private (Student only)
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        error: 'Only student accounts can enroll in courses'
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid courseId'
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Verify student is not already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        error: 'You are already enrolled in this course'
      });
    }

    // Authorize enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
      status: 'active'
    });

    // Populate course details
    await enrollment.populate({
      path: 'course',
      select: 'title description duration category',
      populate: { path: 'instructor', select: 'username email' }
    });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in course: ${course.title}`,
      enrollment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/enrollments
 * @desc    Get enrollment rosters
 *          - Students: Gets their own course catalog enrollments
 *          - Teachers: Gets students enrolled in courses they teach
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    let enrollments;

    if (req.user.role === 'student') {
      // Find courses this student registered for
      enrollments = await Enrollment.find({ student: req.user._id })
        .populate({
          path: 'course',
          populate: { path: 'instructor', select: 'username email' }
        })
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'teacher') {
      // Find courses taught by this teacher first
      const teacherCourses = await Course.find({ instructor: req.user._id }).select('_id');
      const courseIds = teacherCourses.map(c => c._id);

      // Find all student enrollments in these courses
      enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate('course', 'title category duration')
        .populate('student', 'username email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/enrollments/:id/progress
 * @desc    Update progress metric of a student's course enrollment
 * @access  Private
 */
router.put('/:id/progress', protect, async (req, res, next) => {
  try {
    const { progress } = req.body;
    const progressNum = Number(progress);

    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Progress must be a numeric integer value between 0 and 100'
      });
    }

    let enrollment = await Enrollment.findById(req.params.id).populate('course');
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment record not found'
      });
    }

    // Secure Gate: Students can edit their own, Teachers can edit enrollments in their courses
    const isStudentOwner = enrollment.student.toString() === req.user._id.toString();
    const isTeacherOwner = enrollment.course.instructor.toString() === req.user._id.toString();

    if (!isStudentOwner && !isTeacherOwner) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You are not authorized to update this enrollment progress'
      });
    }

    // Set course progress and automatic completion status
    enrollment.progress = progressNum;
    enrollment.status = progressNum === 100 ? 'completed' : 'active';

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: `Progress updated to ${progressNum}%`,
      enrollment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/enrollments/:id
 * @desc    Unenroll student / revoke enrollment
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment record not found'
      });
    }

    // Secure Gate: Students can unenroll themselves, Teachers can purge students from their own courses
    const isStudentOwner = enrollment.student.toString() === req.user._id.toString();
    const isTeacherOwner = enrollment.course.instructor.toString() === req.user._id.toString();

    if (!isStudentOwner && !isTeacherOwner) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You are not authorized to remove this enrollment'
      });
    }

    await Enrollment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled / enrollment record removed'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
