import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaSearch, 
  FaBriefcase, 
  FaUsers, 
  FaChartLine, 
  FaRocket, 
  FaShieldAlt,
  FaHandshake,
  FaGlobe
} from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <FaSearch className="text-primary-custom" />,
      title: 'Smart Job Search',
      description: 'Find the perfect job with our advanced search and filtering options.'
    },
    {
      icon: <FaBriefcase className="text-primary-custom" />,
      title: 'Easy Application',
      description: 'Apply to multiple jobs with just a few clicks and track your applications.'
    },
    {
      icon: <FaUsers className="text-primary-custom" />,
      title: 'Recruiter Tools',
      description: 'Post jobs, manage applications, and find the best candidates for your company.'
    },
    {
      icon: <FaChartLine className="text-primary-custom" />,
      title: 'Analytics Dashboard',
      description: 'Get insights into your job search or recruitment performance.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Jobs' },
    { number: '50,000+', label: 'Job Seekers' },
    { number: '5,000+', label: 'Companies' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-custom text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Find Your Dream Job or Hire the Perfect Candidate
              </h1>
              <p className="lead mb-4">
                Connect with opportunities that match your skills and aspirations. 
                Whether you're looking for your next career move or building your team, 
                we've got you covered.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      Get Started
                    </Button>
                    <Button as={Link} to="/jobs" variant="outline-light" size="lg">
                      Browse Jobs
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/jobs" variant="light" size="lg">
                      Browse Jobs
                    </Button>
                    {user?.role === 'recruiter' && (
                      <Button as={Link} to="/post-job" variant="outline-light" size="lg">
                        Post a Job
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '300px', height: '300px' }}>
                  <FaRocket className="display-1 text-white" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <div className="stats-card p-4">
                  <h2 className="text-primary-custom fw-bold mb-2">{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">Why Choose JobPortal?</h2>
              <p className="text-muted lead">
                We provide the tools and platform you need to succeed in your career journey
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="card-custom h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                           style={{ width: '60px', height: '60px' }}>
                        <span className="fs-3">{feature.icon}</span>
                      </div>
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary-custom text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold mb-4">Ready to Take the Next Step?</h2>
              <p className="lead mb-4">
                Join thousands of professionals who have found their dream jobs or 
                hired the perfect candidates through our platform.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      Create Account
                    </Button>
                    <Button as={Link} to="/jobs" variant="outline-light" size="lg">
                      Explore Jobs
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/profile" variant="light" size="lg">
                      Complete Profile
                    </Button>
                    <Button as={Link} to="/jobs" variant="outline-light" size="lg">
                      Find Jobs
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-4">Trusted by Leading Companies</h3>
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-5">
                <div className="text-muted">
                  <FaShieldAlt className="fs-1 mb-2" />
                  <p className="mb-0">Secure Platform</p>
                </div>
                <div className="text-muted">
                  <FaHandshake className="fs-1 mb-2" />
                  <p className="mb-0">Verified Employers</p>
                </div>
                <div className="text-muted">
                  <FaGlobe className="fs-1 mb-2" />
                  <p className="mb-0">Global Reach</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 