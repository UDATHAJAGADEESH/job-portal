import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getApplicationById, withdrawApplication } from '../../services/api';
import { FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaUser, FaEnvelope, FaPhone, FaFileAlt, FaArrowLeft } from 'react-icons/fa';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [withdrawing, setWithdrawing] = useState(false);

  const { data: application, isLoading, error } = useQuery(
    ['application', id],
    () => getApplicationById(id),
    {
      refetchOnWindowFocus: false
    }
  );

  const withdrawMutation = useMutation(withdrawApplication, {
    onSuccess: () => {
      toast.success('Application withdrawn successfully');
      queryClient.invalidateQueries(['myApplications']);
      navigate('/applications');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Pending' },
      reviewed: { bg: 'info', text: 'Reviewed' },
      shortlisted: { bg: 'primary', text: 'Shortlisted' },
      rejected: { bg: 'danger', text: 'Rejected' },
      accepted: { bg: 'success', text: 'Accepted' },
      withdrawn: { bg: 'secondary', text: 'Withdrawn' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWithdraw = async () => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      setWithdrawing(true);
      try {
        await withdrawMutation.mutateAsync(id);
      } finally {
        setWithdrawing(false);
      }
    }
  };

  if (isLoading) {
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
          <p>Failed to load application details.</p>
          <Link to="/applications" className="btn btn-outline-danger">
            Back to Applications
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Application Not Found</Alert.Heading>
          <p>The application you're looking for doesn't exist.</p>
          <Link to="/applications" className="btn btn-primary">
            Back to Applications
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Application Details - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/applications" className="btn btn-outline-secondary mb-3">
                  <FaArrowLeft className="me-2" />
                  Back to Applications
                </Link>
                <h1 className="mb-2">Application Details</h1>
                <p className="text-muted">
                  View details of your application for {application.job.title}
                </p>
              </div>
              <div className="d-flex gap-2">
                {application.status === 'pending' && (
                  <Button 
                    variant="outline-danger" 
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                  >
                    {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                  </Button>
                )}
                <Link to={`/jobs/${application.job._id}`} className="btn btn-primary">
                  View Job
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Job Information */}
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Job Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="mb-2">{application.job.title}</h4>
                    <p className="text-muted mb-2">
                      <FaBuilding className="me-2" />
                      {application.job.company}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <Row className="mb-3">
                  <Col md={6}>
                    <p className="mb-1">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      <strong>Location:</strong> {application.job.location}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <FaDollarSign className="me-2 text-muted" />
                      <strong>Salary:</strong> {application.job.salary}
                    </p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>Job Type:</strong> {application.job.jobType}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>Experience:</strong> {application.job.experience} years
                    </p>
                  </Col>
                </Row>

                <div className="mb-3">
                  <h6>Job Description</h6>
                  <p className="text-muted">{application.job.description}</p>
                </div>

                {application.job.requirements && (
                  <div className="mb-3">
                    <h6>Requirements</h6>
                    <ul className="text-muted">
                      {application.job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {application.job.skills && application.job.skills.length > 0 && (
                  <div>
                    <h6>Required Skills</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {application.job.skills.map((skill, index) => (
                        <Badge key={index} bg="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Application Details */}
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h5 className="mb-0">Application Details</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <p className="mb-1">
                    <FaCalendarAlt className="me-2 text-muted" />
                    <strong>Applied:</strong>
                  </p>
                  <small className="text-muted">
                    {formatDate(application.createdAt)}
                  </small>
                </div>

                <div className="mb-3">
                  <p className="mb-1">
                    <strong>Status:</strong>
                  </p>
                  {getStatusBadge(application.status)}
                </div>

                {application.updatedAt !== application.createdAt && (
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Last Updated:</strong>
                    </p>
                    <small className="text-muted">
                      {formatDate(application.updatedAt)}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Cover Letter</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">{application.coverLetter}</p>
                </Card.Body>
              </Card>
            )}

            {/* Resume */}
            {application.resumeUrl && (
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Resume</h5>
                </Card.Header>
                <Card.Body>
                  <Button 
                    href={application.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    variant="outline-primary"
                    className="w-100"
                  >
                    <FaFileAlt className="me-2" />
                    View Resume
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ApplicationDetail; 