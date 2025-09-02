import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [userForm, setUserForm] = useState({
    username: '', email: '', password: '', confirmPWD: ''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setUserForm({...userForm,
      [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    //validations
    if (userForm.password !== userForm.confirmPWD) {
      setError('Passwords do not match');
      return; }
    if (userForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;}
    setLoading(true);

    register(userForm.username, userForm.email, userForm.password)
    .then((result) => {
      if (result.success) navigate('/dashboard');
      else setError(result.error);})
    .catch((err) => setError(err.message || 'Something went wrong'))
    .finally(() => setLoading(false));
  }
    
  return (
    <div className="container">
      <div className="main-header">
        <h1 className="app-title">🛒 Your Shopping Lists</h1>
        <p className="app-subtitle">Join us and start organizing your shopping</p>
      </div>
      <div className="card"> <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}        
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userForm.username}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="20"
              placeholder="Choose a username"
            />
          </div>
          <div className="input-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userForm.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userForm.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Create a password"
            />
          </div>
          <div className="input-field">
            <label htmlFor="confirmPWD">Confirm Password:</label>
            <input
              type="password"
              id="confirmPWD"
              name="confirmPWD"
              value={userForm.confirmPWD}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link"> Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;