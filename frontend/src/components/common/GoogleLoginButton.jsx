import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth()
  const navigate = useNavigate()

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          await googleLogin(credentialResponse.credential)
          navigate('/')
        } catch (error) {
          console.error('Google login error:', error)
          toast.error('Google sign-in failed')
        }
      }}
      onError={() => toast.error('Google sign-in was cancelled')}
      ux_mode="popup"
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      logo_alignment="center"
      useOneTap={false}
    />
  )
}

export default GoogleLoginButton