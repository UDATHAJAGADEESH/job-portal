import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { createJob } from '../../services/api';
import { FaPlus, FaSave } from 'react-icons/fa';

const PostJob = () => {
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

  const createJobMutation = useMutation(createJob, {
    onSuccess: (data) => {
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  });

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

    createJobMutation.mutate(jobData);
  };

  return (
    <>
      <Helmet>
        <title>Post New Job - Job Portal</title>
      </Helmet>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">
                  <FaPlus className="me-2" />
                  Post New Job
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Basic Information */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Senior Software Engineer"
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
                          placeholder="e.g., New York, NY"
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
                          placeholder="e.g., $80,000 - $120,000"
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
                          placeholder="e.g., 3"
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
                          placeholder="e.g., Bachelor's Degree"
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

                  {/* Job Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Job Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of the role..."
                      required
                    />
                  </Form.Group>

                  {/* Requirements */}
                  <Form.Group className="mb-3">
                    <Form.Label>Requirements (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="e.g., 3+ years of experience, Strong communication skills, Team player"
                    />
                    <Form.Text className="text-muted">
                      Separate multiple requirements with commas
                    </Form.Text>
                  </Form.Group>

                  {/* Responsibilities */}
                  <Form.Group className="mb-3">
                    <Form.Label>Responsibilities (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      placeholder="e.g., Develop new features, Code review, Team collaboration"
                    />
                    <Form.Text className="text-muted">
                      Separate multiple responsibilities with commas
                    </Form.Text>
                  </Form.Group>

                  {/* Skills */}
                  <Form.Group className="mb-3">
                    <Form.Label>Required Skills (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                    />
                    <Form.Text className="text-muted">
                      Separate multiple skills with commas
                    </Form.Text>
                  </Form.Group>

                  {/* Benefits */}
                  <Form.Group className="mb-4">
                    <Form.Label>Benefits (comma-separated)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="e.g., Health insurance, 401k, Flexible hours, Remote work"
                    />
                    <Form.Text className="text-muted">
                      Separate multiple benefits with commas
                    </Form.Text>
                  </Form.Group>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={createJobMutation.isLoading}
                    >
                      {createJobMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Posting Job...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Post Job
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="lg"
                      onClick={() => navigate('/recruiter/jobs')}
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

export default PostJob; 