import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdminUsers, updateUserStatus, deleteUser } from '../../services/api';
import { FaUser, FaEnvelope, FaCalendarAlt, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });

  const { data: users, isLoading, error, refetch } = useQuery(
    ['adminUsers', filters],
    () => getAdminUsers(filters),
    {
      refetchOnWindowFocus: false
    }
  );

  const updateStatusMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      toast.success('User status updated successfully');
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  });

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleStatusUpdate = (userId, newStatus) => {
    updateStatusMutation.mutate({ id: userId, status: newStatus });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'danger', text: 'Admin' },
      recruiter: { bg: 'success', text: 'Recruiter' },
      jobseeker: { bg: 'info', text: 'Job Seeker' }
    };
    
    const config = roleConfig[role] || { bg: 'secondary', text: role };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    return <Badge bg={status === 'active' ? 'success' : 'secondary'}>{status}</Badge>;
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
          <p>Failed to load users. Please try again.</p>
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
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>
      
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">Manage Users</h1>
            <p className="text-muted">
              View and manage all users on the platform
            </p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Role</Form.Label>
              <Form.Select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="jobseeker">Job Seeker</option>
              </Form.Select>
            </Form.Group>
          </Col>
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
              <Form.Label>Search Users</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Users Table */}
        <Card>
          <Card.Body>
            {users && users.length > 0 ? (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '40px', height: '40px' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            {user.role === 'recruiter' && user.company && (
                              <div className="small text-muted">{user.company}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <FaEnvelope className="me-2 text-muted" />
                        {user.email}
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <FaCalendarAlt className="me-2 text-muted" />
                        {formatDate(user.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/users/${user._id}`}
                            target="_blank"
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                          <Form.Select
                            size="sm"
                            value={user.status}
                            onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                            style={{ width: 'auto' }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Form.Select>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleteUserMutation.isLoading}
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
                <FaUser className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                <h5 className="text-muted">No Users Found</h5>
                <p className="text-muted">No users match the current filters.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminUsers; 