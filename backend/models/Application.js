const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String
  },
  expectedSalary: {
    type: Number
  },
  availability: {
    type: String,
    enum: ['immediate', '2-weeks', '1-month', '3-months', 'negotiable'],
    default: 'negotiable'
  },
  notes: {
    type: String
  },
  // Recruiter notes (private)
  recruiterNotes: {
    type: String
  },
  // Application tracking
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  interviewDate: {
    type: Date
  },
  isWithdrawn: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ recruiter: 1, status: 1 });

// Method to update status
applicationSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'reviewed') {
    this.reviewedAt = new Date();
  }
  return this.save();
};

// Method to withdraw application
applicationSchema.methods.withdraw = function() {
  this.isWithdrawn = true;
  this.status = 'withdrawn';
  return this.save();
};

// Virtual for application age
applicationSchema.virtual('age').get(function() {
  const now = new Date();
  const applied = this.appliedAt;
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
applicationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Application', applicationSchema);