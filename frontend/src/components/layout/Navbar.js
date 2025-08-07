import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaSearch, 
  FaBars, 
  FaTimes, 
  FaPlus, 
  FaBriefcase, 
  FaUsers, 
  FaChartBar, 
  FaFileAlt, 
  FaCog,
  FaHeart,
  FaBuilding,
  FaUserTie,
  FaClipboardList
} from 'react-icons/fa';
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
            
            {/* Jobs Dropdown */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className={getNavLinkClass('/jobs')}>
                <FaBriefcase className="me-1" />
                Jobs
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/jobs">
                  <FaSearch className="me-2" />
                  Browse Jobs
                </Dropdown.Item>
                {isAuthenticated && user?.role === 'recruiter' && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/jobs/post">
                      <FaPlus className="me-2" />
                      Post New Job
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/my-jobs">
                      <FaClipboardList className="me-2" />
                      My Posted Jobs
                    </Dropdown.Item>
                  </>
                )}
                {isAuthenticated && user?.role === 'jobseeker' && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/saved-jobs">
                      <FaHeart className="me-2" />
                      Saved Jobs
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Applications Dropdown */}
            {isAuthenticated && (
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>
                  <FaFileAlt className="me-1" />
                  Applications
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user?.role === 'jobseeker' && (
                    <Dropdown.Item as={Link} to="/my-applications">
                      <FaFileAlt className="me-2" />
                      My Applications
                    </Dropdown.Item>
                  )}
                  {user?.role === 'recruiter' && (
                    <Dropdown.Item as={Link} to="/applications">
                      <FaUsers className="me-2" />
                      View Applications
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Admin Dropdown */}
            {isAuthenticated && user?.role === 'admin' && (
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>
                  <FaCog className="me-1" />
                  Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/admin/dashboard">
                    <FaChartBar className="me-2" />
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/users">
                    <FaUsers className="me-2" />
                    Manage Users
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/jobs">
                    <FaBriefcase className="me-2" />
                    Manage Jobs
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/applications">
                    <FaFileAlt className="me-2" />
                    Manage Applications
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/analytics">
                    <FaChartBar className="me-2" />
                    Analytics
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Recruiter Dashboard */}
            {isAuthenticated && user?.role === 'recruiter' && (
              <Nav.Link as={Link} to="/recruiter/dashboard" className={getNavLinkClass('/recruiter/dashboard')}>
                <FaBuilding className="me-1" />
                Dashboard
              </Nav.Link>
            )}

            {/* Job Seeker Dashboard */}
            {isAuthenticated && user?.role === 'jobseeker' && (
              <Nav.Link as={Link} to="/dashboard" className={getNavLinkClass('/dashboard')}>
                <FaUserTie className="me-1" />
                Dashboard
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
            {/* Quick Post Job Button for Recruiters */}
            {isAuthenticated && user?.role === 'recruiter' && (
              <Button 
                as={Link} 
                to="/jobs/post" 
                variant="success" 
                className="me-2 d-none d-md-inline-block"
                size="sm"
              >
                <FaPlus className="me-1" />
                Post Job
              </Button>
            )}

            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  {user?.name?.split(' ')[0] || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" />
                    My Profile
                  </Dropdown.Item>
                  
                  {/* Quick Actions based on role */}
                  {user?.role === 'recruiter' && (
                    <>
                      <Dropdown.Item as={Link} to="/jobs/post">
                        <FaPlus className="me-2" />
                        Post New Job
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/my-jobs">
                        <FaBriefcase className="me-2" />
                        My Jobs
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/applications">
                        <FaFileAlt className="me-2" />
                        View Applications
                      </Dropdown.Item>
                    </>
                  )}
                  
                  {user?.role === 'jobseeker' && (
                    <>
                      <Dropdown.Item as={Link} to="/my-applications">
                        <FaFileAlt className="me-2" />
                        My Applications
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/saved-jobs">
                        <FaHeart className="me-2" />
                        Saved Jobs
                      </Dropdown.Item>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <>
                      <Dropdown.Item as={Link} to="/admin/dashboard">
                        <FaChartBar className="me-2" />
                        Admin Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/users">
                        <FaUsers className="me-2" />
                        Manage Users
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/jobs">
                        <FaBriefcase className="me-2" />
                        Manage Jobs
                      </Dropdown.Item>
                    </>
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