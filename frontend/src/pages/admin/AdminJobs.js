import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdminJobs, updateJobStatus, deleteJobAdmin } from '../../services/api';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaEye } from 'react-icons/fa';

const AdminJobs = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    jobType: '',
    search: ''
  });

  const { data: jobs, isLoading, error, refetch } = useQuery(
    ['adminJobs', filters],
    () => getAdminJobs(filters),
    {
      refetchOnWindowFocus: false
    }
  );

  const updateStatusMutation = useMutation(updateJobStatus, {
    onSuccess: () => {
      toast.success('Job status updated successfully');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  });

  const deleteJobMutation = useMutation(deleteJobAdmin, {
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  });

  const handleStatusUpdate = (jobId, newStatus) => {
    updateStatusMutation.mutate({ id: jobId, status: newStatus });
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJobMutation.mutate(jobId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    return <Badge bg={status === 'active' ? 'success' : 'secondary'}>{status}</Badge>;
  };

  const getJobTypeBadge = (jobType) => {
    const typeConfig = {
      'full-time': { bg: 'primary', text: 'Full Time' },
      'part-time': { bg: 'info', text: 'Part Time' },
      'contract': { bg: 'warning', text: 'Contract' },
      'internship': { bg: 'success', text: 'Internship' },
      'freelance': { bg: 'secondary', text: 'Freelance' }
    };
    
    const config = typeConfig[jobType] || { bg: 'secondary', text: jobType };
    return <Badge bg={config.bg}>{config.text}</Badge>;
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
          <p>Failed to load jobs. Please try again.</p>
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
        <title>Manage Jobs - Admin Dashboard</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">Manage Jobs</h1>
            <p className="text-muted">
              View and manage all job postings on the platform
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              <Form.Label>Search Jobs</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title or company..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Jobs Table */}
        <Card>
          <Card.Body>
            {jobs && jobs.length > 0 ? (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div>
                          <strong>{job.title}</strong>
                          <div className="small text-muted">{job.salary}</div>
                        </div>
                      </td>
                      <td>
                        <FaBuilding className="me-2 text-muted" />
                        {job.company}
                      </td>
                      <td>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {job.location}
                      </td>
                      <td>{getJobTypeBadge(job.jobType)}</td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>
                        <FaCalendarAlt className="me-2 text-muted" />
                        {formatDate(job.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/jobs/${job._id}`}
                            target="_blank"
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                          <Form.Select
                            size="sm"
                            value={job.status}
                            onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
                            style={{ width: 'auto' }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Form.Select>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                            disabled={deleteJobMutation.isLoading}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <FaBriefcase className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                <h5 className="text-muted">No Jobs Found</h5>
                <p className="text-muted">No jobs match the current filters.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminJobs; 