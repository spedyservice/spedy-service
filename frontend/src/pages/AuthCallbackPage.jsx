import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Authentication failed');
      navigate('/login');
      return;
    }

    localStorage.setItem('token', token);
    
    api.get('/auth/profile')
      .then(response => {
        if (response.success && response.data) {
          const userData = response.data;
          // ✅ ATTACH TOKEN
          userData.token = token;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          toast.success('Google login successful!');
          navigate('/');
        } else {
          throw new Error('Invalid response');
        }
      })
      .catch(err => {
        console.error('Auth callback error:', err);
        toast.error('Failed to complete login');
        navigate('/login');
      });
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