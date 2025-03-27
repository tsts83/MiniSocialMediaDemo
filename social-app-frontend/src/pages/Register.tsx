// Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth'; // Use existing function
import RegisterForm from '../components/auth/RegisterForm';  // Import the RegisterForm component

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // For redirection

  const handleSubmit = async (formData: { username: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await registerUser(formData);

    if (response.error) {
      setError(response.error); // Show error if registration fails
    } else {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>
        <RegisterForm onSubmit={handleSubmit} loading={loading} />

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
