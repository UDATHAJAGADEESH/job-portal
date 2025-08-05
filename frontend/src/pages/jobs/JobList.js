import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllJobs, formatSalary, formatDate, getStatusColor, getJobTypeLabel } from '../../services/api';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase, FaClock, FaDollarSign, FaBuilding } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const JobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
    skills: searchParams.get('skills') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery(
    ['jobs', filters, currentPage],
    () => getAllJobs({
      ...filters,
      page: currentPage + 1,
      limit: pageSize
    }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  );

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experience: '',
      salaryMin: '',
      salaryMax: '',
      skills: ''
    });
    setCurrentPage(0);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Jobs</Alert.Heading>
          <p>{error.message || 'Failed to load jobs. Please try again later.'}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-3">Find Your Dream Job</h1>
          <p className="text-muted">
            {data?.totalJobs ? `${data.totalJobs} jobs found` : 'Search and filter jobs to find the perfect match'}
          </p>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="card-custom mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search Jobs</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Job title, company, or keywords"
                      className="form-control-custom"
                    />
                    <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
                  </div>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, state, or remote"
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Job Type</Form.Label>
                  <Form.Select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="form-control-custom"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary-custom" className="flex-fill">
                      <FaSearch className="me-2" />
                      Search
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FaFilter />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Advanced Filters */}
            {showFilters && (
              <Row className="g-3 mt-3 pt-3 border-top">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Experience Level</Form.Label>
                    <Form.Select
                      name="experience"
                      value={filters.experience}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    >
                      <option value="">All Levels</option>
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Min Salary</Form.Label>
                    <Form.Control
                      type="number"
                      name="salaryMin"
                      value={filters.salaryMin}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Max Salary</Form.Label>
                    <Form.Control
                      type="number"
                      name="salaryMax"
                      value={filters.salaryMax}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      type="text"
                      name="skills"
                      value={filters.skills}
                      onChange={handleFilterChange}
                      placeholder="JavaScript, React, etc."
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={clearFilters}
                      className="w-100"
                    >
                      Clear All
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Job Listings */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading jobs...</p>
        </div>
      ) : data?.jobs?.length > 0 ? (
        <>
          <Row>
            {data.jobs.map(job => (
              <Col lg={6} key={job._id} className="mb-4">
                <Card className="job-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-2">
                          <Link to={`/jobs/${job._id}`} className="text-decoration-none">
                            {job.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-1">
                          <FaBuilding className="me-2" />
                          {job.company.name}
                        </p>
                      </div>
                      <Badge bg={getStatusColor(job.isActive ? 'active' : 'inactive')}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center text-muted mb-2">
                        <FaMapMarkerAlt className="me-2" />
                        <small>{job.location}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted mb-2">
                        <FaBriefcase className="me-2" />
                        <small>{getJobTypeLabel(job.jobType)}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted mb-2">
                        <FaClock className="me-2" />
                        <small>Posted {formatDate(job.createdAt)}</small>
                      </div>
                      {job.salary && (
                        <div className="d-flex align-items-center text-muted">
                          <FaDollarSign className="me-2" />
                          <small>{formatSalary(job.salary)}</small>
                        </div>
                      )}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="mb-3">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge bg="light" text="dark">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {job.views || 0} views • {job.applications || 0} applications
                      </small>
                      <Button
                        as={Link}
                        to={`/jobs/${job._id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <Row className="mt-4">
              <Col>
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  pageCount={data.totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName="pagination justify-content-center"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                  forcePage={currentPage}
                />
              </Col>
            </Row>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state">
            <FaSearch className="display-1 text-muted mb-3" />
            <h4>No jobs found</h4>
            <p className="text-muted">
              Try adjusting your search criteria or browse all available jobs.
            </p>
            <Button variant="primary-custom" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default JobList; 