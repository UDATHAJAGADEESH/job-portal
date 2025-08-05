import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaBriefcase, 
  FaFileAlt, 
  FaChartLine,
  FaUserCheck,
  FaUserTimes,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery(
    ['admin-dashboard'],
    () => adminAPI.getDashboardStats(),
    {
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  );

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    ['admin-analytics'],
    () => adminAPI.getAnalytics(),
    {
      enabled: activeTab === 'analytics'
    }
  );

  const { data: usersData, isLoading: usersLoading } = useQuery(
    ['admin-users'],
    () => adminAPI.getAllUsers({ page: 1, limit: 10 }),
    {
      enabled: activeTab === 'users'
    }
  );

  const { data: jobsData, isLoading: jobsLoading } = useQuery(
    ['admin-jobs'],
    () => adminAPI.getAllJobs({ page: 1, limit: 10 }),
    {
      enabled: activeTab === 'jobs'
    }
  );

  const { data: applicationsData, isLoading: applicationsLoading } = useQuery(
    ['admin-applications'],
    () => adminAPI.getAllApplications({ page: 1, limit: 10 }),
    {
      enabled: activeTab === 'applications'
    }
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (dashboardLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (dashboardError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{dashboardError.message || 'Failed to load dashboard data.'}</p>
        </Alert>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData?.totalUsers || 0,
      icon: <FaUsers className="text-primary" />,
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Jobs',
      value: dashboardData?.activeJobs || 0,
      icon: <FaBriefcase className="text-success" />,
      color: 'success',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Applications',
      value: dashboardData?.totalApplications || 0,
      icon: <FaFileAlt className="text-info" />,
      color: 'info',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Approvals',
      value: dashboardData?.pendingApprovals || 0,
      icon: <FaUserCheck className="text-warning" />,
      color: 'warning',
      change: '-5%',
      changeType: 'negative'
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Admin Dashboard</h1>
          <p className="text-muted">Monitor and manage your job portal</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col lg={3} md={6} key={index} className="mb-3">
            <Card className="stats-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h3 className="fw-bold mb-1">{stat.value.toLocaleString()}</h3>
                    <small className={`text-${stat.changeType === 'positive' ? 'success' : 'danger'}`}>
                      {stat.change} from last month
                    </small>
                  </div>
                  <div className="fs-1 opacity-25">
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Navigation Tabs */}
      <Card className="card-custom">
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="analytics">Analytics</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="users">Users</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="jobs">Jobs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="applications">Applications</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            {/* Overview Tab */}
            <Tab.Pane active={activeTab === 'overview'}>
              <Row>
                <Col lg={8}>
                  <h5 className="mb-3">Recent Activity</h5>
                  <div className="border rounded p-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '40px', height: '40px' }}>
                        <FaUsers className="text-white" />
                      </div>
                      <div>
                        <strong>New user registered</strong>
                        <p className="text-muted mb-0 small">John Doe joined as a job seeker</p>
                      </div>
                      <small className="text-muted ms-auto">2 hours ago</small>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '40px', height: '40px' }}>
                        <FaBriefcase className="text-white" />
                      </div>
                      <div>
                        <strong>New job posted</strong>
                        <p className="text-muted mb-0 small">Senior Developer at Tech Corp</p>
                      </div>
                      <small className="text-muted ms-auto">4 hours ago</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '40px', height: '40px' }}>
                        <FaFileAlt className="text-white" />
                      </div>
                      <div>
                        <strong>New application</strong>
                        <p className="text-muted mb-0 small">Application for Frontend Developer</p>
                      </div>
                      <small className="text-muted ms-auto">6 hours ago</small>
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <h5 className="mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <Button as={Link} to="/admin/users" variant="outline-primary">
                      <FaUsers className="me-2" />
                      Manage Users
                    </Button>
                    <Button as={Link} to="/admin/jobs" variant="outline-success">
                      <FaBriefcase className="me-2" />
                      Manage Jobs
                    </Button>
                    <Button as={Link} to="/admin/applications" variant="outline-info">
                      <FaFileAlt className="me-2" />
                      View Applications
                    </Button>
                    <Button variant="outline-secondary">
                      <FaDownload className="me-2" />
                      Export Data
                    </Button>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Analytics Tab */}
            <Tab.Pane active={activeTab === 'analytics'}>
              {analyticsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Row>
                  <Col lg={8}>
                    <h5 className="mb-3">User Registration Trends</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData?.userTrends || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col lg={4}>
                    <h5 className="mb-3">User Distribution</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData?.userDistribution || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData?.userDistribution?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              )}
            </Tab.Pane>

            {/* Users Tab */}
            <Tab.Pane active={activeTab === 'users'}>
              {usersLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Users</h5>
                    <Button as={Link} to="/admin/users" variant="primary" size="sm">
                      View All Users
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData?.users?.map(user => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'recruiter' ? 'success' : 'primary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={user.isActive ? 'success' : 'secondary'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1">
                                <FaEye />
                              </Button>
                              <Button variant="outline-warning" size="sm" className="me-1">
                                <FaEdit />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Tab.Pane>

            {/* Jobs Tab */}
            <Tab.Pane active={activeTab === 'jobs'}>
              {jobsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Jobs</h5>
                    <Button as={Link} to="/admin/jobs" variant="primary" size="sm">
                      View All Jobs
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Applications</th>
                          <th>Posted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobsData?.jobs?.map(job => (
                          <tr key={job._id}>
                            <td>{job.title}</td>
                            <td>{job.company?.name}</td>
                            <td>
                              <Badge bg={job.isActive ? 'success' : 'secondary'}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>{job.applications || 0}</td>
                            <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1">
                                <FaEye />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1">
                                <FaCheck />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <FaTimes />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Tab.Pane>

            {/* Applications Tab */}
            <Tab.Pane active={activeTab === 'applications'}>
              {applicationsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Applications</h5>
                    <Button as={Link} to="/admin/applications" variant="primary" size="sm">
                      View All Applications
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Applicant</th>
                          <th>Job</th>
                          <th>Status</th>
                          <th>Applied</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicationsData?.applications?.map(application => (
                          <tr key={application._id}>
                            <td>{application.applicant?.name}</td>
                            <td>{application.job?.title}</td>
                            <td>
                              <Badge bg={
                                application.status === 'pending' ? 'warning' :
                                application.status === 'accepted' ? 'success' :
                                application.status === 'rejected' ? 'danger' : 'secondary'
                              }>
                                {application.status}
                              </Badge>
                            </td>
                            <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1">
                                <FaEye />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1">
                                <FaCheck />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <FaTimes />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 