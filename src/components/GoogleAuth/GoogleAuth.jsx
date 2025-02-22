import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { setUser } from '../../redux/slice';
import { savedAuthData } from '../../utils/Localstorage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import api from '../../api/axios_api_call';

const GoogleAuthWithRole = ({ clientId }) => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleResponse = (response) => {
    const token = response.credential;
    const decoded = jwtDecode(token);
    const userName = decoded.name.replace(/\s/g, '_').toLowerCase();

    setPendingUserData({
      google_id: decoded.sub,
      username: userName,
      email: decoded.email,
      first_name: decoded.name,
      last_name: decoded.family_name,
      token: decoded.access_token,
    });

    setShowRoleSelection(true);
  };

  const handleRoleSelect = async (selectedRole) => {
    try {
      const userData = { ...pendingUserData, role: selectedRole };
      const response = await api.post(
        '/auth-app/login/google-account/',
        userData,
      );

      if (
        response.data['auth-status'] === 'success' ||
        response.data['auth-status'] === 'created'
      ) {
        const { access_token, refresh_token, user, role, user_code } =
          response.data;

        const authState = {
          accessToken: access_token,
          refreshToken: refresh_token,
          user,
          role,
          user_code,
          isAuthenticated: true,
        };

        savedAuthData(authState);
        dispatch(setUser({ user, role }));

        if (response.data['auth-status'] === 'created') {
          toast.success('Account created successfully');
        }

        const roleLocation = role.toLowerCase();
        navigate(`/${roleLocation}/choose-session/`);
      } else if (response.data['auth-status'] === 'blocked') {
        toast.error('This account has been blocked');
      } else {
        toast.error('An error occurred. Please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process registration');
    } finally {
      setShowRoleSelection(false);
      setPendingUserData(null);
    }
  };

  return (
    <div className="relative">
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleGoogleResponse}
          onError={() => toast.error('Google authentication failed')}
        />
      </GoogleOAuthProvider>

      {showRoleSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Role</CardTitle>
              <Alert className="mt-2">
                <AlertDescription>
                  Select your role to complete registration
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('Student')}
                  className="p-4 text-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                >
                  I'm a Student
                </button>
                <button
                  onClick={() => handleRoleSelect('Tutor')}
                  className="p-4 text-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  I'm a Tutor
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthWithRole;
