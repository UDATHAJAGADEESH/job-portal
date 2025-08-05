import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { jobsAPI, applicationsAPI, formatSalary, formatDate, getStatusColor, getJobTypeLabel, getExperienceLabel } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaDollarSign, 
  FaBuilding, 
  FaGlobe,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFileAlt,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
    notes: ''
  });

  const { data: job, isLoading, error } = useQuery(
    ['job', id],
    () => jobsAPI.getJob(id),
    {
      onSuccess: (data) => {
        // Increment view count
        jobsAPI.incrementViews(id);
      }
    }
  );

  const { data: hasApplied } = useQuery(
    ['has-applied', id],
    () => applicationsAPI.checkIfApplied(id),
    {
      enabled: isAuthenticated && user?.role === 'jobseeker'
    }
  );

  const applyMutation = useMutation(
    (data) => applicationsAPI.applyForJob(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['has-applied', id]);
        queryClient.invalidateQueries(['job', id]);
        toast.success('Application submitted successfully!');
        setShowApplyModal(false);
        setApplicationData({
          coverLetter: '',
          expectedSalary: '',
          availability: '',
          notes: ''
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit application');
      }
    }
  );

  const handleApply = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    applyMutation.mutate(applicationData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading job details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Job</Alert.Heading>
          <p>{error.message || 'Failed to load job details. Please try again later.'}</p>
          <Button as={Link} to="/jobs" variant="outline-danger">
            <FaArrowLeft className="me-2" />
            Back to Jobs
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Job Not Found</Alert.Heading>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/jobs" variant="outline-warning">
            <FaArrowLeft className="me-2" />
            Back to Jobs
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Back Button */}
      <Row className="mb-4">
        <Col>
          <Button as={Link} to="/jobs" variant="outline-secondary" className="mb-3">
            <FaArrowLeft className="me-2" />
            Back to Jobs
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Main Job Content */}
        <Col lg={8}>
          <Card className="card-custom mb-4">
            <Card.Body>
              {/* Job Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h1 className="fw-bold mb-2">{job.title}</h1>
                  <div className="d-flex align-items-center text-muted mb-3">
                    <FaBuilding className="me-2" />
                    <span className="me-3">{job.company?.name}</span>
                    <FaMapMarkerAlt className="me-2" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="text-end">
                  <Badge bg={getStatusColor(job.isActive ? 'active' : 'inactive')} className="mb-2">
                    {job.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className="text-muted small">
                    Posted {formatDate(job.createdAt)}
                  </div>
                </div>
              </div>

              {/* Job Stats */}
              <Row className="mb-4">
                <Col md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <FaBriefcase className="text-primary mb-2" />
                    <div className="fw-bold">{getJobTypeLabel(job.jobType)}</div>
                    <small className="text-muted">Job Type</small>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <FaUser className="text-success mb-2" />
                    <div className="fw-bold">{getExperienceLabel(job.experience)}</div>
                    <small className="text-muted">Experience</small>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <FaDollarSign className="text-warning mb-2" />
                    <div className="fw-bold">{formatSalary(job.salary)}</div>
                    <small className="text-muted">Salary</small>
                  </div>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="border rounded p-3">
                    <FaFileAlt className="text-info mb-2" />
                    <div className="fw-bold">{job.applications || 0}</div>
                    <small className="text-muted">Applications</small>
                  </div>
                </Col>
              </Row>

              {/* Job Description */}
              <div className="mb-4">
                <h5>Job Description</h5>
                <p className="text-muted">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-4">
                  <h5>Requirements</h5>
                  <ul className="text-muted">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="mb-4">
                  <h5>Responsibilities</h5>
                  <ul className="text-muted">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-4">
                  <h5>Required Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} bg="light" text="dark">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="mb-4">
                  <h5>Benefits</h5>
                  <ul className="text-muted">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application Deadline */}
              {job.applicationDeadline && (
                <div className="mb-4">
                  <h5>Application Deadline</h5>
                  <p className="text-muted">
                    <FaClock className="me-2" />
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Company Info */}
          <Card className="card-custom mb-4">
            <Card.Header>
              <h5 className="mb-0">Company Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="rounded"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                ) : (
                  <div className="bg-light rounded d-flex align-items-center justify-content-center mx-auto"
                       style={{ width: '100px', height: '100px' }}>
                    <FaBuilding className="fs-1 text-muted" />
                  </div>
                )}
              </div>
              <h6 className="fw-bold">{job.company?.name}</h6>
              {job.company?.website && (
                <p className="mb-2">
                  <FaGlobe className="me-2 text-muted" />
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                    {job.company.website}
                  </a>
                </p>
              )}
              {job.company?.description && (
                <p className="text-muted small">{job.company.description}</p>
              )}
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <Card className="card-custom mb-4">
            <Card.Body>
              {isAuthenticated && user?.role === 'jobseeker' ? (
                hasApplied ? (
                  <Button variant="success" className="w-100 mb-2" disabled>
                    <FaCheck className="me-2" />
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    variant="primary-custom" 
                    className="w-100 mb-2"
                    onClick={handleApply}
                    disabled={applyMutation.isLoading}
                  >
                    {applyMutation.isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <FaFileAlt className="me-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                )
              ) : (
                <Button 
                  variant="primary-custom" 
                  className="w-100 mb-2"
                  onClick={handleApply}
                >
                  <FaFileAlt className="me-2" />
                  Apply Now
                </Button>
              )}
              
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" className="flex-fill">
                  <FaHeart className="me-2" />
                  Save
                </Button>
                <Button variant="outline-secondary" className="flex-fill">
                  <FaShare className="me-2" />
                  Share
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Job Stats */}
          <Card className="card-custom">
            <Card.Header>
              <h5 className="mb-0">Job Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Views</span>
                <span className="fw-bold">{job.views || 0}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Applications</span>
                <span className="fw-bold">{job.applications || 0}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Days Posted</span>
                <span className="fw-bold">
                  {Math.ceil((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {job.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitApplication}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="expectedSalary"
                    value={applicationData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="Enter expected salary"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Availability</Form.Label>
                  <Form.Select
                    name="availability"
                    value={applicationData.availability}
                    onChange={handleInputChange}
                    className="form-control-custom"
                  >
                    <option value="">Select availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-months">2 months</option>
                    <option value="3-months">3 months</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="coverLetter"
                value={applicationData.coverLetter}
                onChange={handleInputChange}
                placeholder="Write a cover letter explaining why you're a good fit for this position..."
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={applicationData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to share..."
                className="form-control-custom"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary-custom"
              disabled={applyMutation.isLoading}
            >
              {applyMutation.isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to be logged in as a job seeker to apply for this position.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button as={Link} to="/login" variant="primary-custom">
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default JobDetail; 