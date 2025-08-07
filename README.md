# Job Portal - MERN Stack Application

A comprehensive job portal built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that connects job seekers with recruiters and employers.

## 🚀 Features

### For Job Seekers
- **Job Search & Filtering**: Advanced search with filters for location, job type, experience level, salary range
- **Job Applications**: Easy application process with cover letter and resume upload
- **Application Tracking**: Track application status and manage applications
- **Profile Management**: Complete profile with skills, experience, and resume
- **Job Alerts**: Get notified about new job opportunities

### For Recruiters
- **Job Posting**: Create and manage job listings with detailed requirements
- **Application Management**: Review and manage job applications
- **Candidate Search**: Search and filter candidates by skills and experience
- **Company Profile**: Manage company information and branding
- **Analytics Dashboard**: Track job performance and application metrics

### For Administrators
- **User Management**: Manage all users (job seekers, recruiters, admins)
- **Job Moderation**: Approve/reject job postings
- **System Analytics**: Comprehensive analytics and reporting
- **Content Management**: Manage platform content and settings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File upload handling
- **nodemailer** - Email functionality

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp config.env.example config.env
# Edit config.env with your configuration

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Environment Configuration

Create a `config.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/job-portal
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/job-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for password reset functionality)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config.env          # Environment variables
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # Database models
│   │   ├── User.js         # User model
│   │   ├── Job.js          # Job model
│   │   └── Application.js  # Application model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   ├── jobs.js         # Job management routes
│   │   ├── applications.js # Application routes
│   │   └── admin.js        # Admin routes
│   └── uploads/            # File uploads directory
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── auth/       # Authentication components
│   │   │   └── layout/     # Layout components
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── dashboard/  # Dashboard pages
│   │   │   ├── jobs/       # Job-related pages
│   │   │   └── applications/ # Application pages
│   │   ├── services/       # API services
│   │   │   └── api.js      # API configuration
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/recruiters` - Get all recruiters
- `GET /api/users/jobseekers` - Get all job seekers

### Jobs
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (recruiters only)
- `PUT /api/jobs/:id` - Update job (owner/admin only)
- `DELETE /api/jobs/:id` - Delete job (owner/admin only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs
- `POST /api/jobs/:id/toggle-status` - Toggle job status

### Applications
- `POST /api/applications` - Apply for a job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application
- `GET /api/applications/job/:jobId` - Get job applications (recruiter)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - Get all jobs for moderation
- `PUT /api/admin/jobs/:id/approve` - Approve/reject job
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/analytics` - Get analytics data

## 🎯 User Roles

### Job Seeker
- Browse and search jobs
- Apply for jobs
- Manage applications
- Update profile
- Upload resume

### Recruiter
- Post job listings
- Manage job postings
- Review applications
- Manage company profile
- View analytics

### Admin
- Manage all users
- Moderate job postings
- View system analytics
- Manage platform settings

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - Express-validator for data validation
- **CORS Protection** - Cross-origin resource sharing configuration
- **Rate Limiting** - API rate limiting to prevent abuse
- **File Upload Security** - Secure file upload handling

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
# In backend directory
heroku create your-job-portal-backend
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

```bash
# In frontend directory
npm run build
# Deploy the build folder to your hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/job-portal/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🙏 Acknowledgments

- React Bootstrap for UI components
- React Query for data fetching
- MongoDB for database
- Express.js community for excellent documentation

---

**Happy Coding! 🎉**
