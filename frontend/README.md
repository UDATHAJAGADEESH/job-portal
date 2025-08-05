# JobPortal Frontend

A modern, responsive React.js frontend for the MERN Stack Job Portal application. This frontend provides an intuitive user interface for job seekers, recruiters, and administrators to interact with the job portal system.

## 🚀 Features

### 🔐 Authentication & Authorization
- **User Registration**: Role-based registration (Job Seeker, Recruiter)
- **User Login**: Secure JWT-based authentication
- **Role-based Access Control**: Different interfaces for different user roles
- **Protected Routes**: Automatic redirection for unauthorized access
- **Profile Management**: Complete user profile management with avatar upload

### 💼 Job Management
- **Job Listings**: Comprehensive job search with advanced filtering
- **Job Details**: Detailed job information with company details
- **Job Applications**: Easy application process for job seekers
- **Job Posting**: Recruiters can create and manage job posts
- **Job Search**: Advanced search with filters (location, salary, skills, etc.)

### 👥 User Management
- **User Profiles**: Detailed profiles for job seekers and recruiters
- **Company Profiles**: Company information for recruiters
- **Application Tracking**: Job seekers can track their applications
- **Application Management**: Recruiters can manage job applications

### 🛠️ Admin Dashboard
- **Analytics**: Comprehensive dashboard with charts and statistics
- **User Management**: Admin can manage all users
- **Job Management**: Admin can approve/reject job posts
- **Application Overview**: View all applications across the platform

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI**: Clean, professional interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client-side and server-side validation

## 🛠️ Tech Stack

### Core Technologies
- **React.js 18**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing
- **React Query**: Data fetching, caching, and state management
- **React Bootstrap**: UI components based on Bootstrap 5

### State Management
- **React Context API**: Global state management for authentication
- **React Query**: Server state management and caching
- **Local State**: Component-level state with useState and useReducer

### Styling & UI
- **Bootstrap 5**: CSS framework for responsive design
- **React Bootstrap**: Bootstrap components for React
- **React Icons**: Icon library
- **Custom CSS**: Custom styling and animations

### Development Tools
- **Create React App**: Development environment
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React Developer Tools**: Browser extension for debugging

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── RecruiterRoute.js
│   │   │   └── AdminRoute.js
│   │   └── layout/
│   │       ├── Navbar.js
│   │       └── Footer.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── jobs/
│   │   │   ├── JobList.js
│   │   │   └── JobDetail.js
│   │   ├── admin/
│   │   │   └── AdminDashboard.js
│   │   ├── Home.js
│   │   ├── Profile.js
│   │   ├── Error404.js
│   │   └── Unauthorized.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## 🔧 Configuration

### API Configuration
The frontend is configured to connect to the backend API. The base URL is set in `src/services/api.js` and can be customized via environment variables.

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)
- `REACT_APP_ENV`: Environment (development/production)

## 📱 User Roles & Features

### 👤 Job Seeker
- **Browse Jobs**: Search and filter job listings
- **Apply for Jobs**: Submit applications with cover letters
- **Track Applications**: View application status and history
- **Manage Profile**: Update personal information and skills
- **Save Jobs**: Bookmark interesting positions

### 🏢 Recruiter
- **Post Jobs**: Create and manage job listings
- **View Applications**: Review and manage job applications
- **Company Profile**: Manage company information
- **Analytics**: View job performance metrics

### 👨‍💼 Admin
- **Dashboard**: Overview of platform statistics
- **User Management**: Manage all users (approve, block, delete)
- **Job Management**: Approve/reject job posts
- **Analytics**: Comprehensive platform analytics
- **System Settings**: Platform configuration

## 🎨 UI Components

### Custom CSS Classes
- `.text-primary-custom`: Custom primary color
- `.bg-primary-custom`: Custom primary background
- `.btn-primary-custom`: Custom primary button
- `.card-custom`: Custom card styling
- `.form-control-custom`: Custom form control styling
- `.navbar-custom`: Custom navbar styling
- `.job-card`: Job listing card styling
- `.status-badge`: Status indicator styling
- `.stats-card`: Statistics card styling

### Responsive Design
The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage in localStorage
- Protected route components

### Authorization
- Role-based access control
- Route-level protection
- Component-level permission checks
- API request authorization

### Data Validation
- Client-side form validation
- Server-side validation feedback
- Input sanitization
- XSS protection

## 📊 State Management

### Global State (AuthContext)
- User authentication state
- User profile information
- Login/logout functionality
- Token management

### Server State (React Query)
- API data caching
- Background data updates
- Optimistic updates
- Error handling

### Local State
- Form data
- UI state (modals, loading states)
- Component-specific data

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration (all roles)
- [ ] User login/logout
- [ ] Job browsing and search
- [ ] Job application process
- [ ] Profile management
- [ ] Admin dashboard functionality
- [ ] Responsive design on different devices
- [ ] Error handling and edge cases

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Heroku**: Deploy with buildpack

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

### CSS
- Use Bootstrap classes when possible
- Custom CSS for specific styling needs
- Follow BEM methodology for custom classes
- Use CSS variables for consistent theming

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend server is running
   - Verify API URL in environment variables
   - Check CORS configuration

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT token expiration
   - Verify user role permissions

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for syntax errors in components
   - Verify all imports are correct

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Bootstrap team for the UI framework
- React Query team for state management
- All contributors and users of this project 