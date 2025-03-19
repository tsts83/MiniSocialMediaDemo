// Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';  // Import the useDispatch hook
import { loginUser } from '../api/auth';  // Import the loginUser function
import { LoginCredentials } from '../api/auth';  // Import the type for credentials

const Login = () => {
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();  // Access the dispatch function from Redux

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Dispatch the loginUser action with credentials and dispatch
      await loginUser(formData, dispatch);
      setLoading(false);  // Stop loading on success
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);  // Stop loading on error
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <button type="submit" disabled={loading}>Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
