const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a course category'],
    enum: ['Web Development', 'Mobile Apps', 'Data Science', 'Cybersecurity', 'Design', 'Other']
  },
  duration: {
    type: String,
    required: [true, 'Please add course duration (e.g. 6 Weeks)'],
    trim: true
  },
  syllabus: {
    type: [String],
    default: []
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
