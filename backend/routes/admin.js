const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticateToken, isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get job statistics
    const jobStats = await Job.aggregate([
      {
        $group: {
          _id: '$isApproved',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activity
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentJobs = await Job.find()
      .populate('recruiter', 'name email company')
      .select('title company location createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentApplications = await Application.find()
      .populate('job', 'title')
      .populate('applicant', 'name email')
      .select('status appliedAt')
      .sort({ appliedAt: -1 })
      .limit(5)
      .lean();

    // Calculate totals
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingJobs = await Job.countDocuments({ isApproved: false });
    const activeJobs = await Job.countDocuments({ isActive: true, isApproved: true });

    // Format statistics
    const stats = {
      users: {
        total: totalUsers,
        byRole: {}
      },
      jobs: {
        total: totalJobs,
        pending: pendingJobs,
        active: activeJobs,
        byStatus: {}
      },
      applications: {
        total: totalApplications,
        byStatus: {}
      },
      recent: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      }
    };

    userStats.forEach(stat => {
      stats.users.byRole[stat._id] = stat.count;
    });

    jobStats.forEach(stat => {
      stats.jobs.byStatus[stat._id ? 'approved' : 'pending'] = stat.count;
    });

    applicationStats.forEach(stat => {
      stats.applications.byStatus[stat._id] = stat.count;
    });

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role = '', search = '', status = '' } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all jobs with pagination and filtering
// @access  Private (Admin only)
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '', recruiter = '' } = req.query;

    const query = {};

    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'active') {
      query.isActive = true;
      query.isApproved = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (recruiter) {
      query.recruiter = recruiter;
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email company')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/jobs/:id/approve
// @desc    Approve or reject a job
// @access  Private (Admin only)
router.put('/jobs/:id/approve', [
  body('isApproved').isBoolean().withMessage('isApproved must be a boolean'),
  body('reason').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isApproved, reason } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('recruiter', 'name email company');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      message: `Job ${isApproved ? 'approved' : 'rejected'} successfully`,
      job
    });

  } catch (error) {
    console.error('Approve job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job
// @access  Private (Admin only)
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications with pagination and filtering
// @access  Private (Admin only)
router.get('/applications', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', jobId = '', applicant = '' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    if (applicant) {
      query.applicant = applicant;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('applicant', 'name email')
      .populate('recruiter', 'name email company')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedAt: -1 })
      .lean();

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Job posting trends
    const jobTrends = await Job.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Application trends
    const applicationTrends = await Application.aggregate([
      {
        $match: { appliedAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top skills in job postings
    const topSkills = await Job.aggregate([
      {
        $unwind: '$skills'
      },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Top locations
    const topLocations = await Job.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      userTrends,
      jobTrends,
      applicationTrends,
      topSkills,
      topLocations
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 