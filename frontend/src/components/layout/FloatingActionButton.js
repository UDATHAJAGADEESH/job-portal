import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaPlus, 
  FaBriefcase, 
  FaFileAlt, 
  FaUsers, 
  FaChartBar, 
  FaHeart,
  FaCog,
  FaUserTie,
  FaBuilding
} from 'react-icons/fa';

const FloatingActionButton = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const getQuickActions = () => {
    switch (user?.role) {
      case 'recruiter':
        return [
          {
            icon: <FaPlus />,
            label: 'Post New Job',
            link: '/jobs/post',
            variant: 'success'
          },
          {
            icon: <FaBriefcase />,
            label: 'My Jobs',
            link: '/my-jobs',
            variant: 'primary'
          },
          {
            icon: <FaFileAlt />,
            label: 'View Applications',
            link: '/applications',
            variant: 'info'
          },
          {
            icon: <FaBuilding />,
            label: 'Dashboard',
            link: '/recruiter/dashboard',
            variant: 'secondary'
          }
        ];
      
      case 'jobseeker':
        return [
          {
            icon: <FaFileAlt />,
            label: 'My Applications',
            link: '/my-applications',
            variant: 'primary'
          },
          {
            icon: <FaHeart />,
            label: 'Saved Jobs',
            link: '/saved-jobs',
            variant: 'danger'
          },
          {
            icon: <FaUserTie />,
            label: 'Dashboard',
            link: '/dashboard',
            variant: 'secondary'
          }
        ];
      
      case 'admin':
        return [
          {
            icon: <FaChartBar />,
            label: 'Admin Dashboard',
            link: '/admin/dashboard',
            variant: 'primary'
          },
          {
            icon: <FaUsers />,
            label: 'Manage Users',
            link: '/admin/users',
            variant: 'info'
          },
          {
            icon: <FaBriefcase />,
            label: 'Manage Jobs',
            link: '/admin/jobs',
            variant: 'warning'
          },
          {
            icon: <FaFileAlt />,
            label: 'Manage Applications',
            link: '/admin/applications',
            variant: 'secondary'
          },
          {
            icon: <FaCog />,
            label: 'Analytics',
            link: '/admin/analytics',
            variant: 'dark'
          }
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) return null;

  return (
    <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
      <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle
          as={Button}
          variant="primary"
          size="lg"
          className="rounded-circle shadow-lg"
          style={{ width: '60px', height: '60px' }}
        >
          <FaPlus className={isOpen ? 'rotate-45' : ''} />
        </Dropdown.Toggle>

        <Dropdown.Menu 
          className="shadow-lg border-0"
          style={{ 
            minWidth: '200px',
            transform: 'translateY(-10px)'
          }}
        >
          {quickActions.map((action, index) => (
            <Dropdown.Item 
              key={index}
              as={Link} 
              to={action.link}
              className="d-flex align-items-center py-2"
            >
              <span className={`text-${action.variant} me-2`}>
                {action.icon}
              </span>
              {action.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FloatingActionButton;
