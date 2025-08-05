import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMyJobs, toggleJobStatus, deleteJob } from '../../services/api';
import { FaPlus, FaEdit, FaEye, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const MyJobs = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'date'
  });

  const { data: jobs, isLoading, error, refetch } = useQuery(
    ['myJobs', filters],
    () => getMyJobs(filters),
    {
      refetchOnWindowFocus: false
    }
  );

  const toggleStatusMutation = useMutation(toggleJobStatus, {
    onSuccess: () => {
      toast.success('Job status updated successfully');
      queryClient.invalidateQueries(['myJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  });

  const deleteJobMutation = useMutation(deleteJob, {
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries(['myJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  });

  const handleToggleStatus = (jobId, currentStatus) => {
    toggleStatusMutation.mutate({ id: jobId, status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJobMutation.mutate(jobId);
    }
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
        <title>My Jobs - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2">My Job Postings</h1>
                <p className="text-muted">
                  Manage your job postings and view applications
                </p>
              </div>
              <Link to="/jobs/post" className="btn btn-primary">
                <FaPlus className="me-2" />
                Post New Job
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
                <option value="">All Jobs</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                <option value="date">Posting Date</option>
                <option value="title">Job Title</option>
                <option value="applications">Applications</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Jobs List */}
        {jobs && jobs.length > 0 ? (
          <Row>
            {jobs.map((job) => (
              <Col key={job._id} lg={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1">
                          <Link 
                            to={`/jobs/${job._id}`}
                            className="text-decoration-none"
                          >
                            {job.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <FaMapMarkerAlt className="me-2" />
                          {job.location}
                        </p>
                      </div>
                      <Badge bg={job.status === 'active' ? 'success' : 'secondary'}>
                        {job.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="row text-muted small">
                        <div className="col-6">
                          <FaDollarSign className="me-1" />
                          {job.salary}
                        </div>
                        <div className="col-6">
                          <FaCalendarAlt className="me-1" />
                          Posted {formatDate(job.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted small">
                        {job.description.length > 100 
                          ? `${job.description.substring(0, 100)}...` 
                          : job.description
                        }
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                        <Link 
                          to={`/jobs/edit/${job._id}`}
                          className="btn btn-outline-warning btn-sm"
                        >
                          <FaEdit className="me-1" />
                          Edit
                        </Link>
                        <Link 
                          to={`/jobs/${job._id}/applications`}
                          className="btn btn-outline-info btn-sm"
                        >
                          <FaUsers className="me-1" />
                          Applications ({job.applicationCount || 0})
                        </Link>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant={job.status === 'active' ? 'outline-secondary' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleStatus(job._id, job.status)}
                          disabled={toggleStatusMutation.isLoading}
                        >
                          {job.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
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
                  <FaPlus className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                  <h5 className="text-muted">No Jobs Posted Yet</h5>
                  <p className="text-muted mb-4">
                    Start posting jobs to attract talented candidates to your company!
                  </p>
                  <Link to="/jobs/post" className="btn btn-primary">
                    Post Your First Job
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

export default MyJobs; 