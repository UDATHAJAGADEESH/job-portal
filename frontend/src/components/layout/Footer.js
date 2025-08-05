import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-primary-custom mb-3">JobPortal</h5>
            <p className="text-muted">
              Connecting talented professionals with amazing opportunities. 
              Find your dream job or hire the perfect candidate.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted fs-5">
                <FaGithub />
              </a>
              <a href="#" className="text-muted fs-5">
                <FaLinkedin />
              </a>
              <a href="#" className="text-muted fs-5">
                <FaTwitter />
              </a>
              <a href="mailto:contact@jobportal.com" className="text-muted fs-5">
                <FaEnvelope />
              </a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-primary-custom mb-3">For Job Seekers</h6>
            <ul className="list-unstyled">
              <li><Link to="/jobs" className="text-muted text-decoration-none">Browse Jobs</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Create Profile</Link></li>
              <li><Link to="/profile" className="text-muted text-decoration-none">My Profile</Link></li>
              <li><Link to="/my-applications" className="text-muted text-decoration-none">My Applications</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-primary-custom mb-3">For Recruiters</h6>
            <ul className="list-unstyled">
              <li><Link to="/register" className="text-muted text-decoration-none">Post a Job</Link></li>
              <li><Link to="/my-jobs" className="text-muted text-decoration-none">My Jobs</Link></li>
              <li><Link to="/profile" className="text-muted text-decoration-none">Company Profile</Link></li>
              <li><Link to="/applications" className="text-muted text-decoration-none">View Applications</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-primary-custom mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-muted text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-primary-custom mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/help" className="text-muted text-decoration-none">Help Center</Link></li>
              <li><Link to="/faq" className="text-muted text-decoration-none">FAQ</Link></li>
              <li><a href="mailto:support@jobportal.com" className="text-muted text-decoration-none">Contact Support</a></li>
              <li><Link to="/feedback" className="text-muted text-decoration-none">Feedback</Link></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © {currentYear} JobPortal. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              Made with ❤️ for job seekers and recruiters
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 