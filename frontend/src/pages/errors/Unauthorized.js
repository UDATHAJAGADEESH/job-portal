import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaLock, FaHome, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <>
      <Helmet>
        <title>Access Denied | Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center shadow">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <FaLock className="text-danger mb-3" style={{ fontSize: '4rem' }} />
                  <h1 className="mb-3">Access Denied</h1>
                  <p className="text-muted mb-4">
                    Sorry, you don't have permission to access this page. This area is restricted to authorized users only.
                  </p>
                </div>

                <div className="d-grid gap-3">
                  <Button as={Link} to="/" variant="primary" size="lg">
                    <FaHome className="me-2" />
                    Go to Homepage
                  </Button>
                  
                  <Button as={Link} to="/login" variant="outline-primary">
                    <FaSignInAlt className="me-2" />
                    Login
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
                    If you believe you should have access to this page, please contact our support team.
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

export default Unauthorized; 