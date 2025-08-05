import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaExclamationTriangle, FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center shadow">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <FaExclamationTriangle className="text-warning mb-3" style={{ fontSize: '4rem' }} />
                  <h1 className="display-1 text-muted">404</h1>
                  <h2 className="mb-3">Page Not Found</h2>
                  <p className="text-muted mb-4">
                    Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                  </p>
                </div>

                <div className="d-grid gap-3">
                  <Button as={Link} to="/" variant="primary" size="lg">
                    <FaHome className="me-2" />
                    Go to Homepage
                  </Button>
                  
                  <Button as={Link} to="/jobs" variant="outline-primary">
                    <FaSearch className="me-2" />
                    Browse Jobs
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => window.history.back()}
                  >
                    <FaArrowLeft className="me-2" />
                    Go Back
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="text-muted small">
                    If you believe this is an error, please contact our support team.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotFound; 