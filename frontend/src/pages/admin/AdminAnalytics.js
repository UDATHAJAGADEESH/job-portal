import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { getAdminAnalytics } from '../../services/api';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartLine } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminAnalytics = () => {
  const { data: analytics, isLoading, error, refetch } = useQuery(
    ['adminAnalytics'],
    getAdminAnalytics,
    {
      refetchOnWindowFocus: false
    }
  );

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>Failed to load analytics. Please try again.</p>
          <button onClick={() => refetch()} className="btn btn-outline-danger">
            Retry
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics - Admin Dashboard</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">Platform Analytics</h1>
            <p className="text-muted">
              Comprehensive insights into platform performance and user activity
            </p>
          </Col>
        </Row>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaUsers className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                <h3 className="mb-2">{analytics?.totalUsers || 0}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaBriefcase className="text-success mb-3" style={{ fontSize: '2rem' }} />
                <h3 className="mb-2">{analytics?.totalJobs || 0}</h3>
                <p className="text-muted mb-0">Total Jobs</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaFileAlt className="text-info mb-3" style={{ fontSize: '2rem' }} />
                <h3 className="mb-2">{analytics?.totalApplications || 0}</h3>
                <p className="text-muted mb-0">Total Applications</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaChartLine className="text-warning mb-3" style={{ fontSize: '2rem' }} />
                <h3 className="mb-2">{analytics?.activeJobs || 0}</h3>
                <p className="text-muted mb-0">Active Jobs</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row>
          {/* User Registration Trends */}
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Registration Trends</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.userRegistrationTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Job Posting Trends */}
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Job Posting Trends</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.jobPostingTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="jobs" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Application Status Distribution */}
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Application Status Distribution</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.applicationStatusDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics?.applicationStatusDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Top Job Categories */}
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Top Job Categories</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.topJobCategories || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Stats */}
        <Row>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Demographics</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-6">
                    <h6>Job Seekers</h6>
                    <p className="text-muted">{analytics?.jobSeekers || 0}</p>
                  </div>
                  <div className="col-6">
                    <h6>Recruiters</h6>
                    <p className="text-muted">{analytics?.recruiters || 0}</p>
                  </div>
                  <div className="col-6">
                    <h6>Admins</h6>
                    <p className="text-muted">{analytics?.admins || 0}</p>
                  </div>
                  <div className="col-6">
                    <h6>Active Users</h6>
                    <p className="text-muted">{analytics?.activeUsers || 0}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Platform Performance</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-6">
                    <h6>Avg. Applications per Job</h6>
                    <p className="text-muted">{analytics?.avgApplicationsPerJob || 0}</p>
                  </div>
                  <div className="col-6">
                    <h6>Success Rate</h6>
                    <p className="text-muted">{analytics?.successRate || 0}%</p>
                  </div>
                  <div className="col-6">
                    <h6>Response Time</h6>
                    <p className="text-muted">{analytics?.avgResponseTime || 0} days</p>
                  </div>
                  <div className="col-6">
                    <h6>Platform Uptime</h6>
                    <p className="text-muted">{analytics?.uptime || 99.9}%</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminAnalytics; 