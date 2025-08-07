const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Middleware to check if user has specific role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = authorizeRole('admin');

// Middleware to check if user is recruiter
const isRecruiter = authorizeRole('recruiter', 'admin');

// Middleware to check if user is job seeker
const isJobSeeker = authorizeRole('jobseeker', 'admin');

// Middleware to check if user owns the resource (for recruiters)
const isOwner = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      if (resource.recruiter && resource.recruiter.toString() === req.user._id.toString()) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied. Not the owner.' });
    } catch (error) {
      res.status(500).json({ message: 'Authorization error' });
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  isAdmin,
  isRecruiter,
  isJobSeeker,
  isOwner
};