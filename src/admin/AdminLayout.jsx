import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutFirebase } from '../services/firebase';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Inventory', path: '/admin/inventory', icon: '📦' },
  { name: 'Sales', path: '/admin/sales', icon: '📈' },
  { name: 'Purchases', path: '/admin/purchases', icon: '🛒' },
  { name: 'Messages', path: '/admin/messages', icon: '✉️' },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = localStorage.getItem('authName') || 'Admin';
  const email = localStorage.getItem('authEmail') || '';

  const logout = async () => {
    await signOutFirebase();
    localStorage.removeItem('authToken');
    localStorage.removeItem('authName');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authRole');
    navigate('/login');
  };

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Sidebar */}
      <aside
        className="w-64 min-h-screen flex-shrink-0 flex flex-col"
        style={{ backgroundColor: '#0057B8' }}
      >
        {/* Brand */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold text-white">WALTON</h1>
          <p className="text-blue-300 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-white shadow'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              style={isActive(item.path) ? { backgroundColor: '#FF7A00' } : {}}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-3 transition-colors"
          >
            🌐 View Website
          </Link>
          <p className="text-blue-300 text-xs mb-1">Logged in as:</p>
          <p className="text-white text-sm font-medium truncate">{name}</p>
          <p className="text-blue-300 text-xs truncate">{email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full py-2 text-sm rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#FF7A00' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
