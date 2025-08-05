import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch, FaFileAlt, FaUser, FaBookmark, FaEye } from 'react-icons/fa';

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Dashboard - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="mb-3">Welcome back, {user?.name}!</h1>
              <p className="text-muted">Manage your job search and applications</p>
            </div>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaFileAlt className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                <h4>Applications</h4>
                <p className="text-muted">Track your job applications</p>
                <Link to="/applications" className="btn btn-primary btn-sm">
                  View Applications
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaSearch className="text-success mb-3" style={{ fontSize: '2rem' }} />
                <h4>Find Jobs</h4>
                <p className="text-muted">Browse available positions</p>
                <Link to="/jobs" className="btn btn-success btn-sm">
                  Browse Jobs
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaUser className="text-info mb-3" style={{ fontSize: '2rem' }} />
                <h4>Profile</h4>
                <p className="text-muted">Update your profile</p>
                <Link to="/profile" className="btn btn-info btn-sm">
                  Edit Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaBookmark className="text-warning mb-3" style={{ fontSize: '2rem' }} />
                <h4>Saved Jobs</h4>
                <p className="text-muted">View your saved positions</p>
                <Link to="/jobs?saved=true" className="btn btn-warning btn-sm">
                  View Saved
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
                <h5 className="mb-0">Recent Job Applications</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-4">
                  <FaFileAlt className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                  <h6 className="text-muted">No recent applications</h6>
                  <p className="text-muted">Start applying to jobs to see your activity here</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
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
                  <Link to="/jobs" className="btn btn-outline-primary">
                    <FaSearch className="me-2" />
                    Search Jobs
                  </Link>
                  <Link to="/profile" className="btn btn-outline-secondary">
                    <FaUser className="me-2" />
                    Update Profile
                  </Link>
                  <Link to="/applications" className="btn btn-outline-info">
                    <FaFileAlt className="me-2" />
                    View Applications
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile Completion */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Profile Completion</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Profile Information</span>
                    <Badge bg="success">Complete</Badge>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Skills & Experience</span>
                    <Badge bg="warning">Incomplete</Badge>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Resume Upload</span>
                    <Badge bg="danger">Missing</Badge>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-danger" style={{ width: '0%' }}></div>
                  </div>
                </div>
                
                <Link to="/profile" className="btn btn-primary">
                  Complete Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default JobSeekerDashboard; 