const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { authenticateToken, isRecruiter, isOwner } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Recruiters only)
router.post('/', [
  authenticateToken,
  isRecruiter,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('requirements').trim().isLength({ min: 10 }).withMessage('Requirements must be at least 10 characters'),
  body('responsibilities').trim().isLength({ min: 10 }).withMessage('Responsibilities must be at least 10 characters'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('experience').isIn(['entry', 'mid', 'senior', 'expert']).withMessage('Invalid experience level'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('company.name').trim().notEmpty().withMessage('Company name is required'),
  body('applicationDeadline').optional().isISO8601().withMessage('Invalid deadline date'),
  body('benefits').optional().isArray().withMessage('Benefits must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      recruiter: req.user._id
    };

    // Auto-approve jobs for admin users
    if (req.user.role === 'admin') {
      jobData.isApproved = true;
    }

    const job = new Job(jobData);
    await job.save();

    await job.populate('recruiter', 'name email company');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      location = '',
      jobType = '',
      experience = '',
      minSalary = '',
      maxSalary = '',
      skills = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isApproved: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Experience filter
    if (experience) {
      query.experience = experience;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseInt(minSalary);
      if (maxSalary) query.salary.$lte = parseInt(maxSalary);
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email company')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort)
      .lean();

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email company avatar')
      .lean();

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive || !job.isApproved) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ job });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Owner or Admin)
router.put('/:id', [
  authenticateToken,
  isOwner(Job),
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('requirements').optional().trim().isLength({ min: 10 }).withMessage('Requirements must be at least 10 characters'),
  body('responsibilities').optional().trim().isLength({ min: 10 }).withMessage('Responsibilities must be at least 10 characters'),
  body('skills').optional().isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('experience').optional().isIn(['entry', 'mid', 'senior', 'expert']).withMessage('Invalid experience level'),
  body('salary.min').optional().isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').optional().isNumeric().withMessage('Maximum salary must be a number'),
  body('location').optional().trim().notEmpty().withMessage('Location is required'),
  body('jobType').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('company.name').optional().trim().notEmpty().withMessage('Company name is required'),
  body('applicationDeadline').optional().isISO8601().withMessage('Invalid deadline date'),
  body('benefits').optional().isArray().withMessage('Benefits must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('recruiter', 'name email company');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Owner or Admin)
router.delete('/:id', [authenticateToken, isOwner(Job)], async (req, res) => {
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

// @route   GET /api/jobs/recruiter/my-jobs
// @desc    Get jobs posted by current recruiter
// @access  Private (Recruiters only)
router.get('/recruiter/my-jobs', [authenticateToken, isRecruiter], async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const query = { recruiter: req.user._id };

    if (status === 'active') {
      query.isActive = true;
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'inactive') {
      query.isActive = false;
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
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/toggle-status
// @desc    Toggle job active status
// @access  Private (Owner or Admin)
router.post('/:id/toggle-status', [authenticateToken, isOwner(Job)], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json({
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
      job
    });

  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/increment-views
// @desc    Increment job view count
// @access  Public
router.post('/:id/increment-views', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.views = (job.views || 0) + 1;
    await job.save();

    res.json({ message: 'View count incremented' });

  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Job.aggregate([
      {
        $match: {
          $text: { $search: q },
          isActive: true,
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$title',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({ suggestions: suggestions.map(s => s._id) });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 