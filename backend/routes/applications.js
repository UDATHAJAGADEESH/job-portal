const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authenticateToken, isJobSeeker, isRecruiter, isOwner } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seekers only)
router.post('/', [
  authenticateToken,
  isJobSeeker,
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').trim().isLength({ min: 50 }).withMessage('Cover letter must be at least 50 characters'),
  body('resumeUrl').optional().isURL().withMessage('Invalid resume URL'),
  body('expectedSalary').optional().isNumeric().withMessage('Expected salary must be a number'),
  body('availability').optional().isIn(['immediate', '2-weeks', '1-month', '3-months', 'negotiable']).withMessage('Invalid availability'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter, resumeUrl, expectedSalary, availability, notes } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive || !job.isApproved) {
      return res.status(400).json({ message: 'This job is not available for applications' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      coverLetter,
      resumeUrl,
      expectedSalary,
      availability,
      notes
    });

    await application.save();

    // Increment job applications count
    await job.incrementApplications();

    // Populate application with job and applicant details
    await application.populate([
      { path: 'job', select: 'title company location' },
      { path: 'applicant', select: 'name email' },
      { path: 'recruiter', select: 'name email company' }
    ]);

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get applications submitted by current user
// @access  Private (Job Seekers only)
router.get('/my-applications', [authenticateToken, isJobSeeker], async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const query = { applicant: req.user._id };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location jobType salary')
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
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/recruiter/applications
// @desc    Get applications for jobs posted by current recruiter
// @access  Private (Recruiters only)
router.get('/recruiter/applications', [authenticateToken, isRecruiter], async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', jobId = '' } = req.query;

    const query = { recruiter: req.user._id };

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location jobType')
      .populate('applicant', 'name email bio skills experience location avatar')
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
    console.error('Get recruiter applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private (Owner or Admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title description requirements company location jobType salary')
      .populate('applicant', 'name email bio skills experience location avatar phone')
      .populate('recruiter', 'name email company')
      .lean();

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has permission to view this application
    const canView = req.user.role === 'admin' || 
                   application.applicant._id.toString() === req.user._id.toString() ||
                   application.recruiter._id.toString() === req.user._id.toString();

    if (canView) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ application });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (for recruiters)
// @access  Private (Recruiter or Admin)
router.put('/:id/status', [
  authenticateToken,
  isRecruiter,
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']).withMessage('Invalid status'),
  body('recruiterNotes').optional().trim(),
  body('interviewDate').optional().isISO8601().withMessage('Invalid interview date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, recruiterNotes, interviewDate } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the recruiter for this application
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update application
    application.status = status;
    if (recruiterNotes) application.recruiterNotes = recruiterNotes;
    if (interviewDate) application.interviewDate = interviewDate;
    
    if (status === 'reviewed') {
      application.reviewedAt = new Date();
    }

    await application.save();

    await application.populate([
      { path: 'job', select: 'title company' },
      { path: 'applicant', select: 'name email' }
    ]);

    res.json({
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (Applicant only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if application can be withdrawn
    if (application.status === 'hired') {
      return res.status(400).json({ message: 'Cannot withdraw a hired application' });
    }

    await application.withdraw();

    res.json({ message: 'Application withdrawn successfully' });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job
// @access  Private (Job owner or Admin)
router.get('/job/:jobId', [authenticateToken, isRecruiter], async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const { jobId } = req.params;

    // Check if job exists and user owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = { job: jobId };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('applicant', 'name email bio skills experience location avatar')
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
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/check-applied/:jobId
// @desc    Check if user has applied to a specific job
// @access  Private (Job seekers only)
router.get('/check-applied/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can check application status' });
    }

    const application = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    res.json({
      hasApplied: !!application,
      application: application ? {
        id: application._id,
        status: application.status,
        appliedAt: application.appliedAt
      } : null
    });

  } catch (error) {
    console.error('Check applied error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics for recruiter
// @access  Private (Recruiters only)
router.get('/stats', [authenticateToken, isRecruiter], async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: { recruiter: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ recruiter: req.user._id });
    const recentApplications = await Application.countDocuments({
      recruiter: req.user._id,
      appliedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const statsObject = {
      total: totalApplications,
      recent: recentApplications,
      byStatus: {}
    };

    stats.forEach(stat => {
      statsObject.byStatus[stat._id] = stat.count;
    });

    res.json(statsObject);

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 