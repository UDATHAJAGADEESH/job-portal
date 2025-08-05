import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaUpload,
  FaTrash
} from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { data: profile, isLoading, error } = useQuery(
    ['profile', user?._id],
    () => usersAPI.getProfile(),
    {
      enabled: !!user?._id,
      onSuccess: (data) => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          skills: data.skills || [],
          experience: data.experience || '',
          resumeUrl: data.resumeUrl || '',
          company: {
            name: data.company?.name || '',
            website: data.company?.website || '',
            description: data.company?.description || '',
            industry: data.company?.industry || '',
            size: data.company?.size || ''
          }
        });
      }
    }
  );

  const updateProfileMutation = useMutation(
    (data) => usersAPI.updateProfile(data),
    {
      onSuccess: (data) => {
        updateUser(data);
        queryClient.invalidateQueries(['profile']);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const uploadAvatarMutation = useMutation(
    (file) => usersAPI.uploadAvatar(file),
    {
      onSuccess: (data) => {
        updateUser(data);
        queryClient.invalidateQueries(['profile']);
        toast.success('Avatar updated successfully!');
        setShowAvatarModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to upload avatar');
      }
    }
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadAvatarMutation.mutate(acceptedFiles[0]);
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      skills: profile?.skills || [],
      experience: profile?.experience || '',
      resumeUrl: profile?.resumeUrl || '',
      company: {
        name: profile?.company?.name || '',
        website: profile?.company?.website || '',
        description: profile?.company?.description || '',
        industry: profile?.company?.industry || '',
        size: profile?.company?.size || ''
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Profile</Alert.Heading>
          <p>{error.message || 'Failed to load profile. Please try again later.'}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="card-custom">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Profile</h3>
              <div>
                {!isEditing ? (
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                    <FaEdit className="me-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={updateProfileMutation.isLoading}
                    >
                      <FaSave className="me-2" />
                      Save
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancel}>
                      <FaTimes className="me-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Avatar Section */}
                  <Col md={3} className="text-center mb-4">
                    <div className="position-relative">
                      <div className="mb-3">
                        {profile?.avatar ? (
                          <img
                            src={profile.avatar}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                            style={{ width: '120px', height: '120px' }}
                          >
                            <FaUser className="fs-1 text-muted" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowAvatarModal(true)}
                      >
                        <FaUpload className="me-2" />
                        Change Photo
                      </Button>
                    </div>
                  </Col>

                  {/* Profile Information */}
                  <Col md={9}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`form-control-custom ${errors.name ? 'is-invalid' : ''}`}
                          />
                          {errors.name && (
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                          />
                          {errors.email && (
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                          />
                          {errors.phone && (
                            <Form.Control.Feedback type="invalid">
                              {errors.phone}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`form-control-custom ${errors.location ? 'is-invalid' : ''}`}
                          />
                          {errors.location && (
                            <Form.Control.Feedback type="invalid">
                              {errors.location}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        className="form-control-custom"
                      />
                    </Form.Group>

                    {user?.role === 'jobseeker' && (
                      <>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Experience Level</Form.Label>
                              <Form.Select
                                name="experience"
                                value={formData.experience || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="form-control-custom"
                              >
                                <option value="">Select Experience</option>
                                <option value="entry">Entry Level</option>
                                <option value="mid">Mid Level</option>
                                <option value="senior">Senior Level</option>
                                <option value="executive">Executive</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Resume URL</Form.Label>
                              <Form.Control
                                type="url"
                                name="resumeUrl"
                                value={formData.resumeUrl || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="https://example.com/resume.pdf"
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Skills (comma-separated)</Form.Label>
                          <Form.Control
                            type="text"
                            name="skills"
                            value={formData.skills?.join(', ') || ''}
                            onChange={handleSkillsChange}
                            disabled={!isEditing}
                            placeholder="JavaScript, React, Node.js, MongoDB"
                            className="form-control-custom"
                          />
                        </Form.Group>
                      </>
                    )}

                    {user?.role === 'recruiter' && (
                      <>
                        <h5 className="mb-3">Company Information</h5>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Company Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="company.name"
                                value={formData.company?.name || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Website</Form.Label>
                              <Form.Control
                                type="url"
                                name="company.website"
                                value={formData.company?.website || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="https://company.com"
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Industry</Form.Label>
                              <Form.Control
                                type="text"
                                name="company.industry"
                                value={formData.company?.industry || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Company Size</Form.Label>
                              <Form.Select
                                name="company.size"
                                value={formData.company?.size || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="form-control-custom"
                              >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Company Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="company.description"
                            value={formData.company?.description || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Tell us about your company..."
                            className="form-control-custom"
                          />
                        </Form.Group>
                      </>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Avatar Upload Modal */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded p-5 text-center ${
              isDragActive ? 'border-primary' : 'border-muted'
            }`}
          >
            <input {...getInputProps()} />
            {uploadAvatarMutation.isLoading ? (
              <div>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </Spinner>
                <p className="mt-3">Uploading...</p>
              </div>
            ) : (
              <div>
                <FaUpload className="fs-1 text-muted mb-3" />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <div>
                    <p>Drag & drop an image here, or click to select</p>
                    <p className="text-muted small">
                      Supports: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile; 