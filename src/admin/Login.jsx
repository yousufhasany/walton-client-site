import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firebaseLogin, login, register } from '../services/api';
import {
  hasFirebaseConfig,
  missingFirebaseConfigKeys,
  signInWithGoogle,
  signOutFirebase,
} from '../services/firebase';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [adminSetupKey, setAdminSetupKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const persistAuth = (response) => {
    const user = response.data.user;
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('authName', user.name);
    localStorage.setItem('authEmail', user.email);
    localStorage.setItem('authRole', user.role);
    navigate(user.role === 'admin' ? '/admin' : '/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const action = mode === 'login' ? login : register;
      const payload =
        mode === 'login'
          ? { email, password, role }
          : { name, email, password, role, adminSetupKey };
      const res = await action(payload);
      persistAuth(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseLogin = async () => {
    setError('');
    if (!hasFirebaseConfig) {
      setError(
        `Firebase client config missing: ${missingFirebaseConfigKeys.join(', ')}. ` +
          'Create client/.env and restart the client server.'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      const res = await firebaseLogin({ idToken, role, adminSetupKey });
      persistAuth(res);
    } catch (err) {
      await signOutFirebase();

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing login.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Allow popups for this site and try again.');
      } else if (err.response?.status === 503) {
        setError(
          'Server Firebase is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env and restart server.'
        );
      } else {
        setError(err.response?.data?.message || err.message || 'Firebase login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0057B8 0%, #002255 100%)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#0057B8' }}>
            WALTON
          </h1>
          <p className="text-gray-400 mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-blue-50 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              mode === 'login' ? 'text-white' : 'text-blue-700'
            }`}
            style={mode === 'login' ? { backgroundColor: '#0057B8' } : {}}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              mode === 'register' ? 'text-white' : 'text-blue-700'
            }`}
            style={mode === 'register' ? { backgroundColor: '#0057B8' } : {}}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {mode === 'register' && role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Setup Key
              </label>
              <input
                type="password"
                required
                value={adminSetupKey}
                onChange={(e) => setAdminSetupKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter admin setup key"
              />
              <p className="mt-1 text-xs text-gray-400">
                Customer signup is open. Admin signup requires the private setup key.
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: '#0057B8',
              color: '#FFFFFF',
              boxShadow: '0 6px 14px rgba(0, 87, 184, 0.25)',
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-300">
          <span className="h-px flex-1 bg-gray-200" />
          <span>Or</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleFirebaseLogin}
          disabled={loading}
          className="w-full border border-gray-300 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          Continue with Google
        </button>

        {!hasFirebaseConfig && (
          <p className="mt-2 text-center text-xs text-gray-400">
            Add Firebase client environment variables to enable Google sign-in.
          </p>
        )}

        <p className="mt-5 text-center text-sm text-gray-400">
          {mode === 'login' ? 'Need a new account?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="font-semibold text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'Create one' : 'Login here'}
          </button>
        </p>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
