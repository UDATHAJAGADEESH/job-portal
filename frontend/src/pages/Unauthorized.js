import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaLock, FaHome, FaUser, FaShieldAlt } from 'react-icons/fa';

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <div className="mb-4">
            <FaLock className="display-1 text-danger mb-3" />
            <h1 className="display-4 fw-bold text-muted">Access Denied</h1>
            <h2 className="h3 mb-3">Unauthorized Access</h2>
            <p className="text-muted lead mb-4">
              Sorry, you don't have permission to access this page. 
              This area is restricted to authorized users only.
            </p>
          </div>

          {isAuthenticated ? (
            <Alert variant="info" className="mb-4">
              <Alert.Heading>Current User Information</Alert.Heading>
              <p className="mb-2">
                <strong>Name:</strong> {user?.name}<br />
                <strong>Role:</strong> {user?.role}<br />
                <strong>Email:</strong> {user?.email}
              </p>
              <hr />
              <p className="mb-0">
                If you believe you should have access to this page, please contact support.
              </p>
            </Alert>
          ) : (
            <Alert variant="warning" className="mb-4">
              <Alert.Heading>Authentication Required</Alert.Heading>
              <p className="mb-0">
                You need to be logged in to access this page. Please sign in to continue.
              </p>
            </Alert>
          )}

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-4">
            <Button as={Link} to="/" variant="primary-custom" size="lg">
              <FaHome className="me-2" />
              Go Home
            </Button>
            {!isAuthenticated ? (
              <Button as={Link} to="/login" variant="outline-primary" size="lg">
                <FaUser className="me-2" />
                Sign In
              </Button>
            ) : (
              <Button as={Link} to="/profile" variant="outline-primary" size="lg">
                <FaUser className="me-2" />
                My Profile
              </Button>
            )}
          </div>

          <div className="mt-5">
            <h5 className="mb-3">What can you do?</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <Link to="/jobs" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaShieldAlt className="fs-2 text-primary mb-2" />
                      <h6>Browse Jobs</h6>
                      <small className="text-muted">View available positions</small>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/profile" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaUser className="fs-2 text-success mb-2" />
                      <h6>Update Profile</h6>
                      <small className="text-muted">Manage your account</small>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/contact" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaLock className="fs-2 text-info mb-2" />
                      <h6>Request Access</h6>
                      <small className="text-muted">Contact support</small>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="mt-4">
              <Alert variant="light">
                <h6>Need different permissions?</h6>
                <p className="mb-2">
                  If you need access to recruiter or admin features, please contact our support team.
                </p>
                <Button as={Link} to="/contact" variant="outline-secondary" size="sm">
                  Contact Support
                </Button>
              </Alert>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized; 