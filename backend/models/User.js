const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'admin'],
    default: 'jobseeker'
  },
  // Job Seeker specific fields
  bio: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  resumeUrl: {
    type: String
  },
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'expert'],
    default: 'entry'
  },
  // Recruiter specific fields
  company: {
    name: String,
    description: String,
    website: String,
    location: String
  },
  // Common fields
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);