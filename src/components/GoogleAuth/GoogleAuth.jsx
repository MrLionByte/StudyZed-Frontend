// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
// import { setUser } from '../../redux/slice';
// import { savedAuthData } from '../../utils/Localstorage';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'react-toastify';
// import api from '../../api/axios_api_call';

// const GoogleAuthWithRole = ({ clientId }) => {
//   const [showRoleSelection, setShowRoleSelection] = useState(false);
//   const [pendingUserData, setPendingUserData] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleGoogleResponse = (response) => {
//     const token = response.credential;
//     const decoded = jwtDecode(token);
//     const userName = decoded.name.replace(/\s/g, '_').toLowerCase();

//     setPendingUserData({
//       google_id: decoded.sub,
//       username: userName,
//       email: decoded.email,
//       first_name: decoded.name,
//       last_name: decoded.family_name,
//       token: decoded.access_token,
//     });

//     setShowRoleSelection(true);
//   };

//   const handleRoleSelect = async (selectedRole) => {
//     try {
//       const userData = { ...pendingUserData, role: selectedRole };
//       const response = await api.post(
//         '/auth-app/login/google-account/',
//         userData,
//       );

//       if (
//         response.data['auth-status'] === 'success' ||
//         response.data['auth-status'] === 'created'
//       ) {
//         const { access_token, refresh_token, user, role, user_code } =
//           response.data;

//         const authState = {
//           accessToken: access_token,
//           refreshToken: refresh_token,
//           user,
//           role,
//           user_code,
//           isAuthenticated: true,
//         };

//         savedAuthData(authState);
//         dispatch(setUser({ user, role }));

//         if (response.data['auth-status'] === 'created') {
//           toast.success('Account created successfully');
//         }

//         const roleLocation = role.toLowerCase();
//         navigate(`/${roleLocation}/choose-session/`);
//       } else if (response.data['auth-status'] === 'blocked') {
//         toast.error('This account has been blocked');
//       } else {
//         toast.error('An error occurred. Please try again');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to process registration');
//     } finally {
//       setShowRoleSelection(false);
//       setPendingUserData(null);
//     }
//   };

//   return (
//     <div className="relative">
//       <GoogleOAuthProvider clientId={clientId}>
//         <GoogleLogin
//           onSuccess={handleGoogleResponse}
//           onError={() => toast.error('Google authentication failed')}
//         />
//       </GoogleOAuthProvider>

//       {showRoleSelection && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <Card className="w-full max-w-md mx-4">
//             <CardHeader>
//               <CardTitle className="text-lg">Choose Your Role</CardTitle>
//               <Alert className="mt-2">
//                 <AlertDescription>
//                   Select your role to complete registration
//                 </AlertDescription>
//               </Alert>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={() => handleRoleSelect('Student')}
//                   className="p-4 text-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
//                 >
//                   I'm a Student
//                 </button>
//                 <button
//                   onClick={() => handleRoleSelect('Tutor')}
//                   className="p-4 text-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
//                 >
//                   I'm a Tutor
//                 </button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoogleAuthWithRole;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { setUser } from '../../redux/slice';
import { savedAuthData } from '../../utils/Localstorage';
import { toast } from 'react-toastify';
import api from '../../api/axios_api_call';

const RoleSelectionModal = ({ onSelect, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold text-white mb-4">Choose Your Role</h2>
      <p className="text-gray-300 mb-6">Select your role to complete your registration</p>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('STUDENT')}
          className="p-4 text-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
        >
          I'm a Student
        </button>
        <button
          onClick={() => onSelect('TUTOR')}
          className="p-4 text-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          I'm a Tutor
        </button>
      </div>
      
      <button 
        onClick={onCancel}
        className="w-full mt-4 p-2 text-gray-300 hover:text-white text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
);

const GoogleAuth = ({ clientId, requireRole = false }) => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleResponse = (response) => {
    try {
      const token = response.credential;
      const decoded = jwtDecode(token);
      const userName = decoded.name.replace(/\s/g, '_').toLowerCase();

      const userData = {
        google_id: decoded.sub,
        username: userName,
        email: decoded.email,
        first_name: decoded.given_name || decoded.name,
        last_name: decoded.family_name || '',
        token: token
      };

      setGoogleUserData(userData);
      if (requireRole) {
        setShowRoleSelection(true);
      } else {
        handleAuthentication(userData);
      }
    } catch (error) {
      console.error("Error processing Google response:", error);
      toast.error("Failed to process Google authentication");
    }
  };

  const handleRoleSelect = (role) => {
    setShowRoleSelection(false);
    handleAuthentication({...googleUserData, role});
  };

  const handleCancelRoleSelection = () => {
    setShowRoleSelection(false);
    setGoogleUserData(null);
  };

  const handleAuthentication = async (userData) => {
    
    try {
      const response = await api.post('auth-app/login/google-account/', userData);
      const authStatus = response.data['auth-status'];
      const message = response.data.message;
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const user = response.data.user;
      const role = response.data.role;
      const userCode = response.data.user_code;
      
      if (authStatus === 'success' || authStatus === 'created') {
        const authState = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user,
          role,
          user_code: userCode,
          isAuthenticated: true
        };

        savedAuthData(authState);
        dispatch(setUser({ user, role }));

        if (authStatus === 'created') {
          toast.success('Account created successfully');
        } else {
          toast.success('Logged in successfully');
        }

        const roleLocation = role.toLowerCase();
        navigate(`/${roleLocation}/choose-session/`);
      } else if (authStatus === 'role-required') {
        // Show role selection if needed
        setShowRoleSelection(true);
      } else if (authStatus === 'blocked') {
        toast.error('Your account has been blocked. Please contact admin.');
      } else {
        toast.error(message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Failed to authenticate. Please try again later.');
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleGoogleResponse}
          onError={() => toast.error('Google authentication failed')}
          size="large"
          text={requireRole ? "Sign up with Google" : "Sign in with Google"}
          shape="rectangular"
        />
      </GoogleOAuthProvider>

      {showRoleSelection && (
        <RoleSelectionModal 
          onSelect={handleRoleSelect} 
          onCancel={handleCancelRoleSelection}
        />
      )}
    </>
  );
};

export default GoogleAuth;