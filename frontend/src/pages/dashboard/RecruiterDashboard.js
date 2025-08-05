import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { FaPlus, FaFileAlt, FaUsers, FaEye, FaBuilding } from 'react-icons/fa';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Recruiter Dashboard - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="mb-3">Welcome back, {user?.name}!</h1>
              <p className="text-muted">Manage your job postings and applications</p>
            </div>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaPlus className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                <h4>Post Job</h4>
                <p className="text-muted">Create a new job posting</p>
                <Link to="/jobs/post" className="btn btn-primary btn-sm">
                  Post New Job
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaFileAlt className="text-success mb-3" style={{ fontSize: '2rem' }} />
                <h4>My Jobs</h4>
                <p className="text-muted">Manage your job postings</p>
                <Link to="/recruiter/jobs" className="btn btn-success btn-sm">
                  View Jobs
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaUsers className="text-info mb-3" style={{ fontSize: '2rem' }} />
                <h4>Applications</h4>
                <p className="text-muted">Review job applications</p>
                <Link to="/applications" className="btn btn-info btn-sm">
                  View Applications
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaBuilding className="text-warning mb-3" style={{ fontSize: '2rem' }} />
                <h4>Company</h4>
                <p className="text-muted">Update company profile</p>
                <Link to="/profile" className="btn btn-warning btn-sm">
                  Edit Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Job Postings</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-4">
                  <FaFileAlt className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                  <h6 className="text-muted">No recent job postings</h6>
                  <p className="text-muted">Start posting jobs to see your activity here</p>
                  <Link to="/jobs/post" className="btn btn-primary">
                    Post Your First Job
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Link to="/jobs/post" className="btn btn-outline-primary">
                    <FaPlus className="me-2" />
                    Post New Job
                  </Link>
                  <Link to="/recruiter/jobs" className="btn btn-outline-secondary">
                    <FaFileAlt className="me-2" />
                    Manage Jobs
                  </Link>
                  <Link to="/profile" className="btn btn-outline-info">
                    <FaBuilding className="me-2" />
                    Company Profile
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Company Information */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Company Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Company Name:</strong>
                      <p className="text-muted">{user?.company || 'Not specified'}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Company Info:</strong>
                      <p className="text-muted">{user?.companyInfo || 'No company information provided'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Contact Email:</strong>
                      <p className="text-muted">{user?.email}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Location:</strong>
                      <p className="text-muted">{user?.location || 'Not specified'}</p>
                    </div>
                  </Col>
                </Row>
                <Link to="/profile" className="btn btn-primary">
                  Update Company Info
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecruiterDashboard; 