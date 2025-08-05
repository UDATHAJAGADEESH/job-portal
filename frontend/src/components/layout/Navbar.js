import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NavigationBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="navbar-custom shadow-sm sticky-top"
      variant="light"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary-custom">
          JobPortal
        </Navbar.Brand>

        <Button
          variant="outline-primary"
          className="d-lg-none border-0"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </Button>

        <Navbar.Collapse id="navbar-nav" className={isMenuOpen ? 'show' : ''}>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={getNavLinkClass('/')}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/jobs" className={getNavLinkClass('/jobs')}>
              Jobs
            </Nav.Link>
            {isAuthenticated && user?.role === 'jobseeker' && (
              <Nav.Link as={Link} to="/my-applications" className={getNavLinkClass('/my-applications')}>
                My Applications
              </Nav.Link>
            )}
            {isAuthenticated && user?.role === 'recruiter' && (
              <Nav.Link as={Link} to="/my-jobs" className={getNavLinkClass('/my-jobs')}>
                My Jobs
              </Nav.Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" className={getNavLinkClass('/admin')}>
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Form onSubmit={handleSearch} className="d-flex me-3">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control-custom"
                style={{ minWidth: '200px' }}
              />
              <Button type="submit" variant="outline-primary">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  {user?.name?.split(' ')[0] || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  {user?.role === 'jobseeker' && (
                    <Dropdown.Item as={Link} to="/saved-jobs">
                      Saved Jobs
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-primary">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary-custom">
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 