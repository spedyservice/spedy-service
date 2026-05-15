import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = ({ text = 'Continue with Google' }) => {
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'https://spedy-service-backend.onrender.com/api';
    const googleAuthUrl = backendUrl.replace('/api', '') + '/api/auth/google';
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <FcGoogle size={20} />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </button>
  );
};

export default GoogleLoginButton;