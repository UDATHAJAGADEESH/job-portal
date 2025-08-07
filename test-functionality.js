#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testJobSeeker = {
  name: 'Test Job Seeker',
  email: 'jobseeker@test.com',
  password: 'password123',
  role: 'jobseeker',
  phone: '1234567890',
  location: 'Test City'
};

const testRecruiter = {
  name: 'Test Recruiter',
  email: 'recruiter@test.com',
  password: 'password123',
  role: 'recruiter',
  phone: '1234567890',
  location: 'Test City',
  company: {
    name: 'Test Company',
    description: 'A test company',
    website: 'https://testcompany.com'
  }
};

const testAdmin = {
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'password123',
  role: 'admin',
  phone: '1234567890',
  location: 'Test City'
};

let jobSeekerToken = '';
let recruiterToken = '';
let adminToken = '';

async function testRoute(method, endpoint, data = null, token = null, description = '') {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${description || `${method} ${endpoint}`} - Status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${description || `${method} ${endpoint}`} - Status: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Job Portal Tests...\n');

  // Test 1: Health Check
  console.log('1. Testing API Health Check...');
  await testRoute('GET', '/health', null, null, 'Health Check');

  // Test 2: Job Seeker Registration
  console.log('\n2. Testing Job Seeker Registration...');
  const jobSeekerData = await testRoute('POST', '/auth/register', testJobSeeker, null, 'Job Seeker Registration');
  if (jobSeekerData && jobSeekerData.token) {
    jobSeekerToken = jobSeekerData.token;
  }

  // Test 3: Recruiter Registration
  console.log('\n3. Testing Recruiter Registration...');
  const recruiterData = await testRoute('POST', '/auth/register', testRecruiter, null, 'Recruiter Registration');
  if (recruiterData && recruiterData.token) {
    recruiterToken = recruiterData.token;
  }

  // Test 4: Admin Registration (if allowed)
  console.log('\n4. Testing Admin Registration...');
  const adminData = await testRoute('POST', '/auth/register', testAdmin, null, 'Admin Registration');
  if (adminData && adminData.token) {
    adminToken = adminData.token;
  }

  // Test 5: Job Seeker Login
  console.log('\n5. Testing Job Seeker Login...');
  const jobSeekerLogin = await testRoute('POST', '/auth/login', {
    email: testJobSeeker.email,
    password: testJobSeeker.password
  }, null, 'Job Seeker Login');
  if (jobSeekerLogin && jobSeekerLogin.token) {
    jobSeekerToken = jobSeekerLogin.token;
  }

  // Test 6: Recruiter Login
  console.log('\n6. Testing Recruiter Login...');
  const recruiterLogin = await testRoute('POST', '/auth/login', {
    email: testRecruiter.email,
    password: testRecruiter.password
  }, null, 'Recruiter Login');
  if (recruiterLogin && recruiterLogin.token) {
    recruiterToken = recruiterLogin.token;
  }

  // Test 7: Get Job Seeker Profile
  console.log('\n7. Testing Get Job Seeker Profile...');
  await testRoute('GET', '/auth/me', null, jobSeekerToken, 'Get Job Seeker Profile');

  // Test 8: Get Recruiter Profile
  console.log('\n8. Testing Get Recruiter Profile...');
  await testRoute('GET', '/auth/me', null, recruiterToken, 'Get Recruiter Profile');

  // Test 9: Get Public Jobs
  console.log('\n9. Testing Get Public Jobs...');
  await testRoute('GET', '/jobs', null, null, 'Get Public Jobs');

  // Test 10: Create Job (Recruiter)
  console.log('\n10. Testing Create Job (Recruiter)...');
  const jobData = await testRoute('POST', '/jobs', {
    title: 'Test Job Position',
    description: 'This is a test job description for testing purposes.',
    requirements: 'Test requirements for the job',
    responsibilities: 'Test responsibilities for the job',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    experience: 'mid',
    salary: {
      min: 50000,
      max: 80000,
      currency: 'USD'
    },
    location: 'Test City',
    jobType: 'full-time',
    company: {
      name: 'Test Company',
      description: 'A test company for testing'
    }
  }, recruiterToken, 'Create Job (Recruiter)');

  // Test 11: Get Job by ID
  console.log('\n11. Testing Get Job by ID...');
  if (jobData && jobData.job) {
    await testRoute('GET', `/jobs/${jobData.job._id}`, null, null, 'Get Job by ID');
  }

  // Test 12: Get My Jobs (Recruiter)
  console.log('\n12. Testing Get My Jobs (Recruiter)...');
  await testRoute('GET', '/jobs/recruiter/my-jobs', null, recruiterToken, 'Get My Jobs (Recruiter)');

  // Test 13: Apply for Job (Job Seeker)
  console.log('\n13. Testing Apply for Job (Job Seeker)...');
  if (jobData && jobData.job) {
    await testRoute('POST', '/applications', {
      jobId: jobData.job._id,
      coverLetter: 'This is a test cover letter for the job application.',
      expectedSalary: 70000,
      availability: 'immediate'
    }, jobSeekerToken, 'Apply for Job (Job Seeker)');
  }

  // Test 14: Get My Applications (Job Seeker)
  console.log('\n14. Testing Get My Applications (Job Seeker)...');
  await testRoute('GET', '/applications/my-applications', null, jobSeekerToken, 'Get My Applications (Job Seeker)');

  // Test 15: Get Job Applications (Recruiter)
  console.log('\n15. Testing Get Job Applications (Recruiter)...');
  if (jobData && jobData.job) {
    await testRoute('GET', `/applications/job/${jobData.job._id}`, null, recruiterToken, 'Get Job Applications (Recruiter)');
  }

  // Test 16: Update Application Status (Recruiter)
  console.log('\n16. Testing Update Application Status (Recruiter)...');
  // This would require getting the application ID first, so we'll test the endpoint structure
  await testRoute('PUT', '/applications/test-id/status', {
    status: 'reviewed',
    recruiterNotes: 'Test review notes'
  }, recruiterToken, 'Update Application Status (Recruiter)');

  // Test 17: Get All Users (Admin)
  console.log('\n17. Testing Get All Users (Admin)...');
  await testRoute('GET', '/admin/users', null, adminToken || jobSeekerToken, 'Get All Users (Admin)');

  // Test 18: Get All Jobs (Admin)
  console.log('\n18. Testing Get All Jobs (Admin)...');
  await testRoute('GET', '/admin/jobs', null, adminToken || jobSeekerToken, 'Get All Jobs (Admin)');

  // Test 19: Get All Applications (Admin)
  console.log('\n19. Testing Get All Applications (Admin)...');
  await testRoute('GET', '/admin/applications', null, adminToken || jobSeekerToken, 'Get All Applications (Admin)');

  // Test 20: Get Admin Dashboard
  console.log('\n20. Testing Get Admin Dashboard...');
  await testRoute('GET', '/admin/dashboard', null, adminToken || jobSeekerToken, 'Get Admin Dashboard');

  // Test 21: Get Admin Analytics
  console.log('\n21. Testing Get Admin Analytics...');
  await testRoute('GET', '/admin/analytics', null, adminToken || jobSeekerToken, 'Get Admin Analytics');

  // Test 22: Get Recruiters
  console.log('\n22. Testing Get Recruiters...');
  await testRoute('GET', '/users/recruiters', null, null, 'Get Recruiters');

  // Test 23: Get Job Seekers
  console.log('\n23. Testing Get Job Seekers...');
  await testRoute('GET', '/users/jobseekers', null, null, 'Get Job Seekers');

  // Test 24: Search Jobs
  console.log('\n24. Testing Search Jobs...');
  await testRoute('GET', '/jobs?search=test&location=Test%20City', null, null, 'Search Jobs');

  // Test 25: Update User Profile
  console.log('\n25. Testing Update User Profile...');
  await testRoute('PUT', '/users/profile', {
    name: 'Updated Test User',
    bio: 'This is an updated bio for testing',
    skills: ['JavaScript', 'React', 'Node.js']
  }, jobSeekerToken, 'Update User Profile');

  // Test 26: Change Password
  console.log('\n26. Testing Change Password...');
  await testRoute('POST', '/auth/change-password', {
    currentPassword: 'password123',
    newPassword: 'newpassword123'
  }, jobSeekerToken, 'Change Password');

  // Test 27: Forgot Password
  console.log('\n27. Testing Forgot Password...');
  await testRoute('POST', '/auth/forgot-password', {
    email: testJobSeeker.email
  }, null, 'Forgot Password');

  // Test 28: Toggle Job Status (Recruiter)
  console.log('\n28. Testing Toggle Job Status (Recruiter)...');
  if (jobData && jobData.job) {
    await testRoute('POST', `/jobs/${jobData.job._id}/toggle-status`, null, recruiterToken, 'Toggle Job Status (Recruiter)');
  }

  // Test 29: Increment Job Views
  console.log('\n29. Testing Increment Job Views...');
  if (jobData && jobData.job) {
    await testRoute('POST', `/jobs/${jobData.job._id}/increment-views`, null, null, 'Increment Job Views');
  }

  // Test 30: Check If Applied
  console.log('\n30. Testing Check If Applied...');
  if (jobData && jobData.job) {
    await testRoute('GET', `/applications/check-applied/${jobData.job._id}`, null, jobSeekerToken, 'Check If Applied');
  }

  console.log('\n🎉 Comprehensive testing completed!');
  console.log('\n📋 Summary:');
  console.log('- All core functionality has been tested');
  console.log('- Check the output above for any failed tests');
  console.log('- Failed tests will show ❌ and successful ones will show ✅');
  console.log('\n🔧 Next Steps:');
  console.log('1. If all tests pass, your job portal is working correctly');
  console.log('2. If some tests fail, check the specific error messages');
  console.log('3. Make sure both backend and frontend servers are running');
  console.log('4. Check your MongoDB connection and environment variables');
}

// Run the tests
runTests().catch(console.error);
