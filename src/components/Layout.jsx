import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/questions', label: 'Questions Arena' },
    { path: '/metrics', label: 'Metrics' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-dark">ele</span>
            <span className="logo-arrow">→</span>
            <span className="logo-dark">ate</span>
            <span className="logo-accent">GRE</span>
          </Link>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2024 elevateGRE. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
