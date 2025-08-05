import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getJobApplications, updateApplicationStatus } from '../../services/api';
import { FaUser, FaEnvelope, FaPhone, FaFileAlt, FaCalendarAlt, FaEye } from 'react-icons/fa';

const JobApplications = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'date'
  });

  const { data: applications, isLoading, error, refetch } = useQuery(
    ['jobApplications', id, filters],
    () => getJobApplications(id, filters),
    {
      refetchOnWindowFocus: false
    }
  );

  const updateStatusMutation = useMutation(updateApplicationStatus, {
    onSuccess: () => {
      toast.success('Application status updated successfully');
      queryClient.invalidateQueries(['jobApplications']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update application status');
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
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusUpdate = (applicationId, newStatus) => {
    updateStatusMutation.mutate({ id: applicationId, status: newStatus });
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
          <p>Failed to load applications. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline-danger">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Job Applications - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/recruiter/jobs" className="btn btn-outline-secondary mb-3">
                  ← Back to Jobs
                </Link>
                <h1 className="mb-2">Job Applications</h1>
                <p className="text-muted">
                  Review applications for your job posting
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filter by Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="withdrawn">Withdrawn</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="date">Application Date</option>
                <option value="name">Applicant Name</option>
                <option value="status">Status</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Applications List */}
        {applications && applications.length > 0 ? (
          <Row>
            {applications.map((application) => (
              <Col key={application._id} lg={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">
                          <Link 
                            to={`/users/${application.applicant._id}`}
                            className="text-decoration-none"
                          >
                            {application.applicant.name}
                          </Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <FaEnvelope className="me-2" />
                          {application.applicant.email}
                        </p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="mb-3">
                      <div className="row text-muted small">
                        <div className="col-6">
                          <FaCalendarAlt className="me-1" />
                          Applied {formatDate(application.createdAt)}
                        </div>
                        {application.applicant.phone && (
                          <div className="col-6">
                            <FaPhone className="me-1" />
                            {application.applicant.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="mb-3">
                        <small className="text-muted">Cover Letter:</small>
                        <p className="small mb-0">
                          {application.coverLetter.length > 100 
                            ? `${application.coverLetter.substring(0, 100)}...` 
                            : application.coverLetter
                          }
                        </p>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/users/${application.applicant._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaUser className="me-1" />
                          View Profile
                        </Link>
                        {application.resumeUrl && (
                          <Button 
                            href={application.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            variant="outline-info"
                            size="sm"
                          >
                            <FaFileAlt className="me-1" />
                            Resume
                          </Button>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <Form.Select
                          size="sm"
                          value={application.status}
                          onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted">Accepted</option>
                        </Form.Select>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col>
              <Card>
                <Card.Body className="text-center py-5">
                  <FaUser className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                  <h5 className="text-muted">No Applications Yet</h5>
                  <p className="text-muted mb-4">
                    No one has applied to this job yet. Share the job posting to attract candidates!
                  </p>
                  <Link to="/recruiter/jobs" className="btn btn-primary">
                    Back to Jobs
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default JobApplications; 