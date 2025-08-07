import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import RecruiterRoute from './components/auth/RecruiterRoute';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActionButton from './components/layout/FloatingActionButton';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import UserProfile from './pages/users/UserProfile';

// Protected Pages - Job Seekers
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';
import MyApplications from './pages/applications/MyApplications';
import ApplicationDetail from './pages/applications/ApplicationDetail';

// Protected Pages - Recruiters
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import PostJob from './pages/jobs/PostJob';
import EditJob from './pages/jobs/EditJob';
import MyJobs from './pages/jobs/MyJobs';
import JobApplications from './pages/applications/JobApplications';

// Protected Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Job Portal - Find Your Dream Job</title>
        <meta name="description" content="Find your dream job or hire the best talent with our comprehensive job portal." />
      </Helmet>
      
      <div className="App">
        <Navbar />
        <FloatingActionButton />
        
        <main className="min-vh-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/users/:id" element={<UserProfile />} />
            
            {/* Protected Routes - Job Seekers */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <JobSeekerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/applications/:id" element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Recruiters */}
            <Route path="/recruiter/dashboard" element={
              <RecruiterRoute>
                <RecruiterDashboard />
              </RecruiterRoute>
            } />
            <Route path="/jobs/post" element={
              <RecruiterRoute>
                <PostJob />
              </RecruiterRoute>
            } />
            
            <Route path="/jobs/edit/:id" element={
              <RecruiterRoute>
                <EditJob />
              </RecruiterRoute>
            } />
            <Route path="/recruiter/jobs" element={
              <RecruiterRoute>
                <MyJobs />
              </RecruiterRoute>
            } />
            <Route path="/jobs/:id/applications" element={
              <RecruiterRoute>
                <JobApplications />
              </RecruiterRoute>
            } />
            
            {/* Protected Routes - Admin */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/jobs" element={
              <AdminRoute>
                <AdminJobs />
              </AdminRoute>
            } />
            <Route path="/admin/applications" element={
              <AdminRoute>
                <AdminApplications />
              </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            } />
            
            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 