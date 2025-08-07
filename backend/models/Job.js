const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'expert'],
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: true
  },
  company: {
    name: {
      type: String,
      required: true
    },
    description: String,
    website: String,
    logo: String
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  applicationDeadline: {
    type: Date
  },
  benefits: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({ title: 'text', description: 'text', skills: 'text', location: 'text' });

// Virtual for formatted salary
jobSchema.virtual('salaryRange').get(function() {
  return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()}`;
});

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment applications
jobSchema.methods.incrementApplications = function() {
  this.applications += 1;
  return this.save();
};

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);