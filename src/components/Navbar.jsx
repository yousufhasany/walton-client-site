import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutFirebase } from '../services/firebase';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
  const authName = localStorage.getItem('authName');

  const logout = async () => {
    await signOutFirebase();
    localStorage.removeItem('authToken');
    localStorage.removeItem('authName');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authRole');
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav style={{ backgroundColor: '#0057B8' }} className="text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-wide">WALTON</span>
          <span style={{ color: '#FF7A00' }} className="text-sm font-semibold uppercase">
            Showroom
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium transition-colors hover:text-orange-300 ${
                isActive(link.path) ? 'text-orange-300 border-b-2 border-orange-300 pb-0.5' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          {authToken ? (
            <>
              <span className="text-sm text-blue-100">{authName || 'Account'}</span>
              {authRole === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 text-white"
                  style={{ backgroundColor: '#FF7A00' }}
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 text-white border border-blue-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 text-white"
              style={{ backgroundColor: '#FF7A00' }}
            >
              Account
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-blue-700">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-medium hover:text-orange-300 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {authToken ? (
            <>
              {authRole === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg font-semibold text-center text-white"
                  style={{ backgroundColor: '#FF7A00' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg font-semibold text-center text-white border border-blue-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-semibold text-center text-white"
              style={{ backgroundColor: '#FF7A00' }}
              onClick={() => setMenuOpen(false)}
            >
              Account
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
