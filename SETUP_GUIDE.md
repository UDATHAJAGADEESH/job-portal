# Job Portal - Complete Setup Guide

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. **Environment Configuration**
Make sure your `backend/config.env` file has the correct MongoDB URI:
```env
MONGODB_URI=mongodb+srv://udathajagadeesh918:p9GTUBKxeB0e2ugc@cluster0.fpewwmp.mongodb.net/job-portal?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. **Start Servers**
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

### 4. **Test Functionality**
```bash
# Run comprehensive tests
node test-functionality.js
```

## 🔧 Fixed Issues

### ✅ **API Service Fixed**
- Removed duplicate `deleteJob` exports
- Fixed function naming conflicts
- Properly organized API functions

### ✅ **Routing Fixed**
- Fixed `/jobs/post` route conflict
- Added missing `/profile` route
- Updated RecruiterRoute to allow admin access

### ✅ **Component Dependencies Fixed**
- Updated AdminJobs to use `deleteJobAdmin`
- Fixed all import statements
- Ensured proper function exports

## 📋 Complete Feature List

### ✅ **Authentication & Authorization**
- [x] User registration (Job Seeker, Recruiter)
- [x] User login with JWT
- [x] Password hashing with bcrypt
- [x] Role-based route protection
- [x] Password change functionality
- [x] Forgot password functionality

### ✅ **Job Management**
- [x] Create job listings (Recruiters)
- [x] Edit job listings (Recruiters)
- [x] Delete job listings (Recruiters)
- [x] View job details
- [x] Job search and filtering
- [x] Job status management
- [x] Job view tracking

### ✅ **Application Management**
- [x] Apply for jobs (Job Seekers)
- [x] View applications (Recruiters)
- [x] Update application status
- [x] Track application history
- [x] Check if already applied

### ✅ **User Profiles**
- [x] Job Seeker profiles with skills
- [x] Recruiter profiles with company info
- [x] Profile editing
- [x] Avatar upload functionality

### ✅ **Admin Dashboard**
- [x] User management
- [x] Job moderation
- [x] Application overview
- [x] Analytics and statistics

### ✅ **Additional Features**
- [x] Pagination
- [x] Search functionality
- [x] Responsive design
- [x] Error handling
- [x] Toast notifications

## 🌐 Access Points

### **Frontend URLs**
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Jobs**: http://localhost:3000/jobs
- **Post Job**: http://localhost:3000/jobs/post (Recruiters only)
- **Dashboard**: http://localhost:3000/dashboard (Job Seekers)
- **Recruiter Dashboard**: http://localhost:3000/recruiter/dashboard
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

### **Backend API**
- **Base URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🧪 Testing

### **Manual Testing Steps**
1. **Register as Job Seeker**
   - Go to http://localhost:3000/register
   - Fill in details and select "Job Seeker" role
   - Verify registration success

2. **Register as Recruiter**
   - Go to http://localhost:3000/register
   - Fill in details and select "Recruiter" role
   - Add company information
   - Verify registration success

3. **Login and Test Features**
   - Login with both accounts
   - Test job posting (Recruiter)
   - Test job application (Job Seeker)
   - Test profile management

### **Automated Testing**
```bash
# Run comprehensive API tests
node test-functionality.js
```

## 🔒 Security Features

### ✅ **Implemented Security**
- JWT token authentication
- Password hashing with bcrypt
- Input validation with express-validator
- CORS protection
- Role-based access control
- Secure file upload handling

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config.env              # Environment variables
│   ├── server.js               # Main server file
│   ├── models/                 # Database models
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   └── admin.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   └── uploads/                # File uploads
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   └── App.js              # Main app component
│   └── package.json
└── test-functionality.js       # Comprehensive tests
```

## 🚨 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**
   - Check your MongoDB URI in `config.env`
   - Ensure MongoDB Atlas is accessible
   - Verify network connectivity

2. **Port Already in Use**
   - Kill existing processes: `npx kill-port 3000 5000`
   - Or change ports in config files

3. **Module Not Found Errors**
   - Run `npm install` in both backend and frontend
   - Clear node_modules and reinstall if needed

4. **CORS Errors**
   - Check CORS configuration in backend
   - Ensure frontend proxy is set correctly

5. **JWT Token Issues**
   - Check JWT_SECRET in config.env
   - Clear localStorage and re-login

### **Debug Steps**
1. Check browser console for frontend errors
2. Check terminal for backend errors
3. Verify API endpoints with Postman
4. Check MongoDB connection
5. Validate environment variables

## 🎯 Success Criteria

Your job portal is working correctly when:

✅ **Job Seekers can:**
- Register and login
- Browse and search jobs
- Apply for jobs
- Manage their profile
- Track applications

✅ **Recruiters can:**
- Register and login
- Post new job listings
- Edit existing jobs
- View applications
- Manage company profile

✅ **Admins can:**
- Access admin dashboard
- Manage users
- Moderate jobs
- View analytics

✅ **All users can:**
- Navigate between pages
- See proper error messages
- Experience responsive design
- Use search and filtering

## 🎉 Final Notes

- All routes are now working correctly
- API functions are properly organized
- Security is implemented
- Testing is comprehensive
- Documentation is complete

**Your MERN Job Portal is now fully functional! 🚀**
