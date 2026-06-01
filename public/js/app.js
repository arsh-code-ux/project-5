/**
 * ==========================================================================
 * APEXLMS SPA CLIENT CONTROLLER
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Variables ---
  let token = localStorage.getItem('lms_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('lms_user')) || null;
  let activeView = 'dashboard';
  let coursesCache = [];
  let enrollmentsCache = [];

  // --- Theme Setup ---
  document.body.classList.add('dark-theme');

  // --- Core DOM Nodes ---
  const authContainer = document.getElementById('auth-container');
  const appContainer = document.getElementById('app-container');

  // Forms
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginCard = document.getElementById('login-card');
  const registerCard = document.getElementById('register-card');

  // Toggles & Actions
  const toggleRegisterLink = document.getElementById('toggle-register');
  const toggleLoginLink = document.getElementById('toggle-login');
  const btnLogout = document.getElementById('btn-logout');

  // Navigation Links
  const navLinks = document.querySelectorAll('.nav-link');
  const pageTitle = document.getElementById('page-title');
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');

  // Profile Badges
  const sidebarUsername = document.getElementById('sidebar-username');
  const sidebarUserRole = document.getElementById('sidebar-user-role');
  const sidebarUserAvatar = document.getElementById('sidebar-user-avatar');
  const headerUsername = document.getElementById('header-username');

  // View sections
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    catalog: document.getElementById('view-catalog'),
    mycourses: document.getElementById('view-mycourses')
  };

  // Metrics Widgets
  const statTotalCourses = document.getElementById('stat-total-courses');
  const statMyActivities = document.getElementById('stat-my-activities');
  const statInProgress = document.getElementById('stat-in-progress');
  const statCompleted = document.getElementById('stat-completed');
  const widgetLabel2 = document.getElementById('widget-label-2');
  const widgetLabel3 = document.getElementById('widget-label-3');
  const widgetLabel4 = document.getElementById('widget-label-4');
  const mycoursesNavText = document.getElementById('mycourses-nav-text');

  // Course Catalog DOM Hooks
  const catalogListHook = document.getElementById('catalog-list-hook');
  const catalogLoading = document.getElementById('catalog-loading');
  const catalogEmpty = document.getElementById('catalog-empty');
  const catalogSearch = document.getElementById('catalog-search');
  const filterCourseCategory = document.getElementById('filter-course-category');

  // My Courses / Enrollments DOM Hooks
  const mycoursesListHook = document.getElementById('mycourses-list-hook');
  const mycoursesLoading = document.getElementById('mycourses-loading');
  const mycoursesEmpty = document.getElementById('mycourses-empty');
  const mycoursesEmptyTitle = document.getElementById('mycourses-empty-title');
  const mycoursesEmptyDesc = document.getElementById('mycourses-empty-desc');

  // Teacher Syllabus Modals & Sidebar Actions
  const sidebarTeacherActions = document.getElementById('sidebar-teacher-actions');
  const modalCourseForm = document.getElementById('modal-course-form');
  const btnCreateCourse = document.getElementById('nav-btn-create-course');
  const catalogBtnCreateFallback = document.getElementById('catalog-btn-create-fallback');
  const modalCourseClose = document.getElementById('modal-course-close');
  const modalCourseCancel = document.getElementById('modal-course-cancel');
  const courseFormElement = document.getElementById('course-form-element');
  const editCourseId = document.getElementById('edit-course-id');
  const courseModalTitle = document.getElementById('course-modal-title');
  const btnCourseAction = document.getElementById('btn-course-action');

  // Database Warning Indicators
  const dbStatusBadge = document.getElementById('db-status-badge');
  const dbErrorBanner = document.getElementById('db-error-banner');

  // --- FLOATING TOAST SYSTEM ---
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger transition
    setTimeout(() => toast.classList.add('active'), 50);

    // Destroy
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // --- API HELPER FUNCTION (INJECTS BEARER AUTHORIZATION) ---
  async function apiCall(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json();

      // Gracefully handle JWT auth failures / logouts
      if (response.status === 401) {
        showToast('Your session has expired. Logging out...', 'error');
        logoutUser();
        throw new Error(data.error || 'Authentication token expired');
      }

      // Check DB Status light
      updateDbStatus(true);

      return { status: response.status, data };
    } catch (error) {
      console.error(`[API Call Failed to endpoint ${endpoint}]:`, error);
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        updateDbStatus(false);
      }
      throw error;
    }
  }

  // --- DB Status Lights Sync ---
  function updateDbStatus(isSynced) {
    const dot = dbStatusBadge.querySelector('.status-dot');
    const txt = dbStatusBadge.querySelector('.status-text');

    if (isSynced) {
      dot.className = 'status-dot green';
      txt.textContent = 'MongoDB Sync';
      dbErrorBanner.classList.add('hidden');
    } else {
      dot.className = 'status-dot red';
      txt.textContent = 'DB Sync Offline';
      dbErrorBanner.classList.remove('hidden');
    }
  }

  // --- DYNAMIC VIEWS NAVIGATION SWITCHER ---
  function switchView(viewName) {
    activeView = viewName;

    // Toggle active link CSS class
    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle viewport blocks
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });

    // Set page title header text
    if (viewName === 'dashboard') pageTitle.textContent = 'Dashboard Overview';
    if (viewName === 'catalog') pageTitle.textContent = 'Catalog Curriculum';
    if (viewName === 'mycourses') {
      pageTitle.textContent = currentUser?.role === 'student' ? 'My Enrolled Courses' : 'Student Enrollment Roster';
    }

    // Mobile sidebar toggle exit
    sidebar.classList.remove('active');

    // Run view data fetch loads
    if (viewName === 'dashboard') loadDashboardStats();
    if (viewName === 'catalog') loadCourseCatalog();
    if (viewName === 'mycourses') loadMyCoursesView();
  }

  // --- VISUAL COLOR BADGES UTILITIES ---
  function getCategoryColorTokens(category) {
    switch (category) {
      case 'Web Development': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'Mobile Apps': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'Data Science': return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' };
      case 'Cybersecurity': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'Design': return { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
      default: return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' };
    }
  }

  // ==========================================================================
  // MODULE A: AUTHENTICATION FLOW
  // ==========================================================================

  // Switch Register / Login card panels
  toggleRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.remove('active');
    setTimeout(() => registerCard.add ? null : registerCard.classList.add('active'), 10);
  });

  toggleLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerCard.classList.remove('active');
    setTimeout(() => loginCard.classList.add('active'), 10);
  });

  // Login handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const { status, data } = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data.success) {
        saveSession(data.token, data.user);
        showToast(`Successfully logged in. Welcome, ${data.user.username}!`, 'success');
        initializeWorkspace();
      } else {
        showToast(data.error || 'Login credentials mismatch', 'error');
      }
    } catch (err) {
      showToast('Authentication failed. Server could not be reached.', 'error');
    }
  });

  // Register handler
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    try {
      const { status, data } = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role })
      });

      if (data.success) {
        saveSession(data.token, data.user);
        showToast(`Account registered successfully as a ${data.user.role}!`, 'success');
        initializeWorkspace();
      } else {
        showToast(data.error || 'Register validation failed', 'error');
      }
    } catch (err) {
      showToast('Registration failed. Check inputs or connection.', 'error');
    }
  });

  // Radio button active selectors visual design
  document.querySelectorAll('.role-option').forEach(option => {
    const radio = option.querySelector('input');
    radio.addEventListener('change', () => {
      document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
      if (radio.checked) {
        option.classList.add('active');
      }
    });
  });

  // Save session variables
  function saveSession(jwtToken, user) {
    token = jwtToken;
    currentUser = user;
    localStorage.setItem('lms_token', jwtToken);
    localStorage.setItem('lms_user', JSON.stringify(user));
  }

  // Logout routine
  function logoutUser() {
    token = null;
    currentUser = null;
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');

    // Switch view cards
    appContainer.classList.remove('active');
    setTimeout(() => {
      appContainer.classList.add('hidden');
      authContainer.classList.remove('hidden');
      authContainer.classList.add('active');
    }, 400);

    // Clear forms inputs
    loginForm.reset();
    registerForm.reset();
  }

  btnLogout.addEventListener('click', () => {
    logoutUser();
    showToast('Logged out of learning workspace successfully.', 'info');
  });

  // Boot UI state layouts
  function initializeWorkspace() {
    authContainer.classList.remove('active');
    setTimeout(() => {
      authContainer.classList.add('hidden');
      appContainer.classList.remove('hidden');
      appContainer.classList.add('active');
    }, 400);

    // Fill profile tags
    sidebarUsername.textContent = currentUser.username;
    sidebarUserRole.textContent = currentUser.role;
    headerUsername.textContent = currentUser.username;
    sidebarUserAvatar.textContent = currentUser.username.substring(0, 1).toUpperCase();

    // Adjust elements based on Roles
    if (currentUser.role === 'teacher') {
      sidebarTeacherActions.classList.remove('hidden');
      catalogBtnCreateFallback.classList.remove('hidden');
      mycoursesNavText.textContent = 'Student Enrollment Roster';
      
      // Update widgets labels matching teacher monitors
      widgetLabel2.textContent = 'Authored Courses';
      widgetLabel3.textContent = 'Course Enrollments';
      widgetLabel4.textContent = 'Students Active';
    } else {
      sidebarTeacherActions.classList.add('hidden');
      catalogBtnCreateFallback.classList.add('hidden');
      mycoursesNavText.textContent = 'My Enrolled Courses';

      // Restore standard student labels
      widgetLabel2.textContent = 'My Enrolled Courses';
      widgetLabel3.textContent = 'In-Progress Courses';
      widgetLabel4.textContent = 'Completed Courses';
    }

    // Default switch
    switchView('dashboard');
  }

  // ==========================================================================
  // MODULE B: INTERACTIVE DASHBOARD STATS LOGIC
  // ==========================================================================
  async function loadDashboardStats() {
    try {
      const coursesRes = await apiCall('/api/courses');
      const enrollmentsRes = await apiCall('/api/enrollments');

      const allCourses = coursesRes.data.courses || [];
      const myEnrollments = enrollmentsRes.data.enrollments || [];

      // Update courses catalog widget total
      statTotalCourses.textContent = allCourses.length;

      if (currentUser?.role === 'teacher') {
        // Teacher stats details
        const myTaughtCourses = allCourses.filter(c => c.instructor?._id === currentUser.id || c.instructor === currentUser.id);
        statMyActivities.textContent = myTaughtCourses.length;

        // Total student registers in courses taught by this teacher
        statInProgress.textContent = myEnrollments.length;

        // Unique students enrolled
        const uniqueStudents = new Set(myEnrollments.map(e => e.student?._id || e.student));
        statCompleted.textContent = uniqueStudents.size;
      } else {
        // Student stats details
        statMyActivities.textContent = myEnrollments.length;

        const inProgress = myEnrollments.filter(e => e.status === 'active').length;
        const completed = myEnrollments.filter(e => e.status === 'completed').length;

        statInProgress.textContent = inProgress;
        statCompleted.textContent = completed;
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics stats.', err);
    }
  }

  // ==========================================================================
  // MODULE C: COURSE CATALOG SYSTEM (CRUD & FILTERS)
  // ==========================================================================
  async function loadCourseCatalog() {
    catalogLoading.classList.remove('hidden');
    catalogListHook.innerHTML = '';
    catalogEmpty.classList.add('hidden');

    try {
      const categoryFilter = filterCourseCategory.value;
      const endpoint = categoryFilter ? `/api/courses?category=${encodeURIComponent(categoryFilter)}` : '/api/courses';
      const { status, data } = await apiCall(endpoint);

      catalogLoading.classList.add('hidden');
      coursesCache = data.courses || [];

      filterAndRenderCatalog();
    } catch (err) {
      catalogLoading.classList.add('hidden');
      catalogEmpty.classList.remove('hidden');
      showToast('Error loading course catalogs directories.', 'error');
    }
  }

  function filterAndRenderCatalog() {
    const searchVal = catalogSearch.value.trim().toLowerCase();
    const enrolledRes = apiCall('/api/enrollments'); // We want to know if student is enrolled

    // Trigger nested sync inside promise resolve
    apiCall('/api/enrollments').then(res => {
      const myEnrollments = res.data.enrollments || [];
      const enrolledCourseIds = myEnrollments.map(e => e.course?._id || e.course);

      const filtered = coursesCache.filter(course => {
        const matchesSearch = 
          course.title.toLowerCase().includes(searchVal) ||
          course.description.toLowerCase().includes(searchVal) ||
          course.category.toLowerCase().includes(searchVal) ||
          (course.syllabus && course.syllabus.some(s => s.toLowerCase().includes(searchVal)));

        return matchesSearch;
      });

      if (filtered.length === 0) {
        catalogEmpty.classList.remove('hidden');
        catalogListHook.innerHTML = '';
        return;
      }

      catalogEmpty.classList.add('hidden');
      catalogListHook.innerHTML = '';

      filtered.forEach(course => {
        const colorToken = getCategoryColorTokens(course.category);
        const card = document.createElement('div');
        card.className = 'course-card glass-card';
        card.style.setProperty('--card-color', colorToken.color);
        card.style.setProperty('--card-bg-glow', colorToken.bg);

        // Syllabus topic tags
        let syllabusHtml = '';
        if (course.syllabus && course.syllabus.length > 0) {
          syllabusHtml = `
            <div class="syllabus-block">
              <h4>Milestones</h4>
              <div class="syllabus-tags">
                ${course.syllabus.map(s => `<span class="syllabus-tag">${s}</span>`).join('')}
              </div>
            </div>
          `;
        }

        // Action controls based on roles
        let actionsHtml = '';
        const isAuthor = course.instructor?._id === currentUser?.id || course.instructor === currentUser?.id;
        
        if (currentUser?.role === 'teacher') {
          if (isAuthor) {
            actionsHtml = `
              <div class="action-row">
                <button class="btn btn-secondary btn-edit-course" data-id="${course._id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                <button class="btn btn-primary btn-delete-course" style="background: var(--color-cyber); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);" data-id="${course._id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
              </div>
            `;
          } else {
            actionsHtml = `
              <div class="action-row">
                <span class="text-muted" style="font-size: 0.85rem; font-style: italic;"><i class="fa-solid fa-lock"></i> Created by other Instructor</span>
              </div>
            `;
          }
        } else {
          // Student controls
          const isEnrolled = enrolledCourseIds.includes(course._id);
          if (isEnrolled) {
            actionsHtml = `
              <button class="btn btn-secondary btn-block" disabled><i class="fa-solid fa-circle-check text-primary"></i> Enrolled</button>
            `;
          } else {
            actionsHtml = `
              <button class="btn btn-primary btn-block btn-enroll-course" data-id="${course._id}"><i class="fa-solid fa-plus"></i> Enroll Course</button>
            `;
          }
        }

        card.innerHTML = `
          <div class="card-top">
            <span class="subject-badge">${course.category}</span>
            <span class="duration-badge"><i class="fa-regular fa-clock"></i> ${course.duration}</span>
          </div>
          <h2>${course.title}</h2>
          <p class="description">${course.description}</p>
          ${syllabusHtml}
          <div class="instructor-block">
            <div class="inst-avatar">${(course.instructor?.username || 'Teacher').substring(0, 1).toUpperCase()}</div>
            <div class="inst-meta">
              <span class="name">${course.instructor?.username || 'Teacher'}</span>
              <span class="label">Course Instructor</span>
            </div>
          </div>
          ${actionsHtml}
        `;

        catalogListHook.appendChild(card);
      });

      // Bind button click listeners
      bindCatalogButtons();
    });
  }

  function bindCatalogButtons() {
    // Enroll buttons
    document.querySelectorAll('.btn-enroll-course').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const courseId = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enrolling...';

        try {
          const { status, data } = await apiCall('/api/enrollments', {
            method: 'POST',
            body: JSON.stringify({ courseId })
          });

          if (data.success) {
            showToast(data.message, 'success');
            loadCourseCatalog();
          } else {
            showToast(data.error || 'Enrollment registration failed', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-plus"></i> Enroll Course';
          }
        } catch (err) {
          showToast('Could not register enrollment.', 'error');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-plus"></i> Enroll Course';
        }
      });
    });

    // Delete buttons (Instructor only)
    document.querySelectorAll('.btn-delete-course').forEach(btn => {
      btn.addEventListener('click', async () => {
        const courseId = btn.getAttribute('data-id');
        if (confirm('Are you absolutely sure you want to delete this course and purge all matching student enrollments?')) {
          try {
            const { status, data } = await apiCall(`/api/courses/${courseId}`, {
              method: 'DELETE'
            });

            if (data.success) {
              showToast(data.message, 'success');
              loadCourseCatalog();
            } else {
              showToast(data.error || 'Could not delete course', 'error');
            }
          } catch (err) {
            showToast('Delete operation failed.', 'error');
          }
        }
      });
    });

    // Edit buttons (Instructor only)
    document.querySelectorAll('.btn-edit-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.getAttribute('data-id');
        const course = coursesCache.find(c => c._id === courseId);
        if (course) {
          openCourseFormModal(course);
        }
      });
    });
  }

  // --- FILTERS BIND ---
  catalogSearch.addEventListener('input', filterAndRenderCatalog);
  filterCourseCategory.addEventListener('change', loadCourseCatalog);

  // ==========================================================================
  // MODULE D: MY ENROLLED COURSES / TEACHER MONITORS
  // ==========================================================================
  async function loadMyCoursesView() {
    mycoursesLoading.classList.remove('hidden');
    mycoursesListHook.innerHTML = '';
    mycoursesEmpty.classList.add('hidden');

    try {
      const { status, data } = await apiCall('/api/enrollments');
      mycoursesLoading.classList.add('hidden');
      enrollmentsCache = data.enrollments || [];

      if (enrollmentsCache.length === 0) {
        mycoursesEmpty.classList.remove('hidden');
        if (currentUser?.role === 'teacher') {
          mycoursesEmptyTitle.textContent = 'No Student Enrollments';
          mycoursesEmptyDesc.textContent = 'No students have enrolled in courses you teach yet.';
        } else {
          mycoursesEmptyTitle.textContent = 'No Enrolled Courses';
          mycoursesEmptyDesc.textContent = 'You are not enrolled in any catalog courses. Browse the course directory to get started!';
        }
        return;
      }

      mycoursesEmpty.classList.add('hidden');

      if (currentUser?.role === 'teacher') {
        // Render teacher monitors (Students active progress details)
        renderTeacherEnrollmentBoard();
      } else {
        // Render student enrolled courses
        renderStudentEnrolledCourses();
      }
    } catch (err) {
      mycoursesLoading.classList.add('hidden');
      mycoursesEmpty.classList.remove('hidden');
      showToast('Could not load course enrollment boards.', 'error');
    }
  }

  function renderStudentEnrolledCourses() {
    mycoursesListHook.innerHTML = '';

    enrollmentsCache.forEach(enrollment => {
      const course = enrollment.course;
      if (!course) return;

      const colorToken = getCategoryColorTokens(course.category);
      const card = document.createElement('div');
      card.className = 'course-card glass-card';
      card.style.setProperty('--card-color', colorToken.color);
      card.style.setProperty('--card-bg-glow', colorToken.bg);

      card.innerHTML = `
        <div class="card-top">
          <span class="subject-badge">${course.category}</span>
          <span class="status-badge ${enrollment.status}">${enrollment.status}</span>
        </div>
        <h2>${course.title}</h2>
        <p class="description">${course.description}</p>
        
        <div class="progress-block">
          <div class="progress-meta">
            <span>Course Progress</span>
            <span class="progress-pct-text">${enrollment.progress}%</span>
          </div>
          <div class="progress-outer-bar">
            <div class="progress-inner-bar" style="width: ${enrollment.progress}%;"></div>
          </div>
        </div>

        <div class="slider-group">
          <label>Update Progression</label>
          <input type="range" class="prog-slider" min="0" max="100" value="${enrollment.progress}" data-id="${enrollment._id}">
        </div>

        <div class="action-row" style="margin-top: 1.5rem;">
          <button class="btn btn-secondary btn-block btn-unenroll" data-id="${enrollment._id}"><i class="fa-solid fa-arrow-right-from-bracket"></i> Unenroll</button>
        </div>
      `;

      mycoursesListHook.appendChild(card);
    });

    bindStudentEnrolledButtons();
  }

  function bindStudentEnrolledButtons() {
    // Unenroll buttons
    document.querySelectorAll('.btn-unenroll').forEach(btn => {
      btn.addEventListener('click', async () => {
        const enrollmentId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to unenroll from this course? Your progress metrics will be deleted.')) {
          try {
            const { status, data } = await apiCall(`/api/enrollments/${enrollmentId}`, {
              method: 'DELETE'
            });

            if (data.success) {
              showToast(data.message, 'success');
              loadMyCoursesView();
            } else {
              showToast(data.error || 'Could not unenroll', 'error');
            }
          } catch (err) {
            showToast('Unenroll failed.', 'error');
          }
        }
      });
    });

    // Slider progression metrics listeners
    document.querySelectorAll('.prog-slider').forEach(slider => {
      slider.addEventListener('change', async (e) => {
        const enrollmentId = slider.getAttribute('data-id');
        const progress = e.target.value;
        const progressPctText = slider.closest('.course-card').querySelector('.progress-pct-text');
        const progressInnerBar = slider.closest('.course-card').querySelector('.progress-inner-bar');
        const statusBadge = slider.closest('.course-card').querySelector('.status-badge');

        try {
          const { status, data } = await apiCall(`/api/enrollments/${enrollmentId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ progress })
          });

          if (data.success) {
            progressPctText.textContent = `${progress}%`;
            progressInnerBar.style.width = `${progress}%`;
            
            // Update status pill
            statusBadge.textContent = data.enrollment.status;
            statusBadge.className = `status-badge ${data.enrollment.status}`;

            showToast(`Course progress synchronized to ${progress}%!`, 'success');
          } else {
            showToast(data.error || 'Progress sync failed', 'error');
          }
        } catch (err) {
          showToast('Failed to update progress.', 'error');
        }
      });
    });
  }

  function renderTeacherEnrollmentBoard() {
    mycoursesListHook.innerHTML = '';

    // Group enrollments by course taught
    const coursesGrouped = {};

    enrollmentsCache.forEach(enrollment => {
      const course = enrollment.course;
      if (!course) return;

      if (!coursesGrouped[course._id]) {
        coursesGrouped[course._id] = {
          title: course.title,
          category: course.category,
          duration: course.duration,
          students: []
        };
      }

      coursesGrouped[course._id].students.push({
        enrollmentId: enrollment._id,
        username: enrollment.student?.username || 'Unknown Student',
        email: enrollment.student?.email || '',
        progress: enrollment.progress,
        status: enrollment.status
      });
    });

    // Append course rosters cards
    Object.keys(coursesGrouped).forEach(courseId => {
      const courseDetails = coursesGrouped[courseId];
      const colorToken = getCategoryColorTokens(courseDetails.category);
      const card = document.createElement('div');
      card.className = 'course-card glass-card';
      card.style.setProperty('--card-color', colorToken.color);
      card.style.setProperty('--card-bg-glow', colorToken.bg);

      let studentsHtml = '';
      courseDetails.students.forEach(std => {
        studentsHtml += `
          <div class="teacher-monitor-row">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="monitor-student-name">${std.username}</span>
              <span class="status-badge ${std.status}" style="font-size: 0.65rem;">${std.status}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem;">${std.email}</div>
            <div class="progress-outer-bar" style="height: 4px;">
              <div class="progress-inner-bar" style="width: ${std.progress}%; background: ${std.progress === 100 ? '#10b981' : '#6366f1'}"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 600; margin-top: 2px;">
              <span>Metrics Completed</span>
              <span>${std.progress}%</span>
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="card-top">
          <span class="subject-badge">${courseDetails.category}</span>
          <span class="duration-badge"><i class="fa-regular fa-clock"></i> ${courseDetails.duration}</span>
        </div>
        <h2>${courseDetails.title}</h2>
        <div style="margin-top: 1rem; max-height: 250px; overflow-y: auto; padding-right: 4px;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--text-light)">Enrolled Roster (${courseDetails.students.length})</h4>
          ${studentsHtml}
        </div>
      `;

      mycoursesListHook.appendChild(card);
    });
  }

  // ==========================================================================
  // MODULE E: TEACHER SYLLABUS DRAFTING (MODALS SETUP)
  // ==========================================================================

  // Open creation modal
  function openCourseFormModal(course = null) {
    modalCourseForm.classList.add('active');
    
    if (course) {
      // Populate fields for EDIT
      courseModalTitle.textContent = 'Edit Course Specifications';
      btnCourseAction.textContent = 'Update Course Details';
      editCourseId.value = course._id;
      
      document.getElementById('course-title').value = course.title;
      document.getElementById('course-category').value = course.category;
      document.getElementById('course-duration').value = course.duration;
      document.getElementById('course-syllabus').value = course.syllabus ? course.syllabus.join(', ') : '';
      document.getElementById('course-desc').value = course.description;
    } else {
      // Reset fields for CREATE
      courseModalTitle.textContent = 'Register New Course';
      btnCourseAction.textContent = 'Register Course';
      editCourseId.value = '';
      courseFormElement.reset();
    }
  }

  function closeCourseFormModal() {
    modalCourseForm.classList.remove('active');
    courseFormElement.reset();
  }

  // Event maps
  if (btnCreateCourse) btnCreateCourse.addEventListener('click', () => openCourseFormModal());
  if (catalogBtnCreateFallback) catalogBtnCreateFallback.addEventListener('click', () => openCourseFormModal());
  modalCourseClose.addEventListener('click', closeCourseFormModal);
  modalCourseCancel.addEventListener('click', closeCourseFormModal);

  // Form submission handler
  courseFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const courseId = editCourseId.value;
    const isEdit = !!courseId;

    const title = document.getElementById('course-title').value;
    const category = document.getElementById('course-category').value;
    const duration = document.getElementById('course-duration').value;
    const desc = document.getElementById('course-desc').value;
    
    // Split syllabus topics by commas
    const syllabusInput = document.getElementById('course-syllabus').value;
    const syllabus = syllabusInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const bodyData = {
      title,
      category,
      duration,
      description: desc,
      syllabus
    };

    const endpoint = isEdit ? `/api/courses/${courseId}` : '/api/courses';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const { status, data } = await apiCall(endpoint, {
        method,
        body: JSON.stringify(bodyData)
      });

      if (data.success) {
        showToast(data.message, 'success');
        closeCourseFormModal();
        
        // Reload
        if (activeView === 'catalog') loadCourseCatalog();
        else switchView('catalog');
      } else {
        showToast(data.error || 'Syllabus validations failed', 'error');
      }
    } catch (err) {
      showToast('Syllabus submission failed.', 'error');
    }
  });

  // ==========================================================================
  // MODULE F: MOBILE DESIGN RESPONSIVE TOGGLES
  // ==========================================================================
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.add('active');
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }

  // --- INITIAL CHECK ON BOOT (PERSISTS SESSIONS) ---
  if (token && currentUser) {
    initializeWorkspace();
  } else {
    // Show Auth
    authContainer.classList.remove('hidden');
    authContainer.classList.add('active');
    appContainer.classList.add('hidden');
  }

  // Bind side link menus
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      switchView(targetView);
    });
  });
});
