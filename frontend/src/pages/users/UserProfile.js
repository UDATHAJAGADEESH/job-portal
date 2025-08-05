import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { getUserProfile } from '../../services/api';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGlobe, FaLinkedin, FaGithub } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile(id);
        setUser(userData);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load user profile');
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
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
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>User Not Found</Alert.Heading>
          <p>The user profile you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{user.name} - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="shadow">
              <Card.Body className="p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h2 className="mb-2">{user.name}</h2>
                  <Badge bg={user.role === 'recruiter' ? 'success' : 'info'} className="mb-3">
                    {user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                  </Badge>
                  {user.bio && <p className="text-muted">{user.bio}</p>}
                </div>

                {/* Contact Information */}
                <Row className="mb-4">
                  <Col md={6}>
                    <h5 className="mb-3">
                      <FaEnvelope className="me-2" />
                      Contact Information
                    </h5>
                    <div className="mb-2">
                      <strong>Email:</strong> {user.email}
                    </div>
                    {user.phone && (
                      <div className="mb-2">
                        <strong>Phone:</strong> {user.phone}
                      </div>
                    )}
                    {user.location && (
                      <div className="mb-2">
                        <FaMapMarkerAlt className="me-2" />
                        <strong>Location:</strong> {user.location}
                      </div>
                    )}
                    {user.website && (
                      <div className="mb-2">
                        <FaGlobe className="me-2" />
                        <strong>Website:</strong> 
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="ms-1">
                          {user.website}
                        </a>
                      </div>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <h5 className="mb-3">
                      <FaUser className="me-2" />
                      Profile Details
                    </h5>
                    <div className="mb-2">
                      <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    {user.role === 'jobseeker' && user.experience && (
                      <div className="mb-2">
                        <strong>Experience:</strong> {user.experience} years
                      </div>
                    )}
                    {user.role === 'recruiter' && user.company && (
                      <div className="mb-2">
                        <FaBuilding className="me-2" />
                        <strong>Company:</strong> {user.company}
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Skills (for job seekers) */}
                {user.role === 'jobseeker' && user.skills && user.skills.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Skills</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} bg="secondary" className="px-3 py-2">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Information (for recruiters) */}
                {user.role === 'recruiter' && user.companyInfo && (
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <FaBuilding className="me-2" />
                      Company Information
                    </h5>
                    <p className="text-muted">{user.companyInfo}</p>
                  </div>
                )}

                {/* Resume Link (for job seekers) */}
                {user.role === 'jobseeker' && user.resumeUrl && (
                  <div className="mb-4">
                    <h5 className="mb-3">Resume</h5>
                    <Button 
                      href={user.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      variant="outline-primary"
                    >
                      View Resume
                    </Button>
                  </div>
                )}

                {/* Social Links */}
                {(user.linkedin || user.github) && (
                  <div className="mb-4">
                    <h5 className="mb-3">Social Links</h5>
                    <div className="d-flex gap-3">
                      {user.linkedin && (
                        <Button 
                          href={user.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          variant="outline-primary"
                          size="sm"
                        >
                          <FaLinkedin className="me-2" />
                          LinkedIn
                        </Button>
                      )}
                      {user.github && (
                        <Button 
                          href={user.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          variant="outline-dark"
                          size="sm"
                        >
                          <FaGithub className="me-2" />
                          GitHub
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center">
                  {user.role === 'recruiter' ? (
                    <Link to={`/jobs?recruiter=${user._id}`} className="btn btn-primary me-2">
                      View Posted Jobs
                    </Link>
                  ) : (
                    <Link to="/jobs" className="btn btn-primary me-2">
                      Browse Jobs
                    </Link>
                  )}
                  <Link to="/" className="btn btn-outline-secondary">
                    Back to Home
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile; 