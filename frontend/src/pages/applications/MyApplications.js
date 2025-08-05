import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { getMyApplications } from '../../services/api';
import { FaEye, FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const MyApplications = () => {
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'date'
  });

  const { data: applications, isLoading, error, refetch } = useQuery(
    ['myApplications', filters],
    () => getMyApplications(filters),
    {
      refetchOnWindowFocus: false
    }
  );

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
        <title>My Applications - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2">My Applications</h1>
                <p className="text-muted">
                  Track your job applications and their status
                </p>
              </div>
              <Link to="/jobs" className="btn btn-primary">
                Browse More Jobs
              </Link>
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
                <option value="">All Statuses</option>
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
                <option value="status">Status</option>
                <option value="jobTitle">Job Title</option>
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
                            to={`/jobs/${application.job._id}`}
                            className="text-decoration-none"
                          >
                            {application.job.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <FaBuilding className="me-2" />
                          {application.job.company}
                        </p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="mb-3">
                      <div className="row text-muted small">
                        <div className="col-6">
                          <FaMapMarkerAlt className="me-1" />
                          {application.job.location}
                        </div>
                        <div className="col-6">
                          <FaDollarSign className="me-1" />
                          {application.job.salary}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        Applied on {formatDate(application.createdAt)}
                      </small>
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

                    <div className="d-flex gap-2">
                      <Link 
                        to={`/applications/${application._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <FaEye className="me-1" />
                        View Details
                      </Link>
                      <Link 
                        to={`/jobs/${application.job._id}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        View Job
                      </Link>
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
                  <FaEye className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                  <h5 className="text-muted">No Applications Yet</h5>
                  <p className="text-muted mb-4">
                    You haven't applied to any jobs yet. Start browsing and applying to find your dream job!
                  </p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
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

export default MyApplications; 