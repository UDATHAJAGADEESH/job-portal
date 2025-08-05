import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { getAdminApplications } from '../../services/api';
import { FaFileAlt, FaUser, FaBriefcase, FaCalendarAlt, FaEye } from 'react-icons/fa';

const AdminApplications = () => {
  const [filters, setFilters] = useState({
    status: '',
    jobType: '',
    search: ''
  });

  const { data: applications, isLoading, error, refetch } = useQuery(
    ['adminApplications', filters],
    () => getAdminApplications(filters),
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
        <title>Manage Applications - Admin Dashboard</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">Manage Applications</h1>
            <p className="text-muted">
              View all job applications on the platform
            </p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="withdrawn">Withdrawn</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Job Type</Form.Label>
              <Form.Select
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by applicant or job..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Applications Table */}
        <Card>
          <Card.Body>
            {applications && applications.length > 0 ? (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '40px', height: '40px' }}>
                            {application.applicant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{application.applicant.name}</strong>
                            <div className="small text-muted">{application.applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{application.job.title}</strong>
                          <div className="small text-muted">{application.job.jobType}</div>
                        </div>
                      </td>
                      <td>
                        <FaBriefcase className="me-2 text-muted" />
                        {application.job.company}
                      </td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        <FaCalendarAlt className="me-2 text-muted" />
                        {formatDate(application.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/users/${application.applicant._id}`}
                            target="_blank"
                          >
                            <FaUser className="me-1" />
                            View Applicant
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            href={`/jobs/${application.job._id}`}
                            target="_blank"
                          >
                            <FaEye className="me-1" />
                            View Job
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <FaFileAlt className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                <h5 className="text-muted">No Applications Found</h5>
                <p className="text-muted">No applications match the current filters.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminApplications; 