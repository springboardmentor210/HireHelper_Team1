import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  Inbox,
  Bookmark,
  Plus,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/my-tasks' && (currentPath === '/my-tasks' || currentPath.startsWith('/tasks'))) {
      return true;
    }
    return currentPath === path;
  };

  const navItems = [
    { label: 'Feed', path: '/feed', icon: Home },
    { label: 'My Tasks', path: '/my-tasks', icon: ClipboardList },
    { label: 'Requests', path: '/requests', icon: Inbox },
    { label: 'My Requests', path: '/my-requests', icon: Inbox },
    { label: 'Saved', path: '/saved', icon: Bookmark },
    { label: 'Add Task', path: '/add-task', icon: Plus },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="feed-sidebar">
      <div>
        <div className="brand">
          <div
            className="brand-logo"
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#0056b3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            H
          </div>
          <h2>Hire-a-Helper</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
            alt="Jon Doe"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        <div className="profile-info">
          <span>Jon Doe</span>
          <small>test@gmail.com</small>
        </div>

        <button
          type="button"
          className="logout-btn"
          title="Logout"
          onClick={() => navigate('/')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
