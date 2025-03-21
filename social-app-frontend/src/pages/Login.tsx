// Login.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../api/auth';  // Import the loginUser function
import { RootState } from '../store/store';
import { LoginCredentials } from '../api/auth';  // Import the type for credentials
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";

const Login = () => {
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();  // Access the dispatch function from Redux

  // Get user state from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Log user state whenever it changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submissionconst Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await loginUser(formData, dispatch);
      dispatch(loginSuccess(userData)); // Ensure this contains { user, token }


      if (userData) {
        console.log("Login successful:", userData);
        navigate("/feed"); // Redirect to feed page after login
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
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
