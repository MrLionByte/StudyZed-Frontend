// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import api from '../api/axios_api_call';
// import { toast,ToastContainer } from 'react-toastify';
// import { savedAuthData } from './Localstorage';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// function GoogleApp() {
//     const [user, setUser] = useState([]);
//     const [profile, setProfile] = useState([]);
//     const [error, setError] = useState(null);
//     const [role, setRole] = useState('');
//     const [showRoleSelector, setShowRoleSelector] = useState(false);
//     const [loading, setLoading] = useState(false)

//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const login = useGoogleLogin({
//         onSuccess: (codeResponse) => {
//             setUser(codeResponse);
//             setInterval(() => {
//                 setLoading(true);
//             }, 1000);
//             getFromGoogleAccount();
//             loginBackend();
//         },
//         onError: () => toast.error('Login Failed. Please try again.'),
//     });

//     const loginBackend = async () => {

//         const user_data = {
//             'google_id': profile?.id,
//             'username': (profile?.name).toLowerCase(),
//             'email': profile?.email,
//             'first_name': profile?.given_name,
//             'token': profile?.access_token,
//             'role' : role,
//         }
//         console.log("USER FDA :" ,user_data);

//         try{
//            const response = await api.post('/auth-app/login/google-account/', user_data)
//            console.log("RESPONSE :", response);

//            const authState = {
//             accessToken: response?.data["access_token"],
//             refreshToken: response?.data["refresh_token"],
//             user: response?.data["user"],
//             role: response?.data['role'],
//             isAuthenticated: true,
//           };
//           console.log(role, response['data']['role']);

//         savedAuthData(authState);
//         console.log("111");
//         dispatch(setUser({user:response.data['user'], role: role}))
//         console.log("222");

//         localStorage.setItem(ACCESS_TOKEN, response.data['access_token']);
//         localStorage.setItem(REFRESH_TOKEN, response.data['refresh_token']);

//         console.log("333");

//         toast.success('LOGIN SUCCESSFUL. Welcome '+ response.data['user']['first_name']);
//         setTimeout(()=>{
//             if (response['data']['role'] == 'Student'){
//                 console.log("444");
//             navigate('/student/choose-session/');
//             }
//             else if (response['data']['role'] == 'Tutor'){
//                 console.log("555");
//                 navigate('/tutor/choose-session/');
//             }
//         }, 2000);
//            toast.success("Created Account, please login from login page")

//         } catch (error) {
//             console.log(error)

//         }
//     };

//     const getFromGoogleAccount = async () => {
//         await axios
//                 .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`, {
//                     headers: {
//                         Authorization: `Bearer ${user.access_token}`,
//                         Accept: 'application/json',
//                     },
//                 })
//                 .then((res) => {
//                     setProfile(res.data)
//                     setShowRoleSelector(true);
//                 })
//                 .catch(() => setError('Failed to fetch profile information.'));
//     }

//     useEffect(() => {
//         if (user && user.access_token) {
//             getFromGoogleAccount();
//         }
//     }, [user]);

//     const logOut = () => {
//         googleLogout();
//         setProfile(null);
//     };

//     const handleRoleSelect = (selectedRole) => {
//         setRole(selectedRole);
//         setShowRoleSelector(false);
//         loginBackend();
//     };

//     return (
//         <>
//         {!loading ?
//         <button
//                     onClick={login}
//                     className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50">
//                 <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
//         </button>
//         :
//         <span className="loading loading-ring loading-lg"></span>
//         }

//         {showRoleSelector && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//                     <div className="bg-white p-4 rounded shadow-md">
//                         <h2 className="text-lg font-semibold text-black">Select Your Role</h2>
//                         <div className="mt-4 flex gap-4">
//                             <button
//                                 onClick={() => handleRoleSelect('Tutor')}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                             >
//                                 Tutor
//                             </button>
//                             <button
//                                 onClick={() => handleRoleSelect('Student')}
//                                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                             >
//                                 Student
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         < ToastContainer autoClose='1000' />
//         </>
//     );
// }

// export default GoogleApp;

import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import api from '../api/axios_api_call';
import { toast, ToastContainer } from 'react-toastify';
import { savedAuthData } from './Localstorage';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/slice.js';

function GoogleApp() {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const userProfile = await getFromGoogleAccount(
          codeResponse.access_token,
        );
        setProfile(userProfile);
        setRole(''); // reset role before showing selector
      } catch (err) {
        toast.error('Login Failed. Please try again.');
        setError(err);
      }
    },
    onError: () => toast.error('Login Failed. Please try again.'),
  });

  const getFromGoogleAccount = async (accessToken) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
      );
      return data;
    } catch (err) {
      throw new Error('Failed to fetch Google profile information');
    }
  };

  const loginBackend = async () => {
    if (!profile || !role) return;

    const user_data = {
      google_id: profile.id,
      username: profile.name.toLowerCase(),
      email: profile.email,
      first_name: profile.given_name,
      token: profile.access_token,
      role: role,
    };

    try {
      const response = await api.post(
        '/auth-app/login/google-account/',
        user_data,
      );
      const { access_token, refresh_token, user } = response.data;
      console.log('G A :', response);
      console.log('G G G G :', access_token, refresh_token, user, role);
      if (response.data['auth-success'] === 'success') {
        const authState = {
          accessToken: access_token,
          refreshToken: refresh_token,
          user,
          role,
          isAuthenticated: true,
        };
        console.log('Z Z Z :', authState);
        savedAuthData(authState);
        console.log('222222', user, role);
        dispatch(setUser({ user, role }));
        console.log('1 1 1 1 1 1');
        console.log('3 3 3 3 3 3 3 ');
        const role_location = role.toLowerCase();
        console.log('4 4 4 4 4 4 4 4', role_location);
        navigate(`/${role_location}/choose-session/`);
      } else if (response.data['auth-status'] === 'blocked') {
        console.log('Z Z Z BLOCK');
      } else {
        console.log('Z Z Z Some error occurred try again.');
      }
    } catch (error) {
      console.error('New Error :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && role) {
      loginBackend();
    }
  }, [profile, role]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setRole('');
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole.toUpperCase());
    console.log(selectedRole);
  };

  return (
    <>
      {!loading ? (
        <button
          onClick={login}
          className="p-2 rounded-full bg-gray-700/30 hover:bg-gray-700/50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
        </button>
      ) : (
        <span className="loading loading-ring loading-lg"></span>
      )}

      {profile && !role && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold text-black">
              Select Your Role
            </h2>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleRoleSelect('Tutor')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tutor
              </button>
              <button
                onClick={() => handleRoleSelect('Student')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose="1000" />
    </>
  );
}

export default GoogleApp;
