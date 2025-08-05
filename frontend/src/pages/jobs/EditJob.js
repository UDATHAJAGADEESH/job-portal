import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { getJobById, updateJob } from '../../services/api';
import { FaEdit, FaSave } from 'react-icons/fa';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experience: '',
    education: '',
    benefits: '',
    applicationDeadline: ''
  });

  const { data: job, isLoading, error } = useQuery(
    ['job', id],
    () => getJobById(id),
    {
      refetchOnWindowFocus: false
    }
  );

  const updateJobMutation = useMutation(updateJob, {
    onSuccess: () => {
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update job');
    }
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements ? job.requirements.join(', ') : '',
        responsibilities: job.responsibilities ? job.responsibilities.join(', ') : '',
        skills: job.skills ? job.skills.join(', ') : '',
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || 'full-time',
        experience: job.experience || '',
        education: job.education || '',
        benefits: job.benefits ? job.benefits.join(', ') : '',
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert comma-separated strings to arrays
    const jobData = {
      ...formData,
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
      responsibilities: formData.responsibilities.split(',').map(resp => resp.trim()).filter(resp => resp),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      benefits: formData.benefits.split(',').map(benefit => benefit.trim()).filter(benefit => benefit)
    };

    updateJobMutation.mutate({ id, jobData });
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
          <p>Failed to load job details.</p>
          <Button onClick={() => navigate('/recruiter/jobs')} variant="outline-danger">
            Back to Jobs
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Job - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header className="bg-warning text-dark">
                <h3 className="mb-0">
                  <FaEdit className="me-2" />
                  Edit Job
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Location *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Salary Range *</Form.Label>
                        <Form.Control
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Type *</Form.Label>
                        <Form.Select
                          name="jobType"
                          value={formData.jobType}
                          onChange={handleChange}
                          required
                        >
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="freelance">Freelance</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Experience Required (years) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Education Level</Form.Label>
                        <Form.Control
                          type="text"
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Application Deadline</Form.Label>
                        <Form.Control
                          type="date"
                          name="applicationDeadline"
                          value={formData.applicationDeadline}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Job Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Requirements (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Responsibilities (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Required Skills (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Benefits (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex gap-3">
                    <Button
                      type="submit"
                      variant="warning"
                      size="lg"
                      disabled={updateJobMutation.isLoading}
                    >
                      {updateJobMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Update Job
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      onClick={() => navigate(`/jobs/${id}`)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditJob; 