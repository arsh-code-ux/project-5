// Input Field Validation Helper Middlewares

const validateRegister = (req, res, next) => {
  const { username, email, password, role } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['student', 'teacher'].includes(role)) {
    errors.push('Role must be either student or teacher');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
  }

  next();
};

const validateCourse = (req, res, next) => {
  const { title, description, category, duration } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Course title must be at least 3 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Course description must be at least 10 characters long');
  }

  const validCategories = ['Web Development', 'Mobile Apps', 'Data Science', 'Cybersecurity', 'Design', 'Other'];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  if (!duration || duration.trim().length === 0) {
    errors.push('Course duration is required (e.g. 6 Weeks)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join('. ')
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse
};
