import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle different error status codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        
        case 403:
          // Forbidden - user doesn't have permission
          toast.error('You do not have permission to perform this action.');
          break;
        
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
        
        case 422:
          // Validation errors
          if (response.data.errors) {
            response.data.errors.forEach(err => {
              toast.error(err.msg || 'Validation error');
            });
          } else {
            toast.error(response.data.message || 'Validation error');
          }
          break;
        
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
        
        default:
          // Other errors
          toast.error(response.data.message || 'An error occurred');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// API functions for different endpoints

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// Individual auth functions for direct use
export const login = (credentials) => authAPI.login(credentials);
export const register = (userData) => authAPI.register(userData);
export const getProfile = () => authAPI.getProfile();
export const changePassword = (passwords) => authAPI.changePassword(passwords);
export const forgotPassword = (email) => authAPI.forgotPassword(email);
export const resetPassword = (token, password) => authAPI.resetPassword(token, password);

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUser: (id) => api.get(`/users/${id}`),
  getRecruiters: (params) => api.get('/users/recruiters', { params }),
  getJobSeekers: (params) => api.get('/users/jobseekers', { params }),
  uploadAvatar: (avatarUrl) => api.post('/users/upload-avatar', { avatarUrl }),
  deleteAccount: () => api.delete('/users/profile'),
};

// Individual user functions for direct use
export const getUserProfile = (id) => api.get(`/users/${id}`);
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
export const getJobSeekers = (params) => api.get('/users/jobseekers', { params });
export const uploadAvatar = (avatarUrl) => api.post('/users/upload-avatar', { avatarUrl });
export const deleteAccount = () => api.delete('/users/profile');

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: (params) => api.get('/jobs/recruiter/my-jobs', { params }),
  toggleJobStatus: (id) => api.post(`/jobs/${id}/toggle-status`),
  getSearchSuggestions: (query) => api.get('/jobs/search/suggestions', { params: { q: query } }),
  incrementViews: (id) => api.post(`/jobs/${id}/increment-views`),
};

// Individual job functions for direct use
export const getAllJobs = (params) => jobsAPI.getJobs(params);
export const getJobById = (id) => jobsAPI.getJob(id);
export const createJob = (jobData) => jobsAPI.createJob(jobData);
export const updateJob = (id, jobData) => jobsAPI.updateJob(id, jobData);
export const getMyJobs = (params) => jobsAPI.getMyJobs(params);
export const toggleJobStatus = (id) => jobsAPI.toggleJobStatus(id);
export const incrementViews = (id) => jobsAPI.incrementViews(id);

// Applications API
export const applicationsAPI = {
  applyForJob: (applicationData) => api.post('/applications', applicationData),
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getRecruiterApplications: (params) => api.get('/applications/recruiter/applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getApplicationStats: () => api.get('/applications/stats'),
  checkIfApplied: (jobId) => api.get(`/applications/check-applied/${jobId}`),
};

// Individual application functions for direct use
export const applyToJob = (applicationData) => applicationsAPI.applyForJob(applicationData);
export const getMyApplications = (params) => applicationsAPI.getMyApplications(params);
export const getApplicationById = (id) => applicationsAPI.getApplication(id);
export const updateApplicationStatus = (id, status) => applicationsAPI.updateApplicationStatus(id, { status });
export const withdrawApplication = (id) => applicationsAPI.withdrawApplication(id);
export const getJobApplications = (jobId, params) => applicationsAPI.getJobApplications(jobId, params);
export const checkIfApplied = (jobId) => applicationsAPI.checkIfApplied(jobId);

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, status),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  approveJob: (id, approvalData) => api.put(`/admin/jobs/${id}/approve`, approvalData),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getApplications: (params) => api.get('/admin/applications', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// Individual admin functions for direct use
export const getAdminDashboard = () => adminAPI.getDashboard();
export const getAdminUsers = (params) => adminAPI.getUsers(params);
export const updateUserStatus = (id, status) => adminAPI.updateUserStatus(id, status);
export const deleteUser = (id) => adminAPI.deleteUser(id);
export const getAdminJobs = (params) => adminAPI.getJobs(params);
export const updateJobStatus = (id, status) => adminAPI.approveJob(id, { status });
export const deleteJob = (id) => adminAPI.deleteJob(id);
export const getAdminApplications = (params) => adminAPI.getApplications(params);
export const getAdminAnalytics = (params) => adminAPI.getAnalytics(params);

// Utility functions
export const formatSalary = (min, max, currency = 'USD') => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  if (min === max) {
    return formatNumber(min);
  }
  return `${formatNumber(min)} - ${formatNumber(max)}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    reviewed: 'info',
    shortlisted: 'success',
    rejected: 'danger',
    hired: 'success'
  };
  return statusColors[status] || 'secondary';
};

export const getExperienceLabel = (experience) => {
  const experienceLabels = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
    expert: 'Expert Level'
  };
  return experienceLabels[experience] || experience;
};

export const getJobTypeLabel = (jobType) => {
  const jobTypeLabels = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
    'remote': 'Remote'
  };
  return jobTypeLabels[jobType] || jobType;
};

export default api; 