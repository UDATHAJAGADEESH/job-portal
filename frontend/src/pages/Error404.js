import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const Error404 = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <div className="mb-4">
            <FaExclamationTriangle className="display-1 text-warning mb-3" />
            <h1 className="display-4 fw-bold text-muted">404</h1>
            <h2 className="h3 mb-3">Page Not Found</h2>
            <p className="text-muted lead mb-4">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Button as={Link} to="/" variant="primary-custom" size="lg">
              <FaHome className="me-2" />
              Go Home
            </Button>
            <Button as={Link} to="/jobs" variant="outline-primary" size="lg">
              <FaSearch className="me-2" />
              Browse Jobs
            </Button>
          </div>

          <div className="mt-5">
            <h5 className="mb-3">Looking for something specific?</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <Link to="/jobs" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaSearch className="fs-2 text-primary mb-2" />
                      <h6>Find Jobs</h6>
                      <small className="text-muted">Browse available positions</small>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/register" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaHome className="fs-2 text-success mb-2" />
                      <h6>Create Account</h6>
                      <small className="text-muted">Join our community</small>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/contact" className="text-decoration-none">
                  <div className="card card-custom h-100 text-center">
                    <div className="card-body">
                      <FaExclamationTriangle className="fs-2 text-info mb-2" />
                      <h6>Contact Support</h6>
                      <small className="text-muted">Get help from our team</small>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Error404; 