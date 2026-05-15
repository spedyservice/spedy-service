import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user profile to set full user object
      const apiUrl = import.meta.env.VITE_API_URL || 'https://spedy-service-backend.onrender.com/api';
      fetch(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const userData = data.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAdmin(userData.role === 'admin');
            toast.success('Google login successful!');
            navigate('/');
          } else {
            throw new Error('Failed to get user');
          }
        })
        .catch((err) => {
          console.error('Auth callback error:', err);
          toast.error('Login failed');
          navigate('/login');
        });
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, setIsAdmin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;