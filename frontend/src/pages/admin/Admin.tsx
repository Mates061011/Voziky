import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/api/login`, { email, password });
      const token = response.data.token; // assuming the backend returns a token

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to the Admin Panel
      navigate('/adminPanel');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h2>Admin Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexDirection: 'column', width:'250px'}}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='email'
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='password'
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
